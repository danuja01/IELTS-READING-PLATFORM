-- IELTS exam engine baseline schema
-- Reading-first implementation with module extensibility.

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'exam_module_type') then
    create type exam_module_type as enum ('READING', 'LISTENING', 'WRITING', 'SPEAKING');
  end if;
  if not exists (select 1 from pg_type where typname = 'attempt_status') then
    create type attempt_status as enum ('IN_PROGRESS', 'SUBMITTING', 'SUBMITTED', 'TIMED_OUT');
  end if;
end
$$;

create table if not exists public.exam_modules (
  id uuid primary key default gen_random_uuid(),
  code exam_module_type not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.exam_tests (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.exam_modules (id),
  slug text not null unique,
  title text not null,
  version int not null default 1,
  total_questions int not null,
  duration_seconds int not null,
  status text not null default 'DRAFT',
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.exam_sections (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.exam_tests (id) on delete cascade,
  section_order int not null,
  title text not null,
  content_html text not null,
  content_markdown text,
  mapping jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (test_id, section_order)
);

create table if not exists public.exam_question_groups (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.exam_tests (id) on delete cascade,
  section_id uuid not null references public.exam_sections (id) on delete cascade,
  group_order int not null,
  title text not null,
  instructions text not null,
  shared_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (test_id, group_order)
);

create table if not exists public.exam_questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.exam_tests (id) on delete cascade,
  section_id uuid not null references public.exam_sections (id) on delete cascade,
  group_id uuid not null references public.exam_question_groups (id) on delete cascade,
  question_number int not null,
  question_type text not null,
  prompt text not null,
  config jsonb not null default '{}'::jsonb,
  answer_key jsonb not null default '{}'::jsonb,
  mapping jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (test_id, question_number)
);

create table if not exists public.exam_attempts (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.exam_tests (id),
  user_id uuid not null references auth.users (id),
  status attempt_status not null default 'IN_PROGRESS',
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  remaining_seconds int not null,
  current_question_id uuid references public.exam_questions (id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.exam_attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.exam_attempts (id) on delete cascade,
  question_id uuid not null references public.exam_questions (id) on delete cascade,
  answer jsonb not null default '{}'::jsonb,
  flagged boolean not null default false,
  visited boolean not null default false,
  answered_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

create table if not exists public.exam_highlights (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.exam_attempts (id) on delete cascade,
  section_id uuid not null references public.exam_sections (id) on delete cascade,
  start_offset int not null,
  end_offset int not null,
  selected_text text not null,
  color text not null default 'yellow',
  created_at timestamptz not null default now()
);

create table if not exists public.exam_submissions (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null unique references public.exam_attempts (id) on delete cascade,
  raw_score int not null default 0,
  band_score numeric(3, 1),
  breakdown jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now()
);

insert into public.exam_modules (code, name)
values
  ('READING', 'IELTS Reading'),
  ('LISTENING', 'IELTS Listening'),
  ('WRITING', 'IELTS Writing'),
  ('SPEAKING', 'IELTS Speaking')
on conflict (code) do nothing;

alter table public.exam_tests enable row level security;
alter table public.exam_sections enable row level security;
alter table public.exam_question_groups enable row level security;
alter table public.exam_questions enable row level security;
alter table public.exam_attempts enable row level security;
alter table public.exam_attempt_answers enable row level security;
alter table public.exam_highlights enable row level security;
alter table public.exam_submissions enable row level security;

drop policy if exists "published_tests_readable" on public.exam_tests;
create policy "published_tests_readable"
on public.exam_tests
for select
using (status = 'PUBLISHED');

drop policy if exists "sections_of_published_tests_readable" on public.exam_sections;
create policy "sections_of_published_tests_readable"
on public.exam_sections
for select
using (
  exists (
    select 1
    from public.exam_tests t
    where t.id = exam_sections.test_id
      and t.status = 'PUBLISHED'
  )
);

drop policy if exists "groups_of_published_tests_readable" on public.exam_question_groups;
create policy "groups_of_published_tests_readable"
on public.exam_question_groups
for select
using (
  exists (
    select 1
    from public.exam_tests t
    where t.id = exam_question_groups.test_id
      and t.status = 'PUBLISHED'
  )
);

drop policy if exists "questions_of_published_tests_readable" on public.exam_questions;
create policy "questions_of_published_tests_readable"
on public.exam_questions
for select
using (
  exists (
    select 1
    from public.exam_tests t
    where t.id = exam_questions.test_id
      and t.status = 'PUBLISHED'
  )
);

drop policy if exists "users_manage_own_attempts" on public.exam_attempts;
create policy "users_manage_own_attempts"
on public.exam_attempts
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users_manage_own_answers" on public.exam_attempt_answers;
create policy "users_manage_own_answers"
on public.exam_attempt_answers
for all
using (
  exists (
    select 1
    from public.exam_attempts a
    where a.id = exam_attempt_answers.attempt_id
      and a.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.exam_attempts a
    where a.id = exam_attempt_answers.attempt_id
      and a.user_id = auth.uid()
  )
);

drop policy if exists "users_manage_own_highlights" on public.exam_highlights;
create policy "users_manage_own_highlights"
on public.exam_highlights
for all
using (
  exists (
    select 1
    from public.exam_attempts a
    where a.id = exam_highlights.attempt_id
      and a.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.exam_attempts a
    where a.id = exam_highlights.attempt_id
      and a.user_id = auth.uid()
  )
);

drop policy if exists "users_read_own_submissions" on public.exam_submissions;
create policy "users_read_own_submissions"
on public.exam_submissions
for select
using (
  exists (
    select 1
    from public.exam_attempts a
    where a.id = exam_submissions.attempt_id
      and a.user_id = auth.uid()
  )
);
