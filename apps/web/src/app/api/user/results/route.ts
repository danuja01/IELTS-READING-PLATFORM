import { getSupabaseServerClient } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const serverSupabase = getSupabaseServerClient()

    // Get user's exam results
    const { data: results, error } = await serverSupabase
      .from('exam_submissions')
      .select(`
        id,
        raw_score,
        band_score,
        completion_time_seconds,
        submitted_at,
        breakdown,
        exam_attempts (
          id,
          started_at,
          exam_tests (
            id,
            slug,
            title,
            total_questions,
            difficulty_level
          )
        )
      `)
      .eq('exam_attempts.user_id', user.id)
      .order('submitted_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching user results:', error)
      return NextResponse.json(
        { error: 'Failed to fetch results' },
        { status: 500 }
      )
    }

    // Get total count
    const { count: totalCount } = await serverSupabase
      .from('exam_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('exam_attempts.user_id', user.id)

    // Transform the data for easier consumption
    const transformedResults = (results || []).map(result => ({
      id: result.id,
      rawScore: result.raw_score,
      bandScore: result.band_score,
      completionTimeSeconds: result.completion_time_seconds,
      submittedAt: result.submitted_at,
      breakdown: result.breakdown,
      exam: result.exam_attempts?.exam_tests ? {
        id: result.exam_attempts.exam_tests.id,
        slug: result.exam_attempts.exam_tests.slug,
        title: result.exam_attempts.exam_tests.title,
        totalQuestions: result.exam_attempts.exam_tests.total_questions,
        difficultyLevel: result.exam_attempts.exam_tests.difficulty_level
      } : null,
      attemptStartedAt: result.exam_attempts?.started_at
    }))

    return NextResponse.json({
      results: transformedResults,
      pagination: {
        limit,
        offset,
        total: totalCount || 0,
        hasMore: (offset + limit) < (totalCount || 0)
      }
    })

  } catch (error) {
    console.error('Error in user results API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}