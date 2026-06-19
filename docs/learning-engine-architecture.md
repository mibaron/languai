# Learning Engine Architecture

> Brainstormed and decided on 2026-06-18. This document captures all architecture decisions for the learning engine — the core system that powers flashcards, exercises, and spaced repetition.

## Design Principle: Two-Level Thinking

Every design decision was evaluated at two levels:
- **Level 1 (Startup):** Well-designed, easy to develop further, pragmatic
- **Level 2 (Scale):** Better architecture, more users, more powerful

The chosen level per system is noted below.

---

## Three Systems

### 1. Knowledge Graph — Level 2 (Scale)

The foundation. Every learnable thing is a **LexicalItem** with rich metadata and typed relationships.

**Why Level 2:** The data model is the hardest thing to migrate later. Getting it right now saves pain.

**Data model pattern: Composition + JSON hybrid (Option D+C)**

Evaluated four patterns: big model with optionals (A), Django multi-table inheritance (B), single model + JSONField (C), base model + detail tables (D). Chose D+C hybrid for best balance of growability, data integrity, and Memory Engine isolation.

**Base model** — `LexicalItem`: shared fields for all learnable items (text, translation, level, type, audio, frequency, tags). Plus a `metadata` JSONField for flexible AI-enriched data that doesn't need DB-level querying or constraints (mnemonics, etymology, usage notes).

**Detail tables** — type-specific structured data with proper DB constraints:
- `NounDetail` — gender, plural (OneToOne → LexicalItem)
- `VerbDetail` — separable_prefix, auxiliary_verb, conjugation_group (OneToOne → LexicalItem)
- `PhraseDetail` — formality_level, context (OneToOne → LexicalItem)
- `GrammarRuleDetail` — rule_description, pattern (OneToOne → LexicalItem)
- Future types = new detail table only, zero changes to base or Memory Engine

**Why this works:**
- Memory Engine only touches LexicalItem base — fully standalone
- Exercise Engine joins the relevant detail table when building type-specific exercises
- AI-enriched data goes in `metadata` JSONField — no migration for new AI features
- Adding a new item type = one new detail table + one exercise generator. Nothing else changes
- Cost of being wrong on a detail table is low — migrate only that small table

**Other key models:**
- `ItemRelationship` — typed relations: synonym, antonym, confusable, compound-of, derivation
- `ExampleSentence` — proper table, linked to items (not JSON)
- `ReferenceSheet` — cheatsheet content: tables, grids, grammar overviews (passive/browse)
- `Pack` — curated collection containing both LexicalItems and ReferenceSheets
- `LearningGoal` — what the user is learning for (exam, living in society, work, etc.)

### 2. Memory Engine — Level 1 (Startup)

FSRS-based spaced repetition, running entirely server-side.

**Why Level 1:** Server-side is simpler, easier to debug, no offline sync complexity. Can evolve the algorithm without touching the client.

**Must be standalone.** Clean boundaries, no spaghetti with app logic:

```
apps/memory_engine/
├── fsrs.py          # Pure algorithm: no Django, no ORM, just math
├── models.py        # Django models (MemoryState, ReviewLog)
├── services.py      # Wraps fsrs.py, reads/writes Django models
├── session.py       # Session builder: items + states + time budget → ordered list
└── api/             # REST endpoints
```

Core `fsrs.py` has zero Django dependencies. Could be extracted as a standalone package.

**Key models:**
- `MemoryState` — per user x item x skill_type: difficulty, stability, retrievability, next_due
- `ReviewLog` — every answer recorded: correctness, response time, hints used

### 3. Exercise Engine — Level 2 (Scale)

Full exercise type system, but releasing types incrementally.

**Why Level 2:** The architecture supports many exercise types from day one. We ship 3-4 initially, add more over time.

**Exercise types (planned):**

| Type | Skill Tested | Priority |
|---|---|---|
| MCQ Recognition | recognition | MVP |
| Production Typing | production | MVP |
| Cloze Fill-blank | grammar + production | MVP |
| Listening MCQ | listening | Soon after |
| Sentence Building | syntax + production | Later |
| Matching Pairs | recognition | Later |
| Dictation | listening + spelling | Later |
| Translation | production + grammar | Later |

---

## AI Content System

### Combined Key for Caching

Most learning content is AI-generated (cheap model like Gemini Flash), personalized per user's learning path. Generated on-demand, cached for reuse.

**Cache key components:**
- `source_language` — language the user speaks
- `target_language` — language they're learning
- `level` — A1 through C2
- `goal` — exam, living in society, work, etc.
- `item_identifier` — which lexical item
- `content_type` — what was generated (synonym, usage, example, explanation, etc.)
- `model_class` — admin-defined grouping of LLM models (not individual model)

**Model class (not individual model):** Admin groups LLM models into classes (e.g., "fast-draft", "high-quality"). The class is part of the cache key. Individual model name is stored as metadata only. This way, upgrading a model within its class serves fresh content without stale cache.

**User-prompted content:** When a user customizes the prompt (types their own addition), the result is flagged as `user_prompted`. Never shared, never cached. The user's custom prompt text is stored alongside the result.

### Explain Tab Vision

Every piece of content is interactive:
- Long-press / right-click any item → AI contextual menu
- CTAs: explain more, generate examples, create flashcards, quiz me
- Save to collection, regenerate, delete
- Works on both LexicalItems and ReferenceSheet content

---

## Two Content Types in Packs

| Type | Purpose | Example | Interactive? |
|---|---|---|---|
| **Learning Items** | Active practice | "der Tisch = table" → exercises | Yes — flashcards, cloze, quiz |
| **Reference Sheets** | Passive overview | Verb conjugation table, case endings grid | Browse only (later: link cells to items) |

Both live in a Pack. Both rendered in the Explain tab. Later, reference sheet cells can link to LexicalItems for navigation (click "Akkusativ" in the table → jump to its learning page).

---

## Learning Goals

Goals define WHY the user is learning. They affect content generation and pack recommendations.

**Initial goals:**
- Official exam preparation (most important to support first)
- Living in society
- Working in society

**Expandable later:** study at university, travel, hobby, and more — up to ~30 options.

**Packs are tagged with goals** (array). A pack can serve multiple goals. Goal selection happens during onboarding.

---

## Content Creation

Not a focus for now. Content will be:
- AI-generated via prompting (Claude or similar, structured to fit our DB schema)
- Later: back-office tool for language teachers to create/curate packs

---

## Implementation Plan

### Phase 1: Foundation (two parallel tracks)

**Track A — Knowledge Graph:**
- Design and build all models (LexicalItem, ItemRelationship, ExampleSentence, ReferenceSheet, Pack refactor, LearningGoal)
- Refactor AIGeneratedContent with new combined key + model_class
- Add goal selection to onboarding

**Track B — Memory Engine:**
- Pure `fsrs.py` implementation
- MemoryState and ReviewLog models
- SessionBuilder service
- REST API: get session, post review result

Tracks A and B have no dependencies on each other.

### Phase 2: Exercise Engine + Practice UI

- Exercise generator service (picks distractors, builds cloze, etc.)
- Frontend exercise components (MCQ card, typing input, cloze)
- Session flow UI (progress bar, answer → feedback → next, results)
- Wires Knowledge Graph (what to learn) + Memory Engine (when to learn) together
- Ships in the Practice tab

### Phase 3: Polish + Expansion

- More exercise types (listening, sentence building, dictation)
- Skill progression (unlock production after recognition is stable)
- Leech detection + AI-generated mnemonics
- Session settings (daily goal, target retention)
- Progress visualization
- Reference sheet ↔ LexicalItem linking

---

## Legacy

`books.ts` and `german-cheatsheet.jsx` are old version artifacts. No obligation to keep, migrate from, or be constrained by them.

---

## Scientific Foundation

Based on research in `flashcard_language_learning_research.md`:
- **Testing effect** (Roediger & Karpicke): retrieval strengthens memory more than rereading
- **Spacing effect** (Cepeda et al.): longer gaps → longer retention
- **Multi-skill modeling**: a word is not one memory — it's recognition, production, listening, spelling, grammar
- **FSRS algorithm**: estimates retrievability, schedules review when recall drops to target (default 90%)
- **Desirable difficulty** (Bjork): reviews should feel slightly hard, not effortless
