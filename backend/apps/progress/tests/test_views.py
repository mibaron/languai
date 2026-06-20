import pytest
from rest_framework.test import APIClient

from apps.content.tests.factories import PageFactory
from apps.packs.tests.factories import UserFactory
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
