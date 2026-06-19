from django.contrib import admin

from apps.memory_engine.models import MemoryState, ReviewLog


class ReviewLogInline(admin.TabularInline):
    model = ReviewLog
    extra = 0
    fields = ["rating", "response_time_ms", "scheduled_days", "actual_days", "created_at"]
    readonly_fields = ["rating", "response_time_ms", "scheduled_days", "actual_days", "created_at"]
    can_delete = False
    ordering = ["-created_at"]

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(MemoryState)
class MemoryStateAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "item",
        "skill_type",
        "state",
        "next_due",
        "difficulty",
        "stability",
        "reps",
        "lapses",
    ]
    list_filter = ["skill_type", "state"]
    list_select_related = ["user", "item"]
    search_fields = ["user__username", "user__email", "item__text"]
    raw_id_fields = ["user", "item"]
    readonly_fields = [
        "user",
        "item",
        "skill_type",
        "difficulty",
        "stability",
        "reps",
        "lapses",
        "state",
        "last_review",
        "next_due",
        "created_at",
        "updated_at",
    ]
    inlines = [ReviewLogInline]


@admin.register(ReviewLog)
class ReviewLogAdmin(admin.ModelAdmin):
    list_display = [
        "memory_state",
        "rating",
        "created_at",
        "scheduled_days",
        "actual_days",
    ]
    list_filter = ["rating"]
    list_select_related = ["memory_state", "memory_state__user", "memory_state__item"]
    search_fields = ["memory_state__user__username", "memory_state__item__text"]
    raw_id_fields = ["memory_state"]
    readonly_fields = [
        "memory_state",
        "rating",
        "response_time_ms",
        "scheduled_days",
        "actual_days",
        "difficulty_before",
        "stability_before",
        "difficulty_after",
        "stability_after",
        "created_at",
        "updated_at",
    ]
