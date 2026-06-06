import hashlib
import json
import logging

from django.conf import settings
from openai import OpenAI

from .models import AIContent, AIInteraction

logger = logging.getLogger(__name__)

SYSTEM_PROMPTS = {
    "examples": (
        "You are a German language tutor. Given a learning item from a {level_code} German course, "
        "provide 5-8 additional example sentences that demonstrate the same concept. "
        "Return ONLY a JSON object with an \"examples\" array, each element having \"german\" and \"english\" keys."
    ),
    "quiz": (
        "You are a German language tutor creating a quick quiz. Given a learning item from a {level_code} German course, "
        "create 3-5 quiz questions testing the student's understanding. "
        "Return ONLY a JSON object with a \"questions\" array, each having \"question\" (string), "
        "\"options\" (array of 4 strings), \"correct_index\" (0-3), and \"explanation\" (string) keys."
    ),
    "explanation": (
        "You are a German language tutor. Given a learning item from a {level_code} German course, "
        "provide a clear, detailed explanation. Include when/why to use it, common mistakes, and tips. "
        "Return ONLY a JSON object with \"title\" (string), \"explanation\" (markdown string), "
        "\"key_points\" (array of strings), and \"common_mistakes\" (array of strings) keys."
    ),
}

USER_TEMPLATE = (
    "Section: {section_title}\n"
    "Level: {level_code} ({category})\n"
    "{headers_line}"
    "Item: {item_cells}\n"
)


def compute_fingerprint(
    level_code: str,
    category: str,
    section_title: str,
    item_cells: list[str],
) -> str:
    payload = json.dumps(
        [level_code, category, section_title, sorted(item_cells)],
        sort_keys=True,
        ensure_ascii=True,
    )
    return hashlib.sha256(payload.encode()).hexdigest()


def generate_ai_content(
    *,
    user: object,
    level_code: str,
    category: str,
    section_title: str,
    section_headers: list[str],
    item_cells: list[str],
    action_type: str,
) -> AIContent:
    fingerprint = compute_fingerprint(level_code, category, section_title, item_cells)

    existing = AIContent.objects.filter(
        item_fingerprint=fingerprint,
        action_type=action_type,
    ).first()

    if existing:
        AIInteraction.objects.create(user=user, ai_content=existing)
        return existing

    system_prompt = SYSTEM_PROMPTS[action_type].format(level_code=level_code)

    headers_line = ""
    if section_headers:
        headers_line = f"Headers: {' | '.join(section_headers)}\n"

    user_message = USER_TEMPLATE.format(
        section_title=section_title,
        level_code=level_code,
        category=category,
        headers_line=headers_line,
        item_cells=" | ".join(item_cells),
    )

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=settings.OPENROUTER_API_KEY,
    )

    response = client.chat.completions.create(
        model=settings.OPENROUTER_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        max_tokens=1500,
        temperature=0.7,
    )

    response_text = response.choices[0].message.content or ""
    model_used = response.model or settings.OPENROUTER_MODEL

    response_json = None
    try:
        cleaned = response_text.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1].rsplit("```", 1)[0]
        response_json = json.loads(cleaned)
    except (json.JSONDecodeError, IndexError):
        logger.warning("Failed to parse AI response as JSON for fingerprint %s", fingerprint)

    ai_content = AIContent.objects.create(
        item_fingerprint=fingerprint,
        action_type=action_type,
        level_code=level_code,
        category=category,
        section_title=section_title,
        item_cells=item_cells,
        section_headers=section_headers,
        response_text=response_text,
        response_json=response_json,
        model_used=model_used,
    )

    AIInteraction.objects.create(user=user, ai_content=ai_content)

    return ai_content
