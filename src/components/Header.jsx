import React from 'react';

export const Header = ({ currentView, onNavigate }) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#090D16]/90 backdrop-blur-md border-b border-[#1E293B] transition-all">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo with brutalist typographic flair */}
        <button
          id="btn-header-logo"
          onClick={() => onNavigate('landing')}
          className="text-left group flex items-center gap-3 focus:outline-none cursor-pointer"
        >
          <div className="w-8 h-8 rounded-none bg-[#0F172A] border border-[#1E293B] group-hover:border-[#60A5FA] flex items-center justify-center text-[#60A5FA] transition-colors">
            <span className="font-mono text-xs font-black">R.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-[3px] uppercase text-white group-hover:text-[#60A5FA] transition-colors">
              RADISCAN
            </span>
            <span className="text-[9px] font-mono uppercase bg-[#162035] border border-[#25334D] px-1.5 py-0.5 text-[#94A3B8] hidden sm:inline-block">
              AI // LAB
            </span>
          </div>
        </button>

        {/* Center/Right Navigation with Artistic Flair Monospace Spacing */}
        <nav className="flex items-center gap-6 sm:gap-8">
          <button
            id="btn-nav-home"
            onClick={() => onNavigate('landing')}
            className={`text-xs font-mono uppercase tracking-[2px] transition-colors cursor-pointer ${
              currentView === 'landing'
                ? 'text-[#60A5FA] font-bold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Index
          </button>
          <button
            id="btn-nav-learn"
            onClick={() => onNavigate('case-library')}
            className={`text-xs font-mono uppercase tracking-[2px] transition-colors cursor-pointer ${
              currentView === 'case-library'
                ? 'text-[#60A5FA] font-bold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Archive
          </button>
          <button
            id="btn-nav-quizzes"
            onClick={() => onNavigate('quizzes')}
            className={`text-xs font-mono uppercase tracking-[2px] transition-colors cursor-pointer ${
              currentView === 'quizzes'
                ? 'text-[#60A5FA] font-bold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Quiz Labs
          </button>

          <div className="h-4 w-px bg-[#1E293B] hidden md:block"></div>

          {/* Telemetry info */}
          <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-[#64748B] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] animate-pulse"></span>
            <span>SYSTEM ACTIVE</span>
          </div>

          <button
            id="btn-nav-workspace"
            onClick={() => onNavigate('workspace')}
            className={`text-xs font-mono uppercase tracking-[1.5px] px-3.5 py-1.5 transition-all flex items-center gap-2 cursor-pointer border ${
              currentView === 'workspace'
                ? 'bg-[#60A5FA] text-[#090D16] font-bold border-[#60A5FA]'
                : 'bg-[#0F172A] hover:bg-[#60A5FA] text-white hover:text-[#090D16] border-[#25334D] hover:border-[#60A5FA]'
            }`}
          >
            <span>Workspace</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
