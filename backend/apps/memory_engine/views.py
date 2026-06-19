from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import permissions, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.packs.models import SubscriptionStatus

from .serializers import ReviewRequestSerializer, ReviewResponseSerializer, SessionItemSerializer
from .services import record_review
from .session import SessionConfig, build_session


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
