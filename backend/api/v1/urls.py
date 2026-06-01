from rest_framework.routers import DefaultRouter

from .views import LevelViewSet, SectionProgressViewSet, SectionViewSet

router = DefaultRouter()
router.register("levels", LevelViewSet, basename="level")
router.register("sections", SectionViewSet, basename="section")
router.register("progress", SectionProgressViewSet, basename="progress")

urlpatterns = router.urls
