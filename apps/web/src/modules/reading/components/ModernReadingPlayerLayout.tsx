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
import { QuestionNavigation } from "@/components/exam/QuestionNavigation";
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
// Passage renderer with proper highlight containment
// ─────────────────────────────────────────────────────────────────────────────

const PassageRenderer = memo(function PassageRenderer({
  section,
  onContextMenu,
  onClick,
}: {
  section: ReadingSection;
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div className="h-full overflow-y-auto bg-white ielts-scrollbar">
      <article
        className="p-6 ielts-passage max-w-none"
        dangerouslySetInnerHTML={{ __html: section.passage.contentHtml }}
        onContextMenu={onContextMenu}
        onClick={onClick}
        style={{ userSelect: 'text' }}
      />
    </div>
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
  value: string;
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
        : selected;
    onChange(JSON.stringify(next));
  };

  return (
    <div className="space-y-2">
      {question.options.map((opt) => {
        const checked = selected.includes(opt.key);
        return (
          <label
            key={opt.key}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              checked
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={checked}
              onChange={() => toggle(opt.key)}
            />
            <span className="text-sm text-gray-800">{opt.label}</span>
          </label>
        );
      })}
      <div className="text-xs text-gray-500 mt-2">
        Choose {question.chooseCount} options ({selected.length} selected)
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Modern Question Card Component
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
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isCurrent]);

  const isEnhancedType = ["YNNG", "GAP_FILL", "MATCH_HEAD", "MATCH_INFO", "MATCH_FEAT"].includes(question.type);

  return (
    <div
      ref={ref}
      id={`question-${question.number}`}
      className={`border-b border-gray-300 py-6 transition-colors ${
        isCurrent ? "bg-blue-50/30" : "bg-transparent"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start">
        {/* Left side: Question number and type */}
        <div className="w-16 flex-shrink-0 flex flex-col items-center">
          <div className={`w-8 h-8 flex items-center justify-center font-bold text-sm border-2 ${
            isCurrent ? "border-blue-600 bg-blue-600 text-white" : "border-gray-400 bg-white text-gray-700"
          }`}>
            {question.number}
          </div>
        </div>

        {/* Right side: Question content */}
        <div className="flex-1 pr-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              {question.type === "MCQ_MULTIPLE" && (
                <div className="text-xs font-bold text-gray-500 mb-1 uppercase">
                  Choose {(question as McqMultipleQuestion).chooseCount}
                </div>
              )}
            </div>
            
            {/* Flag button (authentic style) */}
            <button
              type="button"
              className="flex items-center space-x-1 text-xs font-semibold text-gray-500 hover:text-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFlag();
              }}
            >
              <span className={`w-4 h-4 inline-flex items-center justify-center rounded-full border ${isFlagged ? "bg-gray-800 border-gray-800 text-white" : "border-gray-400"}`}>
                {isFlagged ? "✓" : ""}
              </span>
              <span>Review</span>
            </button>
          </div>

          {!isEnhancedType && (
            <p className="text-[15px] font-medium text-gray-900 mb-4">{question.prompt}</p>
          )}

          <div onClick={(e) => e.stopPropagation()} className="ielts-question-content">
            {question.type === "YNNG" && (
              <YnngQuestionComponent question={question} questionNumber={question.number} />
            )}
            {question.type === "GAP_FILL" && (
              <GapFillQuestionComponent question={question} questionNumber={question.number} />
            )}
            {question.type === "MATCH_HEAD" && (
              <MatchHeadQuestionComponent question={question} questionNumber={question.number} />
            )}
            {question.type === "MATCH_INFO" && (
              <MatchInfoQuestionComponent question={question} questionNumber={question.number} />
            )}
            {question.type === "MATCH_FEAT" && (
              <MatchFeatQuestionComponent question={question} questionNumber={question.number} />
            )}
            {/* Legacy types */}
            {question.type === "MCQ_SINGLE" && (
              <div className="space-y-3">
                {question.options.map((opt) => (
                  <label
                    key={opt.key}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      value === opt.key ? "border-blue-600" : "border-gray-400 group-hover:border-blue-400"
                    }`}>
                      {value === opt.key && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                    </div>
                    <span className="text-[15px] text-gray-800">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === "MCQ_MULTIPLE" && (
              <McqMultipleCard
                question={question as McqMultipleQuestion}
                value={value}
                onChange={onChange}
              />
            )}

            {question.type === "TFNG" && (
              <div className="flex flex-col space-y-2">
                {question.options.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      value === opt ? "border-blue-600" : "border-gray-400 group-hover:border-blue-400"
                    }`}>
                      {value === opt && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                    </div>
                    <span className="text-[15px] font-semibold text-gray-800">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === "FILL_BLANK" && (
              <input
                type="text"
                value={value}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                className="w-full max-w-sm px-3 py-2 border-2 border-gray-400 focus:outline-none focus:border-blue-600"
                placeholder=""
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Modern Reading Player Layout
// ─────────────────────────────────────────────────────────────────────────────

interface ModernReadingPlayerLayoutProps {
  sections: ReadingSection[];
  questionGroups: QuestionGroup[];
  questions: ReadingQuestion[];
}

export function ModernReadingPlayerLayout({
  sections,
  questionGroups,
  questions,
}: ModernReadingPlayerLayoutProps) {
  const {
    state,
    setCurrentQuestion,
    setAnswer,
    toggleFlag,
    markVisited,
    setRemainingSeconds,
    setStatus,
  } = useExamSessionStore();

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isTimerHidden, setIsTimerHidden] = useState(false);

  const currentSection = sections[currentSectionIndex];

  // Early return if state is not available yet
  if (!state) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  const [selectedNote, setSelectedNote] = useState<{ x: number; y: number; content: string } | null>(null);

  // Text highlighting
  const {
    notes,
    contextMenu,
    openContextMenu,
    copySelectedText,
    addHighlightFromContextMenu,
    addNoteFromContextMenu,
    clearContextSelection,
  } = useTextHighlight({
    attemptId: state.attemptId,
    sectionId: currentSection.id,
    onPersistHighlight: async (h) => {
      console.log('Highlight added:', h);
    },
    onPersistNote: async (n) => {
      console.log('Note added:', n);
    },
  });

  const passageRef = useRef<HTMLDivElement>(null);

  // Close context menu on outside click
  useEffect(() => {
    const handler = () => {
      clearContextSelection();
      setSelectedNote(null);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [clearContextSelection]);

  // Handle right-click context menu for highlighting
  const handlePassageContextMenu = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (passageRef.current) {
      openContextMenu(event, passageRef.current);
    }
  }, [openContextMenu]);

  // Handle clicking on a note
  const handlePassageClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'MARK' && target.classList.contains('highlight-note')) {
      event.stopPropagation();
      const highlightId = target.dataset.highlightId;
      const note = notes.find(n => n.id === highlightId);
      if (note) {
        setSelectedNote({
          x: event.clientX,
          y: event.clientY,
          content: note.content
        });
      }
    } else {
      setSelectedNote(null);
    }
  }, [notes]);

  // Timer auto-submit
  useEffect(() => {
    if (state && state.remainingSeconds <= 0) {
      handleSubmit();
    }
  }, [state?.remainingSeconds]);

  // Handlers
  const handleQuestionSelect = useCallback(
    (questionId: string) => {
      setCurrentQuestion(questionId);
      markVisited(questionId);
    },
    [setCurrentQuestion, markVisited]
  );

  const handleAnswerChange = useCallback(
    (questionId: string, value: string) => {
      if (!state) return;
      
      setAnswer({
        questionId,
        value,
        flagged: state.answersByQuestionId?.[questionId]?.flagged || false,
        visited: true,
        updatedAt: new Date().toISOString(),
      });
    },
    [setAnswer, state?.answersByQuestionId]
  );

  const handleSubmit = useCallback(() => {
    setStatus("SUBMITTED");
    // Implement submission logic
    alert("Exam submitted!");
  }, [setStatus]);

  // Statistics
  const totalQuestions = questions.length;
  const answeredQuestionIds = Object.keys(state.answersByQuestionId || {}).filter(
    (qId) => state.answersByQuestionId?.[qId]?.value
  );
  const answeredCount = answeredQuestionIds.length;
  const flaggedCount = state.flaggedQuestionIds?.length || 0;

  return (
    <div className="h-screen bg-[#E5E5E5] flex flex-col ielts-container overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 px-6 py-2 flex items-center justify-between shadow-sm z-10 relative h-[60px]">
        <div className="flex items-center space-x-6">
          <div className="text-[#333333] font-bold text-xl tracking-tight flex items-center">
            <span className="text-[#E31837] mr-2 text-2xl">IELTS</span> 
            <span className="text-gray-600 font-normal">Reading</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Timer */}
          <div className={`flex flex-col items-center justify-center min-w-[120px] ${isTimerHidden ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-1.5 rounded-full border border-gray-300">
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`text-xl font-mono font-bold tracking-wider ${state.remainingSeconds <= 600 ? 'text-[#E31837]' : 'text-gray-800'}`}>
                {fmtTime(state.remainingSeconds || 0)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 border-l border-gray-300 pl-6">
            <button
              onClick={() => setIsTimerHidden(!isTimerHidden)}
              className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{isTimerHidden ? 'Show' : 'Hide'}</span>
            </button>
            <button
              className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors ml-4"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </button>
            <button
              className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors ml-4"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Help</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - adjusted height to make room for bottom navigation */}
      <div className="flex-1 flex overflow-hidden p-[10px] gap-[10px]" style={{ height: 'calc(100vh - 60px - 60px)' }}>
        {/* Left Panel - Reading Passage */}
        <div className="w-1/2 bg-white flex flex-col shadow-sm border border-gray-300 relative">
          {/* Passage Content */}
          <div ref={passageRef} className="flex-1 overflow-hidden p-8 pt-10 relative">
            <PassageRenderer section={currentSection} onContextMenu={handlePassageContextMenu} onClick={handlePassageClick} />
          </div>
        </div>

        {/* Right Panel - Questions */}
        <div className="w-1/2 bg-white flex flex-col shadow-sm border border-gray-300 relative">
          <div className="flex-1 overflow-y-auto px-8 py-6 ielts-scrollbar bg-white">
            {/* Group questions by sections */}
            {sections.map((section, sectionIndex) => {
              const sectionQuestions = questions.filter(q => q.sectionId === section.id);
              if (sectionQuestions.length === 0 || sectionIndex !== currentSectionIndex) return null;

              const firstQ = sectionQuestions[0]?.number || 1;
              const lastQ = sectionQuestions[sectionQuestions.length - 1]?.number || 1;

              return (
                <div key={section.id} className="space-y-0">
                  <div className="bg-[#EBEBEB] p-4 mb-6 border-l-4 border-blue-600">
                    <h3 className="font-bold text-gray-900 text-lg uppercase tracking-wide">
                      Part {sectionIndex + 1}
                    </h3>
                  </div>

                  {/* Section Questions */}
                  <div className="space-y-0">
                    {sectionQuestions.map((question) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        value={state.answersByQuestionId?.[question.id]?.value || ""}
                        isCurrent={state.currentQuestionId === question.id}
                        isFlagged={state.flaggedQuestionIds?.includes(question.id) || false}
                        onChange={(value) => handleAnswerChange(question.id, value)}
                        onSelect={() => handleQuestionSelect(question.id)}
                        onToggleFlag={() => toggleFlag(question.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Panel */}
      <QuestionNavigation
        questions={questions}
        currentQuestionId={state.currentQuestionId}
        answeredQuestionIds={answeredQuestionIds}
        flaggedQuestionIds={state.flaggedQuestionIds || []}
        onQuestionSelect={handleQuestionSelect}
        currentSectionIndex={currentSectionIndex}
        onSectionChange={setCurrentSectionIndex}
      />

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Test</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to submit your test? You have answered {answeredCount} out of {totalQuestions} questions.
            </p>
            {answeredCount < totalQuestions && (
              <p className="text-amber-600 text-sm mb-4">
                Warning: You have {totalQuestions - answeredCount} unanswered questions.
              </p>
            )}
            <div className="flex space-x-3">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Submit Test
              </button>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Highlight Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={addHighlightFromContextMenu}
            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
          >
            🖍️ Highlight
          </button>
          <button
            onClick={copySelectedText}
            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
          >
            📋 Copy
          </button>
          <button
            onClick={() => {
              const note = prompt('Add a note:');
              if (note) addNoteFromContextMenu(note);
            }}
            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
          >
            📝 Add Note
          </button>
        </div>
      )}

      {/* Selected Note Tooltip */}
      {selectedNote && (
        <div
          className="fixed bg-[#fffcf0] border border-[#fef08a] rounded-lg shadow-lg p-4 z-50 max-w-sm"
          style={{ top: selectedNote.y + 10, left: selectedNote.x + 10 }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-bold text-gray-800">Note</h4>
            <button 
              onClick={() => setSelectedNote(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {selectedNote.content}
          </p>
        </div>
      )}
    </div>
  );
}