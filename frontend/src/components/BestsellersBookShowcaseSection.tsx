import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Compass, BookmarkCheck, ExternalLink } from 'lucide-react';
import { BestsellersBookShowcase } from '../shaders/landing-pages/LandingPages';
import '../shaders/threeui.css';

export function BestsellersBookShowcaseSection() {
  return (
    <section id="bestsellers-books" className="py-20 sm:py-28 bg-[#F7F4EE] border-t border-[#0C2238]/08 relative overflow-hidden">
      {/* Subtle Background Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-[#C99632]/06 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0C2238]/06 border border-[#0C2238]/12 text-xs font-semibold text-[#0C2238] uppercase tracking-wider shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C99632]" />
            <span>Curated Academic &amp; Engineering Library</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-[#10253A] tracking-tight leading-[1.15] font-display"
          >
            Field Manuals &amp;{' '}
            <span className="font-serif-accent italic font-normal text-[#C99632]">
              Tools for Thought.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#10253A]/70 font-normal leading-relaxed"
          >
            An earth-toned interactive showcase preserving authored motion, video covers, and editorial field notes for AI, systems architecture, and product design.
          </motion.p>

          {/* Feature Highlights Pill Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/80 border border-[#0C2238]/08 text-xs font-medium text-[#10253A] shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-[#C99632]" />
              <span>Interactive Book Covers</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/80 border border-[#0C2238]/08 text-xs font-medium text-[#10253A] shadow-sm">
              <Compass className="w-3.5 h-3.5 text-[#244F7D]" />
              <span>Cursor Parallax Motion</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/80 border border-[#0C2238]/08 text-xs font-medium text-[#10253A] shadow-sm">
              <BookmarkCheck className="w-3.5 h-3.5 text-[#5f684f]" />
              <span>Editorial Field Notes</span>
            </div>
          </motion.div>
        </div>

        {/* The Exact Configured Component Scene Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full rounded-3xl sm:rounded-[36px] overflow-hidden shadow-[0_30px_90px_rgba(12,34,56,0.24)] border border-[#c3a47b]/35 bg-[#29251d]"
        >
          {/* Main ThreeUI Component Mount */}
          <div className="shader-frame w-full h-[88vh] min-h-[720px] max-h-[960px] relative">
            <BestsellersBookShowcase
              headingFont="iowan-old-style"
              bodyFont="iowan-old-style"
              headingWeight="500"
              bodyWeight="400"
              primaryColor="#c3a47b"
              headingSize={325}
              bodySize={17}
              headingLetterSpacing={-0.085}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Bottom Interactive Guidance Bar */}
          <div className="px-6 py-3.5 bg-[#1d1a15] border-t border-[#c3a47b]/20 flex flex-wrap items-center justify-between gap-3 text-xs text-[#c5b79e]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c3a47b] animate-ping" />
              <span className="font-medium text-[#eee2ca]">Interactive 3D Stage:</span>
              <span>Move pointer for depth parallax • Click any book to inspect authored field notes</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[#c3a47b]/90 font-serif italic">Edition: Field Manuals v2.0</span>
              <a
                href="/landing-pages/bestsellers-book-showcase.html"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#eee2ca] hover:text-[#c3a47b] transition-colors font-medium"
              >
                <span>Full Standalone View</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default BestsellersBookShowcaseSection;
