import React, { useState } from 'react';
import { MEDICAL_CASES } from '../data/cases';

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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

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
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
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

        <div className="text-right font-mono text-xs bg-[#0F172A] p-4 border border-[#1E293B] shrink-0">
          <div className="text-[#64748B] uppercase text-[10px]">Current Score</div>
          <div className="text-2xl font-bold text-[#60A5FA]">
            {score} / {answeredCount}
          </div>
        </div>
      </div>

      {!quizCompleted ? (
        <div className="bg-[#0F172A] p-8 border border-[#1E293B] space-y-6">
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
          </div>

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
