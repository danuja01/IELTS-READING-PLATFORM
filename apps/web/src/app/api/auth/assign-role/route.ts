import { getSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if user already has a role assigned
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existingRole) {
      return NextResponse.json(
        { message: 'User already has a role assigned' },
        { status: 200 }
      )
    }

    // Assign default 'user' role
    const { data, error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'user'
      })
      .select()
      .single()

    if (error) {
      console.error('Error assigning user role:', error)
      return NextResponse.json(
        { error: 'Failed to assign user role' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: 'User role assigned successfully',
      role: data
    })

  } catch (error) {
    console.error('Error in assign-role API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}