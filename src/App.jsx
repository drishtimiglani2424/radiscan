/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StudyProvider } from './context/StudyContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { Workspace } from './components/Workspace';
import { CaseLibrary } from './components/CaseLibrary';
import { QuizCenter } from './components/QuizCenter';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { MyCases } from './components/MyCases';
import { CaseForm } from './components/CaseForm';
import { Flashcards } from './components/Flashcards';
import { NotFoundPage } from './components/NotFoundPage';
import { InfoModal } from './components/InfoModal';
import { Toast } from './components/Toast';

export default function App() {
  const [selectedCaseId, setSelectedCaseId] = useState('distal-radius-fracture');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (view) => {
    if (view === 'landing') {
      navigate('/');
    } else {
      navigate('/' + view);
    }
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

  // Keyboard shortcut listener for modal dismiss
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const hideFooter = location.pathname.startsWith('/workspace');

  return (
    <AuthProvider>
      <StudyProvider>
        <div className="min-h-screen bg-[#090D16] text-[#F8FAFC] flex flex-col font-sans">
        {/* Global Clinical Navigation Header: Shows Sign in, or user's name and Logout */}
        <Header />

        {/* Main Route Router */}
        <div className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <LandingPage
                  onNavigate={handleNavigate}
                  onSelectCase={handleSelectCase}
                />
              }
            />

            <Route
              path="/workspace"
              element={
                <Workspace
                  selectedCaseId={selectedCaseId}
                  onSelectCase={handleSelectCase}
                  onNavigate={handleNavigate}
                />
              }
            />

            <Route
              path="/case-library"
              element={
                <CaseLibrary
                  onSelectCase={handleSelectCase}
                  onNavigate={handleNavigate}
                />
              }
            />

            <Route
              path="/quizzes"
              element={
                <QuizCenter
                  onSelectCase={handleSelectCase}
                  onNavigate={handleNavigate}
                />
              }
            />

            <Route
              path="/flashcards"
              element={<Flashcards />}
            />

            <Route
              path="/login"
              element={
                <LoginPage
                  onNavigate={handleNavigate}
                />
              }
            />

            {/* Protected Routes: /dashboard, /my-cases, /my-cases/new, /my-cases/edit/:id */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-cases" element={<MyCases />} />
              <Route path="/my-cases/new" element={<CaseForm />} />
              <Route path="/my-cases/edit/:id" element={<CaseForm />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>

        {/* Footer */}
        {!hideFooter && (
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

        {/* Global Toast Notification System */}
        <Toast />
      </div>
      </StudyProvider>
    </AuthProvider>
  );
}
