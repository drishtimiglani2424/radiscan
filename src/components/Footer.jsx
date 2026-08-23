import React from 'react';

export const Footer = ({ onNavigate, onOpenInfo }) => {
  const handleInfoClick = (title, content, e) => {
    e.preventDefault();
    if (onOpenInfo) {
      onOpenInfo(title, content);
    }
  };

  return (
    <footer className="border-t border-[#1E293B] bg-[#06080E] pt-16 pb-10 font-mono">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-1">
            <div className="text-sm font-bold tracking-[3px] text-white uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#60A5FA]"></span>
              RADISCAN AI
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
              Demystifying medical imaging through interactive orthopedic analysis and brutalist digital clarity.
            </p>
            <div className="mt-4 text-[10px] text-[#64748B] uppercase tracking-wider">
              BERLIN // LAB 2026 // EDITION 04
            </div>
          </div>

          {/* Platform Col */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[2px] text-[#60A5FA] font-bold mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-[#94A3B8]">
              <li>
                <button
                  id="footer-link-workspace"
                  onClick={() => onNavigate('workspace')}
                  className="hover:text-[#60A5FA] transition-colors cursor-pointer uppercase"
                >
                  Workspace
                </button>
              </li>
              <li>
                <button
                  id="footer-link-caselib"
                  onClick={() => onNavigate('case-library')}
                  className="hover:text-[#60A5FA] transition-colors cursor-pointer uppercase"
                >
                  Archive Library
                </button>
              </li>
              <li>
                <button
                  id="footer-link-quizzes"
                  onClick={() => onNavigate('quizzes')}
                  className="hover:text-[#60A5FA] transition-colors cursor-pointer uppercase"
                >
                  Diagnostic Quizzes
                </button>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={(e) =>
                    handleInfoClick(
                      'Educational Pricing & Access',
                      'RADISCAN AI is 100% free and open-access for medical students, radiology residents, orthopedic trainees, and educators worldwide. No subscription or credit card required.',
                      e
                    )
                  }
                  className="hover:text-[#60A5FA] transition-colors cursor-pointer uppercase"
                >
                  Access / Free Tier
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Col */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[2px] text-[#60A5FA] font-bold mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs text-[#94A3B8]">
              <li>
                <a
                  href="#documentation"
                  onClick={(e) =>
                    handleInfoClick(
                      'Radiology Platform Documentation',
                      'Comprehensive user manual detailing orthogonal X-ray projections, standard orthopedic angles (Dorsal tilt, Radial inclination, Boehler angle, Shenton line), and DICOM window leveling techniques.',
                      e
                    )
                  }
                  className="hover:text-[#60A5FA] transition-colors cursor-pointer uppercase"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#educator-guide"
                  onClick={(e) =>
                    handleInfoClick(
                      'Educator & Instructor Guide',
                      'Guides on integrating RADISCAN AI interactive radiographic modules into orthopedic surgery clerkships, anatomy lab seminars, and residency OSCE preparations.',
                      e
                    )
                  }
                  className="hover:text-[#60A5FA] transition-colors cursor-pointer uppercase"
                >
                  Educator Guide
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  onClick={(e) =>
                    handleInfoClick(
                      'RADISCAN Insights Blog',
                      'Articles covering AI applications in musculoskeletal radiology, common trauma pitfalls in emergency rooms, and pediatric bone fracture remodeling pearls.',
                      e
                    )
                  }
                  className="hover:text-[#60A5FA] transition-colors cursor-pointer uppercase"
                >
                  Clinical Insights
                </a>
              </li>
              <li>
                <a
                  href="#support"
                  onClick={(e) =>
                    handleInfoClick(
                      'Clinical Support & Inquiries',
                      'Reach out to our clinical engineering team for curriculum customization, new radiographic case submissions, or technical assistance at support@radiscan-ai.edu.',
                      e
                    )
                  }
                  className="hover:text-[#60A5FA] transition-colors cursor-pointer uppercase"
                >
                  Technical Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[2px] text-[#60A5FA] font-bold mb-4">
              Legal &amp; Ethics
            </h4>
            <ul className="space-y-2.5 text-xs text-[#94A3B8]">
              <li>
                <a
                  href="#privacy"
                  onClick={(e) =>
                    handleInfoClick(
                      'Privacy Policy & HIPAA Compliance',
                      'All medical radiographic cases in RADISCAN AI are strictly de-identified in full compliance with HIPAA Safe Harbor and GDPR guidelines. No Protected Health Information (PHI) is ever retained or stored.',
                      e
                    )
                  }
                  className="hover:text-[#60A5FA] transition-colors cursor-pointer uppercase"
                >
                  HIPAA / Privacy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  onClick={(e) =>
                    handleInfoClick(
                      'Terms of Service',
                      'Use of RADISCAN AI is designated exclusively for medical education, academic research, and simulation training. It does not constitute real-world formal patient medical advice.',
                      e
                    )
                  }
                  className="hover:text-[#60A5FA] transition-colors cursor-pointer uppercase"
                >
                  Terms of Use
                </a>
              </li>
              <li>
                <a
                  href="#disclaimer"
                  onClick={(e) =>
                    handleInfoClick(
                      'Educational Medical Disclaimer',
                      'RADISCAN AI is an interactive educational tool designed for healthcare students and professionals. Always correlate clinical findings with accredited attending radiologist reports for real patient care.',
                      e
                    )
                  }
                  className="hover:text-[#60A5FA] transition-colors cursor-pointer uppercase"
                >
                  Medical Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1E293B] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-3">
            <span>© 2026 RADISCAN AI</span>
            <span>//</span>
            <span>EDUCATIONAL FRAMEWORK ONLY</span>
          </div>
          <div className="flex gap-6 uppercase tracking-wider text-[11px]">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#60A5FA] transition-colors"
            >
              TWITTER / X
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#60A5FA] transition-colors"
            >
              GITHUB
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
