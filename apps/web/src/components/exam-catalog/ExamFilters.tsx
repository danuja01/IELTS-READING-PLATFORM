'use client'

import { useState } from 'react'

interface ExamFiltersProps {
  onFilterChange: (filters: {
    difficulty?: string
    search?: string
    featured?: boolean
  }) => void
}

export function ExamFilters({ onFilterChange }: ExamFiltersProps) {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState<string>('')
  const [featured, setFeatured] = useState(false)

  const handleFilterUpdate = (newFilters: Partial<{
    difficulty: string
    search: string  
    featured: boolean
  }>) => {
    const filters = { search, difficulty, featured, ...newFilters }
    setSearch(filters.search)
    setDifficulty(filters.difficulty)
    setFeatured(filters.featured)
    
    onFilterChange({
      difficulty: filters.difficulty || undefined,
      search: filters.search || undefined,
      featured: filters.featured || undefined
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Exams</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={search}
            onChange={(e) => handleFilterUpdate({ search: e.target.value })}
            placeholder="Search exam titles..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Difficulty */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => handleFilterUpdate({ difficulty: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Featured Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options
          </label>
          <div className="flex items-center space-x-3 pt-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => handleFilterUpdate({ featured: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Featured only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {(search || difficulty || featured) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => handleFilterUpdate({ search: '', difficulty: '', featured: false })}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}