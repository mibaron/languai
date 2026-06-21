# This migration previously seeded initial packs.
# Pack creation now happens via Django admin (Content > Content imports).
# Kept as a no-op to preserve migration history.

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("packs", "0001_initial"),
        ("content", "0001_initial"),
    ]

    operations = []
