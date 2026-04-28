'use client'

import { useState, useEffect } from 'react'
import { ExamCard } from './ExamCard'
import { ExamFilters } from './ExamFilters'
import { useAuth } from '@/components/auth/AuthProvider'

interface Exam {
  id: string
  slug: string
  title: string
  description?: string
  total_questions: number
  duration_seconds: number
  difficulty_level?: string
  featured: boolean
  estimated_band_range?: string
  exam_modules?: {
    code: string
    name: string
  }
}

interface ExamCatalogProps {
  initialExams: Exam[]
}

export function ExamCatalog({ initialExams }: ExamCatalogProps) {
  const { user } = useAuth()
  const [exams, setExams] = useState<Exam[]>(initialExams)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<{
    difficulty?: string
    search?: string
    featured?: boolean
  }>({})

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (filters.difficulty) params.append('difficulty', filters.difficulty)
        if (filters.search) params.append('search', filters.search)
        if (filters.featured) params.append('featured', 'true')

        const response = await fetch(`/api/exams?${params}`)
        if (response.ok) {
          const data = await response.json()
          setExams(data.exams)
        }
      } catch (error) {
        console.error('Error fetching exams:', error)
      } finally {
        setLoading(false)
      }
    }

    // Don't fetch on initial load (we have initialExams)
    if (Object.keys(filters).some(key => filters[key as keyof typeof filters])) {
      fetchExams()
    }
  }, [filters])

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          IELTS Reading Practice Exams
        </h1>
        <p className="text-lg text-gray-600">
          Master your IELTS reading skills with authentic practice tests
        </p>
      </div>

      {/* Authentication Notice */}
      {!user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-1">
                Sign in required
              </h3>
              <p className="text-sm text-blue-700">
                You need to{' '}
                <a href="/auth/login" className="font-medium underline hover:text-blue-600">
                  sign in
                </a>{' '}
                or{' '}
                <a href="/auth/signup" className="font-medium underline hover:text-blue-600">
                  create an account
                </a>{' '}
                to take practice exams and track your progress.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <ExamFilters onFilterChange={handleFilterChange} />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Exam Grid */}
      {!loading && (
        <>
          {exams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <ExamCard 
                  key={exam.id} 
                  exam={exam}
                  // TODO: Add user progress data when available
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
              <p className="text-gray-600">
                {Object.keys(filters).some(key => filters[key as keyof typeof filters])
                  ? 'Try adjusting your filters to see more results.'
                  : 'No practice exams are currently available.'}
              </p>
            </div>
          )}
        </>
      )}

      {/* Stats */}
      {!loading && exams.length > 0 && (
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{exams.length}</div>
              <div className="text-sm text-gray-600">Practice Exams</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {exams.reduce((total, exam) => total + exam.total_questions, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(exams.reduce((total, exam) => total + exam.duration_seconds, 0) / 60)}
              </div>
              <div className="text-sm text-gray-600">Minutes of Practice</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}