from __future__ import annotations

import json
import re
from io import StringIO
from typing import IO

from django.db import transaction

from apps.content.models import (
    ContentImport,
    ConversationLine,
    ConversationPart,
    FillBlankPart,
    ImportStatus,
    Level,
    Page,
    PageLexicalItem,
    PagePart,
    PagePartType,
    TeachingNotePart,
)
from apps.exercise_engine.constants import ExerciseSource, ExerciseType
from apps.exercise_engine.models import (
    ErrorCorrectionExercise,
    Exercise,
    FillBlankExercise,
    FlashcardExercise,
    MatchingExercise,
    MatchingPair,
    MCQChoice,
    MCQExercise,
    SentenceOrderExercise,
)
from apps.knowledge.constants import (
    AuxiliaryVerb,
    FormalityLevel,
    LexicalItemType,
    PartOfSpeech,
)
from apps.knowledge.models import (
    GrammarRuleDetail,
    LexicalItem,
    NounDetail,
    PhraseDetail,
    VerbDetail,
)
from apps.packs.models import Pack

# ------------------------------------------------------------------ #
# Public API
# ------------------------------------------------------------------ #


def delete_pack_and_all_content(pack: Pack) -> dict[str, int]:
    from apps.memory_engine.models import MemoryState
    from apps.progress.models import UserPageProgress

    item_ids = list(
        PageLexicalItem.objects.filter(page__pack=pack).values_list("item_id", flat=True)
    )
    exercise_item_ids = list(
        Exercise.objects.filter(pack=pack).values_list("item_id", flat=True)
    )
    all_item_ids = list(set(item_ids + exercise_item_ids))

    with transaction.atomic():
        memory_deleted, _ = MemoryState.objects.filter(item_id__in=all_item_ids).delete()
        progress_deleted, _ = UserPageProgress.objects.filter(page__pack=pack).delete()
        exercise_count = Exercise.objects.filter(pack=pack).count()
        page_count = Page.objects.filter(pack=pack).count()
        pack.delete()
        item_deleted, _ = LexicalItem.objects.filter(id__in=all_item_ids).delete()

    return {
        "pack": 1,
        "pages": page_count,
        "exercises": exercise_count,
        "lexical_items": item_deleted,
        "memory_states": memory_deleted,
        "page_progress": progress_deleted,
    }


def run_content_import(content_import: ContentImport, *, clean: bool = False) -> None:
    log = StringIO()

    content_import.status = ImportStatus.PROCESSING
    content_import.result_log = ""
    content_import.save(update_fields=["status", "result_log"])

    try:
        _do_import(content_import, log, clean=clean)
        content_import.status = ImportStatus.COMPLETED
    except Exception as exc:
        log.write(f"\n\nFATAL ERROR: {exc}\n")
        content_import.status = ImportStatus.FAILED
        raise
    finally:
        content_import.result_log = log.getvalue()
        content_import.save()


# ------------------------------------------------------------------ #
# Internal
# ------------------------------------------------------------------ #


def _do_import(ci: ContentImport, log: IO[str], *, clean: bool) -> None:
    topics_data = _read_json(ci.topics_file)
    pages_data = _read_json(ci.pages_file)
    exercises_data = _read_json(ci.exercises_file) if ci.exercises_file else []

    level = _get_or_create_level(ci.level_code, log)
    pack = _get_or_create_pack(ci.pack_slug, level, log)

    with transaction.atomic():
        if clean:
            _clean(pack, level, log)

        log.write("\n--- Phase 1: Lexical items ---\n")
        item_index = _import_lexical_items(topics_data, level, log)
        ci.items_created = len(item_index)

        log.write("\n--- Phase 2: Teaching pages ---\n")
        page_index = _import_pages(pages_data, topics_data, pack, item_index, log)
        ci.pages_created = len(page_index)

        if exercises_data:
            log.write("\n--- Phase 3: Exercises ---\n")
            ci.exercises_created = _import_exercises(exercises_data, pack, item_index, page_index, log)
        else:
            log.write("\n--- Phase 3: Skipped (no exercises file) ---\n")

    _write_summary(pack, level, log)


def _read_json(file_field) -> list:
    file_field.seek(0)
    return json.load(file_field)


def _get_or_create_level(code: str, log: IO[str]) -> Level:
    level, created = Level.objects.get_or_create(
        code=code,
        defaults={"name": f"{code} — Beginner", "order": 0},
    )
    log.write(f"Level: {level} ({'created' if created else 'exists'})\n")
    return level


def _get_or_create_pack(slug: str, level: Level, log: IO[str]) -> Pack:
    pack, created = Pack.objects.get_or_create(
        slug=slug,
        defaults={
            "title": f"{level.code} Complete Course",
            "level": level,
            "base_language": "en",
            "description": f"Complete {level.code} German course",
        },
    )
    log.write(f"Pack: {pack} ({'created' if created else 'exists'})\n")
    return pack


def _clean(pack: Pack, level: Level, log: IO[str]) -> None:
    page_count = Page.objects.filter(pack=pack).count()
    exercise_count = Exercise.objects.filter(pack=pack).count()
    item_count = LexicalItem.objects.filter(level=level).count()
    Page.objects.filter(pack=pack).delete()
    Exercise.objects.filter(pack=pack).delete()
    LexicalItem.objects.filter(level=level).delete()
    log.write(f"Cleaned: {page_count} pages, {exercise_count} exercises, {item_count} items\n")


# ------------------------------------------------------------------ #
# Phase 1: Lexical Items
# ------------------------------------------------------------------ #


def _import_lexical_items(
    topics: list[dict], level: Level, log: IO[str]
) -> dict[str, LexicalItem]:
    item_index: dict[str, LexicalItem] = {}
    created_count = 0
    skipped_count = 0

    for topic in topics:
        for li in topic.get("lexical_items", []):
            text = li["text"]
            item_type = _lexical_type(li.get("type", "vocab"))

            if text in item_index:
                skipped_count += 1
                continue

            existing = LexicalItem.objects.filter(text=text, type=item_type, level=level).first()
            if existing:
                item_index[text] = existing
                skipped_count += 1
                continue

            item = LexicalItem.objects.create(
                text=text,
                translation=li.get("translation", ""),
                type=item_type,
                level=level,
                part_of_speech=_pos_from_item(li),
                tags=[topic.get("category", "")],
            )
            item_index[text] = item
            created_count += 1
            _create_item_detail(item, li)

    log.write(f"Lexical items: {created_count} created, {skipped_count} skipped\n")
    return item_index


def _create_item_detail(item: LexicalItem, li: dict) -> None:
    item_type = li.get("type", "")

    if item_type == "verb":
        VerbDetail.objects.create(
            item=item,
            auxiliary_verb=_aux_verb(li.get("auxiliary_verb", "")),
            separable_prefix=li.get("separable_prefix", ""),
            conjugation_group=li.get("conjugation_group", ""),
        )
    elif li.get("gender"):
        NounDetail.objects.create(
            item=item,
            gender=li["gender"],
            plural=li.get("plural_form", ""),
        )
    elif item_type == "phrase":
        PhraseDetail.objects.create(
            item=item,
            formality_level=_formality(li.get("formality_level", "neutral")),
            context=li.get("context", ""),
        )
    elif item_type == "grammar_rule":
        GrammarRuleDetail.objects.create(
            item=item,
            description=li.get("translation", ""),
            pattern=li.get("pattern", ""),
        )


# ------------------------------------------------------------------ #
# Phase 2: Pages
# ------------------------------------------------------------------ #


def _import_pages(
    pages_data: list[dict],
    topics_data: list[dict],
    pack: Pack,
    item_index: dict[str, LexicalItem],
    log: IO[str],
) -> dict[str, Page]:
    topics_by_title: dict[str, dict] = {t["title"]: t for t in topics_data}
    page_index: dict[str, Page] = {}

    for order, page_data in enumerate(pages_data):
        title = page_data["title"]
        page = Page.objects.create(
            pack=pack,
            title=title,
            description=page_data.get("description", ""),
            order=order,
        )
        page_index[title] = page
        log.write(f"  Page {order}: {title}\n")

        for part_data in page_data.get("parts", []):
            _create_page_part(page, part_data)

        topic = topics_by_title.get(title, {})
        linked = 0
        for li in topic.get("lexical_items", []):
            item = item_index.get(li["text"])
            if item:
                PageLexicalItem.objects.get_or_create(
                    page=page, item=item, defaults={"order": linked}
                )
                linked += 1

    log.write(f"Pages: {len(page_index)} created\n")
    return page_index


def _create_page_part(page: Page, part_data: dict) -> None:
    part_type = part_data.get("type", "")
    order = part_data.get("order", 0)

    if part_type == "teaching_note":
        pp = PagePart.objects.create(page=page, part_type=PagePartType.NOTE, order=order)
        TeachingNotePart.objects.create(page_part=pp, content=part_data.get("content", ""))

    elif part_type == "conversation":
        pp = PagePart.objects.create(page=page, part_type=PagePartType.CONVERSATION, order=order)
        conv = ConversationPart.objects.create(page_part=pp, context=part_data.get("context", ""))
        for i, line in enumerate(part_data.get("lines", [])):
            speaker, text = _parse_conversation_line(line)
            ConversationLine.objects.create(
                conversation=conv,
                order=i,
                speaker=speaker,
                text=text,
                translation="",
                is_blank=False,
                blank_answer="",
            )

    elif part_type == "fill_blank":
        pp = PagePart.objects.create(page=page, part_type=PagePartType.FILL_BLANK, order=order)
        FillBlankPart.objects.create(
            page_part=pp,
            text_before=part_data.get("text_before", ""),
            text_after=part_data.get("text_after", ""),
            answer=part_data.get("answer", ""),
            hint=part_data.get("hint", ""),
        )


# ------------------------------------------------------------------ #
# Phase 3: Exercises
# ------------------------------------------------------------------ #


def _import_exercises(
    exercises_data: list[dict],
    pack: Pack,
    item_index: dict[str, LexicalItem],
    page_index: dict[str, Page],
    log: IO[str],
) -> int:
    created = 0
    skipped = 0

    for topic_block in exercises_data:
        topic_title = topic_block.get("topic_title", "")
        page = page_index.get(topic_title)

        for ex_data in topic_block.get("exercises", []):
            item_text = ex_data.get("item_text", "")
            item = item_index.get(item_text) or _find_closest_item(item_text, item_index)

            if not item:
                skipped += 1
                continue

            ex_type = _map_exercise_type(ex_data.get("exercise_type", ""))
            if not ex_type:
                skipped += 1
                continue

            exercise = Exercise.objects.create(
                pack=pack,
                item=item,
                page=page,
                exercise_type=ex_type,
                source=ExerciseSource.CREATOR,
            )
            _create_exercise_detail(exercise, ex_data)
            created += 1

    log.write(f"Exercises: {created} created, {skipped} skipped (item not found)\n")
    return created


def _create_exercise_detail(exercise: Exercise, data: dict) -> None:
    ex_type = data.get("exercise_type", "")

    if ex_type == "flashcard":
        FlashcardExercise.objects.create(
            exercise=exercise,
            front_text=data.get("front_text", ""),
            back_text=data.get("back_text", ""),
            front_context=data.get("front_context", ""),
            back_context=data.get("back_context", ""),
        )

    elif ex_type in ("mcq", "mcq_recognition"):
        mcq = MCQExercise.objects.create(
            exercise=exercise,
            question=data.get("question", ""),
            explanation=data.get("explanation", ""),
        )
        for i, choice in enumerate(data.get("choices", [])):
            MCQChoice.objects.create(
                mcq=mcq,
                text=choice.get("text", ""),
                is_correct=choice.get("is_correct", False),
                order=i,
            )

    elif ex_type == "fill_blank":
        FillBlankExercise.objects.create(
            exercise=exercise,
            text_before=data.get("text_before", ""),
            text_after=data.get("text_after", ""),
            answer=data.get("answer", ""),
            accept_alternatives=data.get("accept_alternatives", []),
            hint=data.get("hint", ""),
            explanation=data.get("explanation", ""),
        )

    elif ex_type == "sentence_order":
        SentenceOrderExercise.objects.create(
            exercise=exercise,
            jumbled_words=data.get("jumbled_words", []),
            correct_answers=data.get("correct_answers", []),
            hint=data.get("hint", ""),
        )

    elif ex_type == "error_correction":
        ErrorCorrectionExercise.objects.create(
            exercise=exercise,
            sentence=data.get("sentence", ""),
            error_start=data.get("error_start", 0),
            error_end=data.get("error_end", 0),
            correct_replacement=data.get("correct_replacement", ""),
            corrected_sentence=data.get("corrected_sentence", ""),
            explanation=data.get("explanation", ""),
        )

    elif ex_type == "matching":
        matching = MatchingExercise.objects.create(
            exercise=exercise,
            instruction=data.get("instruction", ""),
        )
        for i, pair in enumerate(data.get("pairs", [])):
            MatchingPair.objects.create(
                matching=matching,
                left=pair.get("left", ""),
                right=pair.get("right", ""),
                order=i,
            )


# ------------------------------------------------------------------ #
# Helpers
# ------------------------------------------------------------------ #


def _pos_from_item(item: dict) -> str:
    if item.get("type") == "verb":
        return PartOfSpeech.VERB
    if item.get("gender"):
        return PartOfSpeech.NOUN
    return ""


def _lexical_type(item_type: str) -> str:
    mapping = {
        "vocab": LexicalItemType.VOCAB,
        "verb": LexicalItemType.VERB,
        "phrase": LexicalItemType.PHRASE,
        "grammar_rule": LexicalItemType.GRAMMAR_RULE,
    }
    return mapping.get(item_type, LexicalItemType.VOCAB)


def _aux_verb(val: str) -> str:
    if val == "haben":
        return AuxiliaryVerb.HABEN
    if val == "sein":
        return AuxiliaryVerb.SEIN
    return ""


def _formality(val: str) -> str:
    mapping = {
        "formal": FormalityLevel.FORMAL,
        "neutral": FormalityLevel.NEUTRAL,
        "informal": FormalityLevel.INFORMAL,
        "colloquial": FormalityLevel.COLLOQUIAL,
    }
    return mapping.get(val, FormalityLevel.NEUTRAL)


def _parse_conversation_line(line: str) -> tuple[str, str]:
    match = re.match(r"^([^:]+):\s*(.+)$", line)
    if match:
        return match.group(1).strip(), match.group(2).strip()
    return "", line.strip()


def _write_summary(pack: Pack, level: Level, log: IO[str]) -> None:
    items = LexicalItem.objects.filter(level=level).count()
    pages = Page.objects.filter(pack=pack).count()
    parts = PagePart.objects.filter(page__pack=pack).count()
    links = PageLexicalItem.objects.filter(page__pack=pack).count()
    exercises = Exercise.objects.filter(pack=pack).count()
    log.write(
        f"\nSummary:"
        f"\n  {items} lexical items"
        f"\n  {pages} pages with {parts} parts"
        f"\n  {links} page-item links"
        f"\n  {exercises} exercises\n"
    )


def _find_closest_item(text: str, item_index: dict[str, LexicalItem]) -> LexicalItem | None:
    for key, item in item_index.items():
        if key in text or text in key:
            return item
    return None


def _map_exercise_type(raw_type: str) -> str:
    mapping = {
        "flashcard": ExerciseType.FLASHCARD,
        "mcq": ExerciseType.MCQ_RECOGNITION,
        "mcq_recognition": ExerciseType.MCQ_RECOGNITION,
        "fill_blank": ExerciseType.FILL_BLANK,
        "sentence_order": ExerciseType.SENTENCE_ORDER,
        "error_correction": ExerciseType.ERROR_CORRECTION,
        "matching": ExerciseType.MATCHING,
    }
    return mapping.get(raw_type, "")
