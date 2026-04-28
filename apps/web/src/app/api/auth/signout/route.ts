import { NextResponse } from 'next/server'
import { createRouteHandlerSupabase } from '@/lib/supabase/server'

/** Clears Supabase auth cookies on the server (pairs with browser signOut). */
export async function POST() {
  const supabase = createRouteHandlerSupabase()
  await supabase.auth.signOut()
  return NextResponse.json({ ok: true })
}
