from rest_framework import serializers

from .models import Pack, UserPackSubscription


class PackSerializer(serializers.ModelSerializer):
    level_code = serializers.CharField(source="level.code", read_only=True)
    subscriber_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Pack
        fields = [
            "id",
            "title",
            "slug",
            "level_code",
            "base_language",
            "description",
            "grammar_count",
            "vocab_count",
            "exercise_count",
            "subscriber_count",
        ]
        read_only_fields = fields


class UserPackSubscriptionSerializer(serializers.ModelSerializer):
    pack = PackSerializer(read_only=True)

    class Meta:
        model = UserPackSubscription
        fields = ["id", "pack", "status", "created_at"]
        read_only_fields = fields


class SubscribeRequestSerializer(serializers.Serializer):
    pack_id = serializers.UUIDField()
