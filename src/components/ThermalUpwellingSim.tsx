import React, { useState, useEffect, useRef } from 'react';
import { UpwellingParams, UpwellingOutputs } from '../types';

interface ThermalUpwellingSimProps {
  initialHeatOutput?: number;
  initialIntakeDepth?: number;
  initialDiameter?: number;
}

export const ThermalUpwellingSim: React.FC<ThermalUpwellingSimProps> = ({
  initialHeatOutput = 180,
  initialIntakeDepth = 1000,
  initialDiameter = 6.0,
}) => {
  const [params, setParams] = useState<UpwellingParams>({
    heatOutputMw: initialHeatOutput,
    intakeDepthMeters: initialIntakeDepth,
    pipeDiameterMeters: initialDiameter,
    dispersionMode: 'surface',
  });

  const [activeTab, setActiveTab] = useState<'visual' | 'oxygen' | 'hydrodynamics'>('visual');
  const [showPhoticCaustics, setShowPhoticCaustics] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Synchronize when preset changes
  useEffect(() => {
    setParams(prev => ({
      ...prev,
      heatOutputMw: initialHeatOutput,
      intakeDepthMeters: initialIntakeDepth,
      pipeDiameterMeters: initialDiameter,
    }));
  }, [initialHeatOutput, initialIntakeDepth, initialDiameter]);

  // Exact reference physics calibration from photo solution1.jpeg:
  // Heat: 180 MW, Depth: 1000m, Diameter: 6.0m -> Velocity: 1.18 m/s, Flow Rate: 33 m^3/s, Nutrients: 1.0 mol/s, Radius: 107 m
  const area = Math.PI * Math.pow(params.pipeDiameterMeters / 2, 2);
  const baseVelocity = 1.18;
  const heatRatio = params.heatOutputMw / 180;
  const depthRatio = params.intakeDepthMeters / 1000;
  const diameterRatio = params.pipeDiameterMeters / 6.0;

  const upwellingVelocity = +(baseVelocity * Math.pow(heatRatio, 0.42) * Math.pow(depthRatio, 0.22) * Math.pow(1 / diameterRatio, 0.28)).toFixed(2);
  const flowRate = Math.round(area * upwellingVelocity);
  const nitrateConcentrationMolM3 = 0.030 * Math.pow(depthRatio, 0.35);
  const nutrientTransport = +(flowRate * nitrateConcentrationMolM3).toFixed(1);
  const bloomSpreadRadius = Math.round(107 * Math.sqrt(flowRate / 33.3));

  // Ecological thresholds
  let hypoxiaRisk: 'nominal' | 'elevated' | 'critical' = 'nominal';
  let ecologicalStatus = 'Calibrated Primary Biomass';
  let surfaceDissolvedOxygen = 8.2; // mg/L baseline

  if (nutrientTransport > 2.0) {
    hypoxiaRisk = 'critical';
    ecologicalStatus = 'Critical: Harmful Algal Bloom (Red Tide) & Hypoxia';
    surfaceDissolvedOxygen = +(8.2 - (nutrientTransport - 2.0) * 2.8).toFixed(1);
  } else if (nutrientTransport > 1.4) {
    hypoxiaRisk = 'elevated';
    ecologicalStatus = 'Elevated: Approaching Anoxic Decomposition';
    surfaceDissolvedOxygen = +(8.2 - (nutrientTransport - 1.4) * 1.5).toFixed(1);
  } else if (nutrientTransport < 0.4) {
    hypoxiaRisk = 'nominal';
    ecologicalStatus = 'Oligotrophic: Low Deep Nutrient Transport';
  }

  // Carbon fixation: Redfield ratio (106 C : 16 N) -> ~6.6 mol C per mol N
  const carbonFixationTonnesDay = +(nutrientTransport * 6.625 * 12.011 * 86400 / 1e6).toFixed(1);
  // Reynolds number
  const reynoldsNumber = Math.round((1025 * upwellingVelocity * params.pipeDiameterMeters) / 0.0014);

  const outputs: UpwellingOutputs = {
    upwellingVelocity,
    flowRate,
    nutrientTransport,
    bloomSpreadRadius,
    chlorophyllDensity: +(0.8 + nutrientTransport * 2.2).toFixed(1),
    hypoxiaRisk,
    ecologicalStatus,
  };

  // Realistic Canvas Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    // Fluid particles representing buoyant plume inside pipe
    const particleCount = 80;
    const particles = Array.from({ length: particleCount }, () => ({
      y: Math.random() * 280 + 55,
      // Gaussian distribution for horizontal pipe position (more particles near center)
      radialNorm: (Math.random() + Math.random() - 1),
      size: Math.random() * 2.6 + 1.2,
      speedMult: Math.random() * 0.3 + 0.85,
      opacity: Math.random() * 0.5 + 0.5,
    }));

    // Surface bloom organic chlorophyll cells
    const surfaceCells = Array.from({ length: 70 }, () => ({
      angle: Math.random() * Math.PI * 2,
      rRatio: Math.sqrt(Math.random()), // uniform distribution in circle
      size: Math.random() * 2.2 + 0.8,
      speed: Math.random() * 0.006 + 0.002,
    }));

    const render = () => {
      time += 0.022;
      const width = canvas.width;
      const height = canvas.height;

      // Realistic Ocean Light Attenuation with Depth (Beer-Lambert law)
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
      oceanGrad.addColorStop(0, '#042738'); // Surface photic edge (sunlit turquoise-navy)
      oceanGrad.addColorStop(0.15, '#051d30'); // 100m epipelagic base
      oceanGrad.addColorStop(0.35, '#041424'); // 200m mesopelagic twilight boundary
      oceanGrad.addColorStop(0.65, '#020b16'); // 500m bathypelagic dark zone
      oceanGrad.addColorStop(1, '#01050d'); // 1000m abyssal benthic floor
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, width, height);

      // Photic Zone Sunlight Caustics (0 - 80m)
      if (showPhoticCaustics) {
        ctx.save();
        ctx.globalAlpha = 0.08;
        for (let i = 0; i < 4; i++) {
          const causticX = (time * 18 + i * 200) % (width + 100) - 50;
          const beam = ctx.createLinearGradient(causticX, 0, causticX + 60, 110);
          beam.addColorStop(0, '#38bdf8');
          beam.addColorStop(1, 'transparent');
          ctx.fillStyle = beam;
          ctx.beginPath();
          ctx.moveTo(causticX, 0);
          ctx.lineTo(causticX + 50, 0);
          ctx.lineTo(causticX + 110, 110);
          ctx.lineTo(causticX + 40, 110);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      const surfaceY = 52;
      const intakeY = height - 44;
      const pipeCenterX = width * 0.5;

      // Depth ticks & labels (matches screenshot: 0m (Surface) and -1000m Intake)
      ctx.fillStyle = 'rgba(148, 163, 184, 0.75)';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillText('0m (Surface)', 20, surfaceY + 4);
      ctx.fillText(`-${params.intakeDepthMeters}m Intake`, 20, intakeY);

      // Subtle depth horizon grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      [surfaceY + 70, surfaceY + 140, surfaceY + 210, intakeY - 60].forEach(y => {
        ctx.beginPath();
        ctx.moveTo(130, y);
        ctx.lineTo(width - 40, y);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Pipe physical dimensions
      const visualPipeWidth = Math.max(26, Math.min(64, params.pipeDiameterMeters * 6.0));
      const pipeLeft = pipeCenterX - visualPipeWidth / 2;
      const pipeRight = pipeCenterX + visualPipeWidth / 2;

      // Realistic HDPE / Composite Pipe Structure
      const pipeBodyGrad = ctx.createLinearGradient(pipeLeft, 0, pipeRight, 0);
      pipeBodyGrad.addColorStop(0, 'rgba(15, 23, 42, 0.92)');
      pipeBodyGrad.addColorStop(0.25, 'rgba(30, 41, 59, 0.5)');
      pipeBodyGrad.addColorStop(0.75, 'rgba(30, 41, 59, 0.5)');
      pipeBodyGrad.addColorStop(1, 'rgba(15, 23, 42, 0.92)');
      ctx.fillStyle = pipeBodyGrad;
      ctx.fillRect(pipeLeft, surfaceY, visualPipeWidth, intakeY - surfaceY);

      // Pipe walls
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pipeLeft, surfaceY);
      ctx.lineTo(pipeLeft, intakeY);
      ctx.moveTo(pipeRight, surfaceY);
      ctx.lineTo(pipeRight, intakeY);
      ctx.stroke();

      // Circumferential reinforcing collars
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.55)';
      ctx.lineWidth = 1.5;
      for (let y = surfaceY + 26; y < intakeY; y += 34) {
        ctx.beginPath();
        ctx.moveTo(pipeLeft, y);
        ctx.lineTo(pipeRight, y);
        ctx.stroke();
      }

      // Intake base platform (as in screenshot solution1.jpeg)
      const baseWidth = visualPipeWidth * 1.9;
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(pipeCenterX - baseWidth / 2, intakeY, baseWidth, 12);
      ctx.fillStyle = '#475569';
      ctx.fillRect(pipeCenterX - baseWidth / 2 + 4, intakeY + 12, baseWidth - 8, 8);

      // Deep water suction intake arrows
      ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText('▲ INTAKE', pipeCenterX - 24, intakeY + 30);

      // Realistic Buoyant Fluid Particle Flow inside Pipe
      particles.forEach((p) => {
        // Poiseuille parabolic velocity: faster in center, slower near walls
        const wallDistFactor = 1 - Math.pow(p.radialNorm, 2);
        const velocity = (upwellingVelocity / 1.18) * (1.2 + wallDistFactor * 1.4) * p.speedMult;
        
        p.y -= velocity;
        if (p.y < surfaceY) {
          p.y = intakeY - 5;
        }

        const px = pipeCenterX + p.radialNorm * (visualPipeWidth * 0.42);

        // Particle color: warm buoyant thermal fluid (warm orange/coral) mixed with nutrient salt bubbles
        ctx.fillStyle = hypoxiaRisk === 'critical'
          ? `rgba(248, 113, 113, ${p.opacity})`
          : `rgba(251, 146, 60, ${p.opacity})`;

        ctx.beginPath();
        ctx.arc(px, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Realistic Photic Bloom Disk (Surface 0m)
      // Visual radius scaled smoothly
      const visualBloomRadius = Math.min(width * 0.42, 36 + bloomSpreadRadius * 0.88);
      const bloomGrad = ctx.createRadialGradient(
        pipeCenterX, surfaceY, 4,
        pipeCenterX, surfaceY, visualBloomRadius
      );

      if (hypoxiaRisk === 'critical') {
        // REALISTIC HARMFUL ALGAL BLOOM (Red Tide - Dinoflagellate rusty brown-crimson)
        bloomGrad.addColorStop(0, 'rgba(220, 38, 38, 0.95)');
        bloomGrad.addColorStop(0.3, 'rgba(185, 28, 28, 0.75)');
        bloomGrad.addColorStop(0.65, 'rgba(153, 27, 27, 0.4)');
        bloomGrad.addColorStop(1, 'rgba(4, 39, 56, 0)');
      } else if (hypoxiaRisk === 'elevated') {
        // Transitional eutrophic amber-green
        bloomGrad.addColorStop(0, 'rgba(217, 119, 6, 0.9)');
        bloomGrad.addColorStop(0.35, 'rgba(132, 204, 22, 0.7)');
        bloomGrad.addColorStop(0.7, 'rgba(34, 197, 94, 0.3)');
        bloomGrad.addColorStop(1, 'rgba(4, 39, 56, 0)');
      } else {
        // HEALTHY CHLOROPHYLL-A EMERALD BLOOM (matching screenshot solution1.jpeg)
        bloomGrad.addColorStop(0, 'rgba(34, 197, 94, 0.95)');
        bloomGrad.addColorStop(0.35, 'rgba(16, 185, 129, 0.75)');
        bloomGrad.addColorStop(0.7, 'rgba(5, 150, 105, 0.3)');
        bloomGrad.addColorStop(1, 'rgba(4, 39, 56, 0)');
      }

      ctx.fillStyle = bloomGrad;
      ctx.beginPath();
      // Ellipse for realistic ocean surface perspective
      ctx.ellipse(pipeCenterX, surfaceY, visualBloomRadius, visualBloomRadius * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Drifting Phytoplankton Cells in Bloom Disk
      surfaceCells.forEach((sc) => {
        sc.angle += sc.speed;
        const currentR = sc.rRatio * (visualBloomRadius * 0.92);
        const cx = pipeCenterX + Math.cos(sc.angle) * currentR;
        const cy = surfaceY + Math.sin(sc.angle) * (currentR * 0.25);

        ctx.fillStyle = hypoxiaRisk === 'critical'
          ? 'rgba(254, 202, 202, 0.85)'
          : 'rgba(209, 250, 229, 0.85)';
        ctx.beginPath();
        ctx.arc(cx, cy, sc.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle directional plume chevron
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;
      const arrowY = surfaceY + (intakeY - surfaceY) * 0.7;
      ctx.beginPath();
      ctx.moveTo(pipeCenterX - 6, arrowY + 6);
      ctx.lineTo(pipeCenterX, arrowY);
      ctx.lineTo(pipeCenterX + 6, arrowY + 6);
      ctx.stroke();

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [params, upwellingVelocity, flowRate, bloomSpreadRadius, hypoxiaRisk, showPhoticCaustics]);

  return (
    <section id="thermal-upwelling" className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="max-w-3xl mb-8">
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 mb-2">
          <span>PARAMETRIC RESEARCH SIMULATION</span>
          <span aria-hidden="true">·</span>
          <span>OCEANIC ECO-COUPLING</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Thermal Upwelling &amp; Nutrient Transport
        </h2>
        <p className="mt-3 text-slate-300 text-sm leading-relaxed">
          Deep water is naturally rich in dormant nitrates and phosphates. By using subsea server waste heat to create buoyancy, 
          conduits lift nutrient-rich water to the surface.
        </p>
        <p className="mt-2 text-slate-400 text-xs">
          <strong>Ecological Calibration:</strong> The system must be computationally balanced — insufficient heat provides no nutrient yield, while excess heat triggers <strong className="text-rose-400">Harmful Algal Blooms (Red Tides)</strong> that deplete surface oxygen and release biotoxins.
        </p>
      </div>

      {/* Main Simulation Container (matches UI layout in user's photo solution1.jpeg) */}
      <div className="bg-[#0b121f] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Thermal Upwelling &amp; Nutrient Transport</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Parametric simulation of buoyancy-driven deep water transport and primary bloom yield
            </p>
          </div>

          {/* Sub-view switcher: Visual Column vs Oxygen Profile vs Hydrodynamics */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer border ${
                activeTab === 'visual'
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              Visual Plume
            </button>
            <button
              onClick={() => setActiveTab('oxygen')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer border ${
                activeTab === 'oxygen'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              Oxygen &amp; Bio-Risk
            </button>
            <button
              onClick={() => setActiveTab('hydrodynamics')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer border ${
                activeTab === 'hydrodynamics'
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              Hydrodynamics
            </button>
          </div>
        </div>

        {/* 4 Live Metrics (Exact layout as seen in screenshot solution1.jpeg) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-800/80 text-left">
          <div>
            <div className="text-xs text-slate-400 font-medium">Upwelling Velocity</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              {outputs.upwellingVelocity} m/s
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Conduit flow velocity</div>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">Flow Rate</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
              {outputs.flowRate} m³/s
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Volumetric deep water rate</div>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">Nutrient Transport</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
              {outputs.nutrientTransport} mol/s
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Nitrate &amp; phosphate flux</div>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">Bloom Spread Radius</div>
            <div className={`text-xl sm:text-2xl font-bold font-mono mt-1 tabular-nums ${
              hypoxiaRisk === 'critical' ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {outputs.bloomSpreadRadius} m
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Surface photic dispersion</div>
          </div>
        </div>

        {/* Tab 1: Visual Water Column Simulation Stage */}
        {activeTab === 'visual' && (
          <div className="relative mt-6 rounded-2xl overflow-hidden border border-slate-800 bg-[#020712]">
            <canvas
              ref={canvasRef}
              width={940}
              height={440}
              className="w-full h-[380px] sm:h-[440px] block"
            />

            {/* Realistic Light caustics toggle button */}
            <button
              onClick={() => setShowPhoticCaustics(!showPhoticCaustics)}
              className="absolute bottom-4 right-4 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-300 hover:text-white backdrop-blur-sm cursor-pointer"
            >
              {showPhoticCaustics ? 'Sunlight Caustics: ON' : 'Sunlight Caustics: OFF'}
            </button>

            {hypoxiaRisk === 'critical' && (
              <div className="absolute top-4 right-4 bg-rose-950/95 border border-rose-500 rounded-xl p-3.5 text-xs max-w-xs backdrop-blur-md font-mono shadow-2xl">
                <div className="font-bold text-rose-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>HARMFUL ALGAL BLOOM (RED TIDE)</span>
                </div>
                <p className="text-[11px] text-rose-300/90 mt-1.5 leading-snug">
                  Waste heat ({params.heatOutputMw} MW) causes excessive nutrient flooding ({outputs.nutrientTransport} mol/s).
                  Surface dissolved oxygen has fallen to {surfaceDissolvedOxygen} mg/L. Fish gill suffocation risk critical.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Dissolved Oxygen & Hypoxia Profile */}
        {activeTab === 'oxygen' && (
          <div className="mt-6 p-6 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold">Dissolved Oxygen (DO) &amp; Trophic Balance</span>
              <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                hypoxiaRisk === 'critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {outputs.ecologicalStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px]">Surface Dissolved Oxygen</div>
                <div className="text-xl font-bold text-white mt-1 tabular-nums">
                  {surfaceDissolvedOxygen} mg/L
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Normal: 7.5 – 8.5 mg/L</div>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px]">Chlorophyll-a Density</div>
                <div className="text-xl font-bold text-emerald-400 mt-1 tabular-nums">
                  {outputs.chlorophyllDensity} mg/m³
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Safe primary threshold &lt; 4.0</div>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px]">Carbon Biomass Fixation</div>
                <div className="text-xl font-bold text-cyan-400 mt-1 tabular-nums">
                  {carbonFixationTonnesDay} t C / Day
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Redfield stoichiometry</div>
              </div>
            </div>

            <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 text-[11px] text-slate-300 leading-relaxed font-sans">
              <strong>Ecosystem Guidance:</strong> When deep water nitrates arrive in the photic zone, phytoplankton multiply. 
              If the bloom exceeds 1.8 mol/s nutrient transport, the dying biomass sinks and decomposes, consuming dissolved oxygen (eutrophication). 
              Keep heat output between 120 MW and 200 MW for optimal kelp &amp; phytoplankton growth.
            </div>
          </div>
        )}

        {/* Tab 3: Hydrodynamic Hydraulics */}
        {activeTab === 'hydrodynamics' && (
          <div className="mt-6 p-6 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4 font-mono text-xs">
            <div className="text-slate-300 font-bold">Conduit Fluid Mechanics &amp; Buoyancy Thermodynamics</div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">REYNOLDS NUMBER (Re)</div>
                <div className="text-base font-bold text-cyan-300 tabular-nums mt-0.5">
                  {(reynoldsNumber / 1e6).toFixed(2)} × 10⁶
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Turbulent regime</div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">CONDUIT CROSS-SECTION</div>
                <div className="text-base font-bold text-white tabular-nums mt-0.5">
                  {(Math.PI * Math.pow(params.pipeDiameterMeters / 2, 2)).toFixed(1)} m²
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Internal bore area</div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">BUOYANCY DRIVING HEAD</div>
                <div className="text-base font-bold text-amber-300 tabular-nums mt-0.5">
                  +{(0.12 * Math.pow(params.heatOutputMw / 180, 0.5)).toFixed(2)} m H₂O
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Thermal density delta</div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">RESIDENCE TIME</div>
                <div className="text-base font-bold text-emerald-300 tabular-nums mt-0.5">
                  {(params.intakeDepthMeters / upwellingVelocity / 60).toFixed(1)} min
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Intake to surface</div>
              </div>
            </div>
          </div>
        )}

        {/* 3 Parameter Sliders (Exact names, order, and values from screenshot solution1.jpeg) */}
        <div className="mt-8 space-y-5">
          {/* Slider 1: Data Center Heat Output */}
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between text-sm mb-2">
              <label htmlFor="heat-output-slider" className="font-medium text-slate-200">
                Data Center Heat Output
              </label>
              <span className="font-mono text-cyan-400 font-bold tabular-nums">
                {params.heatOutputMw} MW
              </span>
            </div>
            <input
              id="heat-output-slider"
              type="range"
              min="20"
              max="300"
              step="10"
              value={params.heatOutputMw}
              onChange={(e) => setParams(p => ({ ...p, heatOutputMw: Number(e.target.value) }))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
              <span>20 MW Edge</span>
              <span>180 MW Baseline (Photo)</span>
              <span>300 MW Hyperscale</span>
            </div>
          </div>

          {/* Slider 2: Pipe Intake Depth */}
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between text-sm mb-2">
              <label htmlFor="intake-depth-slider" className="font-medium text-slate-200">
                Pipe Intake Depth
              </label>
              <span className="font-mono text-cyan-400 font-bold tabular-nums">
                {params.intakeDepthMeters} m
              </span>
            </div>
            <input
              id="intake-depth-slider"
              type="range"
              min="200"
              max="1400"
              step="50"
              value={params.intakeDepthMeters}
              onChange={(e) => setParams(p => ({ ...p, intakeDepthMeters: Number(e.target.value) }))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
              <span>200 m Epipelagic</span>
              <span>1000 m Deep Abyss (Photo)</span>
              <span>1400 m Bathyal Trench</span>
            </div>
          </div>

          {/* Slider 3: Pipe Diameter */}
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between text-sm mb-2">
              <label htmlFor="pipe-diameter-slider" className="font-medium text-slate-200">
                Pipe Diameter
              </label>
              <span className="font-mono text-cyan-400 font-bold tabular-nums">
                {params.pipeDiameterMeters.toFixed(1)} m
              </span>
            </div>
            <input
              id="pipe-diameter-slider"
              type="range"
              min="1.0"
              max="10.0"
              step="0.5"
              value={params.pipeDiameterMeters}
              onChange={(e) => setParams(p => ({ ...p, pipeDiameterMeters: Number(e.target.value) }))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
              <span>1.0 m Pilot Riser</span>
              <span>6.0 m Standard Trunk (Photo)</span>
              <span>10.0 m Industrial Mega-Conduit</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
