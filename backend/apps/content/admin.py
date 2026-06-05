from django.contrib import admin

from .models import Level, Section, SectionItem


class SectionItemInline(admin.TabularInline):
    model = SectionItem
    extra = 0
    ordering = ["order"]


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ["code", "name", "order"]
    ordering = ["order"]


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ["title", "level", "category", "content_type", "order", "item_count"]
    list_filter = ["level", "category", "content_type"]
    ordering = ["level", "category", "order"]
    search_fields = ["title"]
    inlines = [SectionItemInline]

    @admin.display(description="Items")
    def item_count(self, obj: Section) -> int:
        return obj.items.count()


@admin.register(SectionItem)
class SectionItemAdmin(admin.ModelAdmin):
    list_display = ["section", "order", "cells"]
    list_filter = ["section__level", "section__category"]
    ordering = ["section", "order"]
    raw_id_fields = ["section"]
