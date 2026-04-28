import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    testId: string;
    userId: string;
    durationSeconds?: number;
  };

  const supabase = getSupabaseServerClient();
  const now = new Date().toISOString();
  const durationSeconds = payload.durationSeconds ?? 3600;

  const { data, error } = await supabase
    .from("exam_attempts")
    .insert({
      test_id: payload.testId,
      user_id: payload.userId,
      status: "IN_PROGRESS",
      remaining_seconds: durationSeconds,
      started_at: now,
      updated_at: now,
    })
    .select("id, test_id, user_id, status, remaining_seconds")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    attemptId: data.id,
    testId: data.test_id,
    userId: data.user_id,
    status: data.status,
    remainingSeconds: data.remaining_seconds,
  });
}
