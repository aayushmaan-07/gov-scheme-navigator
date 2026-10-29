'use client';

import React, { useEffect, useState } from 'react';
import { Language } from '@/types/scheme';
import { TrendingUp, Sparkles, CheckCircle2, Award, Zap, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BenefitCounterProps {
  language: Language;
  totalAmount: number;
  schemeCount: number;
  onOpenDocScanner: () => void;
  theme?: 'dark' | 'light';
}

export const BenefitCounter: React.FC<BenefitCounterProps> = ({
  language,
  totalAmount,
  schemeCount,
  onOpenDocScanner,
  theme = 'dark',
}) => {
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const isHi = language === 'hi';
  const isLight = theme === 'light';

  useEffect(() => {
    const duration = 800;
    const steps = 25;
    const increment = totalAmount / steps;
    let current = 0;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      current += increment;
      if (stepCount >= steps) {
        setAnimatedAmount(totalAmount);
        clearInterval(timer);
      } else {
        setAnimatedAmount(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [totalAmount]);

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10B981', '#34D399', '#06B6D4', '#F59E0B'],
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
        isLight
          ? 'bg-white border-2 border-emerald-500/25 shadow-xl text-slate-900'
          : 'bg-gradient-to-br from-[#0A1224]/95 via-[#0A101D]/95 to-[#081622]/95 border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white backdrop-blur-2xl'
      }`}>
        
        {/* Soft Background Tiranga Glows (Saffron top-left, Emerald bottom-right) */}
        {!isLight ? (
          <>
            <div className="absolute top-0 left-0 w-80 h-80 bg-orange-500/[0.08] rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/[0.09] rounded-full blur-[90px] pointer-events-none" />
          </>
        ) : null}

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left: Total Monetary Potential HUD */}
          <div className="md:col-span-7">
            <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold mb-3 border ${
              isLight
                ? 'bg-orange-50 text-orange-800 border-orange-200 shadow-xs'
                : 'bg-orange-500/15 text-orange-300 border-orange-500/35 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isHi ? 'आपकी प्रोफाइल पर संभावित सरकारी सहायता' : 'Your Unlocked Welfare Potential'}</span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className={`text-4xl sm:text-6xl font-black tracking-tight font-mono ${
                isLight
                  ? 'text-emerald-600'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-300 drop-shadow-[0_2px_12px_rgba(16,185,129,0.3)]'
              }`}>
                ₹{animatedAmount.toLocaleString('en-IN')}
              </span>
              <span className={`text-sm sm:text-base font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                {isHi ? '/ कुल सहायता' : '/ Total Aid'}
              </span>
            </div>

            <p className={`text-xs sm:text-sm max-w-lg leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              {isHi
                ? `आपके द्वारा चुने गए मानदंडों के आधार पर आप ${schemeCount} योजनाओं के सीधे हकदार हैं।`
                : `Based on your profile, you qualify for ${schemeCount} direct benefits including cash transfers, free healthcare, and subsidies.`}
            </p>
          </div>

          {/* Right: 3D Holographic Action Bento */}
          <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
            
            <div className={`flex items-center justify-between p-4 rounded-2xl border backdrop-blur-xl ${
              isLight
                ? 'bg-slate-50 border-slate-200 shadow-xs'
                : 'bg-white/[0.04] border-white/[0.09] shadow-xs'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  isLight
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                }`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {isHi ? 'योग्य योजनाएं' : 'Matched Schemes'}
                  </p>
                  <p className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {schemeCount} {isHi ? 'योजनाएं सक्रिय' : 'Active Schemes'}
                  </p>
                </div>
              </div>

              <button
                onClick={triggerCelebration}
                className="px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 hover:brightness-110 text-slate-950 shadow-[0_4px_16px_rgba(249,115,22,0.35)]"
                title="Celebrate"
              >
                🎉 {isHi ? 'जश्न' : 'Celebrate'}
              </button>
            </div>

            {/* Document Readiness Quick Pill */}
            <button
              onClick={onOpenDocScanner}
              className={`flex items-center justify-between p-4 rounded-2xl border backdrop-blur-xl text-left transition-all duration-300 group cursor-pointer ${
                isLight
                  ? 'bg-orange-50/60 hover:bg-orange-50/90 border-orange-200/80 hover:border-orange-400 shadow-xs'
                  : 'bg-white/[0.04] hover:bg-white/[0.07] border-white/[0.09] hover:border-orange-500/50 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  isLight
                    ? 'bg-orange-100 text-orange-700 border-orange-200'
                    : 'bg-orange-500/20 text-orange-400 border-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.2)]'
                }`}>
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? 'text-orange-900 font-bold' : 'text-orange-400/90 font-bold'}`}>
                    {isHi ? 'दस्तावेज़ की तैयारी' : 'Document Readiness'}
                  </p>
                  <p className={`text-xs sm:text-sm font-bold transition-colors ${
                    isLight ? 'text-slate-800 group-hover:text-orange-700' : 'text-slate-100 group-hover:text-orange-300'
                  }`}>
                    {isHi ? 'Aadhaar व आय प्रमाण पत्र जांचें →' : 'Pre-flight check with Vision AI →'}
                  </p>
                </div>
              </div>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
