# Science-Based Flashcard System for a Language Learning App

The best flashcard system for a language app should **not** be “a copy of Anki” or “a Leitner box in software.” It should be a **personalized retrieval-practice system**: every card is a small test, every answer updates a memory model, and the app schedules the next review when the learner is close to forgetting but still likely to succeed.

## 1. What the Science Says

Human memory for vocabulary is not strengthened best by rereading. It is strengthened by **successful effortful retrieval**: the learner tries to remember the word before seeing the answer.

Roediger & Karpicke’s highly cited work on the **testing effect** showed that testing improves long-term retention. Dunlosky et al.’s review rated **practice testing** and **distributed practice** among the most effective learning techniques.

The second pillar is **spacing**. Cepeda et al.’s meta-analysis reviewed hundreds of experiments and found that the best spacing depends on the final retention interval: the longer you want memory to last, the longer the optimal gaps become.

So the core mechanism is:

> **Encode → wait → retrieve with effort → get feedback → wait longer → retrieve again.**

This is why good flashcards feel slightly difficult. The review should not be so soon that it is effortless, and not so late that the learner fails too often.

For language vocabulary specifically, flashcards are useful but incomplete. Flashcards cover focus and repetition well, but a language app must also add context, examples, usage, production, and listening practice.

## 2. Important Discovery for Language Learning

For a language app, one vocabulary item should not be treated as a single card.

Knowing a word can include:

- recognizing its meaning,
- producing it from memory,
- hearing it correctly,
- spelling it,
- using it in a sentence,
- knowing its gender, plural, conjugation, or grammar behavior,
- recognizing it in fast speech,
- using it naturally in conversation.

For example, “Haus → house” is a different memory from “house → Haus,” hearing **Haus**, spelling **Haus**, knowing **das Haus**, and using it in a sentence.

That means your app should model each word as a **bundle of micro-skills**.

| Skill | Card Type | Example |
|---|---|---|
| Meaning recognition | L2 → meaning | “der Tisch” → “table” |
| Production | meaning → L2 | “table” → “der Tisch” |
| Listening | audio → meaning/text | hear word → choose/type |
| Spelling | meaning/audio → typed form | “table” → type “Tisch” |
| Grammar | cloze | “Ich lege das Buch auf ___ Tisch.” |
| Collocation | phrase chunk | “make a decision” not “do a decision” |
| Speaking | prompt → spoken response | “Say: I need a table.” |

A strong app should not just ask:

> “Do you remember this word?”

It should ask:

> “Which dimension of this word is stable?”

## 3. Existing Flashcard Systems Compared

| System | How It Works | Strength | Weakness |
|---|---|---|---|
| **Leitner box** | Cards move between boxes; correct answers move forward, wrong answers go back. | Simple, transparent, good for paper cards. | Too coarse; does not estimate memory probability; poor personalization. |
| **Pimsleur-style graduated intervals** | Reviews start after seconds/minutes, then hours/days/months. | Good for audio prompts and early phrase memorization. | Fixed schedule; not adaptive enough per learner/item. |
| **SuperMemo SM-2** | Uses a 0–5 quality grade, an easiness factor, and intervals like 1 day, 6 days, then interval × easiness. | Historically important; easy to implement. | Heuristic; limited personalization; old model. |
| **Anki legacy scheduler** | Modified SM-2 style with user ratings and deck settings. | Proven by huge user base; flexible. | Users can misuse ratings; not language-specific. |
| **Anki FSRS** | Uses a memory model with difficulty, stability, and retrievability; schedules to hit desired retention. | Much better foundation for adaptive scheduling. | Still generic unless adapted for language learning. |
| **Duolingo HLR** | Half-life regression predicts when a learner will forget a word/concept using real learner data. | Language-specific, trainable, uses item/user features. | Requires significant user data. |
| **Modern optimization models** | Use machine learning, knowledge tracing, or optimal control to predict recall and optimize review cost. | Best long-term direction for a custom app. | Requires lots of review data and careful evaluation. |

Recommendation:

> Start with an **FSRS-like model**, then evolve toward a **Duolingo HLR / knowledge-tracing model** once your app has enough user data.

## 4. The Best Design for a Custom Language App

### A. Separate “Learning” from “Memorizing”

Before the first flashcard, the learner should understand the item.

A new word should first appear with:

- meaning,
- audio,
- example sentence,
- image or context,
- morphology or grammar if needed.

Only then should it enter retrieval practice.

Bad card:

> “aufheben = ?”

Better card:

> Sentence: “Kannst du das Papier vom Boden aufheben?”  
> Prompt: “What does **aufheben** mean here?”  
> Answer: “to pick up.”

Later, a production card:

> Prompt: “Say: Can you pick up the paper from the floor?”  
> Expected answer: “Kannst du das Papier vom Boden aufheben?”

### B. Use Active Recall, Not Passive Flipping

The default interaction should force a real attempt:

1. Show prompt.
2. User types, speaks, chooses, or mentally recalls.
3. Reveal answer.
4. App scores correctness.
5. User optionally grades effort.

For language learning, do **not** rely only on self-rating.

Use multiple signals:

- correctness,
- response time,
- hint usage,
- number of attempts,
- typed-answer distance,
- speech-recognition confidence,
- user difficulty rating.

The user’s “I knew it” is useful, but it should not be the only signal.

### C. Schedule by Predicted Recall Probability

The scheduler should estimate:

> “What is the probability this user can recall this item right now?”

Then schedule the next review when predicted recall drops to your target, for example **85–90%**.

Suggested default retention levels:

| Goal | Desired Retention |
|---|---|
| Casual learning | 85% |
| General default | 90% |
| Exam mode | 92–95% |
| Tiny critical deck | up to 97% |
| Avoid for normal use | above 97% |

Higher retention means shorter intervals and many more reviews. A retention target that is too high can overwhelm users.

### D. Model Memory Per Skill, Not Per Word

Instead of:

```text
user_id + word_id → due_date
```

Use:

```text
user_id + lexical_item_id + skill_type → memory_state
```

Example:

```text
Haus / recognition: strong
Haus / production: weak
Haus / listening: medium
Haus / article+gender: weak
Haus / plural: unknown
```

This avoids the classic failure of vocabulary apps: the learner can recognize many words but cannot use them.

### E. Move from Recognition to Production

For beginners, recognition is less frustrating and builds initial familiarity.

But if the goal is speaking and writing, the app must gradually shift toward production.

A good progression:

1. **Recognition:** choose meaning.
2. **Cued recall:** see sentence, type missing word.
3. **Production:** translate meaning to target language.
4. **Flexible production:** answer a communicative prompt.
5. **Conversation transfer:** use it in a mini dialogue.

### F. Use Context, But Keep the Card Atomic

A flashcard should test one thing, but not be context-free.

The best compromise:

- one target answer,
- one clear prompt,
- one short example sentence,
- audio,
- optional grammar note,
- no overloaded explanations on the card face.

Bad:

> Explain all meanings of “get,” with examples.

Good:

> In “I got home late,” what does **got** mean?

Another card:

> In “I got a message,” what does **got** mean?

Another card:

> Say: “I got home late.”

### G. Handle Interference Intentionally

Language learners confuse similar words:

- **bringen / nehmen**
- **ser / estar**
- **affect / effect**
- false friends,
- similar sounds,
- similar spellings,
- similar grammatical patterns.

Your scheduler should detect **confusable clusters**.

Early on, avoid teaching very similar items in the same session.

Later, once each item is partly stable, create contrast cards:

> Choose: “I brought the book” → *gebracht* or *genommen*?

This uses discrimination and interleaving without overwhelming the learner too early.

### H. Use “Leeches” as Diagnosis, Not Punishment

If a learner repeatedly fails a card, do not simply show it more often forever.

When an item fails many times, the app should diagnose the problem:

- Is the card ambiguous?
- Is the word too abstract?
- Is pronunciation confusing?
- Is it a false friend?
- Is the example sentence bad?
- Does the learner lack a prerequisite grammar concept?
- Is the item too low-frequency to matter now?

Then repair the card:

- add image,
- add mnemonic,
- add contrast,
- split into smaller cards,
- delay until prerequisite is learned,
- lower priority.

## 5. Proposed Algorithm

For an MVP, do not invent everything from zero. Implement an **FSRS-like scheduler** and wrap it in language-specific pedagogy.

### Review Loop

```text
For each practice unit:
  estimate retrievability R_now
  if R_now <= target_retention:
      show review

After answer:
  score = correctness + latency + hint_penalty + user_effort
  update difficulty
  update stability
  compute next interval where predicted R falls to target_retention
```

### Memory State

```text
difficulty: how hard this item/skill is for this learner
stability: how long memory lasts after successful review
retrievability: probability of recall at current time
```

### Item Features to Store

```text
frequency
CEFR level
word length
part of speech
concreteness
cognate/false-friend status
morphological complexity
audio difficulty
orthographic difficulty
semantic confusability
user’s native language
known related words
```

Duolingo’s HLR is especially relevant because it uses language-learning data to predict the “half-life” of a word or concept in a learner’s memory, instead of treating all cards as generic facts.

## 6. Recommended Product Architecture

The strongest design is a **multi-layer adaptive memory system**.

### Layer 1: Item Introduction

Teach the item with context first:

```text
word/phrase
audio
meaning
example sentence
image or situation
grammar note if needed
```

### Layer 2: First Retrieval

Within the same session, require at least one successful retrieval.

### Layer 3: Spaced Review

Schedule by predicted recall probability, not fixed boxes.

### Layer 4: Skill Expansion

After recognition becomes stable, unlock:

- production,
- listening,
- spelling,
- grammar,
- sentence-use cards.

### Layer 5: Adaptive Repair

For failed cards, repair the learning object, not just the interval.

### Layer 6: Transfer to Real Language

Flashcards should feed into:

- mini-dialogues,
- sentence building,
- dictation,
- pronunciation,
- reading snippets,
- personalized examples.

This matters because flashcards are excellent for **lexical memory**, but language ability also needs flexible use.

## 7. Product Verdict

For a language app, the best system is:

> **Adaptive spaced retrieval + multi-skill vocabulary modeling + language-specific card design + automatic repair of weak items.**

Do **not** build a simple “word → translation” flashcard module and call it done.

Build a system where:

- every word has multiple learnable dimensions,
- every review produces useful data,
- the scheduler optimizes long-term recall under a realistic daily workload,
- the system gradually moves from recognition to real-world language production.

## 8. Concrete Recommendation

1. Use **FSRS-style scheduling** as the base.
2. Set default desired retention around **90%**.
3. Track separate memory states for recognition, production, listening, spelling, and grammar.
4. Require active recall before reveal.
5. Use typed and speech answers when possible, not only self-grades.
6. Introduce words with context before memorization.
7. Add contrast cards for confusable words.
8. Detect leeches and repair them.
9. Optimize not only “retention,” but **retention per minute** and **ability to use the word in context**.

That gives you something more powerful than Anki for language learning: not just spaced flashcards, but a **language-memory engine**.

## 9. Useful References

- Roediger, H. L. & Karpicke, J. D. (2006). *Test-enhanced learning: Taking memory tests improves long-term retention.*
- Dunlosky, J. et al. (2013). *Improving Students’ Learning With Effective Learning Techniques.*
- Cepeda, N. J. et al. (2006). *Distributed practice in verbal recall tasks: A review and quantitative synthesis.*
- Bjork, E. L. & Bjork, R. A. (2011). *Making Things Hard on Yourself, But in a Good Way: Creating Desirable Difficulties to Enhance Learning.*
- Nation, I. S. P. Principles of vocabulary learning and teaching.
- Nakata, T. Research on second-language vocabulary learning with flashcards and repeated retrieval.
- SuperMemo SM-2 algorithm documentation.
- Wozniak, P. *Twenty rules of formulating knowledge.*
- Duolingo Research: Settles & Meeder (2016). *A Trainable Spaced Repetition Model for Language Learning.*
- Anki documentation: FSRS scheduler and desired retention.
