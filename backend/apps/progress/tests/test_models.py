import pytest
from django.db import IntegrityError
from django.utils import timezone

from apps.content.tests.factories import PageFactory
from apps.packs.tests.factories import UserFactory
from apps.progress.models import UserPageProgress


@pytest.mark.django_db
class TestUserPageProgress:
    def test_create(self):
        user = UserFactory()
        page = PageFactory()
        now = timezone.now()
        progress = UserPageProgress.objects.create(
            user=user, page=page, completed_at=now,
        )
        assert progress.completed_at == now
        assert progress.user == user
        assert progress.page == page

    def test_unique_user_page(self):
        user = UserFactory()
        page = PageFactory()
        UserPageProgress.objects.create(user=user, page=page)
        with pytest.raises(IntegrityError):
            UserPageProgress.objects.create(user=user, page=page)

    def test_same_user_different_pages(self):
        user = UserFactory()
        p1 = PageFactory()
        p2 = PageFactory()
        UserPageProgress.objects.create(user=user, page=p1, completed_at=timezone.now())
        UserPageProgress.objects.create(user=user, page=p2, completed_at=timezone.now())
        assert UserPageProgress.objects.filter(user=user).count() == 2

    def test_completed_at_nullable(self):
        user = UserFactory()
        page = PageFactory()
        progress = UserPageProgress.objects.create(user=user, page=page)
        assert progress.completed_at is None

    def test_str(self):
        user = UserFactory()
        page = PageFactory(title="Greetings")
        progress = UserPageProgress.objects.create(
            user=user, page=page, completed_at=timezone.now(),
        )
        assert "studied" in str(progress)
        assert "Greetings" in str(progress)

    def test_str_not_studied(self):
        user = UserFactory()
        page = PageFactory()
        progress = UserPageProgress.objects.create(user=user, page=page)
        assert "not studied" in str(progress)
