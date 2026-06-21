import pytest
from django.utils import timezone

from apps.content.tests.factories import PageFactory, PageLexicalItemFactory
from apps.knowledge.constants import LexicalItemType
from apps.knowledge.tests.factories import LexicalItemFactory
from apps.packs.tests.factories import PackFactory, UserFactory
from apps.progress.models import UserPageProgress
from apps.progress.selectors import get_pack_progress


@pytest.fixture
def user():
    return UserFactory()


@pytest.mark.django_db
class TestGetPackProgress:
    def test_empty_pack(self, user):
        pack = PackFactory()
        result = get_pack_progress(user=user, pack_id=pack.id)
        assert result["total_pages"] == 0
        assert result["studied_pages"] == 0
        assert result["categories"] == {}

    def test_no_progress(self, user):
        pack = PackFactory()
        page = PageFactory(pack=pack)
        vocab = LexicalItemFactory(type=LexicalItemType.VOCAB)
        PageLexicalItemFactory(page=page, item=vocab)

        result = get_pack_progress(user=user, pack_id=pack.id)
        assert result["total_pages"] == 1
        assert result["studied_pages"] == 0
        assert result["categories"]["vocab"]["total"] == 1
        assert result["categories"]["vocab"]["studied"] == 0

    def test_full_progress(self, user):
        pack = PackFactory()
        page = PageFactory(pack=pack)
        vocab = LexicalItemFactory(type=LexicalItemType.VOCAB)
        PageLexicalItemFactory(page=page, item=vocab)
        UserPageProgress.objects.create(user=user, page=page, completed_at=timezone.now())

        result = get_pack_progress(user=user, pack_id=pack.id)
        assert result["total_pages"] == 1
        assert result["studied_pages"] == 1
        assert result["categories"]["vocab"]["total"] == 1
        assert result["categories"]["vocab"]["studied"] == 1

    def test_partial_progress_multiple_categories(self, user):
        pack = PackFactory()
        page1 = PageFactory(pack=pack)
        page2 = PageFactory(pack=pack)

        vocab1 = LexicalItemFactory(type=LexicalItemType.VOCAB)
        vocab2 = LexicalItemFactory(type=LexicalItemType.VOCAB)
        verb1 = LexicalItemFactory(type=LexicalItemType.VERB)
        grammar1 = LexicalItemFactory(type=LexicalItemType.GRAMMAR_RULE)

        PageLexicalItemFactory(page=page1, item=vocab1)
        PageLexicalItemFactory(page=page1, item=verb1)
        PageLexicalItemFactory(page=page2, item=vocab2)
        PageLexicalItemFactory(page=page2, item=grammar1)

        UserPageProgress.objects.create(user=user, page=page1, completed_at=timezone.now())

        result = get_pack_progress(user=user, pack_id=pack.id)
        assert result["total_pages"] == 2
        assert result["studied_pages"] == 1
        assert result["categories"]["vocab"]["total"] == 2
        assert result["categories"]["vocab"]["studied"] == 1
        assert result["categories"]["verb"]["total"] == 1
        assert result["categories"]["verb"]["studied"] == 1
        assert result["categories"]["grammar_rule"]["total"] == 1
        assert result["categories"]["grammar_rule"]["studied"] == 0

    def test_does_not_count_other_users(self, user):
        pack = PackFactory()
        page = PageFactory(pack=pack)
        vocab = LexicalItemFactory(type=LexicalItemType.VOCAB)
        PageLexicalItemFactory(page=page, item=vocab)

        other_user = UserFactory()
        UserPageProgress.objects.create(user=other_user, page=page, completed_at=timezone.now())

        result = get_pack_progress(user=user, pack_id=pack.id)
        assert result["studied_pages"] == 0
        assert result["categories"]["vocab"]["studied"] == 0

    def test_does_not_count_other_packs(self, user):
        pack1 = PackFactory()
        pack2 = PackFactory()
        page1 = PageFactory(pack=pack1)
        page2 = PageFactory(pack=pack2)
        vocab1 = LexicalItemFactory(type=LexicalItemType.VOCAB)
        vocab2 = LexicalItemFactory(type=LexicalItemType.VOCAB)
        PageLexicalItemFactory(page=page1, item=vocab1)
        PageLexicalItemFactory(page=page2, item=vocab2)
        UserPageProgress.objects.create(user=user, page=page2, completed_at=timezone.now())

        result = get_pack_progress(user=user, pack_id=pack1.id)
        assert result["studied_pages"] == 0
        assert result["categories"]["vocab"]["studied"] == 0

    def test_shared_item_across_pages_counted_once(self, user):
        pack = PackFactory()
        page1 = PageFactory(pack=pack)
        page2 = PageFactory(pack=pack)
        shared_vocab = LexicalItemFactory(type=LexicalItemType.VOCAB)
        PageLexicalItemFactory(page=page1, item=shared_vocab)
        PageLexicalItemFactory(page=page2, item=shared_vocab)

        UserPageProgress.objects.create(user=user, page=page1, completed_at=timezone.now())

        result = get_pack_progress(user=user, pack_id=pack.id)
        assert result["categories"]["vocab"]["total"] == 1
        assert result["categories"]["vocab"]["studied"] == 1
