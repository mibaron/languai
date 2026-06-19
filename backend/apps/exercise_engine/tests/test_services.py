import pytest

from apps.exercise_engine.constants import ExerciseType
from apps.exercise_engine.services import (
    FlashcardExercise,
    MCQExercise,
    generate_exercise_session,
)
from apps.knowledge.constants import LexicalItemType
from apps.knowledge.models import LexicalItem, NounDetail, VerbDetail
from apps.packs.models import PackItem
from apps.packs.services import subscribe_to_pack
from apps.packs.tests.factories import LevelFactory, PackFactory, UserFactory


@pytest.fixture
def level():
    return LevelFactory(code="T1.1")


@pytest.fixture
def pack(level):
    return PackFactory(level=level)


@pytest.fixture
def user():
    return UserFactory()


@pytest.fixture
def subscribed_user(user, pack):
    subscribe_to_pack(user=user, pack_id=str(pack.id))
    return user


def _create_vocab(text, translation, level, pack, order=0, gender=None):
    item = LexicalItem.objects.create(
        text=text,
        translation=translation,
        type=LexicalItemType.VOCAB,
        level=level,
        part_of_speech="noun" if gender else "",
    )
    if gender:
        NounDetail.objects.create(item=item, gender=gender)
    PackItem.objects.create(pack=pack, item=item, order=order)
    return item


def _create_verb(text, translation, level, pack, order=0, conjugation_group=""):
    item = LexicalItem.objects.create(
        text=text,
        translation=translation,
        type=LexicalItemType.VERB,
        level=level,
        part_of_speech="verb",
    )
    VerbDetail.objects.create(item=item, conjugation_group=conjugation_group)
    PackItem.objects.create(pack=pack, item=item, order=order)
    return item


@pytest.mark.django_db
class TestGenerateFlashcard:
    def test_generates_flashcards(self, subscribed_user, pack, level):
        _create_vocab("Tisch", "table", level, pack, order=0, gender="m")
        _create_vocab("Lampe", "lamp", level, pack, order=1, gender="f")

        exercises = generate_exercise_session(
            user=subscribed_user,
            pack_ids=[pack.id],
            exercise_type=ExerciseType.FLASHCARD,
            max_items=5,
        )
        assert len(exercises) == 2
        assert all(isinstance(e, FlashcardExercise) for e in exercises)

    def test_noun_includes_article(self, subscribed_user, pack, level):
        _create_vocab("Tisch", "table", level, pack, gender="m")

        exercises = generate_exercise_session(
            user=subscribed_user,
            pack_ids=[pack.id],
            exercise_type=ExerciseType.FLASHCARD,
        )
        assert exercises[0].front_text == "der Tisch"
        assert exercises[0].back_extra == "masculine"

    def test_noun_preserves_existing_article(self, subscribed_user, pack, level):
        _create_vocab("der Tisch", "table", level, pack, gender="m")

        exercises = generate_exercise_session(
            user=subscribed_user,
            pack_ids=[pack.id],
            exercise_type=ExerciseType.FLASHCARD,
        )
        assert exercises[0].front_text == "der Tisch"

    def test_verb_shows_conjugation_group(self, subscribed_user, pack, level):
        _create_verb("sprechen", "to speak", level, pack, conjugation_group="stem-change e→i")

        exercises = generate_exercise_session(
            user=subscribed_user,
            pack_ids=[pack.id],
            exercise_type=ExerciseType.FLASHCARD,
        )
        assert exercises[0].front_text == "sprechen"
        assert exercises[0].back_extra == "stem-change e→i"
        assert exercises[0].front_hint == "verb"

    def test_empty_pack_returns_empty(self, subscribed_user, pack):
        exercises = generate_exercise_session(
            user=subscribed_user,
            pack_ids=[pack.id],
            exercise_type=ExerciseType.FLASHCARD,
        )
        assert exercises == []

    def test_respects_max_items(self, subscribed_user, pack, level):
        for i in range(10):
            _create_vocab(f"word{i}", f"word{i}_en", level, pack, order=i)

        exercises = generate_exercise_session(
            user=subscribed_user,
            pack_ids=[pack.id],
            exercise_type=ExerciseType.FLASHCARD,
            max_items=3,
        )
        assert len(exercises) <= 3


@pytest.mark.django_db
class TestGenerateMCQ:
    def test_returns_4_choices(self, subscribed_user, pack, level):
        for i in range(5):
            _create_vocab(f"Wort{i}", f"word{i}", level, pack, order=i)

        exercises = generate_exercise_session(
            user=subscribed_user,
            pack_ids=[pack.id],
            exercise_type=ExerciseType.MCQ_RECOGNITION,
            max_items=1,
        )
        assert len(exercises) == 1
        assert isinstance(exercises[0], MCQExercise)
        assert len(exercises[0].choices) == 4

    def test_correct_choice_in_choices(self, subscribed_user, pack, level):
        for i in range(5):
            _create_vocab(f"Wort{i}", f"word{i}", level, pack, order=i)

        exercises = generate_exercise_session(
            user=subscribed_user,
            pack_ids=[pack.id],
            exercise_type=ExerciseType.MCQ_RECOGNITION,
            max_items=1,
        )
        ex = exercises[0]
        choice_ids = [c.id for c in ex.choices]
        assert ex.correct_choice_id in choice_ids

    def test_distractors_are_different_items(self, subscribed_user, pack, level):
        for i in range(5):
            _create_vocab(f"Wort{i}", f"word{i}", level, pack, order=i)

        exercises = generate_exercise_session(
            user=subscribed_user,
            pack_ids=[pack.id],
            exercise_type=ExerciseType.MCQ_RECOGNITION,
            max_items=1,
        )
        choice_ids = [c.id for c in exercises[0].choices]
        assert len(set(choice_ids)) == len(choice_ids)

    def test_falls_back_to_flashcard_with_too_few_items(self, subscribed_user, pack, level):
        _create_vocab("Hund", "dog", level, pack)

        exercises = generate_exercise_session(
            user=subscribed_user,
            pack_ids=[pack.id],
            exercise_type=ExerciseType.MCQ_RECOGNITION,
        )
        assert len(exercises) == 1
        assert isinstance(exercises[0], FlashcardExercise)

    def test_prompt_shows_translation(self, subscribed_user, pack, level):
        for i in range(5):
            _create_vocab(f"Wort{i}", f"word{i}", level, pack, order=i)

        exercises = generate_exercise_session(
            user=subscribed_user,
            pack_ids=[pack.id],
            exercise_type=ExerciseType.MCQ_RECOGNITION,
            max_items=1,
        )
        assert exercises[0].prompt_text.startswith("word")

    def test_mcq_with_mixed_types(self, subscribed_user, pack, level):
        _create_vocab("Hund", "dog", level, pack, order=0, gender="m")
        _create_vocab("Katze", "cat", level, pack, order=1, gender="f")
        _create_verb("laufen", "to run", level, pack, order=2)
        _create_verb("gehen", "to go", level, pack, order=3)

        exercises = generate_exercise_session(
            user=subscribed_user,
            pack_ids=[pack.id],
            exercise_type=ExerciseType.MCQ_RECOGNITION,
            max_items=1,
        )
        assert len(exercises) == 1
        assert len(exercises[0].choices) >= 3
