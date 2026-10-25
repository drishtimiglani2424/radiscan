import React from 'react';

/**
 * Reusable Accessible Input Component
 * Takes: label, type, name, value, onChange, onBlur, error
 * Syllabus:
 * - HTML5 structure & semantic tags (<label>, <input>)
 * - Accessibility basics (htmlFor, aria-invalid, role="alert")
 * - Form handling in React, Validation strategies, Reusable input components (Lectures 55-60)
 */
export const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  id,
  required = false,
  autoComplete,
  disabled = false,
  icon,
  rightElement,
}) => {
  const inputId = id || name;
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Label linked to input via htmlFor */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-1 cursor-pointer select-none"
        >
          <span>{label}</span>
          {required && (
            <span className="text-[#60A5FA] font-bold" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {/* Input wrapper with state borders */}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-[#64748B] pointer-events-none flex items-center">
            {icon}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          className={`w-full bg-[#0B1120] border text-sm text-[#F8FAFC] placeholder-[#475569] font-mono py-2.5 transition-all focus:outline-none ${
            icon ? 'pl-10' : 'pl-3.5'
          } ${rightElement ? 'pr-11' : 'pr-3.5'} ${
            hasError
              ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400/50'
              : 'border-[#1E293B] focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA]/30'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />

        {rightElement && (
          <div className="absolute right-2.5 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {/* Error container displayed directly under the field */}
      {hasError && (
        <div
          id={`${inputId}-error`}
          role="alert"
          aria-live="polite"
          className="flex items-center gap-1.5 text-xs text-red-400 font-mono mt-0.5"
        >
          <span className="material-symbols-outlined text-sm text-red-400">
            error
          </span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Input;
