-- User roles and permissions system for IELTS platform
-- Implements role-based access control (RBAC) with custom claims

-- Create role and permission enums
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type app_role as enum ('user', 'moderator', 'admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'app_permission') then
    create type app_permission as enum (
      'exams.create',
      'exams.edit', 
      'exams.delete',
      'exams.publish',
      'users.manage',
      'leaderboard.view',
      'results.view_all'
    );
  end if;
end
$$;

-- User roles mapping table
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role app_role not null default 'user',
  assigned_by uuid references auth.users (id),
  assigned_at timestamptz not null default now(),
  unique (user_id, role)
);

-- Role permissions mapping table
create table if not exists public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  role app_role not null,
  permission app_permission not null,
  created_at timestamptz not null default now(),
  unique (role, permission)
);

-- Insert default role permissions
insert into public.role_permissions (role, permission)
values
  -- User permissions
  ('user', 'leaderboard.view'),
  
  -- Moderator permissions (inherits user + content creation)
  ('moderator', 'leaderboard.view'),
  ('moderator', 'exams.create'),
  ('moderator', 'exams.edit'),
  ('moderator', 'exams.publish'),
  
  -- Admin permissions (all permissions)
  ('admin', 'leaderboard.view'),
  ('admin', 'exams.create'),
  ('admin', 'exams.edit'),
  ('admin', 'exams.delete'),
  ('admin', 'exams.publish'),
  ('admin', 'users.manage'),
  ('admin', 'results.view_all')
on conflict (role, permission) do nothing;

-- Function to get user roles with permissions
create or replace function public.get_user_roles_and_permissions(target_user_id uuid)
returns json
language sql
security definer
as $$
  select json_build_object(
    'roles', (
      select coalesce(json_agg(ur.role), '[]'::json)
      from public.user_roles ur
      where ur.user_id = target_user_id
    ),
    'permissions', (
      select coalesce(json_agg(distinct rp.permission), '[]'::json)
      from public.user_roles ur
      join public.role_permissions rp on rp.role = ur.role
      where ur.user_id = target_user_id
    )
  );
$$;

-- Auth hook function to add custom claims to JWT
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
as $$
declare
  claims jsonb;
  user_roles_and_permissions json;
begin
  -- Get the user roles and permissions
  select public.get_user_roles_and_permissions(
    (event->>'user_id')::uuid
  ) into user_roles_and_permissions;

  -- Build claims object
  claims := jsonb_build_object(
    'user_roles_and_permissions', user_roles_and_permissions
  );

  -- Update the 'claims' object in the event
  event := jsonb_set(event, '{claims, user_roles_and_permissions}', claims->'user_roles_and_permissions');
  
  return event;
end;
$$;

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant select on public.user_roles to authenticated;
grant select on public.role_permissions to authenticated;
grant execute on function public.get_user_roles_and_permissions to authenticated;

-- Enable RLS on new tables
alter table public.user_roles enable row level security;
alter table public.role_permissions enable row level security;

-- RLS policies for user_roles
create policy "users_can_view_own_roles"
on public.user_roles
for select
using (auth.uid() = user_id);

create policy "admins_can_manage_user_roles"
on public.user_roles
for all
using (
  exists (
    select 1 from public.user_roles ur
    join public.role_permissions rp on rp.role = ur.role
    where ur.user_id = auth.uid()
    and rp.permission = 'users.manage'
  )
);

-- RLS policies for role_permissions (read-only for authenticated users)
create policy "authenticated_users_can_view_role_permissions"
on public.role_permissions
for select
to authenticated
using (true);

-- Function to check if user has permission
create or replace function public.user_has_permission(permission_name text)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.role_permissions rp on rp.role = ur.role
    where ur.user_id = auth.uid()
    and rp.permission = permission_name::app_permission
  );
$$;

-- Function to check if user has role
create or replace function public.user_has_role(role_name text)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
    and ur.role = role_name::app_role
  );
$$;

-- Update existing RLS policies to support role-based permissions
drop policy if exists "published_tests_readable" on public.exam_tests;
create policy "published_tests_readable_by_users"
on public.exam_tests
for select
using (
  status = 'PUBLISHED' or 
  public.user_has_permission('exams.edit')
);

-- Policy for creating/editing exams
create policy "moderators_and_admins_can_manage_exams"
on public.exam_tests
for all
using (public.user_has_permission('exams.create'))
with check (public.user_has_permission('exams.create'));

-- Add similar policies for sections, question groups, and questions
drop policy if exists "sections_of_published_tests_readable" on public.exam_sections;
create policy "sections_readable_by_users"
on public.exam_sections
for select
using (
  exists (
    select 1
    from public.exam_tests t
    where t.id = exam_sections.test_id
    and (t.status = 'PUBLISHED' or public.user_has_permission('exams.edit'))
  )
);

create policy "moderators_and_admins_can_manage_sections"
on public.exam_sections
for all
using (public.user_has_permission('exams.create'))
with check (public.user_has_permission('exams.create'));

-- Similar policies for question groups
drop policy if exists "groups_of_published_tests_readable" on public.exam_question_groups;
create policy "question_groups_readable_by_users"
on public.exam_question_groups
for select
using (
  exists (
    select 1
    from public.exam_tests t
    where t.id = exam_question_groups.test_id
    and (t.status = 'PUBLISHED' or public.user_has_permission('exams.edit'))
  )
);

create policy "moderators_and_admins_can_manage_question_groups"
on public.exam_question_groups
for all
using (public.user_has_permission('exams.create'))
with check (public.user_has_permission('exams.create'));

-- Similar policies for questions
drop policy if exists "questions_of_published_tests_readable" on public.exam_questions;
create policy "questions_readable_by_users"
on public.exam_questions
for select
using (
  exists (
    select 1
    from public.exam_tests t
    where t.id = exam_questions.test_id
    and (t.status = 'PUBLISHED' or public.user_has_permission('exams.edit'))
  )
);

create policy "moderators_and_admins_can_manage_questions"
on public.exam_questions
for all
using (public.user_has_permission('exams.create'))
with check (public.user_has_permission('exams.create'));

-- Create default admin user (will be assigned after first user signs up)
-- This will be handled via a trigger or manual assignment