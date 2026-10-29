'use client';

import React from 'react';
import { Language } from '@/types/scheme';
import { Heart, ShieldCheck, Sparkles } from 'lucide-react';

interface FooterProps {
  language: Language;
  theme?: 'dark' | 'light';
}

export const Footer: React.FC<FooterProps> = ({ language, theme = 'dark' }) => {
  const isHi = language === 'hi';
  const isLight = theme === 'light';

  return (
    <footer className={`border-t backdrop-blur-2xl pt-14 pb-12 transition-colors duration-300 ${
      isLight ? 'border-slate-200 bg-white text-slate-800' : 'border-white/[0.08] bg-[#060913]/90'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b text-center md:text-left ${
          isLight ? 'border-slate-100' : 'border-white/[0.06]'
        }`}>
          
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className={`font-black text-xl tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>GovMitra AI</span>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                Hackathon 3D Edition
              </span>
            </div>
            <p className={`text-xs max-w-md font-medium leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {isHi
                ? 'नागरिक कल्याण को सुगम, पारदर्शी और तकनीक-सक्षम बनाने के लिए समर्पित 3D AI पहल।'
                : 'Next-generation citizen welfare access powered by Multimodal AI, Voice Intelligence & 3D Glassmorphic UX.'}
            </p>
          </div>

          <div className={`flex flex-wrap items-center justify-center gap-4 text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700 shadow-xs' : 'bg-white/[0.04] border-white/[0.08]'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Free & Open
            </span>
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700 shadow-xs' : 'bg-white/[0.04] border-white/[0.08]'
            }`}>
              <Sparkles className="w-4 h-4 text-amber-500" />
              Direct Benefit Transfer (DBT)
            </span>
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700 shadow-xs' : 'bg-white/[0.04] border-white/[0.08]'
            }`}>
              🇮🇳 Made for Digital India
            </span>
          </div>

        </div>

        <div className={`pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
          <p>
            © 2026 GovMitra AI. Scheme details derived from official gazette portals (myScheme.gov.in, pmkisan.gov.in, nha.gov.in).
          </p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian Citizens
          </p>
        </div>
      </div>
    </footer>
  );
};
