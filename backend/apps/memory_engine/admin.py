from django.contrib import admin

from apps.memory_engine.models import MemoryState, ReviewLog


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


@admin.register(ReviewLog)
class ReviewLogAdmin(admin.ModelAdmin):
    list_display = [
        "memory_state",
        "rating",
        "created_at",
        "scheduled_days",
        "actual_days",
    ]
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
