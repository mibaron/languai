"""Seed the database with German learning content from the reference JSX data."""

import json
from pathlib import Path

from django.core.management.base import BaseCommand

from apps.content.models import Level, Section

LEVELS = [
    {"code": "A1.1", "name": "Beginner 1", "order": 1},
    {"code": "A1.2", "name": "Beginner 2", "order": 2},
    {"code": "A2.1", "name": "Elementary 1", "order": 3},
    {"code": "A2.2", "name": "Elementary 2", "order": 4},
]


class Command(BaseCommand):
    help = "Seed the database with German learning content"

    def add_arguments(self, parser):
        parser.add_argument(
            "--data-file",
            type=str,
            help="Path to JSON seed data file",
        )
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing content before seeding",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("Clearing existing content...")
            Section.objects.all().delete()
            Level.objects.all().delete()

        data_file = options.get("data_file")
        if not data_file:
            data_file = Path(__file__).resolve().parent.parent.parent.parent.parent / "seed_data.json"

        if not Path(data_file).exists():
            self.stderr.write(
                self.style.ERROR(
                    f"Data file not found: {data_file}\n"
                    "Generate it first with: python scripts/extract_seed_data.py"
                )
            )
            return

        with open(data_file) as f:
            content_data = json.load(f)

        levels_created = 0
        for level_info in LEVELS:
            _, created = Level.objects.get_or_create(
                code=level_info["code"],
                defaults={"name": level_info["name"], "order": level_info["order"]},
            )
            if created:
                levels_created += 1

        self.stdout.write(f"Levels: {levels_created} created")

        sections_created = 0
        for level_code, categories in content_data.items():
            level = Level.objects.get(code=level_code)
            for category, sections in categories.items():
                for i, section_data in enumerate(sections):
                    _, created = Section.objects.get_or_create(
                        level=level,
                        category=category,
                        title=section_data["title"],
                        defaults={
                            "order": i,
                            "content_type": section_data.get("type", "notes"),
                            "note": section_data.get("note", ""),
                            "note2": section_data.get("note2", ""),
                            "headers": section_data.get("headers", []),
                            "rows": section_data.get("rows", []),
                            "notes": section_data.get("notes", []),
                        },
                    )
                    if created:
                        sections_created += 1

        self.stdout.write(
            self.style.SUCCESS(f"Seeding complete: {sections_created} sections created")
        )
