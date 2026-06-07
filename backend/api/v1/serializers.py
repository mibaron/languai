from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.ai_content.models import AIContent, ActionType, LLMModel, UserAIContent
from apps.content.models import Category, Level, Section, SectionItem
from apps.progress.models import SectionProgress

User = get_user_model()


# ── Auth ──────────────────────────────────────


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["username", "email", "password", "native_language"]

    def create(self, validated_data: dict) -> User:
        from django.conf import settings

        user = User.objects.create_user(**validated_data)
        user.credit_balance = settings.WELCOME_CREDIT_EUR
        user.save(update_fields=["credit_balance"])
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class GoogleLoginSerializer(serializers.Serializer):
    credential = serializers.CharField()


class UserSerializer(serializers.ModelSerializer):
    preferred_model_id = serializers.CharField(
        source="preferred_model.model_id", read_only=True, default=None
    )

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "native_language", "current_level",
            "credit_balance", "preferred_model_id", "date_joined",
        ]
        read_only_fields = ["id", "date_joined", "credit_balance", "preferred_model_id"]


# ── Levels ────────────────────────────────────


class LevelSerializer(serializers.ModelSerializer):
    section_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Level
        fields = ["id", "code", "name", "order", "section_count"]


class LevelWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ["code", "name", "order"]


# ── Section Items ─────────────────────────────


class SectionItemSerializer(serializers.ModelSerializer):
    cells = serializers.SerializerMethodField()

    class Meta:
        model = SectionItem
        fields = ["id", "order", "cells"]

    @extend_schema_field(serializers.ListField(child=serializers.CharField()))
    def get_cells(self, obj: SectionItem) -> list[str]:
        return obj.cells


class SectionItemWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SectionItem
        fields = ["id", "order", "cells"]
        read_only_fields = ["id"]


# ── Sections ──────────────────────────────────


class SectionListSerializer(serializers.ModelSerializer):
    level_code = serializers.CharField(source="level.code", read_only=True)
    item_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Section
        fields = [
            "id",
            "level_code",
            "category",
            "title",
            "order",
            "content_type",
            "item_count",
        ]


class SectionDetailSerializer(serializers.ModelSerializer):
    level_code = serializers.CharField(source="level.code", read_only=True)
    headers = serializers.SerializerMethodField()
    items = SectionItemSerializer(many=True, read_only=True)
    created_by = serializers.CharField(source="created_by.username", read_only=True, default=None)

    class Meta:
        model = Section
        fields = [
            "id",
            "level",
            "level_code",
            "category",
            "title",
            "order",
            "content_type",
            "note",
            "note2",
            "headers",
            "items",
            "created_by",
            "created_at",
            "updated_at",
        ]

    @extend_schema_field(serializers.ListField(child=serializers.CharField()))
    def get_headers(self, obj: Section) -> list[str]:
        return obj.headers


class SectionWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = [
            "id",
            "level",
            "category",
            "title",
            "order",
            "content_type",
            "note",
            "note2",
            "headers",
        ]
        read_only_fields = ["id"]


# ── Progress ──────────────────────────────────


class SectionProgressSerializer(serializers.ModelSerializer):
    section_title = serializers.CharField(source="section.title", read_only=True)

    class Meta:
        model = SectionProgress
        fields = [
            "id",
            "section",
            "section_title",
            "is_completed",
            "completed_at",
            "updated_at",
        ]
        read_only_fields = ["id", "completed_at", "updated_at"]


# ── AI Content ───────────────────────────────


class AIItemContentRequestSerializer(serializers.Serializer):
    level_code = serializers.CharField(max_length=10)
    category = serializers.CharField(max_length=20)
    section_title = serializers.CharField(max_length=255)
    item_cells = serializers.ListField(child=serializers.CharField(), min_length=1)


class AIGenerateRequestSerializer(serializers.Serializer):
    level_code = serializers.CharField(max_length=10)
    category = serializers.ChoiceField(choices=Category.choices)
    section_title = serializers.CharField(max_length=255)
    section_headers = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    item_cells = serializers.ListField(child=serializers.CharField(), min_length=1)
    action_type = serializers.ChoiceField(choices=ActionType.choices)
    model = serializers.CharField(max_length=100, required=False, default=None)
    save_as_default = serializers.BooleanField(required=False, default=False)
    regenerate = serializers.BooleanField(required=False, default=False)


class AIContentSerializer(serializers.ModelSerializer):
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


# ── LLM Models ──────────────────────────────


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
        cost_usd = float(obj.prompt_price) * avg_input_tokens + float(obj.completion_price) * avg_output_tokens
        return round(cost_usd * settings.USD_TO_EUR_RATE, 8)
