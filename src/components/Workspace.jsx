import React, { useState, useRef } from 'react';
import { MEDICAL_CASES } from '../data/cases';

export const Workspace = ({
  selectedCaseId,
  onSelectCase,
  onNavigate
}) => {
  const currentCase =
    MEDICAL_CASES.find((c) => c.id === selectedCaseId) || MEDICAL_CASES[0];

  // Viewer image adjustments
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [invert, setInvert] = useState(false);

  // Overlay toggles
  const [showRoi, setShowRoi] = useState(true);
  const [showAnatomy, setShowAnatomy] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [annotationMode, setAnnotationMode] = useState(false);

  // Custom User Annotations
  const [userAnnotations, setUserAnnotations] = useState([]);
  const [activeHoveredRegion, setActiveHoveredRegion] = useState(null);
  const [selectedRegionId, setSelectedRegionId] = useState(null);

  // Inspector Tab
  const [activeTab, setActiveTab] = useState('findings');

  // Quiz state for this case
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState({});

  // Custom uploaded case
  const [customImage, setCustomImage] = useState(null);
  const [customImageName, setCustomImageName] = useState('');
  const fileInputRef = useRef(null);
  const viewportRef = useRef(null);

  // Reset viewport controls
  const handleResetAdjustments = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setContrast(100);
    setBrightness(100);
    setInvert(false);
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(3.5, z + 0.25));
  const handleZoomOut = () => setZoom((z) => Math.max(0.75, z - 0.25));

  // Panning handlers
  const handleMouseDown = (e) => {
    if (annotationMode) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Custom annotation pin drop
  const handleImageClick = (e) => {
    if (!annotationMode || !viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const label = prompt('Enter annotation label (e.g., "Cortical Disruption", "Soft Tissue Swelling"):');
    if (!label) return;
    const note = prompt('Enter clinical note/observation:') || '';

    const newAnnotation = {
      id: `annot-${Date.now()}`,
      xPercent: Math.max(2, Math.min(98, x)),
      yPercent: Math.max(2, Math.min(98, y)),
      label,
      note,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setUserAnnotations([...userAnnotations, newAnnotation]);
    setAnnotationMode(false);
  };

  const handleDeleteAnnotation = (id, e) => {
    e.stopPropagation();
    setUserAnnotations(userAnnotations.filter((a) => a.id !== id));
  };

  // Handle custom image upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result);
          setCustomImageName(file.name);
          handleResetAdjustments();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Active displayed image
  const displayImageUrl = customImage || currentCase.imageUrl;

  return (
    <div className="pt-16 min-h-screen bg-[#090D16] flex flex-col text-white">
      {/* Workspace Top Action Bar */}
      <div className="bg-[#0F172A] border-b border-[#1E293B] px-6 py-2.5 flex items-center justify-between z-20 font-mono">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#60A5FA] px-2.5 py-1 bg-[#162035] hover:bg-[#1E293B] border border-[#25334D] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Index
          </button>

          <div className="h-4 w-px bg-[#1E293B]"></div>

          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-none bg-[#60A5FA] animate-pulse"></span>
            <span className="text-[#60A5FA] font-bold tracking-wider uppercase text-[11px]">
              {customImage ? `CUSTOM // ${customImageName}` : `CASE // ${currentCase.title}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('case-library')}
            className="text-xs text-[#94A3B8] hover:text-[#60A5FA] flex items-center gap-1.5 transition-colors px-2 py-1 uppercase tracking-wider cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">grid_view</span>
            Archive
          </button>
          <button
            onClick={() => onNavigate('quizzes')}
            className="text-xs text-[#94A3B8] hover:text-[#60A5FA] flex items-center gap-1.5 transition-colors px-2 py-1 uppercase tracking-wider cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">school</span>
            Quiz Lab
          </button>
          {customImage && (
            <button
              onClick={() => {
                setCustomImage(null);
                setCustomImageName('');
              }}
              className="text-xs text-rose-400 hover:text-white bg-rose-950/30 border border-rose-500/40 px-2 py-1 transition-colors cursor-pointer uppercase"
            >
              Exit Custom File
            </button>
          )}
        </div>
      </div>

      {/* 3-Column Diagnostic Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ============================================================ */}
        {/* LEFT COLUMN: Fixed 280px Navigation & Case List */}
        {/* ============================================================ */}
        <aside className="w-full lg:w-[280px] bg-[#0B1120] border-r border-[#1E293B] flex flex-col shrink-0 overflow-y-auto max-h-[calc(100vh-105px)] font-mono">
          {/* Section Header */}
          <div className="p-4 border-b border-[#1E293B] bg-[#0F172A]">
            <div className="text-[10px] uppercase tracking-[3px] text-[#60A5FA] font-bold mb-1">
              TRAUMA REPOSITORY
            </div>
            <div className="text-xs text-[#64748B]">
              Select Clinical Study
            </div>
          </div>

          {/* Case List */}
          <div className="p-3 space-y-2 flex-1">
            {MEDICAL_CASES.map((item) => {
              const isSelected = item.id === currentCase.id && !customImage;
              return (
                <button
                  key={item.id}
                  id={`case-card-${item.id}`}
                  onClick={() => {
                    setCustomImage(null);
                    onSelectCase(item.id);
                  }}
                  className={`w-full text-left p-3 border transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#162035] border-[#60A5FA] text-white shadow-lg'
                      : 'bg-[#0F172A] border-[#1E293B] hover:bg-[#131B2E] hover:border-[#25334D]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-xs font-bold truncate ${isSelected ? 'text-[#60A5FA]' : 'text-white'}`}>
                      {item.shortTitle}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 border uppercase ${
                        item.difficulty === 'Introductory'
                          ? 'bg-[#60A5FA]/10 text-[#60A5FA] border-[#60A5FA]/40'
                          : item.difficulty === 'Intermediate'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {item.difficulty}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#94A3B8] font-sans line-clamp-2 leading-relaxed">
                    {item.description}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-[#64748B]">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>{item.patientAge}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Upload Custom X-Ray Box */}
          <div className="p-3 border-t border-[#1E293B] bg-[#06080E]">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 border border-dashed border-[#60A5FA]/40 hover:border-[#60A5FA] bg-[#0F172A] hover:bg-[#131B2E] text-center transition-colors group cursor-pointer"
            >
              <div className="w-8 h-8 bg-[#162035] border border-[#25334D] flex items-center justify-center mx-auto mb-2 group-hover:border-[#60A5FA] transition-colors">
                <span className="material-symbols-outlined text-[#60A5FA] text-lg">
                  upload_file
                </span>
              </div>
              <div className="text-xs font-bold text-white group-hover:text-[#60A5FA]">
                UPLOAD CUSTOM FILE
              </div>
              <div className="text-[9px] text-[#64748B] mt-0.5">
                DICOM / JPEG / PNG
              </div>
            </button>
          </div>

          {/* Patient Profile Card */}
          {!customImage && (
            <div className="p-3.5 border-t border-[#1E293B] bg-[#0F172A] text-xs space-y-2">
              <div className="text-[#60A5FA] font-bold uppercase tracking-wider text-[10px]">
                Patient Demographics
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px] text-[#94A3B8]">
                <div>
                  <span className="text-[#64748B]">Age/Sex:</span> {currentCase.patientAge}, {currentCase.patientGender}
                </div>
                <div>
                  <span className="text-[#64748B]">Modality:</span> {currentCase.modality.split(' ')[0]}
                </div>
                <div className="col-span-2">
                  <span className="text-[#64748B]">Views:</span> {currentCase.projection}
                </div>
              </div>
              <div className="text-[11px] text-[#94A3B8] font-sans border-t border-[#1E293B] pt-2 leading-relaxed">
                <span className="text-[#64748B] font-mono block mb-0.5 text-[10px]">PRESENTATION:</span>
                {currentCase.clinicalHistory}
              </div>
            </div>
          )}
        </aside>

        {/* ============================================================ */}
        {/* CENTER VIEWPORT: Radiological Image & Diagnostic Tools */}
        {/* ============================================================ */}
        <main className="flex-1 bg-[#06080E] flex flex-col overflow-hidden relative">
          {/* Radiologic Controls Bar */}
          <div className="bg-[#0F172A] border-b border-[#1E293B] p-3 flex flex-wrap items-center justify-between gap-3 z-10 font-mono">
            {/* View & Tool Toggles */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                id="btn-toggle-roi"
                onClick={() => setShowRoi(!showRoi)}
                className={`px-2.5 py-1.5 text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                  showRoi
                    ? 'bg-[#60A5FA] text-[#090D16] font-bold border-[#60A5FA]'
                    : 'bg-[#131B2E] border-[#25334D] text-[#94A3B8] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">crop_free</span>
                ROI BOX
              </button>

              <button
                id="btn-toggle-anatomy"
                onClick={() => setShowAnatomy(!showAnatomy)}
                className={`px-2.5 py-1.5 text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                  showAnatomy
                    ? 'bg-[#60A5FA] text-[#090D16] font-bold border-[#60A5FA]'
                    : 'bg-[#131B2E] border-[#25334D] text-[#94A3B8] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">scatter_plot</span>
                ANATOMY PINS
              </button>

              <button
                id="btn-toggle-calipers"
                onClick={() => setShowMeasurements(!showMeasurements)}
                className={`px-2.5 py-1.5 text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                  showMeasurements
                    ? 'bg-[#60A5FA] text-[#090D16] font-bold border-[#60A5FA]'
                    : 'bg-[#131B2E] border-[#25334D] text-[#94A3B8] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">straighten</span>
                CALIPERS
              </button>

              <button
                id="btn-toggle-annotate"
                onClick={() => setAnnotationMode(!annotationMode)}
                className={`px-2.5 py-1.5 text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                  annotationMode
                    ? 'bg-amber-400 text-black font-bold border-amber-400'
                    : 'bg-[#131B2E] border-[#25334D] text-[#94A3B8] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">edit_location</span>
                {annotationMode ? 'CLICK IMAGE TO PIN' : 'ADD PIN'}
              </button>
            </div>

            {/* Contrast / Brightness / Invert / Zoom Sliders */}
            <div className="flex items-center gap-3 flex-wrap text-xs">
              {/* Invert */}
              <button
                onClick={() => setInvert(!invert)}
                title="Invert film density (Positive/Negative)"
                className={`px-2 py-1 border flex items-center gap-1 cursor-pointer ${
                  invert
                    ? 'bg-[#60A5FA] text-[#090D16] border-[#60A5FA] font-bold'
                    : 'bg-[#131B2E] border-[#25334D] text-[#94A3B8] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">contrast</span>
                INVERT
              </button>

              {/* Contrast */}
              <div className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
                <span>C:</span>
                <input
                  type="range"
                  min="60"
                  max="180"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-16 h-1 accent-[#60A5FA] cursor-pointer"
                  title="Contrast adjustment"
                />
              </div>

              {/* Brightness */}
              <div className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
                <span>B:</span>
                <input
                  type="range"
                  min="60"
                  max="160"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-16 h-1 accent-[#60A5FA] cursor-pointer"
                  title="Brightness adjustment"
                />
              </div>

              {/* Zoom In / Out / Reset */}
              <div className="flex items-center gap-1 bg-[#131B2E] p-0.5 border border-[#25334D]">
                <button
                  onClick={handleZoomOut}
                  className="p-1 hover:bg-[#1E293B] text-[#94A3B8] hover:text-white cursor-pointer"
                  title="Zoom out"
                >
                  <span className="material-symbols-outlined text-sm">zoom_out</span>
                </button>
                <span className="text-[10px] px-1 text-[#60A5FA] font-bold">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-1 hover:bg-[#1E293B] text-[#94A3B8] hover:text-white cursor-pointer"
                  title="Zoom in"
                >
                  <span className="material-symbols-outlined text-sm">zoom_in</span>
                </button>
              </div>

              <button
                onClick={handleResetAdjustments}
                className="text-[10px] text-[#64748B] hover:text-[#60A5FA] underline px-1 cursor-pointer uppercase"
                title="Reset adjustments"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Main X-ray Canvas Viewport */}
          <div
            ref={viewportRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleImageClick}
            className={`flex-1 flex items-center justify-center p-4 overflow-hidden relative select-none ${
              annotationMode ? 'cursor-crosshair' : isPanning ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {/* Background Grid Accent Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
              <div className="w-full h-full border border-white/10 grid grid-cols-6 grid-rows-6"></div>
            </div>

            {/* The Image Container with Scale and Pan */}
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transition: isPanning ? 'none' : 'transform 0.15s ease-out'
              }}
              className="relative max-w-[650px] max-h-[550px] w-full h-full flex items-center justify-center"
            >
              <div className="relative overflow-hidden border border-[#25334D] shadow-2xl bg-black inline-block">
                <img
                  src={displayImageUrl}
                  alt={currentCase.title}
                  referrerPolicy="no-referrer"
                  style={{
                    filter: `contrast(${contrast}%) brightness(${brightness}%) ${invert ? 'invert(1)' : ''}`
                  }}
                  className="max-h-[500px] w-auto max-w-full object-contain pointer-events-none transition-filter duration-200"
                />

                {/* SVG Calibration & Measurement Lines Overlay */}
                {showMeasurements && !customImage && currentCase.id === 'distal-radius-fracture' && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    {/* Dorsal tilt baseline vs fracture surface line */}
                    <line
                      x1="32%"
                      y1="56%"
                      x2="68%"
                      y2="56%"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                    <line
                      x1="34%"
                      y1="53%"
                      x2="66%"
                      y2="61%"
                      stroke="#60A5FA"
                      strokeWidth="2.5"
                    />
                    {/* Angle annotation label */}
                    <rect
                      x="68%"
                      y="53%"
                      width="115"
                      height="22"
                      fill="#090D16"
                      stroke="#60A5FA"
                      strokeWidth="1"
                    />
                    <text
                      x="70%"
                      y="67%"
                      fill="#60A5FA"
                      fontSize="10"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      TILT: 18° DORSAL
                    </text>
                  </svg>
                )}

                {/* Simulated ROI Bounding Box Overlay in Light Navy Blue */}
                {showRoi && !customImage && (
                  <div
                    style={{
                      left: `${currentCase.primaryRoi.xPercent}%`,
                      top: `${currentCase.primaryRoi.yPercent}%`,
                      width: `${currentCase.primaryRoi.widthPercent}%`,
                      height: `${currentCase.primaryRoi.heightPercent}%`
                    }}
                    className="absolute border-2 border-[#60A5FA] border-dashed bg-[#60A5FA]/15 pointer-events-none z-10 transition-all duration-300"
                  >
                    {/* 4 Corner Handles */}
                    <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#60A5FA]"></div>
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#60A5FA]"></div>
                    <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#60A5FA]"></div>
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#60A5FA]"></div>

                    {/* Badge */}
                    <div className="absolute -top-7 left-0 bg-[#090D16] border border-[#60A5FA] text-[#60A5FA] text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider shadow-lg whitespace-nowrap flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#60A5FA] animate-ping"></span>
                      {currentCase.primaryRoi.label}
                    </div>
                  </div>
                )}

                {/* Anatomical Pins Overlay */}
                {showAnatomy &&
                  !customImage &&
                  currentCase.anatomicalRegions.map((region) => {
                    const isHovered = activeHoveredRegion === region.id || selectedRegionId === region.id;
                    return (
                      <div
                        key={region.id}
                        style={{
                          left: `${region.xPercent}%`,
                          top: `${region.yPercent}%`
                        }}
                        onMouseEnter={() => setActiveHoveredRegion(region.id)}
                        onMouseLeave={() => setActiveHoveredRegion(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRegionId(region.id);
                          setActiveTab('anatomy');
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-transform ${
                          isHovered ? 'scale-125' : 'hover:scale-110'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 flex items-center justify-center font-mono text-[10px] font-bold border transition-colors ${
                            isHovered
                              ? 'bg-[#60A5FA] text-[#090D16] border-[#60A5FA] ring-4 ring-[#60A5FA]/30'
                              : 'bg-[#090D16] text-[#60A5FA] border-[#60A5FA]'
                          }`}
                        >
                          {region.name.charAt(0)}
                        </div>

                        {/* Hover Tooltip Card */}
                        {isHovered && (
                          <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-52 p-3 bg-[#0F172A] border border-[#60A5FA] text-left pointer-events-none z-30 shadow-2xl font-mono">
                            <div className="text-xs font-bold text-[#60A5FA] uppercase">
                              {region.name}
                            </div>
                            {region.latinName && (
                              <div className="text-[10px] italic text-[#94A3B8] font-sans">
                                {region.latinName}
                              </div>
                            )}
                            <div className="text-[10px] text-[#E2E8F0] font-sans mt-1.5 leading-snug">
                              {region.clinicalSignificance}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                {/* Custom User Annotation Pins */}
                {userAnnotations.map((annot) => (
                  <div
                    key={annot.id}
                    style={{
                      left: `${annot.xPercent}%`,
                      top: `${annot.yPercent}%`
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer font-mono"
                  >
                    <div className="w-6 h-6 bg-amber-400 text-black flex items-center justify-center text-[10px] font-bold shadow-lg border border-white">
                      ★
                    </div>
                    <div className="hidden group-hover:block absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-48 p-2.5 bg-[#090D16] border border-amber-400 text-xs text-left shadow-2xl">
                      <div className="flex items-center justify-between font-bold text-amber-300 text-[10px] uppercase">
                        <span>{annot.label}</span>
                        <button
                          onClick={(e) => handleDeleteAnnotation(annot.id, e)}
                          className="text-rose-400 hover:text-white"
                          title="Delete note"
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-[10px] text-[#CBD5E1] font-sans mt-1">{annot.note}</p>
                      <span className="text-[9px] text-[#64748B] mt-1 block">
                        {annot.createdAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Canvas Bottom-Right Diagnostic HUD */}
            <div className="absolute bottom-3 right-4 flex items-center gap-2 bg-[#0F172A] px-3 py-1.5 border border-[#1E293B] text-[10px] font-mono text-[#94A3B8] pointer-events-none uppercase">
              <span>Zoom: {Math.round(zoom * 100)}%</span>
              <span>//</span>
              <span>C: {contrast}%</span>
              <span>//</span>
              <span>B: {brightness}%</span>
              {invert && <span className="text-[#60A5FA]">// INVERTED</span>}
            </div>
          </div>
        </main>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Fixed 320px Diagnostic Inspector & Data Engine */}
        {/* ============================================================ */}
        <aside className="w-full lg:w-[320px] bg-[#0B1120] border-l border-[#1E293B] flex flex-col shrink-0 overflow-y-auto max-h-[calc(100vh-105px)] font-mono">
          {/* Tab Navigation */}
          <div className="flex border-b border-[#1E293B] bg-[#0F172A]">
            <button
              onClick={() => setActiveTab('findings')}
              className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                activeTab === 'findings'
                  ? 'border-[#60A5FA] text-[#60A5FA] bg-[#162035]'
                  : 'border-transparent text-[#64748B] hover:text-white'
              }`}
            >
              Findings
            </button>
            <button
              onClick={() => setActiveTab('anatomy')}
              className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                activeTab === 'anatomy'
                  ? 'border-[#60A5FA] text-[#60A5FA] bg-[#162035]'
                  : 'border-transparent text-[#64748B] hover:text-white'
              }`}
            >
              Anatomy
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                activeTab === 'quiz'
                  ? 'border-[#60A5FA] text-[#60A5FA] bg-[#162035]'
                  : 'border-transparent text-[#64748B] hover:text-white'
              }`}
            >
              Quiz
            </button>
            <button
              onClick={() => setActiveTab('pearls')}
              className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                activeTab === 'pearls'
                  ? 'border-[#60A5FA] text-[#60A5FA] bg-[#162035]'
                  : 'border-transparent text-[#64748B] hover:text-white'
              }`}
            >
              Pearls
            </button>
          </div>

          {/* TAB 1: Structured Radiological Findings */}
          {activeTab === 'findings' && (
            <div className="p-4 space-y-5 text-xs">
              {/* Classification Badge */}
              <div className="p-3 bg-[#0F172A] border border-[#25334D]">
                <div className="text-[10px] text-[#60A5FA] uppercase tracking-wider font-bold">
                  {currentCase.classification.system}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {currentCase.classification.type}
                </div>
                <p className="text-[#94A3B8] font-sans mt-1 text-[11px] leading-relaxed">
                  {currentCase.classification.description}
                </p>
              </div>

              {/* Impression */}
              <div>
                <div className="text-[#60A5FA] uppercase text-[10px] tracking-wider mb-1.5 flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-sm">clinical_notes</span>
                  Radiographic Impression
                </div>
                <div className="p-2.5 bg-[#0F172A] border border-[#1E293B] text-[#E2E8F0] leading-relaxed font-sans text-xs">
                  {currentCase.impression}
                </div>
              </div>

              {/* Orthopedic Measurements Table */}
              <div>
                <div className="text-[#60A5FA] uppercase text-[10px] tracking-wider mb-2 flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-sm">tune</span>
                  Orthopedic Calipers
                </div>
                <div className="space-y-2">
                  {currentCase.measurements.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-[#0F172A] border border-[#1E293B]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[11px]">
                          {m.name}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 uppercase font-bold border ${
                            m.status === 'abnormal'
                              ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                              : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          {m.measuredValue}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#64748B] mt-0.5">
                        Normal: {m.normalRange}
                      </div>
                      <div className="text-[11px] text-[#94A3B8] font-sans mt-1 leading-snug">
                        {m.interpretation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Findings List */}
              <div>
                <div className="text-[#60A5FA] uppercase text-[10px] tracking-wider mb-2 flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-sm">list_alt</span>
                  Radiographic Findings
                </div>
                <ul className="space-y-2 font-sans">
                  {currentCase.findings.map((finding, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-[#94A3B8] text-[11px] leading-relaxed"
                    >
                      <span className="text-[#60A5FA] font-mono font-bold">•</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: Interactive Anatomy Explorer */}
          {activeTab === 'anatomy' && (
            <div className="p-4 space-y-3">
              <div className="text-[11px] text-[#94A3B8] font-sans mb-2 leading-relaxed">
                Click any anatomical landmark below to inspect position and review clinical significance.
              </div>

              <div className="space-y-2">
                {currentCase.anatomicalRegions.map((region) => {
                  const isSelected = selectedRegionId === region.id;
                  return (
                    <div
                      key={region.id}
                      onClick={() => {
                        setSelectedRegionId(region.id);
                        setActiveHoveredRegion(region.id);
                      }}
                      className={`p-3 border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#162035] border-[#60A5FA]'
                          : 'bg-[#0F172A] border-[#1E293B] hover:border-[#25334D]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className={`font-bold text-xs ${isSelected ? 'text-[#60A5FA]' : 'text-white'}`}>
                          {region.name}
                        </div>
                        <span className="w-5 h-5 bg-[#162035] text-[#60A5FA] flex items-center justify-center text-[10px] font-bold border border-[#25334D]">
                          {region.name.charAt(0)}
                        </span>
                      </div>
                      {region.latinName && (
                        <div className="text-[10px] italic text-[#64748B] font-sans mb-1">
                          {region.latinName}
                        </div>
                      )}
                      <p className="text-[11px] text-[#94A3B8] font-sans mb-1.5 leading-snug">
                        {region.description}
                      </p>
                      <div className="text-[10px] text-[#E2E8F0] bg-[#090D16] p-2 border border-[#1E293B] leading-snug">
                        <strong className="block text-[#60A5FA] mb-0.5 uppercase">Clinical Note:</strong>
                        <span className="font-sans text-[11px]">{region.clinicalSignificance}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Diagnostic Case Quiz */}
          {activeTab === 'quiz' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                <span className="text-[11px] text-[#60A5FA] uppercase tracking-wider font-bold">
                  Diagnostic Quiz
                </span>
                <span className="text-[10px] bg-[#162035] border border-[#25334D] px-2 py-0.5 text-white">
                  {currentCase.quizQuestions.length} Questions
                </span>
              </div>

              {currentCase.quizQuestions.map((q, qIndex) => {
                const selectedOption = quizAnswers[q.id];
                const isSubmitted = quizSubmitted[q.id];
                const isCorrect = selectedOption === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-3 bg-[#0F172A] border border-[#1E293B] space-y-2.5 text-xs"
                  >
                    <div className="font-bold text-white leading-relaxed">
                      <span className="text-[#60A5FA] mr-1">Q{qIndex + 1}.</span>
                      {q.question}
                    </div>

                    <div className="space-y-1.5">
                      {q.options.map((opt, optIndex) => {
                        let btnStyle =
                          'bg-[#131B2E] border-[#25334D] text-[#94A3B8] hover:bg-[#162035] hover:text-white';
                        if (isSubmitted) {
                          if (optIndex === q.correctIndex) {
                            btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200';
                          } else if (selectedOption === optIndex) {
                            btnStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                          }
                        } else if (selectedOption === optIndex) {
                          btnStyle = 'bg-[#60A5FA] border-[#60A5FA] text-[#090D16] font-bold';
                        }

                        return (
                          <button
                            key={optIndex}
                            disabled={isSubmitted}
                            onClick={() =>
                              setQuizAnswers({ ...quizAnswers, [q.id]: optIndex })
                            }
                            className={`w-full text-left p-2 border text-[11px] leading-snug transition-all cursor-pointer ${btnStyle}`}
                          >
                            <span className="font-bold mr-1.5">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {!isSubmitted ? (
                      <button
                        disabled={selectedOption === undefined}
                        onClick={() =>
                          setQuizSubmitted({ ...quizSubmitted, [q.id]: true })
                        }
                        className="w-full mt-1 bg-[#60A5FA] disabled:opacity-30 text-[#090D16] py-1.5 font-bold uppercase text-[10px] tracking-wider cursor-pointer hover:bg-white transition-colors"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <div
                        className={`p-2 border text-[11px] leading-relaxed font-sans ${
                          isCorrect
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                            : 'bg-rose-950/40 border-rose-500 text-rose-200'
                        }`}
                      >
                        <div className="font-mono font-bold mb-1 flex items-center gap-1 text-[10px] uppercase">
                          <span className="material-symbols-outlined text-sm">
                            {isCorrect ? 'check_circle' : 'cancel'}
                          </span>
                          {isCorrect ? 'Correct Assessment' : 'Incorrect Assessment'}
                        </div>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: Teaching Pearls & Pitfalls */}
          {activeTab === 'pearls' && (
            <div className="p-4 space-y-4 text-xs">
              <div className="text-[11px] uppercase tracking-wider text-[#60A5FA] font-bold">
                Clinical Pearls &amp; Pitfalls
              </div>

              <div className="space-y-3 font-sans">
                {currentCase.teachingPoints.map((pearl, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#0F172A] border border-[#1E293B] flex items-start gap-2.5"
                  >
                    <span className="material-symbols-outlined text-[#60A5FA] text-base shrink-0 mt-0.5">
                      lightbulb
                    </span>
                    <div className="text-[11px] text-[#CBD5E1] leading-relaxed">
                      {pearl}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#090D16] border border-[#60A5FA] text-[#60A5FA] space-y-1">
                <div className="font-mono font-bold flex items-center gap-1 text-[11px] uppercase">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  Trauma Pitfall Warning
                </div>
                <p className="text-[10px] text-[#E2E8F0] font-sans leading-relaxed">
                  Always document a thorough neurovascular assessment (radial, median, ulnar sensory/motor) prior to any cast application or manipulation!
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
