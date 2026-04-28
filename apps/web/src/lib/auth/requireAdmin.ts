import { redirect } from 'next/navigation'
import { createRouteHandlerSupabase } from '@/lib/supabase/server'

/** Ensures the user is signed in and has admin or moderator role (matches middleware). */
export async function requireAdminPageAccess(redirectToPath = '/admin') {
  const supabase = createRouteHandlerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?redirectTo=${encodeURIComponent(redirectToPath)}`)
  }

  const { data: rows } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .in('role', ['admin', 'moderator'])

  if (!rows?.length) {
    redirect('/?error=access-denied')
  }

  return user
}
