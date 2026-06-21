import pytest
from django.utils import timezone
from rest_framework.test import APIClient

from apps.content.tests.factories import PageFactory
from apps.packs.tests.factories import PackFactory, UserFactory
from apps.progress.models import UserPageProgress


@pytest.fixture
def user():
    return UserFactory()


@pytest.fixture
def auth_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.mark.django_db
class TestMarkPageStudiedView:
    def test_unauthenticated(self):
        page = PageFactory()
        client = APIClient()
        response = client.post(f"/api/v1/progress/pages/{page.id}/mark-studied/")
        assert response.status_code in (401, 403)

    def test_mark_page_studied(self, auth_client, user):
        page = PageFactory()
        response = auth_client.post(f"/api/v1/progress/pages/{page.id}/mark-studied/")
        assert response.status_code == 200
        assert response.data["completed_at"] is not None
        assert response.data["page_title"] == page.title
        assert UserPageProgress.objects.filter(user=user, page=page).exists()

    def test_idempotent(self, auth_client, user):
        page = PageFactory()
        r1 = auth_client.post(f"/api/v1/progress/pages/{page.id}/mark-studied/")
        r2 = auth_client.post(f"/api/v1/progress/pages/{page.id}/mark-studied/")
        assert r1.status_code == 200
        assert r2.status_code == 200
        assert r1.data["completed_at"] == r2.data["completed_at"]
        assert UserPageProgress.objects.filter(user=user, page=page).count() == 1

    def test_different_users_independent(self):
        page = PageFactory()
        user1 = UserFactory()
        user2 = UserFactory()
        client1 = APIClient()
        client1.force_authenticate(user=user1)
        client2 = APIClient()
        client2.force_authenticate(user=user2)

        client1.post(f"/api/v1/progress/pages/{page.id}/mark-studied/")
        client2.post(f"/api/v1/progress/pages/{page.id}/mark-studied/")

        assert UserPageProgress.objects.filter(page=page).count() == 2


@pytest.mark.django_db
class TestResetPackProgressView:
    def test_unauthenticated(self):
        pack = PackFactory()
        client = APIClient()
        response = client.post(f"/api/v1/progress/packs/{pack.id}/reset/")
        assert response.status_code in (401, 403)

    def test_resets_all_pages_in_pack(self, auth_client, user):
        pack = PackFactory()
        page1 = PageFactory(pack=pack)
        page2 = PageFactory(pack=pack)
        UserPageProgress.objects.create(user=user, page=page1, completed_at=timezone.now())
        UserPageProgress.objects.create(user=user, page=page2, completed_at=timezone.now())

        response = auth_client.post(f"/api/v1/progress/packs/{pack.id}/reset/")
        assert response.status_code == 200
        assert response.data["deleted_count"] == 2
        assert UserPageProgress.objects.filter(user=user, page__pack=pack).count() == 0

    def test_does_not_affect_other_packs(self, auth_client, user):
        pack1 = PackFactory()
        pack2 = PackFactory()
        page1 = PageFactory(pack=pack1)
        page2 = PageFactory(pack=pack2)
        UserPageProgress.objects.create(user=user, page=page1, completed_at=timezone.now())
        UserPageProgress.objects.create(user=user, page=page2, completed_at=timezone.now())

        auth_client.post(f"/api/v1/progress/packs/{pack1.id}/reset/")
        assert UserPageProgress.objects.filter(user=user, page=page2).exists()

    def test_does_not_affect_other_users(self, auth_client, user):
        pack = PackFactory()
        page = PageFactory(pack=pack)
        other_user = UserFactory()
        UserPageProgress.objects.create(user=user, page=page, completed_at=timezone.now())
        UserPageProgress.objects.create(user=other_user, page=page, completed_at=timezone.now())

        auth_client.post(f"/api/v1/progress/packs/{pack.id}/reset/")
        assert UserPageProgress.objects.filter(user=other_user, page=page).exists()

    def test_returns_zero_when_nothing_to_reset(self, auth_client):
        pack = PackFactory()
        response = auth_client.post(f"/api/v1/progress/packs/{pack.id}/reset/")
        assert response.status_code == 200
        assert response.data["deleted_count"] == 0
