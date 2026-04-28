import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ExamAttemptSnapshot } from "@/types/exam";

export async function PATCH(
  request: Request,
  { params }: { params: { attemptId: string } },
) {
  const payload = (await request.json()) as ExamAttemptSnapshot;
  const supabase = getSupabaseServerClient();

  const { error: attemptError } = await supabase
    .from("exam_attempts")
    .update({
      remaining_seconds: payload.remainingSeconds,
      status: payload.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.attemptId);

  if (attemptError) {
    return NextResponse.json({ error: attemptError.message }, { status: 500 });
  }

  for (const answer of Object.values(payload.answersByQuestionId)) {
    const { error } = await supabase.from("exam_attempt_answers").upsert({
      attempt_id: params.attemptId,
      question_id: answer.questionId,
      answer: answer.value,
      flagged: answer.flagged,
      visited: answer.visited,
      answered_at: answer.updatedAt,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
