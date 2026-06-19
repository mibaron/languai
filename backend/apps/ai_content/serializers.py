from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.content.models import Category

from .models import ActionType, AIContent, LLMModel, UserAIContent


class AIItemContentRequestSerializer(serializers.Serializer):
    level_code = serializers.CharField(max_length=10)
    category = serializers.CharField(max_length=20)
    section_title = serializers.CharField(max_length=255)
    item_cells = serializers.ListField(child=serializers.CharField(), min_length=1)


class AIGenerateRequestSerializer(serializers.Serializer):
    level_code = serializers.CharField(max_length=10)
    category = serializers.ChoiceField(choices=Category.choices)
    section_title = serializers.CharField(max_length=255)
    section_headers = serializers.ListField(
        child=serializers.CharField(), required=False, default=list
    )
    item_cells = serializers.ListField(child=serializers.CharField(), min_length=1)
    action_type = serializers.ChoiceField(choices=ActionType.choices)
    model = serializers.CharField(max_length=100, required=False, default=None)
    save_as_default = serializers.BooleanField(required=False, default=False)
    regenerate = serializers.BooleanField(required=False, default=False)


class AIContentSerializer(serializers.ModelSerializer):
    item_cells = serializers.ListField(child=serializers.CharField(), read_only=True)
    section_headers = serializers.ListField(child=serializers.CharField(), read_only=True)
    response_json = serializers.JSONField(read_only=True)
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = AIContent
        fields = [
            "id",
            "action_type",
            "level_code",
            "category",
            "section_title",
            "item_cells",
            "section_headers",
            "response_text",
            "response_json",
            "model_used",
            "is_saved",
            "created_at",
        ]
        read_only_fields = fields

    @extend_schema_field(serializers.BooleanField())
    def get_is_saved(self, obj: AIContent) -> bool:
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.saved_by.filter(user=request.user).exists()


class UserAIContentSerializer(serializers.ModelSerializer):
    ai_content = AIContentSerializer(read_only=True)

    class Meta:
        model = UserAIContent
        fields = ["id", "ai_content", "share_key", "created_at"]
        read_only_fields = fields


class SharedAIContentSerializer(serializers.ModelSerializer):
    item_cells = serializers.ListField(child=serializers.CharField(), read_only=True)
    section_headers = serializers.ListField(child=serializers.CharField(), read_only=True)
    response_json = serializers.JSONField(read_only=True)

    class Meta:
        model = AIContent
        fields = [
            "id",
            "action_type",
            "level_code",
            "category",
            "section_title",
            "item_cells",
            "section_headers",
            "response_text",
            "response_json",
            "model_used",
            "created_at",
        ]
        read_only_fields = fields


class LLMModelSerializer(serializers.ModelSerializer):
    approx_cost_eur = serializers.SerializerMethodField()

    class Meta:
        model = LLMModel
        fields = ["id", "model_id", "name", "provider", "is_default", "approx_cost_eur"]
        read_only_fields = fields

    @extend_schema_field(serializers.FloatField())
    def get_approx_cost_eur(self, obj: LLMModel) -> float:
        from django.conf import settings

        avg_input_tokens = 500
        avg_output_tokens = 1500
        cost_usd = (
            float(obj.prompt_price) * avg_input_tokens
            + float(obj.completion_price) * avg_output_tokens
        )
        return round(cost_usd * settings.USD_TO_EUR_RATE, 8)
