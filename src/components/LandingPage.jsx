import React, { useState } from 'react';
import radiusImg from '../assets/images/radius_fracture_xray_1787513329522.jpg';

export const LandingPage = ({ onNavigate, onSelectCase }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [interactiveBoxHovered, setInteractiveBoxHovered] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const featuredImageUrl = radiusImg;

  return (
    <main className="pt-20 pb-32 bg-[#090D16] text-white">
      {/* Light Navy Marquee Ribbon Top */}
      <div className="h-10 bg-[#60A5FA] text-[#090D16] overflow-hidden flex items-center border-y border-[#1E293B] font-mono font-bold text-xs uppercase tracking-[2px] select-none">
        <div className="marquee-container">
          <div className="px-6 whitespace-nowrap">
            RADISCAN LAB // ADVANCED RADIOGRAPHIC DECONSTRUCTION // CLINICAL ORTHOPEDIC ANATOMY // UTC+1 REAL-TIME DIAGNOSTIC REPOSITORY // RADISCAN LAB // ADVANCED RADIOGRAPHIC DECONSTRUCTION // CLINICAL ORTHOPEDIC ANATOMY // UTC+1 REAL-TIME DIAGNOSTIC REPOSITORY //
          </div>
        </div>
      </div>

      {/* Hero Section with Brutalist Layout & Artistic Flair Typography */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative">
        {/* Subtle Watermark 01 */}
        <div className="absolute top-6 left-12 text-[180px] sm:text-[240px] font-black opacity-[0.03] text-[#60A5FA] pointer-events-none select-none font-mono">
          01
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2.5 h-2.5 bg-[#60A5FA]"></span>
              <span className="font-mono text-xs uppercase tracking-[3px] text-[#60A5FA]">
                CLINICAL ORTHOPEDIC FRAMEWORK
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-[-3px] uppercase leading-[0.92] mb-8 font-syne">
              DEMYSTIFYING<br />
              <span className="text-outline">MEDICAL</span><br />
              <span>IMAGING</span>
            </h1>

            <p className="text-base sm:text-lg text-[#94A3B8] max-w-xl leading-relaxed mb-10 font-normal">
              An interactive, educational workspace for orthopedic students and clinicians to deconstruct, measure, and understand radiographic trauma with absolute clarity.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              {/* Circular Action Button from Design Theme */}
              <button
                id="btn-hero-start"
                onClick={() => onNavigate('workspace')}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-[#60A5FA] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#60A5FA] text-[#60A5FA] hover:text-[#090D16] transition-all group active:scale-95 shadow-lg shadow-[#60A5FA]/10"
              >
                <span className="material-symbols-outlined text-lg mb-1 group-hover:translate-y-[-2px] transition-transform">
                  arrow_forward
                </span>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[2px] font-bold">
                  Enter Lab
                </span>
              </button>

              <div className="flex flex-col gap-2 font-mono text-xs text-[#64748B]">
                <div className="flex items-center gap-2">
                  <span className="text-[#60A5FA] font-bold">●</span>
                  <span>4 Curated Trauma Datasets</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#60A5FA] font-bold">●</span>
                  <span>Orthopedic Angle Calipers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#60A5FA] font-bold">●</span>
                  <span>Board-Style Quiz Engine</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Rotation Grid Preview */}
          <div className="lg:col-span-4 bg-[#0F172A] border border-[#1E293B] p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
              <span className="font-mono text-[11px] uppercase tracking-[2px] text-[#64748B]">
                System Rotation
              </span>
              <span className="font-mono text-[10px] text-[#60A5FA] bg-[#60A5FA]/10 px-2 py-0.5 border border-[#60A5FA]/30">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2.5">
              <div
                onClick={() => {
                  onSelectCase('distal-radius-fracture');
                  onNavigate('workspace');
                }}
                className="p-3 bg-[#131B2E] border border-[#25334D] hover:border-[#60A5FA] transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-white group-hover:text-[#60A5FA]">
                    Radius.Fracture.01
                  </div>
                  <div className="text-[10px] font-mono text-[#94A3B8]">
                    Colles / Dorsal Tilt
                  </div>
                </div>
                <span className="text-xs font-mono text-[#60A5FA] font-bold">VIEW →</span>
              </div>

              <div
                onClick={() => {
                  onSelectCase('scaphoid-waist-fracture');
                  onNavigate('workspace');
                }}
                className="p-3 bg-[#0B1120] border border-[#1E293B] hover:border-[#60A5FA] transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-[#94A3B8] group-hover:text-[#60A5FA]">
                    Scaphoid.Occult.02
                  </div>
                  <div className="text-[10px] font-mono text-[#64748B]">
                    Herbert Type B2
                  </div>
                </div>
                <span className="text-xs font-mono text-[#64748B] group-hover:text-[#60A5FA]">LOAD →</span>
              </div>

              <div
                onClick={() => {
                  onSelectCase('anterior-shoulder-dislocation');
                  onNavigate('workspace');
                }}
                className="p-3 bg-[#0B1120] border border-[#1E293B] hover:border-[#60A5FA] transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-[#94A3B8] group-hover:text-[#60A5FA]">
                    Shoulder.Disloc.03
                  </div>
                  <div className="text-[10px] font-mono text-[#64748B]">
                    Subcoracoid / Bankart
                  </div>
                </div>
                <span className="text-xs font-mono text-[#64748B] group-hover:text-[#60A5FA]">LOAD →</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1E293B] text-[10px] font-mono text-[#64748B] leading-relaxed uppercase">
              STATUS: NOMINAL<br />
              DIAGNOSTIC FLOW: STABLE<br />
              MEASUREMENT CALIPERS: READY
            </div>
          </div>
        </div>
      </section>

      {/* Learn from the Experts Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-[#0F172A] border border-[#1E293B] p-8 md:p-12 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="font-mono text-xs uppercase tracking-[3px] text-[#60A5FA] mb-2">
                EXPERT RADIOLOGY LAB
              </div>
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-3 font-syne">
                Verified Clinical Archive
              </h2>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Access verified orthopedic trauma cases, expert-annotated landmarks, and biomechanical measurement calibration systems instantly.
              </p>
            </div>

            <button
              id="btn-explore-cases"
              onClick={() => onNavigate('case-library')}
              className="bg-[#60A5FA] text-[#090D16] hover:bg-white transition-all px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-[2px] cursor-pointer shrink-0"
            >
              Explore Repository
            </button>
          </div>
        </div>
      </section>

      {/* Why Radiscan Section - Brutalist 3-Column Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-[#1E293B]">
          <div className="font-mono text-xs uppercase tracking-[3px] text-[#60A5FA]">
            CORE CAPABILITIES
          </div>
          <div className="font-mono text-xs text-[#64748B] uppercase">
            [ ARCHITECTURE // 03 MODULES ]
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div
            onClick={() => onNavigate('case-library')}
            className="bg-[#0F172A] p-8 border border-[#1E293B] hover:border-[#60A5FA] transition-all duration-200 group cursor-pointer relative"
          >
            <div className="text-right font-mono text-xs text-[#475569] font-bold mb-4">
              01 // REPOSITORY
            </div>
            <div className="w-12 h-12 bg-[#162035] border border-[#25334D] group-hover:border-[#60A5FA] flex items-center justify-center mb-6 text-[#60A5FA] transition-colors">
              <span className="material-symbols-outlined text-xl">library_books</span>
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wide mb-3 text-white group-hover:text-[#60A5FA] transition-colors font-syne">
              Curated Case Library
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Study real clinical examples meticulously cataloged and annotated for orthopedic resident deep-dives.
            </p>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => {
              onSelectCase('distal-radius-fracture');
              onNavigate('workspace');
            }}
            className="bg-[#0F172A] p-8 border border-[#1E293B] hover:border-[#60A5FA] transition-all duration-200 group cursor-pointer relative"
          >
            <div className="text-right font-mono text-xs text-[#475569] font-bold mb-4">
              02 // INTERACTIVE
            </div>
            <div className="w-12 h-12 bg-[#162035] border border-[#25334D] group-hover:border-[#60A5FA] flex items-center justify-center mb-6 text-[#60A5FA] transition-colors">
              <span className="material-symbols-outlined text-xl">straighten</span>
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wide mb-3 text-white group-hover:text-[#60A5FA] transition-colors font-syne">
              Interactive Anatomy
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Hover over bones and landmarks to reveal clinical data, normal ranges, and fracture angle lines in real time.
            </p>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onNavigate('quizzes')}
            className="bg-[#0F172A] p-8 border border-[#1E293B] hover:border-[#60A5FA] transition-all duration-200 group cursor-pointer relative"
          >
            <div className="text-right font-mono text-xs text-[#475569] font-bold mb-4">
              03 // EVALUATION
            </div>
            <div className="w-12 h-12 bg-[#162035] border border-[#25334D] group-hover:border-[#60A5FA] flex items-center justify-center mb-6 text-[#60A5FA] transition-colors">
              <span className="material-symbols-outlined text-xl">quiz</span>
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wide mb-3 text-white group-hover:text-[#60A5FA] transition-colors font-syne">
              Self-Test Quizzes
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Challenge your diagnostic accuracy with board-style assessments based on clinical trauma scenarios.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Teaser Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-[#0F172A] border border-[#1E293B]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Text */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#162035] border border-[#25334D] text-xs font-mono text-[#60A5FA] mb-6 w-fit uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">upload_file</span>
                CUSTOM DICOM / X-RAY ENGINE
              </div>
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4 text-white font-syne">
                Analyze &amp; Deconstruct
              </h2>
              <p className="text-sm text-[#94A3B8] mb-8 leading-relaxed">
                Bring your own educational files into the workspace. Overlay region-of-interest markers, calibrate contrast and brightness for specific tissue densities, and measure angles with precision.
              </p>
              <button
                id="btn-teaser-learn-more"
                onClick={() => {
                  onSelectCase('distal-radius-fracture');
                  onNavigate('workspace');
                }}
                className="flex items-center gap-3 text-[#60A5FA] hover:text-white transition-colors text-xs font-mono uppercase tracking-[2px] font-bold group w-fit cursor-pointer"
              >
                <span>Launch Interactive Demo</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>

            {/* Right: Image with Overlay */}
            <div className="relative bg-[#06080E] h-[360px] lg:h-auto border-t lg:border-t-0 lg:border-l border-[#1E293B] overflow-hidden flex items-center justify-center p-6 sm:p-8">
              <div
                className="relative w-full max-w-md aspect-[1.34] overflow-hidden border border-[#25334D] bg-black group cursor-crosshair"
                onMouseEnter={() => setInteractiveBoxHovered(true)}
                onMouseLeave={() => setInteractiveBoxHovered(false)}
                onClick={() => {
                  onSelectCase('distal-radius-fracture');
                  onNavigate('workspace');
                }}
              >
                <img
                  alt="X-ray analyzing distal radius fracture"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  src={featuredImageUrl}
                />

                {/* Simulated Wireframe Overlay in Light Navy Blue */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Bounding Box */}
                  <div
                    className={`absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-[#60A5FA] border-dashed transition-all duration-300 ${
                      interactiveBoxHovered
                        ? 'opacity-100 bg-[#60A5FA]/15'
                        : 'opacity-70'
                    }`}
                  >
                    {/* Handles */}
                    <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#60A5FA]"></div>
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#60A5FA]"></div>
                    <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#60A5FA]"></div>
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#60A5FA]"></div>

                    {/* Label */}
                    <div className="absolute -top-8 left-0 bg-[#090D16] border border-[#60A5FA] text-[#60A5FA] text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] animate-ping"></span>
                      Distal Radius ROI
                    </div>
                  </div>
                </div>

                {/* Interactive Click Hint */}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-[#090D16] text-[10px] font-mono text-[#60A5FA] border border-[#60A5FA]/40 pointer-events-none uppercase tracking-wider">
                  CLICK TO LAUNCH WORKSPACE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-[#1E293B]">
        <div className="flex items-center justify-between mb-16">
          <div className="font-mono text-xs uppercase tracking-[3px] text-[#60A5FA]">
            WORKFLOW PROTOCOL
          </div>
          <div className="font-mono text-xs text-[#64748B] uppercase">
            3-STEP METHODOLOGY
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-[#0F172A] border border-[#1E293B] relative">
            <div className="text-4xl font-black font-mono text-[#1E293B] mb-4">
              01
            </div>
            <h3 className="text-lg font-bold uppercase tracking-wide mb-2 text-white font-syne">
              Upload / Ingest
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Upload patient X-ray series or select verified trauma specimens from the curated archive.
            </p>
          </div>

          <div className="p-6 bg-[#0F172A] border border-[#1E293B] relative">
            <div className="text-4xl font-black font-mono text-[#1E293B] mb-4">
              02
            </div>
            <h3 className="text-lg font-bold uppercase tracking-wide mb-2 text-white font-syne">
              Identify Anatomy
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Activate anatomical landmarks, inspect dorsal and volar tilts, and isolate fracture planes.
            </p>
          </div>

          <div className="p-6 bg-[#0F172A] border border-[#1E293B] relative">
            <div className="text-4xl font-black font-mono text-[#1E293B] mb-4">
              03
            </div>
            <h3 className="text-lg font-bold uppercase tracking-wide mb-2 text-white font-syne">
              Assess &amp; Calibrate
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Review radiologist impression notes, compare against normal biometric ranges, and test clinical acumen.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Case Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-[#1E293B]">
        <div className="bg-[#0F172A] p-8 lg:p-12 border border-[#1E293B] flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <div className="font-mono text-xs uppercase tracking-[3px] text-[#60A5FA] mb-2">
              FEATURED ORTHOPEDIC STUDY
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4 font-syne">
              Distal Radius Fracture
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mb-8 leading-relaxed">
              Explore this classic Colles' fracture presentation. Identify hallmark dorsal tilt angle, evaluate radial styloid shortening, and analyze biomechanical implications for reduction and fixation.
            </p>
            <button
              id="btn-view-full-case"
              onClick={() => {
                onSelectCase('distal-radius-fracture');
                onNavigate('workspace');
              }}
              className="bg-[#60A5FA] text-[#090D16] hover:bg-white transition-all px-6 py-3 text-xs font-mono font-bold uppercase tracking-[2px] cursor-pointer active:scale-95"
            >
              Launch Case in Studio →
            </button>
          </div>

          <div
            onClick={() => {
              onSelectCase('distal-radius-fracture');
              onNavigate('workspace');
            }}
            className="lg:w-1/2 w-full aspect-video bg-black border border-[#25334D] relative flex items-center justify-center cursor-pointer group"
          >
            <img
              alt="X-ray showing a distal radius fracture"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              src={featuredImageUrl}
            />
            <div className="absolute bottom-3 left-4 flex items-center gap-2 text-xs font-mono text-[#60A5FA] bg-[#090D16]/90 px-2 py-1 border border-[#60A5FA]/30">
              <span className="material-symbols-outlined text-sm">visibility</span>
              CLICK TO LAUNCH INTERACTIVE STUDY
            </div>
          </div>
        </div>
      </section>

      {/* Join the Community Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center border-t border-[#1E293B]">
        <div className="max-w-2xl mx-auto">
          <div className="font-mono text-xs uppercase tracking-[3px] text-[#60A5FA] mb-2">
            RESEARCH DISPATCH
          </div>
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4 text-white font-syne">
            Join the Clinical Network
          </h2>
          <p className="text-sm text-[#94A3B8] mb-8">
            Subscribe for newly added trauma cases, orthopedic classification updates, and resident educational briefs.
          </p>

          {subscribed ? (
            <div className="p-4 bg-[#131B2E] border border-[#60A5FA] text-[#60A5FA] font-mono text-xs max-w-md mx-auto flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-base">check_circle</span>
              SUBSCRIPTION RECORDED // RADISCAN DISPATCH ACTIVE
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                id="input-newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="clinician@institution.edu"
                className="flex-1 bg-[#0B1120] border border-[#25334D] px-4 py-3 text-xs font-mono text-white placeholder-[#64748B] focus:outline-none focus:border-[#60A5FA] transition-colors"
              />
              <button
                id="btn-newsletter-submit"
                type="submit"
                className="bg-[#60A5FA] text-[#090D16] hover:bg-white transition-colors px-6 py-3 text-xs font-mono font-bold uppercase tracking-[2px] cursor-pointer shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};
