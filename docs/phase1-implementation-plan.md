# Phase 1 Implementation Plan: Knowledge Graph + Memory Engine

> Approved 2026-06-19. Detailed implementation steps for the foundation of the learning engine.
> See `learning-engine-architecture.md` for architecture decisions and rationale.

## Track A: Knowledge Graph (`apps/knowledge/`)

### A1. App scaffold + constants
- `constants.py`: TextChoices for LexicalItemType, PartOfSpeech, RelationshipType, Gender, AuxiliaryVerb, FormalityLevel, ReferenceSheetType

### A2. Models
All use UUID pk + TimeStampedModel base.

1. `LearningGoal` — name, slug, description, icon, order
2. `LexicalItem` — type, text, translation, level FK, part_of_speech, audio_url, frequency_rank, tags (JSON), metadata (JSON), is_active. Unique(text, type, level)
3. `NounDetail` — OneToOne→LexicalItem: gender, plural
4. `VerbDetail` — OneToOne→LexicalItem: separable_prefix, auxiliary_verb, conjugation_group
5. `PhraseDetail` — OneToOne→LexicalItem: formality_level, context
6. `GrammarRuleDetail` — OneToOne→LexicalItem: description, pattern
7. `ItemRelationship` — from_item FK, to_item FK, relationship_type. Unique(all three)
8. `ExampleSentence` — item FK, text, translation, audio_url, order
9. `ReferenceSheet` — title, sheet_type, level FK, headers (JSON), rows (JSON), note, order, is_active
10. `ModelClass` — name (unique), description. M2M→LLMModel

### A3. Pack model extensions (`apps/packs/models.py`)
- `PackItem` through table: pack FK, item FK→LexicalItem, order
- `PackReferenceSheet` through table: pack FK, sheet FK→ReferenceSheet, order
- Pack gains: items M2M, reference_sheets M2M, goals M2M→LearningGoal

### A4. User model extension
- `learning_goal` FK→LearningGoal (nullable, SET_NULL)

### A5. Register + migrations
- Add `apps.knowledge` to INSTALLED_APPS
- Seed migration: 3 goals (exam, living, working)

### A6. Admin
- LexicalItemAdmin with detail inlines + ExampleSentence inline
- ItemRelationshipAdmin, ReferenceSheetAdmin, LearningGoalAdmin, ModelClassAdmin
- Extend PackAdmin with PackItem/PackReferenceSheet inlines + goals

### A7. Minimal API
- `GET /api/v1/goals/` — list goals (AllowAny, no pagination)
- Extend onboarding to accept `learning_goal` UUID

### A8. Tests
- Factories for all models
- Model constraint tests, __str__ tests
- Pack M2M tests
- Goals API + onboarding API tests

### A9. Frontend — Goal step in onboarding
- New `step-goals.tsx` component
- Update `use-onboarding.ts`: TOTAL_STEPS=4, add goal state
- Update `page.tsx`: add StepGoals, pass learning_goal to API

### A10. AI Content refactor (stretch — defer to Phase 2)
- ModelClass FK + user_prompted fields on AIContent

---

## Track B: Memory Engine (`apps/memory_engine/`)

### B1. Pure FSRS (`fsrs.py`)
Zero Django deps. Dataclasses + math only.
- Rating enum, FSRSCard, FSRSParams (19 weights), FSRSOutput
- `repeat(card, rating, now, params)` → FSRSOutput
- `retrievability(card, now)` → float

### B2. Constants
- SkillType: recognition, production, listening, spelling
- DEFAULT_REQUEST_RETENTION = 0.9, SESSION_SIZE = 20, NEW_CARDS = 5

### B3. Models
1. `MemoryState` — user FK, item FK→LexicalItem, skill_type, difficulty, stability, reps, lapses, state, last_review, next_due. Unique(user, item, skill_type)
2. `ReviewLog` — memory_state FK, rating, response_time_ms, scheduled/actual_days, difficulty/stability before/after. Append-only.

### B4. Services
- `record_review(*, user, item_id, skill_type, rating, response_time_ms)` → MemoryState
- `get_due_items(*, user, pack_ids)` → QuerySet[MemoryState]

### B5. Session builder
- `build_session(*, user, pack_ids, config)` → list[dict]
- Due items first (most overdue), then new items (up to max_new), capped at max_items

### B6. API endpoints
- `GET /api/v1/memory/session/` — build and return practice session
- `POST /api/v1/memory/review/` — submit review result

### B7. Admin
- MemoryStateAdmin, ReviewLogAdmin — all readonly

### B8. Register + migrations
- Add `apps.memory_engine` to INSTALLED_APPS
- Depends on knowledge app existing first

### B9. Tests
- `test_fsrs.py`: pure unit tests (no DB) — stability, difficulty, retrievability, intervals
- `test_services.py`: record_review, get_due_items
- `test_session.py`: ordering, limits, empty case
- API tests: auth, response shape, validation

---

## Implementation Order

1. A1-A2: Knowledge scaffold + models
2. A3-A4: Pack extensions + User learning_goal
3. A5: Register knowledge + migrate
4. B1-B3: Memory Engine scaffold + fsrs.py + models
5. B8: Register memory_engine + migrate
6. A6 + B7: Admin for both
7. B4-B5: Services + session builder
8. A7 + B6: API endpoints for both
9. A8 + B9: Tests for both
10. A9: Frontend onboarding goal step

## Verification

1. `make makemigrations` — no pending migrations
2. `make migrate` — clean
3. `make backend-test` — all pass
4. `make backend-lint && make backend-typecheck` — clean
5. Django admin: create LexicalItem with NounDetail, Pack with items/goals
6. API: `GET /api/v1/goals/` returns seeded goals
7. API: memory session/review endpoints work
8. `make generate-api` + frontend onboarding with goal step
