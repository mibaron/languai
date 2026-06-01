from django.contrib import admin

from .models import Level, Section


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ["code", "name", "order"]
    ordering = ["order"]


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ["title", "level", "category", "content_type", "order"]
    list_filter = ["level", "category", "content_type"]
    ordering = ["level", "category", "order"]
    search_fields = ["title"]
