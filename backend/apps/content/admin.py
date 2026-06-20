from django.contrib import admin

from .models import (
    ConversationLine,
    ConversationPart,
    FillBlankPart,
    Level,
    Page,
    PageLexicalItem,
    PagePart,
    Section,
    SectionItem,
    TeachingNotePart,
)


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


# --- Page admin ---


class PageLexicalItemInline(admin.TabularInline):
    model = PageLexicalItem
    extra = 0
    ordering = ["order"]
    raw_id_fields = ["item"]


class TeachingNotePartInline(admin.StackedInline):
    model = TeachingNotePart
    extra = 0


class FillBlankPartInline(admin.StackedInline):
    model = FillBlankPart
    extra = 0
    raw_id_fields = ["item"]


class ConversationLineInline(admin.TabularInline):
    model = ConversationLine
    extra = 0
    ordering = ["order"]


class ConversationPartInline(admin.StackedInline):
    model = ConversationPart
    extra = 0


class PagePartInline(admin.TabularInline):
    model = PagePart
    extra = 0
    ordering = ["order"]
    show_change_link = True


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ["title", "pack", "order", "item_count", "part_count"]
    list_filter = ["pack__level", "pack"]
    ordering = ["pack", "order"]
    search_fields = ["title"]
    raw_id_fields = ["pack"]
    inlines = [PageLexicalItemInline, PagePartInline]

    @admin.display(description="Items")
    def item_count(self, obj: Page) -> int:
        return obj.page_lexical_items.count()

    @admin.display(description="Parts")
    def part_count(self, obj: Page) -> int:
        return obj.parts.count()


@admin.register(PagePart)
class PagePartAdmin(admin.ModelAdmin):
    list_display = ["page", "part_type", "order"]
    list_filter = ["part_type"]
    ordering = ["page", "order"]
    inlines = [TeachingNotePartInline, FillBlankPartInline, ConversationPartInline]


@admin.register(ConversationPart)
class ConversationPartAdmin(admin.ModelAdmin):
    list_display = ["page_part", "context"]
    inlines = [ConversationLineInline]
