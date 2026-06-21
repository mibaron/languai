from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.utils.safestring import mark_safe

from apps.memory_engine.models import MemoryState
from apps.packs.models import UserPackSubscription

from .models import User
from .voucher_models import Voucher, generate_voucher_code


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


class VoucherStatusFilter(admin.SimpleListFilter):
    title = "status"
    parameter_name = "status"

    def lookups(self, request, model_admin):
        return [("available", "Available"), ("used", "Used")]

    def queryset(self, request, queryset):
        if self.value() == "available":
            return queryset.filter(used_by__isnull=True)
        if self.value() == "used":
            return queryset.filter(used_by__isnull=False)
        return queryset


@admin.register(Voucher)
class VoucherAdmin(admin.ModelAdmin):
    list_display = ["code", "amount_display", "status_display", "used_by", "used_at", "voucher_link", "created_at"]
    list_filter = [VoucherStatusFilter, "amount", "created_at"]
    search_fields = ["code", "used_by__username", "used_by__email"]
    readonly_fields = ["used_by", "used_at", "voucher_link", "created_at"]
    ordering = ["-created_at"]
    list_per_page = 50

    fieldsets = (
        (None, {"fields": ("code", "amount")}),
        ("Redemption", {"fields": ("used_by", "used_at")}),
        ("Link", {"fields": ("voucher_link",)}),
        ("Meta", {"fields": ("created_at",)}),
    )

    @admin.display(description="Amount")
    def amount_display(self, obj):
        return f"€{obj.amount}"

    @admin.display(description="Status")
    def status_display(self, obj):
        if obj.is_used:
            return mark_safe('<span style="color: gray;">Used</span>')
        return mark_safe('<span style="color: green; font-weight: bold;">Available</span>')

    @admin.display(description="Voucher Link")
    def voucher_link(self, obj):
        if not obj.code:
            return "-"
        url = f"https://langu-ai.de/voucher/{obj.code}"
        return format_html(
            '<input type="text" value="{}" readonly '
            'style="width:400px; padding:4px 8px; border:1px solid #ccc; border-radius:4px; cursor:text;" '
            'onclick="this.select(); document.execCommand(\'copy\');" />',
            url,
        )

    def get_changeform_initial_data(self, request):
        return {"code": generate_voucher_code()}

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.is_used:
            return self.readonly_fields + ["code", "amount"]
        return self.readonly_fields

    def has_delete_permission(self, request, obj=None):
        if obj and obj.is_used:
            return False
        return super().has_delete_permission(request, obj)
