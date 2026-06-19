from django.contrib import admin

from apps.knowledge.models import (
    ExampleSentence,
    GrammarRuleDetail,
    ItemRelationship,
    LearningGoal,
    LexicalItem,
    ModelClass,
    NounDetail,
    PhraseDetail,
    ReferenceSheet,
    VerbDetail,
)


class NounDetailInline(admin.StackedInline):
    model = NounDetail
    max_num = 1
    extra = 0


class VerbDetailInline(admin.StackedInline):
    model = VerbDetail
    max_num = 1
    extra = 0


class PhraseDetailInline(admin.StackedInline):
    model = PhraseDetail
    max_num = 1
    extra = 0


class GrammarRuleDetailInline(admin.StackedInline):
    model = GrammarRuleDetail
    max_num = 1
    extra = 0


class ExampleSentenceInline(admin.TabularInline):
    model = ExampleSentence
    extra = 1


@admin.register(LexicalItem)
class LexicalItemAdmin(admin.ModelAdmin):
    list_display = ["text", "translation", "type", "level", "part_of_speech", "is_active"]
    list_filter = ["type", "level", "is_active", "part_of_speech"]
    search_fields = ["text", "translation"]
    inlines = [
        NounDetailInline,
        VerbDetailInline,
        PhraseDetailInline,
        GrammarRuleDetailInline,
        ExampleSentenceInline,
    ]

    def get_inlines(self, request, obj=None):
        if obj is None:
            return self.inlines
        type_to_inline = {
            "vocab": [NounDetailInline, ExampleSentenceInline],
            "verb": [VerbDetailInline, ExampleSentenceInline],
            "phrase": [PhraseDetailInline, ExampleSentenceInline],
            "grammar_rule": [GrammarRuleDetailInline, ExampleSentenceInline],
        }
        return type_to_inline.get(obj.type, self.inlines)


@admin.register(ItemRelationship)
class ItemRelationshipAdmin(admin.ModelAdmin):
    list_display = ["from_item", "relationship_type", "to_item"]
    list_filter = ["relationship_type"]
    raw_id_fields = ["from_item", "to_item"]


@admin.register(ExampleSentence)
class ExampleSentenceAdmin(admin.ModelAdmin):
    list_display = ["item", "text", "order"]
    raw_id_fields = ["item"]


@admin.register(ReferenceSheet)
class ReferenceSheetAdmin(admin.ModelAdmin):
    list_display = ["title", "sheet_type", "level", "is_active", "order"]
    list_filter = ["sheet_type", "level", "is_active"]
    search_fields = ["title"]


@admin.register(LearningGoal)
class LearningGoalAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "order"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(ModelClass)
class ModelClassAdmin(admin.ModelAdmin):
    list_display = ["name"]
    filter_horizontal = ["models_in_class"]
