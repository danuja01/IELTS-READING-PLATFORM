'use client'

import { YnngQuestion } from '@/types/exam'
import { useExamSession } from '@/modules/exam-engine/hooks/useExamSession'

interface YnngQuestionProps {
  question: YnngQuestion
  questionNumber: number
}

export function YnngQuestionComponent({ question, questionNumber }: YnngQuestionProps) {
  const { snapshot, updateAnswer } = useExamSession()
  const answer = snapshot.answersByQuestionId[question.id]

  const handleAnswerChange = (value: string) => {
    updateAnswer(question.id, value)
  }

  // Check if this is the first question in the YNNG group (show instructions)
  const isFirstInGroup = questionNumber === 5 // Assuming Q5 is first YNNG question

  return (
    <div className="space-y-4">
      {isFirstInGroup && (
        <div className="text-[15px] text-gray-800 bg-[#EBEBEB] p-4 font-medium mb-6">
          <strong>Questions 5-7</strong><br/><br/>
          Do the following statements agree with the views of the writer?<br/><br/>
          Write:<br/>
          <strong>YES</strong> if the statement agrees with the views of the writer<br/>
          <strong>NO</strong> if the statement contradicts the views of the writer<br/>
          <strong>NOT GIVEN</strong> if it is impossible to say what the writer thinks about this.
        </div>
      )}
      
      <div className="text-[15px] font-medium text-gray-900 mb-4">
        {question.prompt}
      </div>

      <div className="flex flex-col space-y-2">
        {question.options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              answer?.value === option ? "border-blue-600" : "border-gray-400 group-hover:border-blue-400"
            }`}>
              {answer?.value === option && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
            </div>
            <span className="text-[15px] font-semibold text-gray-800">{option}</span>
          </label>
        ))}
      </div>
    </div>
  )
}