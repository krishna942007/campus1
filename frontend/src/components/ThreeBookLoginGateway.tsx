import React, { useEffect } from 'react';
import { ArrowLeft, Sparkles, MousePointer } from 'lucide-react';
import { BestsellersBookShowcase } from '../shaders/landing-pages/LandingPages';

interface ThreeBookLoginGatewayProps {
  onSelectRoleForLogin: (role: 'STUDENT' | 'MENTOR' | 'ADMIN') => void;
  onBackToLanding: () => void;
}

export const ThreeBookLoginGateway: React.FC<ThreeBookLoginGatewayProps> = ({
  onSelectRoleForLogin,
  onBackToLanding
}) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'campus1-role-select') {
        const role = event.data.role;
        if (role === 'LANDING') {
          onBackToLanding();
        } else if (role === 'STUDENT' || role === 'MENTOR' || role === 'ADMIN') {
          // Open Stage 3: Existing Login Screen with the selected role!
          onSelectRoleForLogin(role);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSelectRoleForLogin, onBackToLanding]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0C2238] select-none flex flex-col justify-between">
      {/* 3D ThreeUI Three-Book Gateway Canvas */}
      <BestsellersBookShowcase style={{ width: '100vw', height: '100vh', border: 0 }} />

      {/* Top Header Bar */}
      <header className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-auto max-w-7xl mx-auto px-4">
        <button
          onClick={onBackToLanding}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-[#0C2238]/90 hover:bg-[#10253A] text-[#F7F4EE] text-xs font-bold border border-[#C99632]/40 shadow-xl backdrop-blur-md transition-all cursor-pointer hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4 text-[#E8C56B]" />
          <span>← Back to Campus1</span>
        </button>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#10253A]/90 border border-[#C99632]/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#E8C56B]" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E8C56B]">
              CAMPUS1 THREE-BOOK GATEWAY
            </span>
          </div>
        </div>
      </header>

      {/* Floating Bottom Instruction Banner (No Buttons) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#0C2238]/90 backdrop-blur-md border border-[#C99632]/40 shadow-2xl">
          <MousePointer className="w-4 h-4 text-[#E8C56B] animate-bounce" />
          <span className="text-xs font-extrabold text-[#F7F4EE] tracking-wide">
            Click directly on a book to continue
          </span>
        </div>
      </div>
    </div>
  );
};
