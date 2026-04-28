-- Run in Supabase Dashboard → SQL Editor (uses postgres privileges).
-- Replace the email with yours. Requires the user to exist under Authentication first.

insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role
from auth.users
where lower(email) = lower('YOUR_EMAIL@example.com')
on conflict (user_id, role) do nothing;

-- Verify:
-- select ur.*, u.email from public.user_roles ur join auth.users u on u.id = ur.user_id;
