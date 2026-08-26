import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Activity, AlertCircle, Sparkles, MessageSquare, Compass, CheckCircle2,
  Lock, LayoutDashboard, Bot, BookOpen, Briefcase, Bell, Search, Settings, ShieldCheck
} from 'lucide-react';
import { StatusBadge } from './ui/StatusBadge';

export const StudentDashboardStory: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);

  const studentQuestions = [
    {
      q: "How am I performing academically?",
      answer: "Current CGPA is 8.92 (Rank 4 in Computer Engineering Dept). Attendance across all 6 core subjects is 86.4%, comfortably above the 75% institutional requirement.",
      metric: "8.92 CGPA // 86.4% ATTENDANCE",
      status: "EXCELLENT",
    },
    {
      q: "Where are my skill gaps?",
      answer: "Strong in Python, Algorithms, and Data Structures. Target role (AI Engineer) requires additional proficiency in Deep Neural Networks (PyTorch) and Distributed System Design.",
      metric: "GAP DETECTED: PYTORCH & CUDA",
      status: "ADVISORY ACTION",
    },
    {
      q: "What has my mentor said?",
      answer: "Faculty Mentor Prof. S. Kulkarni logged meeting outcome: 'Strong academic performance. Recommended focusing on final year capstone AI research paper submission for IEEE.'",
      metric: "MEETING LOGGED 12-AUG-2026",
      status: "MENTOR SIGN-OFF",
    },
    {
      q: "What should I do next?",
      answer: "Complete Module 3 of Deep Learning Specialization and publish GitHub repository for Autonomous Computer Vision project before next mentor check-in.",
      metric: "RECOMMENDED ACTION ITEM",
      status: "NEXT STEP",
    },
  ];

  return (
    <section id="dashboard" className="relative py-24 w-full bg-[#F7F4EE] border-t border-[#0C2238]/08 z-10 overflow-hidden">
      {/* Ambient Lighting Blobs behind Glass Surface */}
      <div className="absolute top-1/4 -right-16 w-96 h-96 bg-[#C99632]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-16 w-96 h-96 bg-[#244F7D]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-14 space-y-4"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#EFE7D8] border border-[#C99632]/25">
            <Sparkles className="w-3.5 h-3.5 text-[#C99632]" />
            <span className="text-[11px] font-extrabold tracking-wider text-[#7A6437]">
              Personalized Student Dashboard
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#10253A] tracking-tight leading-[1.12] font-display">
            Understand your <br />
            <span className="text-[#C99632] font-serif-accent italic font-normal">
              entire journey.
            </span>
          </h2>

          <p className="text-base font-normal text-[#627083] leading-relaxed">
            The student dashboard translates academic data, attendance logs, skill profiles, and mentor feedback into clear, actionable answers.
          </p>
        </motion.div>

        {/* Question Switcher Tabs in Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {studentQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => setActiveQuestion(idx)}
              className={`p-5 text-left rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden ${
                activeQuestion === idx
                  ? 'bg-[#0C2340]/90 text-white backdrop-blur-[5px] border border-[#C99632]/50 shadow-xl shadow-[#0C2238]/15 scale-[1.02] -translate-y-1.5'
                  : 'bg-[#FFFFFF]/40 hover:bg-[#FFFFFF]/75 backdrop-blur-[5px] text-[#10253A] border border-[#0C2238]/08 shadow-xl shadow-[#0C2238]/05 hover:-translate-y-1'
              }`}
            >
              <div className={`text-[10px] font-extrabold tracking-wider uppercase mb-1.5 ${
                activeQuestion === idx ? 'text-[#E8C56B]' : 'text-[#C99632]'
              }`}>
                QUESTION 0{idx + 1}
              </div>
              <div className="text-xs font-extrabold font-display leading-snug">
                {sq.q}
              </div>
            </button>
          ))}
        </div>

        {/* Desktop App Window Mockup Frame - Dark Transparent Blue Glass */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.97, y: 25 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="p-2 sm:p-2 bg-gradient-to-b from-[#1E293B]/80 to-[#0F172A]/90 rounded-[32px] sm:rounded-2xl border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-sm relative overflow-hidden"
        >
          {/* Inner Application Container: Translucent Dark Blue Glass with Blur */}
          <div className="bg-[#0C2340]/85 sm:bg-black/75 backdrop-blur-xl rounded-[24px] sm:rounded-xl border border-white/10 shadow-2xl overflow-hidden text-white">
            
            {/* Desktop macOS Window Chrome Header */}
            <div className="px-6 py-3.5 bg-[#07172A]/90 text-white flex items-center justify-between border-b border-white/10 backdrop-blur-md">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/20 shadow-xs inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/20 shadow-xs inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/20 shadow-xs inline-block" />
              </div>

              {/* Centered URL Address Pill */}
              <div className="px-5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono text-slate-200 flex items-center space-x-2 shadow-inner hidden sm:flex">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span className="text-[#E8C56B]">https://vitara.edu/student-app/dashboard</span>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge variant="OFFICIAL" label="OFFICIAL ERP VERIFIED" />
              </div>
            </div>

            {/* Desktop Workspace Canvas (Without Left Sidebar) */}
            <div className="p-6 sm:p-10 space-y-6">
              
              {/* Header Profile Titlebar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold text-lg shadow-md border border-white/15">
                    <User className="w-6 h-6 text-[#E8C56B]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-white font-display">
                      Krishna Singh
                    </h3>
                    <span className="text-xs text-[#E8C56B] font-extrabold tracking-wide">
                      B.Tech Computer Engineering (Batch 2023-2027) • ID: 2023CSE001
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="px-3 py-1 rounded-full bg-white/10 text-[#E8C56B] font-extrabold text-[11px] border border-white/15 shadow-xs">
                    RANK #4 IN DEPT
                  </div>
                </div>
              </div>

              {/* Active Question Highlight Display in Dark Blue Translucent Glass */}
              <div className="p-7 sm:p-8 bg-white/5 backdrop-blur-md text-white border border-white/10 space-y-4 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C99632]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between text-xs font-extrabold relative z-10">
                  <span className="text-[#E8C56B] tracking-wider uppercase flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#E8C56B]" />
                    <span>ACTIVE INTELLIGENCE QUERY</span>
                  </span>
                  <span className="text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 text-[11px] font-extrabold">
                    {studentQuestions[activeQuestion].status}
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-extrabold text-white font-display leading-tight relative z-10">
                  "{studentQuestions[activeQuestion].q}"
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed relative z-10">
                  {studentQuestions[activeQuestion].answer}
                </p>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold relative z-10">
                  <span className="text-[#E8C56B] font-extrabold uppercase tracking-wider text-[10px]">SIGNAL METRIC:</span>
                  <span className="font-extrabold text-white bg-white/10 px-3 py-1 rounded-lg border border-white/15 font-mono text-[11px]">
                    {studentQuestions[activeQuestion].metric}
                  </span>
                </div>
              </div>

              {/* Student Profile Quick Data Grid in Translucent Glass Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
                <div className="p-5 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 space-y-1.5 rounded-2xl shadow-md transition-all duration-300">
                  <span className="text-[10px] font-extrabold text-[#E8C56B] tracking-wider uppercase">ACADEMIC CGPA</span>
                  <div className="text-2xl font-extrabold text-white font-display">8.92 / 10</div>
                  <span className="text-[11px] text-slate-400 font-medium block">No active backlogs • First Class</span>
                </div>

                <div className="p-5 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 space-y-1.5 rounded-2xl shadow-md transition-all duration-300">
                  <span className="text-[10px] font-extrabold text-[#E8C56B] tracking-wider uppercase">ATTENDANCE LOG</span>
                  <div className="text-2xl font-extrabold text-emerald-400 font-display">86.4%</div>
                  <span className="text-[11px] text-slate-400 font-medium block">Above 75% statutory requirement</span>
                </div>

                <div className="p-5 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 space-y-1.5 rounded-2xl shadow-md transition-all duration-300">
                  <span className="text-[10px] font-extrabold text-[#E8C56B] tracking-wider uppercase">FACULTY MENTOR</span>
                  <div className="text-sm font-extrabold text-white font-display truncate">Prof. S. Kulkarni</div>
                  <span className="text-[11px] text-slate-400 font-medium block truncate">Computer Engineering Dept</span>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};
