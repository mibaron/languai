from apps.users.models import User

from .exceptions import AlreadySubscribedError, NotSubscribedError, PackNotFoundError
from .models import Pack, SubscriptionStatus, UserPackSubscription


def subscribe_to_pack(*, user: User, pack_id: str) -> UserPackSubscription:
    try:
        pack = Pack.objects.get(id=pack_id, is_active=True)
    except Pack.DoesNotExist as err:
        raise PackNotFoundError(f"Pack {pack_id} not found or inactive") from err

    subscription, created = UserPackSubscription.objects.get_or_create(
        user=user,
        pack=pack,
        defaults={"status": SubscriptionStatus.ACTIVE},
    )

    if not created:
        if subscription.status == SubscriptionStatus.ACTIVE:
            raise AlreadySubscribedError(f"Already subscribed to {pack.title}")
        subscription.status = SubscriptionStatus.ACTIVE
        subscription.save(update_fields=["status", "updated_at"])

    return subscription


def unsubscribe_from_pack(*, user: User, pack_id: str) -> None:
    try:
        subscription = UserPackSubscription.objects.get(user=user, pack_id=pack_id)
    except UserPackSubscription.DoesNotExist as err:
        raise NotSubscribedError("Not subscribed to this pack") from err

    subscription.delete()


def archive_pack(*, user: User, pack_id: str) -> UserPackSubscription:
    try:
        subscription = UserPackSubscription.objects.get(
            user=user,
            pack_id=pack_id,
            status=SubscriptionStatus.ACTIVE,
        )
    except UserPackSubscription.DoesNotExist as err:
        raise NotSubscribedError("No active subscription for this pack") from err

    subscription.status = SubscriptionStatus.ARCHIVED
    subscription.save(update_fields=["status", "updated_at"])
    return subscription


def unarchive_pack(*, user: User, pack_id: str) -> UserPackSubscription:
    try:
        subscription = UserPackSubscription.objects.get(
            user=user,
            pack_id=pack_id,
            status=SubscriptionStatus.ARCHIVED,
        )
    except UserPackSubscription.DoesNotExist as err:
        raise NotSubscribedError("No archived subscription for this pack") from err

    subscription.status = SubscriptionStatus.ACTIVE
    subscription.save(update_fields=["status", "updated_at"])
    return subscription
