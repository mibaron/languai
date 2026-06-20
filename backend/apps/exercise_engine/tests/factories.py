import factory

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
from apps.knowledge.tests.factories import LexicalItemFactory
from apps.packs.tests.factories import PackFactory


class ExerciseFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Exercise

    pack = factory.SubFactory(PackFactory)
    item = factory.SubFactory(LexicalItemFactory)
    exercise_type = ExerciseType.FLASHCARD
    source = ExerciseSource.ENGINE


class FlashcardExerciseFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = FlashcardExercise

    exercise = factory.SubFactory(ExerciseFactory, exercise_type=ExerciseType.FLASHCARD)
    front_text = "der Hund"
    back_text = "the dog"


class MCQExerciseFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MCQExercise

    exercise = factory.SubFactory(ExerciseFactory, exercise_type=ExerciseType.MCQ_RECOGNITION)
    question = "What does 'Hund' mean?"


class MCQChoiceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MCQChoice

    mcq = factory.SubFactory(MCQExerciseFactory)
    text = factory.Sequence(lambda n: f"Choice {n}")
    is_correct = False
    order = factory.Sequence(lambda n: n)


class FillBlankExerciseFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = FillBlankExercise

    exercise = factory.SubFactory(ExerciseFactory, exercise_type=ExerciseType.FILL_BLANK)
    text_before = "Ich"
    text_after = "Anna."
    answer = "heiße"


class SentenceOrderExerciseFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SentenceOrderExercise

    exercise = factory.SubFactory(ExerciseFactory, exercise_type=ExerciseType.SENTENCE_ORDER)
    jumbled_words = ["heißen", "Sie", "wie"]
    correct_answers = [["Wie", "heißen", "Sie"]]


class ErrorCorrectionExerciseFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ErrorCorrectionExercise

    exercise = factory.SubFactory(ExerciseFactory, exercise_type=ExerciseType.ERROR_CORRECTION)
    sentence = "Ich sehe der Mann"
    error_start = 9
    error_end = 12
    correct_replacement = "den"
    corrected_sentence = "Ich sehe den Mann"


class MatchingExerciseFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MatchingExercise

    exercise = factory.SubFactory(ExerciseFactory, exercise_type=ExerciseType.MATCHING)
    instruction = "Match the pronoun to its dative form"


class MatchingPairFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MatchingPair

    matching = factory.SubFactory(MatchingExerciseFactory)
    left = "ich"
    right = "mir"
    order = factory.Sequence(lambda n: n)
