import uuid

from django.conf import settings
from django.db import models

from apps.content.models import TimeStampedModel
from apps.memory_engine.constants import SkillType


class MemoryState(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="memory_states",
    )
    item = models.ForeignKey(
        "knowledge.LexicalItem",
        on_delete=models.CASCADE,
        related_name="memory_states",
    )
    skill_type = models.CharField(
        max_length=20,
        choices=SkillType.choices,
        db_index=True,
    )
    difficulty = models.FloatField(default=0.0)
    stability = models.FloatField(default=0.0)
    reps = models.PositiveIntegerField(default=0)
    lapses = models.PositiveIntegerField(default=0)
    state = models.PositiveSmallIntegerField(default=0)
    last_review = models.DateTimeField(null=True, blank=True)
    next_due = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["next_due"]
        verbose_name = "memory state"
        verbose_name_plural = "memory states"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "item", "skill_type"],
                name="unique_memory_state",
            ),
        ]
        indexes = [
            models.Index(fields=["user", "next_due"]),
            models.Index(fields=["user", "state"]),
        ]

    def __str__(self) -> str:
        return f"{self.user.username} — {self.item.text} ({self.skill_type})"


class ReviewLog(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    memory_state = models.ForeignKey(
        MemoryState,
        on_delete=models.CASCADE,
        related_name="review_logs",
    )
    rating = models.PositiveSmallIntegerField()
    response_time_ms = models.PositiveIntegerField(null=True, blank=True)
    scheduled_days = models.FloatField(default=0)
    actual_days = models.FloatField(default=0)
    difficulty_before = models.FloatField(default=0)
    stability_before = models.FloatField(default=0)
    difficulty_after = models.FloatField(default=0)
    stability_after = models.FloatField(default=0)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "review log"
        verbose_name_plural = "review logs"
        indexes = [
            models.Index(fields=["memory_state", "created_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.memory_state} — rating={self.rating} @ {self.created_at}"
