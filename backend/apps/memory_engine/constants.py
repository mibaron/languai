from django.db import models


class SkillType(models.TextChoices):
    RECOGNITION = "recognition", "Recognition"
    PRODUCTION = "production", "Production"
    LISTENING = "listening", "Listening"
    SPELLING = "spelling", "Spelling"
    APPLICATION = "application", "Application"


DEFAULT_REQUEST_RETENTION = 0.9
DEFAULT_SESSION_SIZE = 20
DEFAULT_NEW_CARDS_PER_SESSION = 5
MAX_INTERVAL_DAYS = 36500
