/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { Workspace } from './components/Workspace';
import { CaseLibrary } from './components/CaseLibrary';
import { QuizCenter } from './components/QuizCenter';
import { InfoModal } from './components/InfoModal';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedCaseId, setSelectedCaseId] = useState('distal-radius-fracture');

  // Modal dialog state for footer links
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCase = (caseId) => {
    setSelectedCaseId(caseId);
  };

  const handleOpenInfo = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  // Keyboard shortcut listener for power users
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F8FAFC] flex flex-col font-sans">
      {/* Global Clinical Navigation Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onSelectCase={handleSelectCase}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onSelectCase={handleSelectCase}
          />
        )}

        {currentView === 'workspace' && (
          <Workspace
            selectedCaseId={selectedCaseId}
            onSelectCase={handleSelectCase}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'case-library' && (
          <CaseLibrary
            onSelectCase={handleSelectCase}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'quizzes' && (
          <QuizCenter
            onSelectCase={handleSelectCase}
            onNavigate={handleNavigate}
          />
        )}
      </div>

      {/* Footer (shown on landing, case-library, quizzes) */}
      {currentView !== 'workspace' && (
        <Footer
          onNavigate={handleNavigate}
          onOpenInfo={handleOpenInfo}
        />
      )}

      {/* Informational Dialog Modal */}
      <InfoModal
        isOpen={modalOpen}
        title={modalTitle}
        content={modalContent}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
