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
      name: 'Aarav Sharma',
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
              Intelligent Faculty Intervention Dashboard
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#10253A] tracking-tight leading-[1.12] font-display">
            Faculty Guidance, <br />
            <span className="text-[#C99632] font-serif-accent italic font-normal">
              with Active Pattern Radar.
            </span>
          </h2>

          <p className="text-base font-normal text-[#627083] leading-relaxed">
            Assist faculty mentors with early attention indicators, disengagement pattern detection, and high-potential research candidate identification.
          </p>
        </motion.div>

        {/* 2. ATTENTION RADAR HEADER (20 Mentees Total) */}
        <div className="p-6 rounded-3xl bg-[#FAF7F0]/95 sm:bg-[#F7F4EE]/90 backdrop-blur-xl text-[#10253A] border border-[#0C2238]/12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0C2238]/08 border border-[#0C2238]/12 text-[#C99632] flex items-center justify-center font-bold text-xl">
              20
            </div>
            <div>
              <h3 className="text-base font-extrabold font-display text-[#10253A]">Assigned Mentee Radar</h3>
              <p className="text-xs text-[#627083]">Prof. S. Kulkarni • Computer Engineering Dept</p>
            </div>
          </div>

          {/* Attention Radar Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="px-4 py-2 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-extrabold flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
              <span>{counts.immediate} Immediate Attention</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-extrabold flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span>{counts.monitor} Monitor</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>{counts.onTrack} On Track</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 font-extrabold flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
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
          <div className="lg:col-span-7 p-7 sm:p-8 bg-[#FAF7F0]/95 sm:bg-[#F7F4EE]/90 backdrop-blur-xl text-[#10253A] border border-[#0C2238]/12 shadow-2xl space-y-6 rounded-3xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#0C2238]/10 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-[#C99632] tracking-wider block uppercase">
                  FACULTY MENTOR INTERVENTION ROSTER
                </span>
                <h3 className="text-xl font-extrabold font-display text-[#10253A]">Select Student for Risk Analysis</h3>
              </div>
              <span className="text-xs text-[#627083] font-mono">Real-time Pattern Detection</span>
            </div>

            {/* Student Roster Cards */}
            <div className="space-y-3">
              {mentees.map((st) => (
                <div
                  key={st.id}
                  onClick={() => setSelectedStudent(st)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedStudent?.id === st.id
                      ? 'bg-[#FFFCF7] border-[#C99632] shadow-md scale-[1.01]'
                      : 'bg-[#FFFCF7]/80 hover:bg-[#FFFCF7] border-[#0C2238]/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-[#10253A] font-display flex items-center space-x-2">
                        <span>{st.name} ({st.prn})</span>
                      </h4>
                      <span className="text-xs text-[#627083] font-bold">
                        CGPA {st.cgpa} ({st.cgpaTrend === 'up' ? '↑' : '↓'}) • {st.attendance}% Attendance ({st.attendanceTrend === 'up' ? '↑' : '↓'})
                      </span>
                    </div>

                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${
                      st.category === 'IMMEDIATE_ATTENTION'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : st.category === 'HIGH_POTENTIAL'
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : st.category === 'MONITOR'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {st.category === 'IMMEDIATE_ATTENTION' ? '🔴 IMMEDIATE ATTENTION' : st.category === 'HIGH_POTENTIAL' ? '🔵 HIGH POTENTIAL' : st.category === 'MONITOR' ? '🟡 MONITOR' : '🟢 ON TRACK'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Student Risk & Intervention Inspector */}
            {selectedStudent && (
              <div className="p-5 rounded-2xl bg-[#FFFCF7] border border-[#C99632]/40 space-y-4 relative shadow-md">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-3 right-3 p-1 rounded-lg hover:bg-[#0C2238]/08 text-[#627083] hover:text-[#10253A]"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-[#C99632] uppercase tracking-wider block">
                    AI ATTENTION INDICATOR & RISK PATTERN
                  </span>
                  <h4 className="text-base font-extrabold text-[#10253A] font-display">{selectedStudent.name}</h4>
                  <p className="text-xs text-[#627083] font-semibold">{selectedStudent.pattern}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#0C2238]/08 space-y-2">
                  <span className="text-[10px] font-extrabold text-[#627083] uppercase block">RECOMMENDED INTERVENTION</span>
                  <p className="text-xs text-[#C99632] font-bold">{selectedStudent.recommendedIntervention}</p>
                </div>

                <button
                  onClick={() => handleCreateIntervention(selectedStudent.id)}
                  disabled={selectedStudent.interventionCreated}
                  className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    selectedStudent.interventionCreated
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 cursor-not-allowed'
                      : 'bg-[#0C2238] hover:bg-[#123B63] text-white shadow-md'
                  }`}
                >
                  {selectedStudent.interventionCreated ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>✓ INTERVENTION CREATED</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 text-[#E8C56B]" />
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
