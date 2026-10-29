'use client';

import React, { useState } from 'react';
import { Language } from '@/types/scheme';
import { TirangaSchemeShowcase } from './TirangaSchemeShowcase';
import { Search, Mic, ArrowRight, Loader2, Sparkles, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  language: Language;
  onSearch: (query: string) => void;
  onOpenVoice: () => void;
  onSelectPresetPersona: (personaKey: string) => void;
  activePersona: string;
  isSearching?: boolean;
  onSelectShowcaseScheme?: (schemeId: string) => void;
  theme?: 'dark' | 'light';
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onSearch,
  onOpenVoice,
  onSelectPresetPersona,
  activePersona,
  isSearching = false,
  onSelectShowcaseScheme,
  theme = 'dark',
}) => {
  const [searchInput, setSearchInput] = useState('');
  const isHi = language === 'hi';
  const isLight = theme === 'light';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const personas = [
    { key: 'all', labelEn: 'All Citizens', labelHi: 'सभी नागरिक', icon: '🇮🇳' },
    { key: 'farmer', labelEn: 'Farmer (Kisan)', labelHi: '🌾 किसान भाई', icon: '🌾' },
    { key: 'student', labelEn: 'Student / Youth', labelHi: '🎓 छात्र एवं युवा', icon: '🎓' },
    { key: 'business_owner', labelEn: 'Small Business', labelHi: '💼 छोटा व्यापारी', icon: '💼' },
    { key: 'artisan', labelEn: 'Artisan / Craftsman', labelHi: '🔨 कारीगर एवं शिल्पकार', icon: '🔨' },
    { key: 'women', labelEn: 'Women & Families', labelHi: '👩‍💼 महिला एवं परिवार', icon: '👩‍💼' },
    { key: 'solar', labelEn: 'Free Solar Electricity', labelHi: '⚡ मुफ्त सोलर बिजली', icon: '⚡' },
  ];

  const sampleSearchQueries = [
    { text: '2 acre zameen kisan loan', label: '🌾 2 acre zameen kisan loan' },
    { text: 'College scholarship SC OBC', label: '🎓 College scholarship' },
    { text: 'Chhat par solar panel subsidy', label: '⚡ Solar panel subsidy' },
    { text: 'Dukan kholne ke liye Mudra loan', label: '💼 Dukan loan' },
  ];

  const handleChipClick = (text: string) => {
    setSearchInput(text);
    onSearch(text);
  };

  return (
    <section className="relative pt-8 pb-8 md:pt-14 md:pb-14 overflow-hidden">
      
      {/* Authentic Indian Flag (Tiranga) Ambient Glows */}
      <div className={`absolute top-10 left-10 sm:left-1/4 w-[450px] h-[350px] rounded-full blur-[140px] -z-10 pointer-events-none ${
        isLight ? 'bg-orange-500/[0.12]' : 'bg-orange-500/15'
      }`} />
      <div className={`absolute top-20 right-10 sm:right-1/4 w-[450px] h-[350px] rounded-full blur-[140px] -z-10 pointer-events-none ${
        isLight ? 'bg-emerald-500/[0.12]' : 'bg-emerald-500/15'
      }`} />

      {/* Circle Website Signature: Orbital Chakra Rotating Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[720px] h-[520px] sm:h-[720px] -z-10 pointer-events-none flex items-center justify-center">
        {/* Outer Dashed Orbit Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
          className={`w-full h-full rounded-full border border-dashed ${isLight ? 'border-orange-500/15' : 'border-orange-500/20'}`}
        />

        {/* Middle Glowing Tiranga Gradient Orbit Ring with Particle nodes */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 45, ease: 'linear' }}
          className={`absolute w-[82%] h-[82%] rounded-full border ${isLight ? 'border-emerald-600/15' : 'border-emerald-500/20'}`}
        >
          {/* Micro Orbital Nodes */}
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_12px_#f97316]"></span>
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]"></span>
          <span className={`absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${isLight ? 'bg-slate-400' : 'bg-white shadow-[0_0_10px_#ffffff]'}`}></span>
          <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#38bdf8]"></span>
        </motion.div>

        {/* Inner Core Ambient Pulse */}
        <div className={`absolute w-[50%] h-[50%] rounded-full ${isLight ? 'bg-gradient-to-tr from-orange-500/5 via-slate-200/20 to-emerald-500/5' : 'bg-gradient-to-tr from-orange-500/10 via-white/[0.04] to-emerald-500/10'} blur-[90px] animate-pulse pointer-events-none`} />
      </div>

      {/* Circle Website Signature: Floating Trust Badges (Hidden on mobile, floating on desktop) */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className={`hidden 2xl:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl backdrop-blur-xl absolute top-12 left-10 text-left z-20 pointer-events-none ${
          isLight
            ? 'bg-white/95 border border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.06)]'
            : 'bg-black/60 border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
        }`}
      >
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 font-black font-mono">
          ₹
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Direct DBT</p>
          <p className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>₹4.2 Lakh Cr+ Transferred</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut', delay: 0.5 }}
        className={`hidden 2xl:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl backdrop-blur-xl absolute bottom-28 left-12 text-left z-20 pointer-events-none ${
          isLight
            ? 'bg-white/95 border border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.06)]'
            : 'bg-black/60 border border-orange-500/40 shadow-[0_0_25px_rgba(249,115,22,0.2)]'
        }`}
      >
        <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-600 text-sm">
          🛡️
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-orange-600 tracking-wider">Zero Dalals</p>
          <p className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>100% Free Public Access</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.2 }}
        className={`hidden 2xl:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl backdrop-blur-xl absolute top-16 right-10 text-left z-20 pointer-events-none ${
          isLight
            ? 'bg-white/95 border border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.06)]'
            : 'bg-black/60 border border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.2)]'
        }`}
      >
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 text-sm">
          ⚡
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Pre-Flight OCR</p>
          <p className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>99.4% Seal Check Accuracy</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.8 }}
        className={`hidden 2xl:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl backdrop-blur-xl absolute bottom-32 right-12 text-left z-20 pointer-events-none ${
          isLight
            ? 'bg-white/95 border border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.06)]'
            : 'bg-black/60 border border-blue-500/40 shadow-[0_0_25px_rgba(59,130,246,0.2)]'
        }`}
      >
        <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-600 text-sm">
          🇮🇳
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-blue-600 tracking-wider">National Coverage</p>
          <p className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>12+ Central & State Schemes</p>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
        
        {/* Tricolor National Welfare Trust Badge */}
        <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-6 backdrop-blur-xl ${
          isLight
            ? 'bg-white border border-orange-300 shadow-[0_4px_15px_rgba(249,115,22,0.1)]'
            : 'bg-white/[0.04] border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.15)]'
        }`}>
          <span className="flex h-2.5 w-2.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-300 to-emerald-500"></span>
          <span className={`text-xs font-bold tracking-wide ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
            {isHi ? 'भारत सरकार की जनकल्याणकारी योजनाओं का AI मार्गदर्शक' : 'Digital India • Direct Benefit Transfer • Zero Middlemen'}
          </span>
          <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-emerald-500 text-slate-950">
            Gov Verified
          </span>
        </div>

        {/* Tiranga Gradient Headline */}
        <h1 className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] mb-5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {isHi ? (
            <>
              हर भारतीय नागरिक का हक, <br />
              <span className={isLight ? "bg-gradient-to-r from-orange-600 via-slate-900 to-emerald-600 bg-clip-text text-transparent font-black" : "bg-gradient-to-r from-orange-400 via-white to-emerald-400 bg-clip-text text-transparent"}>
                सीधे आपके बैंक खाते में।
              </span>
            </>
          ) : (
            <>
              Unlock Your Govt Benefits <br />
              <span className={isLight ? "bg-gradient-to-r from-orange-600 via-slate-900 to-emerald-600 bg-clip-text text-transparent font-black" : "bg-gradient-to-r from-orange-400 via-white to-emerald-400 bg-clip-text text-transparent"}>
                in 30 Seconds with AI.
              </span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className={`max-w-2xl mx-auto text-sm sm:text-base mb-6 leading-relaxed font-normal ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          {isHi
            ? 'अपनी जरूरत या काम बताएं। AI तुरंत आपकी पात्रता जांचकर बताएगा कि सरकार से कौनसी मदद और पैसे मिल सकते हैं।'
            : 'Answer 3 simple questions or speak in your own language. Our AI calculates your eligible subsidies, cash aid, and document checklist instantly.'}
        </p>

        {/* Cyber Neon Search Bar with Tricolor Glow */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-4 relative">
          <div className={`relative flex items-center rounded-2xl p-2 transition-all duration-300 ${
            isLight
              ? 'bg-white border-2 border-slate-300 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] focus-within:border-orange-500 focus-within:shadow-[0_0_25px_rgba(249,115,22,0.2)]'
              : 'glass-panel focus-within:border-orange-400/80 focus-within:shadow-[0_0_30px_rgba(249,115,22,0.25)]'
          }`}>
            <Search className={`w-5 h-5 ml-3 shrink-0 ${isLight ? 'text-orange-600' : 'text-orange-400'}`} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={
                isHi
                  ? 'उदा. "2 acre zameen kisan loan" या "कॉलेज फीस स्कॉलरशिप"'
                  : 'e.g. "I have 2 acres land and need loan" or "Scholarship for college"'
              }
              className={`w-full px-3 py-2 text-sm sm:text-base placeholder-slate-400 bg-transparent outline-none font-medium ${
                isLight ? 'text-slate-900' : 'text-slate-100'
              }`}
            />
            
            {/* Embedded Mic Button */}
            <button
              type="button"
              onClick={onOpenVoice}
              title={isHi ? 'बोलकर खोजें' : 'Speak to search'}
              className={`p-2.5 rounded-xl transition-all shrink-0 mr-1 cursor-pointer ${
                isLight
                  ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-100'
                  : 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/20'
              }`}
            >
              <Mic className={`w-5 h-5 animate-pulse ${isLight ? 'text-orange-600' : 'text-orange-400'}`} />
            </button>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSearching}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-slate-950 text-xs sm:text-sm font-black transition-all shrink-0 shadow-[0_0_20px_rgba(249,115,22,0.3)] cursor-pointer disabled:opacity-60"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>{isHi ? 'AI खोज रहा है...' : 'Searching...'}</span>
                </>
              ) : (
                <>
                  <span>{isHi ? 'खोजें' : 'Explore'}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* 1-Click Search Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-2xl mx-auto mb-6 text-xs">
          <span className={`text-[11px] font-medium mr-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {isHi ? 'त्वरित उदाहरण:' : 'Try:'}
          </span>
          {sampleSearchQueries.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(chip.text)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-xs ${
                isLight
                  ? 'bg-white hover:bg-orange-50 text-orange-800 border border-slate-200 hover:border-orange-300'
                  : 'bg-white/[0.04] hover:bg-orange-500/20 text-orange-300 border border-white/[0.08] hover:border-orange-500/40'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Persona Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto mb-6">
          {personas.map((p) => {
            const isSelected = activePersona === p.key;
            return (
              <button
                key={p.key}
                onClick={() => onSelectPresetPersona(p.key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-105'
                    : isLight
                    ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 shadow-xs'
                    : 'glass-panel text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-white'
                }`}
              >
                <span>{p.icon}</span>
                <span>{isHi ? p.labelHi : p.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* REAL PROJECT SCHEME PHOTOS SHOWCASE (TIRANGA GALLERY) */}
        {/* ======================================================== */}
        <TirangaSchemeShowcase
          isHi={isHi}
          theme={theme}
          onSelectScheme={(id) => {
            if (onSelectShowcaseScheme) {
              onSelectShowcaseScheme(id);
            }
          }}
        />

      </div>
    </section>
  );
};
