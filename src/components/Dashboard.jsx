import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStudyStore } from '../store/useStudyStore';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const { bookmarks, quizHistory } = useStudyStore();
  const navigate = useNavigate();

  const totalSavedCount = Array.from(new Set([...(user?.savedCases || []), ...bookmarks])).length;

  return (
    <main className="pt-24 pb-28 min-h-screen bg-[#090D16] text-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Clinical Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E293B] mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-[#60A5FA]"></span>
              <span className="font-mono text-xs uppercase tracking-[3px] text-[#60A5FA]">
                CLINICAL PORTAL // PROTECTED DASHBOARD
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-syne">
              Welcome back, {user?.name || 'Doctor'}
            </h1>
            <p className="text-xs text-[#94A3B8] font-mono mt-1">
              {user?.role} • {user?.hospital || 'Clinical Affiliate'} • Badge #{user?.badgeId}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/workspace"
              className="px-4 py-2.5 bg-[#60A5FA] text-[#090D16] hover:bg-white font-mono text-xs font-bold uppercase tracking-[1.5px] transition-all flex items-center gap-2"
            >
              <span>Launch Workspace</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2.5 bg-[#0F172A] border border-red-500/40 text-red-400 hover:bg-red-500/10 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Diagnostic Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 bg-[#0B1120] border border-[#1E293B]">
            <div className="text-[10px] font-mono uppercase text-[#64748B] mb-1">
              Local Session
            </div>
            <div className="text-xl font-bold font-mono text-[#60A5FA]">CONNECTED</div>
            <div className="text-[10px] font-mono text-[#94A3B8] mt-1">Stored in localStorage</div>
          </div>

          <div className="p-5 bg-[#0B1120] border border-[#1E293B]">
            <div className="text-[10px] font-mono uppercase text-[#64748B] mb-1">
              Saved Trauma Cases
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {totalSavedCount} Cases
            </div>
            <Link to="/my-cases" className="text-[10px] font-mono text-[#60A5FA] hover:underline mt-1 inline-block">
              {bookmarks.length} in StudyStore →
            </Link>
          </div>

          <div className="p-5 bg-[#0B1120] border border-[#1E293B]">
            <div className="text-[10px] font-mono uppercase text-[#64748B] mb-1">
              Quiz Store History
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {quizHistory.length} Attempts
            </div>
            <Link to="/quizzes" className="text-[10px] font-mono text-[#60A5FA] hover:underline mt-1 inline-block">
              Take Diagnostic Quiz →
            </Link>
          </div>

          <div className="p-5 bg-[#0B1120] border border-[#1E293B]">
            <div className="text-[10px] font-mono uppercase text-[#64748B] mb-1">
              Diagnostic Flashcards
            </div>
            <div className="text-xl font-bold font-mono text-white">10 Calipers</div>
            <Link to="/flashcards" className="text-[10px] font-mono text-[#60A5FA] hover:underline mt-1 inline-block">
              Practice Recall →
            </Link>
          </div>
        </div>

        {/* Quick Nav Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#0F172A] border border-[#1E293B] hover:border-[#60A5FA] transition-all group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-[#162035] border border-[#25334D] text-[#60A5FA] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-xl">folder_shared</span>
              </div>
              <h3 className="text-lg font-bold uppercase text-white group-hover:text-[#60A5FA] transition-colors mb-2">
                My Saved Cases
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                Access your bookmarked radiological trauma cases and measurement logs stored in your local browser profile.
              </p>
            </div>
            <Link
              to="/my-cases"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[1.5px] text-[#60A5FA] hover:text-white"
            >
              <span>Open My Cases</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="p-6 bg-[#0F172A] border border-[#1E293B] hover:border-[#60A5FA] transition-all group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-[#162035] border border-[#25334D] text-[#60A5FA] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-xl">style</span>
              </div>
              <h3 className="text-lg font-bold uppercase text-white group-hover:text-[#60A5FA] transition-colors mb-2">
                Diagnostic Flashcards
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                Train radiographic angles, orthopedic classifications, and normal anatomical ranges through rapid-fire cards.
              </p>
            </div>
            <Link
              to="/flashcards"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[1.5px] text-[#60A5FA] hover:text-white"
            >
              <span>Launch Flashcards</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="p-6 bg-[#0F172A] border border-[#1E293B] hover:border-[#60A5FA] transition-all group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-[#162035] border border-[#25334D] text-[#60A5FA] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-xl">straighten</span>
              </div>
              <h3 className="text-lg font-bold uppercase text-white group-hover:text-[#60A5FA] transition-colors mb-2">
                Trauma Workspace
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                Deconstruct clinical X-rays, calculate fracture tilt angles, and compare against normal biomechanical thresholds.
              </p>
            </div>
            <Link
              to="/workspace"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[1.5px] text-[#60A5FA] hover:text-white"
            >
              <span>Enter Workspace</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
