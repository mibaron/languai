from django.db.models import Count
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import permissions, viewsets

from apps.content.models import Level, Section
from apps.progress.models import SectionProgress

from .serializers import (
    LevelSerializer,
    SectionDetailSerializer,
    SectionListSerializer,
    SectionProgressSerializer,
)


@extend_schema_view(
    list=extend_schema(summary="List all levels", tags=["levels"]),
    retrieve=extend_schema(summary="Get a level by code", tags=["levels"]),
)
class LevelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Level.objects.annotate(section_count=Count("sections"))
    serializer_class = LevelSerializer
    lookup_field = "code"


@extend_schema_view(
    list=extend_schema(
        summary="List sections",
        description="Filter by level, category, or content type. Supports search by title.",
        tags=["sections"],
        responses=SectionListSerializer(many=True),
    ),
    retrieve=extend_schema(
        summary="Get section detail",
        tags=["sections"],
        responses=SectionDetailSerializer,
    ),
)
class SectionViewSet(viewsets.ReadOnlyModelViewSet):
    filterset_fields = ["level__code", "category", "content_type"]
    search_fields = ["title"]
    ordering_fields = ["order", "title"]

    def get_queryset(self):
        return Section.objects.select_related("level").order_by("level__order", "order")

    def get_serializer_class(self):
        if self.action == "list":
            return SectionListSerializer
        return SectionDetailSerializer


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
        return SectionProgress.objects.filter(
            user=self.request.user
        ).select_related("section")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
