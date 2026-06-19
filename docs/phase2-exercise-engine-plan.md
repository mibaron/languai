# Phase 2: Exercise Engine + Practice UI

## Context

Phase 1 delivered the Knowledge Graph (124 seeded items across A1.1/A1.2/A2.1) and Memory Engine (FSRS-5 spaced repetition, session builder, review API). The Practice tab is currently a placeholder with 4 non-functional mode cards. Phase 2 wires everything together: a backend Exercise Engine generates exercise payloads from session items, and a frontend session flow lets users actually practice.

**Goal**: Users can tap Flashcards or Quiz on the Practice tab, do a session of 20 exercises, and have FSRS schedule their next reviews.

---

## Architecture Decisions

**Exercise generation lives on the backend** (`apps/exercise_engine/`). MCQ distractors require access to all items in a level — the frontend only has session items. The exercise engine is **stateless** (no models, no migrations) — it reads from `knowledge.LexicalItem` and `memory_engine.build_session`, produces exercise payloads.

**New endpoint**: `GET /exercises/session/?exercise_type=flashcard|mcq_recognition` wraps `build_session()`, enriches each item into an exercise payload with type-specific data (flashcard front/back, MCQ choices+distractors).

**Existing `POST /memory/review/` stays unchanged** — the frontend submits reviews exactly as before. Exercise type determines rating mapping:
- Flashcard: user self-rates 1-4 → maps directly to AGAIN/HARD/GOOD/EASY
- MCQ: correct = GOOD (3), incorrect = AGAIN (1)

**MVP: 2 exercise types** — Flashcard (self-rated recognition) and MCQ Recognition (show English → pick German). Both cover `recognition` skill. Production typing deferred to Phase 3.

**Frontend session flow**: `/practice/session?mode=flashcard|mcq_recognition` — one card at a time, progress bar, feedback after each answer, results summary at end.

---

## Backend: `apps/exercise_engine/`

### App structure (no models, no migrations)

```
apps/exercise_engine/
├── __init__.py
├── apps.py                    # ExerciseEngineConfig
├── constants.py               # ExerciseType enum
├── services.py                # Exercise generation logic
├── serializers.py             # Exercise payload serializers
├── views.py                   # ExerciseSessionView
└── tests/
    ├── __init__.py
    ├── test_services.py
    └── test_views.py
```

Register `"apps.exercise_engine"` in INSTALLED_APPS.

### `constants.py`

```python
class ExerciseType(models.TextChoices):
    FLASHCARD = "flashcard", "Flashcard"
    MCQ_RECOGNITION = "mcq_recognition", "MCQ Recognition"
```

### `services.py` — Core logic

Three functions:

**`generate_exercise_session(*, user, pack_ids, exercise_type, max_items=20)`** → `list[dict]`
- Calls `build_session()` from memory_engine
- For each SessionItem, calls the appropriate generator
- Returns exercise dicts ready for serialization

**`generate_flashcard(session_item, item_details)`** → `dict`
- `front.text`: For nouns, prepend article from NounDetail gender ("der Tisch"). For verbs/phrases, use `item_text` as-is.
- `front.hint`: Part of speech or item type
- `back.text`: translation
- `back.extra`: gender label for nouns, conjugation group for verbs

**`generate_mcq(session_item, item_details, pack_ids)`** → `dict`
- Query 3 distractors: same `type` from same packs, `exclude(pk=item_id)`, `order_by("?")[:3]`
- If < 3 same-type, relax to any type from same packs
- Build 4 `choices` (correct + 3 distractors), shuffle
- `prompt.text` = translation (English), `choices[].text` = German text
- `correct_choice_id` = correct item's UUID

**Helper: `_get_item_details(item_ids)`** → `dict[str, LexicalItem]`
- Batch-fetch `LexicalItem.objects.filter(id__in=item_ids).select_related("noun_detail", "verb_detail")`
- Returns lookup dict for enrichment

### `serializers.py`

- `ExerciseSessionParamsSerializer` — validates `exercise_type` (required), `max_items` (optional)
- `FlashcardExerciseSerializer` — exercise_type, item_id, skill_type, front{text, hint}, back{text, extra}
- `MCQExerciseSerializer` — exercise_type, item_id, skill_type, prompt{text, hint}, choices[{id, text}], correct_choice_id

### `views.py`

`ExerciseSessionView(APIView)` — `GET /exercises/session/`
- `IsAuthenticated`
- Reads `exercise_type` and `max_items` from query params
- Gets user's active pack subscriptions (same pattern as existing SessionView in `apps/memory_engine/views.py`)
- Calls `generate_exercise_session()`
- Serializes and returns

### URL

Add to `api/v1/urls.py`:
```python
path("exercises/session/", ExerciseSessionView.as_view(), name="exercise-session"),
```

---

## Frontend: Practice Session Flow

### File structure

```
src/app/(app)/practice/
├── page.tsx                            # Mode selection (update: wire navigation)
├── session/
│   ├── page.tsx                        # Session page (pure composition)
│   ├── _components/
│   │   ├── types.ts                    # Exercise types, session state
│   │   ├── session-progress-bar.tsx    # Linear progress bar at top
│   │   ├── flashcard-exercise.tsx      # Card flip + 4 rating buttons
│   │   ├── mcq-exercise.tsx            # Prompt + 4 choice buttons
│   │   ├── exercise-feedback.tsx       # Correct/incorrect banner
│   │   ├── session-results.tsx         # Score summary + restart/exit
│   │   └── session-empty.tsx           # Nothing to review state
│   └── _hooks/
│       └── use-practice-session.ts     # Session state machine
```

### Types (`types.ts`)

Discriminated union for exercises:
- `FlashcardExercise` — front{text, hint?}, back{text, extra?}
- `MCQExercise` — prompt{text, hint?}, choices[{id, text}], correct_choice_id
- `Exercise = FlashcardExercise | MCQExercise`
- `SessionPhase = "loading" | "exercise" | "feedback" | "results" | "empty"`

### Hook: `use-practice-session.ts`

Session state machine that:
1. Fetches exercises from new Orval hook `useExercisesSessionList({ exercise_type })`
2. Tracks `currentIndex` through exercise array
3. Handles answer → determines rating → submits review via `useMemoryReviewCreate()`
4. Shows brief feedback phase, then advances
5. Transitions to "results" when all done
6. Exposes: phase, currentExercise, progress (0-100), submitAnswer, advanceToNext, exitSession

### Components

**`flashcard-exercise.tsx`**: Shows front text large, tap to reveal back, then 4 rating buttons (Again/Hard/Good/Easy) with color coding.

**`mcq-exercise.tsx`**: English prompt at top, 4 vertical choice buttons. Tap highlights correct (green) or incorrect (red + show correct). Auto-advances after brief delay.

**`session-progress-bar.tsx`**: Thin linear bar at top, animated width transition.

**`exercise-feedback.tsx`**: Green checkmark or red X overlay with correct answer text, auto-dismiss or tap to continue.

**`session-results.tsx`**: Score circle (reuse `ProgressRing` composite from `components/composites/progress-ring.tsx`), correct/incorrect/total counts, "Practice Again" and "Done" buttons.

**`session-empty.tsx`**: Uses `EmptyState` composite — "Nothing to review. Check back later or add new packs."

### Updated `practice/page.tsx`

- Flashcards card → `router.push("/practice/session?mode=flashcard")`
- Quiz card → `router.push("/practice/session?mode=mcq_recognition")`
- Fill in Blanks + Mock Exam → greyed out with "Coming soon" badge

---

## Implementation Order

1. **Backend scaffold** — `apps/exercise_engine/` app, constants, register in INSTALLED_APPS
2. **Backend services** — exercise generation logic + item enrichment
3. **Backend serializers + view + URL** — API endpoint
4. **Backend tests** — services + views
5. **Schema + Orval** — `make schema && make generate-api`
6. **Frontend types + hook** — types.ts, use-practice-session.ts
7. **Frontend components** — flashcard, MCQ, feedback, progress bar, results, empty
8. **Frontend session page** — composition page wiring everything
9. **Update practice landing** — wire navigation to mode cards
10. **Frontend tests** — component + hook tests
11. **Manual testing** — full session flow in browser

---

## Verification

1. `uv run pytest` — all tests pass (existing + new exercise engine tests)
2. `uv run ruff check .` — lint clean
3. `make schema` — no errors
4. `make generate-api` — new exercise hooks generated
5. Browser: Practice tab → tap Flashcards → session loads → flip cards → rate → results
6. Browser: Practice tab → tap Quiz → MCQ session → pick answers → score shown
7. Browser: After completing a session, items should be scheduled for future review (verify via admin MemoryState)
8. Browser: Return to Practice → start another session → due items appear alongside new items
