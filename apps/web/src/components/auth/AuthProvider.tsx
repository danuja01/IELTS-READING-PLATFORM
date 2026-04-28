'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import {
  getSupabaseBrowserClient,
  getUserRolesAndPermissions,
  fetchRolesFromDatabase,
  mergeRolesAndPermissions,
} from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  roles: string[]
  permissions: string[]
  signIn: (email: string, password: string) => Promise<{ error?: any }>
  signUp: (email: string, password: string, userData?: any) => Promise<{ error?: any }>
  signOut: () => Promise<{ error?: any }>
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
  isAdmin: () => boolean
  isModerator: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [roles, setRoles] = useState<string[]>([])
  const [permissions, setPermissions] = useState<string[]>([])

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    let cancelled = false

    async function applyRolesForUser(nextUser: User | null) {
      if (!nextUser) {
        setRoles([])
        setPermissions([])
        return
      }
      try {
        const jwtClaims = getUserRolesAndPermissions(nextUser)
        const fromDb = await fetchRolesFromDatabase(nextUser.id)
        if (cancelled) return
        const merged = mergeRolesAndPermissions(jwtClaims, fromDb)
        setRoles(merged.roles)
        setPermissions(merged.permissions)
      } catch {
        if (!cancelled) {
          setRoles([])
          setPermissions([])
        }
      }
    }

    supabase.auth
      .getSession()
      .then(async ({ data: { session: initial } }) => {
        if (cancelled) return
        setSession(initial)
        setUser(initial?.user ?? null)
        await applyRolesForUser(initial?.user ?? null)
      })
      .catch(() => {
        /* session read failed */
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      await applyRolesForUser(nextSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData || {}
      }
    })
    return { error }
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' })
    } catch {
      /* still attempt client sign-out */
    }
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission)
  }

  const hasRole = (role: string): boolean => {
    return roles.includes(role)
  }

  const isAdmin = (): boolean => {
    return hasRole('admin')
  }

  const isModerator = (): boolean => {
    return hasRole('moderator')
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    roles,
    permissions,
    signIn,
    signUp,
    signOut,
    hasPermission,
    hasRole,
    isAdmin,
    isModerator,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}