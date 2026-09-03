import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, X, ArrowRight, Check, RefreshCw, Zap, Clock, Calendar, 
  Target, Cpu, Layers, Award, BookOpen, Users, Compass, CheckCircle2, BookmarkPlus
} from 'lucide-react';
import { useStudentState, studentStore } from '../services/studentStateStore';

interface ActionItem {
  id: string;
  category: 'ACADEMIC' | 'SKILLS' | 'EXPERIENCE' | 'MENTORING';
  title: string;
  readinessBonus: number;
  alignmentBonus: number;
  hours: number;
  description: string;
}

const ACTION_CATALOG: Record<string, ActionItem[]> = {
  'AI Research Engineer': [
    { id: 'ac-1', category: 'ACADEMIC', title: 'Improve CGPA to 9.0+', readinessBonus: 3, alignmentBonus: 2, hours: 20, description: 'Elevates institutional standing for elite research master programs.' },
    { id: 'ac-2', category: 'ACADEMIC', title: 'Maintain 90%+ Attendance', readinessBonus: 2, alignmentBonus: 2, hours: 10, description: 'Ensures full compliance and dean honors eligibility.' },
    { id: 'sk-1', category: 'SKILLS', title: 'Complete PyTorch Module 3', readinessBonus: 4, alignmentBonus: 6, hours: 12, description: 'Addresses neural network implementation skill gap.' },
    { id: 'sk-2', category: 'SKILLS', title: 'Learn CUDA GPU Kernels', readinessBonus: 5, alignmentBonus: 7, hours: 18, description: 'High performance parallel tensor acceleration.' },
    { id: 'sk-3', category: 'SKILLS', title: 'Improve DSA Graph Algorithms', readinessBonus: 3, alignmentBonus: 4, hours: 15, description: 'Core problem solving for technical interviews.' },
    { id: 'sk-4', category: 'SKILLS', title: 'Learn System Design Basics', readinessBonus: 4, alignmentBonus: 5, hours: 16, description: 'Architecting scalable ML inference pipelines.' },
    { id: 'ex-1', category: 'EXPERIENCE', title: 'Build Autonomous AI Project', readinessBonus: 5, alignmentBonus: 6, hours: 30, description: 'Proves end-to-end model training and deployment.' },
    { id: 'ex-2', category: 'EXPERIENCE', title: 'Publish IEEE Research Paper', readinessBonus: 6, alignmentBonus: 8, hours: 40, description: 'Top tier academic research milestone for AI engineering.' },
    { id: 'me-1', category: 'MENTORING', title: 'Meet Faculty Mentor (Prof. Kulkarni)', readinessBonus: 3, alignmentBonus: 4, hours: 1, description: 'Direct 1-on-1 roadmap review and research sign-off.' },
  ],
  'ML Engineer': [
    { id: 'ac-1', category: 'ACADEMIC', title: 'Improve CGPA to 9.0+', readinessBonus: 3, alignmentBonus: 2, hours: 20, description: 'Elevates academic standing.' },
    { id: 'sk-1', category: 'SKILLS', title: 'Strengthen System Design & MLOps', readinessBonus: 5, alignmentBonus: 7, hours: 18, description: 'Production model deployment and monitoring.' },
    { id: 'sk-2', category: 'SKILLS', title: 'Complete Docker & Kubernetes Lab', readinessBonus: 4, alignmentBonus: 5, hours: 15, description: 'Containerization for scalable ML microservices.' },
    { id: 'sk-3', category: 'SKILLS', title: 'Learn Model Quantization', readinessBonus: 4, alignmentBonus: 6, hours: 14, description: 'Edge device optimization and ONNX export.' },
    { id: 'ex-1', category: 'EXPERIENCE', title: 'Complete ML Engineering Internship', readinessBonus: 6, alignmentBonus: 8, hours: 40, description: 'Industry experience with CI/CD for machine learning.' },
    { id: 'me-1', category: 'MENTORING', title: 'Request MLOps Roadmap Review', readinessBonus: 3, alignmentBonus: 4, hours: 1, description: 'Mentor guidance on industry deployment standards.' },
  ],
  'Software Engineer': [
    { id: 'ac-1', category: 'ACADEMIC', title: 'Improve CGPA to 9.0+', readinessBonus: 3, alignmentBonus: 2, hours: 20, description: 'Top academic class standing.' },
    { id: 'sk-1', category: 'SKILLS', title: 'Complete DSA Practice Set (200 Problems)', readinessBonus: 6, alignmentBonus: 7, hours: 25, description: 'Essential graph and DP algorithms for FAANG interviews.' },
    { id: 'sk-2', category: 'SKILLS', title: 'Learn Distributed Systems Architecture', readinessBonus: 5, alignmentBonus: 6, hours: 20, description: 'Load balancing, caching, and database sharding.' },
    { id: 'sk-3', category: 'SKILLS', title: 'Master Fullstack TypeScript & React', readinessBonus: 4, alignmentBonus: 5, hours: 15, description: 'Modern web architecture and API design.' },
    { id: 'ex-1', category: 'EXPERIENCE', title: 'Build Microservices Open Source Project', readinessBonus: 5, alignmentBonus: 6, hours: 30, description: 'Demonstrates distributed software architecture.' },
    { id: 'me-1', category: 'MENTORING', title: 'Faculty Mock Technical Interview', readinessBonus: 3, alignmentBonus: 4, hours: 1, description: 'Faculty assessment of system design defense.' },
  ],
  'Data Scientist': [
    { id: 'ac-1', category: 'ACADEMIC', title: 'Improve CGPA to 9.0+', readinessBonus: 3, alignmentBonus: 2, hours: 20, description: 'Academic excellence.' },
    { id: 'sk-1', category: 'SKILLS', title: 'Complete SQL + Inferential Stats Module', readinessBonus: 5, alignmentBonus: 7, hours: 16, description: 'Advanced analytical queries and hypothesis testing.' },
    { id: 'sk-2', category: 'SKILLS', title: 'Master Pandas & Feature Engineering', readinessBonus: 4, alignmentBonus: 6, hours: 14, description: 'Data wrangling and exploratory analysis.' },
    { id: 'ex-1', category: 'EXPERIENCE', title: 'Publish Kaggle Analytics Notebook', readinessBonus: 5, alignmentBonus: 6, hours: 25, description: 'Demonstrates real-world data science capability.' },
    { id: 'me-1', category: 'MENTORING', title: 'Meet Faculty Mentor for Analytics Track', readinessBonus: 3, alignmentBonus: 4, hours: 1, description: '1-on-1 career path guidance.' },
  ]
};

interface Scenario {
  id: string;
  name: string;
  selectedActionIds: string[];
  projectedReadiness: number;
  weeklyHours: number;
}

interface FutureSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FutureSimulatorModal: React.FC<FutureSimulatorModalProps> = ({ isOpen, onClose }) => {
  const state = useStudentState();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [weeklyHours, setWeeklyHours] = useState<number>(5);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [savedScenarios, setSavedScenarios] = useState<Scenario[]>([]);

  const actionsList = ACTION_CATALOG[state.careerGoal] || ACTION_CATALOG['AI Research Engineer'];

  useEffect(() => {
    if (selectedIds.length > 0) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [selectedIds, weeklyHours]);

  if (!isOpen) return null;

  const toggleAction = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectedActions = actionsList.filter(a => selectedIds.includes(a.id));

  // Diminishing returns formula
  const rawBonus = selectedActions.reduce((sum, a) => sum + a.readinessBonus, 0);
  const count = selectedActions.length;
  const diminishedBonus = count === 0 ? 0 : Math.round(rawBonus * (1 - 0.07 * (count - 1)));

  const currentReadiness = 74;
  const currentAlignment = 68;
  const currentProgress = state.progress;

  const projectedReadiness = Math.min(98, currentReadiness + diminishedBonus);
  const projectedAlignment = Math.min(96, currentAlignment + Math.round(diminishedBonus * 1.1));
  const projectedProgress = Math.min(95, currentProgress + Math.round(diminishedBonus * 0.95));

  const totalHours = selectedActions.reduce((sum, a) => sum + a.hours, 0);
  const estimatedWeeks = totalHours === 0 ? 0 : Math.ceil(totalHours / weeklyHours);

  // Dynamic AI Explanation
  const generateExplanation = () => {
    if (selectedActions.length === 0) {
      return "Select one or more actions to simulate your projected academic and career trajectory.";
    }
    const titles = selectedActions.map(a => a.title).join(", ");
    return `Selected actions (${titles}) directly target your primary skill gaps for the ${state.careerGoal} pathway. The combined effort provides applied evidence and improves overall roadmap alignment.`;
  };

  const handleApplyToRoadmap = (customActions?: ActionItem[], customProgress?: number) => {
    const actionsToUse = customActions || selectedActions;
    const progressToUse = customProgress || projectedProgress;

    if (actionsToUse.length === 0) return;

    studentStore.applyFuturePlan({
      actionNames: actionsToUse.map(a => a.title),
      projectedProgress: progressToUse,
      primaryAction: actionsToUse[0].title
    });

    onClose();
  };

  const handleSaveScenario = () => {
    if (selectedActions.length === 0 || savedScenarios.length >= 3) return;
    const letter = String.fromCharCode(65 + savedScenarios.length); // A, B, C
    const newScenario: Scenario = {
      id: Date.now().toString(),
      name: `Scenario ${letter}: ${selectedActions[0].title.slice(0, 18)}...`,
      selectedActionIds: [...selectedIds],
      projectedReadiness,
      weeklyHours
    };
    setSavedScenarios(prev => [...prev, newScenario]);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl w-full bg-[#0C2238] rounded-3xl border border-[#C99632]/40 shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]"
        >
          {/* Top Window Header */}
          <div className="px-6 py-4 bg-[#07182A] border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#C99632]/20 border border-[#C99632]/40 flex items-center justify-center text-[#E8C56B]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold font-display text-white flex items-center space-x-2">
                  <span>What If?: Future Simulator</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#159A72] text-[9px] font-mono font-bold text-white uppercase">
                    Live Engine Active
                  </span>
                </h2>
                <p className="text-[11px] text-slate-300">Predict how your next academic decisions affect career readiness</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Modal Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Header: Current State Banner */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Target Goal</span>
                <span className="text-sm font-extrabold text-[#E8C56B] block truncate">{state.careerGoal}</span>
              </div>

              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Current Readiness</span>
                <span className="text-base font-extrabold text-white block">{currentReadiness}%</span>
              </div>

              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Skill Alignment</span>
                <span className="text-base font-extrabold text-white block">{currentAlignment}%</span>
              </div>

              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Roadmap Velocity</span>
                <span className="text-base font-extrabold text-emerald-400 block">{currentProgress}%</span>
              </div>
            </div>

            {/* Main 2-Column Grid: Action Selector vs Live Projection */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Action Selector List (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E8C56B] flex items-center space-x-1.5">
                    <Target className="w-4 h-4 text-[#E8C56B]" />
                    <span>Select Actions to Simulate</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Multi-select enabled</span>
                </div>

                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {actionsList.map((act) => {
                    const isSelected = selectedIds.includes(act.id);
                    return (
                      <div
                        key={act.id}
                        onClick={() => toggleAction(act.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#C99632]/15 border-[#C99632] shadow-md text-white'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                        }`}
                      >
                        <div className="flex items-start space-x-3 min-w-0 pr-2">
                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'bg-[#C99632] border-[#C99632] text-[#0C2238]' : 'border-white/30 bg-white/5'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="text-xs font-extrabold block">{act.title}</span>
                            <span className="text-[11px] text-slate-300 leading-snug block">{act.description}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-extrabold text-emerald-400 block">+{act.readinessBonus}%</span>
                          <span className="text-[10px] font-mono text-slate-400 block">~{act.hours}h</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Projected State & Timeline Calculator (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Live Simulation Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#123B63] to-[#07182A] border border-white/15 space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#E8C56B]">
                      PROJECTED OUTCOME
                    </span>
                    {isAnalyzing ? (
                      <span className="text-[10px] font-mono text-[#E8C56B] animate-pulse">
                        Analyzing...
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        Simulation Ready
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* Career Readiness Comparison */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-300">Career Readiness</span>
                        <span className="text-white font-extrabold">
                          {currentReadiness}% → <span className="text-emerald-400">{projectedReadiness}%</span>
                          {diminishedBonus > 0 && <span className="text-emerald-400 font-mono text-[11px] ml-1.5">+{diminishedBonus}%</span>}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          animate={{ width: `${projectedReadiness}%` }}
                          transition={{ duration: 0.6 }}
                          className="h-full bg-gradient-to-r from-[#0C2238] via-[#C99632] to-emerald-400 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Skill Alignment Comparison */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-300">Skill Alignment</span>
                        <span className="text-white font-extrabold">
                          {currentAlignment}% → <span className="text-[#E8C56B]">{projectedAlignment}%</span>
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          animate={{ width: `${projectedAlignment}%` }}
                          transition={{ duration: 0.6 }}
                          className="h-full bg-[#E8C56B] rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Why This Changes Box */}
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <span className="text-[10px] font-extrabold text-[#E8C56B] uppercase tracking-wider block">
                      Why This Changes
                    </span>
                    <p className="text-[11px] text-slate-200 leading-relaxed italic">
                      "{generateExplanation()}"
                    </p>
                  </div>
                </div>

                {/* Realistic Plan Time Calculator */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#E8C56B] flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Realistic Weekly Plan</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      Total Effort: {totalHours}h
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300 block font-medium">How much time can you invest per week?</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[3, 5, 10, 15].map((hrs) => (
                        <button
                          key={hrs}
                          onClick={() => setWeeklyHours(hrs)}
                          className={`py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer border ${
                            weeklyHours === hrs
                              ? 'bg-[#C99632] text-[#0C2238] border-[#C99632]'
                              : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                          }`}
                        >
                          {hrs}h/wk
                        </button>
                      ))}
                    </div>
                  </div>

                  {totalHours > 0 && (
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-300">Estimated Timeline:</span>
                      <span className="text-emerald-400 font-mono">~{estimatedWeeks} weeks ({weeklyHours}h/week)</span>
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Saved Scenarios Comparison Side-by-Side */}
            {savedScenarios.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#E8C56B]">
                    SAVED SCENARIO COMPARISON ({savedScenarios.length}/3)
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {savedScenarios.map((sc) => (
                    <div key={sc.id} className="p-4 rounded-2xl bg-white/5 border border-white/15 space-y-2 relative">
                      <span className="text-xs font-extrabold text-white block">{sc.name}</span>
                      <div className="text-xs text-slate-300">
                        Readiness: <strong className="text-emerald-400">{sc.projectedReadiness}%</strong> ({sc.weeklyHours}h/wk)
                      </div>
                      <button
                        onClick={() => {
                          const customActions = actionsList.filter(a => sc.selectedActionIds.includes(a.id));
                          handleApplyToRoadmap(customActions, sc.projectedReadiness);
                        }}
                        className="mt-2 w-full py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all cursor-pointer"
                      >
                        Choose this path
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer Controls */}
          <div className="px-6 py-4 bg-[#07182A] border-t border-white/10 flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedIds([])}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Reset Simulation
              </button>

              {selectedActions.length > 0 && savedScenarios.length < 3 && (
                <button
                  onClick={handleSaveScenario}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#E8C56B] text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>Save Scenario</span>
                </button>
              )}
            </div>

            <button
              onClick={() => handleApplyToRoadmap()}
              disabled={selectedActions.length === 0}
              className={`px-7 py-3 rounded-full font-extrabold text-xs transition-all shadow-xl flex items-center space-x-2 cursor-pointer ${
                selectedActions.length > 0
                  ? 'bg-[#C99632] hover:bg-[#b08226] text-[#0C2238] shadow-[#C99632]/20 hover:scale-[1.02]'
                  : 'bg-white/10 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>APPLY TO MY ROADMAP →</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
