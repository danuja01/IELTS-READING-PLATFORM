# Seeding Supabase

## `reading_test_001.json` vs the database

- **`reading_test_001.json`** is a **portable authoring / app fixture** format (nested sections, groups, typed questions). Nothing in Postgres reads this file automatically.
- **`reading_test_001.sql`** (same folder) maps that content into your **normalized tables** (`exam_tests`, `exam_sections`, `exam_question_groups`, `exam_questions`).

The JSON file lists **40 question slots** in groups but only defines **6 full question objects**. The SQL seed inserts those **6** rows so `unique (test_id, question_number)` stays valid. To ship a full 40-question test, add 34 more rows to the SQL (or extend the JSON and a small import script).

## Prerequisites

1. Run the schema migration once: `supabase/migrations/0001_exam_engine.sql` (SQL Editor → paste → Run).
2. Ensure `exam_modules` has `READING` (migration inserts it).

## Option A — Supabase Dashboard (simplest)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. **SQL Editor** → **New query**.
3. Paste the full contents of **`supabase/seed/reading_test_001.sql`**.
4. **Run**.

Verify: **Table Editor** → `exam_tests` → one row with `slug = reading_test_001` and `status = PUBLISHED`.

## Option B — Supabase CLI

From repo root (with [CLI](https://supabase.com/docs/guides/cli) linked to your project):

```bash
supabase db execute --file supabase/seed/reading_test_001.sql
```

(Exact flag may vary by CLI version; `supabase sql` or piping `psql` also works.)

## Option C — Custom script later

A Node script can read `reading_test_001.json` and call the Supabase client with the **service role** key to upsert rows. That is useful when editors only maintain JSON.
