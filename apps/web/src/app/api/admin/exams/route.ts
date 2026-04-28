import { createRouteHandlerSupabase, getSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

async function checkAdminPermissions() {
  const supabase = createRouteHandlerSupabase()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const { data: rpcAllowed } = await supabase.rpc('user_has_permission', {
    permission_name: 'exams.create',
  })

  if (rpcAllowed) {
    return user
  }

  const { data: elevated } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .in('role', ['admin', 'moderator'])

  if (!elevated?.length) {
    throw new Error('Insufficient permissions')
  }

  return user
}

export async function GET(request: NextRequest) {
  try {
    await checkAdminPermissions()

    const supabase = getSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') // 'DRAFT', 'PUBLISHED', etc.

    let query = supabase
      .from('exam_tests')
      .select(`
        id,
        slug,
        title,
        version,
        total_questions,
        duration_seconds,
        status,
        difficulty_level,
        featured,
        estimated_band_range,
        description,
        created_by,
        created_at,
        updated_at,
        exam_modules (
          code,
          name
        )
      `)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: exams, error } = await query

    if (error) {
      console.error('Error fetching exams for admin:', error)
      return NextResponse.json(
        { error: 'Failed to fetch exams' },
        { status: 500 }
      )
    }

    // Get total count
    const { count: totalCount } = await supabase
      .from('exam_tests')
      .select('*', { count: 'exact', head: true })

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
    console.error('Error in admin exams API:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await checkAdminPermissions()
    const supabase = getSupabaseServerClient()

    const body = await request.json()
    const {
      title,
      description,
      difficulty_level,
      estimated_band_range,
      featured = false,
      sections,
      questions
    } = body

    // Validate required fields
    if (!title || !sections || !questions) {
      return NextResponse.json(
        { error: 'Missing required fields: title, sections, questions' },
        { status: 400 }
      )
    }

    // Get reading module ID
    const { data: readingModule } = await supabase
      .from('exam_modules')
      .select('id')
      .eq('code', 'READING')
      .single()

    if (!readingModule) {
      return NextResponse.json(
        { error: 'Reading module not found' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '_')
      .replace(/-+/g, '_')

    // Create the exam test
    const { data: examTest, error: testError } = await supabase
      .from('exam_tests')
      .insert({
        module_id: readingModule.id,
        slug,
        title,
        description,
        total_questions: questions.length,
        duration_seconds: 3600, // Default 1 hour
        difficulty_level,
        estimated_band_range,
        featured,
        status: 'DRAFT',
        created_by: user.id
      })
      .select()
      .single()

    if (testError || !examTest) {
      console.error('Error creating exam test:', testError)
      return NextResponse.json(
        { error: 'Failed to create exam test' },
        { status: 500 }
      )
    }

    // Create sections, question groups, and questions
    const createdSections = []
    const createdQuestionGroups = []
    const createdQuestions = []

    for (const section of sections) {
      const { data: examSection, error: sectionError } = await supabase
        .from('exam_sections')
        .insert({
          test_id: examTest.id,
          section_order: section.order,
          title: section.title,
          content_html: section.content_html,
          content_markdown: section.content_markdown,
          mapping: section.mapping || {}
        })
        .select()
        .single()

      if (sectionError || !examSection) {
        console.error('Error creating exam section:', sectionError)
        continue
      }

      createdSections.push(examSection)
    }

    return NextResponse.json({
      message: 'Exam created successfully',
      exam: {
        ...examTest,
        sections: createdSections,
        questionGroups: createdQuestionGroups,
        questions: createdQuestions
      }
    })

  } catch (error) {
    console.error('Error in create exam API:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}