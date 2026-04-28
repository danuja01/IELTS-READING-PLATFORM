import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function estimateBandFromRawScore(rawScore: number): number {
  if (rawScore >= 39) return 9.0;
  if (rawScore >= 37) return 8.5;
  if (rawScore >= 35) return 8.0;
  if (rawScore >= 33) return 7.5;
  if (rawScore >= 30) return 7.0;
  if (rawScore >= 27) return 6.5;
  if (rawScore >= 23) return 6.0;
  if (rawScore >= 19) return 5.5;
  return 5.0;
}

export async function POST(
  _request: Request,
  { params }: { params: { attemptId: string } },
) {
  const supabase = getSupabaseServerClient();

  const { data: answers, error: answersError } = await supabase
    .from("exam_attempt_answers")
    .select("answer")
    .eq("attempt_id", params.attemptId);

  if (answersError) {
    return NextResponse.json({ error: answersError.message }, { status: 500 });
  }

  // Placeholder scoring: count non-empty answers for MVP flow.
  // Replace with strict answer-key scoring in the next iteration.
  const rawScore =
    answers?.filter((entry) => {
      const answer = entry.answer;
      if (answer == null) return false;
      if (typeof answer === "string") return answer.trim().length > 0;
      if (Array.isArray(answer)) return answer.length > 0;
      if (typeof answer === "object") return Object.keys(answer).length > 0;
      return false;
    }).length ?? 0;

  const bandScore = estimateBandFromRawScore(rawScore);
  const now = new Date().toISOString();

  const { error: attemptUpdateError } = await supabase
    .from("exam_attempts")
    .update({
      status: "SUBMITTED",
      submitted_at: now,
      remaining_seconds: 0,
      updated_at: now,
    })
    .eq("id", params.attemptId);

  if (attemptUpdateError) {
    return NextResponse.json({ error: attemptUpdateError.message }, { status: 500 });
  }

  const { error: submissionError } = await supabase.from("exam_submissions").upsert({
    attempt_id: params.attemptId,
    raw_score: rawScore,
    band_score: bandScore,
    submitted_at: now,
    breakdown: {
      strategy: "mvp_non_empty_answer_count",
      totalAnswered: rawScore,
    },
  });

  if (submissionError) {
    return NextResponse.json({ error: submissionError.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    rawScore,
    bandScore,
  });
}
