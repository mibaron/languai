import pytest

from apps.packs.models import SubscriptionStatus, UserPackSubscription

from .factories import PackFactory, UserPackSubscriptionFactory


@pytest.mark.django_db
class TestPackListView:
    def test_returns_packs_unauthenticated(self, api_client):
        PackFactory()
        response = api_client.get("/api/v1/packs/")
        assert response.status_code == 200
        assert len(response.data["results"]) == 1

    def test_excludes_inactive_packs(self, api_client):
        PackFactory(is_active=True)
        PackFactory(is_active=False)
        response = api_client.get("/api/v1/packs/")
        assert len(response.data["results"]) == 1

    def test_includes_subscriber_count(self, api_client):
        pack = PackFactory()
        UserPackSubscriptionFactory(pack=pack, status=SubscriptionStatus.ACTIVE)
        UserPackSubscriptionFactory(pack=pack, status=SubscriptionStatus.ARCHIVED)
        response = api_client.get("/api/v1/packs/")
        assert response.data["results"][0]["subscriber_count"] == 1

    def test_response_shape(self, api_client):
        PackFactory()
        response = api_client.get("/api/v1/packs/")
        pack = response.data["results"][0]
        assert "id" in pack
        assert "title" in pack
        assert "slug" in pack
        assert "level_code" in pack
        assert "base_language" in pack
        assert "description" in pack
        assert "grammar_count" in pack
        assert "vocab_count" in pack
        assert "exercise_count" in pack


@pytest.mark.django_db
class TestPackSubscribeView:
    def test_requires_auth(self, api_client):
        pack = PackFactory()
        response = api_client.post("/api/v1/packs/subscribe/", {"pack_id": str(pack.id)})
        assert response.status_code in (401, 403)

    def test_subscribes_to_pack(self, auth_client, user):
        pack = PackFactory()
        response = auth_client.post("/api/v1/packs/subscribe/", {"pack_id": str(pack.id)})
        assert response.status_code == 201
        assert response.data["status"] == "active"
        assert response.data["pack"]["id"] == str(pack.id)

    def test_returns_404_for_missing_pack(self, auth_client):
        response = auth_client.post(
            "/api/v1/packs/subscribe/",
            {"pack_id": "00000000-0000-0000-0000-000000000000"},
        )
        assert response.status_code == 404

    def test_returns_409_for_duplicate(self, auth_client, user):
        pack = PackFactory()
        auth_client.post("/api/v1/packs/subscribe/", {"pack_id": str(pack.id)})
        response = auth_client.post("/api/v1/packs/subscribe/", {"pack_id": str(pack.id)})
        assert response.status_code == 409


@pytest.mark.django_db
class TestUserPackSubscriptionListView:
    def test_requires_auth(self, api_client):
        response = api_client.get("/api/v1/packs/subscriptions/")
        assert response.status_code in (401, 403)

    def test_returns_user_subscriptions(self, auth_client, user):
        UserPackSubscriptionFactory(user=user)
        UserPackSubscriptionFactory()  # different user
        response = auth_client.get("/api/v1/packs/subscriptions/")
        assert response.status_code == 200
        assert len(response.data) == 1

    def test_filters_by_status(self, auth_client, user):
        UserPackSubscriptionFactory(user=user, status=SubscriptionStatus.ACTIVE)
        UserPackSubscriptionFactory(user=user, status=SubscriptionStatus.ARCHIVED)
        response = auth_client.get("/api/v1/packs/subscriptions/?status=active")
        assert len(response.data) == 1
        assert response.data[0]["status"] == "active"


@pytest.mark.django_db
class TestPackUnsubscribeView:
    def test_requires_auth(self, api_client):
        pack = PackFactory()
        response = api_client.delete(f"/api/v1/packs/{pack.id}/unsubscribe/")
        assert response.status_code in (401, 403)

    def test_unsubscribes(self, auth_client, user):
        sub = UserPackSubscriptionFactory(user=user)
        response = auth_client.delete(f"/api/v1/packs/{sub.pack.id}/unsubscribe/")
        assert response.status_code == 204
        assert not UserPackSubscription.objects.filter(id=sub.id).exists()

    def test_returns_404_when_not_subscribed(self, auth_client):
        pack = PackFactory()
        response = auth_client.delete(f"/api/v1/packs/{pack.id}/unsubscribe/")
        assert response.status_code == 404


@pytest.mark.django_db
class TestPackArchiveView:
    def test_requires_auth(self, api_client):
        pack = PackFactory()
        response = api_client.post(f"/api/v1/packs/{pack.id}/archive/")
        assert response.status_code in (401, 403)

    def test_archives_active_subscription(self, auth_client, user):
        sub = UserPackSubscriptionFactory(user=user, status=SubscriptionStatus.ACTIVE)
        response = auth_client.post(f"/api/v1/packs/{sub.pack.id}/archive/")
        assert response.status_code == 200
        assert response.data["status"] == "archived"

    def test_returns_404_when_not_active(self, auth_client, user):
        sub = UserPackSubscriptionFactory(user=user, status=SubscriptionStatus.ARCHIVED)
        response = auth_client.post(f"/api/v1/packs/{sub.pack.id}/archive/")
        assert response.status_code == 404


@pytest.mark.django_db
class TestPackUnarchiveView:
    def test_requires_auth(self, api_client):
        pack = PackFactory()
        response = api_client.post(f"/api/v1/packs/{pack.id}/unarchive/")
        assert response.status_code in (401, 403)

    def test_unarchives_subscription(self, auth_client, user):
        sub = UserPackSubscriptionFactory(user=user, status=SubscriptionStatus.ARCHIVED)
        response = auth_client.post(f"/api/v1/packs/{sub.pack.id}/unarchive/")
        assert response.status_code == 200
        assert response.data["status"] == "active"

    def test_returns_404_when_not_archived(self, auth_client, user):
        sub = UserPackSubscriptionFactory(user=user, status=SubscriptionStatus.ACTIVE)
        response = auth_client.post(f"/api/v1/packs/{sub.pack.id}/unarchive/")
        assert response.status_code == 404
