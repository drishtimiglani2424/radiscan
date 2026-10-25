import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * Storage keys for browser localStorage persistence fallback
 */
const STORAGE_KEY_BOOKMARKS = 'radiscan_study_context_bookmarks';
const STORAGE_KEY_QUIZ_HISTORY = 'radiscan_study_context_quiz_history';

/**
 * StudyContext
 * React Context alternative providing the identical API shape as useStudyStore:
 * - bookmarks: string[]
 * - toggleBookmark: (caseId: string) => void
 * - quizHistory: Array<QuizResult>
 * - addQuizResult: (result: QuizResult) => void
 * - isBookmarked: (caseId: string) => boolean
 *
 * For the Viva:
 * Compare React Context vs Zustand:
 * 1. Setup & Boilerplate:
 *    - Context requires creating Context, Provider component, custom hook, and wrapping subtrees.
 *    - Zustand requires only a single `create()` call and needs no wrapping Provider.
 * 2. Performance & Re-rendering:
 *    - Context triggers re-renders across all consumers of the context whenever any property in `value` changes.
 *    - Zustand supports selector subscriptions `useStudyStore(state => state.bookmarks)`, only re-rendering
 *      components when that selected slice changes.
 * 3. Scope & Access:
 *    - Context is bound to React component trees and lifecycle.
 *    - Zustand can be accessed and modified outside React (via `useStudyStore.getState()` and `setState()`).
 * 4. Local vs Shared State Principle:
 *    - Ephemeral component-specific state (zoom, contrast, pan, selected tab) stays in local component state (useState).
 *    - Cross-cutting domain data (bookmarks, quiz history) belongs in a shared store (Zustand or StudyContext).
 */
export const StudyContext = createContext(null);

export const StudyProvider = ({ children }) => {
  // Bookmarks state with localStorage hydration
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return [];
      const stored = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('StudyContext: Failed to read bookmarks from localStorage', e);
      return [];
    }
  });

  // Quiz history state with localStorage hydration
  const [quizHistory, setQuizHistory] = useState(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return [];
      const stored = localStorage.getItem(STORAGE_KEY_QUIZ_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('StudyContext: Failed to read quizHistory from localStorage', e);
      return [];
    }
  });

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
      }
    } catch (e) {
      console.warn('StudyContext: Failed to write bookmarks to localStorage', e);
    }
  }, [bookmarks]);

  // Sync quizHistory to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_QUIZ_HISTORY, JSON.stringify(quizHistory));
      }
    } catch (e) {
      console.warn('StudyContext: Failed to write quizHistory to localStorage', e);
    }
  }, [quizHistory]);

  const toggleBookmark = useCallback((caseId) => {
    const id = typeof caseId === 'object' && caseId?.id ? caseId.id : caseId;
    if (!id) return;
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
    );
  }, []);

  const addQuizResult = useCallback((result) => {
    const score = Number(result?.score ?? 0);
    const totalQuestions = Number(result?.totalQuestions ?? 0);
    const percentage =
      result?.percentage !== undefined
        ? Number(result.percentage)
        : totalQuestions > 0
        ? Math.round((score / totalQuestions) * 100)
        : 0;

    const newEntry = {
      id: result?.id || `quiz-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      score,
      totalQuestions,
      percentage,
      title: result?.title || 'Diagnostic Assessment Laboratory',
      category: result?.category || 'General Radiology',
      timestamp: result?.timestamp || new Date().toISOString(),
      dateFormatted:
        result?.dateFormatted ||
        new Date().toLocaleString([], {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      details: result?.details || null,
    };

    setQuizHistory((prev) => [newEntry, ...prev]);
  }, []);

  const isBookmarked = useCallback(
    (caseId) => {
      const id = typeof caseId === 'object' && caseId?.id ? caseId.id : caseId;
      return bookmarks.includes(id);
    },
    [bookmarks]
  );

  const value = {
    bookmarks,
    toggleBookmark,
    quizHistory,
    addQuizResult,
    isBookmarked,
  };

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
};

export const useStudyContext = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudyContext must be used within a StudyProvider');
  }
  return context;
};

export default StudyContext;
