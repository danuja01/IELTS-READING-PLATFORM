'use client'

import Link from 'next/link'

interface ExamCardProps {
  exam: {
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
  userProgress?: {
    completed: boolean
    bestScore?: number
    attemptCount: number
  }
}

export function ExamCard({ exam, userProgress }: ExamCardProps) {
  const durationMinutes = Math.round(exam.duration_seconds / 60)
  
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'Beginner'
      case 'intermediate': return 'Intermediate'  
      case 'advanced': return 'Advanced'
      default: return 'All Levels'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {exam.title}
            </h3>
            {exam.description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {exam.description}
              </p>
            )}
          </div>
          
          {exam.featured && (
            <div className="ml-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{exam.total_questions} questions</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{durationMinutes} minutes</span>
          </div>

          {exam.estimated_band_range && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Band {exam.estimated_band_range}</span>
            </div>
          )}
        </div>

        {/* Difficulty Badge */}
        {exam.difficulty_level && (
          <div className="flex items-center space-x-2 mb-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(exam.difficulty_level)}`}>
              {getDifficultyLabel(exam.difficulty_level)}
            </span>
          </div>
        )}

        {/* Progress (if user is logged in) */}
        {userProgress && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-700">
              {userProgress.completed ? (
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-medium">✓ Completed</span>
                  {userProgress.bestScore && (
                    <span className="text-sm">Best: Band {userProgress.bestScore}</span>
                  )}
                </div>
              ) : userProgress.attemptCount > 0 ? (
                <span className="text-blue-600">In Progress ({userProgress.attemptCount} attempts)</span>
              ) : (
                <span className="text-gray-500">Not started</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="px-6 pb-6">
        <Link
          href={`/reading/tests/${exam.slug}/attempt`}
          className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          {userProgress?.completed ? 'Retake Exam' : 'Start Exam'}
        </Link>
      </div>
    </div>
  )
}