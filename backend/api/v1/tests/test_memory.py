from datetime import timedelta

import pytest
from django.utils import timezone
from rest_framework.test import APIClient

from apps.knowledge.tests.factories import LexicalItemFactory
from apps.memory_engine.constants import SkillType
from apps.memory_engine.tests.factories import MemoryStateFactory
from apps.packs.models import SubscriptionStatus, UserPackSubscription
from apps.packs.tests.factories import PackFactory, UserFactory


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
class TestSessionView:
    def test_requires_auth(self, api_client):
        response = api_client.get("/api/v1/memory/session/")
        assert response.status_code in (401, 403)

    def test_returns_empty_when_no_subscriptions(self, auth_client):
        response = auth_client.get("/api/v1/memory/session/")
        assert response.status_code == 200
        assert response.data == []

    def test_returns_empty_when_no_items(self, auth_client, user):
        pack = PackFactory()
        UserPackSubscription.objects.create(
            user=user, pack=pack, status=SubscriptionStatus.ACTIVE
        )
        response = auth_client.get("/api/v1/memory/session/")
        assert response.status_code == 200
        assert response.data == []

    def test_returns_due_items(self, auth_client, user):
        pack = PackFactory()
        item = LexicalItemFactory()
        pack.items.add(item)
        UserPackSubscription.objects.create(
            user=user, pack=pack, status=SubscriptionStatus.ACTIVE
        )
        MemoryStateFactory(
            user=user,
            item=item,
            skill_type=SkillType.RECOGNITION,
            next_due=timezone.now() - timedelta(hours=1),
        )

        response = auth_client.get("/api/v1/memory/session/")
        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0]["item_id"] == str(item.id)
        assert response.data[0]["is_new"] is False

    def test_returns_new_items_when_no_due(self, auth_client, user):
        pack = PackFactory()
        item = LexicalItemFactory()
        pack.items.add(item)
        UserPackSubscription.objects.create(
            user=user, pack=pack, status=SubscriptionStatus.ACTIVE
        )

        response = auth_client.get("/api/v1/memory/session/")
        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0]["item_id"] == str(item.id)
        assert response.data[0]["is_new"] is True

    def test_respects_max_items_param(self, auth_client, user):
        pack = PackFactory()
        for _ in range(5):
            item = LexicalItemFactory()
            pack.items.add(item)
        UserPackSubscription.objects.create(
            user=user, pack=pack, status=SubscriptionStatus.ACTIVE
        )

        response = auth_client.get("/api/v1/memory/session/?max_items=2")
        assert response.status_code == 200
        assert len(response.data) == 2

    def test_session_item_shape(self, auth_client, user):
        pack = PackFactory()
        item = LexicalItemFactory(text="Haus", translation="house", type="vocab")
        pack.items.add(item)
        UserPackSubscription.objects.create(
            user=user, pack=pack, status=SubscriptionStatus.ACTIVE
        )

        response = auth_client.get("/api/v1/memory/session/")
        assert response.status_code == 200
        entry = response.data[0]
        assert entry["item_text"] == "Haus"
        assert entry["item_translation"] == "house"
        assert entry["item_type"] == "vocab"
        assert entry["skill_type"] == SkillType.RECOGNITION
        assert "retrievability" in entry


@pytest.mark.django_db
class TestReviewView:
    def test_requires_auth(self, api_client):
        response = api_client.post("/api/v1/memory/review/", {})
        assert response.status_code in (401, 403)

    def test_valid_review_returns_state(self, auth_client, user):
        item = LexicalItemFactory()
        response = auth_client.post(
            "/api/v1/memory/review/",
            {
                "item_id": str(item.id),
                "skill_type": SkillType.RECOGNITION,
                "rating": 3,
            },
            format="json",
        )
        assert response.status_code == 200
        assert "next_due" in response.data
        assert "difficulty" in response.data
        assert "stability" in response.data
        assert response.data["reps"] == 1
        assert response.data["lapses"] == 0

    def test_again_rating_increments_lapses_on_second_review(self, auth_client, user):
        item = LexicalItemFactory()
        auth_client.post(
            "/api/v1/memory/review/",
            {
                "item_id": str(item.id),
                "skill_type": SkillType.RECOGNITION,
                "rating": 3,
            },
            format="json",
        )
        response = auth_client.post(
            "/api/v1/memory/review/",
            {
                "item_id": str(item.id),
                "skill_type": SkillType.RECOGNITION,
                "rating": 1,
            },
            format="json",
        )
        assert response.status_code == 200
        assert response.data["lapses"] == 1

    def test_invalid_rating_too_high(self, auth_client):
        item = LexicalItemFactory()
        response = auth_client.post(
            "/api/v1/memory/review/",
            {
                "item_id": str(item.id),
                "skill_type": SkillType.RECOGNITION,
                "rating": 5,
            },
            format="json",
        )
        assert response.status_code == 400

    def test_invalid_rating_too_low(self, auth_client):
        item = LexicalItemFactory()
        response = auth_client.post(
            "/api/v1/memory/review/",
            {
                "item_id": str(item.id),
                "skill_type": SkillType.RECOGNITION,
                "rating": 0,
            },
            format="json",
        )
        assert response.status_code == 400

    def test_missing_required_fields(self, auth_client):
        response = auth_client.post(
            "/api/v1/memory/review/",
            {"rating": 3},
            format="json",
        )
        assert response.status_code == 400

    def test_nonexistent_item_returns_404(self, auth_client):
        response = auth_client.post(
            "/api/v1/memory/review/",
            {
                "item_id": "00000000-0000-0000-0000-000000000000",
                "skill_type": SkillType.RECOGNITION,
                "rating": 3,
            },
            format="json",
        )
        assert response.status_code == 404

    def test_with_response_time(self, auth_client):
        item = LexicalItemFactory()
        response = auth_client.post(
            "/api/v1/memory/review/",
            {
                "item_id": str(item.id),
                "skill_type": SkillType.RECOGNITION,
                "rating": 3,
                "response_time_ms": 2500,
            },
            format="json",
        )
        assert response.status_code == 200
