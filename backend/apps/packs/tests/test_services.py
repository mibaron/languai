import pytest

from apps.packs.exceptions import AlreadySubscribedError, NotSubscribedError, PackNotFoundError
from apps.packs.models import SubscriptionStatus, UserPackSubscription
from apps.packs.services import (
    archive_pack,
    subscribe_to_pack,
    unarchive_pack,
    unsubscribe_from_pack,
)

from .factories import PackFactory, UserFactory, UserPackSubscriptionFactory


@pytest.mark.django_db
class TestSubscribeToPack:
    def test_creates_active_subscription(self):
        user = UserFactory()
        pack = PackFactory()
        sub = subscribe_to_pack(user=user, pack_id=str(pack.id))
        assert sub.status == SubscriptionStatus.ACTIVE
        assert sub.user == user
        assert sub.pack == pack

    def test_raises_pack_not_found_for_missing_pack(self):
        user = UserFactory()
        with pytest.raises(PackNotFoundError):
            subscribe_to_pack(user=user, pack_id="00000000-0000-0000-0000-000000000000")

    def test_raises_pack_not_found_for_inactive_pack(self):
        user = UserFactory()
        pack = PackFactory(is_active=False)
        with pytest.raises(PackNotFoundError):
            subscribe_to_pack(user=user, pack_id=str(pack.id))

    def test_raises_already_subscribed_for_active_subscription(self):
        sub = UserPackSubscriptionFactory(status=SubscriptionStatus.ACTIVE)
        with pytest.raises(AlreadySubscribedError):
            subscribe_to_pack(user=sub.user, pack_id=str(sub.pack.id))

    def test_reactivates_archived_subscription(self):
        sub = UserPackSubscriptionFactory(status=SubscriptionStatus.ARCHIVED)
        result = subscribe_to_pack(user=sub.user, pack_id=str(sub.pack.id))
        assert result.status == SubscriptionStatus.ACTIVE
        assert result.id == sub.id

    def test_reactivates_completed_subscription(self):
        sub = UserPackSubscriptionFactory(status=SubscriptionStatus.COMPLETED)
        result = subscribe_to_pack(user=sub.user, pack_id=str(sub.pack.id))
        assert result.status == SubscriptionStatus.ACTIVE


@pytest.mark.django_db
class TestUnsubscribeFromPack:
    def test_deletes_subscription(self):
        sub = UserPackSubscriptionFactory()
        unsubscribe_from_pack(user=sub.user, pack_id=str(sub.pack.id))
        assert not UserPackSubscription.objects.filter(id=sub.id).exists()

    def test_raises_not_subscribed(self):
        user = UserFactory()
        pack = PackFactory()
        with pytest.raises(NotSubscribedError):
            unsubscribe_from_pack(user=user, pack_id=str(pack.id))


@pytest.mark.django_db
class TestArchivePack:
    def test_archives_active_subscription(self):
        sub = UserPackSubscriptionFactory(status=SubscriptionStatus.ACTIVE)
        result = archive_pack(user=sub.user, pack_id=str(sub.pack.id))
        assert result.status == SubscriptionStatus.ARCHIVED

    def test_raises_not_subscribed_when_no_active(self):
        sub = UserPackSubscriptionFactory(status=SubscriptionStatus.ARCHIVED)
        with pytest.raises(NotSubscribedError):
            archive_pack(user=sub.user, pack_id=str(sub.pack.id))

    def test_raises_not_subscribed_when_no_subscription(self):
        user = UserFactory()
        pack = PackFactory()
        with pytest.raises(NotSubscribedError):
            archive_pack(user=user, pack_id=str(pack.id))


@pytest.mark.django_db
class TestUnarchivePack:
    def test_unarchives_archived_subscription(self):
        sub = UserPackSubscriptionFactory(status=SubscriptionStatus.ARCHIVED)
        result = unarchive_pack(user=sub.user, pack_id=str(sub.pack.id))
        assert result.status == SubscriptionStatus.ACTIVE

    def test_raises_not_subscribed_when_active(self):
        sub = UserPackSubscriptionFactory(status=SubscriptionStatus.ACTIVE)
        with pytest.raises(NotSubscribedError):
            unarchive_pack(user=sub.user, pack_id=str(sub.pack.id))

    def test_raises_not_subscribed_when_no_subscription(self):
        user = UserFactory()
        pack = PackFactory()
        with pytest.raises(NotSubscribedError):
            unarchive_pack(user=user, pack_id=str(pack.id))
