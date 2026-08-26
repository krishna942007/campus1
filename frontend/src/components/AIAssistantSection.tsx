import React, { useState } from 'react';
import { Send, Bot, ShieldAlert, Sparkles, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { StatusBadge } from './ui/StatusBadge';

export const AIAssistantSection: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState(0);

  const sampleQueries = [
    {
      q: 'How can I prepare for AI Research Engineer placement roles?',
      response: 'Based on your verified student profile (CGPA 8.92, Python & Data Structures 93.3%), we recommend focusing on PyTorch neural network architectures, pgvector RAG optimization, and completing your capstone paper draft.',
      citation: 'VIT Placement & Skill Benchmark Model 2026',
    },
    {
      q: 'What is my current honors degree eligibility & credit count?',
      response: 'You have earned 118 credits with 0 active backlogs. Your CGPA (8.92) exceeds the 8.00 threshold required for AI & Machine Learning Honors Specialization registration.',
      citation: 'VIT Autonomous Academic Regulations Section 4.2 (Official ERP)',
    },
    {
      q: 'What did Prof. S. Kulkarni advise in our last 1-on-1 mentoring check-in?',
      response: 'Prof. S. Kulkarni advised prioritizing your capstone research paper draft and completing the MIT 6.006 Dynamic Programming modules for technical interview readiness.',
      citation: 'Mentorship Record #2026-08-12 (Prof. S. Kulkarni)',
    },
  ];

  return (
    <section id="ai-assistant" className="relative py-24 w-full bg-[#F7F4EE] border-t border-[#0C2238]/08 z-10 overflow-hidden">
      {/* Ambient Lighting Blobs behind Glass Surface */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#C99632]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#244F7D]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#EFE7D8] border border-[#C99632]/25">
            <Sparkles className="w-3.5 h-3.5 text-[#C99632]" />
            <span className="text-[11px] font-extrabold tracking-wider text-[#7A6437]">
              Context-Aware AI Advisory Engine
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#10253A] tracking-tight leading-[1.12] font-display">
            Your second brain.<br />
            <span className="text-[#C99632] font-serif-accent italic font-normal">
              Ask. Understand. Move forward.
            </span>
          </h2>

          <p className="text-base font-normal text-[#627083] leading-relaxed">
            Grounded intelligence assistant trained on VIT academic regulations, course syllabi, and your verified student record.
          </p>
        </div>

        {/* Interactive Q&A Sandbox Translucent Dark Blue Glass Card */}
        <div className="bg-[#0C2340]/90 sm:bg-black/75 backdrop-blur-xl rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-white/10 space-y-8 relative overflow-hidden">
          
          {/* Top Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#C99632]/20 border border-[#C99632]/40 text-[#E8C56B] flex items-center justify-center font-bold text-lg shadow-lg">
                <Bot className="w-6 h-6 text-[#E8C56B]" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight font-display">VITARA AI Assistant</h3>
                <span className="text-xs text-[#E8C56B] font-bold tracking-wide">STUDENT CONTEXT: KRISHNA SINGH (2023CSE001)</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <StatusBadge variant="OFFICIAL" label="ERP VERIFIED" />
              <StatusBadge variant="AI_ADVISORY" label="RAG ENGINE ACTIVE" />
            </div>
          </div>

          {/* Sample Topic Query Pills */}
          <div className="space-y-3">
            <p className="text-xs font-extrabold text-[#E8C56B] uppercase tracking-wider">Select Sample Student Query:</p>
            <div className="flex flex-wrap gap-3">
              {sampleQueries.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTopic(idx)}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    selectedTopic === idx
                      ? 'bg-[#C99632] text-white font-extrabold shadow-lg scale-[1.02] border border-[#E8C56B]/40'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/15 backdrop-blur-md'
                  }`}
                >
                  "{item.q}"
                </button>
              ))}
            </div>
          </div>

          {/* Answer Display Box in Glassmorphism */}
          <div className="p-7 sm:p-8 bg-white/5 backdrop-blur-md border border-white/15 space-y-4 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C99632]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-extrabold relative z-10">
              <span className="text-[#E8C56B] flex items-center space-x-1.5 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#E8C56B]" />
                <span>GROUNDED AI ADVISORY RESPONSE</span>
              </span>
              <span className="text-slate-300 font-medium">SOURCE: {sampleQueries[selectedTopic].citation}</span>
            </div>
            <p className="text-sm sm:text-base text-slate-100 font-normal leading-relaxed relative z-10">
              {sampleQueries[selectedTopic].response}
            </p>
          </div>

          {/* Institutional Trust Advisory Note */}
          <div className="pt-2 flex items-center space-x-2.5 text-xs font-semibold text-[#E8C56B]">
            <ShieldAlert className="w-4 h-4 text-[#E8C56B] shrink-0" />
            <span>AUTHORITATIVE ERP RECORDS ≠ AI GUIDANCE: AI outputs are advisory and do not override official VIT Academic ERP records or faculty approvals.</span>
          </div>

        </div>
      </div>
    </section>
  );
};

