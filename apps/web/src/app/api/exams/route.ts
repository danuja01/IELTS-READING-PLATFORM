import { getSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    
    // Query parameters
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured') === 'true'

    // Build query
    let query = supabase
      .from('exam_tests')
      .select(`
        id,
        slug,
        title,
        total_questions,
        duration_seconds,
        difficulty_level,
        featured,
        estimated_band_range,
        description,
        created_at,
        exam_modules (
          code,
          name
        )
      `)
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (difficulty) {
      query = query.eq('difficulty_level', difficulty)
    }

    if (featured) {
      query = query.eq('featured', true)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%, description.ilike.%${search}%`)
    }

    const { data: exams, error, count } = await query

    if (error) {
      console.error('Error fetching exams:', error)
      return NextResponse.json(
        { error: 'Failed to fetch exams' },
        { status: 500 }
      )
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('exam_tests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PUBLISHED')

    return NextResponse.json({
      exams: exams || [],
      pagination: {
        limit,
        offset,
        total: totalCount || 0,
        hasMore: (offset + limit) < (totalCount || 0)
      }
    })

  } catch (error) {
    console.error('Error in exams API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}