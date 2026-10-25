import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MEDICAL_CASES } from '../data/cases';
import { useStudyStore } from '../store/useStudyStore';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const MyCases = () => {
  const { user, toggleSaveCase, showToast } = useAuth();
  const { bookmarks, toggleBookmark } = useStudyStore();
  const navigate = useNavigate();

  // Custom cases saved via useLocalStorage keyed by user id
  const storageKey = `radiscan_custom_cases_${user?.id || 'guest'}`;
  const [customCases, setCustomCases] = useLocalStorage(storageKey, []);

  // Filter view state: 'all' | 'custom' | 'bookmarked'
  const [filterView, setFilterView] = useState('all');

  // State for conditional rendering of delete confirmation: stores the ID of the case being deleted
  const [deletingCaseId, setDeletingCaseId] = useState(null);

  // Combine auth saved cases and StudyStore bookmarks
  const savedIds = Array.from(new Set([...(user?.savedCases || []), ...bookmarks]));
  const bookmarkedCases = MEDICAL_CASES.filter((c) => savedIds.includes(c.id));

  // Handler to delete custom case
  const handleDeleteCustomCase = (caseId, title) => {
    setCustomCases((prev) => prev.filter((c) => c.id !== caseId));
    setDeletingCaseId(null);
    if (showToast) {
      showToast(`Case "${title || 'Custom Case'}" deleted from local storage.`, 'info');
    }
  };

  const totalCasesCount = customCases.length + bookmarkedCases.length;

  return (
    <main className="pt-24 pb-28 min-h-screen bg-[#090D16] text-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1E293B]">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-xs font-mono text-[#94A3B8] hover:text-[#60A5FA] uppercase tracking-wider transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Return to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
            <span className="w-2 h-2 rounded-full bg-[#60A5FA] animate-pulse"></span>
            <span>STORED LOCALLY: {totalCasesCount} CASE(S) (KEY: {storageKey})</span>
          </div>
        </div>

        {/* Title & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-[#60A5FA]"></span>
              <span className="font-mono text-xs uppercase tracking-[3px] text-[#60A5FA]">
                PROTECTED ROUTE // CASE COLLECTION
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-syne">
              My Saved &amp; Custom Cases
            </h1>
            <p className="text-xs text-[#94A3B8] font-mono mt-1">
              Personal radiographic archive and user-created trauma cases for {user?.name || 'Practitioner'}.
            </p>
          </div>

          {/* Primary Create New Case CTA Button (Links to /my-cases/new) */}
          <Link
            to="/my-cases/new"
            id="btn-create-case"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#60A5FA] text-[#090D16] hover:bg-white font-mono font-bold text-xs uppercase tracking-[1.5px] transition-all self-start md:self-auto cursor-pointer shadow-lg"
          >
            <span className="material-symbols-outlined text-base font-bold">add</span>
            <span>Create New Case</span>
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-8 font-mono text-xs overflow-x-auto pb-1">
          <button
            onClick={() => setFilterView('all')}
            className={`px-4 py-2 uppercase tracking-wider border cursor-pointer transition-all ${
              filterView === 'all'
                ? 'bg-[#60A5FA] text-[#090D16] font-bold border-[#60A5FA]'
                : 'bg-[#0F172A] text-[#94A3B8] border-[#1E293B] hover:text-white'
            }`}
          >
            All Cases ({totalCasesCount})
          </button>
          <button
            onClick={() => setFilterView('custom')}
            className={`px-4 py-2 uppercase tracking-wider border cursor-pointer transition-all ${
              filterView === 'custom'
                ? 'bg-[#60A5FA] text-[#090D16] font-bold border-[#60A5FA]'
                : 'bg-[#0F172A] text-[#94A3B8] border-[#1E293B] hover:text-white'
            }`}
          >
            Created Cases ({customCases.length})
          </button>
          <button
            onClick={() => setFilterView('bookmarked')}
            className={`px-4 py-2 uppercase tracking-wider border cursor-pointer transition-all ${
              filterView === 'bookmarked'
                ? 'bg-[#60A5FA] text-[#090D16] font-bold border-[#60A5FA]'
                : 'bg-[#0F172A] text-[#94A3B8] border-[#1E293B] hover:text-white'
            }`}
          >
            Bookmarked Archive ({bookmarkedCases.length})
          </button>
        </div>

        {/* Empty State */}
        {totalCasesCount === 0 ? (
          <div className="p-12 bg-[#0B1120] border border-[#1E293B] text-center space-y-4">
            <div className="w-16 h-16 bg-[#162035] border border-[#25334D] text-[#64748B] mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">post_add</span>
            </div>
            <h3 className="text-xl font-bold uppercase text-white font-syne">
              No Cases Saved Yet
            </h3>
            <p className="text-xs text-[#94A3B8] max-w-md mx-auto leading-relaxed">
              Create your own clinical case with custom radiographs and findings, or bookmark cases from the clinical archive.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                to="/my-cases/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#60A5FA] text-[#090D16] font-mono font-bold text-xs uppercase tracking-[1.5px] hover:bg-white transition-all"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Create Your Own Case</span>
              </Link>
              <Link
                to="/case-library"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#131B2E] text-white border border-[#25334D] hover:border-[#60A5FA] font-mono text-xs uppercase tracking-[1.5px] transition-all"
              >
                <span>Browse Archive</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Section 1: User Created Cases */}
            {(filterView === 'all' || filterView === 'custom') && customCases.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1E293B]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-[#60A5FA]">assignment</span>
                    <h2 className="text-base font-bold uppercase text-white font-mono tracking-wider">
                      User Created Cases ({customCases.length})
                    </h2>
                  </div>
                  <Link
                    to="/my-cases/new"
                    className="text-xs font-mono text-[#60A5FA] hover:underline flex items-center gap-1 uppercase"
                  >
                    <span>+ New Case</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customCases.map((caseItem) => (
                    <div
                      key={caseItem.id}
                      className="bg-[#0B1120] border border-[#1E293B] hover:border-[#60A5FA] transition-all flex flex-col justify-between overflow-hidden group relative"
                    >
                      <div>
                        {/* Image Preview Container */}
                        <div className="h-48 bg-[#06080E] border-b border-[#1E293B] overflow-hidden relative">
                          <img
                            src={caseItem.imageUrl}
                            alt={caseItem.title}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          <div className="absolute top-3 left-3 bg-[#090D16]/90 border border-[#1E293B] px-2 py-0.5 font-mono text-[10px] text-[#60A5FA] uppercase tracking-wider">
                            {caseItem.region || caseItem.category}
                          </div>
                          <div className="absolute top-3 right-3 bg-emerald-950/90 border border-emerald-500/60 px-2 py-0.5 font-mono text-[9px] text-emerald-300 uppercase font-bold">
                            CUSTOM
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-3">
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                            <span
                              className={`px-2 py-0.5 border uppercase font-bold text-[9px] ${
                                caseItem.difficulty === 'Introductory'
                                  ? 'bg-[#60A5FA]/10 text-[#60A5FA] border-[#60A5FA]/40'
                                  : caseItem.difficulty === 'Intermediate'
                                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                                  : 'bg-rose-500/10 text-rose-300 border-rose-500/40'
                              }`}
                            >
                              {caseItem.difficulty}
                            </span>
                            <span>{new Date(caseItem.createdAt || Date.now()).toLocaleDateString()}</span>
                          </div>

                          <h3 className="text-lg font-bold text-white uppercase group-hover:text-[#60A5FA] transition-colors leading-snug font-syne">
                            {caseItem.title}
                          </h3>

                          <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed font-sans">
                            {caseItem.description}
                          </p>

                          <div className="p-2.5 bg-[#0F172A] border border-[#1E293B] text-[11px] font-mono text-[#60A5FA]">
                            <span className="font-bold text-[#CBD5E1] mr-1">Findings:</span>
                            <span className="line-clamp-2">{caseItem.findings}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="p-6 pt-0 space-y-3">
                        {/* ========================================================================= */}
                        {/* CONDITIONAL RENDERING TO CONFIRM A DELETE:                                */}
                        {/* "Add edit and delete buttons for each case, using conditional rendering   */}
                        {/*  to confirm a delete."                                                    */}
                        {/* ========================================================================= */}
                        {deletingCaseId === caseItem.id ? (
                          <div className="p-3 bg-red-950/90 border border-red-500 font-mono text-xs space-y-2 animate-fadeIn w-full">
                            <div className="flex items-center gap-1.5 text-red-200 font-bold uppercase tracking-wider text-[11px]">
                              <span className="material-symbols-outlined text-sm">warning</span>
                              <span>Delete this clinical case?</span>
                            </div>
                            <p className="text-[11px] text-red-300 font-sans leading-tight">
                              This will permanently remove "{caseItem.title}" from your browser storage.
                            </p>
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => handleDeleteCustomCase(caseItem.id, caseItem.title)}
                                className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer text-center"
                              >
                                Confirm Delete
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingCaseId(null)}
                                className="px-3 py-1.5 bg-[#1E293B] hover:bg-[#334155] text-white text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Link
                              to={`/workspace?case=${caseItem.id}`}
                              className="flex-1 py-2.5 bg-[#60A5FA] hover:bg-white text-[#090D16] font-mono font-bold text-xs uppercase tracking-[1.5px] transition-all text-center flex items-center justify-center gap-1"
                            >
                              <span>Analyze</span>
                              <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </Link>

                            {/* Edit Button */}
                            <Link
                              to={`/my-cases/new?edit=${caseItem.id}`}
                              title="Edit this case"
                              className="px-3 py-2.5 bg-[#0F172A] border border-[#25334D] hover:border-[#60A5FA] text-[#94A3B8] hover:text-[#60A5FA] transition-colors flex items-center justify-center"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </Link>

                            {/* Delete Button (Triggers conditional rendering confirmation state) */}
                            <button
                              type="button"
                              onClick={() => setDeletingCaseId(caseItem.id)}
                              title="Delete this case"
                              className="px-3 py-2.5 bg-[#0F172A] border border-[#25334D] hover:border-red-400 text-[#94A3B8] hover:text-red-400 transition-colors cursor-pointer flex items-center justify-center"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: Bookmarked Cases from Repository */}
            {(filterView === 'all' || filterView === 'bookmarked') && bookmarkedCases.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1E293B]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-[#60A5FA]">bookmark</span>
                    <h2 className="text-base font-bold uppercase text-white font-mono tracking-wider">
                      Bookmarked Repository Cases ({bookmarkedCases.length})
                    </h2>
                  </div>
                  <Link
                    to="/case-library"
                    className="text-xs font-mono text-[#60A5FA] hover:underline flex items-center gap-1 uppercase"
                  >
                    <span>Browse Archive →</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookmarkedCases.map((caseItem) => (
                    <div
                      key={caseItem.id}
                      className="bg-[#0B1120] border border-[#1E293B] hover:border-[#60A5FA] transition-all flex flex-col justify-between overflow-hidden group"
                    >
                      <div>
                        <div className="h-48 bg-[#06080E] border-b border-[#1E293B] overflow-hidden relative">
                          <img
                            src={caseItem.imageUrl}
                            alt={caseItem.title}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 bg-[#090D16]/90 border border-[#1E293B] px-2 py-0.5 font-mono text-[10px] text-[#60A5FA] uppercase tracking-wider">
                            {caseItem.category}
                          </div>
                        </div>

                        <div className="p-6 space-y-3">
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                            <span>{caseItem.modality}</span>
                            <span>{caseItem.patientAge} / {caseItem.patientGender}</span>
                          </div>

                          <h3 className="text-lg font-bold text-white uppercase group-hover:text-[#60A5FA] transition-colors leading-snug font-syne">
                            {caseItem.title}
                          </h3>

                          <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed font-sans">
                            {caseItem.impression}
                          </p>

                          <div className="p-2.5 bg-[#0F172A] border border-[#1E293B] text-[11px] font-mono text-[#60A5FA]">
                            {caseItem.classification?.system}: {caseItem.classification?.type}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 pt-0 flex gap-2">
                        <Link
                          to={`/workspace?case=${caseItem.id}`}
                          className="flex-1 py-2.5 bg-[#60A5FA] hover:bg-white text-[#090D16] font-mono font-bold text-xs uppercase tracking-[1.5px] transition-all text-center flex items-center justify-center gap-1"
                        >
                          <span>Analyze</span>
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </Link>

                        <button
                          onClick={() => {
                            toggleSaveCase(caseItem.id);
                            if (bookmarks.includes(caseItem.id)) {
                              toggleBookmark(caseItem.id);
                            }
                          }}
                          title="Remove bookmark"
                          className="px-3 py-2.5 bg-[#0F172A] border border-[#25334D] hover:border-red-400 text-[#94A3B8] hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">bookmark_remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyCases;
