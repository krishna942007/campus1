import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, User, Award, BookOpen, Clock, Users, Briefcase, Zap, 
  ArrowRight, Check, X, ShieldAlert, Cpu, Activity, TrendingUp, Sliders, Play
} from 'lucide-react';
import { useStudentState, studentStore } from '../services/studentStateStore';
import { FutureSimulatorModal } from './FutureSimulatorModal';

export type DimensionKey = 'ACADEMICS' | 'SKILLS' | 'ATTENDANCE' | 'ROADMAP' | 'MENTORING' | 'EXPERIENCE' | 'OPPORTUNITIES';

export const StudentDigitalTwinSection: React.FC = () => {
  const state = useStudentState();
  const [selectedDimension, setSelectedDimension] = useState<DimensionKey>('SKILLS');
  const [showSimulatorModal, setShowSimulatorModal] = useState<boolean>(false);

  const dimensions: { key: DimensionKey; label: string; icon: any; summary: string; detail: any }[] = [
    {
      key: 'ACADEMICS',
      label: 'ACADEMICS',
      icon: BookOpen,
      summary: `CGPA ${state.cgpa} • Rank #4`,
      detail: {
        title: 'Academic Performance & ERP Credits',
        metrics: [
          { label: 'CGPA', val: `${state.cgpa} / 10.0` },
          { label: 'Department Rank', val: '#4 in Computer Engineering' },
          { label: 'Earned Credits', val: '118 / 160 Credits' },
          { label: 'Active Arrears', val: '0 (Clean Record)' },
        ],
        verdict: 'Exceeds Honors Eligibility Threshold (≥ 7.50 CGPA).'
      }
    },
    {
      key: 'SKILLS',
      label: 'SKILLS',
      icon: Cpu,
      summary: '8 Verified • 2 Critical Gaps',
      detail: {
        title: 'Verified Competency & Gap Analysis',
        metrics: [
          { label: 'Verified Skills', val: '8 Core Competencies' },
          { label: 'Critical Gaps', val: '2 Gaps (PyTorch 32%, CUDA 20%)' },
          { label: 'Above Benchmark', val: '3 Skills (Python 95%, DSA 88%, SQL 85%)' },
          { label: 'High Impact Focus', val: 'PyTorch Neural Networks' },
        ],
        verdict: 'PyTorch is currently your largest skill gap for the AI Research Engineer pathway.'
      }
    },
    {
      key: 'ATTENDANCE',
      label: 'ATTENDANCE',
      icon: Clock,
      summary: `${state.attendance}% Compliance`,
      detail: {
        title: 'Statutory Coursework Attendance',
        metrics: [
          { label: 'Overall Ratio', val: `${state.attendance}%` },
          { label: 'Theory Lectures', val: '87.2%' },
          { label: 'Lab Sessions', val: '92.0%' },
          { label: 'Statutory Status', val: 'Compliant (Cutoff 75%)' },
        ],
        verdict: 'Fully eligible for End-Semester Examinations under Ordinance 4.2.'
      }
    },
    {
      key: 'ROADMAP',
      label: 'ROADMAP',
      icon: TrendingUp,
      summary: `Velocity ${state.progress}%`,
      detail: {
        title: 'AI Learning Trajectory Velocity',
        metrics: [
          { label: 'Roadmap Completion', val: `${state.progress}%` },
          { label: 'Active Step', val: 'Step 02 — Skill Gap Identified' },
          { label: 'Next Action', val: state.todayPriority.title },
          { label: 'Target Role', val: state.careerGoal },
        ],
        verdict: 'Executing next priority will increase readiness by +4%.'
      }
    },
    {
      key: 'MENTORING',
      label: 'MENTORING',
      icon: Users,
      summary: 'Prof. S. Kulkarni (Active)',
      detail: {
        title: 'Faculty Mentorship Relationship',
        metrics: [
          { label: 'Assigned Mentor', val: 'Prof. S. Kulkarni' },
          { label: 'Last Meeting', val: '12 Aug 2026 (Logged)' },
          { label: 'Next Review', val: '15 Sept 2026' },
          { label: 'Status', val: 'Active Guidance' },
        ],
        verdict: 'Mentor feedback advised prioritizing capstone IEEE manuscript draft.'
      }
    },
    {
      key: 'EXPERIENCE',
      label: 'EXPERIENCE',
      icon: Award,
      summary: 'Capstone Phase 2 Active',
      detail: {
        title: 'Project Evidence & Portfolio',
        metrics: [
          { label: 'Primary Project', val: 'Autonomous Vision Transformer' },
          { label: 'Evidence Status', val: state.evidenceStatus },
          { label: 'Repository', val: 'GitHub Portfolio Verified' },
          { label: 'Faculty Approval', val: 'Phase 1 Approved' },
        ],
        verdict: 'Submit capstone code artifacts to complete Step 04 evidence.'
      }
    },
    {
      key: 'OPPORTUNITIES',
      label: 'OPPORTUNITIES',
      icon: Briefcase,
      summary: `${state.opportunities} Matched • 2 Applied`,
      detail: {
        title: 'Career & Placement Matches',
        metrics: [
          { label: 'Matched Openings', val: `${state.opportunities} Super Dream Opportunities` },
          { label: 'Applications', val: '2 Active Applications' },
          { label: 'Interview Readiness', val: `${state.progress}% Match` },
          { label: 'Top Match', val: 'NVIDIA AI Research Intern' },
        ],
        verdict: 'Closing PyTorch gap will unlock 3 additional Tier-1 placements.'
      }
    }
  ];

  const activeDetail = dimensions.find(d => d.key === selectedDimension)?.detail;

  return (
    <section id="digital-twin" className="relative py-24 w-full bg-[#F7F4EE] border-t border-[#0C2238]/08 z-10 overflow-hidden">
      {/* Ambient Lighting Blobs behind Glass Surface */}
      <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-[#C99632]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-[#244F7D]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-3"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#EFE7D8] border border-[#C99632]/25">
              <Activity className="w-3.5 h-3.5 text-[#C99632]" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7A6437]">
                FLAGSHIP PLATFORM INTELLIGENCE
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#10253A] tracking-tight leading-[1.12] font-display">
              YOUR STUDENT <br />
              <span className="text-[#C99632] font-serif-accent italic font-normal">
                DIGITAL TWIN.
              </span>
            </h2>

            <p className="text-base font-normal text-[#627083] leading-relaxed">
              "A live model of where you are, where you are going, and what could change your trajectory."
            </p>
          </motion.div>

          {/* 6. SIMULATE FUTURE BUTTON */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowSimulatorModal(true)}
              className="px-7 py-3.5 rounded-full bg-[#C99632] hover:bg-[#b08226] text-[#0C2238] font-extrabold text-xs transition-all shadow-xl hover:shadow-2xl cursor-pointer flex items-center space-x-2 shrink-0"
            >
              <Sliders className="w-4 h-4 text-[#0C2238]" />
              <span>[ SIMULATE FUTURE ]</span>
            </button>
          </div>
        </div>

        {/* 9. PRODUCT ARCHITECTURE DATA FLOW PIPELINE */}
        <div className="p-4 rounded-2xl bg-[#FFFCF7]/90 backdrop-blur-md border border-[#0C2238]/12 text-center text-xs font-mono text-[#10253A] shadow-md overflow-x-auto">
          <div className="flex items-center justify-center space-x-2 font-bold whitespace-nowrap">
            <span className="text-[#0C2238]">ERP DATA</span>
            <span className="text-[#C99632]">+</span>
            <span className="text-[#0C2238]">STUDENT ACTIVITY</span>
            <span className="text-[#C99632]">+</span>
            <span className="text-[#0C2238]">SKILLS</span>
            <span className="text-[#C99632]">+</span>
            <span className="text-[#0C2238]">MENTOR FEEDBACK</span>
            <span className="text-[#C99632]">+</span>
            <span className="text-[#0C2238]">AI ANALYSIS</span>
            <span className="text-[#C99632]">➔</span>
            <span className="px-2.5 py-1 rounded bg-[#0C2238] text-[#E8C56B] font-extrabold">STUDENT DIGITAL TWIN STATE</span>
            <span className="text-[#C99632]">➔</span>
            <span className="px-2.5 py-1 rounded bg-[#C99632] text-[#0C2238] font-extrabold">NEXT BEST ACTION</span>
          </div>
        </div>

        {/* CENTRAL DIGITAL TWIN VISUALIZATION GRAPH */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
          
          {/* SVG Connecting Lines in Desktop View */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full">
              <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="#C99632" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-40" />
              <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="#C99632" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-40" />
              <line x1="50%" y1="50%" x2="15%" y2="50%" stroke="#C99632" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-40" />
              <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="#C99632" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-40" />
              <line x1="50%" y1="50%" x2="25%" y2="80%" stroke="#C99632" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-40" />
              <line x1="50%" y1="50%" x2="75%" y2="80%" stroke="#C99632" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-40" />
            </svg>
          </div>

          {/* Left Column: 3 Dimension Nodes */}
          <div className="lg:col-span-3 space-y-4 z-10">
            {dimensions.slice(0, 3).map((d) => {
              const isSelected = selectedDimension === d.key;
              const Icon = d.icon;
              return (
                <div
                  key={d.key}
                  onClick={() => setSelectedDimension(d.key)}
                  className={`p-4 sm:p-5 rounded-3xl border transition-all duration-300 cursor-pointer space-y-2 relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#0C2340] text-white border-2 border-[#C99632] shadow-xl scale-[1.02]'
                      : 'bg-[#FFFCF7]/90 hover:bg-[#FFFCF7] text-[#10253A] border-[#0C2238]/10 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#E8C56B]' : 'text-[#C99632]'}`} />
                      <span className="text-xs font-extrabold uppercase tracking-wider font-display">{d.label}</span>
                    </div>
                    <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${isSelected ? 'bg-[#C99632]/20 text-[#E8C56B]' : 'bg-[#F7F4EE] text-[#627083]'}`}>
                      ACTIVE
                    </span>
                  </div>
                  <p className={`text-xs font-semibold ${isSelected ? 'text-slate-200' : 'text-[#627083]'}`}>
                    {d.summary}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Center Column: Central Student State Node (6. Ghost/Projected State Integration) */}
          <div className="lg:col-span-6 z-10 text-center py-4">
            <motion.div
              animate={{ scale: [1, 1.01, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="p-8 sm:p-10 rounded-full bg-gradient-to-b from-[#0C2238] via-[#0C2340] to-[#123B63] text-white border-4 border-[#C99632] shadow-2xl space-y-5 mx-auto max-w-md relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#C99632]/10 rounded-full blur-xl pointer-events-none" />

              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C99632]/20 border border-[#C99632]/40 text-[#E8C56B] text-[10px] font-mono font-bold uppercase">
                <Sparkles className="w-3 h-3 text-[#E8C56B]" />
                <span>LIVE DIGITAL TWIN NODE</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                  KRISHNA SINGH
                </h3>
                <p className="text-xs text-[#E8C56B] font-extrabold mt-1">
                  Career Goal: {state.careerGoal}
                </p>
              </div>

              {/* Current vs Projected State Display */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-around text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">CURRENT READINESS</span>
                  <span className="text-2xl font-extrabold text-white font-mono">{state.progress}%</span>
                </div>

                <div className="h-8 w-px bg-white/15" />

                <div>
                  <span className="text-[10px] text-[#E8C56B] font-extrabold uppercase block">PROJECTED (SIMULATION)</span>
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                    {state.projectedProgress || Math.min(100, state.progress + 12)}%
                  </span>
                  <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 ml-1">
                    SIMULATION
                  </span>
                </div>
              </div>

              <span className="text-[10px] text-slate-300 font-mono block">
                Synchronized with ERP Roster & Active Local Store
              </span>
            </motion.div>
          </div>

          {/* Right Column: 4 Dimension Nodes */}
          <div className="lg:col-span-3 space-y-4 z-10">
            {dimensions.slice(3, 7).map((d) => {
              const isSelected = selectedDimension === d.key;
              const Icon = d.icon;
              return (
                <div
                  key={d.key}
                  onClick={() => setSelectedDimension(d.key)}
                  className={`p-4 sm:p-5 rounded-3xl border transition-all duration-300 cursor-pointer space-y-2 relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#0C2340] text-white border-2 border-[#C99632] shadow-xl scale-[1.02]'
                      : 'bg-[#FFFCF7]/90 hover:bg-[#FFFCF7] text-[#10253A] border-[#0C2238]/10 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#E8C56B]' : 'text-[#C99632]'}`} />
                      <span className="text-xs font-extrabold uppercase tracking-wider font-display">{d.label}</span>
                    </div>
                    <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${isSelected ? 'bg-[#C99632]/20 text-[#E8C56B]' : 'bg-[#F7F4EE] text-[#627083]'}`}>
                      ACTIVE
                    </span>
                  </div>
                  <p className={`text-xs font-semibold ${isSelected ? 'text-slate-200' : 'text-[#627083]'}`}>
                    {d.summary}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

        {/* 4. CLICKABLE DIMENSION DETAILED INSPECTOR & 7. WHAT CHANGED BANNER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Detailed Inspector Box (8 cols) */}
          {activeDetail && (
            <motion.div
              key={selectedDimension}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#FFFCF7] border border-[#0C2238]/12 shadow-xl space-y-5 text-[#10253A]"
            >
              <div className="flex items-center justify-between border-b border-[#0C2238]/08 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="px-3 py-1 rounded-full bg-[#0C2238] text-[#E8C56B] text-xs font-mono font-bold">
                    DIMENSION: {selectedDimension}
                  </span>
                  <h3 className="text-base font-extrabold font-display">{activeDetail.title}</h3>
                </div>
                <span className="text-xs text-[#627083] font-medium">Click other nodes to inspect</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {activeDetail.metrics.map((m: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#F7F4EE] border border-[#0C2238]/08 space-y-1">
                    <span className="text-[10px] font-extrabold text-[#627083] uppercase block">{m.label}</span>
                    <span className="text-xs font-extrabold text-[#10253A] block">{m.val}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#0C2238] text-white space-y-1 text-xs">
                <span className="text-[10px] font-extrabold text-[#E8C56B] uppercase block">AI DIGITAL TWIN VERDICT</span>
                <p className="text-slate-200 leading-relaxed font-medium">"{activeDetail.verdict}"</p>
              </div>
            </motion.div>
          )}

          {/* 7. WHAT CHANGED? TIMELINE (4 cols) */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#0C2340]/95 text-white border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E8C56B]">
                WHAT CHANGED?
              </span>
              <span className="text-xs font-mono text-slate-300">Since Last Update</span>
            </div>

            <div className="space-y-2.5 text-xs font-bold">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-slate-200">Roadmap Progress</span>
                <span className="text-emerald-400 font-mono">{state.lastDeltas?.roadmapDelta || '+4% roadmap progress'}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-slate-200">PyTorch Proficiency</span>
                <span className="text-emerald-400 font-mono">{state.lastDeltas?.skillDelta || '+6% PyTorch proficiency'}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-slate-200">Completed Tasks</span>
                <span className="text-[#E8C56B] font-mono">{state.lastDeltas?.taskDelta || '1 task completed'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 8. NEXT BEST ACTION BANNER */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0C2238] to-[#123B63] text-white border border-[#C99632]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-[#E8C56B] fill-[#E8C56B]" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E8C56B]">
                NEXT BEST ACTION
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                EXPECTED IMPACT: HIGH (+4% Readiness)
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-white font-display">
              {state.todayPriority.title}
            </h3>
            <p className="text-xs text-slate-300">
              Calculated dynamically from your live Digital Twin state.
            </p>
          </div>

          <button
            onClick={() => {
              if (state.todayPriority.status === 'pending') {
                studentStore.startPriorityTask();
              } else if (state.todayPriority.status === 'active') {
                studentStore.completePriorityTask();
              }
            }}
            className="px-7 py-3 rounded-2xl bg-[#C99632] hover:bg-[#b08226] text-[#0C2238] font-extrabold text-xs transition-all shadow-md cursor-pointer shrink-0 flex items-center space-x-2"
          >
            <span>{state.todayPriority.status === 'completed' ? '✓ Action Completed' : 'Continue →'}</span>
          </button>
        </div>

      </div>

      {/* WHAT-IF SIMULATOR MODAL */}
      <FutureSimulatorModal
        isOpen={showSimulatorModal}
        onClose={() => setShowSimulatorModal(false)}
      />
    </section>
  );
};
