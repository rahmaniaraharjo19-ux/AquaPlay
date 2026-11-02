import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AerialBomberGame } from './components/AerialBomberGame';
import { CanalPuzzleGame } from './components/CanalPuzzleGame';
import { TriviaGame } from './components/TriviaGame';
import { HotspotMap } from './components/HotspotMap';
import { DonationModal } from './components/DonationModal';
import { Footer } from './components/Footer';
import { ActiveView, DonationStats, CommunityAction } from './types/game';
import { INITIAL_COMMUNITY_ACTIONS } from './data/karhutlaData';
import { soundEffects } from './utils/audio';

export default function App() {
  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [isDonateOpen, setIsDonateOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Persistent user stats with sensible defaults
  const [stats, setStats] = useState<DonationStats>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tirtafire_stats');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return {
      userLiters: 0,
      globalLiters: 148290,
      totalGamesPlayed: 0,
      peatHectaresProtected: 842,
      brigadesHydrated: 36,
      canalBlocksFunded: 118,
    };
  });

  const [recentActions, setRecentActions] = useState<CommunityAction[]>(INITIAL_COMMUNITY_ACTIONS);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('tirtafire_stats', JSON.stringify(stats));
  }, [stats]);

  // Periodic simulated live community impact stream
  useEffect(() => {
    const playerNames = ['Budi Prasetyo', 'Nurul A.', 'Eko Wijaya', 'Clara Tan', 'Dimas Arya', 'Faisal R.', 'Maya S.'];
    const cities = ['Palangka Raya', 'Pekanbaru', 'Banjarmasin', 'Samarinda', 'Kuala Lumpur', 'Jakarta', 'Denpasar'];
    const activities = [
      'Extinguished 4 peat hotspots (+40L)',
      'Completed Stage 2 Canal Rewetting (+35L)',
      '5-streak trivia on Peat Carbon (+20L)',
      'Pledged 500L community water pack',
      'Extinguished deep embers at Sebangau (+10L)',
    ];

    const interval = setInterval(() => {
      const randomName = playerNames[Math.floor(Math.random() * playerNames.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomAct = activities[Math.floor(Math.random() * activities.length)];
      const litersAdded = Math.floor(Math.random() * 30) + 15;

      const newAction: CommunityAction = {
        id: Date.now().toString(),
        name: randomName,
        location: randomCity,
        liters: litersAdded,
        action: randomAct,
        timestamp: 'Just now',
      };

      setRecentActions((prev) => [newAction, ...prev.slice(0, 5)]);
      setStats((prev) => ({
        ...prev,
        globalLiters: prev.globalLiters + litersAdded,
      }));
    }, 14000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    soundEffects.isMuted = nextState;
  };

  const handleDonateEarned = (liters: number) => {
    setStats((prev) => ({
      ...prev,
      userLiters: prev.userLiters + liters,
      globalLiters: prev.globalLiters + liters,
      totalGamesPlayed: prev.totalGamesPlayed + 1,
      peatHectaresProtected: prev.peatHectaresProtected + (liters >= 25 ? 1 : 0),
    }));
  };

  const handleDirectDonationComplete = (liters: number) => {
    handleDonateEarned(liters);
    // Add to recent activity stream
    const newAction: CommunityAction = {
      id: Date.now().toString(),
      name: 'Generous Supporter',
      location: 'Online Pledge',
      liters,
      action: 'Direct Water Fund Contribution',
      timestamp: 'Just now',
    };
    setRecentActions((prev) => [newAction, ...prev.slice(0, 5)]);
  };

  const handleDeployWaterToRegion = (regionId: string, liters: number) => {
    if (stats.userLiters < liters) return;

    setStats((prev) => ({
      ...prev,
      userLiters: Math.max(prev.userLiters - liters, 0),
    }));

    const newAction: CommunityAction = {
      id: Date.now().toString(),
      name: 'You',
      location: 'Surveillance Dispatch',
      liters,
      action: `Airdropped water payload to ${regionId}`,
      timestamp: 'Just now',
    };
    setRecentActions((prev) => [newAction, ...prev.slice(0, 5)]);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      <div>
        {/* Top Bar */}
        <Header
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          userLiters={stats.userLiters}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenDonate={() => setIsDonateOpen(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-12">
          {currentView === 'home' && (
            <Hero
              stats={stats}
              recentActions={recentActions}
              onSelectGame={(view) => setCurrentView(view)}
              onOpenDonate={() => setIsDonateOpen(true)}
            />
          )}

          {currentView === 'game-bomber' && (
            <AerialBomberGame
              onBack={() => setCurrentView('home')}
              onDonateEarned={handleDonateEarned}
            />
          )}

          {currentView === 'game-canal' && (
            <CanalPuzzleGame
              onBack={() => setCurrentView('home')}
              onDonateEarned={handleDonateEarned}
            />
          )}

          {currentView === 'game-trivia' && (
            <TriviaGame
              onBack={() => setCurrentView('home')}
              onDonateEarned={handleDonateEarned}
            />
          )}

          {currentView === 'map' && (
            <HotspotMap
              onBack={() => setCurrentView('home')}
              userLiters={stats.userLiters}
              onDeployWaterToRegion={handleDeployWaterToRegion}
            />
          )}
        </main>
      </div>

      {/* Direct Donation & Impact Certificate Modal */}
      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        onDonationComplete={handleDirectDonationComplete}
      />

      {/* Footer */}
      <Footer
        onNavigate={(view) => setCurrentView(view)}
        onOpenDonate={() => setIsDonateOpen(true)}
      />
    </div>
  );
}
