import { useExamSessionStore } from '../store/useExamSessionStore'
import { AnswerValue } from '@/types/exam'

export function useExamSession() {
  const { state, setAnswer } = useExamSessionStore()

  const updateAnswer = (questionId: string, value: AnswerValue) => {
    setAnswer({
      questionId,
      value,
      flagged: state.answersByQuestionId[questionId]?.flagged || false,
      visited: true,
      updatedAt: new Date().toISOString()
    })
  }

  return {
    snapshot: state, // Keep the same interface for the question components
    updateAnswer
  }
}