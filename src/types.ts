export interface ThermalDissipationParams {
  computeLoad: number; // 10% to 100%
  oceanAmbientTemp: number; // 2°C to 18°C
  currentVelocity: number; // 0.1 to 2.0 m/s
  podCount: number; // 1 to 16 pods in cluster
  showShroud: boolean;
  showVectors: boolean;
  showInternalLoop: boolean;
}

export interface ThermalDissipationOutputs {
  dissipationRateKw: number;
  internalCoolantTemp: number;
  oceanAmbientTemp: number;
  boundaryLayerDeltaT: number;
  heatPlumeLengthMeters: number;
  systemCop: number; // Coefficient of Performance
  pueRating: number;
}

export interface UpwellingParams {
  heatOutputMw: number; // 10 MW to 300 MW (default 180)
  intakeDepthMeters: number; // 200m to 1400m (default 1000)
  pipeDiameterMeters: number; // 1.0m to 10.0m (default 6.0)
  dispersionMode: 'surface' | 'mesopelagic';
}

export interface UpwellingOutputs {
  upwellingVelocity: number; // m/s
  flowRate: number; // m^3/s
  nutrientTransport: number; // mol/s
  bloomSpreadRadius: number; // meters
  chlorophyllDensity: number; // mg/m^3
  hypoxiaRisk: 'nominal' | 'elevated' | 'critical';
  ecologicalStatus: string;
}

export interface AcousticScenario {
  id: string;
  name: string;
  pumpNoiseDb: number;
  attenuationShielding: boolean;
  benthicMountIsolation: boolean;
  frequencyRangeHz: string;
  impactZoneMeters: number;
  cetaceanDisturbanceScore: number;
}
