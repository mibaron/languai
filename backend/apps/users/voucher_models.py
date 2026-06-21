import secrets
import string
import uuid
from decimal import Decimal

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


def generate_voucher_code() -> str:
    alphabet = string.ascii_uppercase + string.digits
    # Remove ambiguous characters
    alphabet = alphabet.replace("0", "").replace("O", "").replace("I", "").replace("1", "").replace("L", "")
    return "".join(secrets.choice(alphabet) for _ in range(8))


class Voucher(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        help_text="Unique voucher code. Leave blank to auto-generate.",
    )
    amount = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.50")), MaxValueValidator(Decimal("10.00"))],
        help_text="Credit amount in EUR (0.50 – 10.00)",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    used_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="redeemed_vouchers",
    )
    used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "voucher"
        verbose_name_plural = "vouchers"

    def __str__(self) -> str:
        status = f"used by {self.used_by}" if self.used_by else "available"
        return f"{self.code} (€{self.amount}) — {status}"

    @property
    def is_used(self) -> bool:
        return self.used_by is not None
