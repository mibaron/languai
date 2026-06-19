from __future__ import annotations

from dataclasses import dataclass, field

from django.utils import timezone

from apps.memory_engine.constants import (
    DEFAULT_NEW_CARDS_PER_SESSION,
    DEFAULT_SESSION_SIZE,
    SkillType,
)
from apps.memory_engine.fsrs import FSRSCard, State, retrievability
from apps.memory_engine.services import get_due_items, get_new_items
from apps.users.models import User


@dataclass
class SessionConfig:
    max_items: int = DEFAULT_SESSION_SIZE
    max_new: int = DEFAULT_NEW_CARDS_PER_SESSION
    skill_types: list[str] = field(default_factory=lambda: [SkillType.RECOGNITION])


@dataclass
class SessionItem:
    item_id: str
    item_text: str
    item_translation: str
    item_type: str
    skill_type: str
    is_new: bool
    retrievability: float


def build_session(
    *,
    user: User,
    pack_ids: list[str],
    config: SessionConfig | None = None,
) -> list[SessionItem]:
    if config is None:
        config = SessionConfig()

    now = timezone.now()
    session: list[SessionItem] = []

    due_states = get_due_items(
        user=user,
        pack_ids=pack_ids,
        skill_types=config.skill_types,
    )

    for ms in due_states[: config.max_items]:
        card = FSRSCard(
            difficulty=ms.difficulty,
            stability=ms.stability,
            reps=ms.reps,
            lapses=ms.lapses,
            state=State(ms.state),
            last_review=ms.last_review,
        )
        r = retrievability(card, now)
        session.append(
            SessionItem(
                item_id=str(ms.item_id),
                item_text=ms.item.text,
                item_translation=ms.item.translation,
                item_type=ms.item.type,
                skill_type=ms.skill_type,
                is_new=False,
                retrievability=r,
            )
        )

    remaining = config.max_items - len(session)
    new_count = min(remaining, config.max_new)

    if new_count > 0 and pack_ids:
        reviewed_item_ids = [s.item_id for s in session]

        for skill_type in config.skill_types:
            if new_count <= 0:
                break

            new_items = get_new_items(
                user=user,
                pack_ids=pack_ids,
                skill_type=skill_type,
                exclude_item_ids=reviewed_item_ids,
            )[:new_count]

            for item in new_items:
                session.append(
                    SessionItem(
                        item_id=str(item.id),
                        item_text=item.text,
                        item_translation=item.translation,
                        item_type=item.type,
                        skill_type=skill_type,
                        is_new=True,
                        retrievability=0.0,
                    )
                )
                reviewed_item_ids.append(str(item.id))
                new_count -= 1

    return session
