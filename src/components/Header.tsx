import React from 'react';
import { Logo } from './Logo';

export type CategoryPage = 'problem' | 'solution' | 'upwelling' | 'pod' | 'infrastructure' | 'comparison' | 'all';

interface HeaderProps {
  activeCategory: CategoryPage;
  onSelectCategory: (category: CategoryPage) => void;
  onOpenGreeting: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenGreeting,
}) => {
  const categories: { id: CategoryPage; label: string }[] = [
    { id: 'problem', label: 'The Problem' },
    { id: 'solution', label: 'The Solution' },
    { id: 'upwelling', label: 'Upwelling Sim' },
    { id: 'pod', label: 'Pod 3D Sim' },
    { id: 'infrastructure', label: 'Benthic Pressures' },
    { id: 'comparison', label: 'Comparison' },
    { id: 'all', label: 'All Pages' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#050b14]/92 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Logo & Brand wordmark: Shift + Earth */}
        <div className="flex items-center gap-3 shrink-0">
          <Logo className="h-7 w-7" showUploadTrigger={false} />
          <button
            onClick={onOpenGreeting}
            className="text-base sm:text-lg font-extrabold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            title="Click to view Welcome Greeting"
          >
            <span className="text-cyan-400">Shift</span>
            <span className="text-slate-400 font-light">+</span>
            <span className="text-white">Earth</span>
          </button>
        </div>

        {/* Zone 2: Category page loading navigation tabs */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Greeting toggle & Fast Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenGreeting}
            className="px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors cursor-pointer"
          >
            Welcome Greeting
          </button>
          <button
            onClick={() => onSelectCategory('upwelling')}
            className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Upwelling Lab
          </button>
        </div>
      </div>

      {/* Mobile Category Bar */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto pt-2.5 pb-0.5 border-t border-slate-800/60 mt-2.5 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap shrink-0 transition-colors ${
              activeCategory === cat.id
                ? 'bg-cyan-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-900/70'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </header>
  );
};
