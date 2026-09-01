import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, FileCheck, AlertTriangle, Calendar, CheckCircle2, Sparkles, 
  User, ArrowRight, ShieldAlert, Check, PlusCircle, Activity, ChevronRight, X
} from 'lucide-react';
import { StatusBadge } from './ui/StatusBadge';
import { useStudentState } from '../services/studentStateStore';

export interface MenteeStudent {
  id: string;
  name: string;
  prn: string;
  cgpa: number;
  cgpaTrend: 'up' | 'down' | 'stable';
  attendance: number;
  attendanceTrend: 'up' | 'down' | 'stable';
  taskCompletion: number;
  category: 'IMMEDIATE_ATTENTION' | 'MONITOR' | 'ON_TRACK' | 'HIGH_POTENTIAL';
  pattern: string;
  recommendedIntervention: string;
  interventionCreated: boolean;
}

export const MentoringSection: React.FC = () => {
  const state = useStudentState();
  const [selectedStudent, setSelectedStudent] = useState<MenteeStudent | null>(null);
  const [mentees, setMentees] = useState<MenteeStudent[]>([
    {
      id: 'm-1',
      name: 'Rohan Mehta',
      prn: '2023CSE088',
      cgpa: 7.10,
      cgpaTrend: 'down',
      attendance: 72.0,
      attendanceTrend: 'down',
      taskCompletion: 31,
      category: 'IMMEDIATE_ATTENTION',
      pattern: 'Academic disengagement pattern (Attendance <75%, CGPA decline)',
      recommendedIntervention: 'Schedule a 15-minute 1-on-1 mentor check-in to review subject attendance.',
      interventionCreated: false
    },
    {
      id: 'm-2',
      name: 'Krishna Singh',
      prn: '2023CSE001',
      cgpa: state.cgpa,
      cgpaTrend: 'up',
      attendance: state.attendance,
      attendanceTrend: 'stable',
      taskCompletion: 88,
      category: 'HIGH_POTENTIAL',
      pattern: 'Potential IEEE AI research paper candidate (Top 4% CGPA rank)',
      recommendedIntervention: 'Initiate Faculty Research Group invitation for Capstone IEEE manuscript.',
      interventionCreated: false
    },
    {
      id: 'm-3',
      name: 'Ananya Sharma',
      prn: '2023CSE042',
      cgpa: 8.45,
      cgpaTrend: 'up',
      attendance: 91.2,
      attendanceTrend: 'up',
      taskCompletion: 82,
      category: 'ON_TRACK',
      pattern: 'Consistent academic & lab performance',
      recommendedIntervention: 'Approve Semester V Honors Elective Registration.',
      interventionCreated: false
    },
    {
      id: 'm-4',
      name: 'Vikram Joshi',
      prn: '2023CSE112',
      cgpa: 7.42,
      cgpaTrend: 'down',
      attendance: 76.5,
      attendanceTrend: 'down',
      taskCompletion: 45,
      category: 'MONITOR',
      pattern: 'Borderline CGPA threshold for honors track',
      recommendedIntervention: 'Issue academic advisory notice for mid-sem prep.',
      interventionCreated: false
    }
  ]);

  const counts = {
    total: 20,
    immediate: 3,
    monitor: 5,
    onTrack: 10,
    highPotential: 2
  };

  const handleCreateIntervention = (studentId: string) => {
    setMentees(prev => prev.map(m => 
      m.id === studentId ? { ...m, interventionCreated: true } : m
    ));
    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent(prev => prev ? { ...prev, interventionCreated: true } : null);
    }
    window.dispatchEvent(
      new CustomEvent('campus-toast', {
        detail: {
          title: 'Intervention Created',
          message: 'Intervention created and added to faculty activity log.',
          type: 'success'
        }
      })
    );
  };

  return (
    <section id="mentoring" className="relative py-24 w-full bg-[#F7F4EE] border-t border-[#0C2238]/08 z-10 overflow-hidden">
      {/* Ambient Lighting Blobs behind Glass Surface */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#C99632]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#244F7D]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-10">
        
        {/* Section Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl space-y-4"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#EFE7D8] border border-[#C99632]/25">
            <Users className="w-3.5 h-3.5 text-[#C99632]" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7A6437]">
              INTELLIGENT FACULTY INTERVENTION DASHBOARD
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#10253A] tracking-tight leading-[1.12] font-display">
            FACULTY GUIDANCE, <br />
            <span className="text-[#C99632] font-serif-accent italic font-normal">
              WITH ACTIVE PATTERN RADAR.
            </span>
          </h2>

          <p className="text-base font-normal text-[#627083] leading-relaxed">
            Assist faculty mentors with early attention indicators, disengagement pattern detection, and high-potential research candidate identification.
          </p>
        </motion.div>

        {/* 2. ATTENTION RADAR HEADER (20 Mentees Total) */}
        <div className="p-6 rounded-3xl bg-[#0C2238] text-white border border-[#C99632]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C99632]/20 border border-[#C99632]/40 text-[#E8C56B] flex items-center justify-center font-bold text-xl">
              20
            </div>
            <div>
              <h3 className="text-base font-extrabold font-display text-white">ASSIGNED MENTEE RADAR</h3>
              <p className="text-xs text-slate-300">Prof. S. Kulkarni • Computer Engineering Dept</p>
            </div>
          </div>

          {/* Attention Radar Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="px-4 py-2 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 font-extrabold flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
              <span>{counts.immediate} Immediate Attention</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span>{counts.monitor} Monitor</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <span>{counts.onTrack} On Track</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-sky-500/20 border border-sky-500/40 text-sky-300 font-extrabold flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
              <span>{counts.highPotential} High Potential</span>
            </div>
          </div>
        </div>

        {/* Dual View: Student Permitted View vs Faculty Controlled Intervention Roster */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Student View Summary (5 cols) */}
          <div className="lg:col-span-5 p-7 sm:p-8 bg-[#FFFFFF]/10 backdrop-blur-[5px] border border-[#0C2238]/08 shadow-xl space-y-5 rounded-3xl">
            <div className="flex items-center justify-between border-b border-[#0C2238]/08 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-[#C99632] tracking-wider block uppercase">
                  STUDENT PERMITTED VIEW
                </span>
                <h3 className="text-xl font-extrabold font-display text-[#10253A]">My Mentorship Record</h3>
              </div>
              <StatusBadge variant="ON_TRACK" label="ACTIVE RELATIONSHIP" />
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#FFFCF7]/90 backdrop-blur-md border border-[#0C2238]/08 rounded-2xl space-y-1">
                <span className="text-[10px] font-extrabold text-[#C99632] block uppercase">ASSIGNED MENTOR</span>
                <div className="text-base font-extrabold text-[#10253A] font-display">Prof. S. Kulkarni</div>
                <div className="text-xs text-[#627083]">Associate Professor, AI & DS Dept</div>
              </div>

              <div className="p-4 bg-[#FFFCF7]/90 backdrop-blur-md border border-[#0C2238]/08 rounded-2xl space-y-2">
                <span className="text-[10px] font-extrabold text-[#C99632] block uppercase">LAST MENTOR MEETING LOG</span>
                <p className="text-[#10253A] font-normal leading-relaxed text-xs">
                  "Discussed capstone research project. Advised student to focus on PyTorch neural network benchmarking and prepare manuscript draft for IEEE conference."
                </p>
              </div>
            </div>
          </div>

          {/* Right: Faculty Mentee Risk Roster (7 cols) */}
          <div className="lg:col-span-7 p-7 sm:p-8 bg-[#0C2340]/95 text-white border border-white/10 shadow-2xl space-y-6 rounded-3xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-[#E8C56B] tracking-wider block uppercase">
                  FACULTY MENTOR INTERVENTION ROSTER
                </span>
                <h3 className="text-xl font-extrabold font-display text-white">Select Student for Risk Analysis</h3>
              </div>
              <span className="text-xs text-slate-300 font-mono">Real-time Pattern Detection</span>
            </div>

            {/* Student Roster Cards */}
            <div className="space-y-3">
              {mentees.map((st) => (
                <div
                  key={st.id}
                  onClick={() => setSelectedStudent(st)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedStudent?.id === st.id
                      ? 'bg-white/15 border-[#C99632] shadow-lg scale-[1.01]'
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-white font-display flex items-center space-x-2">
                        <span>{st.name} ({st.prn})</span>
                      </h4>
                      <span className="text-xs text-slate-300 font-bold">
                        CGPA {st.cgpa} ({st.cgpaTrend === 'up' ? '↑' : '↓'}) • {st.attendance}% Attendance ({st.attendanceTrend === 'up' ? '↑' : '↓'})
                      </span>
                    </div>

                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${
                      st.category === 'IMMEDIATE_ATTENTION'
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : st.category === 'HIGH_POTENTIAL'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : st.category === 'MONITOR'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {st.category === 'IMMEDIATE_ATTENTION' ? '🔴 IMMEDIATE ATTENTION' : st.category === 'HIGH_POTENTIAL' ? '🔵 HIGH POTENTIAL' : st.category === 'MONITOR' ? '🟡 MONITOR' : '🟢 ON TRACK'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Student Risk & Intervention Inspector */}
            {selectedStudent && (
              <div className="p-5 rounded-2xl bg-white/10 border border-[#C99632]/50 space-y-4 relative">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-[#E8C56B] uppercase tracking-wider block">
                    AI ATTENTION INDICATOR & RISK PATTERN
                  </span>
                  <h4 className="text-base font-extrabold text-white font-display">{selectedStudent.name}</h4>
                  <p className="text-xs text-slate-200 font-semibold">{selectedStudent.pattern}</p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">RECOMMENDED INTERVENTION</span>
                  <p className="text-xs text-[#E8C56B] font-bold">{selectedStudent.recommendedIntervention}</p>
                </div>

                <button
                  onClick={() => handleCreateIntervention(selectedStudent.id)}
                  disabled={selectedStudent.interventionCreated}
                  className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    selectedStudent.interventionCreated
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 cursor-not-allowed'
                      : 'bg-[#C99632] hover:bg-[#b08226] text-[#0C2238] shadow-md'
                  }`}
                >
                  {selectedStudent.interventionCreated ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>✓ INTERVENTION CREATED</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 text-[#0C2238]" />
                      <span>Create Intervention</span>
                    </>
                  )}
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
