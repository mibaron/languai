import uuid

from django.conf import settings
from django.db import models

from apps.content.models import Section, TimeStampedModel


class SectionProgress(TimeStampedModel):
    """Tracks a user's progress on a specific section."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="section_progress",
    )
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name="user_progress",
    )
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-updated_at"]
        verbose_name = "section progress"
        verbose_name_plural = "section progress"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "section"],
                name="unique_user_section_progress",
            ),
        ]

    def __str__(self) -> str:
        status = "completed" if self.is_completed else "in progress"
        return f"{self.user.username} — {self.section.title} ({status})"


class UserPageProgress(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="page_progress",
    )
    page = models.ForeignKey(
        "content.Page",
        on_delete=models.CASCADE,
        related_name="user_progress",
    )
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-completed_at"]
        verbose_name = "page progress"
        verbose_name_plural = "page progress"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "page"],
                name="unique_user_page_progress",
            ),
        ]

    def __str__(self) -> str:
        status = "studied" if self.completed_at else "not studied"
        return f"{self.user.username} — {self.page.title} ({status})"
