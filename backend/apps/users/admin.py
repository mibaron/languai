from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html

from apps.memory_engine.models import MemoryState
from apps.packs.models import UserPackSubscription

from .models import User


class SubscriptionInline(admin.TabularInline):
    model = UserPackSubscription
    extra = 0
    fields = ["pack", "status", "created_at"]
    readonly_fields = ["created_at"]
    autocomplete_fields = ["pack"]


class MemoryStateInline(admin.TabularInline):
    model = MemoryState
    extra = 0
    fields = ["item", "skill_type", "state", "stability", "difficulty", "reps", "lapses", "next_due"]
    readonly_fields = ["item", "skill_type", "state", "stability", "difficulty", "reps", "lapses", "next_due"]
    show_change_link = True
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = [
        "username",
        "email",
        "is_onboarded",
        "current_level",
        "native_language",
        "learning_goal",
        "credit_balance",
        "subscription_count",
        "review_count",
        "is_active",
        "date_joined",
    ]
    list_filter = [
        "is_onboarded",
        "current_level",
        "native_language",
        "learning_goal",
        "is_active",
        "is_staff",
    ]
    search_fields = ["username", "email", "first_name", "last_name"]
    list_editable = ["is_onboarded"]
    ordering = ["-date_joined"]
    list_per_page = 25

    fieldsets = BaseUserAdmin.fieldsets + (
        (
            "Onboarding & Learning",
            {
                "fields": (
                    "is_onboarded",
                    "native_language",
                    "learning_language",
                    "current_level",
                    "learning_goal",
                ),
            },
        ),
        (
            "AI & Credits",
            {
                "fields": ("credit_balance", "preferred_model"),
            },
        ),
    )

    inlines = [SubscriptionInline, MemoryStateInline]

    @admin.display(description="Packs", ordering="subscription_count")
    def subscription_count(self, obj):
        count = obj.pack_subscriptions.filter(status="active").count()
        if count:
            return format_html('<span style="color: green;">{}</span>', count)
        return "0"

    @admin.display(description="Reviews")
    def review_count(self, obj):
        return obj.memory_states.count()

    actions = ["reset_onboarding", "grant_welcome_credit"]

    @admin.action(description="Reset onboarding (unboard selected users)")
    def reset_onboarding(self, request, queryset):
        updated = queryset.update(
            is_onboarded=False,
            learning_goal=None,
        )
        self.message_user(request, f"{updated} user(s) reset to non-onboarded state.")

    @admin.action(description="Grant welcome credit (€0.50)")
    def grant_welcome_credit(self, request, queryset):
        from decimal import Decimal

        for user in queryset:
            user.credit_balance += Decimal("0.50")
            user.save(update_fields=["credit_balance"])
        self.message_user(request, f"€0.50 credit granted to {queryset.count()} user(s).")
