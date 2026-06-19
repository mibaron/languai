from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from .models import Level, Section, SectionItem


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
