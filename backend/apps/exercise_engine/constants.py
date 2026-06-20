from django.db import models


class ExerciseType(models.TextChoices):
    FLASHCARD = "flashcard", "Flashcard"
    MCQ_RECOGNITION = "mcq_recognition", "MCQ Recognition"
    FILL_BLANK = "fill_blank", "Fill in the Blank"
    SENTENCE_ORDER = "sentence_order", "Sentence Order"
    ERROR_CORRECTION = "error_correction", "Error Correction"
    MATCHING = "matching", "Matching"


class ExerciseSource(models.TextChoices):
    CREATOR = "creator", "Pack Creator"
    ENGINE = "engine", "Auto-generated"
    AI = "ai", "AI-generated"
