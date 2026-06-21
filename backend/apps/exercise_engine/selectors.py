from django.db.models import QuerySet

from .models import Exercise


def get_exercises_for_pack(
    *,
    pack_ids: list[str],
    exercise_type: str | None = None,
    limit: int = 20,
) -> QuerySet[Exercise]:
    qs = Exercise.objects.filter(
        pack_id__in=pack_ids,
        is_active=True,
    ).select_related("item")

    if exercise_type:
        qs = qs.filter(exercise_type=exercise_type)

    qs = _prefetch_details(qs).order_by("?")
    return qs[:limit]


def get_exercises_for_items(
    *,
    item_ids: list[str],
    pack_id: str | None = None,
    exercise_type: str | None = None,
) -> QuerySet[Exercise]:
    qs = Exercise.objects.filter(
        item_id__in=item_ids,
        is_active=True,
    ).select_related("item")

    if pack_id:
        qs = qs.filter(pack_id=pack_id)
    if exercise_type:
        qs = qs.filter(exercise_type=exercise_type)

    qs = _prefetch_details(qs)
    return qs


def _prefetch_details(qs: QuerySet[Exercise]) -> QuerySet[Exercise]:
    return qs.prefetch_related(
        "flashcard",
        "mcq__choices",
        "fill_blank",
        "sentence_order",
        "error_correction",
        "matching__pairs",
    )
