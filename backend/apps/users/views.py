import logging

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from drf_spectacular.utils import extend_schema
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.knowledge.models import LearningGoal
from apps.packs.models import Pack, SubscriptionStatus, UserPackSubscription

from .serializers import (
    AuthResponseSerializer,
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    GoogleLoginSerializer,
    LoginSerializer,
    OnboardingCompleteSerializer,
    OnboardingStatusSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    UserSerializer,
)

User = get_user_model()
logger = logging.getLogger(__name__)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="Register a new user", tags=["auth"], responses={201: AuthResponseSerializer}
    )
    def post(self, request: Request, *args: object, **kwargs: object) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {"user": UserSerializer(user).data, "token": token.key},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    @extend_schema(
        summary="Login and receive auth token",
        tags=["auth"],
        request=LoginSerializer,
        responses={200: AuthResponseSerializer},
    )
    def post(self, request: Request) -> Response:
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
        )
        if user is None:
            return Response(
                {
                    "error": {
                        "code": "invalid_credentials",
                        "message": "Invalid username or password",
                    }
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"user": UserSerializer(user).data, "token": token.key})


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Logout and invalidate token", tags=["auth"], request=None, responses={204: None}
    )
    def post(self, request: Request) -> Response:
        request.user.auth_token.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = GoogleLoginSerializer

    @extend_schema(
        summary="Login or register with Google",
        tags=["auth"],
        request=GoogleLoginSerializer,
        responses={200: AuthResponseSerializer},
    )
    def post(self, request: Request) -> Response:
        serializer = GoogleLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not settings.GOOGLE_CLIENT_ID:
            return Response(
                {
                    "error": {
                        "code": "google_not_configured",
                        "message": "Google login is not configured",
                    }
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            idinfo = google_id_token.verify_oauth2_token(
                serializer.validated_data["credential"],
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )
        except ValueError:
            logger.warning("Invalid Google token received")
            return Response(
                {"error": {"code": "invalid_token", "message": "Invalid Google credential"}},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        email = idinfo["email"]
        user = User.objects.filter(email=email).first()

        if user is None:
            username = email.split("@")[0]
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1

            user = User.objects.create_user(
                username=username,
                email=email,
                password=None,
                credit_balance=settings.WELCOME_CREDIT_EUR,
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response({"user": UserSerializer(user).data, "token": token.key})


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(summary="Get current user profile", tags=["auth"])
    def get(self, request: Request, *args: object, **kwargs: object) -> Response:
        return super().get(request, *args, **kwargs)

    @extend_schema(summary="Update current user profile", tags=["auth"])
    def put(self, request: Request, *args: object, **kwargs: object) -> Response:
        return super().put(request, *args, **kwargs)

    @extend_schema(summary="Partially update current user profile", tags=["auth"])
    def patch(self, request: Request, *args: object, **kwargs: object) -> Response:
        return super().patch(request, *args, **kwargs)

    def get_object(self) -> User:
        return self.request.user

    @extend_schema(summary="Delete current user account", tags=["auth"], responses={204: None})
    def delete(self, request: Request, *args: object, **kwargs: object) -> Response:
        user = request.user
        try:
            request.user.auth_token.delete()
        except Token.DoesNotExist:
            pass
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    @extend_schema(
        summary="Change password",
        tags=["auth"],
        request=ChangePasswordSerializer,
        responses={204: None},
    )
    def post(self, request: Request) -> Response:
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not request.user.check_password(serializer.validated_data["old_password"]):
            return Response(
                {"error": {"code": "wrong_password", "message": "Current password is incorrect"}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save(update_fields=["password"])
        request.user.auth_token.delete()
        token, _ = Token.objects.get_or_create(user=request.user)
        return Response({"token": token.key}, status=status.HTTP_200_OK)


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ForgotPasswordSerializer

    @extend_schema(
        summary="Request password reset email",
        tags=["auth"],
        request=ForgotPasswordSerializer,
        responses={200: None},
    )
    def post(self, request: Request) -> Response:
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        from django.contrib.auth.tokens import default_token_generator
        from django.utils.encoding import force_bytes
        from django.utils.http import urlsafe_base64_encode

        email = serializer.validated_data["email"]
        user = User.objects.filter(email=email).first()

        if user and user.has_usable_password():
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_url = (
                f"{request.headers.get('Origin', '')}/reset-password?uid={uid}&token={token}"
            )
            try:
                user.email_user(
                    subject="Reset your Langu-AI password",
                    message=f"Click the link to reset your password: {reset_url}",
                    from_email=None,
                )
            except Exception:
                logger.exception("Failed to send password reset email")

        return Response(
            {"detail": "If an account with that email exists, a reset link has been sent."}
        )


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ResetPasswordSerializer

    @extend_schema(
        summary="Reset password with token",
        tags=["auth"],
        request=ResetPasswordSerializer,
        responses={204: None},
    )
    def post(self, request: Request) -> Response:
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_decode

        try:
            uid = urlsafe_base64_decode(serializer.validated_data["uid"]).decode()
            user = User.objects.get(pk=uid)
        except (ValueError, TypeError, User.DoesNotExist):
            return Response(
                {"error": {"code": "invalid_token", "message": "Invalid or expired reset link"}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(user, serializer.validated_data["token"]):
            return Response(
                {"error": {"code": "invalid_token", "message": "Invalid or expired reset link"}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])
        Token.objects.filter(user=user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OnboardingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Get onboarding status",
        tags=["onboarding"],
        responses={200: OnboardingStatusSerializer},
    )
    def get(self, request: Request) -> Response:
        user = request.user
        pack_ids = list(
            user.pack_subscriptions.filter(status="active").values_list("pack_id", flat=True)
        )
        return Response(
            {
                "is_onboarded": user.is_onboarded,
                "native_language": user.native_language,
                "current_level": user.current_level,
                "pack_ids": pack_ids,
                "learning_goal": user.learning_goal_id,
            }
        )

    @extend_schema(
        summary="Complete onboarding",
        tags=["onboarding"],
        request=OnboardingCompleteSerializer,
        responses={200: OnboardingStatusSerializer},
    )
    def post(self, request: Request) -> Response:
        serializer = OnboardingCompleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        data = serializer.validated_data

        user.native_language = data["native_language"]
        user.is_onboarded = True

        if "learning_goal" in data and data["learning_goal"]:
            try:
                goal = LearningGoal.objects.get(pk=data["learning_goal"])
                user.learning_goal = goal
            except LearningGoal.DoesNotExist:
                pass

        subscribed_pack_ids = []
        for pack_id in data["pack_ids"]:
            try:
                pack = Pack.objects.get(id=pack_id, is_active=True)
            except Pack.DoesNotExist:
                continue
            UserPackSubscription.objects.get_or_create(
                user=user,
                pack=pack,
                defaults={"status": SubscriptionStatus.ACTIVE},
            )
            subscribed_pack_ids.append(pack_id)

        if subscribed_pack_ids:
            first_pack = Pack.objects.get(id=subscribed_pack_ids[0])
            user.current_level = first_pack.level.code

        update_fields = ["native_language", "current_level", "is_onboarded"]
        if user.learning_goal_id:
            update_fields.append("learning_goal")
        user.save(update_fields=update_fields)

        return Response(
            {
                "is_onboarded": True,
                "native_language": user.native_language,
                "current_level": user.current_level,
                "pack_ids": subscribed_pack_ids,
                "learning_goal": user.learning_goal_id,
            }
        )
