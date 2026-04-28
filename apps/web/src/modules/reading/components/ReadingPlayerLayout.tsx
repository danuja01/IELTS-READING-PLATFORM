"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useExamSessionStore } from "@/modules/exam-engine/store/useExamSessionStore";
import { useTextHighlight } from "@/modules/reading/hooks/useTextHighlight";
import {
  YnngQuestionComponent,
  GapFillQuestionComponent,
  MatchHeadQuestionComponent,
  MatchInfoQuestionComponent,
  MatchFeatQuestionComponent,
} from "@/components/exam/questions";
import type {
  McqMultipleQuestion,
  QuestionGroup,
  ReadingQuestion,
  ReadingSection,
} from "@/types/exam";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function fmtTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Passage renderer
// ─────────────────────────────────────────────────────────────────────────────

// Memoised so that React never replaces the DOM node (preserves <mark> elements
// applied directly to the DOM by useTextHighlight).
const PassageRenderer = memo(function PassageRenderer({
  section,
}: {
  section: ReadingSection;
}) {
  return (
    <article
      className="ielts-passage max-w-none font-ielts"
      dangerouslySetInnerHTML={{ __html: section.passage.contentHtml }}
    />
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// MCQ_MULTIPLE renderer (Choose TWO)
// ─────────────────────────────────────────────────────────────────────────────

function McqMultipleCard({
  question,
  value,
  onChange,
}: {
  question: McqMultipleQuestion;
  value: string; // JSON string of selected keys
  onChange: (val: string) => void;
}) {
  const selected: string[] = useMemo(() => {
    try {
      return value ? (JSON.parse(value) as string[]) : [];
    } catch {
      return [];
    }
  }, [value]);

  const toggle = (key: string) => {
    const next = selected.includes(key)
      ? selected.filter((k) => k !== key)
      : selected.length < question.chooseCount
        ? [...selected, key]
        : selected; // can't select more
    onChange(JSON.stringify(next));
  };

  return (
    <fieldset className="grid gap-2">
      {question.options.map((opt) => {
        const checked = selected.includes(opt.key);
        return (
          <label
            key={opt.key}
            className={`flex cursor-pointer items-start gap-2 rounded border px-2 py-1.5 text-[13px] text-ielts-text transition-colors ${
              checked
                ? "border-neutral-700 bg-neutral-100 font-medium"
                : "border-transparent hover:border-ielts-border hover:bg-neutral-50"
            }`}
          >
            <input
              type="checkbox"
              className="mt-[2px] h-3.5 w-3.5 shrink-0 accent-neutral-700"
              checked={checked}
              onChange={() => toggle(opt.key)}
            />
            <span>{opt.label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Single question card
// ─────────────────────────────────────────────────────────────────────────────

function QuestionCard({
  question,
  value,
  isCurrent,
  isFlagged,
  onChange,
  onSelect,
  onToggleFlag,
}: {
  question: ReadingQuestion;
  value: string;
  isCurrent: boolean;
  isFlagged: boolean;
  onChange: (v: string) => void;
  onSelect: () => void;
  onToggleFlag: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // auto-scroll into view when selected
  useEffect(() => {
    if (isCurrent && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isCurrent]);

  return (
    <div
      ref={ref}
      id={`question-${question.number}`}
      className={`rounded border p-3 transition-all ${
        isCurrent
          ? "border-neutral-600 shadow-md"
          : "border-ielts-border bg-ielts-panel shadow-sm hover:border-neutral-400"
      } ${isCurrent ? "bg-white" : ""}`}
      onClick={onSelect}
    >
      {/* header row - only show for legacy question types */}
      {!["YNNG", "GAP_FILL", "MATCH_HEAD", "MATCH_INFO", "MATCH_FEAT"].includes(question.type) && (
        <>
          <div className="mb-2 flex items-center gap-2">
            <span className="shrink-0 rounded bg-[#3a3a3a] px-1.5 py-0.5 text-[11px] font-bold text-white">
              {question.number}
            </span>
            {question.type === "MCQ_MULTIPLE" && (
              <span className="text-[10px] font-semibold text-amber-700">
                (Choose {(question as McqMultipleQuestion).chooseCount})
              </span>
            )}
            <button
              type="button"
              title="Flag for review"
              className={`ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-colors ${
                isFlagged
                  ? "border-amber-500 bg-amber-100 text-amber-700"
                  : "border-neutral-300 text-neutral-400 hover:border-amber-400 hover:text-amber-500"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFlag();
              }}
            >
              ⚑
            </button>
          </div>

          <p className="mb-3 text-[13px] leading-snug text-neutral-900">{question.prompt}</p>
        </>
      )}

      {/* Header for new question types with integrated flag button */}
      {["YNNG", "GAP_FILL", "MATCH_HEAD", "MATCH_INFO", "MATCH_FEAT"].includes(question.type) && (
        <div className="mb-2 flex items-center justify-end">
          <button
            type="button"
            title="Flag for review"
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-colors ${
              isFlagged
                ? "border-amber-500 bg-amber-100 text-amber-700"
                : "border-neutral-300 text-neutral-400 hover:border-amber-400 hover:text-amber-500"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFlag();
            }}
          >
            ⚑
          </button>
        </div>
      )}

      {/* MCQ_SINGLE */}
      {question.type === "MCQ_SINGLE" && (
        <fieldset className="grid gap-1.5">
          {question.options.map((opt) => (
            <label
              key={opt.key}
              className={`flex cursor-pointer items-start gap-2 rounded border px-2 py-1.5 text-[13px] text-ielts-text transition-colors ${
                value === opt.key
                  ? "border-neutral-700 bg-neutral-100 font-medium"
                  : "border-transparent hover:border-ielts-border hover:bg-neutral-50"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={opt.key}
                checked={value === opt.key}
                className="mt-[2px] h-3.5 w-3.5 shrink-0 accent-neutral-700"
                onChange={(e) => onChange(e.target.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </fieldset>
      )}

      {/* MCQ_MULTIPLE */}
      {question.type === "MCQ_MULTIPLE" && (
        <McqMultipleCard
          question={question as McqMultipleQuestion}
          value={value}
          onChange={onChange}
        />
      )}

      {/* TRUE / FALSE / NOT GIVEN */}
      {question.type === "TFNG" && (
        <fieldset className="flex gap-2">
          {question.options.map((opt) => (
            <label
              key={opt}
              className={`flex cursor-pointer items-center gap-1.5 rounded border px-2 py-1.5 text-[12px] font-semibold transition-colors ${
                value === opt
                  ? "border-neutral-700 bg-neutral-700 text-white"
                  : "border-ielts-border text-ielts-text hover:bg-neutral-50"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={opt}
                checked={value === opt}
                className="sr-only"
                onChange={(e) => onChange(e.target.value)}
              />
              {opt}
            </label>
          ))}
        </fieldset>
      )}

      {/* FILL_BLANK (legacy - keeping for backward compatibility) */}
      {question.type === "FILL_BLANK" && (
        <input
          type="text"
          value={value}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          className="w-full rounded border border-ielts-border bg-white px-2 py-1.5 text-[13px] shadow-inner outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600"
          placeholder={
            question.maxWords ? `One word only` : "Type your answer"
          }
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {/* New question types with enhanced components */}
      {question.type === "YNNG" && (
        <div className="mt-2" onClick={(e) => e.stopPropagation()}>
          <YnngQuestionComponent 
            question={question} 
            questionNumber={question.number}
          />
        </div>
      )}

      {question.type === "GAP_FILL" && (
        <div className="mt-2" onClick={(e) => e.stopPropagation()}>
          <GapFillQuestionComponent 
            question={question} 
            questionNumber={question.number}
          />
        </div>
      )}

      {question.type === "MATCH_HEAD" && (
        <div className="mt-2" onClick={(e) => e.stopPropagation()}>
          <MatchHeadQuestionComponent 
            question={question} 
            questionNumber={question.number}
          />
        </div>
      )}

      {question.type === "MATCH_INFO" && (
        <div className="mt-2" onClick={(e) => e.stopPropagation()}>
          <MatchInfoQuestionComponent 
            question={question} 
            questionNumber={question.number}
          />
        </div>
      )}

      {question.type === "MATCH_FEAT" && (
        <div className="mt-2" onClick={(e) => e.stopPropagation()}>
          <MatchFeatQuestionComponent 
            question={question} 
            questionNumber={question.number}
          />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer question number strip
// ─────────────────────────────────────────────────────────────────────────────

function FooterStrip({
  questions,
  answeredIds,
  flaggedIds,
  currentId,
  onSelect,
}: {
  questions: ReadingQuestion[];
  answeredIds: Set<string>;
  flaggedIds: Set<string>;
  currentId: string | null;
  onSelect: (q: ReadingQuestion) => void;
}) {
  // Map question id -> number for stable rendering
  return (
    <div className="flex gap-0.5 overflow-x-auto py-0.5">
      {Array.from({ length: 40 }, (_, i) => {
        const n = i + 1;
        // find question with this number
        const q = questions.find((x) => x.number === n);
        if (!q) {
          return (
            <div
              key={n}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-neutral-300 bg-neutral-100 text-[11px] text-neutral-400"
            >
              {n}
            </div>
          );
        }
        const flagged = flaggedIds.has(q.id);
        const answered = answeredIds.has(q.id);
        const active = currentId === q.id;
        return (
          <button
            key={n}
            type="button"
            title={`Question ${n}${answered ? " (answered)" : ""}${flagged ? " (flagged)" : ""}`}
            onClick={() => onSelect(q)}
            className={`relative flex h-7 w-7 shrink-0 items-center justify-center border text-[11px] font-semibold transition-colors
              ${flagged ? "rounded-full border-amber-500 bg-amber-100 text-amber-800" : "rounded-sm border-neutral-600 bg-white text-neutral-800"}
              ${active ? "ring-2 ring-[#3a3a3a] ring-offset-1" : "hover:bg-neutral-100"}
            `}
          >
            {n}
            {answered && !flagged && (
              <span className="absolute bottom-0 left-0.5 right-0.5 h-[2px] bg-neutral-800" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Submit confirmation modal
// ─────────────────────────────────────────────────────────────────────────────

function SubmitModal({
  totalAnswered,
  totalFlagged,
  totalQuestions,
  onConfirm,
  onCancel,
}: {
  totalAnswered: number;
  totalFlagged: number;
  totalQuestions: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[360px] rounded border-2 border-neutral-500 bg-white p-6 shadow-2xl">
        <h2 className="mb-3 text-[15px] font-bold text-neutral-900">
          Are you sure you want to submit?
        </h2>
        <div className="mb-4 space-y-1 text-[13px] text-neutral-700">
          <p>
            Answered:{" "}
            <span className="font-bold text-neutral-900">{totalAnswered}</span> of {totalQuestions}
          </p>
          {totalFlagged > 0 && (
            <p>
              Flagged for review:{" "}
              <span className="font-bold text-amber-700">{totalFlagged}</span>
            </p>
          )}
          {totalAnswered < totalQuestions && (
            <p className="text-red-600">
              ⚠ You have {totalQuestions - totalAnswered} unanswered question(s).
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded border border-neutral-800 bg-neutral-800 py-2 text-[13px] font-semibold text-white hover:bg-neutral-700"
          >
            Submit Test
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded border border-neutral-400 py-2 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main ReadingPlayerLayout
// ─────────────────────────────────────────────────────────────────────────────

export function ReadingPlayerLayout({
  attemptId,
  sections,
  questionGroups,
  questions,
}: {
  attemptId: string;
  sections: ReadingSection[];
  questionGroups: QuestionGroup[];
  questions: ReadingQuestion[];
}) {
  const { state, setAnswer, toggleFlag, setCurrentQuestion } = useExamSessionStore();

  const [isTimerHidden, setIsTimerHidden] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [pendingNote, setPendingNote] = useState("");
  const passageRef = useRef<HTMLDivElement | null>(null);
  const questionsRef = useRef<HTMLDivElement | null>(null);

  // Sorted questions list
  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => a.number - b.number),
    [questions],
  );

  // Derive current question and section
  const currentQuestion = useMemo(
    () =>
      sortedQuestions.find((q) => q.id === state.currentQuestionId) ??
      sortedQuestions[0],
    [sortedQuestions, state.currentQuestionId],
  );

  const activeSectionId = currentQuestion?.sectionId ?? sections[0].id;
  const activeSection = sections.find((s) => s.id === activeSectionId) ?? sections[0];
  const activeGroups = questionGroups.filter((g) => g.sectionId === activeSection.id);

  // Highlights / notes hook
  const {
    contextMenu,
    openContextMenu,
    copySelectedText,
    addHighlightFromContextMenu,
    addNoteFromContextMenu,
    clearContextSelection,
  } = useTextHighlight({
    attemptId,
    sectionId: activeSection.id,
    onPersistHighlight: async (h) => {
      // persist via store / API if needed
    },
    onPersistNote: async (n) => {
      // persist via store / API if needed
    },
  });

  // Close context menu on outside click
  useEffect(() => {
    const handler = () => clearContextSelection();
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [clearContextSelection]);

  // Compute answered / flagged sets
  const answeredIds = useMemo(() => {
    const ids = new Set<string>();
    for (const q of questions) {
      const raw = state.answersByQuestionId[q.id]?.value;
      if (raw == null) continue;
      if (typeof raw === "string") {
        if (!raw.trim()) continue;
        // MCQ_MULTIPLE: check non-empty array
        if (q.type === "MCQ_MULTIPLE") {
          try {
            const arr = JSON.parse(raw) as string[];
            if (arr.length > 0) ids.add(q.id);
          } catch {
            /* no-op */
          }
        } else {
          ids.add(q.id);
        }
      } else if (Array.isArray(raw) && raw.length > 0) {
        ids.add(q.id);
      }
    }
    return ids;
  }, [questions, state.answersByQuestionId]);

  const flaggedIds = useMemo(
    () => new Set(state.flaggedQuestionIds),
    [state.flaggedQuestionIds],
  );

  // Navigation helpers
  const navigateTo = useCallback(
    (q: ReadingQuestion) => {
      setCurrentQuestion(q.id);
    },
    [setCurrentQuestion],
  );

  const navigatePrev = () => {
    const idx = sortedQuestions.findIndex((q) => q.id === currentQuestion?.id);
    if (idx > 0) navigateTo(sortedQuestions[idx - 1]);
  };

  const navigateNext = () => {
    const idx = sortedQuestions.findIndex((q) => q.id === currentQuestion?.id);
    if (idx < sortedQuestions.length - 1) navigateTo(sortedQuestions[idx + 1]);
  };

  // Timer colours
  const timerWarning = state.remainingSeconds <= 600;
  const timerCritical = state.remainingSeconds <= 300;

  // When currentQuestion changes, reset passage scroll to top for new section
  const prevSectionRef = useRef(activeSectionId);
  useEffect(() => {
    if (prevSectionRef.current !== activeSectionId) {
      passageRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      prevSectionRef.current = activeSectionId;
    }
  }, [activeSectionId]);

  // Prevent default browser context menu on passage; we use our own
  const handlePassageContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    const node = passageRef.current;
    if (node) {
      openContextMenu(e, node);
    }
  };

  // Section label
  const sectionLabel = `Reading Passage ${activeSection.order}`;

  return (
    <div className="flex h-[100dvh] min-h-[100dvh] flex-col overflow-hidden bg-ielts-shell font-ielts text-[13px] text-ielts-text">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="flex h-11 shrink-0 items-stretch border-b border-black/40 bg-ielts-header text-white">
        {/* Logo */}
        <div className="flex w-48 shrink-0 items-center border-r border-white/20 px-4 text-[13px] font-bold tracking-[0.25em]">
          IELTS
        </div>

        {/* Timer */}
        <div className="flex flex-1 items-center justify-center gap-2">
          {!isTimerHidden && (
            <svg className="h-4 w-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" strokeLinecap="round" />
            </svg>
          )}
          <span
            className={`text-[13px] font-bold tabular-nums ${
              timerCritical
                ? "text-red-300"
                : timerWarning
                  ? "text-yellow-200"
                  : "text-white"
            }`}
          >
            {isTimerHidden ? "Timer hidden" : `Time remaining: ${fmtTime(state.remainingSeconds)}`}
          </span>
          <button
            type="button"
            className="ml-2 rounded border border-white/30 bg-white/10 px-2 py-0.5 text-[11px] font-medium hover:bg-white/20"
            onClick={() => setIsTimerHidden((v) => !v)}
          >
            {isTimerHidden ? "Show" : "Hide"}
          </button>
        </div>

        {/* Submit */}
        <div className="flex shrink-0 items-center border-l border-white/20 px-3">
          <button
            type="button"
            className="rounded border border-white/40 bg-white/15 px-3 py-1 text-[12px] font-semibold text-white hover:bg-white/25"
            onClick={() => setShowSubmitModal(true)}
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* ── Section tabs ──────────────────────────────────── */}
      <div className="flex h-8 shrink-0 items-stretch border-b border-neutral-400 bg-[#d0d0d0]">
        {sections.map((s) => {
          const active = s.id === activeSection.id;
          const firstQ = sortedQuestions.find((q) => q.sectionId === s.id);
          return (
            <button
              key={s.id}
              type="button"
              className={`border-r border-neutral-400 px-4 text-[12px] font-semibold transition-colors ${
                active
                  ? "bg-white text-neutral-900"
                  : "text-neutral-600 hover:bg-neutral-200"
              }`}
              onClick={() => {
                if (firstQ) navigateTo(firstQ);
              }}
            >
              Passage {s.order}
            </button>
          );
        })}
        <div className="flex flex-1 items-center px-3 text-[11px] font-medium text-neutral-600">
          {activeSection.title}
        </div>
      </div>

      {/* ── Main 50/50 split ──────────────────────────────── */}
      <main className="grid min-h-0 flex-1 grid-cols-2 divide-x divide-ielts-border">
        {/* Passage pane */}
        <section className="flex min-h-0 flex-col bg-white">
          <div className="shrink-0 border-b border-ielts-border bg-[#eaeaea] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
            {sectionLabel}
          </div>
          <div
            ref={passageRef}
            className="min-h-0 flex-1 overflow-y-auto px-5 py-4"
            onContextMenu={handlePassageContextMenu}
          >
            <PassageRenderer section={activeSection} />
          </div>
        </section>

        {/* Questions pane */}
        <section className="flex min-h-0 flex-col bg-[#f5f5f5]">
          <div className="shrink-0 border-b border-ielts-border bg-[#eaeaea] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
            Questions {activeGroups[0]?.questionIds[0] && sortedQuestions.find((q) => q.id === activeGroups[0]?.questionIds[0])?.number}
            {activeGroups.length > 0 && ` – ${
              (() => {
                const lastGroup = activeGroups[activeGroups.length - 1];
                const lastId = lastGroup.questionIds[lastGroup.questionIds.length - 1];
                return sortedQuestions.find((q) => q.id === lastId)?.number ?? "";
              })()
            }`}
          </div>
          <div ref={questionsRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
            <div className="space-y-5">
              {activeGroups.map((group) => {
                const groupQuestions = sortedQuestions.filter((q) =>
                  group.questionIds.includes(q.id),
                );
                return (
                  <div key={group.id}>
                    {/* Group header */}
                    <div className="mb-3 rounded border border-ielts-border bg-white px-3 py-2 shadow-sm">
                      <p className="text-[12px] font-bold text-neutral-800">{group.title}</p>
                      <p className="mt-1 whitespace-pre-line text-[12px] leading-snug text-neutral-700">
                        {group.instructions}
                      </p>
                    </div>
                    {/* Questions */}
                    <div className="space-y-2">
                      {groupQuestions.map((q) => {
                        const rawVal = state.answersByQuestionId[q.id]?.value;
                        const val =
                          typeof rawVal === "string"
                            ? rawVal
                            : Array.isArray(rawVal)
                              ? JSON.stringify(rawVal)
                              : "";
                        return (
                          <QuestionCard
                            key={q.id}
                            question={q}
                            value={val}
                            isCurrent={q.id === state.currentQuestionId}
                            isFlagged={flaggedIds.has(q.id)}
                            onSelect={() => navigateTo(q)}
                            onToggleFlag={() => toggleFlag(q.id)}
                            onChange={(next) => {
                              navigateTo(q);
                              setAnswer({
                                questionId: q.id,
                                value: next,
                                flagged: flaggedIds.has(q.id),
                                visited: true,
                                updatedAt: new Date().toISOString(),
                              });
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="shrink-0 border-t-2 border-neutral-400 bg-ielts-footer px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <div className="flex items-center gap-2">
          {/* Flag checkbox */}
          <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-[11px] font-semibold text-neutral-700">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 accent-neutral-700"
              checked={Boolean(currentQuestion && flaggedIds.has(currentQuestion.id))}
              onChange={() => {
                if (currentQuestion) toggleFlag(currentQuestion.id);
              }}
            />
            Review
          </label>

          {/* Number strip */}
          <div className="min-w-0 flex-1">
            <FooterStrip
              questions={sortedQuestions}
              answeredIds={answeredIds}
              flaggedIds={flaggedIds}
              currentId={state.currentQuestionId}
              onSelect={(q) => {
                navigateTo(q);
                setTimeout(() => {
                  document
                    .getElementById(`question-${q.number}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }, 80);
              }}
            />
          </div>

          {/* Prev / Next */}
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              className="h-7 w-9 rounded border border-ielts-border bg-white text-sm font-bold text-neutral-700 shadow-sm hover:bg-neutral-50 disabled:opacity-40"
              onClick={navigatePrev}
              disabled={
                !currentQuestion ||
                sortedQuestions[0]?.id === currentQuestion.id
              }
            >
              ‹
            </button>
            <button
              type="button"
              className="h-7 w-9 rounded border border-ielts-border bg-white text-sm font-bold text-neutral-700 shadow-sm hover:bg-neutral-50 disabled:opacity-40"
              onClick={navigateNext}
              disabled={
                !currentQuestion ||
                sortedQuestions[sortedQuestions.length - 1]?.id ===
                  currentQuestion.id
              }
            >
              ›
            </button>
          </div>
        </div>
        {/* Legend */}
        <div className="mt-1 flex items-center gap-4 text-[10px] text-neutral-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm border border-neutral-600 bg-white" />
            Not answered
          </span>
          <span className="flex items-center gap-1">
            <span className="relative inline-block h-3 w-3 rounded-sm border border-neutral-600 bg-white">
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-800" />
            </span>
            Answered
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full border border-amber-500 bg-amber-100" />
            Flagged
          </span>
        </div>
      </footer>

      {/* ── Right-click context menu ───────────────────────── */}
      {contextMenu && (
        <div
          className="fixed z-50 min-w-[210px] rounded border border-neutral-400 bg-white py-1 shadow-2xl"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          // Stop propagation so the document click handler doesn't immediately close this
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {/* selected text preview */}
          <div className="border-b border-neutral-100 px-3 py-1.5">
            <p className="max-w-[180px] truncate text-[11px] italic text-neutral-400">
              "{contextMenu.selectedText}"
            </p>
          </div>

          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium text-neutral-800 hover:bg-yellow-50"
            onClick={() => void addHighlightFromContextMenu()}
          >
            <span className="inline-block h-3 w-3 rounded-sm bg-yellow-300" />
            Highlight
          </button>

          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium text-neutral-800 hover:bg-neutral-100"
            onClick={copySelectedText}
          >
            <span className="text-[13px]">⎘</span>
            Copy
          </button>

          <div className="border-t border-neutral-100 px-3 py-2">
            <textarea
              value={pendingNote}
              onChange={(e) => setPendingNote(e.target.value)}
              rows={2}
              className="w-full rounded border border-neutral-300 px-2 py-1 text-[12px] outline-none focus:border-neutral-500"
              placeholder="Add a note…"
              onMouseDown={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              className="mt-1.5 w-full rounded bg-neutral-800 px-2 py-1 text-[12px] font-semibold text-white hover:bg-neutral-700 disabled:opacity-40"
              disabled={!pendingNote.trim()}
              onClick={() => {
                void addNoteFromContextMenu(pendingNote);
                setPendingNote("");
              }}
            >
              Save Note
            </button>
          </div>

          <button
            type="button"
            className="block w-full border-t border-neutral-100 px-3 py-1.5 text-left text-[11px] text-neutral-400 hover:bg-neutral-50"
            onClick={clearContextSelection}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Submit modal ───────────────────────────────────── */}
      {showSubmitModal && (
        <SubmitModal
          totalAnswered={answeredIds.size}
          totalFlagged={flaggedIds.size}
          totalQuestions={40}
          onConfirm={async () => {
            setShowSubmitModal(false);
            await fetch(`/api/exam/attempts/${attemptId}/submit`, {
              method: "POST",
            });
            window.location.href = "/";
          }}
          onCancel={() => setShowSubmitModal(false)}
        />
      )}
    </div>
  );
}
