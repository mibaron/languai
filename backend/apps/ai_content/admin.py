from django.contrib import admin

from .models import AIContent, AIInteraction, LLMModel, UserAIContent


@admin.register(LLMModel)
class LLMModelAdmin(admin.ModelAdmin):
    list_display = ["name", "model_id", "provider", "prompt_price", "completion_price", "context_length", "is_active", "is_default"]
    list_filter = ["is_active", "is_default", "provider"]
    list_editable = ["is_active", "is_default"]
    search_fields = ["name", "model_id", "provider"]
    ordering = ["provider", "name"]


@admin.register(AIContent)
class AIContentAdmin(admin.ModelAdmin):
    list_display = ["section_title", "action_type", "model_used", "cost_usd", "level_code", "category", "created_at"]
    list_filter = ["action_type", "model_used", "level_code", "category"]
    search_fields = ["section_title"]
    readonly_fields = ["item_fingerprint", "prompt_messages", "created_at", "updated_at"]


@admin.register(UserAIContent)
class UserAIContentAdmin(admin.ModelAdmin):
    list_display = ["user", "ai_content", "share_key", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["user__username"]


@admin.register(AIInteraction)
class AIInteractionAdmin(admin.ModelAdmin):
    list_display = ["user", "ai_content", "cost_usd", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["user__username"]
