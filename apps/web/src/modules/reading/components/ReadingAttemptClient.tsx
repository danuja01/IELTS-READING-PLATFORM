"use client";

import { saveAttemptProgress } from "@/lib/exam/persistence";
import { useAttemptCountdown } from "@/modules/exam-engine/hooks/useAttemptCountdown";
import {
  ExamSessionProvider,
  useExamSessionStore,
} from "@/modules/exam-engine/store/useExamSessionStore";
import { ReadingPlayerLayout } from "@/modules/reading/components/ReadingPlayerLayout";
import { readingTest001 } from "@/modules/reading/data/readingTest001";
import type { ExamAttemptSnapshot } from "@/types/exam";

function ReadingAttemptRuntime() {
  useAttemptCountdown();
  const { state } = useExamSessionStore();

  return (
    <ReadingPlayerLayout
      attemptId={state.attemptId}
      sections={readingTest001.sections}
      questionGroups={readingTest001.questionGroups}
      questions={readingTest001.questions}
    />
  );
}

export function ReadingAttemptClient({
  initialSnapshot,
}: {
  initialSnapshot: ExamAttemptSnapshot;
}) {
  return (
    <ExamSessionProvider
      initialSnapshot={initialSnapshot}
      persistence={{ saveProgress: saveAttemptProgress }}
    >
      <ReadingAttemptRuntime />
    </ExamSessionProvider>
  );
}

export default ReadingAttemptClient;
