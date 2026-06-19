import logging

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.db import models
from django.db.models import Count
from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from rest_framework import generics, permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.ai_content.models import AIContent, LLMModel, UserAIContent
from apps.ai_content.services import (
    InsufficientCreditError,
    compute_fingerprint,
    generate_ai_content,
)
from apps.content.models import Level, Section, SectionItem
from apps.knowledge.models import LearningGoal
from apps.knowledge.serializers import LearningGoalSerializer
from apps.memory_engine.serializers import (
    ReviewRequestSerializer,
    ReviewResponseSerializer,
    SessionItemSerializer,
)
from apps.memory_engine.services import record_review
from apps.memory_engine.session import SessionConfig, build_session
from apps.packs.exceptions import AlreadySubscribedError, NotSubscribedError, PackNotFoundError
from apps.packs.models import SubscriptionStatus
from apps.packs.selectors import (
    get_available_packs,
    get_user_subscriptions,
)
from apps.packs.services import (
    archive_pack,
    subscribe_to_pack,
    unarchive_pack,
    unsubscribe_from_pack,
)
from apps.progress.models import SectionProgress

from .permissions import IsAdminOrReadOnly, IsOwnerOrAdminOrReadOnly
from .serializers import (
    AIContentSerializer,
    AIGenerateRequestSerializer,
    AIItemContentRequestSerializer,
    AuthResponseSerializer,
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    GoogleLoginSerializer,
    LevelSerializer,
    LevelWriteSerializer,
    LLMModelSerializer,
    LoginSerializer,
    OnboardingCompleteSerializer,
    OnboardingStatusSerializer,
    PackSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    SectionDetailSerializer,
    SectionItemSerializer,
    SectionItemWriteSerializer,
    SectionListSerializer,
    SectionProgressSerializer,
    SectionWriteSerializer,
    SharedAIContentSerializer,
    ShareKeyResponseSerializer,
    SubscribeRequestSerializer,
    UserAIContentSerializer,
    UserCreditResponseSerializer,
    UserPackSubscriptionSerializer,
    UserSerializer,
)

User = get_user_model()
logger = logging.getLogger(__name__)


# ── Auth ──────────────────────────────────────


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


# ── Levels ────────────────────────────────────


@extend_schema_view(
    list=extend_schema(summary="List all levels", tags=["levels"]),
    retrieve=extend_schema(summary="Get a level by code", tags=["levels"]),
    create=extend_schema(summary="Create a level (admin)", tags=["levels"]),
    update=extend_schema(summary="Update a level (admin)", tags=["levels"]),
    partial_update=extend_schema(summary="Partially update a level (admin)", tags=["levels"]),
    destroy=extend_schema(summary="Delete a level (admin)", tags=["levels"]),
)
class LevelViewSet(viewsets.ModelViewSet):
    lookup_field = "code"
    lookup_value_regex = r"[A-Za-z0-9.]+"
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        return Level.objects.annotate(section_count=Count("sections"))

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return LevelWriteSerializer
        return LevelSerializer


# ── Sections ──────────────────────────────────


@extend_schema_view(
    list=extend_schema(
        summary="List sections",
        description="Filter by level, category, or content type. Supports search by title.",
        tags=["sections"],
    ),
    retrieve=extend_schema(summary="Get section detail with items", tags=["sections"]),
    create=extend_schema(summary="Create a section", tags=["sections"]),
    update=extend_schema(summary="Update a section", tags=["sections"]),
    partial_update=extend_schema(summary="Partially update a section", tags=["sections"]),
    destroy=extend_schema(summary="Delete a section", tags=["sections"]),
)
class SectionViewSet(viewsets.ModelViewSet):
    filterset_fields = ["level__code", "category", "content_type"]
    search_fields = ["title"]
    ordering_fields = ["order", "title"]
    permission_classes = [IsOwnerOrAdminOrReadOnly]

    def get_queryset(self):
        qs = Section.objects.select_related("level", "created_by").order_by("level__order", "order")
        if self.action == "list":
            qs = qs.annotate(item_count=Count("items"))
        elif self.action == "retrieve":
            qs = qs.prefetch_related("items")
        return qs

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return SectionWriteSerializer
        if self.action == "list":
            return SectionListSerializer
        return SectionDetailSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# ── Section Items ─────────────────────────────


@extend_schema_view(
    list=extend_schema(summary="List items in a section", tags=["items"]),
    retrieve=extend_schema(summary="Get a section item", tags=["items"]),
    create=extend_schema(summary="Add an item to a section", tags=["items"]),
    update=extend_schema(summary="Update a section item", tags=["items"]),
    partial_update=extend_schema(summary="Partially update a section item", tags=["items"]),
    destroy=extend_schema(summary="Delete a section item", tags=["items"]),
)
class SectionItemViewSet(viewsets.ModelViewSet):
    permission_classes = [IsOwnerOrAdminOrReadOnly]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return SectionItem.objects.none()
        return SectionItem.objects.filter(section_id=self.kwargs["section_pk"]).select_related(
            "section", "created_by"
        )

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return SectionItemWriteSerializer
        return SectionItemSerializer

    def perform_create(self, serializer):
        section = Section.objects.get(pk=self.kwargs["section_pk"])
        serializer.save(section=section, created_by=self.request.user)


# ── Progress ──────────────────────────────────


@extend_schema_view(
    list=extend_schema(summary="List user progress", tags=["progress"]),
    create=extend_schema(summary="Create/update section progress", tags=["progress"]),
    retrieve=extend_schema(summary="Get progress for a section", tags=["progress"]),
    update=extend_schema(summary="Update section progress", tags=["progress"]),
    partial_update=extend_schema(summary="Partially update section progress", tags=["progress"]),
    destroy=extend_schema(summary="Delete section progress", tags=["progress"]),
)
class SectionProgressViewSet(viewsets.ModelViewSet):
    serializer_class = SectionProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return SectionProgress.objects.none()
        return SectionProgress.objects.filter(user=self.request.user).select_related("section")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ── AI Content ───────────────────────────────


class AIGenerateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AIGenerateRequestSerializer

    @extend_schema(
        summary="Generate AI content for a learning item (cache-first)",
        tags=["ai-content"],
        request=AIGenerateRequestSerializer,
        responses={200: AIContentSerializer},
    )
    def post(self, request: Request) -> Response:
        serializer = AIGenerateRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if not settings.OPENROUTER_API_KEY:
            return Response(
                {"error": {"code": "ai_not_configured", "message": "AI service is not configured"}},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        model_id = data.get("model")
        save_as_default = data.get("save_as_default", False)
        regenerate = data.get("regenerate", False)

        try:
            ai_content = generate_ai_content(
                user=request.user,
                level_code=data["level_code"],
                category=data["category"],
                section_title=data["section_title"],
                section_headers=data.get("section_headers", []),
                item_cells=data["item_cells"],
                action_type=data["action_type"],
                model_id=model_id,
                regenerate=regenerate,
            )
        except InsufficientCreditError:
            return Response(
                {
                    "error": {
                        "code": "insufficient_credit",
                        "message": "You have no credit remaining",
                    }
                },
                status=status.HTTP_402_PAYMENT_REQUIRED,
            )
        except Exception:
            logger.exception("AI generation failed")
            return Response(
                {"error": {"code": "ai_error", "message": "Failed to generate AI content"}},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        if save_as_default and model_id:
            llm_model = LLMModel.objects.filter(model_id=model_id, is_active=True).first()
            if llm_model:
                request.user.preferred_model = llm_model
                request.user.save(update_fields=["preferred_model"])

        return Response(AIContentSerializer(ai_content, context={"request": request}).data)


class AIContentSaveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Save AI content to user collection",
        tags=["ai-content"],
        request=None,
        responses={201: None},
    )
    def post(self, request: Request, pk: str) -> Response:
        try:
            ai_content = AIContent.objects.get(pk=pk)
        except AIContent.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        UserAIContent.objects.get_or_create(user=request.user, ai_content=ai_content)
        return Response(status=status.HTTP_201_CREATED)


class UserSavedAIContentView(generics.ListAPIView):
    serializer_class = UserAIContentSerializer
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(summary="List user's saved AI content", tags=["ai-content"])
    def get(self, request: Request, *args: object, **kwargs: object) -> Response:
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return UserAIContent.objects.none()
        return UserAIContent.objects.filter(
            user=self.request.user,
        ).select_related("ai_content")


class UserSavedAIContentDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Remove AI content from user collection", tags=["ai-content"], responses={204: None}
    )
    def delete(self, request: Request, pk: str) -> Response:
        deleted, _ = UserAIContent.objects.filter(pk=pk, user=request.user).delete()
        if not deleted:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)


class AIContentShareView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Generate share key for saved AI content",
        tags=["ai-content"],
        request=None,
        responses={200: ShareKeyResponseSerializer},
    )
    def post(self, request: Request, pk: str) -> Response:
        try:
            saved = UserAIContent.objects.get(pk=pk, user=request.user)
        except UserAIContent.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if not saved.share_key:
            import secrets

            saved.share_key = secrets.token_urlsafe(8)
            saved.save(update_fields=["share_key"])

        return Response({"share_key": saved.share_key})


class SharedAIContentView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="View shared AI content by share key",
        tags=["ai-content"],
        responses={200: SharedAIContentSerializer},
    )
    def get(self, request: Request, share_key: str) -> Response:
        try:
            saved = UserAIContent.objects.select_related("ai_content").get(share_key=share_key)
        except UserAIContent.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(SharedAIContentSerializer(saved.ai_content).data)


class AIItemContentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="List all generated content for a learning item",
        tags=["ai-content"],
        request=AIItemContentRequestSerializer,
        responses={200: AIContentSerializer(many=True)},
    )
    def post(self, request: Request) -> Response:
        serializer = AIItemContentRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        fingerprint = compute_fingerprint(
            level_code=data["level_code"],
            category=data["category"],
            section_title=data["section_title"],
            item_cells=data["item_cells"],
        )

        contents = AIContent.objects.filter(item_fingerprint=fingerprint)
        return Response(AIContentSerializer(contents, many=True, context={"request": request}).data)


class AIContentDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Delete a generated AI content entry",
        tags=["ai-content"],
        responses={204: None},
    )
    def delete(self, request: Request, pk: str) -> Response:
        try:
            ai_content = AIContent.objects.get(pk=pk)
        except AIContent.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        ai_content.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ── LLM Models ──────────────────────────────


class LLMModelListView(generics.ListAPIView):
    serializer_class = LLMModelSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    @extend_schema(summary="List active LLM models", tags=["ai-content"])
    def get(self, request: Request, *args: object, **kwargs: object) -> Response:
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return LLMModel.objects.filter(is_active=True)


class UserCreditView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Get user credit balance",
        tags=["ai-content"],
        responses={200: UserCreditResponseSerializer},
    )
    def get(self, request: Request) -> Response:
        return Response(
            {
                "credit_balance": str(request.user.credit_balance),
                "currency": "EUR",
            }
        )


# ── Onboarding ───────────────────────────────


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

        from apps.packs.models import Pack, UserPackSubscription

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


# ── Packs ────────────────────────────────────


class PackListView(generics.ListAPIView):
    serializer_class = PackSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(summary="List available packs", tags=["packs"])
    def get(self, request: Request, *args: object, **kwargs: object) -> Response:
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return get_available_packs().none()
        return get_available_packs().annotate(
            subscriber_count=Count("subscriptions", filter=models.Q(subscriptions__status="active"))
        )


class UserPackSubscriptionListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="List user's pack subscriptions",
        tags=["packs"],
        parameters=[
            OpenApiParameter(
                name="status",
                type=str,
                location=OpenApiParameter.QUERY,
                required=False,
                enum=["active", "archived", "completed"],
            ),
        ],
        responses={200: UserPackSubscriptionSerializer(many=True)},
    )
    def get(self, request: Request) -> Response:
        status_filter = request.query_params.get("status")
        subscriptions = get_user_subscriptions(user=request.user, status=status_filter)
        serializer = UserPackSubscriptionSerializer(subscriptions, many=True)
        return Response(serializer.data)


class PackSubscribeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Subscribe to a pack",
        tags=["packs"],
        request=SubscribeRequestSerializer,
        responses={201: UserPackSubscriptionSerializer},
    )
    def post(self, request: Request) -> Response:
        serializer = SubscribeRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            subscription = subscribe_to_pack(
                user=request.user,
                pack_id=str(serializer.validated_data["pack_id"]),
            )
        except PackNotFoundError:
            return Response(
                {"detail": "Pack not found or inactive."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except AlreadySubscribedError:
            return Response(
                {"detail": "Already subscribed to this pack."},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(
            UserPackSubscriptionSerializer(subscription).data,
            status=status.HTTP_201_CREATED,
        )


class PackUnsubscribeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Unsubscribe from a pack", tags=["packs"], request=None, responses={204: None}
    )
    def delete(self, request: Request, pack_id: str) -> Response:
        try:
            unsubscribe_from_pack(user=request.user, pack_id=pack_id)
        except NotSubscribedError:
            return Response(
                {"detail": "Not subscribed to this pack."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


class PackArchiveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Archive a pack subscription",
        tags=["packs"],
        request=None,
        responses={200: UserPackSubscriptionSerializer},
    )
    def post(self, request: Request, pack_id: str) -> Response:
        try:
            subscription = archive_pack(user=request.user, pack_id=pack_id)
        except NotSubscribedError:
            return Response(
                {"detail": "No active subscription for this pack."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(UserPackSubscriptionSerializer(subscription).data)


class PackUnarchiveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Unarchive a pack subscription",
        tags=["packs"],
        request=None,
        responses={200: UserPackSubscriptionSerializer},
    )
    def post(self, request: Request, pack_id: str) -> Response:
        try:
            subscription = unarchive_pack(user=request.user, pack_id=pack_id)
        except NotSubscribedError:
            return Response(
                {"detail": "No archived subscription for this pack."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(UserPackSubscriptionSerializer(subscription).data)


# ── Learning Goals ───────────────────────────


class LearningGoalListView(generics.ListAPIView):
    serializer_class = LearningGoalSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    @extend_schema(
        summary="List all learning goals",
        tags=["goals"],
    )
    def get(self, request: Request, *args: object, **kwargs: object) -> Response:
        return super().get(request, *args, **kwargs)

    def get_queryset(self):  # type: ignore[override]
        return LearningGoal.objects.all()


# ── Memory Engine ────────────────────────────


class SessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Get a practice session",
        tags=["memory"],
        parameters=[
            OpenApiParameter(
                name="max_items",
                type=int,
                required=False,
                description="Maximum items in session (default 20)",
            ),
            OpenApiParameter(
                name="skill_type",
                type=str,
                required=False,
                description="Skill type filter (recognition, production, listening, spelling)",
            ),
        ],
        responses={200: SessionItemSerializer(many=True)},
    )
    def get(self, request: Request) -> Response:
        user = request.user
        active_subs = user.pack_subscriptions.filter(
            status=SubscriptionStatus.ACTIVE,
        )
        pack_ids = list(active_subs.values_list("pack_id", flat=True))

        if not pack_ids:
            return Response([])

        max_items = int(request.query_params.get("max_items", 20))
        skill_type = request.query_params.get("skill_type")

        config = SessionConfig(max_items=max_items)
        if skill_type:
            config.skill_types = [skill_type]

        session = build_session(user=user, pack_ids=pack_ids, config=config)
        serializer = SessionItemSerializer(session, many=True)
        return Response(serializer.data)


class ReviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Submit a review result",
        tags=["memory"],
        request=ReviewRequestSerializer,
        responses={200: ReviewResponseSerializer},
    )
    def post(self, request: Request) -> Response:
        serializer = ReviewRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            memory_state = record_review(
                user=request.user,
                item_id=str(data["item_id"]),
                skill_type=data["skill_type"],
                rating=data["rating"],
                response_time_ms=data.get("response_time_ms"),
            )
        except Exception:
            return Response(
                {"detail": "Item not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            ReviewResponseSerializer(
                {
                    "next_due": memory_state.next_due,
                    "difficulty": memory_state.difficulty,
                    "stability": memory_state.stability,
                    "reps": memory_state.reps,
                    "lapses": memory_state.lapses,
                    "state": memory_state.state,
                }
            ).data
        )
