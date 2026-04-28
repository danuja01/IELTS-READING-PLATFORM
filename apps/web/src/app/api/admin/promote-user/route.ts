import { getSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

type Body = {
  /** Preferred: UUID from Supabase Dashboard → Authentication → Users */
  user_id?: string
  email?: string
  role?: 'admin' | 'moderator'
}

async function findUserIdByEmail(
  admin: ReturnType<typeof getSupabaseServerClient>,
  email: string
): Promise<string | null> {
  let page = 1
  const perPage = 200
  for (; page <= 25; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
    if (error) {
      console.error('listUsers:', error)
      return null
    }
    const users = data.users ?? []
    const match = users.find((u) => u.email?.toLowerCase() === email)
    if (match) return match.id
    if (users.length < perPage) break
  }
  return null
}

/**
 * One-time / local-dev: grant admin or moderator using service role (bypasses RLS).
 * Set ADMIN_BOOTSTRAP_SECRET in .env.local and call with header x-bootstrap-secret.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.ADMIN_BOOTSTRAP_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Not configured' }, { status: 404 })
  }

  const provided = request.headers.get('x-bootstrap-secret')
  if (provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const role = body.role ?? 'admin'
  if (role !== 'admin' && role !== 'moderator') {
    return NextResponse.json({ error: 'role must be admin or moderator' }, { status: 400 })
  }

  const admin = getSupabaseServerClient()

  let userId = body.user_id?.trim()
  const email = body.email?.trim()?.toLowerCase()

  if (!userId && email) {
    userId = (await findUserIdByEmail(admin, email)) ?? undefined
  }

  if (!userId) {
    return NextResponse.json(
      {
        error:
          'Provide user_id (uuid) or a registered email. No matching auth user was found.',
      },
      { status: 404 }
    )
  }

  const { error: insertErr } = await admin.from('user_roles').insert({
    user_id: userId,
    role,
  })

  if (insertErr) {
    if (insertErr.code === '23505') {
      return NextResponse.json({
        ok: true,
        already_assigned: true,
        user_id: userId,
        role,
      })
    }
    console.error('user_roles insert:', insertErr)
    return NextResponse.json(
      { error: insertErr.message ?? 'Failed to insert user_roles' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    ok: true,
    user_id: userId,
    email: email ?? null,
    role,
  })
}
