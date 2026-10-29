'use client';

import React from 'react';
import { Language } from '@/types/scheme';
import { Mic, FileCheck, Languages, ShieldCheck, Sparkles, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenVoice: () => void;
  onOpenDocScanner: () => void;
  onOpenAdminHub?: () => void;
  pendingApprovalsCount?: number;
  totalUnlockedAmount: number;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  onOpenVoice,
  onOpenDocScanner,
  onOpenAdminHub,
  pendingApprovalsCount = 0,
  totalUnlockedAmount,
  theme = 'dark',
  onToggleTheme,
}) => {
  const isHi = language === 'hi';
  const isLight = theme === 'light';

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-2xl border-b transition-all ${
      isLight ? 'bg-white/95 border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)]' : 'bg-[#060913]/80 border-white/[0.08]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand & Tiranga 3D Emblem */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-400 to-emerald-500 text-slate-950 font-black text-xl shadow-[0_4px_16px_rgba(249,115,22,0.35)]">
            <span>GM</span>
            <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full animate-ping ${isLight ? 'bg-orange-500' : 'bg-amber-400'}`}></span>
            <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 border-2 rounded-full ${isLight ? 'bg-orange-500 border-white' : 'bg-amber-400 border-[#060913]'}`}></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-black text-xl tracking-tight bg-clip-text text-transparent ${
                isLight
                  ? 'bg-gradient-to-r from-orange-600 via-slate-900 to-emerald-600'
                  : 'bg-gradient-to-r from-orange-400 via-white to-emerald-400'
              }`}>
                GovMitra
              </span>
              <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                isLight
                  ? 'bg-orange-50 text-orange-700 border-orange-300 shadow-xs'
                  : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              }`}>
                AI 3D
              </span>
            </div>
            <p className={`text-[11px] font-semibold flex items-center gap-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <ShieldCheck className={`w-3 h-3 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
              {isHi ? 'राष्ट्रीय नागरिक कल्याण AI पोर्टल' : 'Next-Gen Welfare Intelligence'}
            </p>
          </div>
        </div>

        {/* Center / Right Controls in Tiranga Format */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Unlocked Benefit Pill (Crisp Tiranga format in Light Mode) */}
          <div className={`hidden md:flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold ${
            isLight
              ? 'bg-emerald-50/90 border border-emerald-300 text-slate-800 shadow-xs'
              : 'bg-emerald-950/40 border border-emerald-500/30 text-slate-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{isHi ? 'संभावित लाभ:' : 'Unlocked Aid:'}</span>
            <span className={`font-extrabold text-sm font-mono ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
              ₹{(totalUnlockedAmount / 1000).toLocaleString('en-IN')}k+
            </span>
          </div>

          {/* AI Document Scanner Trigger */}
          <button
            onClick={onOpenDocScanner}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer shadow-xs ${
              isLight
                ? 'bg-white text-slate-800 border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50'
                : 'bg-white/[0.04] border border-white/[0.1] text-slate-200 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300'
            }`}
          >
            <FileCheck className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
            <span className="hidden sm:inline">{isHi ? 'दस्तावेज़ स्कैनर' : 'Verify Docs'}</span>
          </button>

          {/* Admin Scheme Approval Trigger */}
          {onOpenAdminHub && (
            <button
              onClick={onOpenAdminHub}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer shadow-xs ${
                isLight
                  ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                  : 'bg-amber-500/15 border border-amber-500/35 text-amber-300 hover:bg-amber-500/25'
              }`}
              title="Admin AI Scheme Ingestion & Approval Portal"
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span className="hidden md:inline">{isHi ? 'स्कीम अप्रूवल' : 'Scheme Approval'}</span>
              {pendingApprovalsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 animate-pulse">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>
          )}

          {/* AI Voice Assistant Trigger (Vibrant Saffron-to-Amber Tiranga Button) */}
          <button
            onClick={onOpenVoice}
            className={`relative group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 cursor-pointer ${
              isLight
                ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:brightness-105 text-white shadow-[0_4px_16px_rgba(234,88,12,0.35)]'
                : 'bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 hover:brightness-110 text-slate-950 shadow-[0_0_25px_rgba(249,115,22,0.4)]'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLight ? 'bg-white' : 'bg-slate-900'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLight ? 'bg-white' : 'bg-slate-950'}`}></span>
            </span>
            <Mic className={`w-4 h-4 ${isLight ? 'text-white' : 'text-slate-950'}`} />
            <span>{isHi ? 'बोलकर पूछें' : 'Voice AI'}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => onLanguageChange(isHi ? 'en' : 'hi')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isLight
                ? 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 shadow-xs'
                : 'bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300'
            }`}
            title="Switch Language"
          >
            <Languages className={`w-3.5 h-3.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`} />
            <span>{isHi ? 'English' : 'हिंदी'}</span>
          </button>

          {/* Theme Switcher Toggle (Light ☀️ / Dark 🌙) */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                isLight
                  ? 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 shadow-xs'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08]'
              }`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span className="hidden sm:inline text-slate-200">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-blue-600" />
                  <span className="hidden sm:inline text-slate-800">Dark</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
