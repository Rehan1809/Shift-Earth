import React from 'react';
import { Logo } from './Logo';

interface WelcomeIntroProps {
  onEnter: (targetCategory?: string) => void;
}

export const WelcomeIntro: React.FC<WelcomeIntroProps> = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#030712]/95 backdrop-blur-xl overflow-y-auto">
      {/* Background ambient lighting */}
      <div 
        className="absolute w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" 
        style={{ animationDuration: '5s' }}
        aria-hidden="true" 
      />

      <div className="max-w-2xl w-full mx-auto p-8 sm:p-12 bg-slate-950/90 border border-cyan-800/50 rounded-3xl shadow-2xl text-center space-y-6 relative">
        {/* Brand logo & Insignia */}
        <div className="flex flex-col items-center justify-center gap-3">
          <Logo className="h-14 w-14" showUploadTrigger={true} />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>SHIFT + EARTH PLATFORM</span>
          </div>
        </div>

        {/* Greeting message */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          Hello folks, welcome to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-sky-400">
            Shift + Earth
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg mx-auto">
          As the world’s demand for computing explodes, digital infrastructure descends offshore into the abyss. Explore the friction, thermodynamics, and realistic marine simulations of the underwater data center revolution.
        </p>

        {/* Enter Actions: closes greeting page upon click */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onEnter('the-problem')}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 rounded-xl transition-all cursor-pointer shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
          >
            <span>Enter Website &amp; Start Journey</span>
            <span aria-hidden="true">→</span>
          </button>

          <button
            onClick={() => onEnter('thermal-upwelling')}
            className="w-full sm:w-auto px-5 py-3.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all cursor-pointer"
          >
            Jump to Upwelling Simulation
          </button>
        </div>

        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Developed by Shift + Earth Team</span>
          <span>© 2026 All rights reserved</span>
        </div>
      </div>
    </div>
  );
};
