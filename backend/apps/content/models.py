import uuid

from django.conf import settings
from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Level(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=10, unique=True, db_index=True)
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "level"
        verbose_name_plural = "levels"

    def __str__(self) -> str:
        return self.code


class Category(models.TextChoices):
    GRAMMAR = "grammar", "Grammatik"
    VOCAB = "vocab", "Wortschatz"
    VERBS = "verbs", "Verben"
    PHRASES = "phrases", "Phrasen"


class ContentType(models.TextChoices):
    TABLE = "table", "Table"
    NOTES = "notes", "Notes"
    GRID = "grid", "Grid"


class Section(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    level = models.ForeignKey(
        Level,
        on_delete=models.CASCADE,
        related_name="sections",
    )
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        db_index=True,
    )
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)
    content_type = models.CharField(max_length=20, choices=ContentType.choices)
    note = models.TextField(blank=True, default="")
    note2 = models.TextField(blank=True, default="")
    headers = models.JSONField(default=list, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_sections",
    )

    class Meta:
        ordering = ["level", "category", "order"]
        verbose_name = "section"
        verbose_name_plural = "sections"
        indexes = [
            models.Index(fields=["level", "category"]),
        ]

    def __str__(self) -> str:
        return f"{self.level.code} / {self.get_category_display()} / {self.title}"


class SectionItem(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name="items",
    )
    order = models.PositiveIntegerField(default=0)
    cells = models.JSONField(default=list)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_items",
    )

    class Meta:
        ordering = ["section", "order"]
        verbose_name = "section item"
        verbose_name_plural = "section items"
        indexes = [
            models.Index(fields=["section", "order"]),
        ]

    def __str__(self) -> str:
        preview = str(self.cells[:2]) if len(self.cells) > 2 else str(self.cells)
        return f"{self.section.title} #{self.order} — {preview}"
