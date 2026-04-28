import type { ExamAttemptSnapshot } from "@/types/exam";

export async function saveAttemptProgress(snapshot: ExamAttemptSnapshot): Promise<void> {
  const response = await fetch(`/api/exam/attempts/${snapshot.attemptId}/progress`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(snapshot),
  });

  if (!response.ok) {
    throw new Error("Failed to save attempt progress");
  }
}

export async function submitAttempt(attemptId: string): Promise<void> {
  const response = await fetch(`/api/exam/attempts/${attemptId}/submit`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to submit attempt");
  }
}
