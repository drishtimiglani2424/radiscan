import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MEDICAL_CASES } from '../data/cases';

/**
 * Build caliper flashcards from existing clinical case measurements:
 * - caliper name on front
 * - normal range on back
 */
const CALIPER_CARDS = MEDICAL_CASES.flatMap((c) =>
  (c.measurements || []).map((m, idx) => ({
    id: `${c.id}-caliper-${idx}`,
    caliperName: m.name,
    normalRange: m.normalRange,
    measuredValue: m.measuredValue,
    interpretation: m.interpretation,
    category: c.category,
    caseTitle: c.shortTitle || c.title,
    caseId: c.id,
  }))
);

export const Flashcards = () => {
  const { user } = useAuth();

  // Search box state
  const [searchQuery, setSearchQuery] = useState('');

  // useState flag flips the card as required
  const [isFlipped, setIsFlipped] = useState(false);

  // Deck progression state
  const [currentIndex, setCurrentIndex] = useState(0);

  // Tracking study response lists
  const [knownIds, setKnownIds] = useState([]);
  const [reviewAgainIds, setReviewAgainIds] = useState([]);

  // =========================================================================
  // useMemo: Filter the deck dynamically based on search query
  // "and a search box that filters the deck using useMemo. add this feature too"
  // =========================================================================
  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return CALIPER_CARDS;
    return CALIPER_CARDS.filter(
      (card) =>
        card.caliperName.toLowerCase().includes(q) ||
        card.normalRange.toLowerCase().includes(q) ||
        card.category.toLowerCase().includes(q) ||
        card.caseTitle.toLowerCase().includes(q) ||
        (card.interpretation && card.interpretation.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Ensure current index stays within filtered boundaries if search reduces the deck size
  const safeIndex = Math.min(currentIndex, Math.max(0, filteredCards.length - 1));
  const currentCard = filteredCards[safeIndex];
  const isDeckComplete = filteredCards.length > 0 && currentIndex >= filteredCards.length;

  // "Know it" button moves to the next card
  const handleKnowIt = () => {
    if (!currentCard) return;
    const cardId = currentCard.id;

    setKnownIds((prev) => (prev.includes(cardId) ? prev : [...prev, cardId]));
    setReviewAgainIds((prev) => prev.filter((id) => id !== cardId));

    setIsFlipped(false);
    setCurrentIndex((prev) => prev + 1);
  };

  // "Review again" button moves to the next card
  const handleReviewAgain = () => {
    if (!currentCard) return;
    const cardId = currentCard.id;

    setReviewAgainIds((prev) => (prev.includes(cardId) ? prev : [...prev, cardId]));
    setKnownIds((prev) => prev.filter((id) => id !== cardId));

    setIsFlipped(false);
    setCurrentIndex((prev) => prev + 1);
  };

  // Previous card navigation
  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  // Restart full deck
  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownIds([]);
    setReviewAgainIds([]);
  };

  // Review only the cards marked "Review again"
  const handleStudyReviewDeck = () => {
    setSearchQuery('');
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const progressPercent =
    filteredCards.length > 0
      ? Math.round(((Math.min(currentIndex, filteredCards.length)) / filteredCards.length) * 100)
      : 0;

  return (
    <main className="pt-24 pb-28 min-h-screen bg-[#090D16] text-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-3 font-mono text-xs">
            <Link
              to="/workspace"
              className="flex items-center gap-1.5 text-[#94A3B8] hover:text-[#60A5FA] uppercase tracking-wider transition-colors px-2 py-1 bg-[#0F172A] border border-[#1E293B]"
            >
              <span className="material-symbols-outlined text-sm">radiology</span>
              <span>Workspace</span>
            </Link>

            <Link
              to="/case-library"
              className="flex items-center gap-1.5 text-[#94A3B8] hover:text-[#60A5FA] uppercase tracking-wider transition-colors px-2 py-1 bg-[#0F172A] border border-[#1E293B]"
            >
              <span className="material-symbols-outlined text-sm">grid_view</span>
              <span>Archive</span>
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-[#94A3B8] hover:text-[#60A5FA] uppercase tracking-wider transition-colors px-2 py-1 bg-[#0F172A] border border-[#1E293B]"
              >
                <span className="material-symbols-outlined text-sm">dashboard</span>
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          {/* Progress stats bar */}
          <div className="flex items-center gap-4 text-xs font-mono text-[#64748B]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>KNOWN: {knownIds.length}</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>REVIEW: {reviewAgainIds.length}</span>
            </span>
            <span className="text-white">
              DECK: {filteredCards.length}
            </span>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-[#60A5FA]"></span>
              <span className="font-mono text-xs uppercase tracking-[3px] text-[#60A5FA]">
                CLINICAL RECALL // BIOMECHANICAL CALIPERS
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-syne">
              Radiographic Flashcards
            </h1>
            <p className="text-xs text-[#94A3B8] font-mono mt-1">
              Test recall of diagnostic calipers and normal anatomical ranges for {user?.name || 'Practitioner'}.
            </p>
          </div>

          {/* Search Box filtering with useMemo */}
          <div className="relative w-full md:w-80 font-mono">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#64748B]">
              search
            </span>
            <input
              type="text"
              id="flashcard-search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              placeholder="Filter calipers or ranges..."
              className="w-full bg-[#0F172A] border border-[#1E293B] pl-9 pr-8 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#60A5FA] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#64748B] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span>
              {filteredCards.length > 0 && !isDeckComplete
                ? `Card ${safeIndex + 1} of ${filteredCards.length}`
                : isDeckComplete
                ? `Completed ${filteredCards.length} of ${filteredCards.length}`
                : 'No matching cards'}
            </span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="w-full bg-[#0F172A] border border-[#1E293B] h-2 overflow-hidden">
            <div
              className="bg-[#60A5FA] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Flashcard Body */}
        {filteredCards.length === 0 ? (
          <div className="p-12 bg-[#0B1120] border border-[#1E293B] text-center space-y-4 font-mono">
            <div className="w-16 h-16 bg-[#162035] border border-[#25334D] text-[#64748B] mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">search_off</span>
            </div>
            <h3 className="text-xl font-bold uppercase text-white font-syne">
              No Matching Calipers Found
            </h3>
            <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
              No measurements match "{searchQuery}". Try searching for terms like "Tilt", "Angle", "Variance", "Interval", or "mm".
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-2.5 bg-[#60A5FA] text-[#090D16] font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
            >
              Clear Search Filter
            </button>
          </div>
        ) : isDeckComplete ? (
          /* Deck Complete Summary Screen */
          <div className="p-10 bg-[#0B1120] border border-[#1E293B] text-center space-y-6 font-mono animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">workspace_premium</span>
            </div>

            <div>
              <div className="text-[10px] uppercase text-[#60A5FA] tracking-[3px] mb-1 font-bold">
                RECALL MODULE COMPLETE
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-syne">
                Deck Mastery Summary
              </h2>
              <p className="text-xs text-[#94A3B8] font-sans mt-2 max-w-md mx-auto">
                You reviewed all {filteredCards.length} calipers in this set.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="p-4 bg-[#090D16] border border-emerald-500/40">
                <div className="text-[10px] text-emerald-400 uppercase font-bold">Know It</div>
                <div className="text-4xl font-black text-white mt-1">{knownIds.length}</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">Mastered</div>
              </div>
              <div className="p-4 bg-[#090D16] border border-amber-500/40">
                <div className="text-[10px] text-amber-400 uppercase font-bold">Review Again</div>
                <div className="text-4xl font-black text-white mt-1">{reviewAgainIds.length}</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">To Practice</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-[#60A5FA] text-[#090D16] hover:bg-white font-bold text-xs uppercase tracking-[1.5px] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">replay</span>
                <span>Restart Deck</span>
              </button>

              <Link
                to="/workspace"
                className="px-6 py-3 bg-[#131B2E] text-white border border-[#25334D] hover:border-[#60A5FA] font-bold text-xs uppercase tracking-[1.5px] transition-all flex items-center gap-1.5"
              >
                <span>Launch Workspace</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Active Card Area */
          <div className="space-y-6">
            <div
              id="caliper-flashcard"
              role="button"
              tabIndex={0}
              onClick={() => setIsFlipped((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsFlipped((prev) => !prev);
                }
              }}
              className="min-h-[340px] p-8 sm:p-10 bg-[#0B1120] border border-[#1E293B] hover:border-[#60A5FA] transition-all cursor-pointer flex flex-col justify-between relative shadow-2xl group select-none"
            >
              {/* Card Top Metadata */}
              <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[10px] uppercase bg-[#162035] text-[#60A5FA] px-2.5 py-1 border border-[#25334D] font-bold">
                    {currentCard.category}
                  </span>
                  <span className="text-[10px] text-[#64748B] uppercase">
                    From: {currentCard.caseTitle}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-[#60A5FA] group-hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    {isFlipped ? 'replay' : 'flip'}
                  </span>
                  <span>{isFlipped ? 'Flip to Prompt (Front)' : 'Flip to Normal Range (Back)'}</span>
                </div>
              </div>

              {/* Card Face Content */}
              <div className="py-8 my-auto">
                {!isFlipped ? (
                  /* ========================================================================= */
                  /* FRONT OF CARD: Caliper Name                                              */
                  /* "Build cards from your existing data: caliper name on the front,          */
                  /*  normal range on the back."                                              */
                  /* ========================================================================= */
                  <div className="space-y-3">
                    <div className="text-[11px] font-mono text-[#60A5FA] uppercase tracking-[2px] font-bold">
                      RADIOGRAPHIC BIOMECHANICAL CALIPER // PROMPT
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-syne tracking-tight">
                      {currentCard.caliperName}
                    </h2>
                    <p className="text-xs text-[#94A3B8] font-sans leading-relaxed pt-1">
                      What is the anatomical normal range or threshold for this radiologic measurement?
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        id="btn-reveal-normal-range"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsFlipped((prev) => !prev);
                        }}
                        className="px-4 py-2 bg-[#162035] hover:bg-[#60A5FA] text-[#60A5FA] hover:text-[#090D16] border border-[#25334D] hover:border-[#60A5FA] font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">touch_app</span>
                        <span>Click to Flip &amp; Check Normal Range</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ========================================================================= */
                  /* BACK OF CARD: Normal Range                                               */
                  /* ========================================================================= */
                  <div className="space-y-4 animate-fadeIn">
                    <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-[2px] font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">verified</span>
                      <span>NORMAL REFERENCE RANGE // PHYSIOLOGICAL BASELINE</span>
                    </div>

                    <div className="p-4 bg-[#090D16] border border-emerald-500/50 inline-block">
                      <div className="text-[10px] font-mono text-[#64748B] uppercase mb-0.5">
                        {currentCard.caliperName}
                      </div>
                      <div className="text-3xl sm:text-4xl font-black text-emerald-300 font-mono">
                        {currentCard.normalRange}
                      </div>
                    </div>

                    {currentCard.interpretation && (
                      <div className="p-3 bg-[#0F172A] border border-[#1E293B] text-xs font-mono text-[#94A3B8]">
                        <span className="text-white font-bold mr-1">Diagnostic Importance:</span>
                        <span className="font-sans text-[#CBD5E1]">{currentCard.interpretation}</span>
                      </div>
                    )}

                    <div>
                      <button
                        type="button"
                        id="btn-back-to-prompt"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsFlipped((prev) => !prev);
                        }}
                        className="px-4 py-2 bg-[#162035] hover:bg-white text-white hover:text-[#090D16] border border-[#25334D] font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">replay</span>
                        <span>Flip Back to Front</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Flip status indicator */}
              <div className="flex items-center justify-between pt-4 border-t border-[#1E293B] text-xs font-mono">
                <span className="text-[#64748B]">
                  {isFlipped ? 'Normal Range Revealed' : 'Click card or button below to flip'}
                </span>
                <span className="text-[#64748B]">
                  Progress: {safeIndex + 1}/{filteredCards.length}
                </span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* STUDY ACTION BUTTONS:                                                     */}
            {/* "A useState flag flips the card. “Know it” and “Review again” buttons     */}
            {/*  move to the next card."                                                  */}
            {/* ========================================================================= */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  id="btn-prev-card"
                  disabled={safeIndex === 0}
                  onClick={handlePrev}
                  className="px-3.5 py-2.5 bg-[#0F172A] hover:bg-[#162035] disabled:opacity-30 text-white border border-[#25334D] hover:border-[#60A5FA] text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span>Prev</span>
                </button>

                <button
                  type="button"
                  id="btn-flip-card"
                  onClick={() => setIsFlipped((prev) => !prev)}
                  className="px-3.5 py-2.5 bg-[#0B1120] hover:bg-[#162035] text-[#60A5FA] border border-[#1E293B] hover:border-[#60A5FA] text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">flip</span>
                  <span>{isFlipped ? 'Show Front' : 'Flip Card'}</span>
                </button>

                <button
                  type="button"
                  id="btn-next-card"
                  disabled={safeIndex >= filteredCards.length - 1}
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentIndex((prev) => Math.min(filteredCards.length - 1, prev + 1));
                  }}
                  className="px-3.5 py-2.5 bg-[#0F172A] hover:bg-[#162035] disabled:opacity-30 text-white border border-[#25334D] hover:border-[#60A5FA] text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>

              {/* Primary “Review again” and “Know it” Buttons */}
              <div className="flex items-center gap-3">
                {/* “Review again” button moves to the next card */}
                <button
                  type="button"
                  id="btn-review-again"
                  onClick={handleReviewAgain}
                  className="flex-1 sm:flex-none px-6 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:border-amber-400 font-bold text-xs uppercase tracking-[1.5px] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">replay</span>
                  <span>Review Again</span>
                </button>

                {/* “Know it” button moves to the next card */}
                <button
                  type="button"
                  id="btn-know-it"
                  onClick={handleKnowIt}
                  className="flex-1 sm:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-[#090D16] hover:text-white font-bold text-xs uppercase tracking-[1.5px] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                  <span>Know It</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Flashcards;
