import factory
from django.utils import timezone

from apps.knowledge.tests.factories import LexicalItemFactory
from apps.memory_engine.constants import SkillType
from apps.memory_engine.models import MemoryState, ReviewLog
from apps.packs.tests.factories import UserFactory


class MemoryStateFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MemoryState

    user = factory.SubFactory(UserFactory)
    item = factory.SubFactory(LexicalItemFactory)
    skill_type = SkillType.RECOGNITION
    difficulty = 5.0
    stability = 3.0
    reps = 1
    lapses = 0
    state = 2
    last_review = factory.LazyFunction(timezone.now)
    next_due = factory.LazyFunction(timezone.now)


class ReviewLogFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ReviewLog

    memory_state = factory.SubFactory(MemoryStateFactory)
    rating = 3
    scheduled_days = 3.0
    actual_days = 3.0
    difficulty_before = 5.0
    stability_before = 3.0
    difficulty_after = 5.0
    stability_after = 6.0
