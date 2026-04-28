import { Navigation } from '@/components/layout/Navigation'
import { ExamCatalog } from '@/components/exam-catalog/ExamCatalog'
import { getSupabaseServerClient } from '@/lib/supabase/server'

async function getExams() {
  const supabase = getSupabaseServerClient()
  
  try {
    const { data: exams, error } = await supabase
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
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error fetching exams:', error)
      return []
    }

    return exams || []
  } catch (error) {
    console.error('Error in getExams:', error)
    return []
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const exams = await getExams()
  const accessDenied =
    searchParams.error === 'access-denied' ||
    searchParams.reason === 'no-admin-role'

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        {accessDenied && (
          <div className="max-w-7xl mx-auto px-4 pt-6">
            <div
              className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
              role="alert"
            >
              <p className="font-medium">Admin access denied</p>
              <p className="mt-1 text-amber-800">
                Your account must have role <code className="rounded bg-amber-100 px-1">admin</code> or{' '}
                <code className="rounded bg-amber-100 px-1">moderator</code> in the{' '}
                <code className="rounded bg-amber-100 px-1">public.user_roles</code> table. Run{' '}
                <code className="rounded bg-amber-100 px-1">supabase/scripts/grant_admin_by_email.sql</code> in the
                Supabase SQL Editor (or use <code className="rounded bg-amber-100 px-1">/api/admin/promote-user</code>{' '}
                with <code className="rounded bg-amber-100 px-1">ADMIN_BOOTSTRAP_SECRET</code>), then open{' '}
                <code className="rounded bg-amber-100 px-1">/admin</code> again.
              </p>
            </div>
          </div>
        )}
        <ExamCatalog initialExams={exams} />
      </main>
    </>
  )
}
