import uuid

from django.conf import settings
from django.db import models

from apps.content.models import TimeStampedModel


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

    response_text = models.TextField()
    response_json = models.JSONField(null=True, blank=True)
    model_used = models.CharField(max_length=50, default="")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "AI content"
        verbose_name_plural = "AI content"
        constraints = [
            models.UniqueConstraint(
                fields=["item_fingerprint", "action_type"],
                name="unique_fingerprint_action",
            ),
        ]
        indexes = [
            models.Index(fields=["item_fingerprint", "action_type"]),
        ]

    def __str__(self) -> str:
        return f"{self.section_title} — {self.get_action_type_display()}"


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

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "AI interaction"
        verbose_name_plural = "AI interactions"
        indexes = [
            models.Index(fields=["user", "created_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.user.username} — {self.ai_content} — {self.created_at}"
