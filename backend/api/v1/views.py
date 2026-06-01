from django.db.models import Count
from rest_framework import permissions, viewsets

from apps.content.models import Level, Section
from apps.progress.models import SectionProgress

from .serializers import (
    LevelSerializer,
    SectionDetailSerializer,
    SectionListSerializer,
    SectionProgressSerializer,
)


class LevelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Level.objects.annotate(section_count=Count("sections"))
    serializer_class = LevelSerializer
    lookup_field = "code"


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


class SectionProgressViewSet(viewsets.ModelViewSet):
    serializer_class = SectionProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SectionProgress.objects.filter(
            user=self.request.user
        ).select_related("section")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
