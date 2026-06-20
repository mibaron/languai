from django.contrib import admin

from .models import (
    ErrorCorrectionExercise,
    Exercise,
    FillBlankExercise,
    FlashcardExercise,
    MatchingExercise,
    MatchingPair,
    MCQChoice,
    MCQExercise,
    SentenceOrderExercise,
)


class FlashcardInline(admin.StackedInline):
    model = FlashcardExercise
    extra = 0


class MCQInline(admin.StackedInline):
    model = MCQExercise
    extra = 0


class FillBlankInline(admin.StackedInline):
    model = FillBlankExercise
    extra = 0


class SentenceOrderInline(admin.StackedInline):
    model = SentenceOrderExercise
    extra = 0


class ErrorCorrectionInline(admin.StackedInline):
    model = ErrorCorrectionExercise
    extra = 0


class MatchingInline(admin.StackedInline):
    model = MatchingExercise
    extra = 0


class MCQChoiceInline(admin.TabularInline):
    model = MCQChoice
    extra = 0
    ordering = ["order"]


class MatchingPairInline(admin.TabularInline):
    model = MatchingPair
    extra = 0
    ordering = ["order"]


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ["item", "exercise_type", "source", "pack", "is_active", "created_at"]
    list_filter = ["exercise_type", "source", "is_active", "pack"]
    search_fields = ["item__text"]
    raw_id_fields = ["item", "pack", "page", "created_by"]
    inlines = [
        FlashcardInline,
        MCQInline,
        FillBlankInline,
        SentenceOrderInline,
        ErrorCorrectionInline,
        MatchingInline,
    ]


@admin.register(MCQExercise)
class MCQExerciseAdmin(admin.ModelAdmin):
    list_display = ["question", "exercise"]
    inlines = [MCQChoiceInline]


@admin.register(MatchingExercise)
class MatchingExerciseAdmin(admin.ModelAdmin):
    list_display = ["instruction", "exercise"]
    inlines = [MatchingPairInline]
