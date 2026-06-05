from django.contrib.auth import authenticate, get_user_model
from django.db.models import Count
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import generics, permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.content.models import Level, Section, SectionItem
from apps.progress.models import SectionProgress

from .permissions import IsAdminOrReadOnly, IsOwnerOrAdminOrReadOnly
from .serializers import (
    LevelSerializer,
    LevelWriteSerializer,
    LoginSerializer,
    RegisterSerializer,
    SectionDetailSerializer,
    SectionItemSerializer,
    SectionItemWriteSerializer,
    SectionListSerializer,
    SectionProgressSerializer,
    SectionWriteSerializer,
    UserSerializer,
)

User = get_user_model()


# ── Auth ──────────────────────────────────────


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(summary="Register a new user", tags=["auth"])
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
        responses={200: UserSerializer},
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
                {"error": {"code": "invalid_credentials", "message": "Invalid username or password"}},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"user": UserSerializer(user).data, "token": token.key})


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(summary="Logout and invalidate token", tags=["auth"], request=None, responses={204: None})
    def post(self, request: Request) -> Response:
        request.user.auth_token.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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
        return SectionItem.objects.filter(
            section_id=self.kwargs["section_pk"]
        ).select_related("section", "created_by")

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
        return SectionProgress.objects.filter(
            user=self.request.user
        ).select_related("section")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
