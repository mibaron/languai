from django.db.models import Count, Q

from apps.content.models import Page, PageLexicalItem
from apps.users.models import User

from .models import UserPageProgress


def get_pack_progress(*, user: User, pack_id: str) -> dict:
    page_ids = list(
        Page.objects.filter(pack_id=pack_id).values_list("id", flat=True)
    )
    total_pages = len(page_ids)

    studied_page_ids = set(
        UserPageProgress.objects.filter(
            user=user,
            page_id__in=page_ids,
            completed_at__isnull=False,
        ).values_list("page_id", flat=True)
    )
    studied_pages = len(studied_page_ids)

    type_counts = (
        PageLexicalItem.objects.filter(page_id__in=page_ids)
        .values("item__type")
        .annotate(
            total=Count("item_id", distinct=True),
            studied=Count(
                "item_id",
                distinct=True,
                filter=Q(page_id__in=studied_page_ids),
            ),
        )
    )

    categories = {}
    for row in type_counts:
        categories[row["item__type"]] = {
            "total": row["total"],
            "studied": row["studied"],
        }

    return {
        "total_pages": total_pages,
        "studied_pages": studied_pages,
        "categories": categories,
    }
