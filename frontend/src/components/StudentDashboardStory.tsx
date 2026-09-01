import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Sparkles, Lock, CheckCircle2, Zap, ArrowRight, Target, Clock,
  Check, Info, HelpCircle, Layers, BookOpen, Code, Rocket, TrendingUp,
  RefreshCw, Briefcase, ChevronRight, X, Cpu, Star
} from 'lucide-react';
import { StatusBadge } from './ui/StatusBadge';
import { useStudentState, studentStore } from '../services/studentStateStore';
import { FutureSimulatorModal } from './FutureSimulatorModal';

const AnimatedNumber: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(value);

  React.useEffect(() => {
    let start = displayValue;
    let end = value;
    if (start === end) return;
    let duration = 600;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [value]);

  return <span>{displayValue}{suffix}</span>;
};

export const StudentDashboardStory: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const state = useStudentState();

  const studentQuestions = [
    {
      q: "HOW AM I PERFORMING ACADEMICALLY?",
      answer: `Current CGPA is ${state.cgpa} (Rank 4 in Computer Engineering Dept). Attendance across all 6 core subjects is ${state.attendance}%, comfortably above the 75% institutional requirement.`,
      metric: `${state.cgpa} CGPA // ${state.attendance}% ATTENDANCE`,
      status: "EXCELLENT",
    },
    {
      q: "WHERE ARE MY SKILL GAPS?",
      answer: `Selected target role (${state.careerGoal}) requires additional proficiency in target milestones. Active focus: ${state.todayPriority.title}.`,
      metric: `GAP DETECTED: ${state.todayPriority.title.toUpperCase()}`,
      status: "ADVISORY ACTION",
    },
    {
      q: "WHAT HAS MY MENTOR SAID?",
      answer: "Faculty Mentor Prof. S. Kulkarni logged meeting outcome: 'Strong academic performance. Recommended focusing on final year capstone AI research paper submission for IEEE.'",
      metric: "MEETING LOGGED 12-AUG-2026",
      status: "MENTOR SIGN-OFF",
    },
    {
      q: "WHAT SHOULD I DO NEXT?",
      answer: `Action item: ${state.todayPriority.title} (${state.todayPriority.impact}) to accelerate roadmap readiness.`,
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
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7A6437]">
              PERSONALIZED STUDENT DASHBOARD
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#10253A] tracking-tight leading-[1.12] font-display">
            UNDERSTAND YOUR <br />
            <span className="text-[#C99632] font-serif-accent italic font-normal">
              ENTIRE JOURNEY.
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

        {/* WHAT IF? — FUTURE SIMULATOR Entry Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#0C2238] via-[#123B63] to-[#07182A] border border-[#C99632]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C99632]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#C99632]/20 transition-all duration-500" />

          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C99632]/20 border border-[#C99632]/40 text-[#E8C56B] text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIGNATURE ACADEMIC INTELLIGENCE FEATURE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              WHAT IF? — FUTURE SIMULATOR
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              "See how your next decision could change your trajectory." Simulate possible academic, skill, and mentoring actions using your current student profile.
            </p>
          </div>

          <div className="shrink-0 relative z-10">
            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="px-7 py-4 rounded-full bg-[#C99632] hover:bg-[#b08226] text-[#0C2238] font-extrabold text-xs sm:text-sm shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all cursor-pointer flex items-center space-x-2"
            >
              <span>Simulate My Future →</span>
            </button>
          </div>
        </motion.div>

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
                <span className="text-[#E8C56B]">https://campus1.edu/student-app/dashboard</span>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge variant="OFFICIAL" label="OFFICIAL ERP VERIFIED" />
              </div>
            </div>

            {/* Desktop Workspace Canvas */}
            <div className="p-6 sm:p-10 space-y-7">
              
              {/* Header Profile Titlebar + Live Profile Sync Indicator */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold text-lg shadow-md border border-white/15">
                    <User className="w-6 h-6 text-[#E8C56B]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-white font-display flex items-center space-x-3">
                      <span>Krishna Singh</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C99632]/20 border border-[#C99632]/40 text-[#E8C56B] font-mono font-bold">
                        {state.careerGoal}
                      </span>
                    </h3>
                    <span className="text-xs text-slate-300 font-extrabold tracking-wide">
                      B.Tech Computer Engineering (Batch 2023-2027) • ID: 2023CSE001
                    </span>
                  </div>
                </div>

                {/* Live Profile Sync Indicator */}
                <div className="flex items-center space-x-3">
                  <div className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-mono font-bold flex items-center space-x-2">
                    {state.syncStatus === 'updating' ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 text-[#C99632] animate-spin" />
                        <span className="text-[#E8C56B]">● UPDATING PROFILE...</span>
                      </>
                    ) : state.syncStatus === 'updated' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span className="text-emerald-400">● PROFILE UPDATED</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                        <span className="text-emerald-400">● PROFILE SYNCED</span>
                      </>
                    )}
                  </div>

                  <div className="px-3 py-1.5 rounded-full bg-white/10 text-[#E8C56B] font-extrabold text-[11px] border border-white/15 shadow-xs">
                    RANK #4 IN DEPT
                  </div>
                </div>
              </div>

              {/* 1. LIVE TOP METRICS BAR */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Courses */}
                <div className="p-4.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">COURSES</span>
                  <div className="text-2xl font-extrabold text-white font-display">0{state.courses.active} Active</div>
                  <span className="text-[11px] text-emerald-400 font-medium block">All 6 Enrolled</span>
                </div>

                {/* Tasks */}
                <div className="p-4.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">TASKS</span>
                  <div className="text-2xl font-extrabold text-[#E8C56B] font-display">
                    <AnimatedNumber value={state.tasks.pending} /> Pending
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium block">{state.tasks.completed} Completed so far</span>
                </div>

                {/* Progress */}
                <div className="p-4.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">PROGRESS</span>
                    <span className="text-xs font-extrabold text-emerald-400">
                      <AnimatedNumber value={state.progress} suffix="%" />
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${state.progress}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-[#244F7D] via-[#C99632] to-emerald-400"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block">Roadmap Velocity: High</span>
                </div>

                {/* Opportunities */}
                <div className="p-4.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">OPPORTUNITIES</span>
                    <div className="text-2xl font-extrabold text-white font-display">
                      0<AnimatedNumber value={state.opportunities} /> Open
                    </div>
                  </div>
                  <button
                    onClick={() => studentStore.applyOpportunity()}
                    className="mt-2 w-full py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-bold text-[#E8C56B] transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <span>Apply / Save</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>

              {/* Active Question Highlight Display */}
              <div className="p-6 sm:p-7 bg-white/5 backdrop-blur-md text-white border border-white/10 space-y-3 rounded-2xl shadow-xl relative overflow-hidden">
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
                <h4 className="text-lg sm:text-xl font-extrabold text-white font-display leading-tight relative z-10">
                  "{studentQuestions[activeQuestion].q}"
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed relative z-10">
                  {studentQuestions[activeQuestion].answer}
                </p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-semibold relative z-10">
                  <span className="text-[#E8C56B] font-extrabold uppercase tracking-wider text-[10px]">SIGNAL METRIC:</span>
                  <span className="font-extrabold text-white bg-white/10 px-3 py-1 rounded-lg border border-white/15 font-mono text-[11px]">
                    {studentQuestions[activeQuestion].metric}
                  </span>
                </div>
              </div>

              {/* 2. TODAY'S PRIORITY & 4. LIVE AI RECOMMENDATION GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Today's Priority Card (7 cols) */}
                <div className="lg:col-span-7 p-6 rounded-2xl bg-gradient-to-br from-[#0C2238]/90 to-[#123B63]/80 border border-[#C99632]/40 shadow-xl space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-[#E8C56B] fill-[#E8C56B]" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#E8C56B]">
                        TODAY'S PRIORITY
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C99632]/20 text-[#E8C56B] border border-[#C99632]/40 text-[10px] font-mono font-bold">
                      {state.todayPriority.impact}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-white font-display">
                      {state.todayPriority.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      <strong className="text-[#E8C56B]">Why this matters:</strong> {state.todayPriority.reason}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    {state.todayPriority.status === 'pending' && (
                      <button
                        onClick={() => studentStore.startPriorityTask()}
                        className="px-5 py-2.5 rounded-xl bg-[#C99632] hover:bg-[#b08226] text-[#0C2238] font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center space-x-1.5"
                      >
                        <span>Start Task</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {state.todayPriority.status === 'active' && (
                      <button
                        onClick={() => studentStore.completePriorityTask()}
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center space-x-1.5 animate-pulse"
                      >
                        <span>Complete Task</span>
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {state.todayPriority.status === 'completed' && (
                      <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-xs flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>✓ Completed</span>
                      </div>
                    )}

                    <button
                      onClick={() => setShowWhyModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-[#E8C56B]" />
                      <span>Why?</span>
                    </button>
                  </div>
                </div>

                {/* Live AI Recommendation Card (5 cols) */}
                <div className="lg:col-span-5 p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-[#E8C56B]" />
                        <span className="text-xs font-extrabold uppercase tracking-wider text-[#E8C56B]">
                          AI RECOMMENDATION
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {state.recommendations[0]?.impact || '+4% readiness'}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-white font-display">
                      {state.recommendations[0]?.topic || 'Focus on PyTorch & Deep Learning'}
                    </h4>

                    <div className="text-[11px] text-slate-300 space-y-1">
                      <span className="text-slate-400 font-medium block">Based on:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(state.recommendations[0]?.basedOn || ['skill gaps', 'career goal']).map((b, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-white/10 border border-white/10 text-[10px] text-slate-200">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (state.recommendations[0] && !state.recommendations[0].added) {
                        studentStore.addRecommendationToRoadmap(state.recommendations[0].id);
                      }
                    }}
                    disabled={state.recommendations[0]?.added}
                    className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                      state.recommendations[0]?.added
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 cursor-not-allowed'
                        : 'bg-white/10 hover:bg-white/20 border border-white/15 text-white'
                    }`}
                  >
                    {state.recommendations[0]?.added ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>✓ Added to Roadmap</span>
                      </>
                    ) : (
                      <>
                        <PlusIcon />
                        <span>Add to Roadmap</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* 3. YOUR PROGRESS STAGES & 5. RECENT ACTIVITY GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
                
                {/* Your Progress Interactive Stage Panel (7 cols) */}
                <div className="lg:col-span-7 p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#E8C56B]">
                      YOUR PROGRESS STAGES
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Click stages to inspect</span>
                  </div>

                  {/* Stage Tabs */}
                  <div className="grid grid-cols-4 gap-2">
                    {(['LEARN', 'PRACTICE', 'BUILD', 'GROW'] as const).map((stg) => (
                      <button
                        key={stg}
                        onClick={() => studentStore.setProgressStage(stg)}
                        className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                          state.activeProgressStage === stg
                            ? 'bg-[#C99632] text-[#0C2238] border-[#C99632] shadow-md'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                        }`}
                      >
                        {stg}
                      </button>
                    ))}
                  </div>

                  {/* Stage Content Window */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={state.activeProgressStage}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
                    >
                      {state.activeProgressStage === 'LEARN' && (
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center text-white font-extrabold">
                            <span>Deep Learning Specialization (Module 3)</span>
                            <span className="text-[#E8C56B]">75% Complete</span>
                          </div>
                          <p className="text-slate-300 text-[11px]">Next Lesson: Optimization Algorithms & Adam Optimizer</p>
                          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className="w-[75%] h-full bg-[#C99632] rounded-full" />
                          </div>
                        </div>
                      )}

                      {state.activeProgressStage === 'PRACTICE' && (
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center text-white font-extrabold">
                            <span>Technical & DSA Practice Track</span>
                            <span className="text-emerald-400">82% Solved</span>
                          </div>
                          <p className="text-slate-300 text-[11px]">Active Set: Graphs, Dynamic Programming & PyTorch Tensors</p>
                          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className="w-[82%] h-full bg-emerald-400 rounded-full" />
                          </div>
                        </div>
                      )}

                      {state.activeProgressStage === 'BUILD' && (
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center text-white font-extrabold">
                            <span>Capstone & GitHub Portfolio</span>
                            <span className="text-sky-400">Phase 2 Validated</span>
                          </div>
                          <p className="text-slate-300 text-[11px]">Active Repo: Autonomous Vision Transformer & RAG Copilot</p>
                          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className="w-[65%] h-full bg-sky-400 rounded-full" />
                          </div>
                        </div>
                      )}

                      {state.activeProgressStage === 'GROW' && (
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center text-white font-extrabold">
                            <span>Career Readiness & Mentorship</span>
                            <span className="text-purple-400">IEEE Paper Track</span>
                          </div>
                          <p className="text-slate-300 text-[11px]">Mentor Review logged by Prof. S. Kulkarni (Approved)</p>
                          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className="w-[90%] h-full bg-purple-400 rounded-full" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* 5. RECENT ACTIVITY FEED (5 cols) */}
                <div className="lg:col-span-5 p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#E8C56B]">
                      RECENT ACTIVITY
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">Real-time Stream</span>
                  </div>

                  <div className="space-y-2.5 max-h-[170px] overflow-y-auto pr-1">
                    {state.recentActivity.map((act) => (
                      <motion.div
                        key={act.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E8C56B] shrink-0" />
                          <span className="font-semibold text-slate-200 truncate">{act.text}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap shrink-0">{act.timestamp}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </motion.div>
      </div>

      {/* WHY MODAL EXPLANATION DIALOG */}
      <AnimatePresence>
        {showWhyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="max-w-md w-full rounded-3xl bg-[#0C2238] border border-[#C99632]/50 p-6 text-white shadow-2xl space-y-4 relative"
            >
              <button
                onClick={() => setShowWhyModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-[#E8C56B]" />
                <h3 className="text-base font-extrabold font-display">Why This Priority?</h3>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                "{state.todayPriority.explanation}"
              </p>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">Target Role:</span>
                <span className="font-extrabold text-[#E8C56B]">{state.careerGoal}</span>
              </div>

              <button
                onClick={() => setShowWhyModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#C99632] hover:bg-[#b08226] text-[#0C2238] font-extrabold text-xs transition-all shadow-md cursor-pointer"
              >
                Understood
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FUTURE SIMULATOR MODAL */}
      <FutureSimulatorModal 
        isOpen={isSimulatorOpen} 
        onClose={() => setIsSimulatorOpen(false)} 
      />
    </section>
  );
};

const PlusIcon = () => (
  <svg className="w-4 h-4 text-[#E8C56B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
