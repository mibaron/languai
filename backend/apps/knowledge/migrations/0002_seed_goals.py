from django.db import migrations


def seed_goals(apps, schema_editor):
    LearningGoal = apps.get_model("knowledge", "LearningGoal")
    goals = [
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
    for goal_data in goals:
        LearningGoal.objects.get_or_create(
            slug=goal_data["slug"],
            defaults=goal_data,
        )


def remove_goals(apps, schema_editor):
    LearningGoal = apps.get_model("knowledge", "LearningGoal")
    LearningGoal.objects.filter(slug__in=["exam", "living", "working"]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("knowledge", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_goals, remove_goals),
    ]
