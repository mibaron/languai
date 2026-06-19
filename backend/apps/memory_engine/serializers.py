from rest_framework import serializers


class SessionItemSerializer(serializers.Serializer):
    item_id = serializers.UUIDField()
    item_text = serializers.CharField()
    item_translation = serializers.CharField()
    item_type = serializers.CharField()
    skill_type = serializers.CharField()
    is_new = serializers.BooleanField()
    retrievability = serializers.FloatField()


class ReviewRequestSerializer(serializers.Serializer):
    item_id = serializers.UUIDField()
    skill_type = serializers.CharField()
    rating = serializers.IntegerField(min_value=1, max_value=4)
    response_time_ms = serializers.IntegerField(required=False, min_value=0)


class ReviewResponseSerializer(serializers.Serializer):
    next_due = serializers.DateTimeField()
    difficulty = serializers.FloatField()
    stability = serializers.FloatField()
    reps = serializers.IntegerField()
    lapses = serializers.IntegerField()
    state = serializers.IntegerField()
