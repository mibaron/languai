from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["username", "email", "current_level", "credit_balance", "preferred_model", "is_active"]
    list_filter = ["current_level", "is_active"]
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Learning", {"fields": ("native_language", "current_level")}),
        ("AI & Credit", {"fields": ("credit_balance", "preferred_model")}),
    )
