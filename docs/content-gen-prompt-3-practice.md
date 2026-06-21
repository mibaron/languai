You are creating practice exercises for a German A1.1 learning app. These exercises test the learner's recall and understanding AFTER they have studied the teaching content. They should be challenging enough to require thinking, but not beyond A1.1 level.

## Available exercise types

### 1. Flashcard
Front/back card for memorization. Can optionally include context sentences.

```json
{
  "exercise_type": "flashcard",
  "item_text": "der Tisch",
  "front_text": "der Tisch",
  "back_text": "the table",
  "front_context": "Der Tisch ist gross.",
  "back_context": "The table is big."
}
```

### 2. Multiple Choice (MCQ)
A question with 4 options, one correct. Include an explanation for why the correct answer is right.

```json
{
  "exercise_type": "mcq",
  "item_text": "haben",
  "question": "Complete: Wir ___ zwei Kinder.",
  "choices": [
    { "text": "haben", "is_correct": true },
    { "text": "habt", "is_correct": false },
    { "text": "hat", "is_correct": false },
    { "text": "habe", "is_correct": false }
  ],
  "explanation": "'Wir' (we) takes the conjugation 'haben'. 'Habt' is for 'ihr', 'hat' is for 'er/sie/es', and 'habe' is for 'ich'."
}
```

### 3. Fill in the Blank
A sentence with a gap. The learner types the answer. Can include alternative accepted answers and a hint.

```json
{
  "exercise_type": "fill_blank",
  "item_text": "kein",
  "text_before": "Ich habe",
  "text_after": "Auto.",
  "answer": "kein",
  "accept_alternatives": [],
  "hint": "negation for 'ein'",
  "explanation": "'Kein' negates nouns with indefinite articles. 'Auto' is neuter (das Auto), so the accusative form is 'kein Auto'."
}
```

### 4. Sentence Order
Words are given in jumbled order. The learner must arrange them into a correct sentence. Can have multiple valid orderings.

```json
{
  "exercise_type": "sentence_order",
  "item_text": "sentence structure",
  "jumbled_words": ["gehe", "Ich", "morgen", "ins", "Kino"],
  "correct_answers": [
    ["Ich", "gehe", "morgen", "ins", "Kino"],
    ["Morgen", "gehe", "ich", "ins", "Kino"]
  ],
  "hint": "The verb must be in position 2."
}
```

### 5. Error Correction
A sentence with one error. The learner must identify and fix it.

```json
{
  "exercise_type": "error_correction",
  "item_text": "article agreement",
  "sentence": "Ich sehe der Hund.",
  "error_start": 10,
  "error_end": 13,
  "correct_replacement": "den",
  "corrected_sentence": "Ich sehe den Hund.",
  "explanation": "'Sehen' requires the accusative case. 'Der Hund' (nominative) becomes 'den Hund' in the accusative."
}
```

### 6. Matching
Pairs of items to match (e.g., German to English, question to answer, pronoun to verb form).

```json
{
  "exercise_type": "matching",
  "item_text": "personal pronouns",
  "instruction": "Match each pronoun with its English translation",
  "pairs": [
    { "left": "ich", "right": "I" },
    { "left": "du", "right": "you (informal)" },
    { "left": "er", "right": "he" },
    { "left": "wir", "right": "we" }
  ]
}
```

## Your task

Below is a topic and its teaching content. Create a comprehensive set of practice exercises for this topic.

**Guidelines:**
- Create exercises for ALL lexical items in the topic — every word, phrase, verb, or rule should be tested
- Use a MIX of all 6 exercise types — don't rely on just flashcards and MCQ
- Each lexical item should have at least 2-3 exercises of different types
- Exercises should progress from recognition (flashcard, matching) to recall (fill_blank, MCQ) to production (sentence_order, error_correction)
- All German must be grammatically correct
- MCQ distractors must be plausible A1.1-level mistakes (wrong conjugation, wrong article, wrong case) — not random words
- Error correction errors should be mistakes a real A1.1 learner would make
- Sentence order sentences should be simple (5-8 words) and use only A1.1 vocabulary
- Fill-blank `accept_alternatives` should include common valid alternatives (e.g., contractions, regional variants)
- `item_text` must reference the specific lexical item being tested (this links the exercise to the knowledge graph)
- For grammar topics: test the RULE, not just individual words. Create exercises that require applying the rule
- For vocabulary topics: test in context (sentences), not just isolated word translation
- Aim for 15-25 exercises per topic

## Topic and content

[PASTE THE TOPIC JSON (from Phase 1) AND THE PAGE CONTENT JSON (from Phase 2) HERE]

## Output format

Return a JSON object:

```json
{
  "topic_title": "Topic title",
  "exercises": [
    { "exercise_type": "flashcard", "item_text": "...", "..." : "..." },
    { "exercise_type": "mcq", "item_text": "...", "..." : "..." }
  ]
}
```
