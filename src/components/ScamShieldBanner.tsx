'use client';

import React from 'react';
import { Language } from '@/types/scheme';
import { ShieldAlert, CheckCircle } from 'lucide-react';

interface ScamShieldProps {
  language: Language;
  theme?: 'dark' | 'light';
}

export const ScamShieldBanner: React.FC<ScamShieldProps> = ({ language, theme = 'dark' }) => {
  const isHi = language === 'hi';
  const isLight = theme === 'light';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 my-14">
      <div className={`rounded-3xl p-6 sm:p-7 relative overflow-hidden transition-all duration-300 ${
        isLight
          ? 'bg-amber-50/90 border-2 border-amber-300 shadow-md'
          : 'glass-panel border-amber-500/30'
      }`}>
        
        {/* Amber glow accent */}
        {!isLight && (
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />
        )}

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-start gap-3.5">
            <div className={`p-3 rounded-2xl shrink-0 border ${
              isLight
                ? 'bg-amber-100 text-amber-700 border-amber-300 shadow-xs'
                : 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
            }`}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className={`font-extrabold text-base sm:text-lg flex items-center gap-2 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                {isHi ? 'सतर्क नागरिक: फर्जी दलालों और फ्रॉड से बचें' : 'Citizen Safety: Zero Middlemen & Anti-Fraud Shield'}
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isLight
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  Official Advisory
                </span>
              </h4>
              <p className={`text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                {isHi
                  ? 'भारत सरकार की अधिकांश कल्याणकारी योजनाओं के लिए कोई अग्रिम रजिस्ट्रेशन फीस नहीं ली जाती। कभी भी किसी व्हाट्सएप लिंक पर ओटीपी या बैंक पासवर्ड साझा न करें।'
                  : 'Central and state welfare applications have ZERO hidden approval fees. Never share OTP or transfer money to private individuals claiming guaranteed scheme approval.'}
              </p>
            </div>
          </div>

          <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs font-bold shrink-0 ${
            isLight ? 'text-slate-800' : 'text-slate-300'
          }`}>
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
              isLight ? 'bg-white border-amber-200 shadow-xs' : 'bg-white/[0.04] border-white/[0.08]'
            }`}>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              Only .gov.in domains
            </span>
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
              isLight ? 'bg-white border-amber-200 shadow-xs' : 'bg-white/[0.04] border-white/[0.08]'
            }`}>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              Direct DBT to Bank
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
