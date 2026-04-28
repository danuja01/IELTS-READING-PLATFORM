import dynamic from "next/dynamic";
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
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

async function getOrCreateAttempt(testId: string, userId: string) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
      },
    }
  )

  // Get test details first
  const { data: test } = await supabase
    .from('exam_tests')
    .select('id, duration_seconds')
    .eq('slug', testId)
    .eq('status', 'PUBLISHED')
    .single()

  if (!test) {
    throw new Error('Test not found')
  }

  // Check for existing in-progress attempt
  const { data: existingAttempt } = await supabase
    .from('exam_attempts')
    .select('id, remaining_seconds, started_at')
    .eq('test_id', test.id)
    .eq('user_id', userId)
    .eq('status', 'IN_PROGRESS')
    .single()

  if (existingAttempt) {
    return {
      attemptId: existingAttempt.id,
      testId: test.id,
      remainingSeconds: existingAttempt.remaining_seconds
    }
  }

  // Create new attempt
  const { data: newAttempt, error } = await supabase
    .from('exam_attempts')
    .insert({
      test_id: test.id,
      user_id: userId,
      remaining_seconds: test.duration_seconds,
      status: 'IN_PROGRESS'
    })
    .select('id')
    .single()

  if (error || !newAttempt) {
    throw new Error('Failed to create exam attempt')
  }

  return {
    attemptId: newAttempt.id,
    testId: test.id,
    remainingSeconds: test.duration_seconds
  }
}

export default async function ReadingAttemptPage({
  params,
}: {
  params: { testId: string };
}) {
  // Check authentication
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirectTo=' + encodeURIComponent(`/reading/tests/${params.testId}/attempt`))
  }

  try {
    const attemptData = await getOrCreateAttempt(params.testId, user.id)
    
    const initialSnapshot: ExamAttemptSnapshot = {
      attemptId: attemptData.attemptId,
      testId: attemptData.testId,
      userId: user.id,
      status: "IN_PROGRESS",
      remainingSeconds: attemptData.remainingSeconds,
      currentQuestionId: null,
      answersByQuestionId: {},
      flaggedQuestionIds: [],
      visitedQuestionIds: [],
      highlights: [],
      notes: [],
      updatedAt: new Date().toISOString(),
    };

    return <ReadingAttemptClient initialSnapshot={initialSnapshot} />;
  } catch (error) {
    console.error('Error setting up exam attempt:', error)
    redirect('/?error=exam-setup-failed')
  }
}
