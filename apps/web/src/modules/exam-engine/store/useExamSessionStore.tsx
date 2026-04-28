"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import type {
  AttemptAnswer,
  AttemptStatus,
  ExamAttemptSnapshot,
  HighlightRange,
  PassageNote,
} from "@/types/exam";

const LOCAL_STORAGE_PREFIX = "ielts.exam.attempt";

type SessionState = {
  attemptId: string;
  testId: string;
  status: AttemptStatus;
  remainingSeconds: number;
  currentQuestionId: string | null;
  answersByQuestionId: Record<string, AttemptAnswer>;
  flaggedQuestionIds: string[];
  visitedQuestionIds: string[];
  highlights: HighlightRange[];
  notes: PassageNote[];
  dirty: boolean;
};

type SessionAction =
  | { type: "HYDRATE"; payload: ExamAttemptSnapshot }
  | { type: "SET_CURRENT_QUESTION"; payload: string }
  | { type: "SET_ANSWER"; payload: AttemptAnswer }
  | { type: "TOGGLE_FLAG"; payload: string }
  | { type: "MARK_VISITED"; payload: string }
  | { type: "SET_REMAINING_SECONDS"; payload: number }
  | { type: "ADD_HIGHLIGHT"; payload: HighlightRange }
  | { type: "REMOVE_HIGHLIGHT"; payload: string }
  | { type: "ADD_NOTE"; payload: PassageNote }
  | { type: "REMOVE_NOTE"; payload: string }
  | { type: "SET_STATUS"; payload: AttemptStatus }
  | { type: "SET_DIRTY"; payload: boolean };

function examSessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "HYDRATE":
      return {
        attemptId: action.payload.attemptId,
        testId: action.payload.testId,
        status: action.payload.status,
        remainingSeconds: action.payload.remainingSeconds,
        currentQuestionId: action.payload.currentQuestionId,
        answersByQuestionId: action.payload.answersByQuestionId,
        flaggedQuestionIds: action.payload.flaggedQuestionIds,
        visitedQuestionIds: action.payload.visitedQuestionIds,
        highlights: action.payload.highlights,
        notes: action.payload.notes ?? [],
        dirty: false,
      };
    case "SET_CURRENT_QUESTION":
      return {
        ...state,
        currentQuestionId: action.payload,
        visitedQuestionIds: Array.from(new Set([...state.visitedQuestionIds, action.payload])),
        dirty: true,
      };
    case "SET_ANSWER":
      return {
        ...state,
        answersByQuestionId: {
          ...state.answersByQuestionId,
          [action.payload.questionId]: action.payload,
        },
        dirty: true,
      };
    case "TOGGLE_FLAG": {
      const exists = state.flaggedQuestionIds.includes(action.payload);
      return {
        ...state,
        flaggedQuestionIds: exists
          ? state.flaggedQuestionIds.filter((id) => id !== action.payload)
          : [...state.flaggedQuestionIds, action.payload],
        dirty: true,
      };
    }
    case "MARK_VISITED":
      return {
        ...state,
        visitedQuestionIds: Array.from(new Set([...state.visitedQuestionIds, action.payload])),
        dirty: true,
      };
    case "SET_REMAINING_SECONDS":
      return { ...state, remainingSeconds: action.payload, dirty: true };
    case "ADD_HIGHLIGHT":
      return { ...state, highlights: [...state.highlights, action.payload], dirty: true };
    case "REMOVE_HIGHLIGHT":
      return {
        ...state,
        highlights: state.highlights.filter((highlight) => highlight.id !== action.payload),
        dirty: true,
      };
    case "ADD_NOTE":
      return { ...state, notes: [...state.notes, action.payload], dirty: true };
    case "REMOVE_NOTE":
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
        dirty: true,
      };
    case "SET_STATUS":
      return { ...state, status: action.payload, dirty: true };
    case "SET_DIRTY":
      return { ...state, dirty: action.payload };
    default:
      return state;
  }
}

export interface ExamSessionPersistence {
  saveProgress: (snapshot: ExamAttemptSnapshot) => Promise<void>;
}

interface ExamSessionContextValue {
  state: SessionState;
  setCurrentQuestion: (questionId: string) => void;
  setAnswer: (answer: AttemptAnswer) => void;
  toggleFlag: (questionId: string) => void;
  markVisited: (questionId: string) => void;
  setRemainingSeconds: (seconds: number) => void;
  addHighlight: (highlight: HighlightRange) => void;
  removeHighlight: (highlightId: string) => void;
  addNote: (note: PassageNote) => void;
  removeNote: (noteId: string) => void;
  setStatus: (status: AttemptStatus) => void;
}

const ExamSessionContext = createContext<ExamSessionContextValue | null>(null);

export function ExamSessionProvider({
  initialSnapshot,
  persistence,
  children,
}: {
  initialSnapshot: ExamAttemptSnapshot;
  persistence: ExamSessionPersistence;
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(examSessionReducer, {
    attemptId: initialSnapshot.attemptId,
    testId: initialSnapshot.testId,
    status: initialSnapshot.status,
    remainingSeconds: initialSnapshot.remainingSeconds,
    currentQuestionId: initialSnapshot.currentQuestionId,
    answersByQuestionId: initialSnapshot.answersByQuestionId,
    flaggedQuestionIds: initialSnapshot.flaggedQuestionIds,
    visitedQuestionIds: initialSnapshot.visitedQuestionIds,
    highlights: initialSnapshot.highlights,
    notes: initialSnapshot.notes ?? [],
    dirty: false,
  });

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncedPayloadRef = useRef<string>("");

  const toSnapshot = useCallback(
    (source: SessionState): ExamAttemptSnapshot => ({
      attemptId: source.attemptId,
      testId: source.testId,
      userId: initialSnapshot.userId,
      status: source.status,
      remainingSeconds: source.remainingSeconds,
      currentQuestionId: source.currentQuestionId,
      answersByQuestionId: source.answersByQuestionId,
      flaggedQuestionIds: source.flaggedQuestionIds,
      visitedQuestionIds: source.visitedQuestionIds,
      highlights: source.highlights,
      notes: source.notes,
      updatedAt: new Date().toISOString(),
    }),
    [initialSnapshot.userId],
  );

  useEffect(() => {
    const storageKey = `${LOCAL_STORAGE_PREFIX}.${state.attemptId}`;
    const payload = JSON.stringify(toSnapshot(state));
    localStorage.setItem(storageKey, payload);
  }, [state, toSnapshot]);

  useEffect(() => {
    if (!state.dirty) {
      return;
    }
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      const snapshot = toSnapshot(state);
      const payload = JSON.stringify(snapshot);
      if (payload === syncedPayloadRef.current) {
        dispatch({ type: "SET_DIRTY", payload: false });
        return;
      }
      void persistence.saveProgress(snapshot).then(() => {
        syncedPayloadRef.current = payload;
        dispatch({ type: "SET_DIRTY", payload: false });
      });
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state, toSnapshot, persistence]);

  const value = useMemo<ExamSessionContextValue>(
    () => ({
      state,
      setCurrentQuestion: (questionId) =>
        dispatch({ type: "SET_CURRENT_QUESTION", payload: questionId }),
      setAnswer: (answer) => dispatch({ type: "SET_ANSWER", payload: answer }),
      toggleFlag: (questionId) => dispatch({ type: "TOGGLE_FLAG", payload: questionId }),
      markVisited: (questionId) => dispatch({ type: "MARK_VISITED", payload: questionId }),
      setRemainingSeconds: (seconds) =>
        dispatch({ type: "SET_REMAINING_SECONDS", payload: seconds }),
      addHighlight: (highlight) => dispatch({ type: "ADD_HIGHLIGHT", payload: highlight }),
      removeHighlight: (highlightId) =>
        dispatch({ type: "REMOVE_HIGHLIGHT", payload: highlightId }),
      addNote: (note) => dispatch({ type: "ADD_NOTE", payload: note }),
      removeNote: (noteId) => dispatch({ type: "REMOVE_NOTE", payload: noteId }),
      setStatus: (status) => dispatch({ type: "SET_STATUS", payload: status }),
    }),
    [state],
  );

  return <ExamSessionContext.Provider value={value}>{children}</ExamSessionContext.Provider>;
}

export function useExamSessionStore() {
  const context = useContext(ExamSessionContext);
  if (!context) {
    throw new Error("useExamSessionStore must be used inside ExamSessionProvider");
  }
  return context;
}

export function getCachedAttemptSnapshot(attemptId: string): ExamAttemptSnapshot | null {
  const raw = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}.${attemptId}`);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as ExamAttemptSnapshot;
  } catch {
    return null;
  }
}
