import React, { useState } from 'react';
import { 
  CheckCircle2, ArrowRight, LayoutDashboard, Bot, Compass, UserCheck, 
  BookOpen, Briefcase, HeartHandshake, FolderOpen, Calendar, Settings,
  Bell, Sparkles, ChevronRight, Check, Award, TrendingUp, AlertTriangle,
  Cpu, ShieldCheck, Clock, ExternalLink, Zap, Target, FileText, BarChart3,
  Layers, User, CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PlatformPreviewSection: React.FC = () => {
  const [activeRoleView, setActiveRoleView] = useState<'STUDENT' | 'MENTOR' | 'ADMIN'>('STUDENT');
  const [rotatePos, setRotatePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotatePos({
      x: -y / 160,
      y: x / 160
    });
  };

  const handleMouseLeave = () => {
    setRotatePos({ x: 0, y: 0 });
  };

  return (
    <section id="preview" className="py-24 bg-[#FAF7F0] border-t border-[#0C2238]/08 relative overflow-hidden">
      {/* Soft Ambient Background Lighting */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#C99632]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#0C2238]/08 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side Value Proposition */}
        <div className="lg:col-span-5 space-y-7">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#EFE7D8] border border-[#C99632]/30 text-[#0C2238]">
            <Sparkles className="w-3.5 h-3.5 text-[#C99632]" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#0C2238]">
              Autonomous University Workspace
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#10253A] tracking-tight leading-[1.12] font-display">
            Designed for Campus.<br />
            <span className="text-[#C99632] font-serif-accent font-normal italic">
              Engineered for Excellence.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#10253A]/75 leading-relaxed font-normal">
            Experience our bespoke champagne &amp; deep indigo institutional dashboard. A unified operational suite connecting students, research faculty, and university administrators.
          </p>

          {/* Interactive Role Selector Buttons */}
          <div className="space-y-3 pt-1">
            <span className="text-xs font-extrabold text-[#0C2238] uppercase tracking-wider block">
              Switch Dashboard Role View:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveRoleView('STUDENT')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center space-x-2 cursor-pointer ${
                  activeRoleView === 'STUDENT'
                    ? 'bg-[#0C2238] text-white shadow-md shadow-[#0C2238]/20 scale-[1.02]'
                    : 'bg-[#FFFCF7] text-[#10253A] border border-[#0C2238]/12 hover:bg-[#EFE7D8]'
                }`}
              >
                <span>🎓 Student Dashboard</span>
              </button>

              <button
                onClick={() => setActiveRoleView('MENTOR')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center space-x-2 cursor-pointer ${
                  activeRoleView === 'MENTOR'
                    ? 'bg-[#0C2238] text-white shadow-md shadow-[#0C2238]/20 scale-[1.02]'
                    : 'bg-[#FFFCF7] text-[#10253A] border border-[#0C2238]/12 hover:bg-[#EFE7D8]'
                }`}
              >
                <span>👨‍🏫 Faculty Mentor</span>
              </button>

              <button
                onClick={() => setActiveRoleView('ADMIN')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center space-x-2 cursor-pointer ${
                  activeRoleView === 'ADMIN'
                    ? 'bg-[#0C2238] text-white shadow-md shadow-[#0C2238]/20 scale-[1.02]'
                    : 'bg-[#FFFCF7] text-[#10253A] border border-[#0C2238]/12 hover:bg-[#EFE7D8]'
                }`}
              >
                <span>🛡️ Admin Suite</span>
              </button>
            </div>
          </div>

          {/* Benefits Bullet List */}
          <div className="space-y-3.5 pt-2">
            {[
              'Real-time statutory 75% attendance radar & safety margins',
              'AI Compatibility Mentor Matching (4-factor weighted score)',
              '100% real open course recommendations from Stanford & MIT',
              'Millisecond RAG vector search over Autonomous Ordinance 2026'
            ].map((text, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-[#0C2238] flex items-center justify-center shrink-0 shadow-xs">
                  <Check className="w-3.5 h-3.5 text-[#E8C56B] stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#10253A] leading-snug">{text}</span>
              </div>
            ))}
          </div>

          {/* Discover More CTA Button */}
          <div className="pt-2">
            <a
              href="#dashboard"
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-[#0C2238] hover:bg-[#10253A] text-white font-bold text-xs shadow-lg shadow-[#0C2238]/15 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <span>Explore Live Interactive Dashboard</span>
              <ArrowRight className="w-4 h-4 text-[#C99632]" />
            </a>
          </div>
        </div>

        {/* Right Side: Asymmetric Layered Champagne & Deep Indigo Dashboard Window */}
        <div className="lg:col-span-7 perspective-1000 relative">
          <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `rotateX(${rotatePos.x}deg) rotateY(${rotatePos.y}deg)`,
              transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="p-2 sm:p-3 bg-[#F3EBDD] border border-[#0C2238]/15 rounded-3xl shadow-2xl relative overflow-hidden"
          >
            {/* Top Institutional Window Header Bar */}
            <div className="bg-[#0C2238] text-white px-5 py-3.5 rounded-2xl flex items-center justify-between border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-bold text-[10px] text-[#C99632] tracking-wider font-display">
                  VIT
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-none font-display">VIT Mumbai</h4>
                  <p className="text-[10px] text-white/60 font-mono mt-0.5">Autonomous Academic Ecosystem</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>ERP Sync Active</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#C99632]" />
              </div>
            </div>

            {/* Dynamic Asymmetric Dashboard Content Canvas */}
            <div className="p-4 sm:p-5 bg-[#FAF7F0] rounded-2xl mt-2 border border-[#0C2238]/08 min-h-[460px] space-y-4">
              
              <AnimatePresence mode="wait">
                {activeRoleView === 'STUDENT' && (
                  <motion.div
                    key="student-preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Top Asymmetric Greeting & Quick Stats Banner */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      
                      {/* Left Anchor Surface: Deep Indigo Profile Card */}
                      <div className="md:col-span-5 bg-[#0C2238] text-white p-4 rounded-2xl border border-white/10 shadow-lg space-y-3 relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C99632]/20 rounded-full blur-2xl pointer-events-none" />
                        
                        <div>
                          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                            <span className="text-[10px] font-bold text-[#C99632] uppercase tracking-wider font-mono">
                              Student Dossier
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-white/10 text-[9px] font-bold text-white/90">
                              Sem IV
                            </span>
                          </div>

                          <div className="mt-3 flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-[#C99632]/20 border border-[#C99632]/40 flex items-center justify-center font-bold text-sm text-[#C99632] shrink-0 font-display">
                              AS
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-white truncate font-display">Aarav Sharma</h4>
                              <p className="text-[11px] text-white/70 truncate">Roll No: 2023CSE001</p>
                              <p className="text-[10px] text-[#C99632] truncate font-medium">B.Tech Computer Engg &amp; AI</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-center">
                          <div className="bg-white/05 p-2 rounded-xl border border-white/08">
                            <span className="text-[9px] text-white/60 uppercase block font-semibold">CGPA</span>
                            <span className="text-base font-extrabold text-[#E8C56B]">8.92</span>
                          </div>
                          <div className="bg-white/05 p-2 rounded-xl border border-white/08">
                            <span className="text-[9px] text-white/60 uppercase block font-semibold">Dept Rank</span>
                            <span className="text-base font-extrabold text-white">#04</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Asymmetric Surface: Attendance Radar & Safety Margin */}
                      <div className="md:col-span-7 bg-[#FFFCF7] p-4 rounded-2xl border border-[#0C2238]/12 shadow-sm space-y-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <ShieldCheck className="w-4 h-4 text-[#159A72]" />
                            <h4 className="text-xs font-extrabold text-[#0C2238] uppercase tracking-wider font-display">
                              Statutory Attendance Radar
                            </h4>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#159A72] border border-emerald-200 text-[10px] font-extrabold">
                            75% Compliant
                          </span>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="relative w-16 h-16 rounded-full bg-[#EFE7D8] flex items-center justify-center shrink-0 border-2 border-[#159A72]">
                            <span className="text-base font-black text-[#0C2238]">91.4%</span>
                          </div>

                          <div className="space-y-1 text-xs">
                            <p className="font-bold text-[#10253A]">Overall Attendance across 6 Core Subjects</p>
                            <p className="text-[11px] text-[#627083]">
                              Safety Cushion: <strong className="text-[#159A72]">+8 consecutive classes</strong> available before hitting the 75% threshold.
                            </p>
                          </div>
                        </div>

                        <div className="w-full h-2 bg-[#EFE7D8] rounded-full overflow-hidden">
                          <div className="h-full bg-[#159A72] rounded-full w-[91.4%]" />
                        </div>
                      </div>

                    </div>

                    {/* Asymmetric Overlapping Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      
                      {/* Left: AI Mentor Matching Card */}
                      <div className="md:col-span-6 bg-[#FFFCF7] p-4 rounded-2xl border border-[#0C2238]/12 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-[#C99632] uppercase tracking-wider font-mono">
                            AI Mentor Match Engine
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#0C2238] text-white text-[9px] font-bold">
                            96% Match
                          </span>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-[#0C2238] text-white flex items-center justify-center font-bold text-xs shrink-0 font-display">
                            SK
                          </div>
                          <div>
                            <h5 className="text-xs font-extrabold text-[#10253A] font-display">Prof. S. Kulkarni</h5>
                            <p className="text-[11px] text-[#627083]">Department of Computer Engineering &amp; AI</p>
                            <p className="text-[10px] text-[#C99632] font-semibold mt-1">
                              Focus: Transformer Models &amp; Placement Readiness
                            </p>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#0C2238]/08 text-[11px] text-[#10253A] font-medium leading-snug">
                          💬 <em>"Recommended focusing on final year capstone AI research paper submission for IEEE."</em>
                        </div>
                      </div>

                      {/* Right: Coursework & Skill Action Item */}
                      <div className="md:col-span-6 bg-[#FFFCF7] p-4 rounded-2xl border border-[#0C2238]/12 shadow-sm space-y-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-[#244F7D] uppercase tracking-wider font-mono">
                            Recommended Coursework
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#DCE8F4] text-[#244F7D] text-[9px] font-bold">
                            STANFORD / MIT
                          </span>
                        </div>

                        <div>
                          <h5 className="text-xs font-extrabold text-[#10253A] font-display">
                            Deep Learning Specialization (Andrew Ng)
                          </h5>
                          <p className="text-[11px] text-[#627083] mt-0.5">
                            Coursera / DeepLearning.AI • 16 Weeks
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#0C2238]/08">
                          <span className="text-[10px] font-bold text-[#159A72]">100% Real Online Certification</span>
                          <span className="text-xs font-bold text-[#0C2238] flex items-center space-x-1">
                            <span>Inspect Course</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#C99632]" />
                          </span>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {activeRoleView === 'MENTOR' && (
                  <motion.div
                    key="mentor-preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Faculty Header */}
                    <div className="bg-[#0C2238] text-white p-4 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-[#C99632]/20 border border-[#C99632]/40 flex items-center justify-center font-bold text-sm text-[#C99632] font-display">
                          SK
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white font-display">Prof. S. Kulkarni</h4>
                          <p className="text-[11px] text-white/70">Faculty Mentor • 18 Assigned Mentees</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-400/20 text-[#E8C56B] text-xs font-bold border border-amber-400/30">
                        2 Pending Student Requests
                      </span>
                    </div>

                    {/* Mentee Allocation Table Preview */}
                    <div className="bg-[#FFFCF7] p-4 rounded-2xl border border-[#0C2238]/12 shadow-sm space-y-3">
                      <h5 className="text-xs font-extrabold text-[#0C2238] uppercase tracking-wider font-mono">
                        Active Mentee Roster &amp; Compatibility Scores
                      </h5>
                      <div className="space-y-2">
                        {[
                          { name: 'Aarav Sharma', roll: '2023CSE001', match: '96%', cgpa: '8.92', status: 'ACCEPTED' },
                          { name: 'Ananya Iyer', roll: '2023CSE015', match: '94%', cgpa: '9.45', status: 'ACCEPTED' },
                          { name: 'Rohan Patel', roll: '2023CSE042', match: '78%', cgpa: '7.68', status: 'PENDING' }
                        ].map((m, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-[#FAF7F0] border border-[#0C2238]/08 flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2.5">
                              <span className="font-bold text-[#0C2238] font-display">{m.name}</span>
                              <span className="text-[10px] text-[#627083]">({m.roll})</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-[11px] font-bold text-[#C99632]">Match: {m.match}</span>
                              <span className="text-[11px] font-bold text-[#10253A]">CGPA: {m.cgpa}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                m.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {m.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeRoleView === 'ADMIN' && (
                  <motion.div
                    key="admin-preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Admin Telemetry Header */}
                    <div className="bg-[#0C2238] text-white p-4 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#C99632] uppercase tracking-wider font-mono block">
                          System Telemetry &amp; Governance
                        </span>
                        <h4 className="text-sm font-bold text-white font-display">VIT Institutional Admin Suite</h4>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                        All Systems Nominal (142ms RAG)
                      </span>
                    </div>

                    {/* Admin Metrics Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-[#FFFCF7] p-3.5 rounded-2xl border border-[#0C2238]/12 text-center space-y-1">
                        <span className="text-[10px] text-[#627083] font-bold uppercase block">Active Users</span>
                        <span className="text-xl font-extrabold text-[#0C2238] font-display">1,420</span>
                        <span className="text-[9px] text-[#159A72] block font-bold">+14% vs Last Term</span>
                      </div>

                      <div className="bg-[#FFFCF7] p-3.5 rounded-2xl border border-[#0C2238]/12 text-center space-y-1">
                        <span className="text-[10px] text-[#627083] font-bold uppercase block">RAG Vector Index</span>
                        <span className="text-xl font-extrabold text-[#C99632] font-display">14 Docs</span>
                        <span className="text-[9px] text-[#627083] block font-semibold">Ordinances &amp; Syllabi</span>
                      </div>

                      <div className="bg-[#FFFCF7] p-3.5 rounded-2xl border border-[#0C2238]/12 text-center space-y-1">
                        <span className="text-[10px] text-[#627083] font-bold uppercase block">LLM Engine</span>
                        <span className="text-xl font-extrabold text-[#244F7D] font-display">Gemini 3.6</span>
                        <span className="text-[9px] text-[#159A72] block font-bold">Flash Operational</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Bottom Interactive Guidance Footbar */}
            <div className="mt-2.5 px-5 py-2.5 bg-[#0C2238] rounded-xl text-white text-xs flex items-center justify-between border border-white/10">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#C99632] animate-pulse" />
                <span className="text-[11px] font-medium text-white/90">
                  Interactive Champagne &amp; Deep Indigo Preview
                </span>
              </div>
              <a
                href="#dashboard"
                className="text-[11px] font-bold text-[#E8C56B] hover:underline flex items-center space-x-1"
              >
                <span>Launch Full Suite</span>
                <ArrowRight className="w-3 h-3 text-[#E8C56B]" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
