import uuid
from decimal import Decimal

from django.conf import settings
from django.db import models

from apps.content.models import TimeStampedModel


class LLMModel(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    model_id = models.CharField(max_length=100, unique=True, db_index=True)
    name = models.CharField(max_length=200)
    provider = models.CharField(max_length=100)
    prompt_price = models.DecimalField(max_digits=20, decimal_places=12, default=Decimal("0"))
    completion_price = models.DecimalField(max_digits=20, decimal_places=12, default=Decimal("0"))
    context_length = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=False)
    is_default = models.BooleanField(default=False)

    class Meta:
        ordering = ["provider", "name"]
        verbose_name = "LLM model"
        verbose_name_plural = "LLM models"

    def __str__(self) -> str:
        return f"{self.name} ({self.model_id})"

    def save(self, *args: object, **kwargs: object) -> None:
        if self.is_default:
            LLMModel.objects.filter(is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)


class ActionType(models.TextChoices):
    EXAMPLES = "examples", "More Examples"
    QUIZ = "quiz", "Quiz / Question"
    EXPLANATION = "explanation", "Explanation"


class AIContent(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item_fingerprint = models.CharField(max_length=64, db_index=True)
    action_type = models.CharField(max_length=20, choices=ActionType.choices)

    level_code = models.CharField(max_length=10)
    category = models.CharField(max_length=20)
    section_title = models.CharField(max_length=255)
    item_cells = models.JSONField(default=list)
    section_headers = models.JSONField(default=list, blank=True)

    prompt_messages = models.JSONField(default=list)
    response_text = models.TextField()
    response_json = models.JSONField(null=True, blank=True)
    model_used = models.CharField(max_length=100, default="")
    cost_usd = models.DecimalField(max_digits=10, decimal_places=8, default=Decimal("0"))

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "AI content"
        verbose_name_plural = "AI content"
        constraints = [
            models.UniqueConstraint(
                fields=["item_fingerprint", "action_type", "model_used"],
                name="unique_fingerprint_action_model",
            ),
        ]
        indexes = [
            models.Index(fields=["item_fingerprint", "action_type", "model_used"]),
        ]

    def __str__(self) -> str:
        return f"{self.section_title} — {self.get_action_type_display()} ({self.model_used})"


class UserAIContent(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saved_ai_content",
    )
    ai_content = models.ForeignKey(
        AIContent,
        on_delete=models.CASCADE,
        related_name="saved_by",
    )
    share_key = models.CharField(max_length=12, unique=True, null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "user AI content"
        verbose_name_plural = "user AI content"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "ai_content"],
                name="unique_user_ai_content",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.user.username} — {self.ai_content}"


class AIInteraction(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="ai_interactions",
    )
    ai_content = models.ForeignKey(
        AIContent,
        on_delete=models.CASCADE,
        related_name="interactions",
    )
    cost_usd = models.DecimalField(max_digits=10, decimal_places=8, default=Decimal("0"))

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "AI interaction"
        verbose_name_plural = "AI interactions"
        indexes = [
            models.Index(fields=["user", "created_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.user.username} — {self.ai_content} — {self.created_at}"
