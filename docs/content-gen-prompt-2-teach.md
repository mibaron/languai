You are creating teaching content for a German A1.1 learning app. The app teaches through interactive pages — each page covers one topic and contains sequential content blocks called "parts".

## Available part types

Each page is made of an ordered sequence of these part types:

### 1. TeachingNote
A text block that explains a concept. Can use markdown. Should be concise, clear, and beginner-friendly. Use bullet points, bold key words, and examples inline.

```json
{
  "type": "teaching_note",
  "content": "In German, every noun has a **gender**: masculine (**der**), feminine (**die**), or neuter (**das**). There's no reliable rule — you must learn the article with every noun.\n\n- **der** Tisch (the table) — masculine\n- **die** Lampe (the lamp) — feminine\n- **das** Buch (the book) — neuter"
}
```

### 2. Conversation
A realistic dialogue between 2+ speakers that demonstrates the topic in context. Each line has a speaker, the German text, and an English translation. Some lines can be "blanks" where the learner must fill in the correct word/phrase.

```json
{
  "type": "conversation",
  "context": "At a cafe, two colleagues meet for the first time",
  "lines": [
    {
      "speaker": "Anna",
      "text": "Hallo! Ich bin Anna. Wie heissen Sie?",
      "translation": "Hello! I'm Anna. What's your name?",
      "is_blank": false
    },
    {
      "speaker": "Herr Mueller",
      "text": "Guten Tag! Ich heisse Mueller.",
      "translation": "Good day! My name is Mueller.",
      "is_blank": false
    },
    {
      "speaker": "Anna",
      "text": "Freut mich, Herr Mueller! Woher ___ Sie?",
      "translation": "Nice to meet you, Mr. Mueller! Where are you from?",
      "is_blank": true,
      "blank_answer": "kommen"
    }
  ]
}
```

### 3. FillBlank (inline teaching exercise)
A quick inline exercise embedded in the teaching flow. The learner sees a sentence with a gap and must type the answer. This is for learning reinforcement, not formal practice.

```json
{
  "type": "fill_blank",
  "text_before": "Ich",
  "text_after": "Anna. (My name is Anna.)",
  "answer": "heisse",
  "hint": "verb: heissen (to be called)"
}
```

## Your task

Below is a topic from the A1.1 curriculum. Create a complete, engaging page for this topic.

**Guidelines:**
- Start with a TeachingNote that introduces the concept clearly
- Include at least 1 Conversation that shows the topic used naturally in a real-life scenario
- Sprinkle FillBlank exercises between teaching blocks to keep the learner active (at least 2-3 per page)
- End with a summary TeachingNote if the topic is complex
- All German text must be grammatically correct and natural — no textbook stiffness
- Translations must be accurate and natural English
- Target absolute beginners: no assumed prior German knowledge (unless the topic's order indicates earlier topics have been covered)
- Conversations should feel like real situations a learner might encounter in Germany: at a cafe, introducing yourself at work, shopping, asking for directions, etc.
- For grammar topics: show the rule, then immediately demonstrate it in a conversation, then let the learner practice with fill-blanks
- For vocabulary topics: group words thematically, use them in conversations, and include fill-blanks that test recall
- Aim for 8-15 parts per page (mix of all three types)

## Topic to create content for

[PASTE THE TOPIC JSON FROM PHASE 1 HERE]

## Output format

Return a JSON object:

```json
{
  "title": "Topic title from Phase 1",
  "description": "Short description from Phase 1",
  "parts": [
    { "order": 1, "type": "teaching_note", "content": "..." },
    { "order": 2, "type": "conversation", "context": "...", "lines": ["..."] },
    { "order": 3, "type": "fill_blank", "text_before": "...", "text_after": "...", "answer": "...", "hint": "..." }
  ]
}
```
