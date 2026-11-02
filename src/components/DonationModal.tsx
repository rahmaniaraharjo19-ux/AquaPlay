import React, { useState } from 'react';
import { X, Droplets, HeartHandshake, CheckCircle2, Award, ShieldCheck, Download, Share2 } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonationComplete: (liters: number) => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  onDonationComplete,
}) => {
  const [tier, setTier] = useState<number>(15);
  const [customLiters, setCustomLiters] = useState<number>(1800);
  const [donorName, setDonorName] = useState<string>('');
  const [step, setStep] = useState<'form' | 'certificate'>('form');
  const [certificateId, setCertificateId] = useState<string>('');

  if (!isOpen) return null;

  const handleSelectTier = (amount: number, liters: number) => {
    soundEffects.playClick();
    setTier(amount);
    setCustomLiters(liters);
  };

  const handleProcessDonation = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playSuccess();
    soundEffects.playWaterSplash();
    const certNum = `TF-${Math.floor(100000 + Math.random() * 900000)}`;
    setCertificateId(certNum);
    onDonationComplete(customLiters);
    setStep('certificate');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-lg w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'form' ? (
          <form onSubmit={handleProcessDonation} className="space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
                <HeartHandshake className="w-4 h-4" />
                <span>Verified Peatland Water Fund</span>
              </div>
              <h3 className="text-xl font-bold text-stone-100 font-display">
                Pledge Water for Karhutla Brigades
              </h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Fund high-pressure pump water, canal rewetting dams, and hydration gear for frontline Manggala Agni and volunteer MPA crews.
              </p>
            </div>

            {/* Donation Packages */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSelectTier(5, 500)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  tier === 5
                    ? 'bg-cyan-950/60 border-cyan-400 text-stone-100'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="text-sm font-bold text-cyan-400">$5 USD</div>
                <div className="font-mono text-xs font-semibold text-stone-200 mt-1">500 Liters</div>
                <div className="text-[10px] text-stone-500 mt-0.5">Hydration kit</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTier(15, 1800)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  tier === 15
                    ? 'bg-cyan-950/60 border-cyan-400 text-stone-100'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="text-sm font-bold text-cyan-400">$15 USD</div>
                <div className="font-mono text-xs font-semibold text-stone-200 mt-1">1,800 Liters</div>
                <div className="text-[10px] text-stone-500 mt-0.5">1 Canal Block</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTier(50, 7500)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  tier === 50
                    ? 'bg-cyan-950/60 border-cyan-400 text-stone-100'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="text-sm font-bold text-cyan-400">$50 USD</div>
                <div className="font-mono text-xs font-semibold text-stone-200 mt-1">7,500 Liters</div>
                <div className="text-[10px] text-stone-500 mt-0.5">Tanker Airdrop</div>
              </button>
            </div>

            {/* Custom Donor Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">
                Donor Name / Alias (for impact certificate)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maria Kusuma"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-cyan-400 placeholder:text-stone-600"
              />
            </div>

            {/* Allocation breakdown */}
            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold text-stone-200">
                <span>Immediate Water Deployment:</span>
                <span className="font-mono text-cyan-400 tabular-nums">+{customLiters.toLocaleString()} Liters</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Directly deployed to Sebangau & Bengkalis canal rewetting dams and mobile high-pressure peat injection lances.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-bold text-xs transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <Droplets className="w-4 h-4" />
              <span>Confirm & Issue Water Certificate</span>
            </button>
          </form>
        ) : (
          /* Certificate Presentation */
          <div className="space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/40">
              <Award className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-stone-100 font-display">
                Water Donation Verified!
              </h3>
              <p className="text-stone-300 text-xs">
                Thank you, {donorName || 'Eco Guardian'}, for quenching the fires of Sumatra and Kalimantan.
              </p>
            </div>

            {/* Official Impact Certificate Card */}
            <div className="p-5 rounded-xl bg-stone-950 border border-cyan-500/40 text-left space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-[11px] text-stone-400 border-b border-stone-800 pb-2">
                <span>TIRTAFIRE PEATLAND DEFENSE</span>
                <span className="font-mono text-cyan-400">{certificateId}</span>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-stone-500">Recognized Guardian</div>
                <div className="text-base font-bold text-stone-100">{donorName || 'Anonymous Champion'}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[10px] text-stone-500">Volume Deployed</div>
                  <div className="font-mono font-bold text-cyan-400">{customLiters.toLocaleString()} Liters</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500">Mission Target</div>
                  <div className="font-medium text-stone-300">Riau & Sebangau Peat Domes</div>
                </div>
              </div>

              <div className="text-[10px] text-stone-400 pt-2 border-t border-stone-800/80 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Verified alongside Manggala Agni and BRGM field units</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  onClose();
                  setStep('form');
                }}
                className="flex-1 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
