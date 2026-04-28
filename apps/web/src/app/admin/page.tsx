import { getSupabaseServerClient } from '@/lib/supabase/server'
import { requireAdminPageAccess } from '@/lib/auth/requireAdmin'
import { Navigation } from '@/components/layout/Navigation'
import Link from 'next/link'

async function getAdminStats() {
  const supabase = getSupabaseServerClient()

  // Get exam counts by status
  const { data: examCounts } = await supabase
    .from('exam_tests')
    .select('status')
  
  const stats = {
    totalExams: examCounts?.length || 0,
    publishedExams: examCounts?.filter(e => e.status === 'PUBLISHED').length || 0,
    draftExams: examCounts?.filter(e => e.status === 'DRAFT').length || 0,
  }

  // Get total submissions count
  const { count: totalSubmissions } = await supabase
    .from('exam_submissions')
    .select('*', { count: 'exact', head: true })

  // Get recent exams
  const { data: recentExams } = await supabase
    .from('exam_tests')
    .select('id, slug, title, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    ...stats,
    totalSubmissions: totalSubmissions || 0,
    recentExams: recentExams || []
  }
}

export default async function AdminDashboard() {
  await requireAdminPageAccess('/admin')
  const stats = await getAdminStats()

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-lg text-gray-600 mt-2">
              Manage IELTS reading exams and monitor platform activity
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Exams</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalExams}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Published</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.publishedExams}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Drafts</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.draftExams}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Submissions</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalSubmissions}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/admin/exams/create"
                  className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Create New Exam
                </Link>
                <Link
                  href="/admin/exams"
                  className="block w-full bg-white border border-gray-300 text-gray-700 text-center py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Manage Exams
                </Link>
                <Link
                  href="/admin/users"
                  className="block w-full bg-white border border-gray-300 text-gray-700 text-center py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  User Management
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Exams</h3>
              <div className="space-y-3">
                {stats.recentExams.length > 0 ? (
                  stats.recentExams.map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{exam.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(exam.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          exam.status === 'PUBLISHED' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {exam.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No exams created yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}