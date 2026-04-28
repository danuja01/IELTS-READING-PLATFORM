export type ExamModuleType = "READING" | "LISTENING" | "WRITING" | "SPEAKING";

export type ReadingQuestionType =
  | "MCQ_SINGLE"
  | "MCQ_MULTIPLE" 
  | "TFNG"
  | "YNNG"
  | "GAP_FILL"
  | "MATCH_HEAD"
  | "MATCH_INFO"
  | "MATCH_FEAT";

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

export interface YnngQuestion extends BaseQuestion {
  type: "YNNG";
  options: ["YES", "NO", "NOT GIVEN"];
  answerKey: "YES" | "NO" | "NOT GIVEN";
}

export interface MatchHeadQuestion extends BaseQuestion {
  type: "MATCH_HEAD";
  availableHeadings: Array<{ key: string; text: string }>;
  paragraphTargets: Array<{ paragraphLabel: string; slotId: string }>;
  answerKeys: Record<string, string>; // { paragraphId: headingKey }
}

export interface MatchInfoQuestion extends BaseQuestion {
  type: "MATCH_INFO";
  statements: Array<{ key: string; text: string }>;
  paragraphOptions: Array<{ key: string; label: string }>;
  answerKeys: Record<string, string>; // { statementKey: paragraphKey }
}

export interface MatchFeatQuestion extends BaseQuestion {
  type: "MATCH_FEAT";
  statements: Array<{ key: string; text: string }>;
  listItems: Array<{ key: string; text: string; category?: string }>;
  answerKeys: Record<string, string>; // { statementKey: listItemKey }
}

export interface GapFillQuestion extends BaseQuestion {
  type: "GAP_FILL";
  text: string; // Text with placeholder markers like {{1}}, {{2}}
  gaps: Array<{
    id: string;
    position: number; // Position in text
    maxWords?: number;
    acceptedAnswers: string[];
    placeholder?: string;
  }>;
  instructions?: string;
}

export type ReadingQuestion =
  | McqSingleQuestion
  | McqMultipleQuestion
  | TfngQuestion
  | YnngQuestion
  | GapFillQuestion
  | MatchHeadQuestion
  | MatchInfoQuestion
  | MatchFeatQuestion;

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
