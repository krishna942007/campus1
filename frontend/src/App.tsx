import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CleanNavbar } from './components/CleanNavbar';
import { CleanHero } from './components/CleanHero';
import { EverythingYouNeedSection } from './components/EverythingYouNeedSection';
import { PlatformPreviewSection } from './components/PlatformPreviewSection';
import { StudentCommunitySection } from './components/StudentCommunitySection';

import { StudentDashboardStory } from './components/StudentDashboardStory';
import { StudentDigitalTwinSection } from './components/StudentDigitalTwinSection';
import { AIAssistantSection } from './components/AIAssistantSection';
import { LearningRoadmapSection } from './components/LearningRoadmapSection';
import { SkillGapSection } from './components/SkillGapSection';
import { WeeklyPlanSection } from './components/WeeklyPlanSection';
import { ToastNotification, ToastMessage } from './components/ToastNotification';
import { FloatingAIWidget } from './components/FloatingAIWidget';
import { MentoringSection } from './components/MentoringSection';
import { AcademicAttendanceSection } from './components/AcademicAttendanceSection';
import { VITKnowledgeRAG } from './components/VITKnowledgeRAG';
import { MengToSketchbookSection } from './components/MengToSketchbookSection';
import { BestsellersBookShowcaseSection } from './components/BestsellersBookShowcaseSection';
import { ProductFooter } from './components/ProductFooter';

import { LoginPage } from './components/LoginPage';
import { StudentPortal } from './components/StudentPortal';
import { MentorPortal } from './components/MentorPortal';
import { AdminPortal } from './components/AdminPortal';

export function App() {
  const [loginRole, setLoginRole] = useState<'STUDENT' | 'MENTOR' | 'ADMIN'>('STUDENT');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeView, setActiveView] = useState<'LANDING' | 'LOGIN' | 'STUDENT' | 'MENTOR' | 'ADMIN'>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/login') || path.startsWith('/gateway')) return 'LOGIN';
    if (path.startsWith('/student')) return 'STUDENT';
    if (path.startsWith('/mentor')) return 'MENTOR';
    if (path.startsWith('/admin')) return 'ADMIN';
    return 'LANDING';
  });

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ToastMessage>;
      if (customEvent.detail) {
        const newToast: ToastMessage = {
          id: Date.now().toString(),
          type: customEvent.detail.type || 'success',
          title: customEvent.detail.title,
          message: customEvent.detail.message,
        };
        setToasts((prev) => [...prev, newToast]);
      }
    };

    window.addEventListener('campus-toast', handleToastEvent);
    return () => window.removeEventListener('campus-toast', handleToastEvent);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/login') || path.startsWith('/gateway')) {
        setActiveView('LOGIN');
      } else if (path.startsWith('/student')) {
        setActiveView('STUDENT');
      } else if (path.startsWith('/mentor')) {
        setActiveView('MENTOR');
      } else if (path.startsWith('/admin')) {
        setActiveView('ADMIN');
      } else {
        setActiveView('LANDING');
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigateToRoot = () => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setActiveView('LANDING');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Open Login Page (with ThreeUI BestsellersBookShowcase)
  const handleOpenLogin = (role: 'STUDENT' | 'MENTOR' | 'ADMIN' = 'STUDENT') => {
    setLoginRole(role);
    if (window.location.pathname !== '/login') {
      window.history.pushState({}, '', '/login');
    }
    setActiveView('LOGIN');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Authenticated Dashboard Navigation
  const handlePerformLogin = (role: 'STUDENT' | 'MENTOR' | 'ADMIN') => {
    const route = role === 'STUDENT' ? '/student' : role === 'MENTOR' ? '/mentor' : '/admin';
    if (window.location.pathname !== route) {
      window.history.pushState({}, '', route);
    }
    setActiveView(role);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#10253A] font-sans antialiased relative selection:bg-[#C99632] selection:text-white">
      <AnimatePresence mode="wait">
        {/* LANDING PAGE (HOMEPAGE) */}
        {activeView === 'LANDING' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Sticky Glass Navigation Bar */}
            <CleanNavbar
              onSelectRole={handleOpenLogin}
              activeView={activeView}
              setActiveView={setActiveView}
            />

            {/* Main Content Flow */}
            <main className="w-full space-y-0">
              {/* Hero Section */}
              <CleanHero onSelectRole={handleOpenLogin} />

              {/* 5 Core Feature Cards */}
              <EverythingYouNeedSection />

              {/* Platform Preview & Dashboard Showcase */}
              <PlatformPreviewSection />

              {/* Meng To Sketchbook Interactive Portfolio */}
              <div id="sketchbook">
                <MengToSketchbookSection />
              </div>

              {/* Section 4.6: Campus Portals 3D Book Showcase */}
              <div id="bestsellers-showcase">
                <BestsellersBookShowcaseSection onSelectRole={handleOpenLogin} />
              </div>

              {/* Section 4.8: Flagship Student Digital Twin Visualization */}
              <div id="digital-twin">
                <StudentDigitalTwinSection />
              </div>

              {/* Student Profile Story */}
              <div id="dashboard">
                <StudentDashboardStory />
              </div>

              {/* AI Assistant Second Brain */}
              <div id="ai-assistant">
                <AIAssistantSection />
              </div>

              {/* Learning Roadmap & Skill-Gap Analysis */}
              <div id="roadmap">
                <LearningRoadmapSection />
                <SkillGapSection />
                <WeeklyPlanSection />
              </div>

              {/* Faculty Mentoring */}
              <div id="mentoring">
                <MentoringSection />
              </div>

              {/* Academic ERP Trust Integrity */}
              <div id="erp">
                <AcademicAttendanceSection />
              </div>

              {/* Student Community */}
              <StudentCommunitySection onSelectRole={handleOpenLogin} />

              {/* VIT Institutional RAG Knowledge Base */}
              <div id="rag">
                <VITKnowledgeRAG />
              </div>
            </main>

            {/* Footer */}
            <ProductFooter onSelectRole={handleOpenLogin} />
          </motion.div>
        )}

        {/* LOGIN PAGE: ThreeUI BestsellersBookShowcase Showcase with intact Backend Authentication */}
        {activeView === 'LOGIN' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <LoginPage
              initialRole={loginRole}
              onLogin={handlePerformLogin}
              onBackToLanding={handleNavigateToRoot}
            />
          </motion.div>
        )}

        {/* AUTHENTICATED DASHBOARDS */}
        {activeView === 'STUDENT' && (
          <motion.div
            key="student"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <StudentPortal onBackToLanding={handleNavigateToRoot} />
          </motion.div>
        )}

        {activeView === 'MENTOR' && (
          <motion.div
            key="mentor"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <MentorPortal onBackToLanding={handleNavigateToRoot} />
          </motion.div>
        )}

        {activeView === 'ADMIN' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <AdminPortal onBackToLanding={handleNavigateToRoot} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Movable Floating AI Circle Widget */}
      {activeView !== 'LOGIN' && <FloatingAIWidget />}

      {/* Global Toast Notification Container */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
