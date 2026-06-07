from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AIContentDeleteView,
    AIContentSaveView,
    AIContentShareView,
    AIGenerateView,
    AIItemContentView,
    GoogleLoginView,
    LevelViewSet,
    LLMModelListView,
    LoginView,
    LogoutView,
    MeView,
    RegisterView,
    SectionItemViewSet,
    SectionProgressViewSet,
    SectionViewSet,
    SharedAIContentView,
    UserCreditView,
    UserSavedAIContentDeleteView,
    UserSavedAIContentView,
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
    path("auth/google/", GoogleLoginView.as_view(), name="auth-google"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/me/", MeView.as_view(), name="auth-me"),
    path("ai/models/", LLMModelListView.as_view(), name="ai-models"),
    path("ai/credit/", UserCreditView.as_view(), name="ai-credit"),
    path("ai/item-content/", AIItemContentView.as_view(), name="ai-item-content"),
    path("ai/content/<uuid:pk>/", AIContentDeleteView.as_view(), name="ai-content-delete"),
    path("ai/generate/", AIGenerateView.as_view(), name="ai-generate"),
    path("ai/saved/", UserSavedAIContentView.as_view(), name="ai-saved-list"),
    path("ai/<uuid:pk>/save/", AIContentSaveView.as_view(), name="ai-save"),
    path("ai/saved/<uuid:pk>/", UserSavedAIContentDeleteView.as_view(), name="ai-saved-delete"),
    path("ai/saved/<uuid:pk>/share/", AIContentShareView.as_view(), name="ai-share"),
    path("ai/shared/<str:share_key>/", SharedAIContentView.as_view(), name="ai-shared"),
    path("sections/<uuid:section_pk>/items/", include(items_router.urls)),
    path("", include(router.urls)),
]
