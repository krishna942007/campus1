import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, AlertCircle, PlusCircle, ShieldAlert, Sparkles, X, Target, 
  Clock, ArrowRight, ShieldCheck, Flame, Zap, Award, ChevronRight, BarChart2
} from 'lucide-react';
import { useStudentState, studentStore } from '../services/studentStateStore';

export interface DetailedSkill {
  name: string;
  percent: number;
  target: number;
  state: 'MASTERED' | 'MAINTAIN' | 'IMPROVE' | 'CRITICAL GAP';
  impact: 'HIGH IMPACT' | 'MEDIUM IMPACT' | 'LOW IMPACT';
  verdict: string;
  action: string;
  wasteHours?: number;
  reallocateTo?: string;
  rank: number;
  effort: string;
}

export const SkillGapSection: React.FC = () => {
  const state = useStudentState();
  const [selectedSkill, setSelectedSkill] = useState<DetailedSkill | null>(null);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [nextSkillFound, setNextSkillFound] = useState<DetailedSkill | null>(null);

  // Dynamic Skill Catalog mapped to student state
  const skillCatalog: DetailedSkill[] = [
    {
      name: 'PyTorch Neural Networks',
      percent: 32,
      target: 80,
      state: 'CRITICAL GAP',
      impact: 'HIGH IMPACT',
      verdict: 'Largest barrier to AI Research Engineer pathway. Immediate focus required.',
      action: 'CRITICAL GAP',
      rank: 1,
      effort: '12 hours'
    },
    {
      name: 'CUDA & Parallel Programming',
      percent: 20,
      target: 75,
      state: 'CRITICAL GAP',
      impact: 'HIGH IMPACT',
      verdict: 'Secondary technical requirement for deep learning hardware acceleration.',
      action: 'CRITICAL GAP',
      rank: 2,
      effort: '18 hours'
    },
    {
      name: 'Distributed System Design',
      percent: 70,
      target: 80,
      state: 'IMPROVE',
      impact: 'MEDIUM IMPACT',
      verdict: 'Moderate proficiency. Strengthening microservices architecture will improve readiness.',
      action: 'IMPROVE',
      rank: 3,
      effort: '16 hours'
    },
    {
      name: 'Data Structures & Algorithms',
      percent: 88,
      target: 85,
      state: 'MAINTAIN',
      impact: 'LOW IMPACT',
      verdict: 'Solid foundation. Periodic maintenance via practice sets is sufficient.',
      action: 'MAINTAIN',
      rank: 4,
      effort: '3 hours/wk'
    },
    {
      name: 'Python Programming',
      percent: 95,
      target: 85,
      state: 'MASTERED',
      impact: 'LOW IMPACT',
      verdict: 'You do not need to spend significant time improving Python right now.',
      action: 'MAINTAIN',
      wasteHours: 8,
      reallocateTo: 'PyTorch Neural Networks',
      rank: 5,
      effort: '0 hours'
    }
  ];

  const handleFindNextSkill = () => {
    // Select highest impact critical gap
    const highest = skillCatalog.find(s => s.state === 'CRITICAL GAP') || skillCatalog[0];
    setNextSkillFound(highest);
    setSelectedSkill(highest);
  };

  const handleAddToRoadmap = (skill: DetailedSkill) => {
    studentStore.applyFuturePlan({
      actionNames: [skill.name],
      projectedProgress: Math.min(100, state.progress + 4),
      primaryAction: `Master ${skill.name}`
    });
    setNextSkillFound(null);
  };

  return (
    <section className="relative py-24 w-full bg-[#F7F4EE] border-t border-[#0C2238]/08 z-10 overflow-hidden">
      {/* Ambient Lighting Blobs behind Glass Surface */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#C99632]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#244F7D]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-10">
        
        {/* Section Header */}
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
                Intelligent Skill Analysis System
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#10253A] tracking-tight leading-[1.12] font-display">
              Know Where <br />
              <span className="text-[#C99632] font-serif-accent italic font-normal">
                You Stand.
              </span>
            </h2>

            <p className="text-base font-normal text-[#627083] leading-relaxed">
              Click any skill card to open detailed AI verdicts, time-waste alerts, high-impact rankings, and role comparison benchmarks.
            </p>
          </motion.div>

          {/* Action Control Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-5 py-3 rounded-full bg-[#FFFCF7]/90 hover:bg-[#FFFCF7] text-[#10253A] border border-[#0C2238]/12 text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center space-x-2"
            >
              <BarChart2 className="w-4 h-4 text-[#C99632]" />
              <span>{showComparison ? 'Hide Role Comparison' : 'Compare with Target Role'}</span>
            </button>

            <button
              onClick={handleFindNextSkill}
              className="px-6 py-3 rounded-full bg-[#0C2238] hover:bg-[#07182A] text-white text-xs font-extrabold shadow-xl hover:shadow-2xl transition-all cursor-pointer flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-[#E8C56B]" />
              <span>Find My Next Skill →</span>
            </button>
          </div>
        </div>

        {/* Current vs Target Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Skill Cards Grid (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 p-6 sm:p-8 bg-[#FFFFFF]/10 backdrop-blur-[5px] border border-[#0C2238]/08 shadow-xl shadow-[#0C2238]/05 space-y-5 rounded-3xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-[#0C2238]/08 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-[#C99632] tracking-wider block uppercase">
                  ACTIVE SKILL MATRIX
                </span>
                <h3 className="text-xl font-extrabold font-display text-[#10253A]">Click Any Skill to Inspect</h3>
              </div>
              <span className="text-xs font-extrabold text-[#159A72] bg-[#E6F4ED]/80 backdrop-blur-xs px-3 py-1 border border-[#159A72]/20 rounded-full">
                5 SKILLS MONITORED
              </span>
            </div>

            <div className="space-y-3.5">
              {skillCatalog.map((item) => {
                const isSelected = selectedSkill?.name === item.name;
                return (
                  <div 
                    key={item.name}
                    onClick={() => setSelectedSkill(item)}
                    className={`p-4 border rounded-2xl transition-all duration-300 cursor-pointer space-y-2 relative overflow-hidden ${
                      isSelected
                        ? 'bg-[#0C2340] text-white border-[#C99632] shadow-xl scale-[1.01]'
                        : item.state === 'CRITICAL GAP'
                        ? 'bg-[#FFFCF7]/90 hover:bg-[#FFFCF7] border-red-500/30 text-[#10253A]'
                        : 'bg-[#FFFCF7]/90 hover:bg-[#FFFCF7] border-[#0C2238]/08 text-[#10253A]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        {item.state === 'MASTERED' && <Check className="w-4 h-4 text-emerald-500" />}
                        {item.state === 'MAINTAIN' && <ShieldCheck className="w-4 h-4 text-[#C99632]" />}
                        {item.state === 'IMPROVE' && <Zap className="w-4 h-4 text-amber-500" />}
                        {item.state === 'CRITICAL GAP' && <Flame className="w-4 h-4 text-red-500 animate-pulse" />}
                        <span className="font-extrabold text-sm">{item.name}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {item.wasteHours && (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 border border-amber-500/30">
                            STOP SPENDING TIME HERE
                          </span>
                        )}
                        <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                          item.state === 'MASTERED'
                            ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                            : item.state === 'MAINTAIN'
                            ? 'bg-[#C99632]/15 text-[#C99632] border-[#C99632]/30'
                            : item.state === 'IMPROVE'
                            ? 'bg-amber-500/15 text-amber-600 border-amber-500/30'
                            : 'bg-red-500/15 text-red-500 border-red-500/30'
                        }`}>
                          {item.state}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Level */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold opacity-90">
                        <span>Current: {item.percent}%</span>
                        <span>Required: {item.target}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#0C2238]/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percent}%` }}
                          transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${
                            item.state === 'MASTERED'
                              ? 'bg-emerald-500'
                              : item.state === 'CRITICAL GAP'
                              ? 'bg-gradient-to-r from-red-500 to-amber-500'
                              : 'bg-gradient-to-r from-[#0C2238] to-[#C99632]'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right: High Impact Ranking & Selected Skill Inspector (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 p-6 sm:p-8 bg-[#FAF7F0]/95 sm:bg-[#F7F4EE]/90 backdrop-blur-xl text-[#10253A] border border-[#0C2238]/12 shadow-2xl space-y-6 rounded-3xl relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#0C2238]/10 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-[#C99632] tracking-wider block uppercase">
                  HIGH IMPACT RANKING
                </span>
                <h3 className="text-xl font-extrabold font-display text-[#10253A]">Role Priority Index</h3>
              </div>
              <span className="text-xs font-extrabold text-[#0C2238] bg-[#EFE7D8] px-3 py-1 border border-[#C99632]/35 rounded-full">
                TARGET: {state.careerGoal}
              </span>
            </div>

            {/* High Impact Skills List */}
            <div className="space-y-2.5">
              {skillCatalog
                .filter(s => s.impact === 'HIGH IMPACT' || s.impact === 'MEDIUM IMPACT')
                .map(s => (
                  <div key={s.name} className="p-3.5 rounded-2xl bg-[#FFFCF7] border border-[#0C2238]/10 flex items-center justify-between text-xs shadow-2xs">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#0C2238]/08 text-[#0C2238] font-mono font-bold flex items-center justify-center text-[10px]">
                        #{s.rank}
                      </span>
                      <span className="font-extrabold text-[#10253A]">{s.name}</span>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      s.impact === 'HIGH IMPACT' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {s.impact}
                    </span>
                  </div>
                ))}
            </div>

            {/* 4. TIME WASTE DETECTOR BANNER */}
            <div className="p-4 rounded-2xl bg-[#EFE7D8]/80 border border-[#C99632]/40 space-y-1.5">
              <div className="flex items-center space-x-2 text-[#7A6437]">
                <ShieldAlert className="w-4 h-4 text-[#C99632]" />
                <span className="text-xs font-extrabold uppercase">TIME WASTE DETECTOR ACTIVE</span>
              </div>
              <p className="text-xs text-[#627083] leading-relaxed">
                Python score (95%) exceeds required benchmark (85%). Stop spending study time on Python and reallocate <strong className="text-[#0C2238]">~8 hours</strong> to PyTorch.
              </p>
            </div>

            {/* Selected Skill Inspector Modal / Expanded Box */}
            {selectedSkill && (
              <div className="p-5 rounded-2xl bg-[#FFFCF7] border border-[#C99632]/40 space-y-3 relative shadow-md">
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="absolute top-3 right-3 p-1 rounded-lg hover:bg-[#0C2238]/08 text-[#627083] hover:text-[#10253A]"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#C99632]" />
                  <h4 className="text-sm font-extrabold text-[#10253A] font-display">{selectedSkill.name} Analysis</h4>
                </div>

                <div className="text-xs space-y-1.5 text-[#627083]">
                  <p><strong>Current vs Target:</strong> {selectedSkill.percent}% vs {selectedSkill.target}% ({selectedSkill.state})</p>
                  <p className="italic text-[#C99632]">"AI Verdict: {selectedSkill.verdict}"</p>
                  {selectedSkill.wasteHours && (
                    <p className="text-amber-700 font-bold">⚠️ Waste Alert: ~{selectedSkill.wasteHours} unnecessary study hours detected!</p>
                  )}
                </div>

                <button
                  onClick={() => handleAddToRoadmap(selectedSkill)}
                  className="w-full py-2.5 rounded-xl bg-[#0C2238] hover:bg-[#123B63] text-white font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <span>Add {selectedSkill.name} to Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E8C56B]" />
                </button>
              </div>
            )}

          </motion.div>

        </div>

        {/* Visual Role Comparison Inspector */}
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-[#FFFCF7] border border-[#0C2238]/12 shadow-xl space-y-5 text-[#10253A]"
          >
            <div className="flex items-center justify-between border-b border-[#0C2238]/08 pb-3">
              <h3 className="text-base font-extrabold font-display flex items-center space-x-2">
                <BarChart2 className="w-5 h-5 text-[#C99632]" />
                <span>Visual Level vs Target Role Requirement ({state.careerGoal})</span>
              </h3>
              <button onClick={() => setShowComparison(false)} className="text-xs text-[#627083] hover:text-[#10253A]">
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skillCatalog.map(s => (
                <div key={s.name} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-extrabold">
                    <span>{s.name}</span>
                    <span className="text-[#C99632]">You: {s.percent}% | Role: {s.target}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#F7F4EE] border border-[#0C2238]/10 overflow-hidden relative">
                    <div className="h-full bg-slate-300 opacity-60 absolute left-0" style={{ width: `${s.target}%` }} />
                    <div className="h-full bg-[#0C2238] absolute left-0" style={{ width: `${s.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
};
