'use client';

import React, { useState } from 'react';
import { Scheme, Language } from '@/types/scheme';
import { ArrowUpRight, CheckCircle2, FileText, Volume2, VolumeX, Sparkles, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SchemeCardProps {
  scheme: Scheme;
  language: Language;
  onOpenDetails: (scheme: Scheme) => void;
  onVerifyDocs: (scheme: Scheme) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  language,
  onOpenDetails,
  onVerifyDocs,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const isHi = language === 'hi';

  const categoryBadgeColors: Record<string, string> = {
    'Agriculture': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    'Healthcare': 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    'Business & Startup': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    'Education': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    'Housing & Energy': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    'Social Security': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    'Artisans & Crafts': 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  };

  const badgeClass =
    categoryBadgeColors[scheme.category] || 'bg-slate-500/20 text-slate-300 border-slate-500/40';

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = isHi
        ? `${scheme.nameHindi}। लाभ: ${scheme.benefitAmountDisplayHindi}। किसे मिलेगा: ${scheme.eli5.whoGetsItHindi}।`
        : `${scheme.name}. Benefit: ${scheme.benefitAmountDisplay}. Who qualifies: ${scheme.eli5.whoGetsIt}.`;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = isHi ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative rounded-3xl glass-panel hover:border-orange-500/50 hover:shadow-[0_0_35px_rgba(249,115,22,0.18)] flex flex-col justify-between overflow-hidden"
    >
      {/* Real High-Resolution Project Scheme Photo Header */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={scheme.imageUrl}
          alt={scheme.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';
          }}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 brightness-[0.88] group-hover:brightness-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1527] via-[#0D1527]/50 to-transparent scheme-card-image-overlay" />
        
        {/* Category Badge Floating on Image */}
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md scheme-card-category-badge ${badgeClass}`}>
            {isHi ? scheme.categoryHindi : scheme.category}
          </span>
        </div>

        {/* Audio Speaker & Match Pill Floating on Image */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleToggleAudio}
            className={`p-1.5 rounded-lg border backdrop-blur-md transition-all cursor-pointer scheme-card-audio-btn ${
              isPlayingAudio
                ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.6)] animate-pulse'
                : 'bg-black/40 hover:bg-orange-500/30 text-slate-200 border-white/20'
            }`}
            title={isHi ? 'योजना का विवरण आवाज़ में सुनें' : 'Listen to scheme audio'}
          >
            {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-500/40 scheme-card-matched-pill">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            {isHi ? 'योग्य' : 'Matched'}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Scheme Title */}
          <h3 className="font-extrabold text-white text-lg group-hover:text-orange-300 transition-colors leading-snug mb-1.5">
            {isHi ? scheme.nameHindi : scheme.name}
          </h3>

          {/* Ministry */}
          <p className="text-[11px] text-slate-400 font-medium mb-3.5 line-clamp-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            {isHi ? scheme.ministryHindi : scheme.ministry}
          </p>

          {/* Direct Benefit Highlight Tag */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-emerald-500/30 mb-4 shadow-inner scheme-benefit-box">
            <p className="text-[10px] font-black uppercase text-emerald-400 tracking-wider mb-0.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {isHi ? 'सीधा सरकारी आर्थिक लाभ' : 'Direct Financial Benefit'}
            </p>
            <p className="text-sm font-black text-white font-mono">
              {isHi ? scheme.benefitAmountDisplayHindi : scheme.benefitAmountDisplay}
            </p>
          </div>

          {/* ELI5 Summary */}
          <div className="space-y-1.5 mb-4 text-xs text-slate-300 leading-relaxed">
            <p className="flex items-start gap-1.5">
              <span className="shrink-0 text-orange-400 font-bold">🎯</span>
              <span className="line-clamp-2">
                <strong className="text-white font-bold">{isHi ? 'किसे: ' : 'Who: '}</strong>
                {isHi ? scheme.eli5.whoGetsItHindi : scheme.eli5.whoGetsIt}
              </span>
            </p>
            <p className="flex items-start gap-1.5">
              <span className="shrink-0 text-emerald-400 font-bold">📄</span>
              <span>
                <strong className="text-white font-bold">{isHi ? 'कागज़: ' : 'Docs: '}</strong>
                {scheme.documentsRequired.map(d => isHi ? d.nameHindi : d.name).slice(0, 2).join(', ')}
                {scheme.documentsRequired.length > 2 && ' + aur'}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center gap-2">
          <button
            onClick={() => onOpenDetails(scheme)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-slate-950 text-xs font-black transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] cursor-pointer"
          >
            <span>{isHi ? 'पूरी जानकारी देखें' : 'View Guidelines'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-950" />
          </button>

          <button
            onClick={() => onVerifyDocs(scheme)}
            title={isHi ? 'कागजात जांचें' : 'Check required documents'}
            className="p-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:border-emerald-400 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 transition-all cursor-pointer scheme-card-doc-btn"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
