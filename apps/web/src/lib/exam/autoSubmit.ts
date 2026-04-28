import type { AttemptStatus } from "@/types/exam";

export interface AutoSubmitContext {
  attemptId: string;
  remainingSeconds: number;
  status: AttemptStatus;
}

export interface AutoSubmitResult {
  nextRemainingSeconds: number;
  shouldSubmit: boolean;
}

export interface AutoSubmitOptions {
  onSubmit: (attemptId: string) => Promise<void>;
  onTick?: (remainingSeconds: number) => void;
  intervalMs?: number;
}

/**
 * Starts a 60-minute countdown cycle and performs an idempotent submit on timeout.
 * The returned cleanup function must be called on component unmount.
 */
export function startAutoSubmitTimer(
  initial: AutoSubmitContext,
  options: AutoSubmitOptions,
): () => void {
  let state = { ...initial };
  let submitInFlight = false;
  const tickIntervalMs = options.intervalMs ?? 1000;

  const tick = async () => {
    if (state.status === "SUBMITTED" || state.status === "TIMED_OUT") {
      return;
    }

    const next = computeNextTimerState(state.remainingSeconds);
    state.remainingSeconds = next.nextRemainingSeconds;
    options.onTick?.(state.remainingSeconds);

    if (!next.shouldSubmit || submitInFlight) {
      return;
    }

    submitInFlight = true;
    try {
      await options.onSubmit(state.attemptId);
      state.status = "TIMED_OUT";
    } finally {
      submitInFlight = false;
    }
  };

  const timerId = setInterval(() => {
    void tick();
  }, tickIntervalMs);

  return () => clearInterval(timerId);
}

export function computeNextTimerState(remainingSeconds: number): AutoSubmitResult {
  const nextRemainingSeconds = Math.max(remainingSeconds - 1, 0);
  return {
    nextRemainingSeconds,
    shouldSubmit: nextRemainingSeconds <= 0,
  };
}
