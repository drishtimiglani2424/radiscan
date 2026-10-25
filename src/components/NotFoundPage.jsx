import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <main className="pt-24 pb-28 min-h-screen bg-[#090D16] text-[#F8FAFC] flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 text-center space-y-6">
        <div className="text-7xl font-mono font-black text-[#60A5FA]">404</div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white font-syne">
            Clinical Route Not Found
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono leading-relaxed">
            The requested trauma dataset or clinical endpoint does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-4 flex justify-center gap-3">
          <Link
            to="/"
            className="px-6 py-3 bg-[#60A5FA] text-[#090D16] font-mono font-bold text-xs uppercase tracking-[1.5px] hover:bg-white transition-all"
          >
            Return to Index
          </Link>
          <Link
            to="/workspace"
            className="px-6 py-3 bg-[#0F172A] border border-[#25334D] hover:border-[#60A5FA] text-white font-mono text-xs uppercase tracking-[1.5px] transition-all"
          >
            Workspace
          </Link>
        </div>
      </div>
    </main>
  );
};
