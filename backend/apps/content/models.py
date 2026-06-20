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


class PagePartType(models.TextChoices):
    NOTE = "note", "Teaching Note"
    FILL_BLANK = "fill_blank", "Fill in the Blank"
    CONVERSATION = "conversation", "Conversation"
    TABLE = "table", "Table"


class Page(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pack = models.ForeignKey(
        "packs.Pack",
        on_delete=models.CASCADE,
        related_name="pages",
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    order = models.PositiveIntegerField(default=0)
    items = models.ManyToManyField(
        "knowledge.LexicalItem",
        through="PageLexicalItem",
        related_name="pages",
    )

    class Meta:
        ordering = ["pack", "order"]
        verbose_name = "page"
        verbose_name_plural = "pages"
        constraints = [
            models.UniqueConstraint(
                fields=["pack", "order"],
                name="unique_page_order_in_pack",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.pack.title} — {self.title}"


class PageLexicalItem(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    page = models.ForeignKey(
        Page,
        on_delete=models.CASCADE,
        related_name="page_lexical_items",
    )
    item = models.ForeignKey(
        "knowledge.LexicalItem",
        on_delete=models.CASCADE,
        related_name="page_lexical_items",
    )
    order = models.PositiveIntegerField(default=0)
    display_label = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        ordering = ["page", "order"]
        verbose_name = "page lexical item"
        verbose_name_plural = "page lexical items"
        constraints = [
            models.UniqueConstraint(
                fields=["page", "item"],
                name="unique_page_item",
            ),
        ]

    def __str__(self) -> str:
        label = self.display_label or self.item.text
        return f"{self.page.title} — {label}"


class PagePart(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    page = models.ForeignKey(
        Page,
        on_delete=models.CASCADE,
        related_name="parts",
    )
    part_type = models.CharField(max_length=20, choices=PagePartType.choices)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["page", "order"]
        verbose_name = "page part"
        verbose_name_plural = "page parts"
        constraints = [
            models.UniqueConstraint(
                fields=["page", "order"],
                name="unique_part_order_in_page",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.page.title} — Part {self.order} ({self.get_part_type_display()})"


class TeachingNotePart(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    page_part = models.OneToOneField(
        PagePart,
        on_delete=models.CASCADE,
        related_name="teaching_note",
    )
    content = models.TextField()

    class Meta:
        verbose_name = "teaching note part"
        verbose_name_plural = "teaching note parts"

    def __str__(self) -> str:
        return f"Note: {self.content[:50]}"


class FillBlankPart(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    page_part = models.OneToOneField(
        PagePart,
        on_delete=models.CASCADE,
        related_name="fill_blank",
    )
    text_before = models.CharField(max_length=500)
    text_after = models.CharField(max_length=500)
    answer = models.CharField(max_length=100)
    hint = models.CharField(max_length=255, blank=True, default="")
    item = models.ForeignKey(
        "knowledge.LexicalItem",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="fill_blank_parts",
    )

    class Meta:
        verbose_name = "fill blank part"
        verbose_name_plural = "fill blank parts"

    def __str__(self) -> str:
        return f"{self.text_before} ___ {self.text_after}"


class ConversationPart(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    page_part = models.OneToOneField(
        PagePart,
        on_delete=models.CASCADE,
        related_name="conversation",
    )
    context = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        verbose_name = "conversation part"
        verbose_name_plural = "conversation parts"

    def __str__(self) -> str:
        return f"Conversation: {self.context or 'No context'}"


class ConversationLine(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        ConversationPart,
        on_delete=models.CASCADE,
        related_name="lines",
    )
    order = models.PositiveIntegerField(default=0)
    speaker = models.CharField(max_length=100)
    text = models.CharField(max_length=500)
    translation = models.CharField(max_length=500, blank=True, default="")
    is_blank = models.BooleanField(default=False)
    blank_answer = models.CharField(max_length=200, blank=True, default="")

    class Meta:
        ordering = ["conversation", "order"]
        verbose_name = "conversation line"
        verbose_name_plural = "conversation lines"
        constraints = [
            models.UniqueConstraint(
                fields=["conversation", "order"],
                name="unique_line_order_in_conversation",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.speaker}: {self.text[:50]}"


class TablePart(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    page_part = models.OneToOneField(
        PagePart,
        on_delete=models.CASCADE,
        related_name="table",
    )
    headers = models.JSONField(default=list)
    rows = models.JSONField(default=list)
    note = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "table part"
        verbose_name_plural = "table parts"

    def __str__(self) -> str:
        col_count = len(self.headers) if self.headers else 0
        row_count = len(self.rows) if self.rows else 0
        return f"Table: {col_count} cols × {row_count} rows"
