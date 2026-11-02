import React, { useState } from 'react';
import { HOTSPOT_REGIONS } from '../data/karhutlaData';
import { HotspotRegion } from '../types/game';
import { Flame, Droplets, MapPin, ShieldAlert, ArrowLeft, Send, CheckCircle2, Waves } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface HotspotMapProps {
  onBack: () => void;
  userLiters: number;
  onDeployWaterToRegion: (regionId: string, liters: number) => void;
}

export const HotspotMap: React.FC<HotspotMapProps> = ({
  onBack,
  userLiters,
  onDeployWaterToRegion,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<HotspotRegion>(HOTSPOT_REGIONS[0]);
  const [deployedSuccess, setDeployedSuccess] = useState<boolean>(false);
  const [islandFilter, setIslandFilter] = useState<'All' | 'Sumatra' | 'Kalimantan'>('All');

  const filteredRegions = HOTSPOT_REGIONS.filter((r) =>
    islandFilter === 'All' ? true : r.island === islandFilter
  );

  const handleDeployWater = () => {
    if (userLiters <= 0) return;
    soundEffects.playWaterSplash();
    onDeployWaterToRegion(selectedRegion.id, Math.min(userLiters, 50));
    setDeployedSuccess(true);
    setTimeout(() => setDeployedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-stone-900 border border-stone-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEffects.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-300 hover:text-stone-100 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Mission Hub</span>
          </button>
          <div className="h-4 w-px bg-stone-700 hidden sm:block" />
          <div>
            <h2 className="text-base font-bold text-stone-100 font-display">
              Indonesian Peatland Hotspot Surveillance Map
            </h2>
            <div className="text-xs text-stone-400">
              Live Satellite & Ground Patrol Sensor Sync · Sumatra & Kalimantan
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-1 p-1 bg-stone-950 rounded-lg border border-stone-800 text-xs">
          {(['All', 'Sumatra', 'Kalimantan'] as const).map((island) => (
            <button
              key={island}
              onClick={() => {
                soundEffects.playClick();
                setIslandFilter(island);
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                islandFilter === island
                  ? 'bg-stone-800 text-cyan-400 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {island}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Map Visual Area (SVG Map representation) */}
        <div className="lg:col-span-7 bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-stone-400 pb-2 border-b border-stone-800">
            <span className="font-semibold text-stone-200">Active Fire & Moisture Telemetry</span>
            <span>Click any hotspot pin to inspect</span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full h-[380px] bg-stone-950/90 rounded-xl border border-stone-800/80 p-4 flex items-center justify-center overflow-hidden">
            {/* Background Archipelagic Grid */}
            <svg
              viewBox="0 0 700 360"
              className="w-full h-full select-none"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
            >
              {/* Ocean backdrop lines */}
              <defs>
                <pattern id="seaGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="700" height="360" fill="url(#seaGrid)" />

              {/* Simplified stylized outline of Sumatra */}
              <path
                d="M 80 70 L 150 90 L 220 180 L 260 250 L 240 280 L 190 270 L 140 210 L 90 140 Z"
                fill="#162019"
                stroke="#2a3f30"
                strokeWidth="1.5"
              />
              <text x="140" y="170" fill="#475569" fontSize="12" fontWeight="bold">SUMATRA</text>

              {/* Simplified stylized outline of Kalimantan */}
              <path
                d="M 330 110 L 460 90 L 520 150 L 500 240 L 420 260 L 340 220 L 320 160 Z"
                fill="#162019"
                stroke="#2a3f30"
                strokeWidth="1.5"
              />
              <text x="400" y="170" fill="#475569" fontSize="12" fontWeight="bold">KALIMANTAN</text>

              {/* Hotspot Markers */}
              {HOTSPOT_REGIONS.map((region) => {
                // Approximate coordinate mapping to SVG viewbox
                let cx = 170;
                let cy = 130;

                if (region.id === 'riau-bengkalis') { cx = 170; cy = 130; }
                if (region.id === 'kalteng-sebangau') { cx = 410; cy = 210; }
                if (region.id === 'sumsel-oki') { cx = 220; cy = 240; }
                if (region.id === 'kalbar-ketapang') { cx = 360; cy = 190; }
                if (region.id === 'jambi-muarojambi') { cx = 190; cy = 190; }

                const isSelected = selectedRegion.id === region.id;

                return (
                  <g
                    key={region.id}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedRegion(region);
                    }}
                  >
                    {/* Pulsing ring for extreme risk */}
                    {region.riskLevel === 'Extreme' && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? 22 : 16}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="1.5"
                        className="animate-ping opacity-60"
                      />
                    )}

                    {/* Outer selection ring */}
                    {isSelected && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="18"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />
                    )}

                    {/* Marker circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="10"
                      fill={region.riskLevel === 'Extreme' ? '#dc2626' : region.riskLevel === 'High' ? '#ea580c' : '#eab308'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    {/* Hotspot count inside marker */}
                    <text
                      x={cx}
                      y={cy + 4}
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {region.activeFires}
                    </text>

                    {/* Label below */}
                    <text
                      x={cx}
                      y={cy + 22}
                      fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                      fontSize="10"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      textAnchor="middle"
                    >
                      {region.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend */}
            <div className="absolute bottom-3 left-3 bg-stone-900/90 backdrop-blur-sm border border-stone-800 p-2 rounded-lg text-[11px] text-stone-300 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                <span>Extreme Fire Danger (Moisture &lt; 25%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span>High Alert (Moisture 25–35%)</span>
              </div>
            </div>
          </div>

          {/* Quick Region Selector List */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredRegions.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedRegion(r);
                }}
                className={`p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                  selectedRegion.id === r.id
                    ? 'bg-stone-800 border-cyan-400 text-stone-100'
                    : 'bg-stone-950/60 border-stone-800/80 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="font-semibold truncate">{r.name}</div>
                <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                  <span className="text-rose-400 font-mono">{r.activeFires} fires</span>
                  <span>·</span>
                  <span>{r.province}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Region Detail Inspector & Water Deployment */}
        <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            
            <div className="flex items-start justify-between pb-3 border-b border-stone-800">
              <div>
                <div className="text-xs text-stone-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{selectedRegion.province}, {selectedRegion.island}</span>
                </div>
                <h3 className="text-xl font-bold text-stone-100 font-display mt-0.5">
                  {selectedRegion.name}
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                selectedRegion.riskLevel === 'Extreme'
                  ? 'bg-rose-950/80 border border-rose-500 text-rose-300'
                  : 'bg-amber-950/80 border border-amber-500 text-amber-300'
              }`}>
                {selectedRegion.riskLevel} Risk
              </span>
            </div>

            {/* Vital Sensors */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                <div className="text-stone-400 mb-1 flex items-center justify-between">
                  <span>Peat Moisture</span>
                  <Waves className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-xl font-mono font-bold text-cyan-400 tabular-nums">
                  {selectedRegion.peatMoisture}%
                </div>
                <div className="text-[10px] text-stone-500">Critical below 30%</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                <div className="text-stone-400 mb-1 flex items-center justify-between">
                  <span>Active Hotspots</span>
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div className="text-xl font-mono font-bold text-rose-400 tabular-nums">
                  {selectedRegion.activeFires}
                </div>
                <div className="text-[10px] text-stone-500">Confirmed by MODIS/VIIRS</div>
              </div>
            </div>

            {/* Water Target Progress */}
            <div className="space-y-2 p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Canal Rewetting & Hydration Target:</span>
                <span className="font-mono text-cyan-300 font-bold tabular-nums">
                  {selectedRegion.waterProvidedLiters.toLocaleString()} / {selectedRegion.waterNeededLiters.toLocaleString()} L
                </span>
              </div>
              <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (selectedRegion.waterProvidedLiters / selectedRegion.waterNeededLiters) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="text-[11px] text-stone-500 flex items-center justify-between">
                <span>Assigned Unit: {selectedRegion.brigadeUnit}</span>
                <span>{Math.round((selectedRegion.waterProvidedLiters / selectedRegion.waterNeededLiters) * 100)}% Funded</span>
              </div>
            </div>

            {/* Peat Soil Vulnerability Notice */}
            <div className="p-3 rounded-lg bg-stone-950/60 border border-stone-800/80 text-xs text-stone-300 space-y-1">
              <div className="font-semibold text-stone-200">Site Assessment:</div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Deep drainage canals have dried out peat up to 3 meters below the surface. High risk of long-distance smoldering haze without steady water flooding.
              </p>
            </div>

          </div>

          {/* Action Zone: Deploy Water to this sector */}
          <div className="pt-4 border-t border-stone-800 space-y-3">
            {deployedSuccess ? (
              <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Water successfully allocated to {selectedRegion.name}!</span>
              </div>
            ) : (
              <button
                onClick={handleDeployWater}
                disabled={userLiters <= 0}
                className={`w-full py-3 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  userLiters > 0
                    ? 'bg-cyan-400 hover:bg-cyan-300 text-stone-950 shadow-md'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {userLiters > 0
                    ? `Channel 50L Earned Water to ${selectedRegion.name.split(' ')[0]}`
                    : 'Play Games to Earn Water for This Region'}
                </span>
              </button>
            )}

            <div className="text-[11px] text-stone-400 text-center">
              Available from your gameplay: <strong className="text-cyan-300 font-mono">{userLiters} Liters</strong>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
