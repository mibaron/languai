"""Initialize the database with base data required for the app to run.

This is NOT for content/packs — those are imported via Django admin.
This seeds only the structural data that the app needs to function:
  1. Levels (A1.1 through C2)
  2. Learning Goals (exam, living, working)
  3. LLM Models (synced from OpenRouter)
  4. Superuser account
"""

from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.content.models import Level
from apps.knowledge.models import LearningGoal

LEVELS = [
    {"code": "A1.1", "name": "Beginner 1", "order": 1},
    {"code": "A1.2", "name": "Beginner 2", "order": 2},
    {"code": "A2.1", "name": "Elementary 1", "order": 3},
    {"code": "A2.2", "name": "Elementary 2", "order": 4},
    {"code": "B1.1", "name": "Intermediate 1", "order": 5},
    {"code": "B1.2", "name": "Intermediate 2", "order": 6},
    {"code": "B2.1", "name": "Upper Intermediate 1", "order": 7},
    {"code": "B2.2", "name": "Upper Intermediate 2", "order": 8},
    {"code": "C1", "name": "Advanced", "order": 9},
    {"code": "C2", "name": "Mastery", "order": 10},
]

GOALS = [
    {
        "name": "Official exam preparation",
        "slug": "exam",
        "description": "Prepare for Goethe, TestDaF, telc, or other official German exams",
        "icon": "graduation-cap",
        "order": 1,
    },
    {
        "name": "Living in society",
        "slug": "living",
        "description": "Everyday German for daily life, shopping, appointments, and socializing",
        "icon": "home",
        "order": 2,
    },
    {
        "name": "Working in society",
        "slug": "working",
        "description": "Professional German for the workplace, meetings, and business communication",
        "icon": "briefcase",
        "order": 3,
    },
]


class Command(BaseCommand):
    help = "Initialize database with base data (levels, goals, LLM models, superuser)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--skip-superuser",
            action="store_true",
            help="Skip superuser creation",
        )
        parser.add_argument(
            "--skip-models",
            action="store_true",
            help="Skip LLM model sync (requires OPENROUTER_API_KEY)",
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("Initializing database...\n"))

        self.stdout.write("  Running migrations...")
        call_command("migrate", stdout=self.stdout, stderr=self.stderr)

        self._seed_levels()
        self._seed_goals()

        if not options["skip_models"]:
            self._sync_llm_models()
        else:
            self.stdout.write("  Skipped LLM model sync.\n")

        if not options["skip_superuser"]:
            self._create_superuser()
        else:
            self.stdout.write("  Skipped superuser creation.\n")

        self.stdout.write(self.style.SUCCESS("\nDatabase initialized."))
        self.stdout.write(
            "\nNext: import content packs via Django admin (Content > Content imports)"
        )

    @transaction.atomic
    def _seed_levels(self):
        created = 0
        for level_data in LEVELS:
            _, was_created = Level.objects.get_or_create(
                code=level_data["code"],
                defaults={"name": level_data["name"], "order": level_data["order"]},
            )
            if was_created:
                created += 1
        total = Level.objects.count()
        self.stdout.write(f"  Levels: {created} created, {total} total")

    @transaction.atomic
    def _seed_goals(self):
        created = 0
        for goal_data in GOALS:
            _, was_created = LearningGoal.objects.get_or_create(
                slug=goal_data["slug"],
                defaults=goal_data,
            )
            if was_created:
                created += 1
        total = LearningGoal.objects.count()
        self.stdout.write(f"  Learning goals: {created} created, {total} total")

    def _sync_llm_models(self):
        self.stdout.write("  Syncing LLM models from OpenRouter...")
        try:
            call_command("sync_models", stdout=self.stdout, stderr=self.stderr)
        except Exception as exc:
            self.stderr.write(
                self.style.WARNING(
                    f"  LLM model sync failed: {exc}\n"
                    "  You can retry later with: python manage.py sync_models"
                )
            )

    def _create_superuser(self):
        from apps.users.models import User

        if User.objects.filter(is_superuser=True).exists():
            self.stdout.write("  Superuser already exists, skipping.")
            return

        self.stdout.write("\n  Creating superuser...")
        call_command("createsuperuser", stdout=self.stdout, stderr=self.stderr)
