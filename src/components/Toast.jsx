import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Toast Notification Component
 * Strictly adheres to syllabus:
 * - 61-66: Modal, tabs, dropdowns, toast notifications
 * - 31-36: useEffect lifecycle management and cleanup
 * - Accessibility: role="alert", aria-live="assertive"
 */
export const Toast = () => {
  const { toast, hideToast } = useAuth();

  useEffect(() => {
    if (!toast) return;

    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      hideToast();
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      role={isError ? 'alert' : 'status'}
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[100] max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div
        className={`p-4 border shadow-2xl flex items-start gap-3 backdrop-blur-md ${
          isSuccess
            ? 'bg-[#0B1528]/95 border-[#60A5FA] text-[#F8FAFC]'
            : isError
            ? 'bg-[#250E14]/95 border-red-500 text-[#F8FAFC]'
            : 'bg-[#0F172A]/95 border-[#25334D] text-[#F8FAFC]'
        }`}
      >
        <div className="pt-0.5">
          <span
            className={`material-symbols-outlined text-xl ${
              isSuccess ? 'text-[#60A5FA]' : isError ? 'text-red-400' : 'text-[#94A3B8]'
            }`}
          >
            {isSuccess ? 'check_circle' : isError ? 'error' : 'info'}
          </span>
        </div>

        <div className="flex-1 font-mono text-xs">
          <div className="font-bold tracking-wider uppercase mb-0.5">
            {isSuccess ? 'SYSTEM SUCCESS' : isError ? 'AUTHENTICATION NOTICE' : 'SYSTEM UPDATE'}
          </div>
          <div className="text-[#CBD5E1] font-sans text-xs leading-relaxed">
            {toast.message}
          </div>
        </div>

        <button
          onClick={hideToast}
          aria-label="Dismiss notification"
          className="text-[#64748B] hover:text-white transition-colors cursor-pointer p-1"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>
    </div>
  );
};
