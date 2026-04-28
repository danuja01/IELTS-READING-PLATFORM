'use client'

import { MatchHeadQuestion } from '@/types/exam'
import { useExamSession } from '@/modules/exam-engine/hooks/useExamSession'

interface MatchHeadQuestionProps {
  question: MatchHeadQuestion
  questionNumber: number
}

export function MatchHeadQuestionComponent({ question, questionNumber }: MatchHeadQuestionProps) {
  const { snapshot, updateAnswer } = useExamSession()
  const answer = snapshot.answersByQuestionId[question.id]
  const answers = (answer?.value as Record<string, string>) || {}

  const handleAnswerChange = (paragraphId: string, headingKey: string) => {
    const updatedAnswers = { ...answers }
    
    // Remove the heading from any other paragraph first
    Object.keys(updatedAnswers).forEach(key => {
      if (updatedAnswers[key] === headingKey) {
        delete updatedAnswers[key]
      }
    })
    
    // Set the new assignment
    updatedAnswers[paragraphId] = headingKey
    updateAnswer(question.id, updatedAnswers)
  }

  const getAvailableHeadings = () => {
    const usedHeadings = new Set(Object.values(answers))
    return question.availableHeadings.filter(h => !usedHeadings.has(h.key))
  }

  return (
    <div className="space-y-6">
      {question.instructions && (
        <div className="text-[15px] text-gray-800 bg-[#EBEBEB] p-4 font-medium mb-6">
          <strong>Questions {questionNumber} - {questionNumber + question.paragraphTargets.length - 1}</strong><br/><br/>
          {question.instructions.split('\n').map((line, i) => (
            <span key={i}>{line}<br/></span>
          ))}
        </div>
      )}

      <div className="text-[15px] font-medium text-gray-900 mb-4">
        {question.prompt}
      </div>

      {/* Available Headings */}
      <div className="border-2 border-gray-400 p-4 mb-6">
        <h4 className="text-[15px] font-bold text-gray-900 mb-3 text-center">List of Headings</h4>
        <div className="grid gap-2 max-w-xl mx-auto">
          {question.availableHeadings.map((heading) => (
            <div key={heading.key} className="flex items-start space-x-3">
              <span className="text-[15px] font-bold text-gray-900 min-w-[24px] text-right">
                {heading.key}
              </span>
              <span className="text-[15px] text-gray-800">
                {heading.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Paragraph Matching */}
      <div className="space-y-4 max-w-sm">
        {question.paragraphTargets.map((target) => (
          <div key={target.slotId} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-[15px] font-bold text-gray-900 w-8">
                {questionNumber + question.paragraphTargets.findIndex(t => t.slotId === target.slotId)}
              </div>
              <label className="text-[15px] text-gray-800 font-medium">
                Paragraph {target.paragraphLabel}
              </label>
            </div>
            
            <div className="w-32">
              <select
                value={answers[target.slotId] || ''}
                onChange={(e) => handleAnswerChange(target.slotId, e.target.value)}
                className="w-full px-2 py-1.5 border-2 border-gray-400 focus:outline-none focus:border-blue-600 bg-white"
              >
                <option value=""></option>
                {question.availableHeadings.map((heading) => {
                  const isUsed = Object.values(answers).includes(heading.key) && answers[target.slotId] !== heading.key
                  return (
                    <option 
                      key={heading.key} 
                      value={heading.key}
                      disabled={isUsed}
                      className={isUsed ? 'text-gray-400' : 'text-gray-900'}
                    >
                      {heading.key}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}