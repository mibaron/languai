import factory
from django.contrib.auth import get_user_model

from apps.content.models import Level
from apps.packs.models import Pack, UserPackSubscription

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        skip_postgeneration_save = True

    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.LazyAttribute(lambda o: f"{o.username}@example.com")

    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        self.set_password(extracted or "testpass123")
        if create:
            self.save(update_fields=["password"])


class LevelFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Level

    code = factory.Sequence(lambda n: f"T{n}.1")
    name = factory.Sequence(lambda n: f"Test Level {n}")
    order = factory.Sequence(lambda n: n)


class PackFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Pack

    title = factory.Sequence(lambda n: f"Test Pack {n}")
    slug = factory.Sequence(lambda n: f"test-pack-{n}")
    level = factory.SubFactory(LevelFactory)
    base_language = "en"
    description = "A test pack."
    grammar_count = 10
    vocab_count = 5
    exercise_count = 20
    is_active = True


class UserPackSubscriptionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserPackSubscription

    user = factory.SubFactory(UserFactory)
    pack = factory.SubFactory(PackFactory)
    status = "active"
