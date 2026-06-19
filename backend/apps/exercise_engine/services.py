from __future__ import annotations

import random
from dataclasses import asdict, dataclass

from apps.knowledge.models import LexicalItem
from apps.memory_engine.session import SessionConfig, SessionItem, build_session
from apps.users.models import User

from .constants import ExerciseType

GENDER_ARTICLE = {"m": "der", "f": "die", "n": "das"}


@dataclass
class FlashcardExercise:
    exercise_type: str
    item_id: str
    skill_type: str
    is_new: bool
    front_text: str
    front_hint: str
    back_text: str
    back_extra: str


@dataclass
class MCQChoice:
    id: str
    text: str


@dataclass
class MCQExercise:
    exercise_type: str
    item_id: str
    skill_type: str
    is_new: bool
    prompt_text: str
    prompt_hint: str
    choices: list[MCQChoice]
    correct_choice_id: str


def generate_exercise_session(
    *,
    user: User,
    pack_ids: list[str],
    exercise_type: str,
    max_items: int = 20,
) -> list[FlashcardExercise | MCQExercise]:
    config = SessionConfig(max_items=max_items)
    session_items = build_session(user=user, pack_ids=pack_ids, config=config)

    if not session_items:
        return []

    item_ids = [s.item_id for s in session_items]
    details = _get_item_details(item_ids)

    exercises: list[FlashcardExercise | MCQExercise] = []
    for session_item in session_items:
        item = details.get(session_item.item_id)
        if exercise_type == ExerciseType.FLASHCARD:
            exercises.append(_generate_flashcard(session_item, item))
        elif exercise_type == ExerciseType.MCQ_RECOGNITION:
            ex = _generate_mcq(session_item, item, pack_ids)
            if ex:
                exercises.append(ex)
            else:
                exercises.append(_generate_flashcard(session_item, item))

    return exercises


def _get_item_details(item_ids: list[str]) -> dict[str, LexicalItem]:
    items = (
        LexicalItem.objects.filter(id__in=item_ids)
        .select_related("noun_detail", "verb_detail")
    )
    return {str(item.id): item for item in items}


def _enrich_front_text(item: LexicalItem | None, fallback_text: str) -> str:
    if item is None:
        return fallback_text
    try:
        noun = item.noun_detail
        article = GENDER_ARTICLE.get(noun.gender, "")
        if article:
            text = item.text
            for a in GENDER_ARTICLE.values():
                if text.startswith(f"{a} "):
                    return text
            return f"{article} {text}"
    except LexicalItem.noun_detail.RelatedObjectDoesNotExist:  # type: ignore[attr-defined]
        pass
    return item.text


def _get_front_hint(item: LexicalItem | None, item_type: str) -> str:
    if item and item.part_of_speech:
        return item.part_of_speech
    return item_type


def _get_back_extra(item: LexicalItem | None) -> str:
    if item is None:
        return ""
    try:
        noun = item.noun_detail
        gender_labels = {"m": "masculine", "f": "feminine", "n": "neuter"}
        return gender_labels.get(noun.gender, "")
    except LexicalItem.noun_detail.RelatedObjectDoesNotExist:  # type: ignore[attr-defined]
        pass
    try:
        verb = item.verb_detail
        return verb.conjugation_group or ""
    except LexicalItem.verb_detail.RelatedObjectDoesNotExist:  # type: ignore[attr-defined]
        pass
    return ""


def _generate_flashcard(
    session_item: SessionItem, item: LexicalItem | None
) -> FlashcardExercise:
    return FlashcardExercise(
        exercise_type=ExerciseType.FLASHCARD,
        item_id=session_item.item_id,
        skill_type=session_item.skill_type,
        is_new=session_item.is_new,
        front_text=_enrich_front_text(item, session_item.item_text),
        front_hint=_get_front_hint(item, session_item.item_type),
        back_text=session_item.item_translation,
        back_extra=_get_back_extra(item),
    )


def _generate_mcq(
    session_item: SessionItem,
    item: LexicalItem | None,
    pack_ids: list[str],
) -> MCQExercise | None:
    distractors = list(
        LexicalItem.objects.filter(
            pack_items__pack_id__in=pack_ids,
            type=session_item.item_type,
            is_active=True,
        )
        .exclude(pk=session_item.item_id)
        .distinct()
        .order_by("?")[:3]
    )

    if len(distractors) < 3:
        extra = list(
            LexicalItem.objects.filter(
                pack_items__pack_id__in=pack_ids,
                is_active=True,
            )
            .exclude(pk=session_item.item_id)
            .exclude(pk__in=[d.pk for d in distractors])
            .distinct()
            .order_by("?")[: 3 - len(distractors)]
        )
        distractors.extend(extra)

    if len(distractors) < 2:
        return None

    correct_text = _enrich_front_text(item, session_item.item_text)
    choices = [MCQChoice(id=session_item.item_id, text=correct_text)]
    for d in distractors:
        choices.append(MCQChoice(id=str(d.id), text=_enrich_front_text(d, d.text)))

    random.shuffle(choices)

    return MCQExercise(
        exercise_type=ExerciseType.MCQ_RECOGNITION,
        item_id=session_item.item_id,
        skill_type=session_item.skill_type,
        is_new=session_item.is_new,
        prompt_text=session_item.item_translation,
        prompt_hint="Pick the correct German",
        choices=choices,
        correct_choice_id=session_item.item_id,
    )


def exercise_to_dict(exercise: FlashcardExercise | MCQExercise) -> dict:
    if isinstance(exercise, MCQExercise):
        d = asdict(exercise)
        d["choices"] = [asdict(c) for c in exercise.choices]
        return d
    return asdict(exercise)
