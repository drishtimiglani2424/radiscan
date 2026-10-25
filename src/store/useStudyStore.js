import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Custom safe storage adapter:
 * Enables graceful fallback when running in non-browser/testing/SSR environments
 * while fully persisting state to localStorage in the browser.
 */
const safeStorage = {
  getItem: (name) => {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(name, value);
    } catch (e) {
      console.warn('StudyStore: localStorage setItem failed', e);
    }
  },
  removeItem: (name) => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.removeItem(name);
    } catch (e) {
      console.warn('StudyStore: localStorage removeItem failed', e);
    }
  },
};

/**
 * useStudyStore
 * Global Zustand store for shared application state:
 * - bookmarks: list of bookmarked case IDs
 * - toggleBookmark: toggles caseId in bookmarks
 * - quizHistory: historical records of completed quizzes
 * - addQuizResult: appends a completed quiz record
 *
 * Note: Component-specific local state (such as viewer zoom, contrast, pan,
 * and active inspector tab in Workspace.jsx) remains local component state (useState).
 */
export const useStudyStore = create(
  persist(
    (set, get) => ({
      // Shared state
      bookmarks: [],
      quizHistory: [],

      // Actions
      toggleBookmark: (caseId) => {
        const id = typeof caseId === 'object' && caseId?.id ? caseId.id : caseId;
        if (!id) return;
        set((state) => {
          const exists = state.bookmarks.includes(id);
          return {
            bookmarks: exists
              ? state.bookmarks.filter((bId) => bId !== id)
              : [...state.bookmarks, id],
          };
        });
      },

      addQuizResult: (result) => {
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

        set((state) => ({
          quizHistory: [newEntry, ...state.quizHistory],
        }));
      },

      // Helper getters/methods
      isBookmarked: (caseId) => {
        const id = typeof caseId === 'object' && caseId?.id ? caseId.id : caseId;
        return get().bookmarks.includes(id);
      },

      clearBookmarks: () => set({ bookmarks: [] }),
      clearQuizHistory: () => set({ quizHistory: [] }),
    }),
    {
      name: 'radiscan_study_store',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);

export default useStudyStore;
