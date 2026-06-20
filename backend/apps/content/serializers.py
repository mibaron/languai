from drf_spectacular.utils import PolymorphicProxySerializer, extend_schema_field
from rest_framework import serializers

from .models import (
    ConversationLine,
    ConversationPart,
    FillBlankPart,
    Level,
    Page,
    PageLexicalItem,
    PagePart,
    PagePartType,
    Section,
    SectionItem,
    TeachingNotePart,
)


class LevelSerializer(serializers.ModelSerializer):
    section_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Level
        fields = ["id", "code", "name", "order", "section_count"]


class LevelWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ["code", "name", "order"]


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


# --- Page serializers ---


class ConversationLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConversationLine
        fields = ["id", "order", "speaker", "text", "translation", "is_blank", "blank_answer"]


class TeachingNoteDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeachingNotePart
        fields = ["content"]


class FillBlankDetailSerializer(serializers.ModelSerializer):
    item_id = serializers.UUIDField(source="item.id", read_only=True, default=None)

    class Meta:
        model = FillBlankPart
        fields = ["text_before", "text_after", "answer", "hint", "item_id"]


class ConversationDetailSerializer(serializers.ModelSerializer):
    lines = ConversationLineSerializer(many=True, read_only=True)

    class Meta:
        model = ConversationPart
        fields = ["context", "lines"]


class PagePartSerializer(serializers.ModelSerializer):
    detail = serializers.SerializerMethodField()

    class Meta:
        model = PagePart
        fields = ["id", "part_type", "order", "detail"]

    @extend_schema_field(
        PolymorphicProxySerializer(
            component_name="PagePartDetail",
            serializers={
                "note": TeachingNoteDetailSerializer,
                "fill_blank": FillBlankDetailSerializer,
                "conversation": ConversationDetailSerializer,
            },
            resource_type_field_name="part_type",
        )
    )
    def get_detail(self, obj: PagePart) -> dict | None:
        if obj.part_type == PagePartType.NOTE:
            detail = getattr(obj, "teaching_note", None)
            if detail:
                return TeachingNoteDetailSerializer(detail).data
        elif obj.part_type == PagePartType.FILL_BLANK:
            detail = getattr(obj, "fill_blank", None)
            if detail:
                return FillBlankDetailSerializer(detail).data
        elif obj.part_type == PagePartType.CONVERSATION:
            detail = getattr(obj, "conversation", None)
            if detail:
                return ConversationDetailSerializer(detail).data
        return None


class PageLexicalItemSerializer(serializers.ModelSerializer):
    item_id = serializers.UUIDField(source="item.id", read_only=True)
    text = serializers.CharField(source="item.text", read_only=True)
    translation = serializers.CharField(source="item.translation", read_only=True)
    type = serializers.CharField(source="item.type", read_only=True)

    class Meta:
        model = PageLexicalItem
        fields = ["item_id", "text", "translation", "type", "order", "display_label"]


class PageListSerializer(serializers.ModelSerializer):
    part_count = serializers.IntegerField(read_only=True)
    is_studied = serializers.BooleanField(read_only=True)

    class Meta:
        model = Page
        fields = ["id", "title", "description", "order", "part_count", "is_studied"]


class PageDetailSerializer(serializers.ModelSerializer):
    parts = PagePartSerializer(many=True, read_only=True)
    lexical_items = PageLexicalItemSerializer(
        source="page_lexical_items", many=True, read_only=True
    )
    is_studied = serializers.BooleanField(read_only=True)

    class Meta:
        model = Page
        fields = [
            "id",
            "title",
            "description",
            "order",
            "parts",
            "lexical_items",
            "is_studied",
        ]
