from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    LevelViewSet,
    LoginView,
    LogoutView,
    MeView,
    RegisterView,
    SectionItemViewSet,
    SectionProgressViewSet,
    SectionViewSet,
)

router = DefaultRouter()
router.register("levels", LevelViewSet, basename="level")
router.register("sections", SectionViewSet, basename="section")
router.register("progress", SectionProgressViewSet, basename="progress")

items_router = DefaultRouter()
items_router.register("", SectionItemViewSet, basename="section-item")

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/me/", MeView.as_view(), name="auth-me"),
    path("sections/<uuid:section_pk>/items/", include(items_router.urls)),
    path("", include(router.urls)),
]
