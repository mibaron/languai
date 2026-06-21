from django.contrib import admin, messages

from apps.content.services import delete_pack_and_all_content

from .models import Pack, PackItem, PackReferenceSheet, UserPackSubscription


class PackItemInline(admin.TabularInline):
    model = PackItem
    extra = 1
    raw_id_fields = ["item"]


class PackReferenceSheetInline(admin.TabularInline):
    model = PackReferenceSheet
    extra = 1
    raw_id_fields = ["sheet"]


@admin.register(Pack)
class PackAdmin(admin.ModelAdmin):
    inlines = [PackItemInline, PackReferenceSheetInline]
    filter_horizontal = ["goals"]
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

    actions = ["delete_pack_with_all_content"]

    def subscriber_count(self, obj: Pack) -> int:
        return obj.subscriptions.filter(status="active").count()

    subscriber_count.short_description = "Active subscribers"

    @admin.action(
        description="DELETE pack + all content, exercises, user progress & memory"
    )
    def delete_pack_with_all_content(self, request, queryset):
        for pack in queryset:
            result = delete_pack_and_all_content(pack)
            parts = [f"{v} {k}" for k, v in result.items() if v]
            self.message_user(
                request,
                f"Deleted '{pack.title}': {', '.join(parts)}",
                messages.SUCCESS,
            )


@admin.register(UserPackSubscription)
class UserPackSubscriptionAdmin(admin.ModelAdmin):
    list_display = ["user", "pack", "status", "created_at"]
    list_filter = ["status"]
    search_fields = ["user__username", "pack__title"]
    readonly_fields = ["created_at", "updated_at"]
    raw_id_fields = ["user", "pack"]
