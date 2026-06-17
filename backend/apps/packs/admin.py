from django.contrib import admin

from .models import Pack, UserPackSubscription


@admin.register(Pack)
class PackAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "level",
        "base_language",
        "grammar_count",
        "vocab_count",
        "exercise_count",
        "is_active",
        "subscriber_count",
    ]
    list_filter = ["is_active", "base_language", "level"]
    search_fields = ["title", "slug", "description"]
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ["created_at", "updated_at"]

    def subscriber_count(self, obj: Pack) -> int:
        return obj.subscriptions.filter(status="active").count()

    subscriber_count.short_description = "Active subscribers"


@admin.register(UserPackSubscription)
class UserPackSubscriptionAdmin(admin.ModelAdmin):
    list_display = ["user", "pack", "status", "created_at"]
    list_filter = ["status"]
    search_fields = ["user__username", "pack__title"]
    readonly_fields = ["created_at", "updated_at"]
    raw_id_fields = ["user", "pack"]
