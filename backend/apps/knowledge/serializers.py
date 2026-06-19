from rest_framework import serializers

from apps.knowledge.models import LearningGoal


class LearningGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningGoal
        fields = ["id", "name", "slug", "description", "icon", "order"]
        read_only_fields = fields
