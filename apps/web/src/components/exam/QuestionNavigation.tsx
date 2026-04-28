'use client'

import { ReadingQuestion } from '@/types/exam'
import { useEffect, useRef } from 'react'

interface QuestionNavigationProps {
  questions: ReadingQuestion[]
  currentQuestionId: string | null
  answeredQuestionIds: string[]
  flaggedQuestionIds: string[]
  onQuestionSelect: (questionId: string) => void
  currentSectionIndex: number
  onSectionChange: (index: number) => void
}

export function QuestionNavigation({
  questions,
  currentQuestionId,
  answeredQuestionIds,
  flaggedQuestionIds,
  onQuestionSelect,
  currentSectionIndex,
  onSectionChange
}: QuestionNavigationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Find the current question's section and update it if we jumped to a different section
  useEffect(() => {
    if (currentQuestionId) {
      const currentQ = questions.find(q => q.id === currentQuestionId)
      if (currentQ) {
        // We need to figure out which section index this corresponds to
        // Assuming sections are s1, s2, s3...
        // But we don't pass the sections array directly here, so let's deduce from sectionId
        // In our mock data, sectionIds are s1, s2, s3.
        const secIndex = parseInt(currentQ.sectionId.replace('s', '')) - 1
        if (!isNaN(secIndex) && secIndex !== currentSectionIndex) {
          onSectionChange(secIndex)
        }
        
        // Auto scroll to the current question in the bottom nav
        const btn = document.getElementById(`nav-btn-${currentQ.number}`)
        if (btn && scrollContainerRef.current) {
          const container = scrollContainerRef.current
          const btnRect = btn.getBoundingClientRect()
          const containerRect = container.getBoundingClientRect()
          
          if (btnRect.left < containerRect.left || btnRect.right > containerRect.right) {
            btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
          }
        }
      }
    }
  }, [currentQuestionId, questions, currentSectionIndex, onSectionChange])

  const getQuestionStatus = (question: ReadingQuestion) => {
    const isAnswered = answeredQuestionIds.includes(question.id)
    const isFlagged = flaggedQuestionIds.includes(question.id)
    const isCurrent = currentQuestionId === question.id

    if (isCurrent) return 'current'
    if (isFlagged && isAnswered) return 'flagged-answered'
    if (isFlagged) return 'flagged'
    if (isAnswered) return 'answered'
    return 'unanswered'
  }

  const getButtonStyles = (status: string, isFlagged: boolean) => {
    // Official IELTS CBT style:
    // Unanswered: White square, gray border
    // Answered: White square, gray border, but usually with a different style or solid bottom border. Let's make the bottom border thicker or add a dot. We'll use a bold underline for answered.
    // Flagged: Circle instead of square
    // Current: Solid Blue background with white text
    
    let baseStyles = 'flex-shrink-0 w-8 h-8 flex items-center justify-center text-sm font-bold cursor-pointer transition-colors '
    
    // Shape
    baseStyles += isFlagged ? 'rounded-full ' : 'rounded-sm '
    
    // State colors
    switch (status) {
      case 'current':
        baseStyles += 'bg-blue-600 text-white border-2 border-blue-600'
        break
      case 'answered':
      case 'flagged-answered':
        baseStyles += 'bg-white text-gray-800 border-2 border-gray-400 border-b-4 border-b-gray-800'
        break
      case 'unanswered':
      case 'flagged':
      default:
        baseStyles += 'bg-white text-gray-800 border-2 border-gray-300 hover:border-gray-400'
        break
    }
    
    return baseStyles
  }

  const currentIndex = questions.findIndex(q => q.id === currentQuestionId)
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      onQuestionSelect(questions[currentIndex - 1].id)
    }
  }
  
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      onQuestionSelect(questions[currentIndex + 1].id)
    }
  }

  return (
    <div className="bg-[#EBEBEB] border-t-2 border-gray-300 h-[60px] w-full flex items-center shadow-inner relative z-10 px-4">
      {/* Parts tabs (Simulated) */}
      <div className="flex space-x-2 mr-6 border-r-2 border-gray-300 pr-6 py-1">
        {[0, 1, 2].map((idx) => (
          <button
            key={idx}
            onClick={() => onSectionChange(idx)}
            className={`px-3 py-1 font-bold text-xs uppercase tracking-wide rounded-sm border-2 ${
              currentSectionIndex === idx
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            Part {idx + 1}
          </button>
        ))}
      </div>

      {/* Main Question Numbers Scroll Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 flex items-center space-x-2 overflow-x-auto ielts-scrollbar py-1"
        style={{ scrollBehavior: 'smooth' }}
      >
        {questions.map((question) => {
          const status = getQuestionStatus(question)
          const isFlagged = flaggedQuestionIds.includes(question.id)
          return (
            <button
              id={`nav-btn-${question.number}`}
              key={question.id}
              onClick={() => onQuestionSelect(question.id)}
              className={getButtonStyles(status, isFlagged)}
              title={`Question ${question.number}`}
            >
              {question.number}
            </button>
          )
        })}
      </div>

      {/* Prev / Next Navigation Arrows */}
      <div className="flex items-center space-x-2 ml-6 pl-6 border-l-2 border-gray-300 py-1">
        <button
          onClick={handlePrev}
          disabled={currentIndex <= 0}
          className="w-10 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous Question"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex >= questions.length - 1}
          className="w-10 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next Question"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}