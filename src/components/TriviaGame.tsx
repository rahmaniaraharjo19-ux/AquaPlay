import React, { useState } from 'react';
import { TRIVIA_QUESTIONS, SPONSORS_INFO } from '../data/karhutlaData';
import { TriviaQuestion } from '../types/game';
import { ArrowLeft, Droplets, CheckCircle, XCircle, Sparkles, Award, Globe, BookOpen } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface TriviaGameProps {
  onBack: () => void;
  onDonateEarned: (liters: number) => void;
}

export const TriviaGame: React.FC<TriviaGameProps> = ({
  onBack,
  onDonateEarned,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [totalEarnedInQuiz, setTotalEarnedInQuiz] = useState<number>(0);
  const [language, setLanguage] = useState<'en' | 'id'>('en');

  const question: TriviaQuestion = TRIVIA_QUESTIONS[currentIndex % TRIVIA_QUESTIONS.length];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === question.correctIndex;

    if (isCorrect) {
      soundEffects.playSuccess();
      const currentStreak = streak + 1;
      setStreak(currentStreak);

      // Multiplier bonus for streaks
      let reward = question.waterRewardLiters;
      if (currentStreak >= 5) {
        reward += 10; // +20L
      } else if (currentStreak >= 3) {
        reward += 5; // +15L
      }

      setTotalEarnedInQuiz((prev) => prev + reward);
      onDonateEarned(reward);
    } else {
      soundEffects.playError();
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    soundEffects.playClick();
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const currentOptions = language === 'en' ? question.optionsEn : question.optionsId;
  const currentQuestionText = language === 'en' ? question.questionEn : question.questionId;
  const currentExplanation = language === 'en' ? question.explanationEn : question.explanationId;

  // Active sponsor matching rotation
  const sponsor = SPONSORS_INFO[currentIndex % SPONSORS_INFO.length];

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
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
          <h2 className="text-base font-bold text-stone-100 font-display">
            Karhutla Rapid Eco Quiz
          </h2>
        </div>

        {/* Language switch & streak badge */}
        <div className="flex items-center gap-3 text-xs">
          {/* Language Toggle */}
          <div className="flex items-center rounded-lg bg-stone-950 p-1 border border-stone-800">
            <button
              onClick={() => {
                soundEffects.playClick();
                setLanguage('en');
              }}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                language === 'en' ? 'bg-cyan-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setLanguage('id');
              }}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                language === 'id' ? 'bg-cyan-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Bahasa Indonesia
            </button>
          </div>

          {/* Streak indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-stone-400">Streak:</span>
            <span className="font-mono font-bold text-amber-400 tabular-nums">{streak}</span>
          </div>
        </div>
      </div>

      {/* Main Quiz Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-stone-900 border border-stone-800 space-y-6 shadow-xl relative overflow-hidden">
        
        {/* Freerice Water Jar Tally */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Question {currentIndex + 1}</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-300 font-medium">{question.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold">
              <Droplets className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              <span>+{totalEarnedInQuiz}L Donated</span>
            </div>
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-bold text-stone-100 leading-snug">
            {currentQuestionText}
          </h3>
        </div>

        {/* Multiple Choice Options */}
        <div className="grid grid-cols-1 gap-3">
          {currentOptions.map((opt, idx) => {
            let btnStyle = 'bg-stone-950/70 border-stone-800 hover:border-stone-700 text-stone-200';

            if (isAnswered) {
              if (idx === question.correctIndex) {
                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
              } else if (idx === selectedOption) {
                btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
              } else {
                btnStyle = 'bg-stone-950/40 border-stone-800 text-stone-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`p-4 rounded-xl border text-left text-xs sm:text-sm transition-all duration-150 flex items-center justify-between cursor-pointer select-none ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-stone-800 text-stone-400 font-mono text-xs flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {isAnswered && idx === question.correctIndex && (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                )}
                {isAnswered && idx === selectedOption && idx !== question.correctIndex && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Button */}
        {isAnswered && (
          <div className="space-y-4 pt-2">
            <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
              selectedOption === question.correctIndex
                ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
                : 'bg-stone-950/80 border-stone-800 text-stone-300'
            }`}>
              <div className="font-bold flex items-center gap-1.5">
                {selectedOption === question.correctIndex ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Correct! +{streak >= 3 ? question.waterRewardLiters + (streak >= 5 ? 10 : 5) : question.waterRewardLiters}L water donated</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Incorrect — Keep learning to protect peatlands!</span>
                  </>
                )}
              </div>
              <p className="text-stone-400 text-xs">{currentExplanation}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-stone-400">
                Sponsored by: <strong className="text-stone-300">{sponsor.name}</strong> ({sponsor.type})
              </div>

              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                Next Question →
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Freerice Mechanism Note */}
      <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 text-xs text-stone-400 space-y-1">
        <div className="font-semibold text-stone-200 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>How Freerice-Style Water Donations Work</span>
        </div>
        <p className="leading-relaxed">
          When you answer questions, our eco-corporate partners and philantropic climate pools match each correct answer by funding clean water delivery, water bladder transport, and well-drilling supplies for Manggala Agni and volunteer MPA brigades across Riau and Central Kalimantan.
        </p>
      </div>

    </div>
  );
};
