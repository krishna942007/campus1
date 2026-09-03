import React from 'react';
import { motion } from 'framer-motion';
import { Database, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from './ui/StatusBadge';

export const AcademicAttendanceSection: React.FC = () => {
  return (
    <section id="trust" className="relative py-24 w-full bg-[#F7F4EE] border-t border-[#0C2238]/08 z-10 overflow-hidden">
      {/* Ambient Lighting Blobs behind Glass Surface */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#C99632]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#244F7D]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-14 space-y-4"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#EFE7D8] border border-[#C99632]/25">
            <ShieldCheck className="w-3.5 h-3.5 text-[#159A72]" />
            <span className="text-[11px] font-extrabold tracking-wider text-[#7A6437]">
              Data Integrity & Trust Architecture
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#10253A] tracking-tight leading-[1.12] font-display">
            Authoritative records <br />
            <span className="text-[#10253A] font-serif-accent font-normal">
              vs. AI guidance.
            </span>
          </h2>

          <p className="text-base font-normal text-[#627083] leading-relaxed">
            The platform maintains strict distinction between official VIT ERP academic records and AI advisory intelligence. AI never overrides institutional authority.
          </p>
        </motion.div>

        {/* Side-by-Side Comparison: Official ERP vs AI Advisory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Column 1: Official VIT Academic ERP Record (Glassmorphism) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 bg-[#FFFFFF]/10 backdrop-blur-[5px] border border-[#0C2238]/08 shadow-xl shadow-[#0C2238]/05 space-y-6 rounded-3xl relative overflow-hidden"
          >
            <div className="flex items-center space-x-3.5 border-b border-[#0C2238]/08 pb-5">
              <div className="w-12 h-12 rounded-2xl bg-[#159A72]/15 border border-[#159A72]/30 text-[#159A72] flex items-center justify-center font-bold text-lg shadow-sm">
                <Database className="w-6 h-6 text-[#159A72]" />
              </div>
              <div>
                <StatusBadge variant="OFFICIAL" label="Official Institutional Source" />
                <h3 className="text-xl font-extrabold text-[#10253A] font-display mt-1">
                  VIT Academic ERP / MIS Record
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#10253A]">
              <div className="p-4 bg-[#FFFCF7]/50 hover:bg-[#FFFCF7]/80 backdrop-blur-md border border-[#0C2238]/08 rounded-2xl flex items-center justify-between transition-all duration-300">
                <span className="font-semibold text-[#627083]">Official CGPA:</span>
                <span className="font-extrabold text-[#10253A]">8.92 / 10.00 (Verified)</span>
              </div>
              <div className="p-4 bg-[#FFFCF7]/50 hover:bg-[#FFFCF7]/80 backdrop-blur-md border border-[#0C2238]/08 rounded-2xl flex items-center justify-between transition-all duration-300">
                <span className="font-semibold text-[#627083]">Total Attendance:</span>
                <span className="font-extrabold text-[#159A72]">86.4% (Registered)</span>
              </div>
              <div className="p-4 bg-[#FFFCF7]/50 hover:bg-[#FFFCF7]/80 backdrop-blur-md border border-[#0C2238]/08 rounded-2xl flex items-center justify-between transition-all duration-300">
                <span className="font-semibold text-[#627083]">Grade Card Status:</span>
                <span className="font-extrabold text-[#10253A]">Semester IV Signed</span>
              </div>
            </div>

            <div className="pt-2 text-xs font-semibold text-[#159A72] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#159A72] shrink-0" />
              <span>Immutable institutional record synchronized from VIT Academic Controller Office.</span>
            </div>
          </motion.div>

          {/* Column 2: AI Advisory Insight Layer (Light Warm Ivory Glass) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 bg-[#FAF7F0]/95 sm:bg-[#F7F4EE]/90 backdrop-blur-xl text-[#10253A] border border-[#0C2238]/12 shadow-2xl space-y-6 rounded-3xl relative overflow-hidden"
          >
            <div className="flex items-center space-x-3.5 border-b border-[#0C2238]/10 pb-5">
              <div className="w-12 h-12 rounded-2xl bg-[#0C2238]/08 border border-[#0C2238]/12 text-[#C99632] flex items-center justify-center font-bold text-lg shadow-sm">
                <Sparkles className="w-6 h-6 text-[#C99632]" />
              </div>
              <div>
                <StatusBadge variant="AI_ADVISORY" label="Advisory Intelligence Layer" />
                <h3 className="text-xl font-extrabold text-[#10253A] font-display mt-1">
                  Contextual AI Insights & Guidance
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#10253A]">
              <div className="p-4 bg-[#FFFCF7]/90 hover:bg-[#FFFCF7] backdrop-blur-md border border-[#0C2238]/08 rounded-2xl flex items-center justify-between transition-all duration-300">
                <span className="font-semibold text-[#627083]">Recommended Elective:</span>
                <span className="font-extrabold text-[#C99632]">CS-402 Deep Learning</span>
              </div>
              <div className="p-4 bg-[#FFFCF7]/90 hover:bg-[#FFFCF7] backdrop-blur-md border border-[#0C2238]/08 rounded-2xl flex items-center justify-between transition-all duration-300">
                <span className="font-semibold text-[#627083]">Skill Gap Suggestion:</span>
                <span className="font-extrabold text-[#C99632]">PyTorch Frameworks</span>
              </div>
              <div className="p-4 bg-[#FFFCF7]/90 hover:bg-[#FFFCF7] backdrop-blur-md border border-[#0C2238]/08 rounded-2xl flex items-center justify-between transition-all duration-300">
                <span className="font-semibold text-[#627083]">Advisory Notice:</span>
                <span className="font-extrabold text-[#244F7D]">Non-Binding Recommendation</span>
              </div>
            </div>

            <div className="pt-2 text-xs font-semibold text-[#7A6437] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#C99632] shrink-0" />
              <span>AI recommendations are advisory and do not alter official grades or institutional standing.</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

