# Content Generation Prompts

3 prompts for an external AI (ChatGPT, etc.) to generate A1.1 content packs.

## How to use

1. Copy-paste **Prompt 1** into ChatGPT. Review the topic list it returns. Edit if needed.
2. For each topic from the list, copy-paste **Prompt 2** and attach that topic's JSON at the bottom where indicated. Review the teaching content.
3. For each topic, copy-paste **Prompt 3** and attach both the topic JSON and the teaching content JSON where indicated. Review the exercises.

Each prompt is fully self-contained — the AI doesn't need any other context.

## Things to watch for when reviewing AI output

- Noun genders — the #1 source of AI errors in German content
- Verb conjugations, especially irregular verbs (sein, haben, werden, wissen)
- Formal/informal register consistency within conversations
- Fill-blank answers should be unambiguous (one correct answer, or explicit alternatives)
- `error_start`/`error_end` character positions in error correction exercises

## The prompts

- [Prompt 1 — Discover Topics](content-gen-prompt-1-discover.md)
- [Prompt 2 — Teaching Content](content-gen-prompt-2-teach.md)
- [Prompt 3 — Practice Exercises](content-gen-prompt-3-practice.md)
