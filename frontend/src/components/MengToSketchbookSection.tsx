import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MengToSketchbookLandingPage } from '../shaders/landing-pages/LandingPages';
import '../shaders/threeui.css';

export function MengToSketchbookSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const lastPageRef = useRef<number>(-1);
  const lastSlideRef = useRef<number>(-1);

  // Directly track parent document scroll progress across sticky track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Outer section header opacity & y-shift
  const headerOpacity = useTransform(scrollYProgress, [0, 0.05, 0.18, 0.82, 0.92], [1, 0.6, 0, 0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.05, 0.18, 0.82, 0.92], [0, -10, -35, -35, 0]);

  // Frame Dimensions: Card -> Fullscreen (fitting below navbar) -> Card
  const width = useTransform(scrollYProgress, [0.05, 0.18, 0.80, 0.92], ['90vw', '100vw', '100vw', '90vw']);
  const height = useTransform(scrollYProgress, [0.05, 0.18, 0.80, 0.92], ['68vh', '100%', '100%', '68vh']);
  const borderRadius = useTransform(scrollYProgress, [0.05, 0.18, 0.80, 0.92], [24, 0, 0, 24]);
  const borderOpacity = useTransform(scrollYProgress, [0.05, 0.18, 0.80, 0.92], [1, 0, 0, 1]);

  // Hint opacity
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05, 0.16, 0.80, 0.92], [1, 1, 0, 0, 1]);

  // Helper functions to send postMessages cleanly without message loop/flooding
  const sendSlideMessage = (win: Window, ratio: number) => {
    const roundedRatio = Math.round(ratio * 1000) / 1000;
    if (Math.abs(roundedRatio - lastSlideRef.current) >= 0.002) {
      lastSlideRef.current = roundedRatio;
      win.postMessage({ type: 'set-sketchbook-slide', ratio: roundedRatio }, '*');
    }
  };

  const sendPageMessage = (win: Window, page: number) => {
    if (lastPageRef.current !== page) {
      lastPageRef.current = page;
      win.postMessage({ type: 'set-sketchbook-page', index: page }, '*');
    }
  };

  useEffect(() => {
    let rafId: number | null = null;
    let pendingLatest: number | null = null;

    const processScrollChange = () => {
      rafId = null;
      if (pendingLatest === null) return;
      const latest = pendingLatest;
      pendingLatest = null;

      if (!iframeRef.current) {
        iframeRef.current = document.querySelector<HTMLIFrameElement>('#sketchbook iframe');
      }

      const win = iframeRef.current?.contentWindow;
      if (!win) return;

      // ── ENTRY FROM TOP (latest < 0.18): Reset to STARTING POINT
      if (latest < 0.18) {
        sendPageMessage(win, 0);
        sendSlideMessage(win, 0);
      } 
      // ── PHASE 3A: Turn 3D Spreads (0.18 -> 0.48)
      else if (latest >= 0.18 && latest < 0.48) {
        sendSlideMessage(win, 0);

        const pageProgress = (latest - 0.18) / 0.30;
        const targetPage = Math.min(8, Math.max(0, Math.floor(pageProgress * 9)));
        sendPageMessage(win, targetPage);
      } 
      // ── PHASE 3B: Slide through About Bio, Feature Index & Footer (0.48 -> 0.80)
      else if (latest >= 0.48 && latest <= 0.80) {
        sendPageMessage(win, 8);

        const slideRatio = (latest - 0.48) / 0.32;
        sendSlideMessage(win, slideRatio);
      }
      // ── ENTRY FROM BOTTOM (latest > 0.80): Reset to LAST POINT
      else if (latest > 0.80) {
        sendPageMessage(win, 8);
        sendSlideMessage(win, 1);
      }
    };

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      pendingLatest = latest;
      if (rafId === null) {
        rafId = requestAnimationFrame(processScrollChange);
      }
    });

    return () => {
      unsubscribe();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="relative w-full h-[500vh] bg-[#F7F4EE]">
      {/* Sticky Container: Pinned cleanly below the top navbar (top-16 / top-[68px]) */}
      <div className="sticky top-[68px] w-full h-[calc(100vh-68px)] overflow-hidden flex flex-col justify-center items-center bg-[#F7F4EE] z-20 py-2">
        
        {/* Outer Section Header */}
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="text-center space-y-1 mb-2 px-4 z-10 pointer-events-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0C2238]/05 border border-[#0C2238]/10 text-xs font-semibold text-[#0C2238] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#C99632] animate-pulse"></span>
            VIT Mumbai Platform Showcase
          </div>
          <h2 className="text-xl sm:text-3xl font-serif font-medium text-[#10253A] tracking-tight">
            Interactive Academic & Campus Showcase
          </h2>
        </motion.div>

        {/* Dynamic Zooming Frame: Card -> Full Viewport (Below Navbar) -> Card */}
        <motion.div
          style={{
            width,
            height,
            borderRadius,
          }}
          className="shader-frame relative overflow-hidden bg-[#080808] z-30 flex-shrink-0 shadow-2xl"
        >
          {/* Border Overlay */}
          <motion.div
            style={{ opacity: borderOpacity }}
            className="absolute inset-0 border border-[#0C2238]/20 rounded-[inherit] pointer-events-none z-20"
          />

          <MengToSketchbookLandingPage
            headingFont="instrument-serif"
            bodyFont="newsreader"
            headingWeight="400"
            bodyWeight="400"
            primaryColor="#2b2721"
            headingSize={30}
            bodySize={20}
            headingLetterSpacing={0.010}
            style={{ width: '100%', height: '100%' }}
          />
        </motion.div>

        {/* Scroll Zoom & Progression Hint Indicator */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0C2238]/10 backdrop-blur-md border border-[#0C2238]/15 text-xs text-[#10253A]/80 font-medium pointer-events-none"
        >
          <span>Scroll main page to zoom, flip spreads & explore full feature info</span>
          <svg className="w-3.5 h-3.5 animate-bounce text-[#C99632]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>

      </div>
    </div>
  );
}

export default MengToSketchbookSection;
