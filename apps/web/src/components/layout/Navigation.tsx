'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'

export function Navigation() {
  const router = useRouter()
  const { user, signOut, hasPermission, hasRole } = useAuth()
  const showAdmin =
    hasPermission('exams.create') || hasRole('admin') || hasRole('moderator')

  const handleSignOut = async () => {
    await signOut()
    router.refresh()
    window.location.href = '/'
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">IELTS Practice</h1>
                <p className="text-xs text-gray-500">Reading Platform</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Exams
            </Link>
            
            {user && (
              <>
                <Link 
                  href="/results" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  My Results
                </Link>
                
                <Link 
                  href="/leaderboard" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Leaderboard
                </Link>

                {showAdmin && (
                  <Link 
                    href="/admin" 
                    className="text-blue-600 hover:text-blue-700 px-3 py-2 text-sm font-medium transition-colors border border-blue-200 rounded-md"
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <p className="text-gray-700 font-medium">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link 
            href="/" 
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
          >
            Exams
          </Link>
          
          {user && (
            <>
              <Link 
                href="/results" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              >
                My Results
              </Link>
              
              <Link 
                href="/leaderboard" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              >
                Leaderboard
              </Link>

              {showAdmin && (
                <Link 
                  href="/admin" 
                  className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                >
                  Admin Panel
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}