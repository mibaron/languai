from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions
from rest_framework.request import Request
from rest_framework.response import Response

from .models import LearningGoal
from .serializers import LearningGoalSerializer


class LearningGoalListView(generics.ListAPIView):
    serializer_class = LearningGoalSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    @extend_schema(
        summary="List all learning goals",
        tags=["goals"],
    )
    def get(self, request: Request, *args: object, **kwargs: object) -> Response:
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return LearningGoal.objects.all()
