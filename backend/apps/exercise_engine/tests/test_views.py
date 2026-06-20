import pytest
from rest_framework.test import APIClient

from apps.knowledge.constants import LexicalItemType
from apps.knowledge.models import LexicalItem
from apps.packs.models import PackItem
from apps.packs.services import subscribe_to_pack
from apps.packs.tests.factories import LevelFactory, PackFactory, UserFactory

from .factories import (
    ErrorCorrectionExerciseFactory,
    ExerciseFactory,
    FillBlankExerciseFactory,
    FlashcardExerciseFactory,
    MatchingExerciseFactory,
    MatchingPairFactory,
    MCQChoiceFactory,
    MCQExerciseFactory,
    SentenceOrderExerciseFactory,
)


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


@pytest.mark.django_db
class TestStoredExerciseSessionView:
    def test_requires_auth(self, api_client):
        response = api_client.get("/api/v1/exercises/stored-session/")
        assert response.status_code in (401, 403)

    def test_no_subscriptions_returns_empty(self, auth_client):
        response = auth_client.get("/api/v1/exercises/stored-session/")
        assert response.status_code == 200
        assert response.data == []

    def test_returns_flashcard(self, auth_client, user):
        pack = PackFactory()
        subscribe_to_pack(user=user, pack_id=str(pack.id))
        ex = ExerciseFactory(pack=pack, exercise_type="flashcard")
        FlashcardExerciseFactory(exercise=ex, front_text="der Hund", back_text="the dog")

        response = auth_client.get("/api/v1/exercises/stored-session/")
        assert response.status_code == 200
        assert len(response.data) == 1
        data = response.data[0]
        assert data["exercise_type"] == "flashcard"
        assert data["item_id"] == str(ex.item.id)
        assert data["item_text"] == ex.item.text
        assert data["detail"]["front_text"] == "der Hund"
        assert data["detail"]["back_text"] == "the dog"

    def test_returns_mcq_with_choices(self, auth_client, user):
        pack = PackFactory()
        subscribe_to_pack(user=user, pack_id=str(pack.id))
        ex = ExerciseFactory(pack=pack, exercise_type="mcq_recognition")
        mcq = MCQExerciseFactory(exercise=ex, question="What is 'Hund'?")
        MCQChoiceFactory(mcq=mcq, text="dog", is_correct=True, order=0)
        MCQChoiceFactory(mcq=mcq, text="cat", is_correct=False, order=1)

        response = auth_client.get("/api/v1/exercises/stored-session/")
        data = response.data[0]
        assert data["exercise_type"] == "mcq_recognition"
        assert data["detail"]["question"] == "What is 'Hund'?"
        assert len(data["detail"]["choices"]) == 2
        assert data["detail"]["choices"][0]["is_correct"] is True

    def test_returns_fill_blank(self, auth_client, user):
        pack = PackFactory()
        subscribe_to_pack(user=user, pack_id=str(pack.id))
        ex = ExerciseFactory(pack=pack, exercise_type="fill_blank")
        FillBlankExerciseFactory(
            exercise=ex, text_before="Ich", text_after="Anna.",
            answer="heiße", accept_alternatives=["heisse"],
        )

        response = auth_client.get("/api/v1/exercises/stored-session/")
        detail = response.data[0]["detail"]
        assert detail["answer"] == "heiße"
        assert detail["accept_alternatives"] == ["heisse"]

    def test_returns_sentence_order(self, auth_client, user):
        pack = PackFactory()
        subscribe_to_pack(user=user, pack_id=str(pack.id))
        ex = ExerciseFactory(pack=pack, exercise_type="sentence_order")
        SentenceOrderExerciseFactory(
            exercise=ex,
            jumbled_words=["gehe", "ich", "Supermarkt", "zum"],
            correct_answers=[["Ich", "gehe", "zum", "Supermarkt"]],
        )

        response = auth_client.get("/api/v1/exercises/stored-session/")
        detail = response.data[0]["detail"]
        assert detail["jumbled_words"] == ["gehe", "ich", "Supermarkt", "zum"]
        assert len(detail["correct_answers"]) == 1

    def test_returns_error_correction(self, auth_client, user):
        pack = PackFactory()
        subscribe_to_pack(user=user, pack_id=str(pack.id))
        ex = ExerciseFactory(pack=pack, exercise_type="error_correction")
        ErrorCorrectionExerciseFactory(
            exercise=ex,
            sentence="Ich sehe der Mann",
            error_start=9, error_end=12,
            correct_replacement="den",
        )

        response = auth_client.get("/api/v1/exercises/stored-session/")
        detail = response.data[0]["detail"]
        assert detail["sentence"] == "Ich sehe der Mann"
        assert detail["correct_replacement"] == "den"

    def test_returns_matching_with_pairs(self, auth_client, user):
        pack = PackFactory()
        subscribe_to_pack(user=user, pack_id=str(pack.id))
        ex = ExerciseFactory(pack=pack, exercise_type="matching")
        m = MatchingExerciseFactory(exercise=ex, instruction="Match pronouns")
        MatchingPairFactory(matching=m, left="ich", right="mir", order=0)
        MatchingPairFactory(matching=m, left="du", right="dir", order=1)

        response = auth_client.get("/api/v1/exercises/stored-session/")
        detail = response.data[0]["detail"]
        assert detail["instruction"] == "Match pronouns"
        assert len(detail["pairs"]) == 2
        assert detail["pairs"][0]["left"] == "ich"

    def test_filter_by_exercise_type(self, auth_client, user):
        pack = PackFactory()
        subscribe_to_pack(user=user, pack_id=str(pack.id))
        fc_ex = ExerciseFactory(pack=pack, exercise_type="flashcard")
        FlashcardExerciseFactory(exercise=fc_ex)
        fb_ex = ExerciseFactory(pack=pack, exercise_type="fill_blank")
        FillBlankExerciseFactory(exercise=fb_ex)

        response = auth_client.get(
            "/api/v1/exercises/stored-session/?exercise_type=fill_blank"
        )
        assert len(response.data) == 1
        assert response.data[0]["exercise_type"] == "fill_blank"

    def test_excludes_inactive(self, auth_client, user):
        pack = PackFactory()
        subscribe_to_pack(user=user, pack_id=str(pack.id))
        ex = ExerciseFactory(pack=pack, is_active=False)
        FlashcardExerciseFactory(exercise=ex)

        response = auth_client.get("/api/v1/exercises/stored-session/")
        assert response.data == []

    def test_respects_max_items(self, auth_client, user):
        pack = PackFactory()
        subscribe_to_pack(user=user, pack_id=str(pack.id))
        for _ in range(5):
            ex = ExerciseFactory(pack=pack, exercise_type="flashcard")
            FlashcardExerciseFactory(exercise=ex)

        response = auth_client.get(
            "/api/v1/exercises/stored-session/?max_items=2"
        )
        assert len(response.data) == 2

    def test_exercise_without_detail_returns_null(self, auth_client, user):
        pack = PackFactory()
        subscribe_to_pack(user=user, pack_id=str(pack.id))
        ExerciseFactory(pack=pack, exercise_type="flashcard")

        response = auth_client.get("/api/v1/exercises/stored-session/")
        assert response.data[0]["detail"] is None
