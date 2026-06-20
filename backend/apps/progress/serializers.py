from rest_framework import serializers

from .models import SectionProgress, UserPageProgress


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


class UserPageProgressSerializer(serializers.ModelSerializer):
    page_title = serializers.CharField(source="page.title", read_only=True)

    class Meta:
        model = UserPageProgress
        fields = ["id", "page", "page_title", "completed_at", "updated_at"]
        read_only_fields = ["id", "completed_at", "updated_at"]
