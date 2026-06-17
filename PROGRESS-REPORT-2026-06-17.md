# Progress Report — 2026-06-17

## Session Summary

This session completed **Phase 4: Mobile App Shell** of the V2 redesign. The app now has a fully functional mobile-first shell with bottom tab navigation, all four tab views, drawers, overlays, and pack management.

### Desktop Strategy Decision

Decided on **mobile-only with centered `max-w-md` container** on desktop (option 1). Desktop users see a phone-sized app centered on screen — same pattern as Instagram web. Proper desktop layout deferred to a future version based on real user feedback.

---

## What Was Built

### Composites Layer (`components/composites/`)

The composites layer was bootstrapped from scratch — it didn't exist before this session.

| File | Purpose |
|------|---------|
| `bottom-tab-bar.tsx` | 4-tab nav (Learn, Explain, Practice, Profile) with active state from `usePathname()` |
| `bottom-drawer.tsx` | Reusable bottom sheet with backdrop dismiss, rounded top corners, drag handle |
| `empty-state.tsx` | Icon + title + description + optional badge (used by Explain, Archived Packs) |
| `progress-ring.tsx` | SVG circular progress indicator with percentage label |
| `types.ts` | All composite prop interfaces |
| 4 test files | 14 tests covering all composites |

### App Layout (`(app)/layout.tsx`)

- Wraps all authenticated pages in `h-screen` + `max-w-md` centered container
- Bottom tab bar pinned at bottom with safe-area padding
- Content area uses `min-h-0 flex-1` for proper flex overflow

### Learn Tab (`(app)/learn/`)

| File | Purpose |
|------|---------|
| `page.tsx` | Pure composition: pack header → category tabs → section list, plus drawers |
| `_hooks/use-learn-tab.ts` | Manages active pack, category, drawer state; fetches subscriptions via API; resolves sections from static `BOOKS` data by pack's `level_code` |
| `_components/pack-header.tsx` | Pack name pill (opens drawer) + progress ring (opens stats) |
| `_components/category-tabs.tsx` | Grammar / Vocabulary / Verbs / Phrases tab strip |
| `_components/section-card.tsx` | Section row: type icon (table/notes/grid), title, item count, chevron |
| `_components/section-list.tsx` | Scrollable list of section cards |
| `_components/pack-selector-drawer.tsx` | Bottom drawer to switch active pack, "Browse all" CTA, link to archived packs |
| `_components/pack-stats-drawer.tsx` | Bottom drawer: progress ring, per-category progress bars, grammar/vocab/exercise counts |
| `_components/types.ts` | All prop interfaces |
| 3 test files | 11 tests (category tabs, section card, pack header) |

### Explain Tab (`(app)/explain/`)

- Single `page.tsx` — EmptyState with Lightbulb icon and "Coming soon" badge

### Practice Tab (`(app)/practice/`)

- 4 mode cards: Flashcards (yellow), Fill in Blanks (blue), Quiz (green), Mock Exam (purple)
- Each card: icon, title, description, meta (count/duration), chevron
- Dark mode colors via Tailwind opacity modifiers

### Profile Tab (`(app)/profile/`)

| File | Purpose |
|------|---------|
| `page.tsx` | Pure composition using extracted components + hooks |
| `_hooks/use-profile.ts` | User data (`useAuthMeRetrieve`), subscriptions, subscribe/archive/unsubscribe mutations, explore toggle, sign out |
| `_components/profile-section.tsx` | Titled card group (Languages, My Packs, Account) |
| `_components/profile-row.tsx` | Row with icon, label, value, optional action slot |
| `_components/explore-packs-view.tsx` | Full-screen slide-in overlay: search bar, featured horizontal scroll (first 3 packs), all packs grid with subscribe/unsubscribe. Uses `usePacksList()` API |
| `_components/pack-action-sheet.tsx` | Bottom sheet on pack row: Mark as Complete, Archive Pack, Unsubscribe |
| `_components/types.ts` | All prop interfaces |
| 2 test files | 10 tests (action sheet, explore view) |

**Profile now shows real data:**
- User name, email, initial avatar from `GET /api/v1/auth/me/`
- Credit balance formatted as `€X.XX remaining`
- Subscribed packs from `GET /api/v1/packs/subscriptions/?status=active`

### Archived Packs (`(app)/archived-packs/`)

- EmptyState with Archive icon and "Coming soon" badge
- Back button via `router.back()`
- Linked from Pack Selector Drawer

---

---

### Auth & Profile Overhaul (Session 2)

**Backend (4 new endpoints):**
- `learning_language` field on User model + exposed `first_name`/`last_name` in serializer
- `POST /auth/change-password/` — validates old, sets new, rotates token
- `DELETE /auth/me/` — permanent account deletion
- `POST /auth/forgot-password/` — sends reset email (console backend dev, needs SMTP prod)
- `POST /auth/reset-password/` — validates token, sets new password

**Profile tab:**
- Shows real `first_name` + `last_name` (fallback: username), edit via pencil → `EditNameDrawer`
- Languages clickable → `LanguageDrawer` (13 languages, speaks/learning modes)
- Change Password → `ChangePasswordDrawer` (old + new + confirm, visibility toggle)
- Sign out now calls backend logout before clearing cookie
- Delete Account → `DeleteAccountDialog` (must type "delete" to confirm)

**Auth pages:**
- "Forgot password?" link on login form
- `/forgot-password` — email input → confirmation state
- `/reset-password` — uid/token from URL, new password form
- Both added to middleware public paths

**New files:** `edit-name-drawer.tsx`, `language-drawer.tsx`, `change-password-drawer.tsx`, `delete-account-dialog.tsx`, `forgot-password/page.tsx`, `reset-password/page.tsx`, `lib/languages.ts`, `api/v1/tests/test_auth.py`

---

## Test Results

- **171 frontend tests** (27 files) — 13 new this session
- **73 backend tests** — 12 new this session
- Build clean — 12 routes registered

## Routes

```
/                   — Landing page (public)
/login              — Login (public)
/register           — Register (public)
/onboarding         — Onboarding wizard (public)
/forgot-password    — Forgot password (public)
/reset-password     — Reset password (public)
/learn              — Learn tab (auth)
/explain            — Explain tab (auth)
/practice           — Practice tab (auth)
/profile            — Profile tab (auth)
/archived-packs     — Archived packs (auth)
```

---

## What's NOT Done Yet (Next Steps)

### Phase 4 Remaining

1. **Section Detail View** — blocked on design
2. **Visual QA** — browser testing across all views
3. **Progress tracking** — wire progress API to stats drawer / section cards
4. **Pack Selector "Browse all"** — needs navigation target

### Phase 5: Polish & PWA

- Slide transitions, PWA manifest, accent theming, font switching, desktop wrapper polish

### Backlog

- OTP email verification (needs backend)
- Mark as Complete for packs (needs backend endpoint)
- Archive/Unarchive flow (backend exists, frontend placeholder)
- SMTP email config for production (forgot/reset password)
