import React from 'react';
import {
  Wheat,
  Flame,
  Building2,
  Trees,
  Droplets,
  MapPin,
  Globe2
} from 'lucide-react';

export const UseCasesSection: React.FC = () => {
  const useCases = [
    {
      icon: Wheat,
      title: 'Agriculture',
      tag: 'Farms & Crops',
      desc: 'Check how crops are growing, spot dry areas early, and get a clearer picture of your farmland.'
    },
    {
      icon: Flame,
      title: 'Disaster Response',
      tag: 'Emergencies',
      desc: 'See flooded or burned areas even in bad weather, and help teams respond faster.'
    },
    {
      icon: Building2,
      title: 'Cities & Towns',
      tag: 'Urban Growth',
      desc: 'Watch new construction appear, plan roads, and see how your town grows over time.'
    },
    {
      icon: Trees,
      title: 'Forests & Nature',
      tag: 'Trees & Wildlife',
      desc: 'Keep an eye on woodlands, notice when trees disappear, and help protect nature.'
    },
    {
      icon: Droplets,
      title: 'Water Supplies',
      tag: 'Lakes & Rivers',
      desc: 'Track water levels in lakes and reservoirs, and notice when they start to shrink.'
    },
    {
      icon: MapPin,
      title: 'Roads & Transport',
      tag: 'Getting Around',
      desc: 'Inspect highways, ports, and railways to keep important routes working well.'
    },
    {
      icon: Globe2,
      title: 'Environment & Climate',
      tag: 'Our Planet',
      desc: 'Watch coastlines, glaciers, and nature preserves — and see the changes over time.'
    }
  ];

  return (
    <section id="use-cases" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black border-b border-white/10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-cyan-300 border border-white/10 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
          Helpful in the Real World
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Useful for Everyday Questions
        </h2>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          From farms to cities and rivers to forests, SatQuery makes satellite photos
          easy to understand for everyone.
        </p>
      </div>

      {/* 7 Use Cases Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {useCases.map((uc, i) => {
          const Icon = uc.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-gray-900/90 hover:bg-gray-900 border border-white/10 hover:border-cyan-500/40 shadow-xl backdrop-blur-xl transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-900/30 group-hover:scale-105 transition-transform duration-200">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] text-gray-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                    {uc.tag}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1.5">
                  {uc.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {uc.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-gray-500">
                Simple answers for {uc.title.toLowerCase()}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};