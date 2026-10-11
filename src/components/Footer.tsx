import React from 'react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#040812] py-12 px-6 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Logo className="h-9 w-9" showUploadTrigger={true} />
          <div>
            <div className="text-sm font-bold text-white tracking-tight">
              Shift + Earth
            </div>
            <p className="mt-0.5 text-slate-400 max-w-md">
              Oceanic compute thermodynamics, benthic ecology modeling, and parametric deep water transport simulations.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-slate-400 font-mono text-[11px]">
          <span>Shift + Earth Team Engineering Initiative</span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span>Open Simulation Research</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
        <div className="font-medium text-slate-300">
          © {new Date().getFullYear()} Shift + Earth Team. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <a href="#welcome" className="hover:text-cyan-400 transition-colors">
            Back to Top ↑
          </a>
        </div>
      </div>
    </footer>
  );
};
