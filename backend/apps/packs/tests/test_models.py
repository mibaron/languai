import pytest
from django.db import IntegrityError

from apps.packs.models import UserPackSubscription

from .factories import PackFactory, UserPackSubscriptionFactory


@pytest.mark.django_db
class TestPack:
    def test_str_representation(self):
        pack = PackFactory(title="German A1.1", base_language="en")
        assert "German A1.1" in str(pack)
        assert "en" in str(pack)

    def test_slug_unique(self):
        PackFactory(slug="unique-slug")
        with pytest.raises(IntegrityError):
            PackFactory(slug="unique-slug")

    def test_default_is_active(self):
        pack = PackFactory()
        assert pack.is_active is True


@pytest.mark.django_db
class TestUserPackSubscription:
    def test_str_representation(self):
        sub = UserPackSubscriptionFactory()
        assert sub.user.username in str(sub)
        assert sub.pack.title in str(sub)

    def test_unique_user_pack_constraint(self):
        sub = UserPackSubscriptionFactory()
        with pytest.raises(IntegrityError):
            UserPackSubscription.objects.create(user=sub.user, pack=sub.pack)

    def test_default_status_active(self):
        sub = UserPackSubscriptionFactory()
        assert sub.status == "active"

    def test_cascade_delete_user(self):
        sub = UserPackSubscriptionFactory()
        user_id = sub.user.id
        sub.user.delete()
        assert not UserPackSubscription.objects.filter(user_id=user_id).exists()

    def test_cascade_delete_pack(self):
        sub = UserPackSubscriptionFactory()
        pack_id = sub.pack.id
        sub.pack.delete()
        assert not UserPackSubscription.objects.filter(pack_id=pack_id).exists()
