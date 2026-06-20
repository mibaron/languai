# Unified Content Architecture

> Initial brainstorm: 2026-06-19. Updated with final design decisions: 2026-06-20.
> This document captures the problem, design decisions, and data model for unifying the app's content systems around Pages, enabling the learn → explain → practice loop.

---

## The Problem: Two Worlds

The app has two independent content systems that don't talk to each other:

**World 1 — Static Frontend Data (Learn + Explain):**
- Content lives in `frontend/src/data/books.ts`, hardcoded from `german-cheatsheet.jsx`
- Items identified by SHA-256 fingerprints — no database IDs
- AIContent uses fingerprints for caching — no Pack or LexicalItem relationship

**World 2 — Backend Knowledge Graph (Practice):**
- Content lives in DB: `LexicalItem`, detail models, organized into `Pack`s
- Items identified by UUID primary keys
- Exercise Engine generates exercises on-the-fly from LexicalItems
- Memory Engine (FSRS) tracks spaced repetition per `(user, item, skill_type)`

Any feature crossing these worlds (like "practice what you just explained") needs a bridge between fingerprints and UUIDs. That bridge would be a hack — the real fix is eliminating the static data.

---

## The Solution: Pages as the Learning Unit

Retire `books.ts`. Introduce **Pages** as the atomic learning unit. All content flows through the database.

### What Is a Page?

A Page teaches one concept (e.g., "Formal Sie vs. Informal Du"). It belongs to a Pack, contains sequential content parts (teaching notes, conversations, fill-in-the-blanks), and binds to LexicalItems that can be explained or practiced.

Inspired by Babbel's lesson format: interactive, conversational, with inline exercises that keep the learner engaged — not just static reference tables.

### Data Flow (Target)

```
Pack
 └── Page (ordered, the atomic study unit)
      ├── LexicalItems (M2M — the explainable/practicable targets)
      │    └── verb, phrase, grammar rule, vocabulary...
      ├── PageParts (sequential content blocks)
      │    ├── TeachingNote
      │    ├── Conversation → ConversationLines
      │    └── FillBlank
      └── Exercises (bound to item + pack, from 3 sources)
           ├── source: creator (pack author)
           ├── source: engine (auto-generated)
           └── source: ai (LLM-generated via explain→practice)

MemoryState (FSRS) ←── tracks LexicalItem knowledge, not exercises
UserPageProgress ←── tracks which pages are studied
```

---

## Design Decisions (Resolved)

### Pages replace books.ts sections
Each section in books.ts (e.g., "Personal Pronouns — Nominativ") becomes a Page in the database. The Learn tab fetches pages from the API instead of importing static data.

### Pages bind to multiple LexicalItems
A Page about "Formal vs. Informal" binds to items like "Sie" (pronoun), "du" (pronoun), "Können Sie mir helfen?" (phrase). When the user taps Explain on a page, these items appear as clickable targets.

### Explain behavior on Pages
User taps Explain → instead of highlighting table rows, we render the page's bound LexicalItems as clickable chips/buttons overlaying the page. User taps one → AI generates explanation for that specific item.

### PackItem M2M is dropped
The old `Pack → LexicalItem` M2M (via PackItem) is redundant. A pack's items are derived from its pages: `LexicalItem.objects.filter(pages__page__pack=pack)`. One source of truth.

### Page parts use separate tables, not JSONField
Each part type (note, fill_blank, conversation) has its own database table with proper fields and constraints. No polymorphic JSON blobs. Adding a new type = new model + update serializer.

### Exercises use separate tables per type
Same pattern as page parts. Each exercise type (flashcard, MCQ, fill_blank, sentence_order, error_correction, matching) has its own detail table. The base `Exercise` model holds shared fields (item, pack, source, type).

### Three exercise sources, one model
Pack creators, the auto-generation engine, and AI all write to the same `Exercise` table. A `source` field tracks origin. Exercises belong to a pack — duplicates across packs are fine.

### Learning ≠ Practicing
Page study (reading notes, doing inline fill-blanks) does NOT update MemoryState/FSRS. Only formal practice sessions do. Pages are "first exposure" — learning. Practice is "retrieval" — testing recall. FSRS is designed for retrieval, not initial learning.

### Page progress is binary
`UserPageProgress(user, page, completed_at)`. User either studied the page or not. No sub-page tracking, no resume-within-page. User marks a page done by tapping Next/Done at the end.

### One skill_type per knowledge dimension
MemoryState tracks `(user, item, skill_type)`. Skill types map to knowledge dimensions (receptive_recall, productive_recall, application), not exercise types. All grammar exercises for the same rule feed the same "application" MemoryState.

### books.ts migration is deferred
We won't migrate books.ts content initially. We'll create dummy database records for testing. The existing content will be adapted to the new structure later (via AI-assisted prompting or a Content Creator Studio). The priority is getting the data model and application right.

---

## Data Model

### Pack & Pages

```python
# Pack model already exists — no changes except dropping PackItem M2M

class Page(TimeStampedModel):
    pack = FK(Pack, CASCADE, related_name="pages")
    title = CharField(max_length=255)           # "Formal Sie vs. Informal Du"
    description = TextField(blank=True)
    order = PositiveIntegerField()
    items = M2M(LexicalItem, through="PageLexicalItem", related_name="pages")

    class Meta:
        ordering = ["order"]
        unique_together = [("pack", "order")]


class PageLexicalItem(TimeStampedModel):
    page = FK(Page, CASCADE)
    item = FK(LexicalItem, CASCADE)
    order = PositiveIntegerField(default=0)     # display order for explain chips
    display_label = CharField(blank=True)       # override label, e.g. "zu + Dativ"

    class Meta:
        unique_together = [("page", "item")]
```

### Page Parts (separate table per type)

```python
class PagePart(TimeStampedModel):
    """Base: ordering + type discriminator."""
    page = FK(Page, CASCADE, related_name="parts")
    order = PositiveIntegerField()
    type = CharField(choices=["note", "fill_blank", "conversation"])

    class Meta:
        ordering = ["order"]
        unique_together = [("page", "order")]


class TeachingNotePart(TimeStampedModel):
    page_part = OneToOneField(PagePart, CASCADE, related_name="teaching_note")
    content = TextField()                       # markdown or plain text


class FillBlankPart(TimeStampedModel):
    """Interactive fill-in-the-blank within a page (teaching, not practice)."""
    page_part = OneToOneField(PagePart, CASCADE, related_name="fill_blank")
    text_before = CharField(max_length=500)     # "Können"
    text_after = CharField(max_length=500)      # "mir helfen?"
    answer = CharField(max_length=100)          # "Sie"
    hint = CharField(max_length=255, blank=True)
    item = FK(LexicalItem, SET_NULL, null=True) # optional link to tested item


class ConversationPart(TimeStampedModel):
    page_part = OneToOneField(PagePart, CASCADE, related_name="conversation")
    context = CharField(max_length=255, blank=True)  # "At a hotel reception"


class ConversationLine(TimeStampedModel):
    conversation = FK(ConversationPart, CASCADE, related_name="lines")
    order = PositiveIntegerField()
    speaker = CharField(max_length=100)
    text = CharField(max_length=500)
    translation = CharField(max_length=500, blank=True)
    is_blank = BooleanField(default=False)      # user fills this line
    blank_answer = CharField(max_length=200, blank=True)

    class Meta:
        ordering = ["order"]
        unique_together = [("conversation", "order")]
```

### Exercises (separate table per type)

```python
class Exercise(TimeStampedModel):
    """Base: what it tests, where it came from."""
    item = FK(LexicalItem, CASCADE, related_name="exercises")
    pack = FK(Pack, CASCADE, related_name="exercises")
    page = FK(Page, SET_NULL, null=True, blank=True)  # context (optional)
    exercise_type = CharField(choices=[
        "flashcard", "mcq", "fill_blank",
        "sentence_order", "error_correction", "matching"
    ])
    source = CharField(choices=["creator", "engine", "ai"])
    source_model = CharField(max_length=100, blank=True)  # LLM model if source=ai
    created_by = FK(User, SET_NULL, null=True, blank=True)

    class Meta:
        indexes = [("item", "exercise_type"), ("pack", "exercise_type")]


class FlashcardExercise(TimeStampedModel):
    exercise = OneToOneField(Exercise, CASCADE, related_name="flashcard")
    front_text = CharField(max_length=255)
    back_text = CharField(max_length=255)
    front_context = CharField(max_length=255, blank=True)
    back_context = CharField(max_length=255, blank=True)


class MCQExercise(TimeStampedModel):
    exercise = OneToOneField(Exercise, CASCADE, related_name="mcq")
    question = CharField(max_length=500)
    explanation = TextField(blank=True)


class MCQChoice(TimeStampedModel):
    mcq = FK(MCQExercise, CASCADE, related_name="choices")
    text = CharField(max_length=255)
    is_correct = BooleanField()
    order = PositiveIntegerField()

    class Meta:
        ordering = ["order"]
        unique_together = [("mcq", "order")]


class FillBlankExercise(TimeStampedModel):
    exercise = OneToOneField(Exercise, CASCADE, related_name="fill_blank")
    text_before = CharField(max_length=500)
    text_after = CharField(max_length=500)
    answer = CharField(max_length=100)
    accept_alternatives = JSONField(default=list)  # ["sie"] case variants
    hint = CharField(max_length=255, blank=True)
    explanation = TextField(blank=True)


class SentenceOrderExercise(TimeStampedModel):
    exercise = OneToOneField(Exercise, CASCADE, related_name="sentence_order")
    jumbled_words = JSONField()          # ["gehe", "ich", "zum", "Supermarkt"]
    correct_answers = JSONField()        # [["Ich","gehe","zum","Supermarkt"], [...alt...]]
    hint = CharField(max_length=255, blank=True)


class ErrorCorrectionExercise(TimeStampedModel):
    exercise = OneToOneField(Exercise, CASCADE, related_name="error_correction")
    sentence = CharField(max_length=500)          # "Ich sehe der Mann"
    error_start = PositiveIntegerField()          # char index of error start
    error_end = PositiveIntegerField()            # char index of error end
    correct_replacement = CharField(max_length=100)  # "den"
    corrected_sentence = CharField(max_length=500)   # "Ich sehe den Mann"
    explanation = TextField(blank=True)


class MatchingExercise(TimeStampedModel):
    exercise = OneToOneField(Exercise, CASCADE, related_name="matching")
    instruction = CharField(max_length=255, blank=True)


class MatchingPair(TimeStampedModel):
    matching = FK(MatchingExercise, CASCADE, related_name="pairs")
    left = CharField(max_length=255)
    right = CharField(max_length=255)
    order = PositiveIntegerField()

    class Meta:
        ordering = ["order"]
        unique_together = [("matching", "order")]
```

### Progress Tracking

```python
class UserPageProgress(TimeStampedModel):
    user = FK(User, CASCADE, related_name="page_progress")
    page = FK(Page, CASCADE, related_name="user_progress")
    completed_at = DateTimeField()

    class Meta:
        unique_together = [("user", "page")]

# MemoryState — unchanged, continues to track (user, item, skill_type)
# ReviewLog — unchanged, continues to log practice results
```

### AIContent Migration (eventual)

```python
# Current: AIContent.item_fingerprint (CharField, SHA-256)
# Target:  AIContent.item (FK to LexicalItem)
# Unique constraint: (item, action_type, model_used) instead of (fingerprint, action_type, model_used)
# Migration strategy: start fresh — existing cached content is minimal
```

---

## What This Does NOT Cover (Future)

- **Content Creator Studio** — rich frontend UI for pack creators to author pages and exercises. For now, content is created via Django admin or management commands.
- **books.ts content migration** — adapting existing static content to the new Page structure. Deferred; dummy data for initial development.
- **Transformation exercises** — "rewrite in past tense" needs LLM grading for free-text answers
- **Listening/speaking exercises** — needs audio infrastructure
- **Multi-blank fill exercises** — complex; revisit when single-blank proves limiting
- **User-generated content** — users creating their own items/packs from scratch
- **Collaborative/shared packs**
- **Import/export** (Anki decks, etc.)
- **AI prompt engineering** — structured prompts per item_type × exercise_type combination. Basic "match our schema" prompts first, enriched later.

---

## Rough Sequencing

Not a detailed plan — just ordering constraints. Technical planning happens separately.

1. **Backend models** — Page, PagePart types, Exercise types, UserPageProgress
2. **Backend API** — Pack pages endpoint, page detail, exercise CRUD
3. **Seed dummy data** — management command with sample pages and exercises for testing
4. **Frontend Learn tab** — fetch pages from API, render page parts, page navigation
5. **Migrate Explain system** — LexicalItem IDs instead of fingerprints
6. **Explain → Practice flow** — floating CTA, mode selection, AI exercise generation
7. **Exercise engine rewrite** — consume stored exercises, FSRS integration unchanged
8. **Page progress tracking** — UserPageProgress UI
