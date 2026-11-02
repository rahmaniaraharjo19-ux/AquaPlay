import React from 'react';
import { Droplets, ShieldCheck, Heart } from 'lucide-react';
import { ActiveView } from '../types/game';
import { soundEffects } from '../utils/audio';

interface FooterProps {
  onNavigate: (view: ActiveView) => void;
  onOpenDonate: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDonate }) => {
  return (
    <footer className="border-t border-stone-800 bg-stone-950 text-stone-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission Statement */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-stone-100 font-bold text-base font-display">
              <div className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Droplets className="w-3.5 h-3.5" />
              </div>
              <span>TirtaFire</span>
            </div>
            <p className="text-stone-400 leading-relaxed max-w-md">
              An interactive climate action gaming initiative uniting gamers, eco-sponsors, and field brigades to extinguish peatland wildfires (Karhutla) across Sumatra and Kalimantan through real water donations and canal rewetting.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Independent climate gaming project inspired by the Freerice model.</span>
            </div>
          </div>

          {/* Quick Interactive Games */}
          <div className="space-y-2.5">
            <div className="font-semibold text-stone-200">Interactive Games</div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onNavigate('game-bomber');
                  }}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Sky Bomber Flight Run
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onNavigate('game-canal');
                  }}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Canal Rewetting Sluice
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onNavigate('game-trivia');
                  }}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Karhutla Eco Quiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onNavigate('map');
                  }}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Surveillance Map
                </button>
              </li>
            </ul>
          </div>

          {/* Peat Fire Education & Partner Units */}
          <div className="space-y-2.5">
            <div className="font-semibold text-stone-200">Frontline Fire Brigades</div>
            <ul className="space-y-2 text-stone-400">
              <li>Manggala Agni (KLHK)</li>
              <li>Masyarakat Peduli Api (MPA)</li>
              <li>Badan Restorasi Gambut (BRGM)</li>
              <li>Borneo Orangutan Survival (BOSF)</li>
              <li>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onOpenDonate();
                  }}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Support Water Well Drilling →
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} TirtaFire Initiative. Dedicated to the preservation of Indonesian peat domes and rainforests.
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Every liter helps douse subterranean embers</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </div>
        </div>

      </div>
    </footer>
  );
};
