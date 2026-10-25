import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Input } from './Input';
import {
  validateCaseTitle,
  validateRegion,
  validateDifficulty,
  validateDescription,
  validateFindings,
  validateImageUrl,
  validateCaseForm,
} from '../utils/validators';

// Sample clinical X-rays for quick testing
const PRESET_SAMPLE_IMAGES = [
  {
    label: 'Radius Fracture',
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Knee AP Series',
    url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Shoulder X-Ray',
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
  },
];

const REGION_OPTIONS = [
  'Upper Extremity',
  'Lower Extremity',
  'Spine & Pelvis',
  'Chest & Thorax',
  'Craniofacial',
  'Pediatric Trauma',
];

const DIFFICULTY_OPTIONS = ['Introductory', 'Intermediate', 'Advanced'];

export const CaseForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const { user, showToast } = useAuth();

  // Determine if editing an existing case (via /my-cases/new?edit=:id or /my-cases/edit/:id)
  const editId = params.id || searchParams.get('edit');

  // Keyed by user id as required
  const storageKey = `radiscan_custom_cases_${user?.id || 'guest'}`;
  const [customCases, setCustomCases] = useLocalStorage(storageKey, []);

  // Form Fields: title, region, difficulty, description, findings, imageUrl
  const [formData, setFormData] = useState({
    title: '',
    region: 'Upper Extremity',
    difficulty: 'Intermediate',
    description: '',
    findings: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  // If in edit mode, populate form with existing case data
  useEffect(() => {
    if (editId && customCases.length > 0) {
      const existing = customCases.find((c) => c.id === editId);
      if (existing) {
        setFormData({
          title: existing.title || '',
          region: existing.region || existing.category || 'Upper Extremity',
          difficulty: existing.difficulty || 'Intermediate',
          description: existing.description || '',
          findings: existing.findings || existing.impression || '',
          imageUrl: existing.imageUrl || '',
        });
      }
    }
  }, [editId, customCases]);

  // Handle field change and live field validation
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'imageUrl') {
      setImagePreviewError(false);
    }

    // Live validation if field has been touched
    if (touched[field]) {
      let fieldError = '';
      switch (field) {
        case 'title':
          fieldError = validateCaseTitle(value);
          break;
        case 'region':
          fieldError = validateRegion(value);
          break;
        case 'difficulty':
          fieldError = validateDifficulty(value);
          break;
        case 'description':
          fieldError = validateDescription(value);
          break;
        case 'findings':
          fieldError = validateFindings(value);
          break;
        case 'imageUrl':
          fieldError = validateImageUrl(value);
          break;
        default:
          break;
      }
      setErrors((prev) => ({ ...prev, [field]: fieldError }));
    }
  };

  // Mark field as touched on blur and run validator
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let fieldError = '';
    const val = formData[field];
    switch (field) {
      case 'title':
        fieldError = validateCaseTitle(val);
        break;
      case 'region':
        fieldError = validateRegion(val);
        break;
      case 'difficulty':
        fieldError = validateDifficulty(val);
        break;
      case 'description':
        fieldError = validateDescription(val);
        break;
      case 'findings':
        fieldError = validateFindings(val);
        break;
      case 'imageUrl':
        fieldError = validateImageUrl(val);
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      title: true,
      region: true,
      difficulty: true,
      description: true,
      findings: true,
      imageUrl: true,
    });

    // Validate entire case form using same validators
    const validationErrors = validateCaseForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      if (showToast) {
        showToast('Please fix the errors in the form before saving.', 'error');
      }
      return;
    }

    setIsSubmitting(true);

    if (editId) {
      // Update existing case in localStorage keyed by user id
      const updatedList = customCases.map((c) =>
        c.id === editId
          ? {
              ...c,
              ...formData,
              updatedAt: new Date().toISOString(),
            }
          : c
      );
      setCustomCases(updatedList);
      if (showToast) {
        showToast(`Case "${formData.title}" updated successfully!`, 'success');
      }
    } else {
      // Create new case payload
      const newCase = {
        id: `custom-case-${Date.now()}`,
        ...formData,
        category: formData.region,
        impression: formData.findings,
        userId: user?.id || 'guest',
        authorName: user?.name || 'Dr. Practitioner',
        createdAt: new Date().toISOString(),
        isCustom: true,
        anatomicalRegions: [],
        quizQuestions: [],
      };

      const updatedList = [newCase, ...customCases];
      setCustomCases(updatedList);
      if (showToast) {
        showToast(`Case "${formData.title}" created and saved locally!`, 'success');
      }
    }

    // Navigate back to /my-cases
    navigate('/my-cases');
  };

  return (
    <main className="pt-24 pb-28 min-h-screen bg-[#090D16] text-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1E293B]">
          <Link
            to="/my-cases"
            className="flex items-center gap-2 text-xs font-mono text-[#94A3B8] hover:text-[#60A5FA] uppercase tracking-wider transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Return to My Cases</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
            <span className="w-2 h-2 rounded-full bg-[#60A5FA] animate-pulse"></span>
            <span>STORAGE: radiscan_custom_cases_{user?.id || 'guest'}</span>
          </div>
        </div>

        {/* Title Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-[#60A5FA]"></span>
            <span className="font-mono text-xs uppercase tracking-[3px] text-[#60A5FA]">
              {editId ? 'CASE EDITOR // REVISION' : 'CUSTOM CASE GENERATOR // PROTOCOL'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-syne">
            {editId ? 'Edit Clinical Case' : 'Create Your Own Case'}
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-1">
            Document radiographs, biomechanical findings, and trauma classification notes. Stored locally under your user profile.
          </p>
        </div>

        {/* Clinical Form */}
        <form onSubmit={handleSubmit} noValidate className="bg-[#0B1120] border border-[#1E293B] p-6 sm:p-8 space-y-6">
          {/* Field 1: Title */}
          <div>
            <Input
              id="case-title"
              name="title"
              label="Case Title"
              placeholder="e.g. Galeazzi Fracture-Dislocation with Distal Radioulnar Disruption"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              error={touched.title ? errors.title : ''}
              required
            />
          </div>

          {/* Row: Region & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Field 2: Region */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="case-region"
                className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-1"
              >
                <span>Anatomical Region</span>
                <span className="text-[#60A5FA] font-bold">*</span>
              </label>

              <select
                id="case-region"
                name="region"
                value={formData.region}
                onChange={(e) => handleChange('region', e.target.value)}
                onBlur={() => handleBlur('region')}
                className={`w-full bg-[#0B1120] border text-sm text-[#F8FAFC] font-mono py-2.5 px-3.5 transition-all focus:outline-none cursor-pointer ${
                  touched.region && errors.region
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-[#1E293B] focus:border-[#60A5FA]'
                }`}
              >
                {REGION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#090D16] text-white">
                    {opt}
                  </option>
                ))}
              </select>

              {touched.region && errors.region && (
                <div role="alert" className="flex items-center gap-1.5 text-xs text-red-400 font-mono mt-0.5">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{errors.region}</span>
                </div>
              )}
            </div>

            {/* Field 3: Difficulty */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="case-difficulty"
                className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-1"
              >
                <span>Difficulty Rating</span>
                <span className="text-[#60A5FA] font-bold">*</span>
              </label>

              <select
                id="case-difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                onBlur={() => handleBlur('difficulty')}
                className={`w-full bg-[#0B1120] border text-sm text-[#F8FAFC] font-mono py-2.5 px-3.5 transition-all focus:outline-none cursor-pointer ${
                  touched.difficulty && errors.difficulty
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-[#1E293B] focus:border-[#60A5FA]'
                }`}
              >
                {DIFFICULTY_OPTIONS.map((diff) => (
                  <option key={diff} value={diff} className="bg-[#090D16] text-white">
                    {diff}
                  </option>
                ))}
              </select>

              {touched.difficulty && errors.difficulty && (
                <div role="alert" className="flex items-center gap-1.5 text-xs text-red-400 font-mono mt-0.5">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{errors.difficulty}</span>
                </div>
              )}
            </div>
          </div>

          {/* Field 4: Description */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="case-description"
              className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-1"
            >
              <span>Clinical Description &amp; Mechanism</span>
              <span className="text-[#60A5FA] font-bold">*</span>
            </label>
            <textarea
              id="case-description"
              name="description"
              rows={3}
              placeholder="Provide patient demographics, presentation, and trauma mechanism (e.g. 34-year-old female presenting after a high-energy fall onto an outstretched hand with severe forearm deformity)..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              className={`w-full bg-[#0B1120] border text-sm text-[#F8FAFC] placeholder-[#475569] font-mono p-3 transition-all focus:outline-none resize-y ${
                touched.description && errors.description
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-[#1E293B] focus:border-[#60A5FA]'
              }`}
            />
            {touched.description && errors.description && (
              <div role="alert" className="flex items-center gap-1.5 text-xs text-red-400 font-mono mt-0.5">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{errors.description}</span>
              </div>
            )}
          </div>

          {/* Field 5: Findings */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="case-findings"
              className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-1"
            >
              <span>Key Diagnostic Findings</span>
              <span className="text-[#60A5FA] font-bold">*</span>
            </label>
            <textarea
              id="case-findings"
              name="findings"
              rows={3}
              placeholder="Describe radiological findings: fracture line orientation, comminution, articular step-off, biomechanical angle deviation, joint congruity..."
              value={formData.findings}
              onChange={(e) => handleChange('findings', e.target.value)}
              onBlur={() => handleBlur('findings')}
              className={`w-full bg-[#0B1120] border text-sm text-[#F8FAFC] placeholder-[#475569] font-mono p-3 transition-all focus:outline-none resize-y ${
                touched.findings && errors.findings
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-[#1E293B] focus:border-[#60A5FA]'
              }`}
            />
            {touched.findings && errors.findings && (
              <div role="alert" className="flex items-center gap-1.5 text-xs text-red-400 font-mono mt-0.5">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{errors.findings}</span>
              </div>
            )}
          </div>

          {/* Field 6: Image URL */}
          <div className="space-y-3">
            <Input
              id="case-image-url"
              name="imageUrl"
              label="Radiograph Image URL"
              placeholder="https://example.com/xray-series-ap.jpg"
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              onBlur={() => handleBlur('imageUrl')}
              error={touched.imageUrl ? errors.imageUrl : ''}
              required
            />

            {/* Quick Presets for Easy Demonstrations */}
            <div className="flex items-center gap-2 flex-wrap text-xs font-mono text-[#64748B]">
              <span>Sample presets:</span>
              {PRESET_SAMPLE_IMAGES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleChange('imageUrl', preset.url)}
                  className="px-2 py-0.5 bg-[#131B2E] border border-[#25334D] hover:border-[#60A5FA] text-[#94A3B8] hover:text-white transition-colors cursor-pointer text-[10px]"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Image Preview Box */}
            {formData.imageUrl && !errors.imageUrl && (
              <div className="p-3 bg-[#090D16] border border-[#1E293B] space-y-2">
                <div className="text-[10px] font-mono uppercase text-[#64748B] tracking-wider">
                  Radiograph Preview
                </div>
                <div className="h-44 w-full bg-black flex items-center justify-center overflow-hidden border border-[#25334D] relative">
                  {!imagePreviewError ? (
                    <img
                      src={formData.imageUrl}
                      alt="Case radiograph preview"
                      onError={() => setImagePreviewError(true)}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-xs text-rose-400 font-mono flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">broken_image</span>
                      <span>Unable to load image from URL. Please check the link.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between gap-4 font-mono">
            <Link
              to="/my-cases"
              className="px-5 py-2.5 bg-[#0F172A] border border-[#25334D] hover:border-[#60A5FA] text-[#94A3B8] hover:text-white text-xs uppercase tracking-wider transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#60A5FA] hover:bg-white text-[#090D16] font-bold text-xs uppercase tracking-[1.5px] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">
                {editId ? 'save' : 'add_circle'}
              </span>
              <span>{editId ? 'Update Case' : 'Save Clinical Case'}</span>
            </button>
          </div>
        </form>

        {/* ========================================================================= */}
        {/* MANDATORY COMPLIANCE NOTE UNDER FORM:                                    */}
        // "Add a note under the form: do not use images containing patient names or IDs"
        {/* ========================================================================= */}
        <aside
          role="note"
          aria-label="Patient privacy notice"
          className="mt-6 p-4 bg-[#0B1120] border-l-4 border-amber-400 border-y border-r border-[#1E293B] flex items-start gap-3.5 shadow-sm"
        >
          <div className="w-8 h-8 rounded-none bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">privacy_tip</span>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <span>Patient Privacy &amp; De-Identification Warning</span>
              <span className="text-[10px] text-amber-400/80 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.2">
                HIPAA / GDPR
              </span>
            </div>
            <p className="text-xs text-[#CBD5E1] leading-relaxed font-sans">
              <strong>Important Notice:</strong> Do not use images containing patient names or IDs. All radiographic scans, DICOM exports, and clinical photographs must be thoroughly stripped of Protected Health Information (PHI) before publishing or storing in the system.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default CaseForm;
