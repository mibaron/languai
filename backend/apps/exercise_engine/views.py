from drf_spectacular.utils import OpenApiParameter, PolymorphicProxySerializer, extend_schema
from rest_framework import permissions, serializers, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.packs.models import SubscriptionStatus

from .constants import ExerciseType
from .selectors import get_available_exercise_types, get_exercises_for_pack
from .serializers import (
    ErrorCorrectionExerciseSerializer,
    ExerciseSessionParamsSerializer,
    FillBlankExerciseSerializer,
    FlashcardExerciseSerializer,
    MatchingExerciseSerializer,
    MCQExerciseSerializer,
    SentenceOrderExerciseSerializer,
    serialize_exercise,
)


class ExerciseSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Get an exercise session",
        description="Returns stored exercises from the user's subscribed packs, "
        "filtered to only include exercises from pages the user has studied.",
        tags=["exercises"],
        parameters=[
            OpenApiParameter(
                name="exercise_type",
                type=str,
                required=False,
                enum=[c[0] for c in ExerciseType.choices],
                description="Filter by exercise type",
            ),
            OpenApiParameter(
                name="max_items",
                type=int,
                required=False,
                description="Maximum exercises in session (default 20)",
            ),
        ],
        responses={
            200: PolymorphicProxySerializer(
                component_name="ExerciseSessionItem",
                serializers={
                    "flashcard": FlashcardExerciseSerializer,
                    "mcq_recognition": MCQExerciseSerializer,
                    "fill_blank": FillBlankExerciseSerializer,
                    "sentence_order": SentenceOrderExerciseSerializer,
                    "error_correction": ErrorCorrectionExerciseSerializer,
                    "matching": MatchingExerciseSerializer,
                },
                resource_type_field_name="exercise_type",
                many=True,
            ),
        },
    )
    def get(self, request: Request) -> Response:
        params = ExerciseSessionParamsSerializer(data=request.query_params)
        params.is_valid(raise_exception=True)

        active_subs = request.user.pack_subscriptions.filter(
            status=SubscriptionStatus.ACTIVE,
        )
        pack_ids = list(active_subs.values_list("pack_id", flat=True))

        if not pack_ids:
            return Response([])

        exercises = get_exercises_for_pack(
            user=request.user,
            pack_ids=pack_ids,
            exercise_type=params.validated_data.get("exercise_type"),
            limit=params.validated_data["max_items"],
        )

        data = [serialize_exercise(ex) for ex in exercises]
        return Response(data, status=status.HTTP_200_OK)


class AvailableExerciseTypesSerializer(serializers.Serializer):
    available_types = serializers.ListField(child=serializers.CharField())


class AvailableExerciseTypesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Get available exercise types",
        description="Returns exercise types that have exercises on pages the user has studied.",
        tags=["exercises"],
        responses={200: AvailableExerciseTypesSerializer},
    )
    def get(self, request: Request) -> Response:
        active_subs = request.user.pack_subscriptions.filter(
            status=SubscriptionStatus.ACTIVE,
        )
        pack_ids = list(active_subs.values_list("pack_id", flat=True))

        if not pack_ids:
            return Response({"available_types": []})

        types = get_available_exercise_types(user=request.user, pack_ids=pack_ids)
        return Response({"available_types": types})
