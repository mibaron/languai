from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.content.models import Level, Section
from apps.progress.models import SectionProgress


class LevelSerializer(serializers.ModelSerializer):
    section_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Level
        fields = ["id", "code", "name", "order", "section_count"]


class SectionListSerializer(serializers.ModelSerializer):
    level_code = serializers.CharField(source="level.code", read_only=True)

    class Meta:
        model = Section
        fields = [
            "id",
            "level_code",
            "category",
            "title",
            "order",
            "content_type",
        ]


class SectionDetailSerializer(serializers.ModelSerializer):
    level_code = serializers.CharField(source="level.code", read_only=True)
    headers = serializers.SerializerMethodField()
    rows = serializers.SerializerMethodField()
    notes = serializers.SerializerMethodField()

    class Meta:
        model = Section
        fields = [
            "id",
            "level_code",
            "category",
            "title",
            "order",
            "content_type",
            "note",
            "note2",
            "headers",
            "rows",
            "notes",
        ]

    @extend_schema_field(serializers.ListField(child=serializers.CharField()))
    def get_headers(self, obj: Section) -> list[str]:
        return obj.headers

    @extend_schema_field(
        serializers.ListField(
            child=serializers.ListField(child=serializers.CharField())
        )
    )
    def get_rows(self, obj: Section) -> list[list[str]]:
        return obj.rows

    @extend_schema_field(serializers.ListField(child=serializers.CharField()))
    def get_notes(self, obj: Section) -> list[str]:
        return obj.notes


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
