from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import permissions, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.packs.models import SubscriptionStatus

from .constants import ExerciseType
from .serializers import (
    ExerciseSessionParamsSerializer,
    FlashcardExerciseSerializer,
    MCQExerciseSerializer,
)
from .services import FlashcardExercise, exercise_to_dict, generate_exercise_session


class ExerciseSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Get an exercise session",
        tags=["exercises"],
        parameters=[
            OpenApiParameter(
                name="exercise_type",
                type=str,
                required=True,
                enum=[c[0] for c in ExerciseType.choices],
                description="Type of exercises to generate",
            ),
            OpenApiParameter(
                name="max_items",
                type=int,
                required=False,
                description="Maximum exercises in session (default 20)",
            ),
        ],
        responses={200: FlashcardExerciseSerializer(many=True)},
    )
    def get(self, request: Request) -> Response:
        params = ExerciseSessionParamsSerializer(data=request.query_params)
        params.is_valid(raise_exception=True)

        user = request.user
        active_subs = user.pack_subscriptions.filter(
            status=SubscriptionStatus.ACTIVE,
        )
        pack_ids = list(active_subs.values_list("pack_id", flat=True))

        if not pack_ids:
            return Response([])

        exercises = generate_exercise_session(
            user=user,
            pack_ids=pack_ids,
            exercise_type=params.validated_data["exercise_type"],
            max_items=params.validated_data["max_items"],
        )

        data = []
        for ex in exercises:
            if isinstance(ex, FlashcardExercise):
                data.append(FlashcardExerciseSerializer(exercise_to_dict(ex)).data)
            else:
                data.append(MCQExerciseSerializer(exercise_to_dict(ex)).data)

        return Response(data, status=status.HTTP_200_OK)
