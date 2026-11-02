import React from 'react';
import { ActiveView } from '../types/game';
import { Droplets, Volume2, VolumeX, HeartHandshake } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface HeaderProps {
  currentView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  userLiters: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenDonate: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  userLiters,
  isMuted,
  onToggleMute,
  onOpenDonate,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onNavigate('home');
          }}
          className="text-left group cursor-pointer flex items-center gap-2.5 whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40 group-hover:bg-cyan-500/30 transition-colors">
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-stone-100 group-hover:text-cyan-400 transition-colors">
              TirtaFire
            </span>
          </div>
        </button>

        {/* Zone 2: Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
          <button
            onClick={() => {
              soundEffects.playClick();
              onNavigate('home');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-stone-100 transition-colors cursor-pointer ${
              currentView === 'home' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              onNavigate('game-bomber');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-stone-100 transition-colors cursor-pointer ${
              currentView === 'game-bomber' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Sky Bomber
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              onNavigate('game-canal');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-stone-100 transition-colors cursor-pointer ${
              currentView === 'game-canal' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Canal Rewetting
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              onNavigate('game-trivia');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-stone-100 transition-colors cursor-pointer ${
              currentView === 'game-trivia' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Eco Quiz
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              onNavigate('map');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-stone-100 transition-colors cursor-pointer ${
              currentView === 'map' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Hotspot Map
          </button>
        </nav>

        {/* Zone 3: Primary Action & Impact Counter */}
        <div className="flex items-center gap-3 shrink-0">
          {/* User's Session Liter Tally */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-300">
            <Droplets className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
            <span className="font-mono font-semibold text-cyan-300 tabular-nums">
              {userLiters.toLocaleString()} L
            </span>
            <span className="text-stone-500">earned</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenDonate();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Donate Water</span>
          </button>
        </div>

      </div>
    </header>
  );
};
