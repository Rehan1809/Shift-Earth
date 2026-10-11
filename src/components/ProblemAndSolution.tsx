import React from 'react';

interface ProblemAndSolutionProps {
  onProceedToSimulations: () => void;
}

export const ProblemAndSolution: React.FC<ProblemAndSolutionProps> = ({
  onProceedToSimulations,
}) => {
  return (
    <div className="py-16 px-6 max-w-7xl mx-auto space-y-16">
      {/* 1. THE PROBLEM STATEMENT */}
      <section id="problem-statement" className="relative p-8 sm:p-10 bg-gradient-to-b from-[#140a12]/70 via-[#0d0f1a] to-[#080d1a] border border-rose-900/40 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex items-center gap-3 font-mono text-xs text-rose-400 mb-3 tracking-wider">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>PHASE 1 // THE PROBLEM STATEMENT</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight text-balance leading-tight">
          The World’s Compute Demand Has Exploded. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-orange-400">
            The Ocean Has Become Infrastructure.
          </span>
        </h2>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            <p>
              To reduce the crushing energy and cooling costs of terrestrial data centres, nations and technology giants have begun moving digital infrastructure offshore — sinking server capsules, transformers, sensors, and optical conduits thousands of meters beneath the waves.
            </p>
            <p className="font-semibold text-white">
              The engineering strategy works. But the ocean is no longer just an ecosystem. It has become infrastructure.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-rose-400 font-bold block mb-1">Trawling Collisions</span>
                Submarine power &amp; fiber trunks cross active commercial fishing grounds, risking severe severance.
              </div>
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-amber-400 font-bold block mb-1">Thermal &amp; Acoustic Stress</span>
                Waste heat alters benthic layers, while 50–120 Hz coolant pump resonance penetrates whale corridors.
              </div>
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-cyan-400 font-bold block mb-1">Altered Benthic Habitats</span>
                Artificial hulls induce biofouling and artificial reef aggregation, shifting soft-sediment ecology.
              </div>
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-violet-400 font-bold block mb-1">Decommissioning Lock-in</span>
                5-year nitrogen-sealed vessels present high salvage risks and underwater retrieval logistics.
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-6 space-y-4">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Terrestrial vs Abyss Crisis Metrics
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center p-3 bg-slate-900/70 rounded-lg border border-slate-800">
                <span className="text-slate-400">Land Cooling Power Overhead:</span>
                <span className="text-rose-400 font-bold tabular-nums">35% – 45% Waste</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900/70 rounded-lg border border-slate-800">
                <span className="text-slate-400">Land Freshwater Consumption:</span>
                <span className="text-rose-400 font-bold tabular-nums">~1.8 Liters / kWh</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900/70 rounded-lg border border-slate-800">
                <span className="text-slate-400">Global Submarine Fiber:</span>
                <span className="text-amber-300 font-bold tabular-nums">&gt; 1,400,000 km</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900/70 rounded-lg border border-slate-800">
                <span className="text-slate-400">Human Technician Access:</span>
                <span className="text-cyan-400 font-bold tabular-nums">0 Hours Underwater</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE SOLUTION */}
      <section id="solution-framework" className="relative p-8 sm:p-10 bg-gradient-to-b from-[#0a1820]/70 via-[#0b1424] to-[#070e1c] border border-cyan-800/50 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex items-center gap-3 font-mono text-xs text-cyan-400 mb-3 tracking-wider">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>PHASE 2 // THE SUBSEA SOLUTION</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight text-balance leading-tight">
          Calibrated Oceanic Thermodynamics. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-400">
            Zero-Impact Cooling &amp; Bio-Coupled Upwelling.
          </span>
        </h2>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300 leading-relaxed">
          <div className="p-6 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-cyan-300 font-bold font-mono text-base">
              <span>01.</span> Closed-Loop Stratified Diffusion
            </div>
            <p>
              Rather than pulling seawater directly through filters, the data pod operates on a completely sealed internal closed loop. 
              Subsea currents wash across exterior titanium fins, dissipating thermal energy over huge oceanic mass without ambient temperature spikes beyond 3 meters.
            </p>
            <div className="text-xs font-mono text-cyan-400 pt-2">
              Result: PUE drops to 1.05 with zero freshwater evaporation.
            </div>
          </div>

          <div className="p-6 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-300 font-bold font-mono text-base">
              <span>02.</span> Calibrated Buoyant Upwelling
            </div>
            <p>
              By directing server heat into vertical conduit chimneys, data centers induce artificial upwelling — carrying nutrient-dense abyssal water (nitrates &amp; phosphates) to the sunlit surface to fuel controlled primary biomass.
            </p>
            <div className="text-xs font-mono text-emerald-400 pt-2">
              Critical rule: Calibrated to prevent toxic Harmful Algal Blooms (Red Tides).
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
          <div className="text-xs text-slate-400 font-mono">
            Ready to manipulate the physics models in real-time?
          </div>
          <button
            onClick={onProceedToSimulations}
            className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 rounded-xl transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            Enter 3D/2.5D Simulations ↓
          </button>
        </div>
      </section>
    </div>
  );
};
