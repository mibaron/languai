from apps.content.models import Page
from apps.users.models import User

from .models import UserPageProgress


def reset_pack_progress(*, user: User, pack_id: str) -> int:
    page_ids = Page.objects.filter(pack_id=pack_id).values_list("id", flat=True)
    deleted_count, _ = UserPageProgress.objects.filter(
        user=user,
        page_id__in=page_ids,
    ).delete()
    return deleted_count
