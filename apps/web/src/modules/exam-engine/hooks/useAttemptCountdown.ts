"use client";

import { useEffect } from "react";
import { startAutoSubmitTimer } from "@/lib/exam/autoSubmit";
import { submitAttempt } from "@/lib/exam/persistence";
import { useExamSessionStore } from "@/modules/exam-engine/store/useExamSessionStore";

export function useAttemptCountdown() {
  const { state, setRemainingSeconds, setStatus } = useExamSessionStore();

  useEffect(() => {
    const stop = startAutoSubmitTimer(
      {
        attemptId: state.attemptId,
        remainingSeconds: state.remainingSeconds,
        status: state.status,
      },
      {
        onTick: (seconds) => setRemainingSeconds(seconds),
        onSubmit: async (attemptId) => {
          setStatus("SUBMITTING");
          await submitAttempt(attemptId);
          setStatus("TIMED_OUT");
        },
      },
    );

    return stop;
  }, [state.attemptId, setRemainingSeconds, setStatus]);
}
