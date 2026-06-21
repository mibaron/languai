import pytest
from django.utils import timezone
from rest_framework.test import APIClient

from apps.content.tests.factories import PageFactory
from apps.packs.services import subscribe_to_pack
from apps.packs.tests.factories import PackFactory, UserFactory
from apps.progress.models import UserPageProgress

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

SESSION_URL = "/api/v1/exercises/session/"
AVAILABLE_TYPES_URL = "/api/v1/exercises/available-types/"


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


def _setup_pack_with_studied_page(user):
    pack = PackFactory()
    page = PageFactory(pack=pack)
    subscribe_to_pack(user=user, pack_id=str(pack.id))
    UserPageProgress.objects.create(user=user, page=page, completed_at=timezone.now())
    return pack, page


@pytest.mark.django_db
class TestExerciseSessionView:
    def test_requires_auth(self, api_client):
        response = api_client.get(f"{SESSION_URL}?exercise_type=flashcard")
        assert response.status_code in (401, 403)

    def test_invalid_exercise_type(self, auth_client):
        response = auth_client.get(f"{SESSION_URL}?exercise_type=invalid")
        assert response.status_code == 400

    def test_no_subscriptions_returns_empty(self, auth_client):
        response = auth_client.get(f"{SESSION_URL}?exercise_type=flashcard")
        assert response.status_code == 200
        assert response.data == []

    def test_returns_all_types_without_filter(self, auth_client, user):
        pack, page = _setup_pack_with_studied_page(user)
        fc_ex = ExerciseFactory(pack=pack, page=page, exercise_type="flashcard")
        FlashcardExerciseFactory(exercise=fc_ex)
        fb_ex = ExerciseFactory(pack=pack, page=page, exercise_type="fill_blank")
        FillBlankExerciseFactory(exercise=fb_ex)

        response = auth_client.get(SESSION_URL)
        assert response.status_code == 200
        assert len(response.data) == 2

    def test_excludes_exercises_from_unstudied_page(self, auth_client, user):
        pack = PackFactory()
        subscribe_to_pack(user=user, pack_id=str(pack.id))
        page = PageFactory(pack=pack)
        ex = ExerciseFactory(pack=pack, page=page)
        FlashcardExerciseFactory(exercise=ex)

        response = auth_client.get(SESSION_URL)
        assert response.status_code == 200
        assert response.data == []

    def test_filter_by_exercise_type(self, auth_client, user):
        pack, page = _setup_pack_with_studied_page(user)
        fc_ex = ExerciseFactory(pack=pack, page=page, exercise_type="flashcard")
        FlashcardExerciseFactory(exercise=fc_ex)
        fb_ex = ExerciseFactory(pack=pack, page=page, exercise_type="fill_blank")
        FillBlankExerciseFactory(exercise=fb_ex)

        response = auth_client.get(f"{SESSION_URL}?exercise_type=fill_blank")
        assert len(response.data) == 1
        assert response.data[0]["exercise_type"] == "fill_blank"

    def test_flashcard_flat_shape(self, auth_client, user):
        pack, page = _setup_pack_with_studied_page(user)
        ex = ExerciseFactory(pack=pack, page=page, exercise_type="flashcard")
        FlashcardExerciseFactory(exercise=ex, front_text="der Hund", back_text="the dog")

        response = auth_client.get(f"{SESSION_URL}?exercise_type=flashcard")
        assert response.status_code == 200
        data = response.data[0]
        assert data["exercise_type"] == "flashcard"
        assert data["item_id"] == str(ex.item.id)
        assert data["front_text"] == "der Hund"
        assert data["back_text"] == "the dog"
        assert "detail" not in data

    def test_mcq_flat_shape(self, auth_client, user):
        pack, page = _setup_pack_with_studied_page(user)
        ex = ExerciseFactory(pack=pack, page=page, exercise_type="mcq_recognition")
        mcq = MCQExerciseFactory(exercise=ex, question="What is 'Hund'?")
        correct = MCQChoiceFactory(mcq=mcq, text="dog", is_correct=True, order=0)
        MCQChoiceFactory(mcq=mcq, text="cat", is_correct=False, order=1)

        response = auth_client.get(f"{SESSION_URL}?exercise_type=mcq_recognition")
        data = response.data[0]
        assert data["question"] == "What is 'Hund'?"
        assert len(data["choices"]) == 2
        assert data["correct_choice_id"] == str(correct.id)
        assert "detail" not in data

    def test_fill_blank_flat_shape(self, auth_client, user):
        pack, page = _setup_pack_with_studied_page(user)
        ex = ExerciseFactory(pack=pack, page=page, exercise_type="fill_blank")
        FillBlankExerciseFactory(
            exercise=ex, text_before="Ich", text_after="Anna.",
            answer="heiße", accept_alternatives=["heisse"],
        )

        response = auth_client.get(f"{SESSION_URL}?exercise_type=fill_blank")
        data = response.data[0]
        assert data["answer"] == "heiße"
        assert data["accept_alternatives"] == ["heisse"]
        assert data["text_before"] == "Ich"
        assert "detail" not in data

    def test_sentence_order_flat_shape(self, auth_client, user):
        pack, page = _setup_pack_with_studied_page(user)
        ex = ExerciseFactory(pack=pack, page=page, exercise_type="sentence_order")
        SentenceOrderExerciseFactory(
            exercise=ex,
            jumbled_words=["gehe", "ich", "Supermarkt", "zum"],
            correct_answers=[["Ich", "gehe", "zum", "Supermarkt"]],
        )

        response = auth_client.get(f"{SESSION_URL}?exercise_type=sentence_order")
        data = response.data[0]
        assert data["jumbled_words"] == ["gehe", "ich", "Supermarkt", "zum"]
        assert len(data["correct_answers"]) == 1
        assert "detail" not in data

    def test_error_correction_flat_shape(self, auth_client, user):
        pack, page = _setup_pack_with_studied_page(user)
        ex = ExerciseFactory(pack=pack, page=page, exercise_type="error_correction")
        ErrorCorrectionExerciseFactory(
            exercise=ex,
            sentence="Ich sehe der Mann",
            error_start=9, error_end=12,
            correct_replacement="den",
        )

        response = auth_client.get(f"{SESSION_URL}?exercise_type=error_correction")
        data = response.data[0]
        assert data["sentence"] == "Ich sehe der Mann"
        assert data["correct_replacement"] == "den"
        assert "detail" not in data

    def test_matching_flat_shape(self, auth_client, user):
        pack, page = _setup_pack_with_studied_page(user)
        ex = ExerciseFactory(pack=pack, page=page, exercise_type="matching")
        m = MatchingExerciseFactory(exercise=ex, instruction="Match pronouns")
        MatchingPairFactory(matching=m, left="ich", right="mir", order=0)
        MatchingPairFactory(matching=m, left="du", right="dir", order=1)

        response = auth_client.get(f"{SESSION_URL}?exercise_type=matching")
        data = response.data[0]
        assert data["instruction"] == "Match pronouns"
        assert len(data["pairs"]) == 2
        assert data["pairs"][0]["left"] == "ich"
        assert "detail" not in data

    def test_excludes_inactive(self, auth_client, user):
        pack, page = _setup_pack_with_studied_page(user)
        ex = ExerciseFactory(pack=pack, page=page, is_active=False)
        FlashcardExerciseFactory(exercise=ex)

        response = auth_client.get(SESSION_URL)
        assert response.data == []

    def test_respects_max_items(self, auth_client, user):
        pack, page = _setup_pack_with_studied_page(user)
        for _ in range(5):
            ex = ExerciseFactory(pack=pack, page=page, exercise_type="flashcard")
            FlashcardExerciseFactory(exercise=ex)

        response = auth_client.get(f"{SESSION_URL}?max_items=2")
        assert len(response.data) == 2


@pytest.mark.django_db
class TestAvailableExerciseTypesView:
    def test_requires_auth(self, api_client):
        response = api_client.get(AVAILABLE_TYPES_URL)
        assert response.status_code in (401, 403)

    def test_no_subscriptions_returns_empty(self, auth_client):
        response = auth_client.get(AVAILABLE_TYPES_URL)
        assert response.status_code == 200
        assert response.data["available_types"] == []

    def test_returns_types_from_studied_pages(self, auth_client, user):
        pack, page = _setup_pack_with_studied_page(user)
        fc_ex = ExerciseFactory(pack=pack, page=page, exercise_type="flashcard")
        FlashcardExerciseFactory(exercise=fc_ex)
        mcq_ex = ExerciseFactory(pack=pack, page=page, exercise_type="mcq_recognition")
        MCQExerciseFactory(exercise=mcq_ex)

        response = auth_client.get(AVAILABLE_TYPES_URL)
        assert response.status_code == 200
        assert set(response.data["available_types"]) == {"flashcard", "mcq_recognition"}

    def test_excludes_types_from_unstudied_pages(self, auth_client, user):
        pack = PackFactory()
        subscribe_to_pack(user=user, pack_id=str(pack.id))
        studied_page = PageFactory(pack=pack)
        unstudied_page = PageFactory(pack=pack)
        UserPageProgress.objects.create(user=user, page=studied_page, completed_at=timezone.now())

        fc_ex = ExerciseFactory(pack=pack, page=studied_page, exercise_type="flashcard")
        FlashcardExerciseFactory(exercise=fc_ex)
        mcq_ex = ExerciseFactory(pack=pack, page=unstudied_page, exercise_type="mcq_recognition")
        MCQExerciseFactory(exercise=mcq_ex)

        response = auth_client.get(AVAILABLE_TYPES_URL)
        assert response.data["available_types"] == ["flashcard"]
