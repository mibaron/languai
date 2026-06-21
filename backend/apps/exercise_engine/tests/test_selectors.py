import pytest
from django.utils import timezone

from apps.content.tests.factories import PageFactory
from apps.packs.tests.factories import PackFactory, UserFactory
from apps.progress.models import UserPageProgress

from ..selectors import get_available_exercise_types, get_exercises_for_items, get_exercises_for_pack
from .factories import (
    ExerciseFactory,
    FillBlankExerciseFactory,
    FlashcardExerciseFactory,
    MCQExerciseFactory,
)


def _mark_page_studied(user, page):
    UserPageProgress.objects.create(user=user, page=page, completed_at=timezone.now())


@pytest.mark.django_db
class TestGetExercisesForPack:
    def test_returns_exercises_for_studied_page(self):
        user = UserFactory()
        pack = PackFactory()
        page = PageFactory(pack=pack)
        ex = ExerciseFactory(pack=pack, page=page)
        FlashcardExerciseFactory(exercise=ex)
        _mark_page_studied(user, page)

        result = list(get_exercises_for_pack(user=user, pack_ids=[str(pack.id)]))
        assert len(result) == 1
        assert result[0].id == ex.id

    def test_excludes_exercises_from_unstudied_page(self):
        user = UserFactory()
        pack = PackFactory()
        page = PageFactory(pack=pack)
        ex = ExerciseFactory(pack=pack, page=page)
        FlashcardExerciseFactory(exercise=ex)

        result = list(get_exercises_for_pack(user=user, pack_ids=[str(pack.id)]))
        assert len(result) == 0

    def test_excludes_exercises_without_page(self):
        user = UserFactory()
        pack = PackFactory()
        ex = ExerciseFactory(pack=pack, page=None)
        FlashcardExerciseFactory(exercise=ex)

        result = list(get_exercises_for_pack(user=user, pack_ids=[str(pack.id)]))
        assert len(result) == 0

    def test_filters_by_type(self):
        user = UserFactory()
        pack = PackFactory()
        page = PageFactory(pack=pack)
        fc = ExerciseFactory(pack=pack, page=page, exercise_type="flashcard")
        FlashcardExerciseFactory(exercise=fc)
        mcq = ExerciseFactory(pack=pack, page=page, exercise_type="mcq_recognition")
        MCQExerciseFactory(exercise=mcq)
        _mark_page_studied(user, page)

        result = list(get_exercises_for_pack(
            user=user, pack_ids=[str(pack.id)], exercise_type="flashcard",
        ))
        assert len(result) == 1
        assert result[0].exercise_type == "flashcard"

    def test_excludes_inactive(self):
        user = UserFactory()
        pack = PackFactory()
        page = PageFactory(pack=pack)
        ex = ExerciseFactory(pack=pack, page=page, is_active=False)
        FlashcardExerciseFactory(exercise=ex)
        _mark_page_studied(user, page)

        result = list(get_exercises_for_pack(user=user, pack_ids=[str(pack.id)]))
        assert len(result) == 0

    def test_respects_limit(self):
        user = UserFactory()
        pack = PackFactory()
        page = PageFactory(pack=pack)
        for _ in range(5):
            ex = ExerciseFactory(pack=pack, page=page)
            FlashcardExerciseFactory(exercise=ex)
        _mark_page_studied(user, page)

        result = list(get_exercises_for_pack(user=user, pack_ids=[str(pack.id)], limit=3))
        assert len(result) == 3

    def test_multiple_packs(self):
        user = UserFactory()
        p1 = PackFactory()
        p2 = PackFactory()
        page1 = PageFactory(pack=p1)
        page2 = PageFactory(pack=p2)
        ex1 = ExerciseFactory(pack=p1, page=page1)
        FlashcardExerciseFactory(exercise=ex1)
        ex2 = ExerciseFactory(pack=p2, page=page2)
        FlashcardExerciseFactory(exercise=ex2)
        _mark_page_studied(user, page1)
        _mark_page_studied(user, page2)

        result = list(get_exercises_for_pack(user=user, pack_ids=[str(p1.id), str(p2.id)]))
        assert len(result) == 2


@pytest.mark.django_db
class TestGetAvailableExerciseTypes:
    def test_returns_types_from_studied_pages(self):
        user = UserFactory()
        pack = PackFactory()
        page = PageFactory(pack=pack)
        ex_fc = ExerciseFactory(pack=pack, page=page, exercise_type="flashcard")
        FlashcardExerciseFactory(exercise=ex_fc)
        ex_mcq = ExerciseFactory(pack=pack, page=page, exercise_type="mcq_recognition")
        MCQExerciseFactory(exercise=ex_mcq)
        _mark_page_studied(user, page)

        result = get_available_exercise_types(user=user, pack_ids=[str(pack.id)])
        assert set(result) == {"flashcard", "mcq_recognition"}

    def test_excludes_types_from_unstudied_pages(self):
        user = UserFactory()
        pack = PackFactory()
        studied_page = PageFactory(pack=pack)
        unstudied_page = PageFactory(pack=pack)
        ex_fc = ExerciseFactory(pack=pack, page=studied_page, exercise_type="flashcard")
        FlashcardExerciseFactory(exercise=ex_fc)
        ex_mcq = ExerciseFactory(pack=pack, page=unstudied_page, exercise_type="mcq_recognition")
        MCQExerciseFactory(exercise=ex_mcq)
        _mark_page_studied(user, studied_page)

        result = get_available_exercise_types(user=user, pack_ids=[str(pack.id)])
        assert result == ["flashcard"]

    def test_returns_empty_when_nothing_studied(self):
        user = UserFactory()
        pack = PackFactory()
        page = PageFactory(pack=pack)
        ex = ExerciseFactory(pack=pack, page=page)
        FlashcardExerciseFactory(exercise=ex)

        result = get_available_exercise_types(user=user, pack_ids=[str(pack.id)])
        assert result == []


@pytest.mark.django_db
class TestGetExercisesForItems:
    def test_returns_exercises_for_items(self):
        ex = ExerciseFactory()
        FlashcardExerciseFactory(exercise=ex)
        result = list(get_exercises_for_items(item_ids=[str(ex.item.id)]))
        assert len(result) == 1

    def test_filters_by_pack(self):
        pack = PackFactory()
        ex1 = ExerciseFactory(pack=pack)
        FlashcardExerciseFactory(exercise=ex1)
        ex2 = ExerciseFactory(item=ex1.item)
        FlashcardExerciseFactory(exercise=ex2)

        result = list(get_exercises_for_items(
            item_ids=[str(ex1.item.id)], pack_id=str(pack.id),
        ))
        assert len(result) == 1
        assert result[0].pack_id == pack.id

    def test_filters_by_type(self):
        ex_fc = ExerciseFactory(exercise_type="flashcard")
        FlashcardExerciseFactory(exercise=ex_fc)
        ex_fb = ExerciseFactory(item=ex_fc.item, exercise_type="fill_blank")
        FillBlankExerciseFactory(exercise=ex_fb)

        result = list(get_exercises_for_items(
            item_ids=[str(ex_fc.item.id)], exercise_type="fill_blank",
        ))
        assert len(result) == 1
        assert result[0].exercise_type == "fill_blank"
