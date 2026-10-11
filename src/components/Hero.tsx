import React from 'react';

interface HeroProps {
  onSelectScenario: (scenario: 'abyssal' | 'upwelling' | 'coastal') => void;
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectScenario, onExplore }) => {
  return (
    <section id="hero" className="relative pt-12 pb-16 px-6 max-w-7xl mx-auto">
      {/* Background radial ocean glow */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-950/20 blur-[120px] rounded-full pointer-events-none -z-10" 
        aria-hidden="true"
      />

      {/* Unboxed Metadata (Zero-Pill Discipline) */}
      <div className="flex items-center gap-2 text-xs font-mono text-cyan-400/90 mb-5 tracking-wide">
        <span>OCEANOGRAPHIC COMPUTING RESEARCH</span>
        <span aria-hidden="true">·</span>
        <span>THERMAL &amp; BENTHIC ECOLOGY</span>
        <span aria-hidden="true">·</span>
        <span>PEER-GRADED SIMULATION BENCHMARK</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-8 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15] text-balance">
            The ocean is no longer just an ecosystem. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-sky-400">It has become infrastructure.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            The world’s demand for computing has exploded. To cut massive cooling power, 
            nations and hyperscalers have moved digital workloads offshore — submerging 
            pressurized server capsules, high-voltage power umbilicals, and fiber backbones into the sea. 
            The cooling physics work flawlessly. Yet submarine cables cross vital fishing grounds, 
            dissipated heat alters benthic thermoclines, low-frequency acoustic hum propagates through whale corridors, 
            and artificial hulls permanently rewire marine habitats.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onExplore}
              className="px-5 py-3 text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer shadow-md"
            >
              Explore Live Simulations
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Quick Scenarios:</span>
              <button
                onClick={() => onSelectScenario('abyssal')}
                className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded hover:border-slate-700 transition-colors cursor-pointer font-mono"
              >
                Abyssal Plain (4°C)
              </button>
              <button
                onClick={() => onSelectScenario('upwelling')}
                className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded hover:border-slate-700 transition-colors cursor-pointer font-mono"
              >
                Upwelling Plume (180 MW)
              </button>
              <button
                onClick={() => onSelectScenario('coastal')}
                className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded hover:border-slate-700 transition-colors cursor-pointer font-mono"
              >
                Coastal Shelf (14°C)
              </button>
            </div>
          </div>
        </div>

        {/* Informational Callout Card */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between backdrop-blur-sm">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 tracking-wide mb-3">
              The Thermodynamic Advantage
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Water exhibits a volumetric heat capacity <strong className="text-slate-200">~3,300 times greater than air</strong>. 
              By sinking pressurized vessels below the thermocline (where temperatures stay perpetually between 4°C and 10°C), 
              hyperscale facilities achieve passive heat dissipation without evaporative freshwater consumption or mechanical chiller compressors.
            </p>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Terrestrial PUE:</span>
                <span className="text-rose-400 tabular-nums">1.35 – 1.60</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Subsea Closed-Loop PUE:</span>
                <span className="text-cyan-400 tabular-nums">1.03 – 1.07</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Freshwater Consumed:</span>
                <span className="text-emerald-400 tabular-nums">0.0 Liters/kWh</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            Validated against Microsoft Project Natick &amp; China Hainan Commercial Subsea Data Center data.
          </div>
        </div>
      </div>

      {/* 4-column KPI strip below the hero split */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-slate-900/40 border border-slate-800/70 rounded-xl">
        <div className="p-2">
          <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 tabular-nums">1.05</div>
          <div className="text-xs font-medium text-slate-200 mt-1">Power Usage Effectiveness</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Slashing cooling energy by &gt;95% vs air-cooled racks</div>
        </div>
        <div className="p-2">
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums">4.2°C</div>
          <div className="text-xs font-medium text-slate-200 mt-1">Deep Abyssal Heat Sink</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Perpetual stability below the oceanic thermocline</div>
        </div>
        <div className="p-2">
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 tabular-nums">1.42M km</div>
          <div className="text-xs font-medium text-slate-200 mt-1">Submarine Fiber Cabling</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Crossing critical trawl zones and marine corridors</div>
        </div>
        <div className="p-2">
          <div className="text-2xl sm:text-3xl font-bold font-mono text-violet-400 tabular-nums">&lt;0.2°C</div>
          <div className="text-xs font-medium text-slate-200 mt-1">External Boundary Layer ΔT</div>
          <div className="text-[11px] text-slate-400 mt-0.5">In closed-loop mode, heat dissipates within 3 meters</div>
        </div>
      </div>
    </section>
  );
};
