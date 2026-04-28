import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { requireAdminPageAccess } from '@/lib/auth/requireAdmin'

export default async function AdminUsersPage() {
  await requireAdminPageAccess('/admin/users')

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/admin" className="text-sm text-blue-600 hover:text-blue-800 inline-block mb-4">
            ← Admin dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">User management</h1>
          <p className="mt-2 text-gray-600">
            Role assignment is done in the database (<code className="text-sm bg-gray-100 px-1 rounded">user_roles</code>
            ) or your Supabase dashboard for now. A self-serve user admin UI can be added here later.
          </p>
        </div>
      </div>
    </>
  )
}
