import pytest

from apps.packs.tests.factories import PackFactory

from ..selectors import get_exercises_for_items, get_exercises_for_pack
from .factories import (
    ExerciseFactory,
    FillBlankExerciseFactory,
    FlashcardExerciseFactory,
    MCQExerciseFactory,
)


@pytest.mark.django_db
class TestGetExercisesForPack:
    def test_returns_exercises_for_pack(self):
        pack = PackFactory()
        ex = ExerciseFactory(pack=pack)
        FlashcardExerciseFactory(exercise=ex)
        result = list(get_exercises_for_pack(pack_ids=[str(pack.id)]))
        assert len(result) == 1
        assert result[0].id == ex.id

    def test_filters_by_type(self):
        pack = PackFactory()
        fc = ExerciseFactory(pack=pack, exercise_type="flashcard")
        FlashcardExerciseFactory(exercise=fc)
        mcq = ExerciseFactory(pack=pack, exercise_type="mcq_recognition")
        MCQExerciseFactory(exercise=mcq)

        result = list(get_exercises_for_pack(
            pack_ids=[str(pack.id)], exercise_type="flashcard",
        ))
        assert len(result) == 1
        assert result[0].exercise_type == "flashcard"

    def test_excludes_inactive(self):
        pack = PackFactory()
        ex = ExerciseFactory(pack=pack, is_active=False)
        FlashcardExerciseFactory(exercise=ex)
        result = list(get_exercises_for_pack(pack_ids=[str(pack.id)]))
        assert len(result) == 0

    def test_respects_limit(self):
        pack = PackFactory()
        for _ in range(5):
            ex = ExerciseFactory(pack=pack)
            FlashcardExerciseFactory(exercise=ex)
        result = list(get_exercises_for_pack(pack_ids=[str(pack.id)], limit=3))
        assert len(result) == 3

    def test_multiple_packs(self):
        p1 = PackFactory()
        p2 = PackFactory()
        ex1 = ExerciseFactory(pack=p1)
        FlashcardExerciseFactory(exercise=ex1)
        ex2 = ExerciseFactory(pack=p2)
        FlashcardExerciseFactory(exercise=ex2)
        result = list(get_exercises_for_pack(pack_ids=[str(p1.id), str(p2.id)]))
        assert len(result) == 2


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
