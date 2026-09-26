import React from 'react';
import {
  MessageCircleQuestion,
  Sparkles,
  CircleCheck,
  Timer,
  MessageSquareText
} from 'lucide-react';
import { RevealOnScroll } from '../common/RevealOnScroll';

interface LandingHeroProps {
  onLaunchApp: () => void;
  onExploreFeatures?: () => void;
  onExploreCapabilities?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onLaunchApp,
  onExploreFeatures,
  onExploreCapabilities,
}) => {
  return (
    <section id="home" className="relative pt-24 pb-20 overflow-hidden bg-gradient-to-b from-black via-gray-950 to-black border-b border-white/10">
      {/* Subtle dot-grid texture */}
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />

      {/* Soft decorative gradient orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none animate-blob-float" />
      <div className="absolute -top-16 left-1/3 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none animate-blob-float-reverse" />
      <div className="absolute top-40 -right-28 w-[28rem] h-[28rem] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none animate-blob-float-slow" />
      <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none animate-blob-float-reverse" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40rem] h-72 rounded-full bg-blue-900/15 blur-3xl pointer-events-none" />

      {/* Twinkling accent dots */}
      <div className="absolute top-24 left-[12%] w-2 h-2 rounded-full bg-cyan-400/70 animate-twinkle pointer-events-none" />
      <div className="absolute top-40 right-[15%] w-1.5 h-1.5 rounded-full bg-indigo-400/70 animate-twinkle-slow pointer-events-none" />
      <div className="absolute bottom-24 left-[22%] w-1.5 h-1.5 rounded-full bg-cyan-400/70 animate-twinkle-slow pointer-events-none" />
      <div className="absolute bottom-16 right-[25%] w-2 h-2 rounded-full bg-purple-400/70 animate-twinkle pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* User-Friendly Announcement Pill */}
        <RevealOnScroll direction="up" delay={200} duration={800}>
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 shadow-xs backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-white">Made for Everyone</span>
              <span className="text-gray-500">•</span>
              <span className="text-cyan-400 font-semibold">No Experience Needed</span>
            </div>
          </div>
        </RevealOnScroll>

        {/* Hero Headings */}
        <div className="relative text-center max-w-4xl mx-auto space-y-4 mb-12">
          <RevealOnScroll direction="up" delay={400} duration={800}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Ask Questions.{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent block sm:inline font-black">
                Understand Satellite Photos.
              </span>
            </h1>
          </RevealOnScroll>

          <RevealOnScroll direction="up" delay={600} duration={800}>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto font-normal mt-4">
              SatQuery AI looks at pictures of the Earth taken from space, then answers
              your questions in simple, everyday language. Just ask — you'll get a clear answer.
            </p>
          </RevealOnScroll>

          <RevealOnScroll direction="up" delay={800} duration={800}>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={onLaunchApp}
                className="btn-gradient btn-shine px-7 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-cyan-950/40 cursor-pointer"
              >
                <span>Try SatQuery AI</span>
              </button>

              <button
                onClick={onExploreFeatures || onExploreCapabilities}
                className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer backdrop-blur-md"
              >
                <span>See What It Can Do</span>
              </button>
            </div>
          </RevealOnScroll>
        </div>

        {/* FRIENDLY PREVIEW: SIMPLE QUESTION & ANSWER (no photos, no jargon) */}
        <RevealOnScroll direction="up" delay={250} duration={1000} threshold={0.08} className="max-w-3xl mx-auto mt-4 relative">
          <div className="rounded-2xl bg-gray-900/90 border border-white/10 shadow-2xl overflow-hidden relative backdrop-blur-xl">

            {/* Top Bar */}
            <div className="px-4 sm:px-5 py-3 bg-black/60 border-b border-white/10 flex items-center justify-between gap-3 text-xs font-mono relative z-10">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <MessageCircleQuestion className="w-4 h-4 text-cyan-400" />
                <span className="text-white">A SIMPLE QUESTION</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-semibold text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Ready
              </span>
            </div>

            {/* Conversation preview */}
            <div className="p-5 sm:p-6 space-y-4">
              {/* User question */}
              <div className="flex justify-end">
                <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-md bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm shadow-md">
                  <span className="font-semibold">"Has our town grown over the last few years?"</span>
                </div>
              </div>

              {/* SatQuery answer */}
              <div className="flex justify-start">
                <div className="max-w-[90%] space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400">
                    <MessageSquareText className="w-3.5 h-3.5" />
                    SatQuery AI
                  </div>
                  <div className="px-4 py-3.5 rounded-2xl rounded-tl-md bg-black/50 border border-white/10 text-sm text-gray-200 leading-relaxed shadow-xs">
                    Yes, it has! New homes were built in the south part of town, and a few
                    new roads were added near the river. What you see most is fresh construction
                    compared with a few years ago. 
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-0.5">
                    <CircleCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-medium text-gray-300">Clear, easy-to-follow answer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Reassurance chips */}
        <RevealOnScroll direction="up" delay={150} duration={900} className="mt-8">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 backdrop-blur-md">
              <CircleCheck className="w-3.5 h-3.5 text-emerald-400" />
              Plain-English answers
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 backdrop-blur-md">
              <Timer className="w-3.5 h-3.5 text-cyan-400" />
              Quick results
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Simple to use, no training needed
            </span>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default LandingHero;