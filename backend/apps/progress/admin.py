from django.contrib import admin

from .models import SectionProgress, UserPageProgress


@admin.register(SectionProgress)
class SectionProgressAdmin(admin.ModelAdmin):
    list_display = ["user", "section", "is_completed", "completed_at"]
    list_filter = ["is_completed"]
    raw_id_fields = ["user", "section"]


@admin.register(UserPageProgress)
class UserPageProgressAdmin(admin.ModelAdmin):
    list_display = ["user", "page", "completed_at"]
    list_filter = ["completed_at"]
    raw_id_fields = ["user", "page"]
