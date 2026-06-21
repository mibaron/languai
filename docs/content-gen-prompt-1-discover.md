You are a German language curriculum designer. Your task is to research and produce a comprehensive, ordered list of all topics that belong in an A1.1 German course (the first half of A1, targeting absolute beginners).

Base your research on established curricula: Goethe-Zertifikat A1, telc Deutsch A1, Menschen A1, Netzwerk A1, Studio [21] A1. Cross-reference multiple sources to ensure completeness.

## What I need

For each topic, provide:

1. **Topic title** (in English, descriptive) — e.g., "Personal Pronouns — Nominative Case"
2. **Short description** — 1-2 sentences on what the learner will understand after studying this topic
3. **Category** — one of: `grammar`, `vocab`, `verb`, `phrase`
4. **Lexical items** — the specific words, phrases, rules, or verb forms this topic covers. For each item, specify:
   - `text`: the German word/phrase/rule
   - `translation`: English equivalent
   - `type`: one of `vocab`, `verb`, `phrase`, `grammar_rule`
   - For **nouns**: include `gender` (m/f/n) and `plural` form
   - For **verbs**: include `auxiliary_verb` (haben/sein), `separable_prefix` (if any), `conjugation_group` (regular/irregular/mixed)
   - For **phrases**: include `formality_level` (formal/neutral/informal/colloquial) and `context` (e.g., "at the bakery", "meeting someone")
   - For **grammar rules**: include a `pattern` (e.g., "Subject + verb + rest", "kein + noun")
5. **Suggested order** — number indicating where this topic falls in the learning sequence (topics should build on each other logically)

## Scope

A1.1 typically covers:
- Basic greetings, introductions, farewells
- The alphabet, numbers, telling time
- Personal pronouns (nominative)
- Formal vs. informal address (Sie vs. du)
- Core verbs: sein, haben, regular verbs (present tense)
- Stem-changing/irregular verbs (present tense)
- Articles (definite/indefinite) in nominative and accusative
- Negation (nicht/kein)
- Noun genders and basic plural patterns
- Separable verbs
- Basic sentence structure (SVO, yes/no questions, W-questions)
- Everyday vocabulary: family, food, colors, days/months, classroom items, body parts, housing
- Common phrases: ordering food, asking for directions, shopping, at the doctor

This is a guide — include anything standard A1.1 curricula cover that I may have missed, and exclude anything that belongs in A1.2 or higher.

## Output format

Return a JSON array. Example structure for one topic:

```json
{
  "order": 1,
  "title": "Greetings & Farewells",
  "description": "Learn to greet people, say goodbye, and use time-appropriate greetings in formal and informal contexts.",
  "category": "phrase",
  "lexical_items": [
    {
      "text": "Guten Morgen",
      "translation": "Good morning",
      "type": "phrase",
      "formality_level": "neutral",
      "context": "morning greeting"
    },
    {
      "text": "Hallo",
      "translation": "Hello",
      "type": "phrase",
      "formality_level": "informal",
      "context": "casual greeting"
    }
  ]
}
```

Be thorough. I expect 25-40 topics for a complete A1.1 course. Every lexical item that a student should learn in A1.1 must appear in exactly one topic.
