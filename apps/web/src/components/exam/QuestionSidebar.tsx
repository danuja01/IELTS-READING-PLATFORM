"use client";

import type { ReadingQuestion } from "@/types/exam";

export function QuestionSidebar({
  groups,
  questions,
  onJumpToQuestion,
}: {
  groups: Array<{ id: string; title: string; questionIds: string[] }>;
  questions: ReadingQuestion[];
  onJumpToQuestion: (questionId: string) => void;
}) {
  return (
    <aside className="h-full overflow-y-auto border-r border-slate-200 bg-white p-3">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Question Sections
      </h2>
      <div className="space-y-3">
        {groups.map((group) => (
          <section key={group.id}>
            <h3 className="mb-2 text-sm font-medium text-slate-700">{group.title}</h3>
            <div className="flex flex-wrap gap-1.5">
              {group.questionIds.map((questionId) => {
                const question = questions.find((item) => item.id === questionId);
                if (!question) {
                  return null;
                }
                return (
                  <button
                    key={questionId}
                    type="button"
                    className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                    onClick={() => onJumpToQuestion(questionId)}
                  >
                    {question.number}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
