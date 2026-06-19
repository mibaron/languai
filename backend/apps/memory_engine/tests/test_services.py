from datetime import timedelta

import pytest
from django.utils import timezone

from apps.knowledge.tests.factories import LexicalItemFactory
from apps.memory_engine.constants import SkillType
from apps.memory_engine.models import ReviewLog
from apps.memory_engine.services import get_due_items, get_new_items, record_review
from apps.memory_engine.tests.factories import MemoryStateFactory
from apps.packs.tests.factories import PackFactory, UserFactory


@pytest.mark.django_db
class TestRecordReview:
    def test_creates_memory_state_for_new_item(self):
        user = UserFactory()
        item = LexicalItemFactory()
        ms = record_review(
            user=user,
            item_id=str(item.id),
            skill_type=SkillType.RECOGNITION,
            rating=3,
        )
        assert ms.reps == 1
        assert ms.stability > 0
        assert ms.next_due is not None

    def test_updates_existing_memory_state(self):
        user = UserFactory()
        item = LexicalItemFactory()
        ms1 = record_review(
            user=user,
            item_id=str(item.id),
            skill_type=SkillType.RECOGNITION,
            rating=3,
        )
        ms2 = record_review(
            user=user,
            item_id=str(item.id),
            skill_type=SkillType.RECOGNITION,
            rating=3,
        )
        assert ms1.pk == ms2.pk
        assert ms2.reps == 2
        assert ms2.stability > ms1.stability

    def test_creates_review_log(self):
        user = UserFactory()
        item = LexicalItemFactory()
        ms = record_review(
            user=user,
            item_id=str(item.id),
            skill_type=SkillType.RECOGNITION,
            rating=3,
        )
        logs = ReviewLog.objects.filter(memory_state=ms)
        assert logs.count() == 1
        assert logs.first().rating == 3

    def test_stores_response_time(self):
        user = UserFactory()
        item = LexicalItemFactory()
        ms = record_review(
            user=user,
            item_id=str(item.id),
            skill_type=SkillType.RECOGNITION,
            rating=3,
            response_time_ms=1500,
        )
        log = ReviewLog.objects.get(memory_state=ms)
        assert log.response_time_ms == 1500

    def test_again_increments_lapses(self):
        user = UserFactory()
        item = LexicalItemFactory()
        record_review(
            user=user,
            item_id=str(item.id),
            skill_type=SkillType.RECOGNITION,
            rating=3,
        )
        ms = record_review(
            user=user,
            item_id=str(item.id),
            skill_type=SkillType.RECOGNITION,
            rating=1,
        )
        assert ms.lapses == 1


@pytest.mark.django_db
class TestGetDueItems:
    def test_returns_overdue_items(self):
        user = UserFactory()
        ms = MemoryStateFactory(
            user=user,
            next_due=timezone.now() - timedelta(hours=1),
        )
        due = get_due_items(user=user)
        assert ms in due

    def test_excludes_not_due_items(self):
        user = UserFactory()
        MemoryStateFactory(
            user=user,
            next_due=timezone.now() + timedelta(days=7),
        )
        due = get_due_items(user=user)
        assert due.count() == 0

    def test_filters_by_pack(self):
        user = UserFactory()
        pack = PackFactory()
        item_in_pack = LexicalItemFactory()
        pack.items.add(item_in_pack)
        item_not_in_pack = LexicalItemFactory()

        MemoryStateFactory(
            user=user,
            item=item_in_pack,
            next_due=timezone.now() - timedelta(hours=1),
        )
        MemoryStateFactory(
            user=user,
            item=item_not_in_pack,
            next_due=timezone.now() - timedelta(hours=1),
        )

        due = get_due_items(user=user, pack_ids=[str(pack.id)])
        assert due.count() == 1
        assert due.first().item == item_in_pack

    def test_filters_by_skill_type(self):
        user = UserFactory()
        ms_recognition = MemoryStateFactory(
            user=user,
            skill_type=SkillType.RECOGNITION,
            next_due=timezone.now() - timedelta(hours=1),
        )
        MemoryStateFactory(
            user=user,
            skill_type=SkillType.PRODUCTION,
            next_due=timezone.now() - timedelta(hours=1),
        )

        due = get_due_items(
            user=user, skill_types=[SkillType.RECOGNITION]
        )
        assert due.count() == 1
        assert due.first() == ms_recognition


@pytest.mark.django_db
class TestGetNewItems:
    def test_returns_items_in_pack(self):
        user = UserFactory()
        pack = PackFactory()
        item = LexicalItemFactory()
        pack.items.add(item)

        new = get_new_items(user=user, pack_ids=[str(pack.id)])
        assert item in new

    def test_excludes_already_reviewed(self):
        user = UserFactory()
        pack = PackFactory()
        reviewed_item = LexicalItemFactory()
        new_item = LexicalItemFactory()
        pack.items.add(reviewed_item, new_item)

        MemoryStateFactory(
            user=user,
            item=reviewed_item,
            skill_type=SkillType.RECOGNITION,
        )

        new = get_new_items(user=user, pack_ids=[str(pack.id)])
        assert reviewed_item not in new
        assert new_item in new

    def test_excludes_explicit_ids(self):
        user = UserFactory()
        pack = PackFactory()
        item1 = LexicalItemFactory()
        item2 = LexicalItemFactory()
        pack.items.add(item1, item2)

        new = get_new_items(
            user=user,
            pack_ids=[str(pack.id)],
            exclude_item_ids=[str(item1.id)],
        )
        assert item1 not in new
        assert item2 in new

    def test_returns_empty_for_empty_pack(self):
        user = UserFactory()
        pack = PackFactory()

        new = get_new_items(user=user, pack_ids=[str(pack.id)])
        assert new.count() == 0

    def test_filters_by_skill_type(self):
        user = UserFactory()
        pack = PackFactory()
        item = LexicalItemFactory()
        pack.items.add(item)

        MemoryStateFactory(
            user=user,
            item=item,
            skill_type=SkillType.RECOGNITION,
        )

        new_recognition = get_new_items(
            user=user,
            pack_ids=[str(pack.id)],
            skill_type=SkillType.RECOGNITION,
        )
        assert item not in new_recognition

        new_production = get_new_items(
            user=user,
            pack_ids=[str(pack.id)],
            skill_type=SkillType.PRODUCTION,
        )
        assert item in new_production
