import { Navigation } from '@/components/layout/Navigation'
import { requireAdminPageAccess } from '@/lib/auth/requireAdmin'
import { ExamCreateClient } from './ExamCreateClient'
import Link from 'next/link'

export default async function AdminExamCreatePage() {
  await requireAdminPageAccess('/admin/exams/create')

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Link href="/admin" className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block">
              ← Admin dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Create exam</h1>
            <p className="mt-2 text-gray-600">
              Start a reading test draft. Add passages below; question authoring will grow here next.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <ExamCreateClient />
          </div>
        </div>
      </div>
    </>
  )
}
