import React, { useState, useEffect, useRef } from 'react';
import { MEDICAL_CASES } from '../data/cases';
import { useStudyStore } from '../store/useStudyStore';

// Total timed duration for diagnostic assessment (3 minutes = 180 seconds)
const TOTAL_QUIZ_TIME = 180;

export const QuizCenter = ({ onSelectCase, onNavigate }) => {
  // Aggregate all questions with their parent case metadata
  const allQuestions = MEDICAL_CASES.flatMap((c) =>
    c.quizQuestions.map((q) => ({
      ...q,
      caseId: c.id,
      caseTitle: c.shortTitle,
      category: c.category
    }))
  );

  // Global Study Store (shared state)
  const { addQuizResult, quizHistory } = useStudyStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // =========================================================================
  // QUIZ TIMER: Countdown in useEffect with setInterval and cleanup function
  // "Use useRef to hold the interval id. (useEffect cleanup, useRef)"
  // =========================================================================
  const timerRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_QUIZ_TIME);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Helper to format seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // =========================================================================
  // useEffect: Runs interval countdown and provides cleanup function
  // =========================================================================
  useEffect(() => {
    // If quiz is finished or paused, ensure any active interval is cleared
    if (quizCompleted || isTimerPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Assign interval id into useRef to persist reference without re-renders
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // =======================================================================
    // CLEANUP FUNCTION:
    // Clears the interval when component unmounts or effect re-runs.
    // Prevents memory leaks, duplicate timers, and orphaned callbacks.
    // =======================================================================
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [quizCompleted, isTimerPaused]);

  // Handle countdown expiration (when timeLeft reaches 0)
  useEffect(() => {
    if (timeLeft === 0 && !quizCompleted) {
      const finalScore = score;
      const total = allQuestions.length;
      const percentage = Math.round((finalScore / total) * 100);

      addQuizResult({
        id: `quiz-timed-${Date.now()}`,
        score: finalScore,
        totalQuestions: total,
        percentage,
        title: 'Diagnostic Quizzes (Time Expired)',
        category: 'Timed Assessment',
        timestamp: new Date().toISOString(),
      });

      setQuizCompleted(true);
    }
  }, [timeLeft, quizCompleted, score, allQuestions.length, addQuizResult]);

  const currentQ = allQuestions[currentIndex];

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    setAnsweredCount((prev) => prev + 1);
    if (selectedOption === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < allQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz finished: clear timer and commit result to shared study store
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const finalScore = score;
      const total = allQuestions.length;
      const percentage = Math.round((finalScore / total) * 100);

      addQuizResult({
        id: `quiz-${Date.now()}`,
        score: finalScore,
        totalQuestions: total,
        percentage,
        title: 'Trauma Diagnostic Assessment Laboratory',
        category: 'All Categories',
        timestamp: new Date().toISOString(),
      });

      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    // Reset timer and clear any active interval
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeLeft(TOTAL_QUIZ_TIME);
    setIsTimerPaused(false);

    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setAnsweredCount(0);
    setQuizCompleted(false);
  };

  return (
    <div className="pt-24 pb-32 max-w-4xl mx-auto px-6 min-h-screen text-white">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-[#1E293B] flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#60A5FA] uppercase tracking-[3px] mb-3">
            <span className="material-symbols-outlined text-sm">quiz</span>
            ASSESSMENT LABORATORY
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white font-syne">
            Diagnostic Quizzes
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 font-sans">
            Test your understanding of fracture mechanics, neurovascular landmarks, and radiological classification criteria.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          {/* Quiz Countdown Timer Badge */}
          <div
            id="quiz-timer-badge"
            className={`p-4 border font-mono text-xs shrink-0 text-right transition-all min-w-[140px] flex flex-col justify-between ${
              timeLeft === 0
                ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                : timeLeft <= 30
                ? 'bg-rose-950/40 border-rose-500 text-rose-300 animate-pulse'
                : timeLeft <= 60
                ? 'bg-amber-950/30 border-amber-500 text-amber-300'
                : 'bg-[#0F172A] border-[#1E293B] text-white'
            }`}
          >
            <div className="flex items-center justify-end gap-1.5 text-[10px] uppercase text-[#64748B] mb-0.5">
              <span className="material-symbols-outlined text-xs">timer</span>
              <span>Countdown</span>
              {!quizCompleted && timeLeft > 0 && (
                <button
                  type="button"
                  onClick={() => setIsTimerPaused((prev) => !prev)}
                  title={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
                  className="ml-1 text-[9px] px-1 py-0.2 bg-[#162035] hover:bg-[#25334D] text-[#60A5FA] border border-[#25334D] cursor-pointer"
                >
                  {isTimerPaused ? 'RESUME' : 'PAUSE'}
                </button>
              )}
            </div>
            <div className="text-2xl font-bold tracking-wider font-mono">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="text-right font-mono text-xs bg-[#0F172A] p-4 border border-[#1E293B] shrink-0">
            <div className="text-[#64748B] uppercase text-[10px]">Current Score</div>
            <div className="text-2xl font-bold text-[#60A5FA]">
              {score} / {answeredCount}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowHistory((prev) => !prev)}
            title="View Shared Quiz History"
            className={`p-4 border font-mono text-xs transition-colors cursor-pointer shrink-0 text-left ${
              showHistory
                ? 'bg-[#60A5FA] text-[#090D16] border-[#60A5FA] font-bold'
                : 'bg-[#0F172A] text-[#94A3B8] border-[#1E293B] hover:border-[#60A5FA] hover:text-white'
            }`}
          >
            <div className="text-[10px] uppercase opacity-75">Store History</div>
            <div className="text-base font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">history</span>
              {quizHistory.length} Record{quizHistory.length === 1 ? '' : 's'}
            </div>
          </button>
        </div>
      </div>

      {/* Slide-down Quiz History Panel */}
      {showHistory && (
        <div className="mb-8 p-6 bg-[#0B1120] border border-[#25334D] font-mono">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1E293B]">
            <div className="text-xs font-bold uppercase tracking-wider text-[#60A5FA] flex items-center gap-2">
              <span className="material-symbols-outlined text-base">monitoring</span>
              Shared Store Assessment History
            </div>
            <button
              onClick={() => setShowHistory(false)}
              className="text-xs text-[#94A3B8] hover:text-white"
            >
              [Close Panel]
            </button>
          </div>

          {quizHistory.length === 0 ? (
            <div className="text-xs text-[#64748B] py-2">
              No quiz attempts recorded in study store yet. Complete the quiz to record a score.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {quizHistory.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between p-3 bg-[#0F172A] border border-[#1E293B] text-xs"
                >
                  <div>
                    <div className="font-bold text-white uppercase">{q.title}</div>
                    <div className="text-[10px] text-[#64748B]">
                      {q.dateFormatted || new Date(q.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#94A3B8]">
                      {q.score} / {q.totalQuestions}
                    </span>
                    <span className="font-bold text-[#60A5FA] bg-[#162035] px-2 py-0.5 border border-[#25334D]">
                      {q.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!quizCompleted ? (
        <div className="bg-[#0F172A] p-8 border border-[#1E293B] space-y-6 relative overflow-hidden">
          {/* Top timer countdown progress indicator */}
          <div className="w-full bg-[#131B2E] h-1.5 -mx-8 -mt-8 mb-6 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 30
                  ? 'bg-rose-500'
                  : timeLeft <= 60
                  ? 'bg-amber-400'
                  : 'bg-[#60A5FA]'
              }`}
              style={{ width: `${(timeLeft / TOTAL_QUIZ_TIME) * 100}%` }}
            />
          </div>

          {/* Question Progress Header */}
          <div className="flex items-center justify-between text-xs font-mono border-b border-[#1E293B] pb-4">
            <span className="px-2.5 py-1 bg-[#090D16] text-[#60A5FA] border border-[#25334D] uppercase">
              Question 0{currentIndex + 1} // 0{allQuestions.length}
            </span>
            <button
              onClick={() => {
                onSelectCase(currentQ.caseId);
                onNavigate('workspace');
              }}
              className="text-[#94A3B8] hover:text-[#60A5FA] flex items-center gap-1 uppercase tracking-wider cursor-pointer"
            >
              <span>Case: {currentQ.caseTitle}</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </button>
          </div>

          {/* Question Text */}
          <h2 className="text-xl md:text-2xl font-bold text-white uppercase leading-relaxed font-syne">
            {currentQ.question}
          </h2>

          {/* Option list */}
          <div className="space-y-3 font-mono">
            {currentQ.options.map((option, idx) => {
              let btnClass = 'bg-[#131B2E] border-[#25334D] text-[#94A3B8] hover:border-[#60A5FA] hover:text-white';

              if (isAnswerSubmitted) {
                if (idx === currentQ.correctIndex) {
                  btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                } else if (selectedOption === idx) {
                  btnClass = 'bg-rose-950/80 border-rose-500 text-rose-200';
                }
              } else if (selectedOption === idx) {
                btnClass = 'bg-[#60A5FA] border-[#60A5FA] text-[#090D16] font-bold';
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerSubmitted}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-4 border transition-all text-xs md:text-sm flex items-start gap-3 cursor-pointer ${btnClass}`}
                >
                  <span className="font-bold text-xs mt-0.5">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span className="leading-relaxed">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback section when submitted */}
          {isAnswerSubmitted && (
            <div
              className={`p-4 border text-xs md:text-sm leading-relaxed ${
                selectedOption === currentQ.correctIndex
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500 text-rose-200'
              }`}
            >
              <div className="font-mono font-bold mb-1 flex items-center gap-1.5 uppercase text-xs">
                <span className="material-symbols-outlined text-base">
                  {selectedOption === currentQ.correctIndex ? 'check_circle' : 'cancel'}
                </span>
                {selectedOption === currentQ.correctIndex
                  ? 'Correct Clinical Assessment!'
                  : 'Incorrect Interpretation'}
              </div>
              <p className="mt-1 text-[#CBD5E1] font-sans text-xs">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4 flex items-center justify-between border-t border-[#1E293B] font-mono">
            <button
              onClick={() => {
                onSelectCase(currentQ.caseId);
                onNavigate('workspace');
              }}
              className="text-xs text-[#64748B] hover:text-[#60A5FA] flex items-center gap-1 uppercase cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
              View Radiograph in Workspace
            </button>

            {!isAnswerSubmitted ? (
              <button
                disabled={selectedOption === null}
                onClick={handleSubmitAnswer}
                className="bg-[#60A5FA] text-[#090D16] disabled:opacity-40 hover:bg-white px-6 py-3 text-xs font-bold uppercase tracking-[2px] transition-colors cursor-pointer"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-[#60A5FA] text-[#090D16] hover:bg-white px-6 py-3 text-xs font-bold uppercase tracking-[2px] transition-colors flex items-center gap-1 cursor-pointer"
              >
                {currentIndex + 1 < allQuestions.length ? 'Next Question' : 'View Final Score'}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Complete Screen */
        <div className="bg-[#0F172A] p-10 border border-[#1E293B] text-center space-y-6">
          <div className="w-16 h-16 bg-[#162035] border border-[#60A5FA] flex items-center justify-center mx-auto text-[#60A5FA]">
            <span className="material-symbols-outlined text-3xl">emoji_events</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black uppercase text-white font-syne">
            Assessment Completed
          </h2>

          <div className="p-6 bg-[#090D16] border border-[#25334D] max-w-sm mx-auto font-mono">
            <div className="text-[10px] text-[#64748B] mb-1 uppercase tracking-widest">
              Accuracy Score
            </div>
            <div className="text-5xl font-black text-[#60A5FA]">
              {Math.round((score / allQuestions.length) * 100)}%
            </div>
            <div className="text-xs text-[#94A3B8] mt-2 font-sans">
              You answered {score} out of {allQuestions.length} questions correctly.
            </div>

            <div className="mt-2 text-[11px] font-mono">
              {timeLeft === 0 ? (
                <span className="text-rose-400 font-bold flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">alarm_off</span>
                  Countdown Expired (00:00)
                </span>
              ) : (
                <span className="text-[#60A5FA] flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">timer</span>
                  Completed with {formatTime(timeLeft)} remaining ({TOTAL_QUIZ_TIME - timeLeft}s taken)
                </span>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#1E293B] text-[10px] text-emerald-400 font-mono flex items-center justify-center gap-1.5 uppercase">
              <span className="material-symbols-outlined text-sm">cloud_done</span>
              <span>Saved to Study Store // Attempt Logged</span>
            </div>
          </div>

          {/* Recent Quiz History from Store */}
          {quizHistory.length > 0 && (
            <div className="max-w-md mx-auto text-left font-mono border border-[#1E293B] bg-[#090D16] p-4">
              <div className="text-[10px] text-[#60A5FA] uppercase tracking-wider font-bold mb-3 flex items-center justify-between border-b border-[#1E293B] pb-2">
                <span>Study Store // Recent Attempts</span>
                <span className="text-[#64748B]">{quizHistory.length} Total</span>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {quizHistory.slice(0, 4).map((entry, idx) => (
                  <div
                    key={entry.id || idx}
                    className="flex items-center justify-between p-2 bg-[#0F172A] border border-[#1E293B] text-xs"
                  >
                    <div>
                      <div className="text-white text-[11px] font-bold">{entry.title}</div>
                      <div className="text-[9px] text-[#64748B]">
                        {entry.dateFormatted || new Date(entry.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#94A3B8]">
                        {entry.score}/{entry.totalQuestions}
                      </span>
                      <span className="text-[10px] font-bold text-[#60A5FA] bg-[#162035] px-1.5 py-0.5 border border-[#25334D]">
                        {entry.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 pt-4 font-mono">
            <button
              onClick={handleRestart}
              className="bg-[#131B2E] text-white border border-[#25334D] hover:border-[#60A5FA] px-6 py-3 text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => onNavigate('workspace')}
              className="bg-[#60A5FA] text-[#090D16] hover:bg-white px-6 py-3 text-xs font-bold uppercase tracking-[2px] transition-colors cursor-pointer"
            >
              Return to Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
