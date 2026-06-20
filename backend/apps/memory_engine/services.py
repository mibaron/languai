from __future__ import annotations

from django.db.models import Q, QuerySet
from django.utils import timezone

from apps.knowledge.models import LexicalItem
from apps.memory_engine.constants import SkillType
from apps.memory_engine.fsrs import FSRSCard, FSRSParams, Rating, State, repeat
from apps.memory_engine.models import MemoryState, ReviewLog
from apps.users.models import User


def record_review(
    *,
    user: User,
    item_id: str,
    skill_type: str,
    rating: int,
    response_time_ms: int | None = None,
) -> MemoryState:
    now = timezone.now()
    item = LexicalItem.objects.get(pk=item_id)

    memory_state, created = MemoryState.objects.get_or_create(
        user=user,
        item=item,
        skill_type=skill_type,
        defaults={"state": State.NEW},
    )

    card = FSRSCard(
        difficulty=memory_state.difficulty,
        stability=memory_state.stability,
        reps=memory_state.reps,
        lapses=memory_state.lapses,
        state=State(memory_state.state),
        last_review=memory_state.last_review,
    )

    difficulty_before = card.difficulty
    stability_before = card.stability

    actual_days = 0.0
    if memory_state.last_review:
        actual_days = (now - memory_state.last_review).total_seconds() / 86400

    scheduled_days = 0.0
    if memory_state.next_due and memory_state.last_review:
        scheduled_days = (memory_state.next_due - memory_state.last_review).total_seconds() / 86400

    output = repeat(card, Rating(rating), now, FSRSParams())

    memory_state.difficulty = output.card.difficulty
    memory_state.stability = output.card.stability
    memory_state.reps = output.card.reps
    memory_state.lapses = output.card.lapses
    memory_state.state = output.card.state
    memory_state.last_review = now
    memory_state.next_due = output.next_review
    memory_state.save(
        update_fields=[
            "difficulty",
            "stability",
            "reps",
            "lapses",
            "state",
            "last_review",
            "next_due",
            "updated_at",
        ]
    )

    ReviewLog.objects.create(
        memory_state=memory_state,
        rating=rating,
        response_time_ms=response_time_ms,
        scheduled_days=scheduled_days,
        actual_days=actual_days,
        difficulty_before=difficulty_before,
        stability_before=stability_before,
        difficulty_after=output.card.difficulty,
        stability_after=output.card.stability,
    )

    return memory_state


def get_due_items(
    *,
    user: User,
    pack_ids: list[str] | None = None,
    skill_types: list[str] | None = None,
) -> QuerySet[MemoryState]:
    now = timezone.now()
    qs = MemoryState.objects.filter(
        user=user,
        next_due__lte=now,
    ).select_related("item")

    if pack_ids:
        qs = qs.filter(
            Q(item__packs__id__in=pack_ids)
            | Q(item__page_lexical_items__page__pack_id__in=pack_ids)
        )

    if skill_types:
        qs = qs.filter(skill_type__in=skill_types)

    return qs.order_by("next_due").distinct()


def get_new_items(
    *,
    user: User,
    pack_ids: list[str],
    skill_type: str = SkillType.RECOGNITION,
    exclude_item_ids: list | None = None,
) -> QuerySet[LexicalItem]:
    qs = (
        LexicalItem.objects.filter(
            Q(packs__id__in=pack_ids)
            | Q(page_lexical_items__page__pack_id__in=pack_ids),
            is_active=True,
        )
        .exclude(
            memory_states__user=user,
            memory_states__skill_type=skill_type,
        )
        .order_by("page_lexical_items__order", "pack_items__order")
    )

    if exclude_item_ids:
        qs = qs.exclude(pk__in=exclude_item_ids)

    return qs.distinct()
