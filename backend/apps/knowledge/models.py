import uuid

from django.db import models

from apps.content.models import TimeStampedModel
from apps.knowledge.constants import (
    AuxiliaryVerb,
    FormalityLevel,
    Gender,
    LexicalItemType,
    PartOfSpeech,
    ReferenceSheetType,
    RelationshipType,
)


class LearningGoal(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True, default="")
    icon = models.CharField(max_length=50, blank=True, default="")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "learning goal"
        verbose_name_plural = "learning goals"

    def __str__(self) -> str:
        return self.name


class LexicalItem(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(
        max_length=20,
        choices=LexicalItemType.choices,
        db_index=True,
    )
    text = models.CharField(max_length=255)
    translation = models.CharField(max_length=255)
    level = models.ForeignKey(
        "content.Level",
        on_delete=models.CASCADE,
        related_name="lexical_items",
    )
    part_of_speech = models.CharField(
        max_length=20,
        choices=PartOfSpeech.choices,
        blank=True,
        default="",
    )
    audio_url = models.URLField(blank=True, default="")
    frequency_rank = models.PositiveIntegerField(null=True, blank=True)
    tags = models.JSONField(default=list, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        ordering = ["level", "frequency_rank"]
        verbose_name = "lexical item"
        verbose_name_plural = "lexical items"
        constraints = [
            models.UniqueConstraint(
                fields=["text", "type", "level"],
                name="unique_item_per_type_level",
            ),
        ]
        indexes = [
            models.Index(fields=["type", "level"]),
            models.Index(fields=["level", "frequency_rank"]),
        ]

    def __str__(self) -> str:
        return f"{self.text} ({self.get_type_display()}, {self.level})"


class NounDetail(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.OneToOneField(
        LexicalItem,
        on_delete=models.CASCADE,
        related_name="noun_detail",
    )
    gender = models.CharField(max_length=1, choices=Gender.choices)
    plural = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        verbose_name = "noun detail"
        verbose_name_plural = "noun details"

    def __str__(self) -> str:
        return f"{self.get_gender_display()} — {self.item.text}"


class VerbDetail(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.OneToOneField(
        LexicalItem,
        on_delete=models.CASCADE,
        related_name="verb_detail",
    )
    separable_prefix = models.CharField(max_length=50, blank=True, default="")
    auxiliary_verb = models.CharField(
        max_length=10,
        choices=AuxiliaryVerb.choices,
        blank=True,
        default="",
    )
    conjugation_group = models.CharField(max_length=50, blank=True, default="")

    class Meta:
        verbose_name = "verb detail"
        verbose_name_plural = "verb details"

    def __str__(self) -> str:
        return f"{self.item.text} (aux: {self.auxiliary_verb or '—'})"


class PhraseDetail(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.OneToOneField(
        LexicalItem,
        on_delete=models.CASCADE,
        related_name="phrase_detail",
    )
    formality_level = models.CharField(
        max_length=20,
        choices=FormalityLevel.choices,
        default=FormalityLevel.NEUTRAL,
    )
    context = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        verbose_name = "phrase detail"
        verbose_name_plural = "phrase details"

    def __str__(self) -> str:
        return f"{self.item.text} ({self.get_formality_level_display()})"


class GrammarRuleDetail(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.OneToOneField(
        LexicalItem,
        on_delete=models.CASCADE,
        related_name="grammar_rule_detail",
    )
    description = models.TextField()
    pattern = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        verbose_name = "grammar rule detail"
        verbose_name_plural = "grammar rule details"

    def __str__(self) -> str:
        return f"{self.item.text}"


class ItemRelationship(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    from_item = models.ForeignKey(
        LexicalItem,
        on_delete=models.CASCADE,
        related_name="relationships_from",
    )
    to_item = models.ForeignKey(
        LexicalItem,
        on_delete=models.CASCADE,
        related_name="relationships_to",
    )
    relationship_type = models.CharField(
        max_length=20,
        choices=RelationshipType.choices,
    )

    class Meta:
        verbose_name = "item relationship"
        verbose_name_plural = "item relationships"
        constraints = [
            models.UniqueConstraint(
                fields=["from_item", "to_item", "relationship_type"],
                name="unique_item_relationship",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.from_item.text} —[{self.relationship_type}]→ {self.to_item.text}"


class ExampleSentence(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.ForeignKey(
        LexicalItem,
        on_delete=models.CASCADE,
        related_name="examples",
    )
    text = models.TextField()
    translation = models.TextField()
    audio_url = models.URLField(blank=True, default="")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["item", "order"]
        verbose_name = "example sentence"
        verbose_name_plural = "example sentences"
        indexes = [
            models.Index(fields=["item", "order"]),
        ]

    def __str__(self) -> str:
        return f"{self.item.text}: {self.text[:60]}"


class ReferenceSheet(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    sheet_type = models.CharField(
        max_length=20,
        choices=ReferenceSheetType.choices,
    )
    level = models.ForeignKey(
        "content.Level",
        on_delete=models.CASCADE,
        related_name="reference_sheets",
    )
    headers = models.JSONField(default=list, blank=True)
    rows = models.JSONField(default=list, blank=True)
    note = models.TextField(blank=True, default="")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["level", "order"]
        verbose_name = "reference sheet"
        verbose_name_plural = "reference sheets"

    def __str__(self) -> str:
        return f"{self.title} ({self.level})"


class ModelClass(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, default="")
    models_in_class = models.ManyToManyField(
        "ai_content.LLMModel",
        related_name="model_classes",
        blank=True,
    )

    class Meta:
        ordering = ["name"]
        verbose_name = "model class"
        verbose_name_plural = "model classes"

    def __str__(self) -> str:
        return self.name
