from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from .constants import ExerciseType
from .models import (
    ErrorCorrectionExercise,
    Exercise,
    FillBlankExercise,
    MatchingExercise,
    MatchingPair,
    MCQChoice,
    SentenceOrderExercise,
)
from .models import (
    FlashcardExercise as FlashcardExerciseModel,
)
from .models import (
    MCQExercise as MCQExerciseModel,
)


# --- Shared sub-serializers ---


class MCQChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MCQChoice
        fields = ["id", "text", "is_correct", "order"]


class MatchingPairSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchingPair
        fields = ["left", "right", "order"]


# --- Flat exercise serializers (one per type, all fields at top level) ---


class _ExerciseBase(serializers.ModelSerializer):
    item_id = serializers.UUIDField(source="item.id", read_only=True)
    item_text = serializers.CharField(source="item.text", read_only=True)
    item_translation = serializers.CharField(source="item.translation", read_only=True)

    class Meta:
        model = Exercise
        fields = [
            "id", "exercise_type",
            "item_id", "item_text", "item_translation",
        ]


class FlashcardExerciseSerializer(_ExerciseBase):
    front_text = serializers.CharField(source="flashcard.front_text")
    back_text = serializers.CharField(source="flashcard.back_text")
    front_context = serializers.CharField(source="flashcard.front_context", default="")
    back_context = serializers.CharField(source="flashcard.back_context", default="")

    class Meta(_ExerciseBase.Meta):
        fields = [
            *_ExerciseBase.Meta.fields,
            "front_text", "back_text", "front_context", "back_context",
        ]


class MCQExerciseSerializer(_ExerciseBase):
    question = serializers.CharField(source="mcq.question")
    explanation = serializers.CharField(source="mcq.explanation", default="")
    choices = MCQChoiceSerializer(source="mcq.choices", many=True, read_only=True)
    correct_choice_id = serializers.SerializerMethodField()

    class Meta(_ExerciseBase.Meta):
        fields = [
            *_ExerciseBase.Meta.fields,
            "question", "explanation", "choices", "correct_choice_id",
        ]

    def get_correct_choice_id(self, obj: Exercise) -> str:
        correct = obj.mcq.choices.filter(is_correct=True).first()
        return str(correct.id) if correct else ""


class FillBlankExerciseSerializer(_ExerciseBase):
    text_before = serializers.CharField(source="fill_blank.text_before")
    text_after = serializers.CharField(source="fill_blank.text_after")
    answer = serializers.CharField(source="fill_blank.answer")
    accept_alternatives = serializers.ListField(
        child=serializers.CharField(),
        source="fill_blank.accept_alternatives",
    )
    hint = serializers.CharField(source="fill_blank.hint", default="")
    explanation = serializers.CharField(source="fill_blank.explanation", default="")

    class Meta(_ExerciseBase.Meta):
        fields = [
            *_ExerciseBase.Meta.fields,
            "text_before", "text_after", "answer",
            "accept_alternatives", "hint", "explanation",
        ]


class SentenceOrderExerciseSerializer(_ExerciseBase):
    jumbled_words = serializers.ListField(
        child=serializers.CharField(),
        source="sentence_order.jumbled_words",
    )
    correct_answers = serializers.ListField(
        child=serializers.ListField(child=serializers.CharField()),
        source="sentence_order.correct_answers",
    )
    hint = serializers.CharField(source="sentence_order.hint", default="")

    class Meta(_ExerciseBase.Meta):
        fields = [
            *_ExerciseBase.Meta.fields,
            "jumbled_words", "correct_answers", "hint",
        ]


class ErrorCorrectionExerciseSerializer(_ExerciseBase):
    sentence = serializers.CharField(source="error_correction.sentence")
    error_start = serializers.IntegerField(source="error_correction.error_start")
    error_end = serializers.IntegerField(source="error_correction.error_end")
    correct_replacement = serializers.CharField(source="error_correction.correct_replacement")
    corrected_sentence = serializers.CharField(source="error_correction.corrected_sentence")
    explanation = serializers.CharField(source="error_correction.explanation", default="")

    class Meta(_ExerciseBase.Meta):
        fields = [
            *_ExerciseBase.Meta.fields,
            "sentence", "error_start", "error_end",
            "correct_replacement", "corrected_sentence", "explanation",
        ]


class MatchingExerciseSerializer(_ExerciseBase):
    instruction = serializers.CharField(source="matching.instruction", default="")
    pairs = MatchingPairSerializer(source="matching.pairs", many=True, read_only=True)

    class Meta(_ExerciseBase.Meta):
        fields = [
            *_ExerciseBase.Meta.fields,
            "instruction", "pairs",
        ]


EXERCISE_TYPE_SERIALIZER = {
    ExerciseType.FLASHCARD: FlashcardExerciseSerializer,
    ExerciseType.MCQ_RECOGNITION: MCQExerciseSerializer,
    ExerciseType.FILL_BLANK: FillBlankExerciseSerializer,
    ExerciseType.SENTENCE_ORDER: SentenceOrderExerciseSerializer,
    ExerciseType.ERROR_CORRECTION: ErrorCorrectionExerciseSerializer,
    ExerciseType.MATCHING: MatchingExerciseSerializer,
}


def serialize_exercise(exercise: Exercise) -> dict:
    serializer_cls = EXERCISE_TYPE_SERIALIZER.get(exercise.exercise_type)
    if serializer_cls:
        return serializer_cls(exercise).data
    return {}


# --- Request params ---


class ExerciseSessionParamsSerializer(serializers.Serializer):
    exercise_type = serializers.ChoiceField(choices=ExerciseType.choices, required=False)
    max_items = serializers.IntegerField(required=False, default=20, min_value=1, max_value=50)
