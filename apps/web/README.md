# IELTS Reading-First Build Status

This app is implemented as a Reading-first IELTS CBT engine with modular extension points.

## Implemented Phases

### 1) Foundation
- Domain types: `src/types/exam.ts`
- Supabase schema + RLS: `../supabase/migrations/0001_exam_engine.sql`
- Reading seed content: `../supabase/seed/reading_test_001.json`

### 2) Reading Content Pipeline
- Typed test fixture: `src/modules/reading/data/readingTest001.ts`
- Passage HTML/markdown support in schema and seed JSON.

### 3) Exam Engine
- Session store with autosave and local fallback:
  `src/modules/exam-engine/store/useExamSessionStore.ts`
- Timer + timeout utility:
  `src/lib/exam/autoSubmit.ts`
- Countdown integration hook:
  `src/modules/exam-engine/hooks/useAttemptCountdown.ts`
- Persistence client:
  `src/lib/exam/persistence.ts`

### 4) Reading UI
- Split pane layout with independent scroll:
  `src/modules/reading/components/ReadingPlayerLayout.tsx`
- Text selection highlight hook:
  `src/modules/reading/hooks/useTextHighlight.ts`
- Reusable exam UI:
  `src/components/exam/Timer.tsx`
  `src/components/exam/QuestionSidebar.tsx`
  `src/components/exam/QuestionNavigator.tsx`

### 5) API Contracts
- Create attempt endpoint:
  `src/app/api/exam/attempts/route.ts`
- Autosave progress endpoint:
  `src/app/api/exam/attempts/[attemptId]/progress/route.ts`
- Submission endpoint:
  `src/app/api/exam/attempts/[attemptId]/submit/route.ts`

### 6) Route Integration
- Reading attempt route:
  `src/app/reading/tests/[testId]/attempt/page.tsx`
- Client runtime bootstrap:
  `src/modules/reading/components/ReadingAttemptClient.tsx`

## Current Acceptance Coverage

- Reading test shell supports 3-section data shape and 40-question semantics.
- Split-screen experience uses independent scrolling panes.
- Answers, flags, visited state, and timer are persisted with autosave and local cache.
- Timeout path triggers auto-submit utility and submit API endpoint.
- New reading tests can be authored through JSON/DB records rather than component rewrites.

## Styling / Tailwind (if the UI looks unstyled)

Next must run **PostCSS + Tailwind** on `src/app/globals.css`. This repo uses:

- `postcss.config.js` (CommonJS) — `postcss.config.mjs` was not reliably picked up by Next 13 here, which caused raw `@tailwind` directives to ship to the browser (no utility CSS).

After changing Tailwind/PostCSS config, always clear the cache and restart:

```bash
rm -rf apps/web/.next && pnpm dev
```

## Next Hardening Steps

- Replace placeholder scoring in submit route with strict answer-key comparison.
- Add auth-aware Supabase server/client handling for production.
- Extend renderer to all Reading question formats (match information, multi-select, etc.).
- Add e2e tests for refresh recovery, timer expiry, and navigation state coloring.
