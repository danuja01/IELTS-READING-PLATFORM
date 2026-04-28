'use client'

import { useState, useRef, useEffect } from 'react'
import { GapFillQuestion } from '@/types/exam'
import { useExamSession } from '@/modules/exam-engine/hooks/useExamSession'

interface GapFillQuestionProps {
  question: GapFillQuestion
  questionNumber: number
}

interface GapInputProps {
  gapId: string
  questionId: string
  placeholder?: string
  maxWords?: number
  value: string
  onChange: (value: string) => void
}

function GapInput({ gapId, questionNumber, maxWords, value, onChange }: GapInputProps & { questionNumber: number }) {
  // Just an inline input box, IELTS standard
  // Width adjusts roughly based on the content or a default size
  const inputWidth = Math.max(120, (value.length + 2) * 10);

  return (
    <span className="inline-flex items-center mx-1">
      <span className="text-sm font-bold bg-gray-200 text-gray-800 px-2 py-1 rounded-l-md border-y border-l border-gray-400">
        {questionNumber}
      </span>
      <input
        type="text"
        className="inline-block border border-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none px-2 py-1 rounded-r-md text-center bg-white h-[32px] text-[15px]"
        style={{ width: `${inputWidth}px` }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxWords ? maxWords * 15 : undefined} // Give some generous char limit based on word limit
        spellCheck={false}
      />
    </span>
  )
}

export function GapFillQuestionComponent({ question, questionNumber }: GapFillQuestionProps) {
  const { snapshot, updateAnswer } = useExamSession()
  const answer = snapshot.answersByQuestionId[question.id]
  const answers = (answer?.value as Record<string, string>) || {}

  const handleGapChange = (gapId: string, value: string) => {
    const updatedAnswers = { ...answers, [gapId]: value }
    updateAnswer(question.id, updatedAnswers)
  }

  // Parse the text and replace gap placeholders with interactive inputs
  const renderTextWithGaps = (text: string) => {
    const parts = []
    let currentIndex = 0
    
    // Find all {{number}} patterns
    const gapPattern = /\{\{(\d+)\}\}/g
    let match

    while ((match = gapPattern.exec(text)) !== null) {
      // Add text before the gap
      if (match.index > currentIndex) {
        parts.push(text.slice(currentIndex, match.index))
      }
      
      // Find the gap configuration
      const gapNumber = parseInt(match[1])
      const gap = question.gaps.find(g => g.position === gapNumber)
      
      if (gap) {
        parts.push(
          <GapInput
            key={gap.id}
            gapId={gap.id}
            questionId={question.id}
            questionNumber={questionNumber + gap.position - 1}
            placeholder={gap.placeholder}
            maxWords={gap.maxWords}
            value={answers[gap.id] || ''}
            onChange={(value) => handleGapChange(gap.id, value)}
          />
        )
      }
      
      currentIndex = match.index + match[0].length
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(text.slice(currentIndex))
    }
    
    return parts
  }

  return (
    <div className="space-y-4">
      {question.instructions && (
        <div className="text-[15px] text-gray-800 bg-[#EBEBEB] p-4 font-medium mb-6">
          <strong>Questions {questionNumber} - {questionNumber + question.gaps.length - 1}</strong><br/><br/>
          {question.instructions.split('\n').map((line, i) => (
            <span key={i}>{line}<br/></span>
          ))}
        </div>
      )}

      <div className="text-[15px] font-medium text-gray-900 mb-4">
        {question.prompt}
      </div>

      <div className="text-[15px] leading-relaxed ielts-passage" style={{ textAlign: 'left' }}>
        {renderTextWithGaps(question.text)}
      </div>

      <div className="text-sm text-gray-600 mt-4 border-t border-gray-300 pt-4">
        <strong>Tip:</strong> Click on the blanks to type your answer.
      </div>
    </div>
  )
}