'use client';

import React, { useState } from 'react';
import { Scheme, Language } from '@/types/scheme';
import { X, ExternalLink, Share2, Check, Phone, AlertTriangle, FileCheck2, Building2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SchemeDrawerProps {
  scheme: Scheme | null;
  language: Language;
  onClose: () => void;
  onOpenDocScanner: () => void;
  theme?: 'dark' | 'light';
}

export const SchemeDrawer: React.FC<SchemeDrawerProps> = ({
  scheme,
  language,
  onClose,
  onOpenDocScanner,
  theme = 'dark',
}) => {
  const [copied, setCopied] = useState(false);
  const isHi = language === 'hi';
  const isLight = theme === 'light';

  if (!scheme) return null;

  const handleShareWhatsApp = () => {
    const text = isHi
      ? `🏛️ *${scheme.nameHindi}*\n\n💰 *लाभ:* ${scheme.benefitAmountDisplayHindi}\n\n📄 *ज़रूरी दस्तावेज़:*\n${scheme.documentsRequired.map(d => `• ${d.nameHindi}`).join('\n')}\n\n🌐 *आधिकारिक पोर्टल:* ${scheme.applicationUrl}\n\n(GovMitra AI द्वारा सत्यापित)`
      : `🏛️ *${scheme.name}*\n\n💰 *Benefit:* ${scheme.benefitAmountDisplay}\n\n📄 *Required Documents:*\n${scheme.documentsRequired.map(d => `• ${d.name}`).join('\n')}\n\n🌐 *Official Portal:* ${scheme.applicationUrl}\n\n(Verified by GovMitra AI)`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyChecklist = () => {
    const text = isHi
      ? `${scheme.nameHindi}\nलाभ: ${scheme.benefitAmountDisplayHindi}\nकागजात: ${scheme.documentsRequired.map(d => d.nameHindi).join(', ')}\nलिंक: ${scheme.applicationUrl}`
      : `${scheme.name}\nBenefit: ${scheme.benefitAmountDisplay}\nDocs: ${scheme.documentsRequired.map(d => d.name).join(', ')}\nLink: ${scheme.applicationUrl}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-end transition-colors ${
          isLight ? 'bg-slate-900/40 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-md'
        }`}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className={`relative w-full max-w-2xl h-full flex flex-col overflow-y-auto drawer-content transition-colors ${
            isLight
              ? 'bg-[#FCFDFE] text-slate-900 border-l border-slate-200/90 shadow-[-20px_0_60px_rgba(0,0,0,0.15)]'
              : 'bg-[#0A101D] text-slate-100 border-l border-white/[0.1] shadow-[-20px_0_60px_rgba(0,0,0,0.8)]'
          }`}
        >
          {/* Subtle Ambient Tiranga Corner Tints for Drawer (Saffron top-left, Emerald bottom-right) */}
          {isLight && (
            <>
              <div className="absolute top-0 left-0 w-80 h-80 bg-orange-500/[0.08] rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/[0.08] rounded-full blur-[100px] pointer-events-none" />
            </>
          )}

          {/* Top Sticky Header */}
          <div
            className={`sticky top-0 z-20 px-6 py-4 border-b flex items-center justify-between transition-colors ${
              isLight
                ? 'bg-white/95 backdrop-blur-2xl border-slate-200/90 shadow-2xs'
                : 'bg-[#0A101D]/90 backdrop-blur-2xl border-white/[0.08]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isLight ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'}`}></span>
              <span
                className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                  isLight
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {isHi ? scheme.categoryHindi : scheme.category}
              </span>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isLight
                  ? 'text-slate-600 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200'
                  : 'text-slate-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08]'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scheme Photo Hero Banner */}
          <div className="relative h-60 w-full overflow-hidden shrink-0">
            <img
              src={scheme.imageUrl}
              alt={scheme.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-cover object-center brightness-90"
            />
            {/* Dark gradient overlay so white text on top of image is 100% visible and vivid in both light & dark mode */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />
            
            <div className="absolute bottom-5 left-6 right-6 z-10">
              <h2
                className="text-2xl sm:text-3xl font-black !text-white leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] drawer-photo-title"
                style={{ color: '#ffffff' }}
              >
                {isHi ? scheme.nameHindi : scheme.name}
              </h2>
              <p
                className="text-xs !text-slate-100 font-bold flex items-center gap-1.5 mt-1.5 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] drawer-photo-subtitle"
                style={{ color: '#f1f5f9' }}
              >
                <Building2 className="w-4 h-4 text-orange-400 shrink-0" />
                {isHi ? scheme.ministryHindi : scheme.ministry}
              </p>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 space-y-6 flex-1 relative z-10">
            
            {/* Benefit Box (Fresh Emerald Glass in Light, Glowing Glass in Dark) */}
            <div
              className={`p-5 rounded-2xl transition-all drawer-benefit-box ${
                isLight
                  ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 border-2 border-emerald-400/90 shadow-md text-emerald-950'
                  : 'bg-emerald-950/40 border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] text-white'
              }`}
            >
              <span
                className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                  isLight ? 'text-emerald-700' : 'text-emerald-400'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {isHi ? 'सीधा आर्थिक लाभ विवरण' : 'Financial Aid Details'}
              </span>
              <p
                className={`text-xl sm:text-2xl font-black mt-1.5 font-mono ${
                  isLight ? 'text-emerald-950' : 'text-white'
                }`}
              >
                {isHi ? scheme.benefitAmountDisplayHindi : scheme.benefitAmountDisplay}
              </p>
            </div>

            {/* ELI5 3-Step Plain Language Explanation (Tiranga Triad: Saffron ➔ Emerald ➔ Ashok Blue) */}
            <div
              className={`rounded-2xl p-5 space-y-4 transition-all drawer-breakdown-card ${
                isLight
                  ? 'bg-slate-50/90 border border-slate-200/90 shadow-2xs'
                  : 'bg-white/[0.03] border border-white/[0.08]'
              }`}
            >
              <h4
                className={`text-xs font-black uppercase tracking-wider ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {isHi ? 'योजना का सरल विवरण (ELI10 Summary)' : 'Simplified Scheme Breakdown'}
              </h4>

              <div className="space-y-3.5 text-xs sm:text-sm">
                {/* 1. Saffron Card: Who qualifies */}
                <div
                  className={`p-4 rounded-xl transition-all drawer-breakdown-item ${
                    isLight
                      ? 'bg-orange-50/95 border-2 border-orange-200/90 shadow-2xs'
                      : 'bg-black/30 border border-white/[0.05]'
                  }`}
                >
                  <strong
                    className={`block mb-1 font-black ${
                      isLight ? 'text-orange-950 text-xs sm:text-sm' : 'text-white'
                    }`}
                  >
                    🎯 {isHi ? 'किसे मिलेगा (Eligibility):' : 'Who qualifies:'}
                  </strong>
                  <p
                    className={`leading-relaxed text-xs ${
                      isLight ? 'text-orange-950/90 font-medium' : 'text-slate-300'
                    }`}
                  >
                    {isHi ? scheme.eli5.whoGetsItHindi : scheme.eli5.whoGetsIt}
                  </p>
                </div>

                {/* 2. Emerald Card: What you receive */}
                <div
                  className={`p-4 rounded-xl transition-all drawer-breakdown-item ${
                    isLight
                      ? 'bg-emerald-50/95 border-2 border-emerald-200/90 shadow-2xs'
                      : 'bg-black/30 border border-white/[0.05]'
                  }`}
                >
                  <strong
                    className={`block mb-1 font-black ${
                      isLight ? 'text-emerald-950 text-xs sm:text-sm' : 'text-white'
                    }`}
                  >
                    💰 {isHi ? 'क्या मिलेगा (What you get):' : 'What you receive:'}
                  </strong>
                  <p
                    className={`leading-relaxed text-xs ${
                      isLight ? 'text-emerald-950/90 font-medium' : 'text-slate-300'
                    }`}
                  >
                    {isHi ? scheme.eli5.whatYouGetHindi : scheme.eli5.whatYouGet}
                  </p>
                </div>

                {/* 3. Ashok Blue Card: How to apply */}
                <div
                  className={`p-4 rounded-xl transition-all drawer-breakdown-item ${
                    isLight
                      ? 'bg-blue-50/95 border-2 border-blue-200/90 shadow-2xs'
                      : 'bg-black/30 border border-white/[0.05]'
                  }`}
                >
                  <strong
                    className={`block mb-1 font-black ${
                      isLight ? 'text-blue-950 text-xs sm:text-sm' : 'text-white'
                    }`}
                  >
                    ⚡ {isHi ? 'आवेदन कैसे करें (Application Path):' : 'How to apply:'}
                  </strong>
                  <p
                    className={`leading-relaxed text-xs ${
                      isLight ? 'text-blue-950/90 font-medium' : 'text-slate-300'
                    }`}
                  >
                    {isHi ? scheme.eli5.howToApplyHindi : scheme.eli5.howToApply}
                  </p>
                </div>
              </div>
            </div>

            {/* Required Documents Checklist */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4
                  className={`text-xs font-black uppercase tracking-wider ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {isHi ? 'ज़रूरी दस्तावेज़ (Checklist)' : 'Required Documents'}
                </h4>
                <button
                  onClick={onOpenDocScanner}
                  className={`text-xs font-bold underline cursor-pointer transition-colors ${
                    isLight ? 'text-emerald-600 hover:text-emerald-700' : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  {isHi ? 'AI स्कैनर से जांचें →' : 'Verify with Vision AI →'}
                </button>
              </div>

              <div className="space-y-2.5">
                {scheme.documentsRequired.map((doc, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start justify-between gap-3 p-3.5 rounded-xl transition-all drawer-doc-item ${
                      isLight
                        ? 'bg-white border-2 border-slate-200/90 hover:border-emerald-400 hover:shadow-xs shadow-2xs'
                        : 'bg-white/[0.03] border border-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <FileCheck2
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isLight ? 'text-emerald-600' : 'text-emerald-400'
                        }`}
                      />
                      <div>
                        <p
                          className={`text-xs font-bold ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          {isHi ? doc.nameHindi : doc.name}
                        </p>
                        <p
                          className={`text-[11px] leading-tight mt-0.5 ${
                            isLight ? 'text-slate-600' : 'text-slate-400'
                          }`}
                        >
                          {doc.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        doc.isMandatory
                          ? isLight
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : isLight
                          ? 'bg-slate-100 text-slate-700 border border-slate-200'
                          : 'bg-white/[0.08] text-slate-300'
                      }`}
                    >
                      {doc.isMandatory ? (isHi ? 'अनिवार्य' : 'Mandatory') : (isHi ? 'वैकल्पिक' : 'Optional')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scam Prevention Alert */}
            <div
              className={`p-4 rounded-2xl flex items-start gap-3 transition-all drawer-scam-box ${
                isLight
                  ? 'bg-amber-50/95 border-2 border-amber-300 text-amber-950 shadow-2xs'
                  : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
              }`}
            >
              <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
              <div>
                <p className={`text-xs font-black ${isLight ? 'text-amber-950' : 'text-amber-300'}`}>
                  {isHi ? 'सुरक्षा चेतावनी (Anti-Fraud Shield)' : 'Anti-Scam Protection'}
                </p>
                <p className={`text-xs mt-0.5 leading-relaxed font-medium ${isLight ? 'text-amber-950/90' : 'text-slate-300'}`}>
                  {isHi ? scheme.scamWarningHindi : scheme.scamWarning}
                </p>
              </div>
            </div>

            {/* Helpline */}
            {scheme.helplineNumber && (
              <div
                className={`flex items-center gap-2 text-xs font-semibold p-3.5 rounded-xl transition-all drawer-helpline-box ${
                  isLight
                    ? 'bg-white border-2 border-slate-200/90 text-slate-700 shadow-2xs'
                    : 'bg-white/[0.02] border border-white/[0.06] text-slate-400'
                }`}
              >
                <Phone className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                <span>{isHi ? 'आधिकारिक टोल-फ्री हेल्पलाइन:' : 'Official Helpline:'}</span>
                <span className={`font-black font-mono text-sm ${isLight ? 'text-emerald-700' : 'text-white'}`}>
                  {scheme.helplineNumber}
                </span>
              </div>
            )}

          </div>

          {/* Sticky Bottom Actions Bar */}
          <div
            className={`sticky bottom-0 p-4 sm:p-6 flex flex-wrap items-center gap-3 transition-colors z-20 drawer-bottom-bar ${
              isLight
                ? 'bg-white/95 backdrop-blur-2xl border-t border-slate-200/90 shadow-[-4px_0_20px_rgba(0,0,0,0.06)]'
                : 'bg-[#0A101D] border-t border-white/[0.08]'
            }`}
          >
            <a
              href={scheme.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 hover:brightness-105 text-slate-950 text-xs sm:text-sm font-black transition-all shadow-[0_4px_16px_rgba(249,115,22,0.35)]"
            >
              <span>{isHi ? 'आधिकारिक पोर्टल पर जाएं' : 'Open Official Portal'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={handleShareWhatsApp}
              className={`flex items-center gap-1.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isLight
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-400/80 shadow-2xs'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
              title="Share checklist on WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span>{isHi ? 'WhatsApp' : 'Share'}</span>
            </button>

            <button
              onClick={handleCopyChecklist}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-2xs'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-200'
              }`}
              title="Copy checklist"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <span className="text-xs font-bold">📋</span>}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
