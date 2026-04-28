"use client";

export type QuestionNavStatus = "ANSWERED" | "UNANSWERED" | "FLAGGED";

export interface QuestionNavigatorProps {
  questionNumbers: number[];
  answeredNumbers: Set<number>;
  flaggedNumbers: Set<number>;
  currentQuestionNumber?: number;
  onSelectQuestion: (questionNumber: number) => void;
}

function getQuestionStatus(
  questionNumber: number,
  answeredNumbers: Set<number>,
  flaggedNumbers: Set<number>,
): QuestionNavStatus {
  if (flaggedNumbers.has(questionNumber)) {
    return "FLAGGED";
  }
  if (answeredNumbers.has(questionNumber)) {
    return "ANSWERED";
  }
  return "UNANSWERED";
}

function getButtonClass(status: QuestionNavStatus, isActive: boolean) {
  const classes = ["h-9 w-9 rounded border text-xs font-medium transition"];
  if (isActive) {
    classes.push("ring-2 ring-indigo-400 ring-offset-1");
  }
  if (status === "UNANSWERED") {
    classes.push("border-slate-300 bg-white text-slate-700 hover:bg-slate-50");
  } else if (status === "ANSWERED") {
    classes.push("border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-600");
  } else {
    classes.push("border-amber-700 bg-amber-600 text-white hover:bg-amber-500");
  }
  return classes.join(" ");
}

export function QuestionNavigator({
  questionNumbers,
  answeredNumbers,
  flaggedNumbers,
  currentQuestionNumber,
  onSelectQuestion,
}: QuestionNavigatorProps) {
  return (
    <div className="border-t border-slate-200 bg-slate-50 px-3 py-2">
      <div className="mb-2 flex items-center gap-4 text-xs text-slate-600">
        <span>Answered</span>
        <span>Unanswered</span>
        <span>Flagged</span>
      </div>
      <div className="grid grid-cols-10 gap-2 md:grid-cols-20">
        {questionNumbers.map((questionNumber) => {
          const status = getQuestionStatus(questionNumber, answeredNumbers, flaggedNumbers);
          return (
            <button
              key={questionNumber}
              type="button"
              className={getButtonClass(status, currentQuestionNumber === questionNumber)}
              onClick={() => onSelectQuestion(questionNumber)}
              aria-label={`Go to question ${questionNumber}`}
            >
              {questionNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}
