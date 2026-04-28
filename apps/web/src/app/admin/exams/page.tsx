import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { requireAdminPageAccess } from '@/lib/auth/requireAdmin'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export default async function AdminExamsListPage() {
  await requireAdminPageAccess('/admin/exams')

  const supabase = getSupabaseServerClient()
  const { data: exams } = await supabase
    .from('exam_tests')
    .select('id, slug, title, status, created_at, updated_at')
    .order('updated_at', { ascending: false })

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Link href="/admin" className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block">
                ← Admin dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Manage exams</h1>
              <p className="mt-2 text-gray-600">All reading tests in the system.</p>
            </div>
            <Link
              href="/admin/exams/create"
              className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Create exam
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exams && exams.length > 0 ? (
                  exams.map((exam) => (
                    <tr key={exam.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {exam.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.slug}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            exam.status === 'PUBLISHED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {exam.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {exam.updated_at
                          ? new Date(exam.updated_at).toLocaleString()
                          : '—'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                      No exams yet.{' '}
                      <Link href="/admin/exams/create" className="text-blue-600 hover:text-blue-800">
                        Create one
                      </Link>
                      .
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
