from django.db import models
from django.db.models import Count
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import generics, permissions, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .exceptions import AlreadySubscribedError, NotSubscribedError, PackNotFoundError
from .selectors import get_available_packs, get_user_subscriptions
from .serializers import (
    PackSerializer,
    SubscribeRequestSerializer,
    UserPackSubscriptionSerializer,
)
from .services import (
    archive_pack,
    subscribe_to_pack,
    unarchive_pack,
    unsubscribe_from_pack,
)


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
