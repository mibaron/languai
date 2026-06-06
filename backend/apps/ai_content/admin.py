from django.contrib import admin

from .models import AIContent, AIInteraction, UserAIContent


@admin.register(AIContent)
class AIContentAdmin(admin.ModelAdmin):
    list_display = ["section_title", "action_type", "level_code", "category", "created_at"]
    list_filter = ["action_type", "level_code", "category"]
    search_fields = ["section_title"]
    readonly_fields = ["item_fingerprint", "created_at", "updated_at"]


@admin.register(UserAIContent)
class UserAIContentAdmin(admin.ModelAdmin):
    list_display = ["user", "ai_content", "share_key", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["user__username"]


@admin.register(AIInteraction)
class AIInteractionAdmin(admin.ModelAdmin):
    list_display = ["user", "ai_content", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["user__username"]
