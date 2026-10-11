import React, { useState } from 'react';

export const InfrastructureImpactExplorer: React.FC = () => {
  const [burialDepth, setBurialDepth] = useState<number>(1.5);
  const [acousticShielding, setAcousticShielding] = useState<boolean>(true);
  const [antiFoulingType, setAntiFoulingType] = useState<'silicone' | 'copper' | 'none'>('silicone');
  const [decomOption, setDecomOption] = useState<'crane' | 'reefs'>('reefs');

  const trawlStrikeRisk = Math.max(2, Math.round(85 * Math.exp(-burialDepth * 1.6)));
  const effectiveNoiseDb = acousticShielding ? 112 : 138;

  return (
    <section id="cables-infrastructure" className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="max-w-3xl mb-8">
        <div className="flex items-center gap-2 font-mono text-xs text-amber-400 mb-2">
          <span>CRITICAL TRADEOFFS</span>
          <span aria-hidden="true">·</span>
          <span>FRICTION POINTS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          The Ocean as Infrastructure: 4 Benthic Pressures
        </h2>
        <p className="mt-2 text-slate-300 text-sm">
          Offshore compute trades land energy for benthic friction. Adjust parameters below to inspect the trade-offs:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Submarine Cables vs Trawlers */}
        <div className="bg-[#0b121f] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-base">Cables &amp; Trawl Snags</h3>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                trawlStrikeRisk > 25 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {trawlStrikeRisk}% Strike Risk
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-normal mb-4">
              Bottom otter-trawl gear accounts for 70% of undersea cable tears. Unshielded HVDC cables also emit electro-magnetic fields that disorient skates and sharks.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Jet-Trench Burial:</span>
              <span className="text-cyan-400 font-bold tabular-nums">{burialDepth.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="3.0"
              step="0.2"
              value={burialDepth}
              onChange={(e) => setBurialDepth(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="text-[11px] font-mono text-slate-400 text-right">
              {burialDepth >= 1.5 ? '✓ Below 1.2m dredge depth' : '⚠ Exposed to heavy trawl doors'}
            </div>
          </div>
        </div>

        {/* 2. Hydroacoustic Noise */}
        <div className="bg-[#0b121f] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-base">Acoustic Sonar &amp; Whales</h3>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                acousticShielding ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {effectiveNoiseDb} dB re 1µPa
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-normal mb-4">
              Circulation pumps hum at 50–120 Hz, overlapping with baleen whale communications and traveling far in the SOFAR acoustic channel.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="text-xs font-mono text-slate-300">
              {acousticShielding ? 'Elastomeric Baffling: ACTIVE' : 'Elastomeric Baffling: OFF'}
            </div>
            <button
              onClick={() => setAcousticShielding(!acousticShielding)}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg cursor-pointer transition-colors ${
                acousticShielding
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-rose-500/30 text-rose-300 border border-rose-500'
              }`}
            >
              Toggle Shield
            </button>
          </div>
        </div>

        {/* 3. Artificial Reefs & Biofouling */}
        <div className="bg-[#0b121f] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-base">Reef Colonization vs Biofouling</h3>
              <span className="text-xs font-mono text-cyan-300">
                {antiFoulingType === 'none' ? '+5.2°C Rack Penalty' : 'Heat Flux Preserved'}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-normal mb-4">
              Hulls attract barnacles and anemones. While forming a vibrant artificial reef, thick encrustation acts as thermal insulation, choking cooling efficiency.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['silicone', 'copper', 'none'] as const).map(type => (
              <button
                key={type}
                onClick={() => setAntiFoulingType(type)}
                className={`py-2 px-2 text-[11px] font-mono rounded-lg border transition-colors cursor-pointer text-center capitalize ${
                  antiFoulingType === type
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {type === 'none' ? 'Bare Hull' : type}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Decommissioning Crossroads */}
        <div className="bg-[#0b121f] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-base">5-Year Decommissioning Dilemma</h3>
              <span className="text-xs font-mono text-emerald-400">
                0 Human Access in 5 Yrs
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-normal mb-4">
              Inside dry nitrogen, failure rates drop 8×. At end of life: haul 20-ton capsules to shore (destroying 5-year reef biomass) or extract cores and leave titanium hulls as sanctuaries?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDecomOption('crane')}
              className={`py-2 px-2 text-[11px] font-mono rounded-lg border transition-colors cursor-pointer text-center ${
                decomOption === 'crane'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Heavy Crane Haul
            </button>
            <button
              onClick={() => setDecomOption('reefs')}
              className={`py-2 px-2 text-[11px] font-mono rounded-lg border transition-colors cursor-pointer text-center ${
                decomOption === 'reefs'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Rigs-to-Reefs Sanctuary
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
