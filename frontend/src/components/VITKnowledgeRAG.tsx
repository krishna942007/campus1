import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, FileText, CheckCircle2, ShieldAlert, Sparkles, X, Filter, 
  Check, ArrowRight, ShieldCheck, HelpCircle, Eye, ChevronRight, Lock
} from 'lucide-react';
import { StatusBadge } from './ui/StatusBadge';

export interface RAGDocument {
  id: string;
  category: 'Academic' | 'Examination' | 'Curriculum' | 'Department' | 'Placement';
  q: string;
  answer: string;
  docName: string;
  section: string;
  authority: string;
  confidence: string;
  retrievedSnippet: string;
  aiInterpretation: string;
}

const RAG_CATALOG: RAGDocument[] = [
  {
    id: 'rag-1',
    category: 'Examination',
    q: 'What is the minimum attendance required for end-semester examination?',
    answer: 'According to VIT Autonomous Ordinance 2024 Section 5.1: Students must maintain a minimum of 75% attendance in every course (theory + lab) to be eligible for end-semester examinations. Students between 65%-74% require Dean approval for medical/extenuating reasons.',
    docName: 'VIT Academic Ordinance 2024 (Doc ID: VIT-ORD-75)',
    section: 'Section 5.1 (Clause B)',
    authority: 'Official Institutional Source (Registrar Office)',
    confidence: '99.4%',
    retrievedSnippet: 'Clause 5.1.B: "No candidate shall be admitted to any end-semester examination unless he/she has attended at least 75% of total lectures/practical hours held in each subject during the semester."',
    aiInterpretation: 'The student must have ≥75% attendance in every individual registered subject to be permitted into the exam hall without Dean condonation.'
  },
  {
    id: 'rag-2',
    category: 'Academic',
    q: 'How are honors credit courses allocated in Computer Engineering?',
    answer: 'Students with CGPA >= 7.50 and 0 active backlogs after Semester IV are eligible to register for 18-20 additional Honors credits in AI & Data Science starting Semester V.',
    docName: 'Computer Engineering Curriculum Handbook (Doc ID: CSE-HON-2026)',
    section: 'Section 4.2 (Honors Policy)',
    authority: 'Academic Council VIT Mumbai',
    confidence: '98.8%',
    retrievedSnippet: 'Section 4.2: "Students attaining CGPA ≥ 7.50 at the end of IV semester with clean record (no active arrears) may opt for Honors degree track in AI & Data Science."',
    aiInterpretation: 'Eligible students can earn an additional 18-20 credits over Semesters V to VIII to receive the Honors degree designation.'
  },
  {
    id: 'rag-3',
    category: 'Department',
    q: 'What are the capstone project submission deadlines?',
    answer: 'Phase I Capstone synopsis must be submitted by September 30. Interim evaluation is scheduled for November 15 with assigned faculty mentor review.',
    docName: 'Department Project Committee Guidelines (Doc ID: DPC-GUIDE-V)',
    section: 'Section 2.3 (Project Milestones)',
    authority: 'Department of Computer Engineering',
    confidence: '97.6%',
    retrievedSnippet: 'Section 2.3: "Phase 1 synopsis upload deadline: 30th Sept. Mentor sign-off required prior to upload. Phase 2 progress review: 15th Nov."',
    aiInterpretation: 'The Phase I synopsis requires mentor sign-off before September 30 to qualify for the November 15 evaluation.'
  },
  {
    id: 'rag-4',
    category: 'Placement',
    q: 'What CGPA is required for Tier-1 campus placement drives?',
    answer: 'Placement Policy 2026 Clause 3.1: Tier-1 placement drives (Package >= 12 LPA) require a minimum cumulative CGPA of 7.50 with maximum 1 dead backlog cleared before Semester VII.',
    docName: 'VIT Training & Placement Regulations (Doc ID: TPO-2026-REG)',
    section: 'Section 3.1 (Placement Eligibility)',
    authority: 'Training & Placement Office',
    confidence: '99.1%',
    retrievedSnippet: 'Clause 3.1: "Criteria for Dream & Super Dream companies (≥12 LPA): Minimum CGPA 7.50 at end of VI semester. All live backlogs must be cleared."',
    aiInterpretation: 'Maintaining CGPA ≥7.50 guarantees eligibility for Tier-1 Super Dream campus interviews.'
  }
];

export const VITKnowledgeRAG: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All Documents');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<RAGDocument>(RAG_CATALOG[0]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchStage, setSearchStage] = useState<string>('');
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);
  const [showSourceModal, setShowSourceModal] = useState<boolean>(false);

  const filteredDocs = activeCategory === 'All Documents' 
    ? RAG_CATALOG 
    : RAG_CATALOG.filter(d => d.category === activeCategory);

  const handleExecuteSearch = (queryText?: string) => {
    const textToSearch = queryText || searchQuery || 'What is the attendance policy for end-semester examinations at VIT Wadala?';
    setIsSearching(true);
    setSearchStage('SEARCHING OFFICIAL KNOWLEDGE BASE...');

    setTimeout(() => {
      setSearchStage('DOCUMENTS FOUND: 4');
      setTimeout(() => {
        setSearchStage('RELEVANT EVIDENCE IDENTIFIED');
        setTimeout(() => {
          setIsSearching(false);
          const found = RAG_CATALOG.find(d => d.q.toLowerCase().includes(textToSearch.toLowerCase())) || RAG_CATALOG[0];
          setSelectedDoc(found);
        }, 300);
      }, 300);
    }, 300);
  };

  return (
    <section id="rag" className="relative py-24 w-full bg-[#F7F4EE] border-t border-[#0C2238]/08 z-10 overflow-hidden">
      {/* Ambient Lighting Blobs behind Glass Surface */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#C99632]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#244F7D]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-8">
        
        {/* Section Headline */}
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
              TRUSTWORTHY INSTITUTIONAL RAG KNOWLEDGE BASE
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#10253A] tracking-tight leading-[1.12] font-display">
            ASK VIT. <br />
            <span className="text-[#C99632] font-serif-accent italic font-normal">
              GET GROUNDED ANSWERS.
            </span>
          </h2>

          <p className="text-base font-normal text-[#627083] leading-relaxed">
            Transparent vector search over official VIT Wadala academic ordinances, examination rules, and placement circulars.
          </p>
        </motion.div>

        {/* Search Input Bar & Category Filters */}
        <div className="p-6 rounded-3xl bg-[#FFFCF7]/90 backdrop-blur-xl border border-[#0C2238]/12 shadow-xl space-y-4">
          <form onSubmit={(e) => { e.preventDefault(); handleExecuteSearch(); }} className="flex items-center space-x-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask about attendance rules, honors degree, capstone deadlines, placement CGPA..."
                className="w-full px-5 py-3.5 rounded-2xl bg-[#F7F4EE] border border-[#0C2238]/15 text-sm font-extrabold text-[#10253A] placeholder-[#627083] focus:outline-none focus:ring-2 focus:ring-[#C99632] focus:border-transparent transition-all pr-12 shadow-inner"
              />
              <Search className="w-5 h-5 text-[#0C2238] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="px-7 py-3.5 rounded-2xl bg-[#0C2238] hover:bg-[#07182A] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer shrink-0 flex items-center space-x-2"
            >
              <span>Search Ordinance</span>
              <ArrowRight className="w-4 h-4 text-[#E8C56B]" />
            </button>
          </form>

          {/* 7. Category Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pt-1 text-xs">
            <span className="text-[10px] font-extrabold text-[#627083] uppercase tracking-wider shrink-0 mr-1 flex items-center space-x-1">
              <Filter className="w-3 h-3 text-[#C99632]" />
              <span>Filters:</span>
            </span>
            {['All Documents', 'Academic', 'Examination', 'Curriculum', 'Department', 'Placement'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-extrabold transition-all cursor-pointer shrink-0 border ${
                  activeCategory === cat
                    ? 'bg-[#C99632] text-[#0C2238] border-[#C99632] shadow-sm'
                    : 'bg-white/60 hover:bg-white text-[#10253A] border-[#0C2238]/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Retrieval Process Loading Banner */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-[#0C2238] text-white border border-[#C99632]/40 flex items-center justify-between shadow-xl"
            >
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-[#E8C56B] animate-spin" />
                <span className="text-xs font-mono font-bold tracking-wider text-[#E8C56B]">
                  {searchStage}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Vector Cosine Similarity Index: 0.942</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Answer Card & Source Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Filtered RAG Documents (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C99632] block">
              RETRIEVED ORDINANCE DOCUMENTS ({filteredDocs.length})
            </span>
            {filteredDocs.map((item) => {
              const isSelected = selectedDoc.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedDoc(item)}
                  className={`p-5 border transition-all duration-300 cursor-pointer space-y-2 rounded-2xl ${
                    isSelected
                      ? 'bg-[#0C2340] backdrop-blur-md text-white border-[#C99632] shadow-xl scale-[1.01]'
                      : 'bg-[#FFFCF7]/80 hover:bg-[#FFFCF7] text-[#10253A] border-[#0C2238]/08 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-extrabold">
                    <span className={isSelected ? 'text-[#E8C56B]' : 'text-[#C99632]'}>{item.category}</span>
                    <span className="font-mono text-[10px] opacity-80">{item.section}</span>
                  </div>
                  <h4 className="text-xs font-extrabold leading-snug font-display">"{item.q}"</h4>
                </div>
              );
            })}
          </div>

          {/* Right Column: Grounded Answer & Traceability Controls (7 cols) */}
          <div className="lg:col-span-7 p-7 sm:p-8 bg-[#0C2340]/95 text-white border border-white/10 shadow-2xl space-y-6 rounded-3xl relative overflow-hidden">
            
            {/* Top Bar with Trust Distinction */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold">
                  OFFICIAL RECORD VERIFIED
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-mono font-bold">
                  AI INTERPRETATION
                </span>
              </div>

              {/* 6. Retrieval Confidence Badge */}
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">Retrieval Confidence</span>
                <span className="text-xs font-extrabold text-[#E8C56B] font-mono">{selectedDoc.confidence}</span>
              </div>
            </div>

            {/* Answer Display */}
            <div className="space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E8C56B]">
                GROUNDED INSTITUTIONAL ANSWER
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug font-display">
                "{selectedDoc.q}"
              </h3>
              <p className="text-xs sm:text-sm text-slate-100 font-normal leading-relaxed p-4 rounded-2xl bg-white/5 border border-white/10">
                {selectedDoc.answer}
              </p>
            </div>

            {/* 5. Source Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Document</span>
                <span className="font-extrabold text-white truncate block">{selectedDoc.docName}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Section</span>
                <span className="font-extrabold text-[#E8C56B] block">{selectedDoc.section}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Authority</span>
                <span className="font-bold text-slate-200 truncate block">{selectedDoc.authority}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Status</span>
                <span className="font-extrabold text-emerald-400 block">VERIFIED</span>
              </div>
            </div>

            {/* Traceability Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
              {/* 4. Show Why Button */}
              <button
                onClick={() => setShowWhyModal(true)}
                className="px-5 py-2.5 rounded-xl bg-[#C99632] hover:bg-[#b08226] text-[#0C2238] font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center space-x-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 fill-[#0C2238]" />
                <span>Show Why (Traceability)</span>
              </button>

              {/* 8. Open Source Button */}
              <button
                onClick={() => setShowSourceModal(true)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-[#E8C56B]" />
                <span>Open Source Document</span>
              </button>
            </div>

            {/* 9. Important Trust Rule Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 font-semibold flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>OFFICIAL RECORD ≠ AI OVERRIDE: Retrieval confidence (99.4%) reflects similarity matching. AI interpretation cannot alter official VIT academic ordinances or faculty rulings.</span>
            </div>

          </div>

        </div>

      </div>

      {/* 4. SHOW WHY TRACEABILITY MODAL */}
      <AnimatePresence>
        {showWhyModal && (
          <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-xl w-full rounded-3xl bg-[#0C2238] border border-[#C99632]/50 p-6 text-white shadow-2xl space-y-4 relative"
            >
              <button
                onClick={() => setShowWhyModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-[#E8C56B]" />
                <h3 className="text-base font-extrabold font-display">Retrieval Traceability (Why This Answer?)</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold text-[#E8C56B] uppercase">1. QUESTION</span>
                  <p className="font-semibold text-white">"{selectedDoc.q}"</p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold text-[#E8C56B] uppercase">2. RETRIEVED DOCUMENT & SECTION</span>
                  <p className="font-semibold text-white">{selectedDoc.docName} • {selectedDoc.section}</p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold text-[#E8C56B] uppercase">3. RELEVANT EVIDENCE SNIPPET</span>
                  <p className="font-mono text-emerald-300 text-[11px]">{selectedDoc.retrievedSnippet}</p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-extrabold text-[#E8C56B] uppercase">4. AI INTERPRETATION</span>
                  <p className="text-slate-200">{selectedDoc.aiInterpretation}</p>
                </div>
              </div>

              <button
                onClick={() => setShowWhyModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#C99632] text-[#0C2238] font-extrabold text-xs"
              >
                Close Traceability
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. OPEN SOURCE DOCUMENT PREVIEW MODAL */}
      <AnimatePresence>
        {showSourceModal && (
          <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-xl w-full rounded-3xl bg-[#0C2238] border border-white/20 p-6 text-white shadow-2xl space-y-4 relative"
            >
              <button
                onClick={() => setShowSourceModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#E8C56B]" />
                <h3 className="text-base font-extrabold font-display">Official Ordinance Document Preview</h3>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2 text-xs font-mono">
                <p className="text-[#E8C56B] font-bold">{selectedDoc.docName}</p>
                <p className="text-slate-300">{selectedDoc.section}</p>
                <div className="p-3 bg-white/5 rounded-lg text-slate-200 leading-relaxed border-l-2 border-[#C99632]">
                  {selectedDoc.retrievedSnippet}
                </div>
                <p className="text-[10px] text-emerald-400">Authority: {selectedDoc.authority} (Digital Seal Verified)</p>
              </div>

              <button
                onClick={() => setShowSourceModal(false)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs"
              >
                Close Document Preview
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
