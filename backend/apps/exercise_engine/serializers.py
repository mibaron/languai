from rest_framework import serializers

from .constants import ExerciseType


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
