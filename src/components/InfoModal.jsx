import React from 'react';

export const InfoModal = ({
  isOpen,
  title,
  content,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="bg-[#0F172A] border border-[#25334D] max-w-lg w-full p-6 shadow-2xl space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#60A5FA]"></span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-[#162035] border border-[#25334D] text-[#94A3B8] hover:text-[#60A5FA] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <p className="text-xs text-[#CBD5E1] leading-relaxed font-sans">
          {content}
        </p>

        <div className="pt-3 border-t border-[#1E293B] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#60A5FA] text-[#090D16] hover:bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[2px] transition-colors cursor-pointer"
          >
            Acknowledge &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
