import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

let client: ReturnType<typeof createBrowserClient<Database>> | undefined

export function getSupabaseBrowserClient() {
  if (!client) {
    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return client
}

// Helper function to get the current user
export async function getCurrentUser() {
  const supabase = getSupabaseBrowserClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Helper function to get user session
export async function getUserSession() {
  const supabase = getSupabaseBrowserClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Helper function to sign out
export async function signOut() {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Helper function to get user roles and permissions from JWT claims
export function getUserRolesAndPermissions(user: any) {
  const claims = user?.user_metadata?.user_roles_and_permissions || user?.app_metadata?.user_roles_and_permissions
  return {
    roles: claims?.roles || [],
    permissions: claims?.permissions || []
  }
}

/** Same shape as JWT claims; sourced from DB via RPC when hooks are not configured. */
export async function fetchRolesFromDatabase(userId: string): Promise<{
  roles: string[]
  permissions: string[]
}> {
  try {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase.rpc('get_user_roles_and_permissions', {
      target_user_id: userId,
    })
    if (!error && data != null) {
      const payload = data as { roles?: unknown; permissions?: unknown }
      const roles = Array.isArray(payload.roles) ? (payload.roles as string[]) : []
      const permissions = Array.isArray(payload.permissions)
        ? (payload.permissions as string[])
        : []
      if (roles.length > 0 || permissions.length > 0) {
        return { roles, permissions }
      }
    }

    const { data: ur } = await supabase.from('user_roles').select('role').eq('user_id', userId)
    const roles = (ur ?? []).map((r) => String(r.role))
    if (roles.length === 0) {
      return { roles: [], permissions: [] }
    }

    const { data: rp } = await supabase.from('role_permissions').select('permission').in('role', roles as never[])
    const permissions = [...new Set((rp ?? []).map((p) => String(p.permission)))]
    return { roles, permissions }
  } catch {
    return { roles: [], permissions: [] }
  }
}

/** Prefer DB row data when present; otherwise keep JWT hook claims. */
export function mergeRolesAndPermissions(
  jwt: { roles: string[]; permissions: string[] },
  db: { roles: string[]; permissions: string[] }
): { roles: string[]; permissions: string[] } {
  if (db.roles.length > 0 || db.permissions.length > 0) {
    return { roles: db.roles, permissions: db.permissions }
  }
  return jwt
}

// Permission checker functions
export function hasPermission(user: any, permission: string): boolean {
  const { permissions } = getUserRolesAndPermissions(user)
  return permissions.includes(permission)
}

export function hasRole(user: any, role: string): boolean {
  const { roles } = getUserRolesAndPermissions(user)
  return roles.includes(role)
}

export function isAdmin(user: any): boolean {
  return hasRole(user, 'admin')
}

export function isModerator(user: any): boolean {
  return hasRole(user, 'moderator')
}

export function isUser(user: any): boolean {
  return hasRole(user, 'user')
}

export function canCreateExams(user: any): boolean {
  return hasPermission(user, 'exams.create')
}

export function canEditExams(user: any): boolean {
  return hasPermission(user, 'exams.edit')
}

export function canDeleteExams(user: any): boolean {
  return hasPermission(user, 'exams.delete')
}

export function canManageUsers(user: any): boolean {
  return hasPermission(user, 'users.manage')
}