'use client'

import { MatchFeatQuestion } from '@/types/exam'
import { useExamSession } from '@/modules/exam-engine/hooks/useExamSession'

interface MatchFeatQuestionProps {
  question: MatchFeatQuestion
  questionNumber: number
}

export function MatchFeatQuestionComponent({ question, questionNumber }: MatchFeatQuestionProps) {
  const { snapshot, updateAnswer } = useExamSession()
  const answer = snapshot.answersByQuestionId[question.id]
  const answers = (answer?.value as Record<string, string>) || {}

  const handleAnswerChange = (statementKey: string, listItemKey: string) => {
    const updatedAnswers = { ...answers, [statementKey]: listItemKey }
    updateAnswer(question.id, updatedAnswers)
  }

  // Group list items by category if available
  const groupedListItems = question.listItems.reduce((groups, item) => {
    const category = item.category || 'Items'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(item)
    return groups
  }, {} as Record<string, typeof question.listItems>)

  return (
    <div className="space-y-6">
      {question.instructions && (
        <div className="text-[15px] text-gray-800 bg-[#EBEBEB] p-4 font-medium mb-6">
          <strong>Questions {questionNumber} - {questionNumber + question.statements.length - 1}</strong><br/><br/>
          {question.instructions.split('\n').map((line, i) => (
            <span key={i}>{line}<br/></span>
          ))}
        </div>
      )}

      <div className="text-[15px] font-medium text-gray-900 mb-4">
        {question.prompt}
      </div>

      {/* Available List Items */}
      {question.listItems.length > 0 && (
        <div className="border-2 border-gray-400 p-4 mb-6">
          <h4 className="text-[15px] font-bold text-gray-900 mb-3 text-center">List of Options</h4>
          <div className="grid gap-2 max-w-xl mx-auto">
            {Object.entries(groupedListItems).map(([category, items]) => (
              <div key={category} className="space-y-2">
                {Object.keys(groupedListItems).length > 1 && (
                  <h5 className="text-[14px] font-bold text-gray-700 mt-2 mb-1">
                    {category}
                  </h5>
                )}
                {items.map((item) => (
                  <div key={item.key} className="flex items-start space-x-3">
                    <span className="text-[15px] font-bold text-gray-900 min-w-[24px] text-right">
                      {item.key}
                    </span>
                    <span className="text-[15px] text-gray-800">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statement Matching */}
      <div className="space-y-6">
        {question.statements.map((statement, index) => (
          <div key={statement.key} className="flex items-start justify-between border-b border-gray-200 pb-4 last:border-0">
            <div className="flex items-start space-x-4 flex-1 pr-6">
              <div className="text-[15px] font-bold text-gray-900 w-8 pt-1">
                {questionNumber + index}
              </div>
              <div className="text-[15px] text-gray-800 leading-relaxed pt-1">
                {statement.text}
              </div>
            </div>
            
            <div className="w-24 flex-shrink-0">
              <select
                value={answers[statement.key] || ''}
                onChange={(e) => handleAnswerChange(statement.key, e.target.value)}
                className="w-full px-2 py-1.5 border-2 border-gray-400 focus:outline-none focus:border-blue-600 bg-white font-bold text-center"
              >
                <option value=""></option>
                {Object.entries(groupedListItems).map(([category, items]) => (
                  <optgroup key={category} label={category}>
                    {items.map((item) => (
                      <option 
                        key={item.key} 
                        value={item.key}
                      >
                        {item.key}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-600 mt-4 border-t border-gray-300 pt-4">
        <strong>Tip:</strong> Match each statement to the most appropriate option from the list.
      </div>
    </div>
  )
}