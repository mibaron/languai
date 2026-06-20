from drf_spectacular.utils import PolymorphicProxySerializer, extend_schema_field
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


class ExerciseSessionParamsSerializer(serializers.Serializer):
    exercise_type = serializers.ChoiceField(choices=ExerciseType.choices)
    max_items = serializers.IntegerField(required=False, default=20, min_value=1, max_value=50)


class MCQChoiceSerializer(serializers.Serializer):
    id = serializers.CharField()
    text = serializers.CharField()


class FlashcardExerciseSerializer(serializers.Serializer):
    exercise_type = serializers.CharField()
    item_id = serializers.CharField()
    skill_type = serializers.CharField()
    is_new = serializers.BooleanField()
    front_text = serializers.CharField()
    front_hint = serializers.CharField()
    back_text = serializers.CharField()
    back_extra = serializers.CharField(allow_blank=True)


class MCQExerciseSerializer(serializers.Serializer):
    exercise_type = serializers.CharField()
    item_id = serializers.CharField()
    skill_type = serializers.CharField()
    is_new = serializers.BooleanField()
    prompt_text = serializers.CharField()
    prompt_hint = serializers.CharField()
    choices = MCQChoiceSerializer(many=True)
    correct_choice_id = serializers.CharField()


# --- Stored exercise serializers ---


class StoredFlashcardDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlashcardExerciseModel
        fields = ["front_text", "back_text", "front_context", "back_context"]


class StoredMCQChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MCQChoice
        fields = ["id", "text", "is_correct", "order"]


class StoredMCQDetailSerializer(serializers.ModelSerializer):
    choices = StoredMCQChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = MCQExerciseModel
        fields = ["question", "explanation", "choices"]


class StoredFillBlankDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = FillBlankExercise
        fields = ["text_before", "text_after", "answer", "accept_alternatives", "hint", "explanation"]


class StoredSentenceOrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = SentenceOrderExercise
        fields = ["jumbled_words", "correct_answers", "hint"]


class StoredErrorCorrectionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ErrorCorrectionExercise
        fields = [
            "sentence", "error_start", "error_end",
            "correct_replacement", "corrected_sentence", "explanation",
        ]


class StoredMatchingPairSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchingPair
        fields = ["left", "right", "order"]


class StoredMatchingDetailSerializer(serializers.ModelSerializer):
    pairs = StoredMatchingPairSerializer(many=True, read_only=True)

    class Meta:
        model = MatchingExercise
        fields = ["instruction", "pairs"]


class StoredExerciseSerializer(serializers.ModelSerializer):
    item_id = serializers.UUIDField(source="item.id", read_only=True)
    item_text = serializers.CharField(source="item.text", read_only=True)
    item_translation = serializers.CharField(source="item.translation", read_only=True)
    detail = serializers.SerializerMethodField()

    class Meta:
        model = Exercise
        fields = [
            "id", "exercise_type", "source",
            "item_id", "item_text", "item_translation",
            "detail",
        ]

    @extend_schema_field(
        PolymorphicProxySerializer(
            component_name="StoredExerciseDetail",
            serializers={
                "flashcard": StoredFlashcardDetailSerializer,
                "mcq_recognition": StoredMCQDetailSerializer,
                "fill_blank": StoredFillBlankDetailSerializer,
                "sentence_order": StoredSentenceOrderDetailSerializer,
                "error_correction": StoredErrorCorrectionDetailSerializer,
                "matching": StoredMatchingDetailSerializer,
            },
            resource_type_field_name="exercise_type",
        )
    )
    def get_detail(self, obj: Exercise) -> dict | None:
        type_to_attr = {
            ExerciseType.FLASHCARD: ("flashcard", StoredFlashcardDetailSerializer),
            ExerciseType.MCQ_RECOGNITION: ("mcq", StoredMCQDetailSerializer),
            ExerciseType.FILL_BLANK: ("fill_blank", StoredFillBlankDetailSerializer),
            ExerciseType.SENTENCE_ORDER: ("sentence_order", StoredSentenceOrderDetailSerializer),
            ExerciseType.ERROR_CORRECTION: ("error_correction", StoredErrorCorrectionDetailSerializer),
            ExerciseType.MATCHING: ("matching", StoredMatchingDetailSerializer),
        }
        attr_name, serializer_cls = type_to_attr.get(obj.exercise_type, (None, None))
        if attr_name:
            detail = getattr(obj, attr_name, None)
            if detail:
                return serializer_cls(detail).data
        return None


class StoredExerciseSessionParamsSerializer(serializers.Serializer):
    pack_ids = serializers.ListField(
        child=serializers.UUIDField(), required=False, default=list,
    )
    exercise_type = serializers.ChoiceField(choices=ExerciseType.choices, required=False)
    max_items = serializers.IntegerField(required=False, default=20, min_value=1, max_value=50)
