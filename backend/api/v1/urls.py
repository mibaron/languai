from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.ai_content.views import (
    AIContentDeleteView,
    AIContentSaveView,
    AIContentShareView,
    AIGenerateView,
    AIItemContentView,
    LLMModelListView,
    SharedAIContentView,
    UserCreditView,
    UserSavedAIContentDeleteView,
    UserSavedAIContentView,
)
from apps.content.views import (
    LevelViewSet,
    PackPageDetailView,
    PackPageListView,
    SectionItemViewSet,
    SectionViewSet,
)
from apps.exercise_engine.views import AvailableExerciseTypesView, ExerciseSessionView
from apps.knowledge.views import LearningGoalListView
from apps.memory_engine.views import ReviewView, SessionView
from apps.packs.views import (
    PackArchiveView,
    PackListView,
    PackSubscribeView,
    PackUnarchiveView,
    PackUnsubscribeView,
    UserPackSubscriptionListView,
)
from apps.progress.views import MarkPageStudiedView, PackProgressView, ResetPackProgressView, SectionProgressViewSet
from apps.users.views import (
    ChangePasswordView,
    ForgotPasswordView,
    GoogleLoginView,
    LoginView,
    LogoutView,
    MeView,
    OnboardingView,
    RegisterView,
    ResetPasswordView,
)

router = DefaultRouter()
router.register("levels", LevelViewSet, basename="level")
router.register("sections", SectionViewSet, basename="section")
router.register("progress", SectionProgressViewSet, basename="progress")

items_router = DefaultRouter()
items_router.register("", SectionItemViewSet, basename="section-item")

urlpatterns = [
    # Auth
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/google/", GoogleLoginView.as_view(), name="auth-google"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/me/", MeView.as_view(), name="auth-me"),
    path("auth/change-password/", ChangePasswordView.as_view(), name="auth-change-password"),
    path("auth/forgot-password/", ForgotPasswordView.as_view(), name="auth-forgot-password"),
    path("auth/reset-password/", ResetPasswordView.as_view(), name="auth-reset-password"),
    # Onboarding
    path("onboarding/", OnboardingView.as_view(), name="onboarding"),
    # AI Content
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
    # Packs
    path("packs/", PackListView.as_view(), name="pack-list"),
    path("packs/subscribe/", PackSubscribeView.as_view(), name="pack-subscribe"),
    path("packs/subscriptions/", UserPackSubscriptionListView.as_view(), name="pack-subscriptions"),
    path(
        "packs/<uuid:pack_id>/unsubscribe/", PackUnsubscribeView.as_view(), name="pack-unsubscribe"
    ),
    path("packs/<uuid:pack_id>/archive/", PackArchiveView.as_view(), name="pack-archive"),
    path("packs/<uuid:pack_id>/unarchive/", PackUnarchiveView.as_view(), name="pack-unarchive"),
    # Pack pages
    path("packs/<uuid:pack_id>/pages/", PackPageListView.as_view(), name="pack-page-list"),
    path(
        "packs/<uuid:pack_id>/pages/<uuid:page_id>/",
        PackPageDetailView.as_view(),
        name="pack-page-detail",
    ),
    # Goals
    path("goals/", LearningGoalListView.as_view(), name="goal-list"),
    # Exercises
    path("exercises/session/", ExerciseSessionView.as_view(), name="exercise-session"),
    path("exercises/available-types/", AvailableExerciseTypesView.as_view(), name="exercise-available-types"),
    # Memory Engine
    path("memory/session/", SessionView.as_view(), name="memory-session"),
    path("memory/review/", ReviewView.as_view(), name="memory-review"),
    # Page progress
    path(
        "progress/pages/<uuid:page_id>/mark-studied/",
        MarkPageStudiedView.as_view(),
        name="page-mark-studied",
    ),
    path(
        "progress/packs/<uuid:pack_id>/",
        PackProgressView.as_view(),
        name="pack-progress",
    ),
    path(
        "progress/packs/<uuid:pack_id>/reset/",
        ResetPackProgressView.as_view(),
        name="pack-progress-reset",
    ),
    # Nested routes
    path("sections/<uuid:section_pk>/items/", include(items_router.urls)),
    path("", include(router.urls)),
]
