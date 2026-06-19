import pytest
from rest_framework.test import APIClient

from apps.knowledge.constants import LexicalItemType
from apps.knowledge.models import LexicalItem
from apps.packs.models import PackItem
from apps.packs.services import subscribe_to_pack
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


@pytest.fixture
def pack_with_items():
    level = LevelFactory(code="T1.1")
    pack = PackFactory(level=level)
    for i in range(6):
        item = LexicalItem.objects.create(
            text=f"Wort{i}",
            translation=f"word{i}",
            type=LexicalItemType.VOCAB,
            level=level,
        )
        PackItem.objects.create(pack=pack, item=item, order=i)
    return pack


@pytest.mark.django_db
class TestExerciseSessionView:
    def test_requires_auth(self, api_client):
        response = api_client.get("/api/v1/exercises/session/?exercise_type=flashcard")
        assert response.status_code in (401, 403)

    def test_requires_exercise_type(self, auth_client):
        response = auth_client.get("/api/v1/exercises/session/")
        assert response.status_code == 400

    def test_invalid_exercise_type(self, auth_client):
        response = auth_client.get("/api/v1/exercises/session/?exercise_type=invalid")
        assert response.status_code == 400

    def test_no_subscriptions_returns_empty(self, auth_client):
        response = auth_client.get("/api/v1/exercises/session/?exercise_type=flashcard")
        assert response.status_code == 200
        assert response.data == []

    def test_flashcard_session(self, auth_client, user, pack_with_items):
        subscribe_to_pack(user=user, pack_id=str(pack_with_items.id))

        response = auth_client.get("/api/v1/exercises/session/?exercise_type=flashcard")
        assert response.status_code == 200
        assert len(response.data) > 0
        first = response.data[0]
        assert first["exercise_type"] == "flashcard"
        assert "front_text" in first
        assert "back_text" in first
        assert "item_id" in first
        assert "skill_type" in first

    def test_mcq_session(self, auth_client, user, pack_with_items):
        subscribe_to_pack(user=user, pack_id=str(pack_with_items.id))

        response = auth_client.get("/api/v1/exercises/session/?exercise_type=mcq_recognition")
        assert response.status_code == 200
        assert len(response.data) > 0
        first = response.data[0]
        assert first["exercise_type"] == "mcq_recognition"
        assert "prompt_text" in first
        assert "choices" in first
        assert "correct_choice_id" in first
        assert len(first["choices"]) >= 3

    def test_respects_max_items(self, auth_client, user, pack_with_items):
        subscribe_to_pack(user=user, pack_id=str(pack_with_items.id))

        response = auth_client.get(
            "/api/v1/exercises/session/?exercise_type=flashcard&max_items=2"
        )
        assert response.status_code == 200
        assert len(response.data) <= 2

    def test_mcq_choices_contain_correct(self, auth_client, user, pack_with_items):
        subscribe_to_pack(user=user, pack_id=str(pack_with_items.id))

        response = auth_client.get(
            "/api/v1/exercises/session/?exercise_type=mcq_recognition&max_items=1"
        )
        ex = response.data[0]
        choice_ids = [c["id"] for c in ex["choices"]]
        assert ex["correct_choice_id"] in choice_ids
