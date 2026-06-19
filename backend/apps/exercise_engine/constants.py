from django.db import models


class ExerciseType(models.TextChoices):
    FLASHCARD = "flashcard", "Flashcard"
    MCQ_RECOGNITION = "mcq_recognition", "MCQ Recognition"
