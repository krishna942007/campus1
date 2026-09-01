import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, CheckCircle2, Circle, Flag, Sparkles, Target, Clock, 
  Cpu, Layers, Check, RefreshCw, AlertCircle, Award, BookOpen, ChevronRight, Zap
} from 'lucide-react';
import { StatusBadge } from './ui/StatusBadge';
import { useStudentState, studentStore } from '../services/studentStateStore';

export const LearningRoadmapSection: React.FC = () => {
  const state = useStudentState();
  const [activeStepIndex, setActiveStepIndex] = useState<number>(1); // Default to Step 2 (Skill Gap)

  const steps = [
    {
      num: '01',
      stage: 'CURRENT SKILLS',
      title: 'Python, DSA & Fundamentals',
      status: 'VERIFIED',
      desc: 'Verified via Semester IV coursework and internal lab assessments.',
      completed: true,
    },
    {
      num: '02',
      stage: 'SKILL GAP IDENTIFIED',
      title: state.todayPriority.title,
      status: 'IN PROGRESS',
      desc: 'AI gap detector highlighted target role requirement difference.',
      completed: false,
    },
    {
      num: '03',
      stage: 'RECOMMENDED LEARNING',
      title: 'Deep Learning Specialization',
      status: state.learningStatus,
      desc: 'Self-paced module aligned with VIT autonomous elective credits.',
      completed: state.learningStatus === 'IN PROGRESS',
    },
    {
      num: '04',
      stage: 'PROJECT EVIDENCE',
      title: 'Autonomous Vision Capstone Project',
      status: state.evidenceStatus.toUpperCase(),
      desc: 'Faculty-guided capstone research repository for GitHub portfolio.',
      completed: state.evidenceStatus === 'Verified' || state.evidenceStatus === 'Submitted',
    },
    {
      num: '05',
      stage: 'TARGET GOAL',
      title: `${state.careerGoal}`,
      status: 'GOAL',
      desc: 'Target placement role benchmarked with industry partners.',
      completed: false,
    },
  ];

  return (
    <section id="roadmap" className="relative py-24 w-full bg-[#F7F4EE] border-t border-[#0C2238]/08 z-10 overflow-hidden">
      {/* Ambient Lighting Blobs behind Glass Surface */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#C99632]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#244F7D]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-10">
        
        {/* Section Header with Overall Roadmap Progress */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-4"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#EFE7D8] border border-[#C99632]/25">
              <Sparkles className="w-3.5 h-3.5 text-[#C99632]" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7A6437]">
                INTERACTIVE & STATEFUL LEARNING ROADMAP
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#10253A] tracking-tight leading-[1.12] font-display">
              FROM WHERE YOU ARE <br />
              <span className="text-[#C99632] font-serif-accent italic font-normal">
                TO WHERE YOU WANT TO BE.
              </span>
            </h2>

            <p className="text-base font-normal text-[#627083] leading-relaxed">
              Click any step below to inspect verified skills, skill gaps, recommended learning, project evidence, and goal benchmarks.
            </p>
          </motion.div>

          {/* Overall Roadmap Completion Gauge */}
          <div className="p-5 rounded-3xl bg-[#0C2238] text-white border border-[#C99632]/40 shadow-xl space-y-2 min-w-[260px]">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[#E8C56B] uppercase tracking-wider font-extrabold text-[10px]">ROADMAP COMPLETION</span>
              <span className="text-emerald-400 font-mono text-sm font-extrabold">{state.progress}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
              <motion.div
                animate={{ width: `${state.progress}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-[#244F7D] via-[#C99632] to-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* 9. NEXT BEST STEP & 10. AI ROADMAP REORDERING HIGHLIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Next Best Step Highlight Card (7 cols) */}
          <div className="md:col-span-7 p-6 rounded-3xl bg-gradient-to-r from-[#0C2238] to-[#123B63] border border-[#C99632]/40 text-white flex items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-[#E8C56B] fill-[#E8C56B]" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E8C56B]">
                  NEXT BEST STEP
                </span>
              </div>
              <h3 className="text-lg font-extrabold font-display text-white">
                {state.todayPriority.title}
              </h3>
              <p className="text-xs text-slate-300">
                Calculated dynamically from your current skill gap state.
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
              className="px-5 py-2.5 rounded-xl bg-[#C99632] hover:bg-[#b08226] text-[#0C2238] font-extrabold text-xs transition-all shadow-md cursor-pointer shrink-0 flex items-center space-x-1.5"
            >
              <span>{state.todayPriority.status === 'completed' ? '✓ Done' : 'Continue →'}</span>
            </button>
          </div>

          {/* AI Sequence Reordering Card (5 cols) */}
          <div className="md:col-span-5 p-6 rounded-3xl bg-[#FFFCF7]/90 backdrop-blur-md border border-[#0C2238]/12 text-[#10253A] flex flex-col justify-between space-y-3 shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-[#0C2238]/08 pb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C99632]">
                  AI SEQUENCE OPTIMIZER
                </span>
                <span className="text-[10px] font-mono text-[#0C2238]">
                  {state.sequenceOptimized ? 'Optimized' : 'Recommended'}
                </span>
              </div>
              <p className="text-xs text-[#627083] mt-2 leading-relaxed">
                "AI recommends ordering: <strong className="text-[#10253A]">PyTorch → Mentor → Project</strong> because mentor feedback improves capstone direction."
              </p>
            </div>

            <button
              onClick={() => studentStore.applySequenceOptimization()}
              disabled={state.sequenceOptimized}
              className={`w-full py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                state.sequenceOptimized
                  ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 cursor-not-allowed'
                  : 'bg-[#0C2238] hover:bg-[#07182A] text-white shadow-sm'
              }`}
            >
              {state.sequenceOptimized ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>✓ Sequence Optimized</span>
                </>
              ) : (
                <span>Apply Recommended Order</span>
              )}
            </button>
          </div>

        </div>

        {/* 1. CLICKABLE 5 ROADMAP STEPS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-stretch relative">
          
          {/* Connecting Progressive Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#C99632]/30 -translate-y-6 z-0" />

          {steps.map((s, idx) => {
            const isActive = activeStepIndex === idx;
            return (
              <motion.div
                key={s.num}
                onClick={() => setActiveStepIndex(idx)}
                initial={{ opacity: 0, scale: 0.94, y: 35 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`p-6 border flex flex-col justify-between relative space-y-4 rounded-3xl shadow-xl transition-all duration-300 z-10 cursor-pointer ${
                  isActive
                    ? 'bg-[#0C2340] text-white border-2 border-[#C99632] shadow-2xl scale-[1.03] -translate-y-2'
                    : s.completed
                    ? 'bg-[#0C2340]/80 text-white border-[#C99632]/40 hover:-translate-y-1'
                    : 'bg-[#FFFCF7]/90 hover:bg-[#FFFCF7] text-[#10253A] border-[#0C2238]/08 hover:-translate-y-1'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-extrabold ${isActive || s.completed ? 'text-[#E8C56B]' : 'text-[#C99632]'}`}>
                      STEP {s.num}
                    </span>
                    {s.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#E8C56B]" />
                    ) : (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#C99632]/30 bg-[#EFE7D8]/80 text-[#7A6437]">
                        {s.status}
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#C99632]">
                    {s.stage}
                  </div>

                  <h3 className="text-base font-extrabold leading-snug font-display">
                    {s.title}
                  </h3>
                </div>

                <p className={`text-xs font-normal leading-relaxed pt-3 border-t ${isActive || s.completed ? 'text-slate-300 border-white/10' : 'text-[#627083] border-[#0C2238]/08'}`}>
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* DETAILED INTERACTIVE STEP INSPECTOR PANEL */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStepIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="p-7 sm:p-8 rounded-3xl bg-[#FFFCF7]/95 backdrop-blur-xl border border-[#0C2238]/12 shadow-2xl space-y-5 text-[#10253A]"
          >
            <div className="flex items-center justify-between border-b border-[#0C2238]/08 pb-4">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-full bg-[#0C2238] text-[#E8C56B] text-xs font-mono font-bold">
                  STEP 0{activeStepIndex + 1} INSPECTOR
                </span>
                <h3 className="text-lg font-extrabold font-display">
                  {steps[activeStepIndex].stage} — Detailed State
                </h3>
              </div>
              <span className="text-xs text-[#627083] font-medium">Click step cards above to switch</span>
            </div>

            {/* STEP 1: CURRENT SKILLS */}
            {activeStepIndex === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { skill: 'Python', prof: '92%', source: 'Lab Eval CS501', date: 'Aug 2026', target: '85%' },
                    { skill: 'Data Structures', prof: '88%', source: 'Mid-Sem Exam', date: 'Jul 2026', target: '90%' },
                    { skill: 'PyTorch Neural Nets', prof: '32%', source: 'Initial Gap Detector', date: 'Aug 2026', target: '80%' }
                  ].map((s, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#F7F4EE] border border-[#0C2238]/08 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-extrabold font-display">{s.skill}</span>
                        <span className="text-xs font-bold text-[#C99632]">{s.prof}</span>
                      </div>
                      <div className="text-[11px] text-[#627083] space-y-1">
                        <p><strong>Source:</strong> {s.source}</p>
                        <p><strong>Last Updated:</strong> {s.date}</p>
                        <p><strong>Target Requirement:</strong> {s.target}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: SKILL GAP IDENTIFIED */}
            {activeStepIndex === 1 && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[#0C2238] text-white border border-[#C99632]/40 grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">SKILL</span>
                    <p className="text-sm font-extrabold text-[#E8C56B]">PyTorch Neural Nets</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">CURRENT / TARGET</span>
                    <p className="text-sm font-extrabold">32% → 80%</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">SKILL GAP</span>
                    <p className="text-sm font-extrabold text-amber-400">48% Gap</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">PRIORITY</span>
                    <p className="text-xs font-bold text-red-400 uppercase">HIGH PRIORITY</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">ESTIMATED EFFORT</span>
                    <p className="text-xs font-mono font-bold text-slate-200">~12 Hours</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: RECOMMENDED LEARNING */}
            {activeStepIndex === 2 && (
              <div className="p-5 rounded-2xl bg-[#F7F4EE] border border-[#0C2238]/08 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold font-display">Deep Learning Specialization (Module 3)</h4>
                  <p className="text-xs text-[#627083]">Self-paced autonomous elective aligned with VIT course credit regulations.</p>
                  <span className="inline-block text-[11px] font-bold text-[#C99632]">Status: {state.learningStatus}</span>
                </div>
                <button
                  onClick={() => studentStore.startRecommendedLearning()}
                  disabled={state.learningStatus === 'IN PROGRESS'}
                  className={`px-6 py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer shrink-0 ${
                    state.learningStatus === 'IN PROGRESS'
                      ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30 cursor-not-allowed'
                      : 'bg-[#0C2238] hover:bg-[#07182A] text-white shadow-md'
                  }`}
                >
                  {state.learningStatus === 'IN PROGRESS' ? '✓ In Progress' : 'Start Module'}
                </button>
              </div>
            )}

            {/* STEP 4: PROJECT EVIDENCE */}
            {activeStepIndex === 3 && (
              <div className="p-5 rounded-2xl bg-[#F7F4EE] border border-[#0C2238]/08 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-extrabold font-display">Autonomous Vision Capstone Project</h4>
                    <p className="text-xs text-[#627083]">Faculty-guided research repository for GitHub portfolio proof.</p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
                    Status: {state.evidenceStatus}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#0C2238]/08">
                  {(['Not Started', 'In Progress', 'Submitted', 'Verified'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => studentStore.updateEvidenceStatus(st)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                        state.evidenceStatus === st
                          ? 'bg-[#0C2238] text-white border-[#0C2238]'
                          : 'bg-white hover:bg-slate-100 text-[#10253A] border-[#0C2238]/10'
                      }`}
                    >
                      {st === 'Verified' ? '✓ Verified' : st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: TARGET GOAL */}
            {activeStepIndex === 4 && (
              <div className="p-5 rounded-2xl bg-[#0C2238] text-white border border-[#C99632]/40 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">TARGET ROLE</span>
                  <p className="text-sm font-extrabold text-[#E8C56B]">{state.careerGoal}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">READINESS</span>
                  <p className="text-sm font-extrabold">74% Current → <span className="text-emerald-400">86% Projected</span></p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">REMAINING GAPS</span>
                  <p className="text-sm font-extrabold text-amber-400">2 Key Gaps</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">TIME TO TARGET</span>
                  <p className="text-xs font-mono font-bold text-slate-200">~4 Weeks</p>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
