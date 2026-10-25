import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MEDICAL_CASES } from '../data/cases';
import { useStudyStore } from '../store/useStudyStore';

export const CaseLibrary = ({ onSelectCase, onNavigate }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Global shared state from Zustand useStudyStore
  const { bookmarks, toggleBookmark } = useStudyStore();

  const categories = ['All', 'Upper Extremity', 'Lower Extremity', `Bookmarked (${bookmarks.length})`];

  const filteredCases = MEDICAL_CASES.filter((c) => {
    let matchesCategory = false;
    if (selectedCategory === 'All') {
      matchesCategory = true;
    } else if (selectedCategory.startsWith('Bookmarked')) {
      matchesCategory = bookmarks.includes(c.id);
    } else {
      matchesCategory = c.category === selectedCategory;
    }

    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.impression.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenCase = (caseId) => {
    if (onSelectCase) onSelectCase(caseId);
    if (onNavigate) onNavigate('workspace');
    navigate(`/workspace?case=${caseId}`);
  };

  return (
    <div className="pt-24 pb-32 max-w-7xl mx-auto px-6 min-h-screen text-white">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-[#1E293B]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#60A5FA] uppercase tracking-[3px] mb-3">
            <span className="material-symbols-outlined text-sm">menu_book</span>
            CLINICAL REPOSITORY // ARCHIVE
            <span className="text-[#64748B]">•</span>
            <span className="text-white font-bold">{bookmarks.length} BOOKMARKED</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-syne">
            Case Archive
          </h1>
          <p className="text-[#94A3B8] text-sm mt-2 max-w-2xl font-sans">
            Explore de-identified, verified radiographic trauma series. Each case features annotated anatomy, biomechanical angle calculations, and diagnostic self-assessments.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/flashcards"
            className="bg-[#162035] hover:bg-[#1E293B] border border-[#25334D] hover:border-[#60A5FA] text-[#60A5FA] px-4 py-3 text-xs font-mono font-bold uppercase tracking-[2px] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">style</span>
            <span>Flashcards</span>
          </Link>

          <button
            type="button"
            id="btn-archive-open-workspace"
            onClick={() => {
              if (onNavigate) onNavigate('workspace');
              navigate('/workspace');
            }}
            className="bg-[#60A5FA] text-[#090D16] hover:bg-white px-6 py-3 text-xs font-mono font-bold uppercase tracking-[2px] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Open Workspace</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 font-mono">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#60A5FA] text-[#090D16] font-bold border-[#60A5FA]'
                  : 'bg-[#0F172A] text-[#94A3B8] border-[#1E293B] hover:border-[#25334D] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-80 font-mono">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#64748B]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fracture or bone..."
            className="w-full bg-[#0F172A] border border-[#1E293B] pl-9 pr-4 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#60A5FA] transition-colors"
          />
        </div>
      </div>

      {/* Case Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredCases.map((c, idx) => {
          const isBookmarked = bookmarks.includes(c.id);

          return (
            <div
              key={c.id}
              onClick={() => handleOpenCase(c.id)}
              className="bg-[#0F172A] p-6 border border-[#1E293B] hover:border-[#60A5FA] transition-all duration-200 group cursor-pointer flex flex-col justify-between relative"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 font-mono">
                  <span className="text-xs text-[#60A5FA] uppercase tracking-wider font-bold">
                    {c.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] px-2 py-0.5 border uppercase font-bold ${
                        c.difficulty === 'Introductory'
                          ? 'bg-[#60A5FA]/10 text-[#60A5FA] border-[#60A5FA]/40'
                          : c.difficulty === 'Intermediate'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {c.difficulty}
                    </span>

                    {/* Bookmark Button (Archive Card Header) */}
                    <button
                      type="button"
                      id={`btn-bookmark-header-${c.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(c.id);
                      }}
                      title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                      className={`px-2 py-0.5 text-[10px] uppercase font-bold border flex items-center gap-1 transition-all cursor-pointer ${
                        isBookmarked
                          ? 'bg-[#60A5FA] text-[#090D16] border-[#60A5FA]'
                          : 'bg-[#162035] text-[#94A3B8] border-[#25334D] hover:border-[#60A5FA] hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        {isBookmarked ? 'bookmark' : 'bookmark_border'}
                      </span>
                      <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[#64748B] uppercase mb-1">
                  CASE STUDY // 0{idx + 1}
                </div>

                <h3 className="text-2xl font-bold uppercase text-white group-hover:text-[#60A5FA] transition-colors mb-2 font-syne">
                  {c.title}
                </h3>
                <p className="text-xs text-[#94A3B8] font-sans leading-relaxed mb-4">
                  {c.description}
                </p>

                {/* Preview image thumbnail */}
                <div className="w-full h-48 bg-black overflow-hidden border border-[#1E293B] relative mb-4">
                  <img
                    src={c.imageUrl}
                    alt={c.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-2 right-2 bg-black/90 px-2 py-1 text-[9px] font-mono text-[#60A5FA] border border-[#25334D] uppercase">
                    {c.modality.split(' ')[0]} // {c.projection}
                  </div>
                </div>

                {/* Key Measurements Badge */}
                <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono text-[#64748B]">
                  <span>PATIENT: {c.patientAge}, {c.patientGender}</span>
                  <span>•</span>
                  <span>{c.anatomicalRegions.length} ANATOMY PINS</span>
                  <span>•</span>
                  <span>{c.quizQuestions.length} QUESTIONS</span>
                </div>
              </div>

              {/* Card Footer with Diagnostic Module and Primary Bookmark Button */}
              <div className="mt-4 pt-4 border-t border-[#1E293B] flex items-center justify-between font-mono gap-2 flex-wrap">
                <span className="text-xs text-[#60A5FA] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold uppercase tracking-wider">
                  Launch Diagnostic Module
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>

                <button
                  type="button"
                  id={`btn-bookmark-card-${c.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(c.id);
                  }}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider border flex items-center gap-1.5 transition-all cursor-pointer ${
                    isBookmarked
                      ? 'bg-[#60A5FA] text-[#090D16] border-[#60A5FA] font-bold shadow-sm'
                      : 'bg-[#131B2E] text-[#94A3B8] border-[#25334D] hover:border-[#60A5FA] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {isBookmarked ? 'bookmark' : 'bookmark_border'}
                  </span>
                  <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
