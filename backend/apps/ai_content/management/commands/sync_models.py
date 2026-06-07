from decimal import Decimal

import requests
from django.conf import settings
from django.core.management.base import BaseCommand

from apps.ai_content.models import LLMModel


class Command(BaseCommand):
    help = "Sync available models from OpenRouter API"

    def handle(self, *args: object, **options: object) -> None:
        if not settings.OPENROUTER_API_KEY:
            self.stderr.write("OPENROUTER_API_KEY is not set")
            return

        self.stdout.write("Fetching models from OpenRouter...")

        response = requests.get(
            "https://openrouter.ai/api/v1/models",
            headers={"Authorization": f"Bearer {settings.OPENROUTER_API_KEY}"},
            timeout=30,
        )
        response.raise_for_status()
        data = response.json()

        models_data = data.get("data", [])
        created_count = 0
        updated_count = 0

        for model in models_data:
            model_id = model["id"]
            name = model.get("name", model_id)
            pricing = model.get("pricing", {})
            prompt_price = Decimal(str(pricing.get("prompt", "0")))
            completion_price = Decimal(str(pricing.get("completion", "0")))
            context_length = model.get("context_length", 0) or 0

            provider = model_id.split("/")[0] if "/" in model_id else "unknown"

            _, created = LLMModel.objects.update_or_create(
                model_id=model_id,
                defaults={
                    "name": name,
                    "provider": provider,
                    "prompt_price": prompt_price,
                    "completion_price": completion_price,
                    "context_length": context_length,
                },
            )

            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Synced {len(models_data)} models: {created_count} created, {updated_count} updated"
            )
        )
