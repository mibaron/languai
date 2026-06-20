from django.db.models import Count, Exists, OuterRef
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import generics, permissions, viewsets

from api.v1.permissions import IsAdminOrReadOnly, IsOwnerOrAdminOrReadOnly
from apps.progress.models import UserPageProgress

from .models import Level, Page, Section, SectionItem
from .serializers import (
    LevelSerializer,
    LevelWriteSerializer,
    PageDetailSerializer,
    PageListSerializer,
    SectionDetailSerializer,
    SectionItemSerializer,
    SectionItemWriteSerializer,
    SectionListSerializer,
    SectionWriteSerializer,
)


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


def _page_queryset_with_progress(user):
    progress_subquery = UserPageProgress.objects.filter(
        user=user,
        page=OuterRef("pk"),
        completed_at__isnull=False,
    )
    return Page.objects.annotate(is_studied=Exists(progress_subquery))


@extend_schema(summary="List pages in a pack", tags=["pages"])
class PackPageListView(generics.ListAPIView):
    serializer_class = PageListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Page.objects.none()
        return (
            _page_queryset_with_progress(self.request.user)
            .filter(pack_id=self.kwargs["pack_id"])
            .annotate(part_count=Count("parts"))
            .order_by("order")
        )


@extend_schema(summary="Get page detail with parts and items", tags=["pages"])
class PackPageDetailView(generics.RetrieveAPIView):
    serializer_class = PageDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = "page_id"

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Page.objects.none()
        return (
            _page_queryset_with_progress(self.request.user)
            .filter(pack_id=self.kwargs["pack_id"])
            .prefetch_related(
                "parts__teaching_note",
                "parts__fill_blank__item",
                "parts__conversation__lines",
                "parts__table",
                "page_lexical_items__item",
            )
        )
