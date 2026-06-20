import uuid

from django.conf import settings
from django.db import models

from apps.content.models import TimeStampedModel

from .constants import ExerciseSource, ExerciseType


class Exercise(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pack = models.ForeignKey(
        "packs.Pack",
        on_delete=models.CASCADE,
        related_name="exercises",
    )
    item = models.ForeignKey(
        "knowledge.LexicalItem",
        on_delete=models.CASCADE,
        related_name="exercises",
    )
    page = models.ForeignKey(
        "content.Page",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="exercises",
    )
    exercise_type = models.CharField(max_length=20, choices=ExerciseType.choices)
    source = models.CharField(max_length=20, choices=ExerciseSource.choices)
    source_model = models.CharField(max_length=100, blank=True, default="")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_exercises",
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "exercise"
        verbose_name_plural = "exercises"
        indexes = [
            models.Index(fields=["item", "exercise_type"]),
            models.Index(fields=["pack", "exercise_type"]),
        ]

    def __str__(self) -> str:
        return f"{self.get_exercise_type_display()} — {self.item.text}"


class FlashcardExercise(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exercise = models.OneToOneField(
        Exercise,
        on_delete=models.CASCADE,
        related_name="flashcard",
    )
    front_text = models.CharField(max_length=255)
    back_text = models.CharField(max_length=255)
    front_context = models.CharField(max_length=255, blank=True, default="")
    back_context = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        verbose_name = "flashcard exercise"
        verbose_name_plural = "flashcard exercises"

    def __str__(self) -> str:
        return f"{self.front_text} → {self.back_text}"


class MCQExercise(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exercise = models.OneToOneField(
        Exercise,
        on_delete=models.CASCADE,
        related_name="mcq",
    )
    question = models.CharField(max_length=500)
    explanation = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "MCQ exercise"
        verbose_name_plural = "MCQ exercises"

    def __str__(self) -> str:
        return self.question[:80]


class MCQChoice(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mcq = models.ForeignKey(
        MCQExercise,
        on_delete=models.CASCADE,
        related_name="choices",
    )
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["mcq", "order"]
        verbose_name = "MCQ choice"
        verbose_name_plural = "MCQ choices"
        constraints = [
            models.UniqueConstraint(
                fields=["mcq", "order"],
                name="unique_mcq_choice_order",
            ),
        ]

    def __str__(self) -> str:
        correct = "✓" if self.is_correct else "✗"
        return f"{correct} {self.text}"


class FillBlankExercise(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exercise = models.OneToOneField(
        Exercise,
        on_delete=models.CASCADE,
        related_name="fill_blank",
    )
    text_before = models.CharField(max_length=500)
    text_after = models.CharField(max_length=500)
    answer = models.CharField(max_length=100)
    accept_alternatives = models.JSONField(default=list, blank=True)
    hint = models.CharField(max_length=255, blank=True, default="")
    explanation = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "fill blank exercise"
        verbose_name_plural = "fill blank exercises"

    def __str__(self) -> str:
        return f"{self.text_before} ___ {self.text_after}"


class SentenceOrderExercise(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exercise = models.OneToOneField(
        Exercise,
        on_delete=models.CASCADE,
        related_name="sentence_order",
    )
    jumbled_words = models.JSONField()
    correct_answers = models.JSONField()
    hint = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        verbose_name = "sentence order exercise"
        verbose_name_plural = "sentence order exercises"

    def __str__(self) -> str:
        return f"Order: {' '.join(self.jumbled_words[:4])}..."


class ErrorCorrectionExercise(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exercise = models.OneToOneField(
        Exercise,
        on_delete=models.CASCADE,
        related_name="error_correction",
    )
    sentence = models.CharField(max_length=500)
    error_start = models.PositiveIntegerField()
    error_end = models.PositiveIntegerField()
    correct_replacement = models.CharField(max_length=100)
    corrected_sentence = models.CharField(max_length=500)
    explanation = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "error correction exercise"
        verbose_name_plural = "error correction exercises"

    def __str__(self) -> str:
        return f"Fix: {self.sentence[:50]}"


class MatchingExercise(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exercise = models.OneToOneField(
        Exercise,
        on_delete=models.CASCADE,
        related_name="matching",
    )
    instruction = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        verbose_name = "matching exercise"
        verbose_name_plural = "matching exercises"

    def __str__(self) -> str:
        return self.instruction or "Matching exercise"


class MatchingPair(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    matching = models.ForeignKey(
        MatchingExercise,
        on_delete=models.CASCADE,
        related_name="pairs",
    )
    left = models.CharField(max_length=255)
    right = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["matching", "order"]
        verbose_name = "matching pair"
        verbose_name_plural = "matching pairs"
        constraints = [
            models.UniqueConstraint(
                fields=["matching", "order"],
                name="unique_matching_pair_order",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.left} ↔ {self.right}"
