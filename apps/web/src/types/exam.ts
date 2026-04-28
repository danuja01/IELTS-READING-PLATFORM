export type ExamModuleType = "READING" | "LISTENING" | "WRITING" | "SPEAKING";

export type ReadingQuestionType =
  | "MCQ_SINGLE"
  | "MCQ_MULTIPLE"
  | "TFNG"
  | "MATCH_HEADINGS"
  | "FILL_BLANK";

export type QuestionType = ReadingQuestionType;

export interface ParagraphAnchor {
  id: string;
  label: string;
  paragraphIndex: number;
}

export interface PassageContent {
  contentHtml: string;
  contentMarkdown?: string;
}

export interface PassageMapping {
  paragraphAnchors: ParagraphAnchor[];
}

export interface ReadingSection {
  id: string;
  order: number;
  title: string;
  passage: PassageContent;
  mapping: PassageMapping;
}

export interface BaseQuestion {
  id: string;
  number: number;
  sectionId: string;
  groupId: string;
  type: QuestionType;
  prompt: string;
  instructions?: string;
  mapping?: {
    paragraphRefs?: string[];
    textSpans?: Array<{ start: number; end: number }>;
  };
}

export interface McqSingleQuestion extends BaseQuestion {
  type: "MCQ_SINGLE";
  options: Array<{ key: string; label: string }>;
  answerKey: string;
}

// Choose TWO (or N) from a list
export interface McqMultipleQuestion extends BaseQuestion {
  type: "MCQ_MULTIPLE";
  options: Array<{ key: string; label: string }>;
  chooseCount: number;
  answerKeys: string[];
}

export interface TfngQuestion extends BaseQuestion {
  type: "TFNG";
  options: ["TRUE", "FALSE", "NOT GIVEN"];
  answerKey: "TRUE" | "FALSE" | "NOT GIVEN";
}

export interface MatchHeadingsQuestion extends BaseQuestion {
  type: "MATCH_HEADINGS";
  availableHeadings: Array<{ key: string; text: string }>;
  paragraphTargets: Array<{ paragraphLabel: string; slotId: string }>;
  answerHeadingKey: string;
}

export interface FillBlankQuestion extends BaseQuestion {
  type: "FILL_BLANK";
  responseMode: "WORD_LIMIT" | "PHRASE_LIMIT";
  maxWords?: number;
  acceptedAnswers: string[];
}

export type ReadingQuestion =
  | McqSingleQuestion
  | McqMultipleQuestion
  | TfngQuestion
  | MatchHeadingsQuestion
  | FillBlankQuestion;

export interface QuestionGroup {
  id: string;
  sectionId: string;
  title: string;
  instructions: string;
  questionIds: string[];
}

export interface ExamTestContent {
  id: string;
  moduleType: "READING";
  title: string;
  version: number;
  totalQuestions: 40;
  durationSeconds: 3600;
  sections: [ReadingSection, ReadingSection, ReadingSection];
  questionGroups: QuestionGroup[];
  questions: ReadingQuestion[];
}

export type AnswerValue = string | string[];

export interface AttemptAnswer {
  questionId: string;
  value: AnswerValue;
  flagged: boolean;
  visited: boolean;
  updatedAt: string;
}

export type AttemptStatus =
  | "IN_PROGRESS"
  | "SUBMITTING"
  | "SUBMITTED"
  | "TIMED_OUT";

export interface HighlightRange {
  id: string;
  attemptId: string;
  sectionId: string;
  startOffset: number;
  endOffset: number;
  selectedText: string;
  color: "yellow" | "green" | "blue" | "pink";
  createdAt: string;
}

export interface PassageNote {
  id: string;
  attemptId: string;
  sectionId: string;
  startOffset: number;
  endOffset: number;
  selectedText: string;
  content: string;
  createdAt: string;
}

export interface ExamAttemptSnapshot {
  attemptId: string;
  testId: string;
  userId: string;
  status: AttemptStatus;
  remainingSeconds: number;
  currentQuestionId: string | null;
  answersByQuestionId: Record<string, AttemptAnswer>;
  flaggedQuestionIds: string[];
  visitedQuestionIds: string[];
  highlights: HighlightRange[];
  notes: PassageNote[];
  updatedAt: string;
}
