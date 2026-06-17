import uuid
from decimal import Decimal

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    native_language = models.CharField(max_length=10, default="en")
    current_level = models.CharField(max_length=10, default="A1.1")
    preferred_model = models.ForeignKey(
        "ai_content.LLMModel",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="preferred_by_users",
    )
    credit_balance = models.DecimalField(
        max_digits=10, decimal_places=6, default=Decimal("0")
    )
    is_onboarded = models.BooleanField(default=False)

    class Meta:
        ordering = ["-date_joined"]
        verbose_name = "user"
        verbose_name_plural = "users"

    def __str__(self) -> str:
        return self.username
