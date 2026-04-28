-- Enhanced exam schema for additional features
-- Adds leaderboard support, answer explanations, and enhanced question types

-- Add new columns to exam_tests for enhanced features
alter table public.exam_tests 
add column if not exists difficulty_level text check (difficulty_level in ('beginner', 'intermediate', 'advanced')),
add column if not exists featured boolean not null default false,
add column if not exists estimated_band_range text, -- e.g. "6.0-7.5"
add column if not exists tags text[] default array[]::text[],
add column if not exists description text;

-- Create exam explanations table for answer explanations
create table if not exists public.exam_explanations (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.exam_questions (id) on delete cascade,
  explanation_text text not null,
  explanation_html text,
  tips text,
  related_topics text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create leaderboard cache table for performance
create table if not exists public.exam_leaderboards (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.exam_tests (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  band_score numeric(3, 1) not null,
  raw_score integer not null,
  completion_time_seconds integer not null,
  attempt_date timestamptz not null,
  rank_position integer,
  percentile numeric(5, 2),
  created_at timestamptz not null default now(),
  unique (test_id, user_id, attempt_date)
);

-- Create indexes for performance
create index if not exists idx_exam_tests_status_featured on public.exam_tests (status, featured);
create index if not exists idx_exam_tests_difficulty on public.exam_tests (difficulty_level);
create index if not exists idx_exam_tests_tags on public.exam_tests using gin (tags);
create index if not exists idx_exam_leaderboards_test_rank on public.exam_leaderboards (test_id, rank_position);
create index if not exists idx_exam_leaderboards_user_score on public.exam_leaderboards (user_id, band_score desc);

-- Enhanced exam submissions with more detailed breakdown
alter table public.exam_submissions 
add column if not exists completion_time_seconds integer,
add column if not exists section_scores jsonb default '{}'::jsonb,
add column if not exists question_accuracy jsonb default '{}'::jsonb,
add column if not exists time_per_question jsonb default '{}'::jsonb;

-- Function to update leaderboard when submission is created
create or replace function public.update_leaderboard_on_submission()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Insert or update leaderboard entry
  insert into public.exam_leaderboards (
    test_id,
    user_id,
    band_score,
    raw_score,
    completion_time_seconds,
    attempt_date
  )
  select 
    a.test_id,
    a.user_id,
    coalesce(NEW.band_score, 0),
    NEW.raw_score,
    coalesce(NEW.completion_time_seconds, extract(epoch from (NEW.submitted_at - a.started_at))::integer),
    NEW.submitted_at
  from public.exam_attempts a
  where a.id = NEW.attempt_id
  on conflict (test_id, user_id, attempt_date) 
  do update set
    band_score = excluded.band_score,
    raw_score = excluded.raw_score,
    completion_time_seconds = excluded.completion_time_seconds;

  -- Recalculate rankings for this test
  with ranked_submissions as (
    select 
      id,
      row_number() over (
        order by band_score desc, 
        completion_time_seconds asc, 
        attempt_date asc
      ) as new_rank
    from public.exam_leaderboards
    where test_id = (
      select test_id from public.exam_attempts where id = NEW.attempt_id
    )
  )
  update public.exam_leaderboards l
  set rank_position = r.new_rank
  from ranked_submissions r
  where l.id = r.id;

  return NEW;
end;
$$;

-- Create trigger for leaderboard updates
drop trigger if exists trigger_update_leaderboard on public.exam_submissions;
create trigger trigger_update_leaderboard
  after insert or update on public.exam_submissions
  for each row
  execute function public.update_leaderboard_on_submission();

-- Enable RLS on new tables
alter table public.exam_explanations enable row level security;
alter table public.exam_leaderboards enable row level security;

-- RLS policies for exam explanations
create policy "explanations_readable_by_authenticated_users"
on public.exam_explanations
for select
to authenticated
using (
  exists (
    select 1
    from public.exam_questions q
    join public.exam_tests t on t.id = q.test_id
    where q.id = exam_explanations.question_id
    and (t.status = 'PUBLISHED' or public.user_has_permission('exams.edit'))
  )
);

create policy "moderators_and_admins_can_manage_explanations"
on public.exam_explanations
for all
using (public.user_has_permission('exams.create'))
with check (public.user_has_permission('exams.create'));

-- RLS policies for leaderboards
create policy "leaderboards_readable_by_authenticated_users"
on public.exam_leaderboards
for select
to authenticated
using (true);

create policy "leaderboards_manageable_by_system"
on public.exam_leaderboards
for insert
with check (true);

create policy "users_can_view_own_leaderboard_entries"
on public.exam_leaderboards
for select
using (auth.uid() = user_id or public.user_has_permission('results.view_all'));

-- Function to get leaderboard for a specific test
create or replace function public.get_test_leaderboard(
  test_uuid uuid,
  limit_count integer default 50
)
returns table (
  rank integer,
  user_id uuid,
  band_score numeric,
  raw_score integer,
  completion_time_seconds integer,
  attempt_date timestamptz,
  user_name text
)
language sql
security definer
stable
as $$
  select 
    l.rank_position,
    l.user_id,
    l.band_score,
    l.raw_score,
    l.completion_time_seconds,
    l.attempt_date,
    coalesce(u.raw_user_meta_data->>'full_name', u.email) as user_name
  from public.exam_leaderboards l
  join auth.users u on u.id = l.user_id
  where l.test_id = test_uuid
  order by l.rank_position
  limit limit_count;
$$;

-- Function to get user's rank in a specific test
create or replace function public.get_user_test_rank(
  test_uuid uuid,
  target_user_id uuid
)
returns table (
  rank integer,
  band_score numeric,
  total_participants integer,
  percentile numeric
)
language sql
security definer
stable
as $$
  select 
    l.rank_position,
    l.band_score,
    (select count(*) from public.exam_leaderboards where test_id = test_uuid)::integer as total_participants,
    round(
      (100.0 * (total_count - l.rank_position + 1) / total_count), 2
    ) as percentile
  from public.exam_leaderboards l
  cross join (
    select count(*) as total_count 
    from public.exam_leaderboards 
    where test_id = test_uuid
  ) counts
  where l.test_id = test_uuid 
  and l.user_id = target_user_id
  order by l.attempt_date desc
  limit 1;
$$;

-- Grant permissions
grant execute on function public.get_test_leaderboard to authenticated;
grant execute on function public.get_user_test_rank to authenticated;
grant select on public.exam_explanations to authenticated;
grant select on public.exam_leaderboards to authenticated;