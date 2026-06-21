from django.core.management.base import BaseCommand, CommandError

from apps.content.services import delete_pack_and_all_content
from apps.packs.models import Pack


class Command(BaseCommand):
    help = "Delete a pack and ALL related content, exercises, user progress, and memory states"

    def add_arguments(self, parser):
        parser.add_argument("slug", type=str, help="Pack slug to delete")
        parser.add_argument(
            "--yes",
            action="store_true",
            help="Skip confirmation prompt",
        )

    def handle(self, *args, **options):
        slug = options["slug"]
        try:
            pack = Pack.objects.get(slug=slug)
        except Pack.DoesNotExist:
            raise CommandError(f"Pack with slug '{slug}' not found") from None

        if not options["yes"]:
            self.stdout.write(
                self.style.WARNING(
                    f"\nThis will permanently delete pack '{pack.title}' and ALL:\n"
                    f"  - Pages, page parts, conversations\n"
                    f"  - Exercises (all types)\n"
                    f"  - Lexical items and their details\n"
                    f"  - User page progress\n"
                    f"  - User memory states and review logs\n"
                    f"  - User subscriptions\n"
                )
            )
            confirm = input("Type the pack slug to confirm: ")
            if confirm != slug:
                raise CommandError("Aborted.")

        result = delete_pack_and_all_content(pack)

        for key, count in result.items():
            if count:
                self.stdout.write(f"  {key}: {count}")

        self.stdout.write(self.style.SUCCESS(f"\nPack '{pack.title}' deleted."))
