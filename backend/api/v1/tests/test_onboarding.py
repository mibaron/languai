import pytest
from rest_framework.test import APIClient

from apps.packs.tests.factories import LevelFactory, PackFactory, UserFactory


@pytest.fixture
def user():
    return UserFactory()


@pytest.fixture
def auth_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestOnboardingGet:
    def test_requires_auth(self, api_client):
        response = api_client.get("/api/v1/onboarding/")
        assert response.status_code in (401, 403)

    def test_returns_default_status_for_new_user(self, auth_client):
        response = auth_client.get("/api/v1/onboarding/")
        assert response.status_code == 200
        assert response.data["is_onboarded"] is False
        assert response.data["native_language"] == "en"
        assert response.data["current_level"] == "A1.1"
        assert response.data["pack_ids"] == []

    def test_returns_onboarded_status(self, auth_client, user):
        user.is_onboarded = True
        user.native_language = "fa"
        user.save(update_fields=["is_onboarded", "native_language"])

        response = auth_client.get("/api/v1/onboarding/")
        assert response.status_code == 200
        assert response.data["is_onboarded"] is True
        assert response.data["native_language"] == "fa"

    def test_includes_active_pack_ids(self, auth_client, user):
        level = LevelFactory(code="A1.1")
        pack = PackFactory(level=level)
        from apps.packs.services import subscribe_to_pack
        subscribe_to_pack(user=user, pack_id=str(pack.id))

        response = auth_client.get("/api/v1/onboarding/")
        assert str(pack.id) in [str(pid) for pid in response.data["pack_ids"]]


@pytest.mark.django_db
class TestOnboardingPost:
    def test_requires_auth(self, api_client):
        response = api_client.post("/api/v1/onboarding/", {})
        assert response.status_code in (401, 403)

    def test_requires_native_language(self, auth_client):
        response = auth_client.post("/api/v1/onboarding/", {"pack_ids": ["some-id"]}, format="json")
        assert response.status_code == 400

    def test_requires_at_least_one_pack(self, auth_client):
        response = auth_client.post("/api/v1/onboarding/", {"native_language": "en", "pack_ids": []}, format="json")
        assert response.status_code == 400

    def test_completes_onboarding(self, auth_client, user):
        level = LevelFactory(code="A1.1")
        pack = PackFactory(level=level)

        response = auth_client.post("/api/v1/onboarding/", {
            "native_language": "fa",
            "pack_ids": [str(pack.id)],
        }, format="json")

        assert response.status_code == 200
        assert response.data["is_onboarded"] is True
        assert response.data["native_language"] == "fa"
        assert response.data["current_level"] == level.code

        user.refresh_from_db()
        assert user.is_onboarded is True
        assert user.native_language == "fa"

    def test_subscribes_to_packs(self, auth_client, user):
        level = LevelFactory(code="A1.1")
        pack1 = PackFactory(level=level)
        pack2 = PackFactory(level=level)

        auth_client.post("/api/v1/onboarding/", {
            "native_language": "en",
            "pack_ids": [str(pack1.id), str(pack2.id)],
        }, format="json")

        assert user.pack_subscriptions.filter(status="active").count() == 2

    def test_skips_invalid_pack_ids(self, auth_client, user):
        level = LevelFactory(code="A1.1")
        pack = PackFactory(level=level)

        response = auth_client.post("/api/v1/onboarding/", {
            "native_language": "en",
            "pack_ids": [str(pack.id), "00000000-0000-0000-0000-000000000000"],
        }, format="json")

        assert response.status_code == 200
        assert len(response.data["pack_ids"]) == 1

    def test_sets_current_level_from_first_pack(self, auth_client, user):
        level_a12 = LevelFactory(code="A1.2")
        pack = PackFactory(level=level_a12)

        response = auth_client.post("/api/v1/onboarding/", {
            "native_language": "en",
            "pack_ids": [str(pack.id)],
        }, format="json")

        assert response.data["current_level"] == "A1.2"
        user.refresh_from_db()
        assert user.current_level == "A1.2"

    def test_idempotent_pack_subscription(self, auth_client, user):
        level = LevelFactory(code="A1.1")
        pack = PackFactory(level=level)
        from apps.packs.services import subscribe_to_pack
        subscribe_to_pack(user=user, pack_id=str(pack.id))

        response = auth_client.post("/api/v1/onboarding/", {
            "native_language": "en",
            "pack_ids": [str(pack.id)],
        }, format="json")

        assert response.status_code == 200
        assert user.pack_subscriptions.filter(status="active").count() == 1
