"""Seed the database with all learning content.

Orchestrates the full seeding chain:
  1. Levels, Sections, SectionItems (from seed_data.json)
  2. Packs (initial pack definitions)
  3. Knowledge (LexicalItems, ReferenceSheets — via seed_knowledge)
  4. Pages (step-by-step learning pages — via seed_pages)
"""

import json
from pathlib import Path

from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.content.models import Level, Page, Section, SectionItem
from apps.knowledge.models import LexicalItem, ReferenceSheet
from apps.packs.models import Pack, PackItem, PackReferenceSheet, UserPackSubscription

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

PACK_SLUGS_WITH_PAGES = ["a1-1-en"]


class Command(BaseCommand):
    help = "Seed the database with all learning content (levels, sections, packs, knowledge, pages)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--data-file",
            type=str,
            help="Path to JSON seed data file",
        )
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear ALL existing content before seeding (levels, sections, packs, knowledge, pages)",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options["clear"]:
            self._clear_all()

        levels_created = self._seed_levels()
        sections_created, items_created = self._seed_sections(options)
        packs_created = self._seed_packs()

        self.stdout.write(
            self.style.SUCCESS(
                f"Content: {levels_created} levels, "
                f"{sections_created} sections, {items_created} items, "
                f"{packs_created} packs"
            )
        )

        self.stdout.write("\nSeeding knowledge (LexicalItems, ReferenceSheets)...")
        call_command("seed_knowledge", stdout=self.stdout, stderr=self.stderr)

        self.stdout.write("\nSeeding pages...")
        for slug in PACK_SLUGS_WITH_PAGES:
            call_command("seed_pages", pack=slug, stdout=self.stdout, stderr=self.stderr)

        self.stdout.write(self.style.SUCCESS("\nAll seeding complete."))

    def _clear_all(self):
        self.stdout.write("Clearing all content...")
        Page.objects.all().delete()
        PackItem.objects.all().delete()
        PackReferenceSheet.objects.all().delete()
        UserPackSubscription.objects.all().delete()
        LexicalItem.objects.all().delete()
        ReferenceSheet.objects.all().delete()
        SectionItem.objects.all().delete()
        Section.objects.all().delete()
        Pack.objects.all().delete()
        Level.objects.all().delete()
        self.stdout.write("  Cleared.")

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
