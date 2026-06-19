import uuid

from django.conf import settings
from django.db import models

from apps.content.models import TimeStampedModel


class Pack(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    level = models.ForeignKey(
        "content.Level",
        on_delete=models.CASCADE,
        related_name="packs",
    )
    base_language = models.CharField(max_length=10, db_index=True)
    description = models.TextField(blank=True, default="")
    grammar_count = models.PositiveIntegerField(default=0)
    vocab_count = models.PositiveIntegerField(default=0)
    exercise_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)
    items = models.ManyToManyField(
        "knowledge.LexicalItem",
        through="packs.PackItem",
        related_name="packs",
        blank=True,
    )
    reference_sheets = models.ManyToManyField(
        "knowledge.ReferenceSheet",
        through="packs.PackReferenceSheet",
        related_name="packs",
        blank=True,
    )
    goals = models.ManyToManyField(
        "knowledge.LearningGoal",
        related_name="packs",
        blank=True,
    )

    class Meta:
        ordering = ["level", "base_language"]
        verbose_name = "pack"
        verbose_name_plural = "packs"

    def __str__(self) -> str:
        return f"{self.title} ({self.level.code}, {self.base_language})"


class PackItem(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pack = models.ForeignKey(
        Pack,
        on_delete=models.CASCADE,
        related_name="pack_items",
    )
    item = models.ForeignKey(
        "knowledge.LexicalItem",
        on_delete=models.CASCADE,
        related_name="pack_items",
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "pack item"
        verbose_name_plural = "pack items"
        constraints = [
            models.UniqueConstraint(
                fields=["pack", "item"],
                name="unique_pack_item",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.pack.title} — {self.item.text} (#{self.order})"


class PackReferenceSheet(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pack = models.ForeignKey(
        Pack,
        on_delete=models.CASCADE,
        related_name="pack_reference_sheets",
    )
    sheet = models.ForeignKey(
        "knowledge.ReferenceSheet",
        on_delete=models.CASCADE,
        related_name="pack_reference_sheets",
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "pack reference sheet"
        verbose_name_plural = "pack reference sheets"
        constraints = [
            models.UniqueConstraint(
                fields=["pack", "sheet"],
                name="unique_pack_reference_sheet",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.pack.title} — {self.sheet.title} (#{self.order})"


class SubscriptionStatus(models.TextChoices):
    ACTIVE = "active", "Active"
    ARCHIVED = "archived", "Archived"
    COMPLETED = "completed", "Completed"


class UserPackSubscription(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="pack_subscriptions",
    )
    pack = models.ForeignKey(
        Pack,
        on_delete=models.CASCADE,
        related_name="subscriptions",
    )
    status = models.CharField(
        max_length=20,
        choices=SubscriptionStatus.choices,
        default=SubscriptionStatus.ACTIVE,
        db_index=True,
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "pack subscription"
        verbose_name_plural = "pack subscriptions"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "pack"],
                name="unique_user_pack_subscription",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.user.username} → {self.pack.title} ({self.status})"
