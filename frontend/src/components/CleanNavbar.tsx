import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Shield, Menu, X, Sparkles, Compass, Users, Database } from 'lucide-react';

interface CleanNavbarProps {
  onSelectRole: (role: 'STUDENT' | 'MENTOR' | 'ADMIN') => void;
  activeView: string;
  setActiveView: (view: 'LANDING' | 'STUDENT' | 'MENTOR' | 'ADMIN') => void;
}

export const CleanNavbar: React.FC<CleanNavbarProps> = ({ onSelectRole, activeView, setActiveView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'py-1.5 bg-[#FFFCF7]/85 backdrop-blur-xl border-b border-[#0C2238]/10 shadow-[0_4px_20px_rgb(0,0,0,0.04)]' 
          : 'py-2 bg-[#F7F4EE]/70 backdrop-blur-md border-b border-[#0C2238]/06'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12 sm:h-13">
        
        {/* Left: Brand Mark */}
        <button
          onClick={() => {
            setActiveView('LANDING');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center space-x-2.5 text-left group cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0C2238] to-[#123B63] text-white flex items-center justify-center font-black text-[11px] shadow-sm border border-[#C99632]/40 group-hover:scale-105 transition-all duration-200">
            <span className="tracking-wider text-[#E8C56B]">VIT</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-black text-[#10253A] tracking-tight flex items-center space-x-1">
              <span>VIT MUMBAI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#159A72]" />
            </div>
            <p className="text-[8px] font-extrabold uppercase tracking-widest text-[#C99632]">
              AI Student Development Platform
            </p>
          </div>
        </button>

        {/* Center Navigation Capsule - Compact SaaS Scaling */}
        <nav className="hidden lg:flex items-center gap-0.5 px-2 py-1 rounded-full bg-[#FFFFFF]/40 backdrop-blur-md border border-[#0C2238]/08 shadow-2xs">
          
          {/* Platform Dropdown */}
          <div 
            className="relative" 
            onMouseEnter={() => setPlatformDropdownOpen(true)}
            onMouseLeave={() => setPlatformDropdownOpen(false)}
          >
            <button 
              onClick={() => setPlatformDropdownOpen(!platformDropdownOpen)}
              className={`px-2.5 py-1 rounded-full flex items-center space-x-1 text-[10.5px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                platformDropdownOpen ? 'bg-[#0C2238] text-white' : 'text-[#627083] hover:text-[#10253A] hover:bg-[#FFFFFF]/80'
              }`}
            >
              <span>Platform</span>
              <ChevronDown className={`w-3 h-3 text-[#C99632] transition-transform duration-200 ${platformDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {platformDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full left-0 mt-2 w-60 bg-[#FFFCF7]/95 backdrop-blur-xl rounded-xl shadow-lg border border-[#0C2238]/10 p-1.5 space-y-0.5 z-50 overflow-hidden"
                >
                  <a 
                    href="#features" 
                    onClick={() => setPlatformDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-[#F7F4EE] text-[11px] font-bold text-[#10253A] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-md bg-[#EFE7D8] flex items-center justify-center text-[#0C2238] shrink-0">
                      <Sparkles className="w-3 h-3 text-[#C99632]" />
                    </div>
                    <div>
                      <p className="font-extrabold text-[#10253A]">Core Features</p>
                      <p className="text-[9.5px] text-[#627083] font-normal leading-tight">AI Insights & Roadmaps</p>
                    </div>
                  </a>
                  <a 
                    href="#preview" 
                    onClick={() => setPlatformDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-[#F7F4EE] text-[11px] font-bold text-[#10253A] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-md bg-[#EFE7D8] flex items-center justify-center text-[#0C2238] shrink-0">
                      <Compass className="w-3 h-3 text-[#123B63]" />
                    </div>
                    <div>
                      <p className="font-extrabold text-[#10253A]">Interactive Preview</p>
                      <p className="text-[9.5px] text-[#627083] font-normal leading-tight">3D Dashboard Story</p>
                    </div>
                  </a>
                  <a 
                    href="#community" 
                    onClick={() => setPlatformDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-[#F7F4EE] text-[11px] font-bold text-[#10253A] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-md bg-[#EFE7D8] flex items-center justify-center text-[#0C2238] shrink-0">
                      <Users className="w-3 h-3 text-[#159A72]" />
                    </div>
                    <div>
                      <p className="font-extrabold text-[#10253A]">Student Community</p>
                      <p className="text-[9.5px] text-[#627083] font-normal leading-tight">Cohort Collaboration</p>
                    </div>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {[
            { label: 'AI Assistant', href: '#ai-assistant' },
            { label: 'Roadmap', href: '#roadmap' },
            { label: 'Mentoring', href: '#mentoring' },
            { label: 'ERP Trust', href: '#erp' },
            { label: 'RAG Search', href: '#rag' },
          ].map((link) => (
            <a 
              key={link.label}
              href={link.href} 
              className="px-2.5 py-1 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider text-[#627083] hover:text-[#10253A] hover:bg-[#FFFFFF]/80 transition-all duration-200 cursor-pointer"
            >
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        {/* Right Action Controls - Compact Proportions */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          


          <button 
            onClick={() => onSelectRole('STUDENT')}
            className="px-3 py-1 rounded-full bg-[#FFFFFF]/70 hover:bg-[#FFFFFF] text-[#10253A] font-extrabold text-[11px] border border-[#0C2238]/10 hover:border-[#0C2238]/20 transition-all duration-200 cursor-pointer shadow-2xs"
          >
            Login
          </button>

          {/* Primary Action Button */}
          <button 
            onClick={() => onSelectRole('STUDENT')}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#0C2238] hover:bg-[#123B63] text-white font-extrabold text-[11px] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200 text-[#E8C56B]" />
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg bg-[#FFFFFF]/70 text-[#10253A] border border-[#0C2238]/10 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-[#FFFCF7]/95 backdrop-blur-2xl border-b border-[#0C2238]/10 px-4 py-3 space-y-2.5 shadow-md"
          >


            <div className="space-y-0.5 text-[11px] font-bold uppercase text-[#10253A]">
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-[#F7F4EE]"
              >
                Core Features
              </a>
              <a 
                href="#ai-assistant" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-[#F7F4EE]"
              >
                AI Assistant
              </a>
              <a 
                href="#roadmap" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-[#F7F4EE]"
              >
                Learning Roadmap
              </a>
              <a 
                href="#mentoring" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-[#F7F4EE]"
              >
                Mentoring Council
              </a>
              <a 
                href="#erp" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-[#F7F4EE]"
              >
                Official ERP Trust
              </a>
              <a 
                href="#rag" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg hover:bg-[#F7F4EE]"
              >
                RAG Knowledge Base
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
