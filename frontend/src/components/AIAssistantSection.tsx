import React, { useState } from 'react';
import { 
  Send, Bot, ShieldAlert, Sparkles, FileText, CheckCircle2, ShieldCheck, 
  ArrowRight, Check, Target, BarChart2, Layers, Zap, Clock, HelpCircle
} from 'lucide-react';
import { StatusBadge } from './ui/StatusBadge';
import { useStudentState, studentStore } from '../services/studentStateStore';

export const AIAssistantSection: React.FC = () => {
  const state = useStudentState();
  const [selectedIntent, setSelectedIntent] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>('');
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);

  const intentQueries = [
    {
      id: 'intent-1',
      title: 'WHAT SHOULD I DO NEXT?',
      q: 'What is the single highest-impact action I should take right now?',
      response: `Based on your current profile (CGPA ${state.cgpa}, ${state.careerGoal} track), your highest impact next step is: "${state.todayPriority.title}". Completing this module will address your largest skill gap and boost readiness by +4%.`,
      recommendationAction: state.todayPriority.title,
      source: 'Student Profile + Roadmap',
      type: 'AI Advisory',
      confidence: 'High',
      why: [
        `Target Goal: ${state.careerGoal}`,
        `Current Readiness: ${state.progress}%`,
        `Skill Gap: PyTorch 32% vs 80% Requirement`,
        `Pending Tasks: ${state.tasks.pending} remaining`
      ]
    },
    {
      id: 'intent-2',
      title: 'SHOULD I LEARN PYTORCH OR TENSORFLOW?',
      q: 'Should I focus on learning PyTorch or TensorFlow for my career goal?',
      response: `Based on your current roadmap and ${state.careerGoal} target, PyTorch is the stronger next step. PyTorch has an 80% benchmark requirement for research engineering and directly addresses your current 32% proficiency gap.`,
      comparisons: [
        { name: 'PyTorch', current: '32%', target: '80%', impact: 'HIGH IMPACT' },
        { name: 'TensorFlow', current: '20%', target: '70%', impact: 'MEDIUM IMPACT' }
      ],
      recommendationAction: 'PyTorch Neural Networks',
      source: 'Student Profile + Career Benchmark',
      type: 'AI Advisory',
      confidence: 'High',
      why: [
        `Selected Goal: ${state.careerGoal}`,
        `PyTorch Gap: 48% (High Priority)`,
        `TensorFlow Gap: 50% (Medium Priority)`,
        `VIT Industry Partner Alignment 2026`
      ]
    },
    {
      id: 'intent-3',
      title: 'CHECK MY SKILL GAPS',
      q: 'Analyze my verified skills against placement requirements.',
      response: `Skill Analysis Complete: You have 2 Critical Gaps (PyTorch 32%, CUDA 20%), 1 Improvement Area (System Design 70%), and 2 Mastered Competencies (Python 95%, DSA 88%). Stop spending study hours on Python and reallocate ~8 hours to PyTorch.`,
      recommendationAction: 'PyTorch Neural Networks',
      source: 'Verified Skill Matrix + ERP',
      type: 'AI Skill Analysis',
      confidence: 'High',
      why: [
        `Python 95% (Exceeds 85% Benchmark)`,
        `DSA 88% (Maintained)`,
        `PyTorch 32% (Critical Gap)`,
        `System Design 70% (Improvement Needed)`
      ]
    },
    {
      id: 'intent-4',
      title: 'ANALYZE MY ROADMAP',
      q: 'Is my current roadmap sequence optimal for placement readiness?',
      response: `Roadmap Analysis: Your velocity is ${state.progress}%. AI recommends optimizing sequence order to "PyTorch → Mentor Review → Capstone Project". Mentor feedback early will improve capstone research direction.`,
      recommendationAction: 'Optimize Roadmap Sequence',
      source: 'Student Roadmap + Mentorship Model',
      type: 'AI Sequence Optimization',
      confidence: 'High',
      why: [
        `Current Velocity: ${state.progress}%`,
        `Mentor Review Logged by Prof. S. Kulkarni`,
        `Capstone Phase 2 Active`,
        `Sequence Optimization Recommended`
      ]
    },
    {
      id: 'intent-5',
      title: 'CHECK MY ACADEMIC RISK',
      q: 'Do I have any academic, CGPA, or attendance compliance risks?',
      response: `Academic Risk Assessment: CLEAR. Your CGPA is ${state.cgpa} (Rank #4 in CE Dept) and attendance across all subjects is ${state.attendance}%, well above the 75% statutory requirement under VIT Autonomous Ordinance 4.2.`,
      source: 'Official VIT ERP Database',
      type: 'ERP Compliance Log',
      confidence: 'Official Verified',
      why: [
        `CGPA: ${state.cgpa} / 10.0 (No Backlogs)`,
        `Attendance: ${state.attendance}% (Cutoff 75%)`,
        `Autonomous Ordinance 4.2 Compliant`
      ]
    }
  ];

  const currentQuery = intentQueries[selectedIntent];

  const handleExecuteAction = (actionName?: string) => {
    const act = actionName || currentQuery.recommendationAction || 'PyTorch Neural Networks';
    if (act === 'Optimize Roadmap Sequence') {
      studentStore.applySequenceOptimization();
    } else {
      studentStore.applyFuturePlan({
        actionNames: [act],
        projectedProgress: Math.min(100, state.progress + 4),
        primaryAction: `Master ${act}`
      });
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const q = customInput.toLowerCase();
    if (q.includes('pytorch') || q.includes('tensorflow')) {
      setSelectedIntent(1);
    } else if (q.includes('gap') || q.includes('skill')) {
      setSelectedIntent(2);
    } else if (q.includes('roadmap') || q.includes('next')) {
      setSelectedIntent(0);
    } else if (q.includes('risk') || q.includes('attendance') || q.includes('cgpa')) {
      setSelectedIntent(4);
    } else {
      setCustomAnswer(`Based on your current profile (CGPA ${state.cgpa}, ${state.careerGoal} target), we recommend focusing on "${state.todayPriority.title}" to increase readiness.`);
    }
    setCustomInput('');
  };

  return (
    <section id="ai-assistant" className="relative py-24 w-full bg-[#F7F4EE] border-t border-[#0C2238]/08 z-10 overflow-hidden">
      {/* Ambient Lighting Blobs behind Glass Surface */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#C99632]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#244F7D]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#EFE7D8] border border-[#C99632]/25">
            <Sparkles className="w-3.5 h-3.5 text-[#C99632]" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7A6437]">
              Contextual Student Decision Assistant
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#10253A] tracking-tight leading-[1.12] font-display">
            Your second brain.<br />
            <span className="text-[#C99632] font-serif-accent italic font-normal">
              Ask. Understand. Move forward.
            </span>
          </h2>

          <p className="text-base font-normal text-[#627083] leading-relaxed">
            Connected directly to your live CGPA, attendance, skill gaps, career goal, and roadmap state.
          </p>
        </div>

        {/* Interactive Q&A Sandbox Translucent Dark Blue Glass Card */}
        <div className="bg-[#0C2340]/90 sm:bg-black/75 backdrop-blur-xl rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-white/10 space-y-7 relative overflow-hidden">
          
          {/* Top Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#C99632]/20 border border-[#C99632]/40 text-[#E8C56B] flex items-center justify-center font-bold text-lg shadow-lg">
                <Bot className="w-6 h-6 text-[#E8C56B]" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight font-display">Campus 1 Decision Assistant</h3>
                <span className="text-xs text-[#E8C56B] font-bold tracking-wide">
                  LIVE CONTEXT: KRISHNA SINGH • {state.careerGoal} • CGPA {state.cgpa}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <StatusBadge variant="OFFICIAL" label="ERP CONNECTED" />
              <StatusBadge variant="AI_ADVISORY" label="CONTEXT AWARE" />
            </div>
          </div>

          {/* Quick Intent Pills / Buttons */}
          <div className="space-y-2.5">
            <p className="text-[10px] font-extrabold text-[#E8C56B] uppercase tracking-wider">Select Decision Intent:</p>
            <div className="flex flex-wrap gap-2.5">
              {intentQueries.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => { setSelectedIntent(idx); setCustomAnswer(null); }}
                  className={`px-3.5 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer border ${
                    selectedIntent === idx && !customAnswer
                      ? 'bg-[#C99632] text-[#0C2238] border-[#E8C56B] shadow-md scale-[1.02]'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20 border-white/15'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* Response Box with Source/Confidence & Data Signal Breakdown */}
          <div className="p-6 sm:p-8 bg-white/5 backdrop-blur-md border border-white/15 space-y-5 rounded-2xl shadow-xl relative overflow-hidden">
            
            {/* Header badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-extrabold border-b border-white/10 pb-3">
              <span className="text-[#E8C56B] flex items-center space-x-1.5 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#E8C56B]" />
                <span>CONTEXTUAL DECISION RESPONSE</span>
              </span>

              <div className="flex items-center space-x-3 text-[11px] font-mono">
                <span className="text-slate-300">SOURCE: <strong className="text-white">{currentQuery.source}</strong></span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {currentQuery.confidence}
                </span>
              </div>
            </div>

            {/* Question Title */}
            <h4 className="text-base sm:text-lg font-extrabold text-white font-display">
              "{currentQuery.q}"
            </h4>

            {/* Main Response Text */}
            <p className="text-sm sm:text-base text-slate-100 font-normal leading-relaxed">
              {customAnswer || currentQuery.response}
            </p>

            {/* Decision Comparison Table if available */}
            {currentQuery.comparisons && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-[#E8C56B] tracking-wider block">DECISION MATRIX COMPARISON</span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {currentQuery.comparisons.map((c, i) => (
                    <div key={i} className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-1">
                      <div className="flex justify-between font-extrabold">
                        <span className="text-white">{c.name}</span>
                        <span className="text-[#E8C56B]">{c.impact}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">Current: {c.current} | Target: {c.target}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* "WHY THIS RECOMMENDATION?" DATA SIGNALS BREAKDOWN */}
            {currentQuery.why && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E8C56B] block">
                  WHY THIS RECOMMENDATION? (UNDERLYING DATA SIGNALS)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {currentQuery.why.map((signal, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{signal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actionable Button inside Response */}
            {currentQuery.recommendationAction && (
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleExecuteAction(currentQuery.recommendationAction)}
                  className="px-6 py-2.5 rounded-xl bg-[#C99632] hover:bg-[#b08226] text-[#0C2238] font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center space-x-2"
                >
                  <Zap className="w-3.5 h-3.5 fill-[#0C2238]" />
                  <span>Add "{currentQuery.recommendationAction}" to Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>

          {/* Chat Custom Question Form */}
          <form onSubmit={handleCustomSubmit} className="flex items-center space-x-3 pt-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Ask anything about PyTorch, roadmap, skills, CGPA..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C99632]"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-[#C99632] hover:bg-[#b08226] text-[#0C2238] font-extrabold text-xs transition-all cursor-pointer shrink-0 shadow-md flex items-center space-x-1.5"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Institutional Trust Advisory Note */}
          <div className="pt-2 flex items-center space-x-2.5 text-xs font-semibold text-[#E8C56B]">
            <ShieldAlert className="w-4 h-4 text-[#E8C56B] shrink-0" />
            <span>AUTHORITATIVE ERP RECORDS ≠ AI GUIDANCE: AI outputs are advisory decision recommendations reading your live student state.</span>
          </div>

        </div>
      </div>
    </section>
  );
};
