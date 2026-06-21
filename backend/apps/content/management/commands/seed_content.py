"""Seed the database with German learning content from seed_data.json."""

import json
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.content.models import Level, Section, SectionItem
from apps.packs.models import Pack

LEVELS = [
    {"code": "A1.1", "name": "Beginner 1", "order": 1},
    {"code": "A1.2", "name": "Beginner 2", "order": 2},
    {"code": "A2.1", "name": "Elementary 1", "order": 3},
    {"code": "A2.2", "name": "Elementary 2", "order": 4},
]

PACKS = [
    {
        "title": "German A1.1 — English",
        "slug": "a1-1-en",
        "level_code": "A1.1",
        "base_language": "en",
        "description": (
            "Complete beginner German with English explanations. "
            "Covers basic grammar, essential vocabulary, common verbs, "
            "and everyday phrases for the Goethe A1 exam."
        ),
        "grammar_count": 12,
        "vocab_count": 8,
        "exercise_count": 45,
    },
    {
        "title": "German A1.1 — فارسی",
        "slug": "a1-1-fa",
        "level_code": "A1.1",
        "base_language": "fa",
        "description": (
            "آلمانی مقدماتی با توضیحات فارسی. "
            "شامل گرامر پایه، واژگان ضروری، افعال رایج "
            "و عبارات روزمره برای آزمون گوته A1."
        ),
        "grammar_count": 12,
        "vocab_count": 8,
        "exercise_count": 45,
    },
    {
        "title": "German A1.2 — English",
        "slug": "a1-2-en",
        "level_code": "A1.2",
        "base_language": "en",
        "description": (
            "Continue your A1 journey. Separable verbs, modal verbs, "
            "accusative case, time expressions, and more vocabulary for daily life."
        ),
        "grammar_count": 10,
        "vocab_count": 6,
        "exercise_count": 38,
    },
    {
        "title": "German A2.1 — English",
        "slug": "a2-1-en",
        "level_code": "A2.1",
        "base_language": "en",
        "description": (
            "Elementary German with dative case, two-way prepositions, "
            "comparative forms, and expanded vocabulary for travel, work, "
            "and health topics."
        ),
        "grammar_count": 14,
        "vocab_count": 10,
        "exercise_count": 52,
    },
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

    @transaction.atomic
    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("Clearing existing content...")
            SectionItem.objects.all().delete()
            Section.objects.all().delete()
            Pack.objects.all().delete()
            Level.objects.all().delete()

        levels_created = self._seed_levels()
        sections_created, items_created = self._seed_sections(options)
        packs_created = self._seed_packs()

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeding complete: {levels_created} levels, "
                f"{sections_created} sections, {items_created} items, "
                f"{packs_created} packs"
            )
        )

    def _seed_levels(self) -> int:
        created_count = 0
        for level_info in LEVELS:
            _, created = Level.objects.get_or_create(
                code=level_info["code"],
                defaults={"name": level_info["name"], "order": level_info["order"]},
            )
            if created:
                created_count += 1
        return created_count

    def _seed_sections(self, options: dict) -> tuple[int, int]:
        data_file = options.get("data_file")
        if not data_file:
            data_file = (
                Path(__file__).resolve().parent.parent.parent.parent.parent / "seed_data.json"
            )

        if not Path(data_file).exists():
            self.stderr.write(
                self.style.ERROR(
                    f"Data file not found: {data_file}\n"
                    "Generate it first with: python scripts/extract_seed_data.py"
                )
            )
            return 0, 0

        with open(data_file) as f:
            content_data = json.load(f)

        sections_created = 0
        items_created = 0

        for level_code, categories in content_data.items():
            level = Level.objects.get(code=level_code)

            for category, sections in categories.items():
                for section_order, section_data in enumerate(sections):
                    content_type = section_data.get("type", "notes")

                    section, created = Section.objects.get_or_create(
                        level=level,
                        category=category,
                        title=section_data["title"],
                        defaults={
                            "order": section_order,
                            "content_type": content_type,
                            "note": section_data.get("note", ""),
                            "note2": section_data.get("note2", ""),
                            "headers": section_data.get("headers", []),
                        },
                    )
                    if created:
                        sections_created += 1

                    if not section.items.exists():
                        items_to_create = []

                        if content_type in ("table", "grid"):
                            for item_order, row in enumerate(section_data.get("rows", [])):
                                items_to_create.append(
                                    SectionItem(
                                        section=section,
                                        order=item_order,
                                        cells=row,
                                    )
                                )
                        elif content_type == "notes":
                            for item_order, note_text in enumerate(section_data.get("notes", [])):
                                items_to_create.append(
                                    SectionItem(
                                        section=section,
                                        order=item_order,
                                        cells=[note_text],
                                    )
                                )

                        SectionItem.objects.bulk_create(items_to_create)
                        items_created += len(items_to_create)

        return sections_created, items_created

    def _seed_packs(self) -> int:
        created_count = 0
        for pack_data in PACKS:
            level_code = pack_data["level_code"]
            try:
                level = Level.objects.get(code=level_code)
            except Level.DoesNotExist:
                self.stderr.write(
                    self.style.WARNING(f"Skipping pack: level {level_code} not found")
                )
                continue
            _, created = Pack.objects.get_or_create(
                slug=pack_data["slug"],
                defaults={
                    "title": pack_data["title"],
                    "level": level,
                    "base_language": pack_data["base_language"],
                    "description": pack_data["description"],
                    "grammar_count": pack_data["grammar_count"],
                    "vocab_count": pack_data["vocab_count"],
                    "exercise_count": pack_data["exercise_count"],
                },
            )
            if created:
                created_count += 1
        return created_count
