from django.utils import timezone
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.progress.models import SectionProgress, UserPageProgress

from .serializers import SectionProgressSerializer, UserPageProgressSerializer


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


class MarkPageStudiedView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Mark a page as studied",
        tags=["progress"],
        request=None,
        responses={200: UserPageProgressSerializer},
    )
    def post(self, request, page_id):
        progress, _ = UserPageProgress.objects.get_or_create(
            user=request.user,
            page_id=page_id,
            defaults={"completed_at": timezone.now()},
        )
        if not progress.completed_at:
            progress.completed_at = timezone.now()
            progress.save(update_fields=["completed_at", "updated_at"])
        return Response(
            UserPageProgressSerializer(progress).data,
            status=status.HTTP_200_OK,
        )
