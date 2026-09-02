import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BestsellersBookShowcase } from '../shaders/landing-pages/LandingPages';
import { Shield, Sparkles, GraduationCap, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

interface Campus1ShowcaseLandingSectionProps {
  onSelectRole: (role: 'STUDENT' | 'MENTOR' | 'ADMIN') => void;
}

export const Campus1ShowcaseLandingSection: React.FC<Campus1ShowcaseLandingSectionProps> = ({
  onSelectRole
}) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'campus1-role-select') {
        const role = event.data.role;
        if (role === 'STUDENT' || role === 'MENTOR' || role === 'ADMIN') {
          // Open existing login screen with the selected role!
          onSelectRole(role);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSelectRole]);

  return (
    <section className="relative w-full bg-[#0C2238] text-[#F7F4EE] py-12 overflow-hidden border-b border-[#C99632]/20">
      
      {/* Header Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#10253A] border border-[#C99632]/40 shadow-md"
        >
          <Sparkles className="w-4 h-4 text-[#E8C56B]" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#E8C56B]">
            CAMPUS1 PORTAL SELECTION
          </span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-extrabold text-[#F7F4EE] tracking-tight font-display"
        >
          Choose Your Institutional Portal
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base text-[#EFE7D8]/80 max-w-2xl mx-auto"
        >
          Select your role below to proceed to the secure Campus1 authentication screen.
        </motion.p>
      </div>

      {/* 3D ThreeUI Interactive Book Showcase Canvas */}
      <div className="relative w-full h-[680px] sm:h-[750px] my-4 rounded-3xl overflow-hidden shadow-2xl border border-[#C99632]/20 max-w-7xl mx-auto">
        <BestsellersBookShowcase style={{ width: '100%', height: '100%', border: 0 }} />
      </div>

      {/* Role Navigation Quick Bar at Bottom */}
      <div className="max-w-4xl mx-auto px-4 mt-8 flex flex-wrap items-center justify-center gap-4">
        
        {/* FACULTY PORTAL */}
        <button
          type="button"
          onClick={() => onSelectRole('MENTOR')}
          className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-[#123B63] hover:bg-[#1B365D] text-[#F7F4EE] text-xs font-bold border border-white/10 shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <UserCheck className="w-4 h-4 text-[#E8C56B]" />
          <span>Faculty Portal Login</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#E8C56B]" />
        </button>

        {/* STUDENT PORTAL (PRIMARY EMPHASIS) */}
        <button
          type="button"
          onClick={() => onSelectRole('STUDENT')}
          className="flex items-center space-x-2 px-7 py-3.5 rounded-2xl bg-[#C99632] hover:bg-[#E8C56B] text-[#0C2238] text-xs font-black shadow-xl transition-all hover:-translate-y-1 cursor-pointer scale-105"
        >
          <GraduationCap className="w-4 h-4 text-[#0C2238]" />
          <span>Continue as Student Login ★</span>
          <ArrowRight className="w-4 h-4 text-[#0C2238]" />
        </button>

        {/* ADMIN PORTAL */}
        <button
          type="button"
          onClick={() => onSelectRole('ADMIN')}
          className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-[#1B365D] hover:bg-[#123B63] text-[#F7F4EE] text-xs font-bold border border-white/10 shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-[#E8C56B]" />
          <span>Admin Portal Login</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#E8C56B]" />
        </button>

      </div>

    </section>
  );
};
