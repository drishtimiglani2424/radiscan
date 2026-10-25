import { useState, useEffect, useCallback } from 'react';

/**
 * useLocalStorage Hook
 * Syllabus: Browser storage, JSON, and forms (Lectures 51-54)
 *
 * Custom hook to sync state with localStorage.
 * Handles JSON serialization, SSR/environment safety, and dynamic key changes (e.g., keyed by user.id).
 *
 * @param {string} key - localStorage storage key
 * @param {any} initialValue - Fallback value if key is not yet set
 * @returns {[any, Function, Function]} [storedValue, setStoredValue, removeStoredValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // Read value from localStorage with fallback
  const readValue = useCallback(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }

    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null || raw === undefined) {
        return typeof initialValue === 'function' ? initialValue() : initialValue;
      }
      return JSON.parse(raw);
    } catch (error) {
      console.warn(`useLocalStorage: Error parsing item for key "${key}":`, error);
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState(readValue);

  // Re-hydrate if key changes (e.g. user logs in or switches user id)
  useEffect(() => {
    setStoredValue(readValue());
  }, [key, readValue]);

  // Wrapped setter to update both React state and localStorage
  const setValue = useCallback(
    (value) => {
      try {
        setStoredValue((current) => {
          const valueToStore = typeof value === 'function' ? value(current) : value;
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
          return valueToStore;
        });
      } catch (error) {
        console.warn(`useLocalStorage: Error setting key "${key}":`, error);
      }
    },
    [key]
  );

  // Helper to remove item from localStorage and reset to initial value
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      const reset = typeof initialValue === 'function' ? initialValue() : initialValue;
      setStoredValue(reset);
    } catch (error) {
      console.warn(`useLocalStorage: Error removing key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
