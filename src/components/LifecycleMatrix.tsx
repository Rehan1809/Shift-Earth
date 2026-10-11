import React from 'react';

export const LifecycleMatrix: React.FC = () => {
  const comparisons = [
    {
      label: 'Cooling Efficiency (PUE)',
      land: '1.45',
      landStatus: '35% Chiller Waste',
      ocean: '1.05',
      oceanStatus: 'Passive Deep Sink',
      better: 'ocean',
    },
    {
      label: 'Freshwater Consumed',
      land: '1.80 L / kWh',
      landStatus: 'Evaporative Towers',
      ocean: '0.00 L / kWh',
      oceanStatus: '100% Sealed Loop',
      better: 'ocean',
    },
    {
      label: 'Component Failure Rate',
      land: '5.9% / Year',
      landStatus: 'Oxygen & Humidity',
      ocean: '0.7% / Year',
      oceanStatus: '8× Higher MTBF (Inert N₂)',
      better: 'ocean',
    },
    {
      label: 'Benthic / Habitat Impact',
      land: 'Low (Zoned Land)',
      landStatus: 'Urban Grid',
      ocean: 'Elevated',
      oceanStatus: 'Acoustic Hum & EMF',
      better: 'land',
    },
    {
      label: 'Maintenance Servicing',
      land: '24/7 Hot-Swap',
      landStatus: 'Immediate Technician Access',
      ocean: 'Zero Access',
      oceanStatus: '5-Yr Sealed Lockdown',
      better: 'land',
    },
  ];

  return (
    <section id="lifecycle-comparison" className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="max-w-3xl mb-8">
        <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-2">
          <span>SYSTEM MATRIX</span>
          <span aria-hidden="true">·</span>
          <span>LAND VS ABYSS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          System Comparison: Land vs. Subsea Compute
        </h2>
        <p className="mt-2 text-slate-300 text-sm">
          A high-level engineering ledger comparing terrestrial data centers against submerged abyssal pods.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparisons.map((item, idx) => (
          <div key={idx} className="bg-[#0b121f] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
              {item.label}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl">
                <span className="text-slate-400 text-[10px] block">LAND FACILITY</span>
                <span className="text-rose-400 font-bold text-sm block mt-0.5">{item.land}</span>
                <span className="text-slate-400 text-[10px] block mt-1">{item.landStatus}</span>
              </div>

              <div className="p-2.5 bg-cyan-950/20 border border-cyan-800/40 rounded-xl">
                <span className="text-cyan-400 text-[10px] block">SUBSEA POD</span>
                <span className="text-cyan-300 font-bold text-sm block mt-0.5">{item.ocean}</span>
                <span className="text-slate-300 text-[10px] block mt-1">{item.oceanStatus}</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/70 text-[11px] font-mono flex items-center justify-between text-slate-400">
              <span>Advantage:</span>
              <span className={item.better === 'ocean' ? 'text-cyan-400 font-bold' : 'text-amber-400 font-bold'}>
                {item.better === 'ocean' ? '✓ Subsea Abyssal' : '✓ Terrestrial'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
