import React, { useState, useEffect, useRef } from 'react';
import { ThermalDissipationParams, ThermalDissipationOutputs } from '../types';

interface ThermalDissipationSimProps {
  initialComputeLoad?: number;
  initialOceanTemp?: number;
}

export const ThermalDissipationSim: React.FC<ThermalDissipationSimProps> = ({
  initialComputeLoad = 50,
  initialOceanTemp = 10.0,
}) => {
  const [params, setParams] = useState<ThermalDissipationParams>({
    computeLoad: initialComputeLoad,
    oceanAmbientTemp: initialOceanTemp,
    currentVelocity: 0.8,
    podCount: 1,
    showShroud: true,
    showVectors: true,
    showInternalLoop: false,
  });

  // Advanced stylized 3D perspective controls
  const [rotationYaw, setRotationYaw] = useState<number>(-0.25); // radians
  const [rotationPitch, setRotationPitch] = useState<number>(0.2); // radians
  const [isOverclocked, setIsOverclocked] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'thermal' | 'sonar' | 'wireframe'>('thermal');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);

  // Sync props when changed
  useEffect(() => {
    setParams(prev => ({
      ...prev,
      computeLoad: initialComputeLoad,
      oceanAmbientTemp: initialOceanTemp,
    }));
  }, [initialComputeLoad, initialOceanTemp]);

  // Physics calculation
  const effectiveComputeLoad = isOverclocked ? params.computeLoad * 1.5 : params.computeLoad;
  const basePowerPerPodKw = 800;
  const currentDissipationKw = Math.round(effectiveComputeLoad * 0.01 * basePowerPerPodKw * params.podCount);

  const velocityFactor = Math.sqrt(params.currentVelocity / 0.5);
  const heatTransferCoeff = 1400 * velocityFactor;
  const surfaceAreaM2 = 125 * params.podCount;
  const deltaTRequired = (currentDissipationKw * 1000) / (heatTransferCoeff * surfaceAreaM2);

  const internalCoolant = +(params.oceanAmbientTemp + 18 + deltaTRequired * 1.8).toFixed(1);
  const boundaryLayerDelta = +(0.15 + (effectiveComputeLoad / 100) * (0.8 / (params.currentVelocity + 0.2))).toFixed(2);
  const plumeLength = +(3.5 * (effectiveComputeLoad / 50) * (params.currentVelocity / 0.5)).toFixed(1);
  const pue = +(1.02 + (effectiveComputeLoad / 100) * 0.04).toFixed(2);

  const outputs: ThermalDissipationOutputs = {
    dissipationRateKw: currentDissipationKw,
    internalCoolantTemp: internalCoolant,
    oceanAmbientTemp: params.oceanAmbientTemp,
    boundaryLayerDeltaT: boundaryLayerDelta,
    heatPlumeLengthMeters: plumeLength,
    systemCop: +(24 / (1 + deltaTRequired * 0.1)).toFixed(1),
    pueRating: pue,
  };

  // Canvas Drag to Rotate (3D manipulation)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    setRotationYaw(prev => prev + dx * 0.008);
    setRotationPitch(prev => Math.max(-0.6, Math.min(0.6, prev + dy * 0.008)));
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Advanced 3D Stylized Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    // Glowing stylized marine particles and current streamlines
    const particleCount = 110;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 200 - 100,
      size: Math.random() * 2.5 + 1.0,
      speed: (Math.random() * 1.2 + 0.8) * params.currentVelocity * 2.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      time += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      // Dark Sci-Fi Cyber Abyss Background
      ctx.fillStyle = '#020611';
      ctx.fillRect(0, 0, width, height);

      // Sci-fi perspective depth grid on floor
      ctx.save();
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.06)';
      ctx.lineWidth = 1;
      const horizonY = height * 0.72;
      for (let x = -width; x < width * 2; x += 60) {
        ctx.beginPath();
        ctx.moveTo(width / 2, horizonY - 40);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = horizonY; y < height; y += 22) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      const podCenterX = width * 0.48;
      const podCenterY = height * 0.46;
      const podLength = 250;
      const podRadius = 58;

      // Acoustic Sonar Radar Shockwaves (unrealistic stylized effect)
      if (viewMode === 'sonar') {
        ctx.save();
        for (let ring = 0; ring < 4; ring++) {
          const ringProgress = (time * 0.6 + ring * 0.25) % 1;
          const ringRadius = 60 + ringProgress * 280;
          const ringAlpha = (1 - ringProgress) * 0.45;
          ctx.strokeStyle = `rgba(56, 189, 248, ${ringAlpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(podCenterX, podCenterY, ringRadius * 1.4, ringRadius * 0.7, rotationYaw, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // High-Energy Thermal Plasma Aura (downstream dissipation field)
      if (viewMode === 'thermal' && params.showShroud) {
        const auraAlpha = Math.min(0.9, (effectiveComputeLoad / 100) * 0.85);
        ctx.save();
        ctx.translate(podCenterX, podCenterY);
        ctx.rotate(rotationYaw);

        const auraGrad = ctx.createRadialGradient(
          podLength * 0.35, 0, podRadius * 0.6,
          podLength * 0.8 + plumeLength * 12, 0, podRadius * 3.2
        );
        // Exaggerated stylized glowing thermal fire / plasma
        auraGrad.addColorStop(0, `rgba(251, 113, 133, ${auraAlpha})`);
        auraGrad.addColorStop(0.35, `rgba(249, 115, 22, ${auraAlpha * 0.75})`);
        auraGrad.addColorStop(0.7, `rgba(56, 189, 248, ${auraAlpha * 0.35})`);
        auraGrad.addColorStop(1, 'rgba(2, 6, 17, 0)');

        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.ellipse(podLength * 0.5, 0, podLength * 0.75, podRadius * 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3D Capsule Projection
      ctx.save();
      ctx.translate(podCenterX, podCenterY);
      ctx.rotate(rotationYaw);
      ctx.scale(1, 1 - Math.abs(rotationPitch) * 0.4);

      // Deep Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.ellipse(0, podRadius * 2.2, podLength * 0.55, 22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Top Gantry Hoisting Ring (as in user screenshot)
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, -podRadius - 16, 22, Math.PI * 0.75, Math.PI * 2.25);
      ctx.stroke();

      // Cradle Base Stanchions
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-podLength * 0.38, podRadius * 0.8, 22, 32);
      ctx.fillRect(podLength * 0.28, podRadius * 0.8, 22, 32);

      // 3D Cylinder Body
      if (viewMode === 'wireframe') {
        // Holographic Cyber Wireframe Mode
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.fillStyle = 'rgba(14, 165, 233, 0.08)';
        ctx.beginPath();
        ctx.roundRect(-podLength * 0.48, -podRadius, podLength * 0.96, podRadius * 2, 28);
        ctx.fill();
        ctx.stroke();

        // Wireframe ribs
        for (let x = -podLength * 0.42; x <= podLength * 0.42; x += 28) {
          ctx.beginPath();
          ctx.ellipse(x, 0, 8, podRadius, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else {
        // Solid Shaded 3D Capsule with Metallic Finish
        const cylinderGrad = ctx.createLinearGradient(0, -podRadius, 0, podRadius);
        cylinderGrad.addColorStop(0, '#ffffff');
        cylinderGrad.addColorStop(0.18, '#cbd5e1');
        cylinderGrad.addColorStop(0.65, '#64748b');
        cylinderGrad.addColorStop(0.9, '#334155');
        cylinderGrad.addColorStop(1, '#0f172a');

        ctx.fillStyle = cylinderGrad;
        ctx.beginPath();
        ctx.roundRect(-podLength * 0.48, -podRadius, podLength * 0.96, podRadius * 2, [38, 16, 16, 38]);
        ctx.fill();

        // Titanium Circumferential Welds
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2.5;
        for (let x = -podLength * 0.35; x <= podLength * 0.35; x += 45) {
          ctx.beginPath();
          ctx.moveTo(x, -podRadius + 4);
          ctx.lineTo(x, podRadius - 4);
          ctx.stroke();
        }

        // Active Glowing Heat Exchanger Fins
        const finPulse = Math.sin(time * 5) * 0.3 + 0.7;
        const finColor = isOverclocked ? `rgba(244, 63, 94, ${finPulse})` : `rgba(56, 189, 248, ${finPulse * 0.8})`;
        ctx.strokeStyle = finColor;
        ctx.lineWidth = 3;
        for (let fy = -podRadius * 0.45; fy <= podRadius * 0.55; fy += 16) {
          ctx.beginPath();
          ctx.moveTo(-podLength * 0.42, fy);
          ctx.lineTo(podLength * 0.42, fy);
          ctx.stroke();
        }

        // Dome Endcaps (Aft & Fore)
        const aftDomeGrad = ctx.createRadialGradient(-podLength * 0.48, 0, 4, -podLength * 0.48, 0, podRadius);
        aftDomeGrad.addColorStop(0, '#f1f5f9');
        aftDomeGrad.addColorStop(1, '#475569');
        ctx.fillStyle = aftDomeGrad;
        ctx.beginPath();
        ctx.ellipse(-podLength * 0.48, 0, 26, podRadius, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.ellipse(podLength * 0.48, 0, 18, podRadius, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Neon Coolant Fluid Loop Animation
      const loopOffset = -time * 38;
      ctx.strokeStyle = isOverclocked ? '#f43f5e' : '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([10, 8]);
      ctx.lineDashOffset = loopOffset;
      ctx.beginPath();
      ctx.moveTo(-podLength * 0.4, -podRadius * 0.72);
      ctx.lineTo(podLength * 0.4, -podRadius * 0.72);
      ctx.lineTo(podLength * 0.4, podRadius * 0.72);
      ctx.lineTo(-podLength * 0.4, podRadius * 0.72);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);

      // Status Beacon
      const beaconGlow = Math.sin(time * 6) * 0.5 + 0.5;
      ctx.fillStyle = isOverclocked ? `rgba(244, 63, 94, ${beaconGlow})` : `rgba(52, 211, 153, ${beaconGlow})`;
      ctx.beginPath();
      ctx.arc(podLength * 0.35, -podRadius * 0.45, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Flowing Stylized 3D Particles
      particles.forEach((p, idx) => {
        p.x += p.speed;
        p.y += Math.sin(time * 2 + p.pulse) * 0.6;

        if (p.x > width + 20) {
          p.x = -20;
          p.y = Math.random() * height;
        }

        const dx = p.x - podCenterX;
        const dy = p.y - podCenterY;
        const isDownstream = dx > 20 && dx < 360 && Math.abs(dy) < 85;

        // Particle colors
        if (isDownstream && params.showShroud) {
          ctx.fillStyle = isOverclocked ? 'rgba(244, 63, 94, 0.9)' : 'rgba(251, 146, 60, 0.85)';
        } else {
          ctx.fillStyle = 'rgba(125, 211, 252, 0.65)';
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, isDownstream ? p.size * 1.5 : p.size, 0, Math.PI * 2);
        ctx.fill();

        // Visual Streamlines
        if (params.showVectors && idx % 8 === 0) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speed * 8, p.y);
          ctx.stroke();
        }
      });

      // HUD Holographic Text Overlay
      ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillText(`3D YAW: ${(rotationYaw * 180 / Math.PI).toFixed(0)}° (DRAG TO ROTATE)`, 24, height - 20);
      if (isOverclocked) {
        ctx.fillStyle = '#f43f5e';
        ctx.fillText('⚡ QUANTUM OVERCLOCK ENGAGED (+50% HEAT FLUX)', width - 340, 32);
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [params, plumeLength, rotationYaw, rotationPitch, isOverclocked, viewMode, effectiveComputeLoad]);

  return (
    <section id="thermal-pod" className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="max-w-3xl mb-8">
        <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-2">
          <span>INTERACTIVE SIMULATION 01</span>
          <span aria-hidden="true">·</span>
          <span>CLOSED-LOOP DISSIPATION</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Underwater Data Center: Closed-Loop Thermal Dissipation
        </h2>
        <p className="mt-3 text-slate-300 text-sm leading-relaxed">
          Manipulate the 3D subsea pod below. Cold ocean currents pass across exterior heat exchangers, keeping internal die temperatures optimal without ingesting ocean water.
        </p>
      </div>

      {/* Main Simulation Container (matches UI style in user's photo!) */}
      <div className="bg-[#0b121f] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Underwater Data Center</h3>
            <p className="text-xs text-slate-400 mt-0.5">Closed-loop thermal dissipation simulation</p>
          </div>

          {/* View Modes & Overclock Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setViewMode(v => (v === 'thermal' ? 'sonar' : v === 'sonar' ? 'wireframe' : 'thermal'))}
              className="px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            >
              Mode: {viewMode.toUpperCase()}
            </button>
            <button
              onClick={() => setIsOverclocked(!isOverclocked)}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer border ${
                isOverclocked
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-rose-500/30 shadow-md'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {isOverclocked ? '⚡ OVERCLOCK: ACTIVE' : 'OVERCLOCK: OFF'}
            </button>
          </div>
        </div>

        {/* Live Metrics Header Row (Direct replica of photo soln2.jpeg / soln3.jpeg!) */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 py-6 border-b border-slate-800/80 text-left">
          <div>
            <div className="text-xs text-slate-400 font-medium">Ocean Temp</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
              {outputs.oceanAmbientTemp.toFixed(1)}°C
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Ambient abyss baseline</div>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">Internal Coolant</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              {outputs.internalCoolantTemp.toFixed(1)}°C
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Die junction loop</div>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">Dissipation Rate</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
              {outputs.dissipationRateKw} kW
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Active thermal flux</div>
          </div>

          <div className="hidden sm:block">
            <div className="text-xs text-slate-400 font-medium">Boundary Layer ΔT</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
              +{outputs.boundaryLayerDeltaT}°C
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">At 2m radius</div>
          </div>
        </div>

        {/* Interactive 3D Canvas Stage */}
        <div className="relative mt-6 rounded-2xl overflow-hidden border border-slate-800 bg-[#020611] select-none">
          <canvas
            ref={canvasRef}
            width={940}
            height={400}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-[320px] sm:h-[400px] block cursor-grab active:cursor-grabbing"
          />

          <div className="absolute top-4 left-4 bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 text-xs backdrop-blur-sm hidden sm:block font-mono">
            <div className="text-slate-400">Drag viewport to rotate 3D angle</div>
            <div className="text-cyan-400 text-[11px] mt-0.5">PUE: {outputs.pueRating} · 0% Seawater Ingestion</div>
          </div>
        </div>

        {/* Primary Slider: Server Compute Load (matches photo soln2.jpeg) */}
        <div className="mt-8 space-y-6">
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between text-sm mb-2">
              <label htmlFor="compute-load-slider" className="font-medium text-slate-200">
                Server Compute Load
              </label>
              <span className="font-mono text-cyan-400 font-bold tabular-nums">
                {params.computeLoad}%
              </span>
            </div>
            <input
              id="compute-load-slider"
              type="range"
              min="10"
              max="100"
              step="5"
              value={params.computeLoad}
              onChange={(e) => setParams(p => ({ ...p, computeLoad: Number(e.target.value) }))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
              <span>10% Idle</span>
              <span>50% Nominal Load</span>
              <span>100% Full Training Run</span>
            </div>
          </div>

          {/* Secondary Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl">
              <div className="flex items-center justify-between text-xs mb-2">
                <label htmlFor="ocean-temp-slider" className="text-slate-300">
                  Ocean Ambient Temp
                </label>
                <span className="font-mono text-cyan-300 tabular-nums">
                  {params.oceanAmbientTemp.toFixed(1)}°C
                </span>
              </div>
              <input
                id="ocean-temp-slider"
                type="range"
                min="2.0"
                max="18.0"
                step="0.5"
                value={params.oceanAmbientTemp}
                onChange={(e) => setParams(p => ({ ...p, oceanAmbientTemp: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl">
              <div className="flex items-center justify-between text-xs mb-2">
                <label htmlFor="current-speed-slider" className="text-slate-300">
                  Ocean Current Velocity
                </label>
                <span className="font-mono text-cyan-300 tabular-nums">
                  {params.currentVelocity.toFixed(2)} m/s
                </span>
              </div>
              <input
                id="current-speed-slider"
                type="range"
                min="0.1"
                max="2.2"
                step="0.05"
                value={params.currentVelocity}
                onChange={(e) => setParams(p => ({ ...p, currentVelocity: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
