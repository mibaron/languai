import logging

from django.conf import settings
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.serializers import ShareKeyResponseSerializer, UserCreditResponseSerializer

from .models import AIContent, LLMModel, UserAIContent
from .serializers import (
    AIContentSerializer,
    AIGenerateRequestSerializer,
    AIItemContentRequestSerializer,
    LLMModelSerializer,
    SharedAIContentSerializer,
    UserAIContentSerializer,
)
from .services import (
    InsufficientCreditError,
    compute_fingerprint,
    generate_ai_content,
)

logger = logging.getLogger(__name__)


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
