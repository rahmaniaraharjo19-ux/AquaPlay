import React from 'react';
import { ActiveView, DonationStats, CommunityAction } from '../types/game';
import { Flame, Droplets, ShieldCheck, ArrowRight, Plane, Waves, HelpCircle, Activity } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface HeroProps {
  stats: DonationStats;
  recentActions: CommunityAction[];
  onSelectGame: (view: ActiveView) => void;
  onOpenDonate: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  stats,
  recentActions,
  onSelectGame,
  onOpenDonate,
}) => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
          
          {/* Left Column: Mission & Action */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between z-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-medium text-stone-400">
                <span className="text-amber-400">Indonesian Karhutla Crisis</span>
                <span aria-hidden="true">·</span>
                <span>Water Bombing & Canal Rewetting</span>
                <span aria-hidden="true">·</span>
                <span className="text-cyan-400">100% Sponsor Backed</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-100 font-display leading-[1.15] text-balance">
                Play games. Quench peatland fires. Donate clean water.
              </h1>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Every mission completed, canal blocked, and quiz answered in TirtaFire unlocks real liters of water for frontline Manggala Agni crews and peatland rewetting infrastructure in Sumatra & Kalimantan.
              </p>
            </div>

            {/* Quick Actions & Partner Note */}
            <div className="pt-6 sm:pt-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onSelectGame('game-bomber');
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-semibold text-sm transition-colors cursor-pointer shadow-sm"
                >
                  <Plane className="w-4 h-4" />
                  <span>Play Sky Bomber</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onOpenDonate();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-medium text-sm transition-colors cursor-pointer"
                >
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span>Pledge Direct Water</span>
                </button>
              </div>

              <div className="text-xs text-stone-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Sponsors convert each 100 game points into 1L verified water directly supplied to peat dams & fire brigades.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Photography */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_karhutla_aerial_1793592398584.jpg"
              alt="Indonesian peatland canopy with water bombing relief aircraft at sunset"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Soft gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-stone-950/90 via-stone-950/30 to-transparent pointer-events-none" />
            
            {/* Floating context tag */}
            <div className="absolute bottom-4 right-4 bg-stone-950/80 backdrop-blur-md border border-stone-800 p-3 rounded-lg text-xs max-w-xs text-stone-300">
              <div className="font-semibold text-stone-100 flex items-center gap-1.5 mb-0.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Sebangau & Riau Peat Domes</span>
              </div>
              <p className="text-[11px] text-stone-400">
                Subterranean peat fires require deep saturation with high-pressure water probes and canal blocking.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* KPI Proof Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800">
          <div className="text-xs text-stone-400 mb-1 flex items-center justify-between">
            <span>Total Water Donated</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 tabular-nums">
            {stats.globalLiters.toLocaleString()} <span className="text-xs font-sans text-stone-400 font-normal">Liters</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Community & player donations</div>
        </div>

        <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800">
          <div className="text-xs text-stone-400 mb-1 flex items-center justify-between">
            <span>Peatland Protected</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums">
            {stats.peatHectaresProtected.toLocaleString()} <span className="text-xs font-sans text-stone-400 font-normal">Hectares</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Rewetted & firebreak zones</div>
        </div>

        <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800">
          <div className="text-xs text-stone-400 mb-1 flex items-center justify-between">
            <span>Canal Sluice Dams</span>
            <Waves className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-blue-400 tabular-nums">
            {stats.canalBlocksFunded.toLocaleString()} <span className="text-xs font-sans text-stone-400 font-normal">Blocks</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Sekat kanal timber dams</div>
        </div>

        <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800">
          <div className="text-xs text-stone-400 mb-1 flex items-center justify-between">
            <span>Frontline Firefighters</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 tabular-nums">
            {stats.brigadesHydrated.toLocaleString()} <span className="text-xs font-sans text-stone-400 font-normal">Crews</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Manggala Agni & MPA volunteers</div>
        </div>
      </section>

      {/* Interactive Game Selection Bento Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-100 font-display">
              Select Your Water Relief Mission
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm">
              Each action immediately triggers sponsored water donations credited to your impact balance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Game 1: Aerial Water Bomber */}
          <div 
            onClick={() => {
              soundEffects.playClick();
              onSelectGame('game-bomber');
            }}
            className="group cursor-pointer rounded-xl bg-stone-900/70 border border-stone-800 hover:border-cyan-500/50 transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 overflow-hidden bg-stone-950">
                <img
                  src="/src/assets/images/game_aerial_bomber_card_1793592399509.jpg"
                  alt="Aerial water bombing aircraft dousing fire"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-medium text-cyan-300 border border-cyan-500/30">
                  Action Arcade
                </div>
                <div className="absolute bottom-3 right-3 bg-stone-950/80 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-mono text-stone-300">
                  +10L per hotspot
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-base font-bold text-stone-100 group-hover:text-cyan-400 transition-colors">
                  Aerial Water Bomber
                </h3>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Pilot an amphibious water bomber over raging peat fronts. Scoop water from rivers and drop high-volume dousing payloads before fires spread to primary rainforest.
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="flex items-center justify-between text-xs font-semibold text-cyan-400 pt-3 border-t border-stone-800/80">
                <span>Start Flight Mission</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Game 2: Peatland Canal Rewetting */}
          <div 
            onClick={() => {
              soundEffects.playClick();
              onSelectGame('game-canal');
            }}
            className="group cursor-pointer rounded-xl bg-stone-900/70 border border-stone-800 hover:border-emerald-500/50 transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 overflow-hidden bg-stone-950">
                <img
                  src="/src/assets/images/game_canal_puzzle_card_1793592401141.jpg"
                  alt="Peatland canal waterways puzzle"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-medium text-emerald-300 border border-emerald-500/30">
                  Hydraulic Puzzle
                </div>
                <div className="absolute bottom-3 right-3 bg-stone-950/80 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-mono text-stone-300">
                  +25L per level
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-base font-bold text-stone-100 group-hover:text-emerald-400 transition-colors">
                  Canal Blocker & Rewetting
                </h3>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Rotate canal gates and sluice dams to direct natural water flow into dried-up peat domes. Saturate smoldering organic layers to prevent subterranean ignition.
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 pt-3 border-t border-stone-800/80">
                <span>Solve Canal Grid</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Game 3: Rapid Eco Quiz */}
          <div 
            onClick={() => {
              soundEffects.playClick();
              onSelectGame('game-trivia');
            }}
            className="group cursor-pointer rounded-xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/50 transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 overflow-hidden bg-stone-950">
                <img
                  src="/src/assets/images/firefighter_crew_portrait_1793592401376.jpg"
                  alt="Indonesian forest firefighter crew"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-medium text-amber-300 border border-amber-500/30">
                  Trivia & Knowledge
                </div>
                <div className="absolute bottom-3 right-3 bg-stone-950/80 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-mono text-stone-300">
                  +10L per correct
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-base font-bold text-stone-100 group-hover:text-amber-400 transition-colors">
                  Karhutla Crisis Quiz
                </h3>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Master the science of peat carbon sinks, Manggala Agni firefighting tactics, and haze mitigation. Inspired by Freerice: every correct answer funds 10 Liters of water.
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-400 pt-3 border-t border-stone-800/80">
                <span>Start Rapid Quiz</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Live Community Stream & Mission Proof */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Recent Activity Stream */}
        <div className="lg:col-span-7 rounded-xl bg-stone-900/60 border border-stone-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-stone-100">Live Community Impact Stream</h3>
            </div>
            <span className="text-[11px] text-stone-400">Updates every few seconds</span>
          </div>

          <div className="space-y-2.5">
            {recentActions.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-stone-950/60 border border-stone-800/80"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-200">{act.name}</span>
                    <span className="text-stone-500">from {act.location}</span>
                  </div>
                  <p className="text-stone-400 text-[11px]">{act.action}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="font-mono font-bold text-cyan-400 tabular-nums">+{act.liters} L</span>
                  <div className="text-[10px] text-stone-500">{act.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Why Water Matters for Peatland */}
        <div className="lg:col-span-5 rounded-xl bg-stone-900/60 border border-stone-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>Why Water is the Only Solution</span>
          </h3>

          <div className="space-y-3 text-xs text-stone-300 leading-relaxed">
            <p>
              Unlike standard forest fires that burn foliage above ground, <strong className="text-stone-100">Karhutla burns deep underground</strong> in thick beds of decomposed ancient peat.
            </p>
            <p>
              Without massive water saturation, subterranean embers can travel invisibly for weeks and re-emerge hundreds of meters away, blanketing cities in toxic yellow PM2.5 smoke.
            </p>
            <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-cyan-200">
              <span className="font-semibold">How your play helps:</span> Corporate green sponsors donate matching funds for fuel, portable water pumps, drilling shallow peat wells, and food supplies for local volunteer firefighter brigades.
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};
