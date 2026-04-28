import dynamic from "next/dynamic";
import type { ExamAttemptSnapshot } from "@/types/exam";

const ReadingAttemptClient = dynamic(
  () => import("@/modules/reading/components/ReadingAttemptClient"),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-[100dvh] items-center justify-center bg-[#c8c8c8] font-sans text-sm text-neutral-800"
        role="status"
        aria-live="polite"
      >
        Loading test…
      </div>
    ),
  },
);

export default function ReadingAttemptPage({
  params,
}: {
  params: { testId: string };
}) {
  // Replace this bootstrap snapshot with a server fetch from Supabase.
  const initialSnapshot: ExamAttemptSnapshot = {
    attemptId: `attempt_${params.testId}_demo`,
    testId: params.testId,
    userId: "demo-user",
    status: "IN_PROGRESS",
    remainingSeconds: 3600,
    currentQuestionId: null,
    answersByQuestionId: {},
    flaggedQuestionIds: [],
    visitedQuestionIds: [],
    highlights: [],
    notes: [],
    updatedAt: new Date().toISOString(),
  };

  return <ReadingAttemptClient initialSnapshot={initialSnapshot} />;
}
