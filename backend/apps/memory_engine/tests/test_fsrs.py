"""
Pure unit tests for FSRS algorithm. No Django, no database.
"""

from datetime import datetime, timedelta

from apps.memory_engine.fsrs import (
    FSRSCard,
    FSRSParams,
    Rating,
    State,
    repeat,
    retrievability,
)


class TestInitialReview:
    def test_new_card_good_sets_initial_stability(self):
        card = FSRSCard()
        params = FSRSParams()
        output = repeat(card, Rating.GOOD, datetime(2024, 1, 1))
        assert output.card.stability == params.w[Rating.GOOD - 1]

    def test_new_card_again_sets_short_stability(self):
        params = FSRSParams()
        output = repeat(FSRSCard(), Rating.AGAIN, datetime(2024, 1, 1))
        assert output.card.stability == params.w[Rating.AGAIN - 1]

    def test_new_card_easy_sets_highest_stability(self):
        params = FSRSParams()
        output = repeat(FSRSCard(), Rating.EASY, datetime(2024, 1, 1))
        assert output.card.stability == params.w[Rating.EASY - 1]

    def test_stability_order_again_lt_hard_lt_good_lt_easy(self):
        now = datetime(2024, 1, 1)
        stabilities = {}
        for rating in Rating:
            output = repeat(FSRSCard(), rating, now)
            stabilities[rating] = output.card.stability
        assert stabilities[Rating.AGAIN] < stabilities[Rating.HARD]
        assert stabilities[Rating.HARD] < stabilities[Rating.GOOD]
        assert stabilities[Rating.GOOD] < stabilities[Rating.EASY]

    def test_new_card_good_enters_review_state(self):
        output = repeat(FSRSCard(), Rating.GOOD, datetime(2024, 1, 1))
        assert output.card.state == State.REVIEW

    def test_new_card_again_enters_learning_state(self):
        output = repeat(FSRSCard(), Rating.AGAIN, datetime(2024, 1, 1))
        assert output.card.state == State.LEARNING

    def test_new_card_again_increments_lapses(self):
        output = repeat(FSRSCard(), Rating.AGAIN, datetime(2024, 1, 1))
        assert output.card.lapses == 1

    def test_first_review_sets_reps_to_one(self):
        output = repeat(FSRSCard(), Rating.GOOD, datetime(2024, 1, 1))
        assert output.card.reps == 1

    def test_first_review_sets_last_review(self):
        now = datetime(2024, 1, 1)
        output = repeat(FSRSCard(), Rating.GOOD, now)
        assert output.card.last_review == now


class TestDifficulty:
    def test_difficulty_in_bounds(self):
        for rating in Rating:
            output = repeat(FSRSCard(), rating, datetime(2024, 1, 1))
            assert 1.0 <= output.card.difficulty <= 10.0

    def test_again_produces_higher_difficulty_than_easy(self):
        out_again = repeat(FSRSCard(), Rating.AGAIN, datetime(2024, 1, 1))
        out_easy = repeat(FSRSCard(), Rating.EASY, datetime(2024, 1, 1))
        assert out_again.card.difficulty > out_easy.card.difficulty

    def test_difficulty_stays_bounded_after_many_agains(self):
        now = datetime(2024, 1, 1)
        card = FSRSCard()
        for i in range(20):
            output = repeat(card, Rating.AGAIN, now + timedelta(hours=i))
            card = output.card
        assert 1.0 <= card.difficulty <= 10.0


class TestSubsequentReviews:
    def _reviewed_card(self) -> tuple[FSRSCard, datetime]:
        now = datetime(2024, 1, 1)
        output = repeat(FSRSCard(), Rating.GOOD, now)
        return output.card, now

    def test_good_increases_stability(self):
        card, first = self._reviewed_card()
        later = first + timedelta(days=3)
        output = repeat(card, Rating.GOOD, later)
        assert output.card.stability > card.stability

    def test_again_decreases_stability(self):
        card, first = self._reviewed_card()
        later = first + timedelta(days=3)
        output = repeat(card, Rating.AGAIN, later)
        assert output.card.stability < card.stability

    def test_again_sets_relearning_state(self):
        card, first = self._reviewed_card()
        later = first + timedelta(days=3)
        output = repeat(card, Rating.AGAIN, later)
        assert output.card.state == State.RELEARNING

    def test_again_increments_lapses(self):
        card, first = self._reviewed_card()
        later = first + timedelta(days=3)
        output = repeat(card, Rating.AGAIN, later)
        assert output.card.lapses == card.lapses + 1

    def test_hard_shorter_interval_than_good(self):
        card, first = self._reviewed_card()
        later = first + timedelta(days=3)
        out_hard = repeat(card, Rating.HARD, later)
        out_good = repeat(card, Rating.GOOD, later)
        assert out_hard.next_review < out_good.next_review

    def test_easy_longer_interval_than_good(self):
        card, first = self._reviewed_card()
        later = first + timedelta(days=3)
        out_easy = repeat(card, Rating.EASY, later)
        out_good = repeat(card, Rating.GOOD, later)
        assert out_easy.next_review > out_good.next_review

    def test_reps_increment(self):
        card, first = self._reviewed_card()
        later = first + timedelta(days=3)
        output = repeat(card, Rating.GOOD, later)
        assert output.card.reps == card.reps + 1


class TestRetrievability:
    def test_new_card_has_zero_retrievability(self):
        r = retrievability(FSRSCard(), datetime(2024, 1, 1))
        assert r == 0.0

    def test_just_reviewed_card_has_high_retrievability(self):
        now = datetime(2024, 1, 1)
        output = repeat(FSRSCard(), Rating.GOOD, now)
        r = retrievability(output.card, now)
        assert r > 0.99

    def test_retrievability_decays_over_time(self):
        now = datetime(2024, 1, 1)
        output = repeat(FSRSCard(), Rating.GOOD, now)
        card = output.card
        r_1day = retrievability(card, now + timedelta(days=1))
        r_7day = retrievability(card, now + timedelta(days=7))
        r_30day = retrievability(card, now + timedelta(days=30))
        assert r_1day > r_7day > r_30day

    def test_higher_stability_slower_decay(self):
        now = datetime(2024, 1, 1)
        low_s = FSRSCard(stability=2.0, state=State.REVIEW, last_review=now)
        high_s = FSRSCard(stability=20.0, state=State.REVIEW, last_review=now)
        later = now + timedelta(days=5)
        assert retrievability(high_s, later) > retrievability(low_s, later)


class TestIntervals:
    def test_next_review_is_after_now(self):
        now = datetime(2024, 1, 1)
        output = repeat(FSRSCard(), Rating.GOOD, now)
        assert output.next_review > now

    def test_learning_card_has_short_interval(self):
        now = datetime(2024, 1, 1)
        output = repeat(FSRSCard(), Rating.AGAIN, now)
        interval = (output.next_review - now).days
        assert interval <= 1

    def test_interval_respects_maximum(self):
        now = datetime(2024, 1, 1)
        params = FSRSParams(maximum_interval=30)
        card = FSRSCard(
            stability=1000.0,
            difficulty=1.0,
            state=State.REVIEW,
            last_review=now,
            reps=10,
        )
        output = repeat(card, Rating.EASY, now + timedelta(days=1), params)
        interval = (output.next_review - (now + timedelta(days=1))).days
        assert interval <= 30
