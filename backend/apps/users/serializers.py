from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["username", "email", "password", "native_language", "learning_language"]

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


class AuthResponseSerializer(serializers.Serializer):
    user = serializers.SerializerMethodField()
    token = serializers.CharField()

    @extend_schema_field({"$ref": "#/components/schemas/User"})
    def get_user(self, obj: dict) -> dict:
        return obj["user"]


class UserCreditResponseSerializer(serializers.Serializer):
    credit_balance = serializers.CharField()
    currency = serializers.CharField()


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=8)


class ShareKeyResponseSerializer(serializers.Serializer):
    share_key = serializers.CharField()


class UserSerializer(serializers.ModelSerializer):
    preferred_model_id = serializers.CharField(
        source="preferred_model.model_id", read_only=True, default=None
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "native_language",
            "learning_language",
            "current_level",
            "credit_balance",
            "preferred_model_id",
            "date_joined",
        ]
        read_only_fields = ["id", "date_joined", "credit_balance", "preferred_model_id"]


class OnboardingStatusSerializer(serializers.Serializer):
    is_onboarded = serializers.BooleanField()
    native_language = serializers.CharField()
    current_level = serializers.CharField()
    pack_ids = serializers.ListField(child=serializers.UUIDField(), default=list)
    learning_goal = serializers.UUIDField(allow_null=True)


class OnboardingCompleteSerializer(serializers.Serializer):
    native_language = serializers.CharField(max_length=10)
    pack_ids = serializers.ListField(child=serializers.UUIDField(), min_length=1)
    learning_goal = serializers.UUIDField(required=False, allow_null=True)
