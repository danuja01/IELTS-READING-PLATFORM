'use client'

import { MatchInfoQuestion } from '@/types/exam'
import { useExamSession } from '@/modules/exam-engine/hooks/useExamSession'

interface MatchInfoQuestionProps {
  question: MatchInfoQuestion
  questionNumber: number
}

export function MatchInfoQuestionComponent({ question, questionNumber }: MatchInfoQuestionProps) {
  const { snapshot, updateAnswer } = useExamSession()
  const answer = snapshot.answersByQuestionId[question.id]
  const answers = (answer?.value as Record<string, string>) || {}

  const handleAnswerChange = (statementKey: string, paragraphKey: string) => {
    const updatedAnswers = { ...answers, [statementKey]: paragraphKey }
    updateAnswer(question.id, updatedAnswers)
  }

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

      {/* Available Paragraphs */}
      {question.paragraphOptions.length > 0 && (
        <div className="border-2 border-gray-400 p-4 mb-6">
          <h4 className="text-[15px] font-bold text-gray-900 mb-3 text-center">Paragraphs</h4>
          <div className="grid gap-2 max-w-xl mx-auto">
            {question.paragraphOptions.map((paragraph) => (
              <div key={paragraph.key} className="flex items-start space-x-3">
                <span className="text-[15px] font-bold text-gray-900 min-w-[24px] text-right">
                  {paragraph.key}
                </span>
                <span className="text-[15px] text-gray-800">
                  {paragraph.label}
                </span>
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
                {question.paragraphOptions.map((paragraph) => (
                  <option 
                    key={paragraph.key} 
                    value={paragraph.key}
                  >
                    {paragraph.key}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-600 mt-4 border-t border-gray-300 pt-4">
        <strong>Tip:</strong> Match each statement to the paragraph where the information is found.
      </div>
    </div>
  )
}