import pytest
from django.db import IntegrityError

from apps.exercise_engine.constants import ExerciseSource, ExerciseType

from .factories import (
    ErrorCorrectionExerciseFactory,
    ExerciseFactory,
    FillBlankExerciseFactory,
    FlashcardExerciseFactory,
    MatchingExerciseFactory,
    MatchingPairFactory,
    MCQChoiceFactory,
    MCQExerciseFactory,
    SentenceOrderExerciseFactory,
)


@pytest.mark.django_db
class TestExercise:
    def test_create_exercise(self):
        ex = ExerciseFactory(
            exercise_type=ExerciseType.FLASHCARD,
            source=ExerciseSource.ENGINE,
        )
        assert ex.exercise_type == ExerciseType.FLASHCARD
        assert ex.source == ExerciseSource.ENGINE
        assert ex.is_active is True
        assert ex.pack is not None
        assert ex.item is not None

    def test_exercise_with_page(self):
        from apps.content.tests.factories import PageFactory
        page = PageFactory()
        ex = ExerciseFactory(pack=page.pack, page=page)
        assert ex.page == page

    def test_exercise_without_page(self):
        ex = ExerciseFactory(page=None)
        assert ex.page is None

    def test_exercise_sources(self):
        for source in [ExerciseSource.CREATOR, ExerciseSource.ENGINE, ExerciseSource.AI]:
            ex = ExerciseFactory(source=source)
            assert ex.source == source

    def test_str(self):
        ex = ExerciseFactory()
        assert ex.item.text in str(ex)


@pytest.mark.django_db
class TestFlashcardExercise:
    def test_create(self):
        fc = FlashcardExerciseFactory(front_text="der Hund", back_text="the dog")
        assert fc.front_text == "der Hund"
        assert fc.back_text == "the dog"
        assert fc.exercise.exercise_type == ExerciseType.FLASHCARD

    def test_one_to_one_constraint(self):
        fc = FlashcardExerciseFactory()
        with pytest.raises(IntegrityError):
            FlashcardExerciseFactory(exercise=fc.exercise)


@pytest.mark.django_db
class TestMCQExercise:
    def test_create_with_choices(self):
        mcq = MCQExerciseFactory(question="What does 'Hund' mean?")
        MCQChoiceFactory(mcq=mcq, text="dog", is_correct=True, order=0)
        MCQChoiceFactory(mcq=mcq, text="cat", is_correct=False, order=1)
        MCQChoiceFactory(mcq=mcq, text="bird", is_correct=False, order=2)
        assert mcq.choices.count() == 3
        assert mcq.choices.filter(is_correct=True).count() == 1

    def test_unique_choice_order(self):
        mcq = MCQExerciseFactory()
        MCQChoiceFactory(mcq=mcq, order=0)
        with pytest.raises(IntegrityError):
            MCQChoiceFactory(mcq=mcq, order=0)

    def test_choices_ordered(self):
        mcq = MCQExerciseFactory()
        c2 = MCQChoiceFactory(mcq=mcq, text="C", order=2)
        c0 = MCQChoiceFactory(mcq=mcq, text="A", order=0)
        c1 = MCQChoiceFactory(mcq=mcq, text="B", order=1)
        choices = list(mcq.choices.all())
        assert choices == [c0, c1, c2]


@pytest.mark.django_db
class TestFillBlankExercise:
    def test_create(self):
        fb = FillBlankExerciseFactory(
            text_before="Ich", text_after="Anna.",
            answer="heiße", accept_alternatives=["heisse"],
            hint="Verb for 'am called'",
        )
        assert fb.answer == "heiße"
        assert fb.accept_alternatives == ["heisse"]

    def test_defaults(self):
        fb = FillBlankExerciseFactory()
        assert fb.accept_alternatives == []
        assert fb.hint == ""
        assert fb.explanation == ""


@pytest.mark.django_db
class TestSentenceOrderExercise:
    def test_create(self):
        so = SentenceOrderExerciseFactory(
            jumbled_words=["gehe", "ich", "Supermarkt", "zum"],
            correct_answers=[
                ["Ich", "gehe", "zum", "Supermarkt"],
                ["Zum", "Supermarkt", "gehe", "ich"],
            ],
        )
        assert len(so.correct_answers) == 2

    def test_hint(self):
        so = SentenceOrderExerciseFactory(hint="Verb in second position")
        assert so.hint == "Verb in second position"


@pytest.mark.django_db
class TestErrorCorrectionExercise:
    def test_create(self):
        ec = ErrorCorrectionExerciseFactory(
            sentence="Ich sehe der Mann",
            error_start=9, error_end=12,
            correct_replacement="den",
            corrected_sentence="Ich sehe den Mann",
        )
        assert ec.sentence[ec.error_start:ec.error_end] == "der"
        assert ec.correct_replacement == "den"

    def test_explanation(self):
        ec = ErrorCorrectionExerciseFactory(
            explanation="Akkusativ requires 'den' for masculine nouns"
        )
        assert "Akkusativ" in ec.explanation


@pytest.mark.django_db
class TestMatchingExercise:
    def test_create_with_pairs(self):
        m = MatchingExerciseFactory(instruction="Match pronouns")
        MatchingPairFactory(matching=m, left="ich", right="mir", order=0)
        MatchingPairFactory(matching=m, left="du", right="dir", order=1)
        MatchingPairFactory(matching=m, left="er", right="ihm", order=2)
        assert m.pairs.count() == 3

    def test_unique_pair_order(self):
        m = MatchingExerciseFactory()
        MatchingPairFactory(matching=m, order=0)
        with pytest.raises(IntegrityError):
            MatchingPairFactory(matching=m, order=0)

    def test_pairs_ordered(self):
        m = MatchingExerciseFactory()
        p2 = MatchingPairFactory(matching=m, left="er", order=2)
        p0 = MatchingPairFactory(matching=m, left="ich", order=0)
        p1 = MatchingPairFactory(matching=m, left="du", order=1)
        pairs = list(m.pairs.all())
        assert pairs == [p0, p1, p2]

    def test_str(self):
        p = MatchingPairFactory(left="ich", right="mir")
        assert "ich" in str(p)
        assert "mir" in str(p)
