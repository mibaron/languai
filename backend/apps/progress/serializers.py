from rest_framework import serializers

from .models import SectionProgress, UserPageProgress


class CategoryProgressSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    studied = serializers.IntegerField()


class PackProgressSerializer(serializers.Serializer):
    total_pages = serializers.IntegerField()
    studied_pages = serializers.IntegerField()
    categories = serializers.DictField(child=CategoryProgressSerializer())


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
