from __future__ import annotations

from pathlib import Path

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand

from apps.content.models import ContentImport
from apps.content.services import run_content_import

DOCS_DIR = Path(__file__).resolve().parents[5] / "docs"


class Command(BaseCommand):
    help = "Import content from JSON files into the database (CLI wrapper around ContentImport)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--topics",
            type=str,
            default="res-1.json",
            help="Topics JSON file name in docs/ (default: res-1.json)",
        )
        parser.add_argument(
            "--pages",
            type=str,
            default="a1_1_german_course_formatted.json",
            help="Teaching content JSON file name in docs/",
        )
        parser.add_argument(
            "--exercises",
            type=str,
            default="a1_1_german_practice_exercises_all_topics.json",
            help="Practice exercises JSON file name in docs/",
        )
        parser.add_argument(
            "--level",
            type=str,
            default="A1.1",
            help="Level code (default: A1.1)",
        )
        parser.add_argument(
            "--pack-slug",
            type=str,
            default="a1-1-en",
            help="Pack slug to import into (created if missing)",
        )
        parser.add_argument(
            "--clean",
            action="store_true",
            help="Delete existing data for this pack before importing",
        )
        parser.add_argument(
            "--skip-exercises",
            action="store_true",
            help="Skip exercise import",
        )

    def handle(self, *args, **options):
        ci = ContentImport(
            level_code=options["level"],
            pack_slug=options["pack_slug"],
        )

        ci.topics_file.save(
            options["topics"],
            ContentFile((DOCS_DIR / options["topics"]).read_bytes()),
            save=False,
        )
        ci.pages_file.save(
            options["pages"],
            ContentFile((DOCS_DIR / options["pages"]).read_bytes()),
            save=False,
        )

        if not options["skip_exercises"]:
            exercises_path = DOCS_DIR / options["exercises"]
            if exercises_path.exists():
                ci.exercises_file.save(
                    options["exercises"],
                    ContentFile(exercises_path.read_bytes()),
                    save=False,
                )

        ci.save()
        self.stdout.write(f"Created ContentImport: {ci}")

        run_content_import(ci, clean=options["clean"])

        self.stdout.write(ci.result_log)
        self.stdout.write(self.style.SUCCESS(f"\nStatus: {ci.get_status_display()}"))
