import { getSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const supabase = getSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get test ID from slug
    const { data: test, error: testError } = await supabase
      .from('exam_tests')
      .select('id, title')
      .eq('slug', params.testId)
      .single()

    if (testError || !test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      )
    }

    // Get leaderboard data using the database function
    const { data: leaderboard, error } = await supabase
      .rpc('get_test_leaderboard', {
        test_uuid: test.id,
        limit_count: limit
      })

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return NextResponse.json(
        { error: 'Failed to fetch leaderboard' },
        { status: 500 }
      )
    }

    // Get total participants count
    const { count: totalParticipants } = await supabase
      .from('exam_leaderboards')
      .select('*', { count: 'exact', head: true })
      .eq('test_id', test.id)

    return NextResponse.json({
      test: {
        id: test.id,
        title: test.title
      },
      leaderboard: leaderboard || [],
      pagination: {
        limit,
        offset,
        total: totalParticipants || 0,
        hasMore: (offset + limit) < (totalParticipants || 0)
      }
    })

  } catch (error) {
    console.error('Error in leaderboard API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}