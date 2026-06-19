from datetime import timedelta

import pytest
from django.utils import timezone

from apps.knowledge.tests.factories import LexicalItemFactory
from apps.memory_engine.constants import SkillType
from apps.memory_engine.session import SessionConfig, build_session
from apps.memory_engine.tests.factories import MemoryStateFactory
from apps.packs.models import PackItem
from apps.packs.tests.factories import PackFactory, UserFactory, UserPackSubscriptionFactory


@pytest.mark.django_db
class TestBuildSession:
    def _setup_pack_with_items(self, user, num_items=5):
        pack = PackFactory()
        UserPackSubscriptionFactory(user=user, pack=pack)
        items = []
        for i in range(num_items):
            item = LexicalItemFactory(level=pack.level)
            PackItem.objects.create(pack=pack, item=item, order=i)
            items.append(item)
        return pack, items

    def test_returns_due_items_first(self):
        user = UserFactory()
        pack, items = self._setup_pack_with_items(user, num_items=3)

        MemoryStateFactory(
            user=user,
            item=items[0],
            skill_type=SkillType.RECOGNITION,
            next_due=timezone.now() - timedelta(hours=2),
        )
        MemoryStateFactory(
            user=user,
            item=items[1],
            skill_type=SkillType.RECOGNITION,
            next_due=timezone.now() - timedelta(hours=1),
        )

        session = build_session(
            user=user,
            pack_ids=[str(pack.id)],
            config=SessionConfig(skill_types=[SkillType.RECOGNITION]),
        )
        due_items = [s for s in session if not s.is_new]
        assert len(due_items) == 2
        assert due_items[0].item_id == str(items[0].id)

    def test_includes_new_items(self):
        user = UserFactory()
        pack, items = self._setup_pack_with_items(user, num_items=3)

        session = build_session(
            user=user,
            pack_ids=[str(pack.id)],
            config=SessionConfig(skill_types=[SkillType.RECOGNITION]),
        )
        new_items = [s for s in session if s.is_new]
        assert len(new_items) > 0

    def test_respects_max_items(self):
        user = UserFactory()
        pack, items = self._setup_pack_with_items(user, num_items=10)

        session = build_session(
            user=user,
            pack_ids=[str(pack.id)],
            config=SessionConfig(max_items=3, skill_types=[SkillType.RECOGNITION]),
        )
        assert len(session) <= 3

    def test_respects_max_new(self):
        user = UserFactory()
        pack, items = self._setup_pack_with_items(user, num_items=10)

        session = build_session(
            user=user,
            pack_ids=[str(pack.id)],
            config=SessionConfig(max_new=2, skill_types=[SkillType.RECOGNITION]),
        )
        new_items = [s for s in session if s.is_new]
        assert len(new_items) <= 2

    def test_empty_when_no_items(self):
        user = UserFactory()
        pack = PackFactory()
        UserPackSubscriptionFactory(user=user, pack=pack)

        session = build_session(
            user=user,
            pack_ids=[str(pack.id)],
        )
        assert len(session) == 0

    def test_empty_when_no_packs(self):
        user = UserFactory()
        session = build_session(user=user, pack_ids=[])
        assert len(session) == 0

    def test_no_duplicate_items_across_packs(self):
        user = UserFactory()
        pack1 = PackFactory()
        pack2 = PackFactory()
        UserPackSubscriptionFactory(user=user, pack=pack1)
        UserPackSubscriptionFactory(user=user, pack=pack2)

        shared_item = LexicalItemFactory(level=pack1.level)
        PackItem.objects.create(pack=pack1, item=shared_item, order=0)
        PackItem.objects.create(pack=pack2, item=shared_item, order=0)

        session = build_session(
            user=user,
            pack_ids=[str(pack1.id), str(pack2.id)],
            config=SessionConfig(skill_types=[SkillType.RECOGNITION]),
        )
        item_ids = [s.item_id for s in session]
        assert len(item_ids) == len(set(item_ids))

    def test_due_items_have_retrievability(self):
        user = UserFactory()
        pack, items = self._setup_pack_with_items(user, num_items=1)

        MemoryStateFactory(
            user=user,
            item=items[0],
            skill_type=SkillType.RECOGNITION,
            next_due=timezone.now() - timedelta(hours=1),
            stability=3.0,
            difficulty=5.0,
            reps=1,
            state=2,
            last_review=timezone.now() - timedelta(days=2),
        )

        session = build_session(
            user=user,
            pack_ids=[str(pack.id)],
            config=SessionConfig(skill_types=[SkillType.RECOGNITION]),
        )
        assert len(session) == 1
        assert 0.0 < session[0].retrievability < 1.0

    def test_new_items_have_zero_retrievability(self):
        user = UserFactory()
        pack, items = self._setup_pack_with_items(user, num_items=1)

        session = build_session(
            user=user,
            pack_ids=[str(pack.id)],
            config=SessionConfig(skill_types=[SkillType.RECOGNITION]),
        )
        assert len(session) == 1
        assert session[0].retrievability == 0.0
