import pytest

from apps.packs.models import SubscriptionStatus
from apps.packs.selectors import (
    get_available_packs,
    get_user_active_packs,
    get_user_archived_packs,
    get_user_subscriptions,
)

from .factories import PackFactory, UserFactory, UserPackSubscriptionFactory


@pytest.mark.django_db
class TestGetAvailablePacks:
    def test_returns_active_packs(self):
        active = PackFactory(is_active=True)
        PackFactory(is_active=False)
        packs = get_available_packs()
        assert active in packs
        assert packs.count() == 1

    def test_returns_empty_when_no_packs(self):
        assert get_available_packs().count() == 0


@pytest.mark.django_db
class TestGetUserSubscriptions:
    def test_returns_all_user_subscriptions(self):
        user = UserFactory()
        UserPackSubscriptionFactory(user=user, status=SubscriptionStatus.ACTIVE)
        UserPackSubscriptionFactory(user=user, status=SubscriptionStatus.ARCHIVED)
        UserPackSubscriptionFactory()  # different user
        subs = get_user_subscriptions(user=user)
        assert subs.count() == 2

    def test_filters_by_status(self):
        user = UserFactory()
        UserPackSubscriptionFactory(user=user, status=SubscriptionStatus.ACTIVE)
        UserPackSubscriptionFactory(user=user, status=SubscriptionStatus.ARCHIVED)
        active = get_user_subscriptions(user=user, status="active")
        assert active.count() == 1

    def test_returns_empty_for_no_subscriptions(self):
        user = UserFactory()
        assert get_user_subscriptions(user=user).count() == 0


@pytest.mark.django_db
class TestGetUserActivePacks:
    def test_returns_only_active(self):
        user = UserFactory()
        UserPackSubscriptionFactory(user=user, status=SubscriptionStatus.ACTIVE)
        UserPackSubscriptionFactory(user=user, status=SubscriptionStatus.ARCHIVED)
        assert get_user_active_packs(user=user).count() == 1


@pytest.mark.django_db
class TestGetUserArchivedPacks:
    def test_returns_only_archived(self):
        user = UserFactory()
        UserPackSubscriptionFactory(user=user, status=SubscriptionStatus.ACTIVE)
        UserPackSubscriptionFactory(user=user, status=SubscriptionStatus.ARCHIVED)
        assert get_user_archived_packs(user=user).count() == 1
