import { useState } from 'react';
import { Header, CategoryPage } from './components/Header';
import { WelcomeIntro } from './components/WelcomeIntro';
import { ProblemAndSolution } from './components/ProblemAndSolution';
import { ThermalDissipationSim } from './components/ThermalDissipationSim';
import { ThermalUpwellingSim } from './components/ThermalUpwellingSim';
import { InfrastructureImpactExplorer } from './components/InfrastructureImpactExplorer';
import { LifecycleMatrix } from './components/LifecycleMatrix';
import { Footer } from './components/Footer';

export default function App() {
  const [showGreeting, setShowGreeting] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<CategoryPage>('problem');

  const categoryOrder: CategoryPage[] = ['problem', 'solution', 'upwelling', 'pod', 'infrastructure', 'comparison'];

  const categoryMeta: Record<CategoryPage, { title: string; subtitle: string; num: string }> = {
    problem: {
      num: '01',
      title: 'The Problem Statement: The Ocean as Infrastructure',
      subtitle: 'The explosion of compute demand, land cooling limits, and offshore migration.',
    },
    solution: {
      num: '02',
      title: 'The Subsea Solution: Stratified Cooling & Thermal Architecture',
      subtitle: 'Passive abyssal thermal sinks and buoyancy-driven fluid mechanics.',
    },
    upwelling: {
      num: '03',
      title: 'Parametric Simulation: Thermal Upwelling & Nutrient Transport',
      subtitle: 'Buoyancy-driven deep water transport, photic dispersion, and red tide risk.',
    },
    pod: {
      num: '04',
      title: 'Interactive 3D Simulation: Closed-Loop Pod Dissipation',
      subtitle: 'Sealed nitrogen capsule, external titanium heat exchangers, and acoustic boundary.',
    },
    infrastructure: {
      num: '05',
      title: 'Benthic Pressures: Friction Points & Marine Trade-Offs',
      subtitle: 'Cable trawling strikes, cetacean acoustics, artificial reef biofouling, and salvage.',
    },
    comparison: {
      num: '06',
      title: 'System Comparison: Terrestrial vs Subsea Ledger',
      subtitle: 'PUE, freshwater consumption, component failure rates, and servicing accessibility.',
    },
    all: {
      num: 'ALL',
      title: 'Complete Research Platform: Shift + Earth',
      subtitle: 'All sections loaded in sequential research format.',
    },
  };

  const handleNextCategory = () => {
    const currentIndex = categoryOrder.indexOf(activeCategory);
    if (currentIndex >= 0 && currentIndex < categoryOrder.length - 1) {
      setActiveCategory(categoryOrder[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevCategory = () => {
    const currentIndex = categoryOrder.indexOf(activeCategory);
    if (currentIndex > 0) {
      setActiveCategory(categoryOrder[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div id="welcome" className="min-h-screen bg-[#050b14] text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Starting Greeting Overlay (closes completely upon entering) */}
      {showGreeting && (
        <WelcomeIntro
          onEnter={(targetCategory) => {
            setShowGreeting(false);
            if (targetCategory === 'thermal-upwelling') {
              setActiveCategory('upwelling');
            } else if (targetCategory === 'the-problem') {
              setActiveCategory('problem');
            } else {
              setActiveCategory('problem');
            }
          }}
        />
      )}

      {/* Main Persistent Header with Logo and Category Navigation */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenGreeting={() => setShowGreeting(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-16">
        {/* Category Header & Page Breadcrumb Controls */}
        <div className="mb-8 p-4 sm:p-5 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span>CATEGORY {categoryMeta[activeCategory].num}</span>
              <span aria-hidden="true">·</span>
              <span>SHIFT + EARTH PLATFORM</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {categoryMeta[activeCategory].title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {categoryMeta[activeCategory].subtitle}
            </p>
          </div>

          {/* Previous / Next Category Navigation Buttons */}
          {activeCategory !== 'all' && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePrevCategory}
                disabled={categoryOrder.indexOf(activeCategory) === 0}
                className="px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                ← Prev Section
              </button>
              <button
                onClick={handleNextCategory}
                disabled={categoryOrder.indexOf(activeCategory) === categoryOrder.length - 1}
                className="px-3.5 py-1.5 text-xs font-mono font-semibold rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-sm"
              >
                Next Section →
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Category Page Content Loader */}
        {(activeCategory === 'problem' || activeCategory === 'all') && (
          <div className="space-y-12 mb-12">
            <ProblemAndSolution onProceedToSimulations={() => setActiveCategory('upwelling')} />
          </div>
        )}

        {(activeCategory === 'solution') && (
          <div className="space-y-12 mb-12">
            <ProblemAndSolution onProceedToSimulations={() => setActiveCategory('upwelling')} />
          </div>
        )}

        {(activeCategory === 'upwelling' || activeCategory === 'all') && (
          <div className="mb-12">
            <ThermalUpwellingSim />
          </div>
        )}

        {(activeCategory === 'pod' || activeCategory === 'all') && (
          <div className="mb-12">
            <ThermalDissipationSim />
          </div>
        )}

        {(activeCategory === 'infrastructure' || activeCategory === 'all') && (
          <div className="mb-12">
            <InfrastructureImpactExplorer />
          </div>
        )}

        {(activeCategory === 'comparison' || activeCategory === 'all') && (
          <div className="mb-12">
            <LifecycleMatrix />
          </div>
        )}

        {/* Section Footer Navigator */}
        {activeCategory !== 'all' && (
          <div className="mt-12 p-6 bg-[#0b121f] border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-slate-400">
              Completed reviewing <span className="text-white font-semibold">{categoryMeta[activeCategory].title}</span>?
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveCategory('all')}
                className="px-3.5 py-2 text-xs font-mono text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
              >
                View All Categories
              </button>
              {categoryOrder.indexOf(activeCategory) < categoryOrder.length - 1 && (
                <button
                  onClick={handleNextCategory}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg cursor-pointer transition-colors"
                >
                  Continue to {categoryMeta[categoryOrder[categoryOrder.indexOf(activeCategory) + 1]].title.split(':')[0]} →
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
