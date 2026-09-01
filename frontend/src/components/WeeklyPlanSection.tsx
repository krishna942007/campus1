import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, Calendar, Sparkles, Zap, ArrowRight, Check, ShieldAlert, 
  Sliders, PlusCircle, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';
import { useStudentState, studentStore } from '../services/studentStateStore';

export interface AllocationItem {
  id: string;
  name: string;
  hours: number;
  reason: string;
  warning?: string;
}

export const WeeklyPlanSection: React.FC = () => {
  const state = useStudentState();
  const [totalWeeklyHours, setTotalWeeklyHours] = useState<number>(10);
  const [allocations, setAllocations] = useState<AllocationItem[]>([
    { id: 'al-1', name: 'PyTorch', hours: 3.0, reason: 'PyTorch receives more time because it is currently your largest high-impact skill gap.' },
    { id: 'al-2', name: 'AI Project', hours: 2.5, reason: 'Capstone project requires portfolio evidence for IEEE draft.' },
    { id: 'al-3', name: 'DSA Practice', hours: 1.5, reason: 'Essential maintenance for technical placement interviews.', warning: 'Reducing DSA time below 1.5h may slow problem solving speed.' },
    { id: 'al-4', name: 'Research Paper', hours: 1.5, reason: 'Faculty mentor advised prioritizing conference manuscript.' },
    { id: 'al-5', name: 'Mentoring Review', hours: 0.5, reason: 'Weekly check-in preparation with Prof. S. Kulkarni.' },
    { id: 'al-[#6]', name: 'Weekly Review', hours: 1.0, reason: 'Consolidate progress metrics and roadmap velocity.' }
  ]);

  const [applied, setApplied] = useState<boolean>(false);

  const handleWeeklyHoursChange = (hrs: number) => {
    setTotalWeeklyHours(hrs);
    setApplied(false);
    const ratio = hrs / 10;
    setAllocations(prev => prev.map(a => ({
      ...a,
      hours: Math.round((a.hours * ratio) * 10) / 10
    })));
  };

  const handleAdjustHours = (id: string, delta: number) => {
    setApplied(false);
    setAllocations(prev => prev.map(a => {
      if (a.id === id) {
        const newH = Math.max(0.5, Math.round((a.hours + delta) * 10) / 10);
        return { ...a, hours: newH };
      }
      return a;
    }));
  };

  const handleAddToTasks = () => {
    studentStore.applyFuturePlan({
      actionNames: allocations.map(a => `${a.name} (${a.hours}h/wk)`),
      projectedProgress: Math.min(100, state.progress + 4),
      primaryAction: `Execute ${allocations[0].name} Weekly Plan (${allocations[0].hours}h)`
    });
    setApplied(true);
  };

  // Day-by-Day schedule breakdown
  const dailySchedule = [
    { day: 'MONDAY', task: `${allocations[0]?.name || 'PyTorch'} — 45 min`, focus: 'Core Skill Gap' },
    { day: 'TUESDAY', task: `${allocations[2]?.name || 'DSA Practice'} — 30 min`, focus: 'Algorithmic Speed' },
    { day: 'WEDNESDAY', task: `${allocations[0]?.name || 'PyTorch'} — 60 min`, focus: 'Lab & Tensor Ops' },
    { day: 'THURSDAY', task: `${allocations[1]?.name || 'AI Project'} — 60 min`, focus: 'Capstone Repository' },
    { day: 'FRIDAY', task: `${allocations[3]?.name || 'Research'} & Mentoring — 45 min`, focus: 'Faculty Review' },
    { day: 'SATURDAY / SUNDAY', task: 'Capstone Build & Weekly Review — 90 min', focus: 'Portfolio Consolidation' },
  ];

  return (
    <section id="weekly-plan" className="relative py-24 w-full bg-[#F7F4EE] border-t border-[#0C2238]/08 z-10 overflow-hidden">
      {/* Ambient Lighting Blobs behind Glass Surface */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#C99632]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#244F7D]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-10">
        
        {/* Section Headline */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-4"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#EFE7D8] border border-[#C99632]/25">
              <Clock className="w-3.5 h-3.5 text-[#C99632]" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7A6437]">
                AI TIME-ALLOCATION & WEEKLY PLAN ENGINE
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#10253A] tracking-tight leading-[1.12] font-display">
              YOUR WEEK. <br />
              <span className="text-[#C99632] font-serif-accent italic font-normal">
                "WHERE SHOULD YOUR LIMITED STUDY TIME GO?"
              </span>
            </h2>

            <p className="text-base font-normal text-[#627083] leading-relaxed">
              Convert your active roadmap priorities into a realistic day-by-day weekly study schedule based on available time.
            </p>
          </motion.div>

          {/* Select Available Weekly Time Buttons */}
          <div className="p-4 rounded-3xl bg-[#0C2238] text-white border border-[#C99632]/40 shadow-xl space-y-2">
            <span className="text-[10px] font-extrabold text-[#E8C56B] uppercase tracking-wider block">
              SELECT AVAILABLE STUDY TIME
            </span>
            <div className="flex flex-wrap gap-2">
              {[3, 5, 10, 15, 20].map((hrs) => (
                <button
                  key={hrs}
                  onClick={() => handleWeeklyHoursChange(hrs)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                    totalWeeklyHours === hrs
                      ? 'bg-[#C99632] text-[#0C2238] border-[#C99632] shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-slate-300 border-white/10'
                  }`}
                >
                  {hrs === 20 ? '20+ h/wk' : `${hrs} h/wk`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column Grid: AI Time Allocation vs Day-by-Day Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: AI Allocation Adjuster (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-[#FFFCF7]/95 backdrop-blur-xl border border-[#0C2238]/12 shadow-xl space-y-6 rounded-3xl text-[#10253A]">
            <div className="flex items-center justify-between border-b border-[#0C2238]/08 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-[#C99632] tracking-wider block uppercase">
                  AI TIME ALLOCATION BREAKDOWN
                </span>
                <h3 className="text-xl font-extrabold font-display text-[#10253A]">
                  Total Budget: {totalWeeklyHours} Hours / Week
                </h3>
              </div>
              <span className="text-xs font-mono font-extrabold text-[#159A72] bg-[#E6F4ED] px-3 py-1 rounded-full border border-[#159A72]/20">
                REALISTIC PLAN
              </span>
            </div>

            {/* Allocation Sliders & Reasons */}
            <div className="space-y-4">
              {allocations.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#F7F4EE] border border-[#0C2238]/08 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="font-extrabold text-sm text-[#10253A]">{item.name}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAdjustHours(item.id, -0.5)}
                        className="w-6 h-6 rounded-lg bg-white border border-[#0C2238]/15 text-[#10253A] font-extrabold flex items-center justify-center cursor-pointer hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="font-mono text-sm text-[#C99632] w-12 text-center">{item.hours}h</span>
                      <button
                        onClick={() => handleAdjustHours(item.id, 0.5)}
                        className="w-6 h-6 rounded-lg bg-white border border-[#0C2238]/15 text-[#10253A] font-extrabold flex items-center justify-center cursor-pointer hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#627083] leading-relaxed">
                    <strong className="text-[#C99632]">Why:</strong> {item.reason}
                  </p>

                  {item.warning && item.hours < 1.5 && (
                    <div className="text-[10px] text-amber-600 font-semibold flex items-center space-x-1">
                      <ShieldAlert className="w-3 h-3 text-amber-500" />
                      <span>{item.warning}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Apply Button */}
            <button
              onClick={handleAddToTasks}
              disabled={applied}
              className={`w-full py-3.5 rounded-2xl font-extrabold text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer ${
                applied
                  ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/40 cursor-not-allowed'
                  : 'bg-[#0C2238] hover:bg-[#07182A] text-white shadow-xl'
              }`}
            >
              {applied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>✓ TASKS ADDED TO DASHBOARD</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 text-[#E8C56B]" />
                  <span>Add Generated Schedule to My Tasks →</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Day-by-Day Schedule View (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[#0C2340]/95 text-white border border-white/10 shadow-2xl space-y-5 rounded-3xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-[#E8C56B] tracking-wider block uppercase">
                  DAY-BY-DAY SCHEDULE
                </span>
                <h3 className="text-xl font-extrabold font-display text-white">Weekly Execution Plan</h3>
              </div>
              <Calendar className="w-5 h-5 text-[#E8C56B]" />
            </div>

            <div className="space-y-3">
              {dailySchedule.map((d, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-xs">
                  <div className="flex justify-between items-center font-extrabold">
                    <span className="text-[#E8C56B] font-mono text-[11px]">{d.day}</span>
                    <span className="text-slate-300 font-medium text-[10px]">{d.focus}</span>
                  </div>
                  <p className="text-white font-semibold">{d.task}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-slate-300 leading-relaxed italic">
              "LIMITED TIME → AI PRIORITIZATION → REALISTIC PLAN → ROADMAP PROGRESS"
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
