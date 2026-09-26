import React, { useState } from 'react';
import { UploadCloud, MessageSquare, BrainCircuit, SearchCheck, FileCheck2, CheckCircle2 } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(2); // default highlighting step 3

  const steps = [
    {
      step: '01',
      title: 'Upload',
      subtitle: 'Your Satellite Photo',
      icon: UploadCloud,
      detail: 'Add one photo, or two from different dates. SatQuery figures out the details for you.',
      badge: 'Easy to Add'
    },
    {
      step: '02',
      title: 'Ask',
      subtitle: 'In Plain English',
      icon: MessageSquare,
      detail: 'Type any question in your own words, like "Has the town grown?" — no commands to learn.',
      badge: 'Just Ask'
    },
    {
      step: '03',
      title: 'Understand',
      subtitle: 'We Look at What You Meant',
      icon: BrainCircuit,
      detail: 'SatQuery works out whether you want a quick answer, a helpful summary, or a look at what changed.',
      badge: 'We Figure It Out'
    },
    {
      step: '04',
      title: 'Check',
      subtitle: 'Careful Examination',
      icon: SearchCheck,
      detail: 'Your photos are inspected closely and the important details are gathered for your answer.',
      badge: 'Thorough & Fast'
    },
    {
      step: '05',
      title: 'Explain',
      subtitle: 'Clear, Friendly Answers',
      icon: FileCheck2,
      detail: 'You get a simple answer you can trust, with highlighted areas on the photo to back it up.',
      badge: 'Easy to Understand'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black border-b border-white/10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-cyan-300 border border-white/10 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
          A Simple 5-Step Process
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          From Question to Clear Answers
        </h2>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          SatQuery turns your questions and satellite photos into clear, friendly answers in just five easy steps.
        </p>
      </div>

      {/* 5-Step Visual Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {/* Horizontal Connector Line for Desktop */}
        <div className="hidden md:block absolute top-16 left-12 right-12 h-0.5 bg-white/10 pointer-events-none" />

        {steps.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeStep === index;

          return (
            <div
              key={item.step}
              onClick={() => setActiveStep(index)}
              className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between group relative select-none ${
                isActive
                  ? 'bg-cyan-950/40 border-2 border-cyan-400 shadow-xl shadow-cyan-950/50 -translate-y-1 backdrop-blur-xl'
                  : 'bg-gray-900/90 hover:bg-gray-900 border border-white/10 hover:border-cyan-500/40 hover:-translate-y-0.5 shadow-md backdrop-blur-xl'
              }`}
            >
              {/* Step Number Top Badge */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  isActive
                    ? 'bg-cyan-500 text-black font-extrabold shadow-sm'
                    : 'bg-white/5 text-gray-400 border border-white/10'
                }`}>
                  {item.step}
                </span>

                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 ${
                  isActive
                    ? 'bg-cyan-500 text-black shadow-md scale-105'
                    : 'bg-white/5 text-gray-400 group-hover:text-cyan-400 group-hover:bg-white/10'
                }`}>
                  <Icon className="w-4 h-4 stroke-[2.3]" />
                </div>
              </div>

              {/* Title and Subtitle */}
              <div className="space-y-1.5 relative z-10">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-cyan-400">
                  {item.subtitle}
                </p>
                <p className="text-xs text-gray-400 leading-relaxed pt-1">
                  {item.detail}
                </p>
              </div>

              {/* Bottom Tag */}
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="text-gray-500">{item.badge}</span>
                {isActive && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};