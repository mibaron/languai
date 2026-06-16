# Prototype Prompt: LinguAI V2 — Mobile Shell + Onboarding

## What this app is

LinguAI is a German language learning web app (PWA). Users subscribe to "content packs" (e.g., "German A1.1 in English", "German A1.1 in Persian") and learn through grammar tables, vocabulary flashcards, quizzes, fill-in-the-blank exercises, and more important: the user can expand these content with personalized AI generated content fit to the app and their learning path!.

The current version is a desktop-first reference tool — a top navbar, level switcher, category tabs (grammar/vocab/verbs/phrases), and section cards. It works but it's not mobile-friendly and has no onboarding. We're redesigning it as a mobile-first PWA that users save to their phone's homescreen.

I'm attaching screenshots of the current app for reference. The new design should feel like a natural evolution, not a completely different product.

## Design constraints

- **Component library: ShadCN/UI (Tailwind CSS)**. Use only standard ShadCN components — buttons, cards, tabs, badges, sheets, drawers, inputs, avatars, dialogs, accordions. No custom illustrations, no complex animations, no components that don't exist in ShadCN.
- **Mobile-first**: Design for 375×812 (iPhone viewport). Every screen must work at this size. Desktop is secondary and can be addressed later.
- **Minimal and clean**: Lots of whitespace, clear typography hierarchy, no decorative elements. Think Notion or Linear's mobile apps — functional, not playful. We're not Duolingo — no mascots, no gamification chrome.
- **Icon library: Lucide** (the default for ShadCN). Use Lucide icon names when specifying icons.
- **Colors**: Use ShadCN's default neutral palette with a single primary accent color. No gradients, no multi-color schemes.

## What to prototype

### Screen 1: Welcome / Language Setup
First screen a new user sees (can appear before or after signup — the design is the same either way).

- Heading: "Welcome to LinguAI" with a short subtitle
- Step 1: "What language do you speak?" — selectable chips/buttons for: English, Persian, Turkish, Arabic (expandable later). Allow selecting 1-3 languages, with one marked as primary
- A clear "Continue" button at the bottom

### Screen 2: Target Language
- "What do you want to learn?" — For now only German is available, shown as a selected card. But design it so more languages can be added later (Spanish, French, etc.)
- Show that German is selected with a subtle checkmark or highlight
- "Continue" button

### Screen 3: Pick Your First Pack
- "Choose a content pack to start" — subtitle explaining what packs are ("Curated sets of grammar, vocabulary, and exercises")
- Scrollable list of pack cards. Each card shows:
  - Pack name (e.g., "German A1.1")
  - Base language label (e.g., "Explanations in English")
  - Brief description (e.g., "Personal pronouns, regular verbs, basic sentence structure...")
  - Content count badges (e.g., "24 grammar · 180 vocab · 12 exercises")
  - A "Subscribe" or "Add" button
- User can select 1 or more packs
- "Start Learning" button at bottom

### Screen 4: App Shell — Learn Tab (main screen after onboarding)
This is the core of the prototype. After onboarding, the user lands here.

- **Top area**: Compact header with app logo ("LinguAI"), a small avatar/profile icon on the right. No hamburger menu — navigation is via bottom tabs.
- **Active pack selector**: If the user has multiple packs, show the current one with a dropdown/switcher to change. If only one pack, just show the pack name as a heading.
- **Content sections**: The pack's content organized by category. Use horizontal scrollable tabs or toggle group at the top: Grammar, Vocabulary, Verbs, Phrases. Below that, a vertical list of section cards (similar to the current app's section cards but optimized for mobile — full width, clear tap targets).
- Each section card shows: title, type badge (table/notes/grid), and a progress indicator if applicable.
- **Bottom tab bar**: 4 tabs with Lucide icons:
  1. **Learn** (BookOpen icon) — the current screen. Browse and study pack content.
  2. **Practice** (PenLine or Dumbbell icon) — quizzes, flashcards, exercises. Can show a placeholder for now.
  3. **Explore** (Compass icon) — discover and subscribe to new packs. Can show a placeholder.
  4. **Profile** (User icon) — settings, language preferences, pack management, saved items, credit balance. Can show a placeholder.

### Screen 5: Practice Tab (placeholder but designed)
- Header: "Practice"
- Cards for different practice modes:
  - "Flashcards" — with a brief description and the number of cards available
  - "Fill in the Blanks" — sentence completion exercises
  - "Quiz" — multiple choice questions
  - "Mock Exam" — timed exam simulation
- Each card is tappable, shows which pack it draws from
- If no packs subscribed, show an empty state pointing to Explore

### Screen 6: Explore Tab
- Search bar at top
- "Featured Packs" section with horizontally scrollable pack cards
- "All Packs" section with a vertical list, filterable by language pair
- Each pack card same design as onboarding Screen 3, but with a "Subscribed" badge if already added

### Screen 7: Profile Tab
- User avatar and name at top
- "My Languages" — shows known/target languages with an edit button
- "My Packs" — list of subscribed packs with status (Active, Completed, Archived) and management options
- "Saved Items" — count of saved AI-generated content
- "AI Credits" — current balance and usage
- "Settings" — link to preferences
- "Sign Out" button at bottom

## Navigation and interaction notes

- Bottom tab bar is always visible (fixed at bottom), highlights the active tab
- Tapping a section card on the Learn tab opens the section content (grammar table, vocab list, etc.) — you can show this as a full-screen page that slides in from the right, with a back arrow in the top-left
- The onboarding wizard should feel like a sequence of full-screen steps with a progress indicator (dots or a progress bar at the top)
- Transitions between onboarding steps: simple left-to-right slide
- All tap targets must be at least 44×44px (mobile accessibility)
- Use ShadCN's Sheet (bottom drawer) for contextual actions (e.g., pack options: archive, mark complete, unsubscribe)

## What NOT to include

- No desktop layout — mobile only for this prototype
- No AI modal or AI interaction screens (those come later)
- No actual content (grammar tables, vocab lists) inside sections — just the navigation shell
- No authentication screens (login/register already exist)
- No dark mode toggle (support it via ShadCN's built-in theming, but don't prototype both)
