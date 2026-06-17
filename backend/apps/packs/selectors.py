from django.db.models import QuerySet

from apps.users.models import User

from .models import Pack, SubscriptionStatus, UserPackSubscription


def get_available_packs() -> QuerySet[Pack]:
    return Pack.objects.filter(is_active=True).select_related("level")


def get_user_subscriptions(
    *,
    user: User,
    status: str | None = None,
) -> QuerySet[UserPackSubscription]:
    qs = UserPackSubscription.objects.filter(user=user).select_related(
        "pack", "pack__level"
    )
    if status:
        qs = qs.filter(status=status)
    return qs


def get_user_active_packs(*, user: User) -> QuerySet[UserPackSubscription]:
    return get_user_subscriptions(user=user, status=SubscriptionStatus.ACTIVE)


def get_user_archived_packs(*, user: User) -> QuerySet[UserPackSubscription]:
    return get_user_subscriptions(user=user, status=SubscriptionStatus.ARCHIVED)
