"""
FSRS-5 spaced repetition algorithm.

Pure Python implementation with zero Django dependencies.
Can be extracted as a standalone package.

Based on: https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import IntEnum


class Rating(IntEnum):
    AGAIN = 1
    HARD = 2
    GOOD = 3
    EASY = 4


class State(IntEnum):
    NEW = 0
    LEARNING = 1
    REVIEW = 2
    RELEARNING = 3


@dataclass
class FSRSCard:
    difficulty: float = 0.0
    stability: float = 0.0
    reps: int = 0
    lapses: int = 0
    state: State = State.NEW
    last_review: datetime | None = None


@dataclass
class FSRSOutput:
    card: FSRSCard
    next_review: datetime
    retrievability: float


@dataclass
class FSRSParams:
    w: list[float] = field(
        default_factory=lambda: [
            0.4072,
            1.1829,
            3.1262,
            15.4722,
            7.2102,
            0.5316,
            1.0651,
            0.0589,
            1.5330,
            0.1544,
            1.0339,
            1.9395,
            0.1100,
            0.2990,
            2.0075,
            0.2424,
            2.9466,
            0.5044,
            0.6173,
        ]
    )
    request_retention: float = 0.9
    maximum_interval: int = 36500


DECAY = -0.5
FACTOR = 19 / 81


def _clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def _initial_stability(rating: Rating, params: FSRSParams) -> float:
    return max(params.w[rating - 1], 0.1)


def _initial_difficulty(rating: Rating, params: FSRSParams) -> float:
    d = params.w[4] - math.exp(params.w[5] * (rating - 1)) + 1
    return _clamp(d, 1.0, 10.0)


def _next_difficulty(d: float, rating: Rating, params: FSRSParams) -> float:
    delta = -(params.w[6] * (rating - 3))
    d_new = d + delta * ((10.0 - d) / 9.0)
    # Mean reversion
    d_new = params.w[7] * _initial_difficulty(Rating.EASY, params) + (1 - params.w[7]) * d_new
    return _clamp(d_new, 1.0, 10.0)


def _next_recall_stability(
    d: float, s: float, r: float, rating: Rating, params: FSRSParams
) -> float:
    hard_penalty = params.w[15] if rating == Rating.HARD else 1.0
    easy_bonus = params.w[16] if rating == Rating.EASY else 1.0

    s_new = s * (
        1
        + math.exp(params.w[8])
        * (11 - d)
        * math.pow(s, -params.w[9])
        * (math.exp((1 - r) * params.w[10]) - 1)
        * hard_penalty
        * easy_bonus
    )
    return min(s_new, params.maximum_interval)


def _next_forget_stability(d: float, s: float, r: float, params: FSRSParams) -> float:
    s_new = (
        params.w[11]
        * math.pow(d, -params.w[12])
        * (math.pow(s + 1, params.w[13]) - 1)
        * math.exp((1 - r) * params.w[14])
    )
    return _clamp(s_new, 0.1, s)


def retrievability(card: FSRSCard, now: datetime) -> float:
    if card.state == State.NEW or card.last_review is None:
        return 0.0
    elapsed_days = max((now - card.last_review).total_seconds() / 86400, 0)
    if card.stability <= 0:
        return 0.0
    return math.pow(1 + FACTOR * elapsed_days / card.stability, DECAY)


def _interval_from_stability(s: float, request_retention: float, maximum_interval: int) -> float:
    interval = s / FACTOR * (math.pow(request_retention, 1 / DECAY) - 1)
    return min(max(interval, 1), maximum_interval)


def repeat(
    card: FSRSCard,
    rating: Rating,
    now: datetime,
    params: FSRSParams | None = None,
) -> FSRSOutput:
    if params is None:
        params = FSRSParams()

    card = FSRSCard(
        difficulty=card.difficulty,
        stability=card.stability,
        reps=card.reps,
        lapses=card.lapses,
        state=card.state,
        last_review=card.last_review,
    )

    r = retrievability(card, now)

    if card.state == State.NEW:
        card.difficulty = _initial_difficulty(rating, params)
        card.stability = _initial_stability(rating, params)
        card.reps = 1

        if rating == Rating.AGAIN:
            card.state = State.LEARNING
            card.lapses += 1
        else:
            card.state = State.REVIEW

    else:
        card.difficulty = _next_difficulty(card.difficulty, rating, params)
        card.reps += 1

        if rating == Rating.AGAIN:
            card.stability = _next_forget_stability(card.difficulty, card.stability, r, params)
            card.state = State.RELEARNING
            card.lapses += 1
        else:
            card.stability = _next_recall_stability(
                card.difficulty, card.stability, r, rating, params
            )
            card.state = State.REVIEW

    card.last_review = now

    interval_days = _interval_from_stability(
        card.stability, params.request_retention, params.maximum_interval
    )

    if card.state in (State.LEARNING, State.RELEARNING):
        interval_days = min(interval_days, 1)

    next_review = now + timedelta(days=interval_days)
    new_r = retrievability(card, next_review)

    return FSRSOutput(card=card, next_review=next_review, retrievability=new_r)
