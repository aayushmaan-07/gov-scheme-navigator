'use client';

import React from 'react';
import { Language } from '@/types/scheme';
import { motion } from 'framer-motion';
import {
  Mic,
  ScanEye,
  Landmark,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
} from 'lucide-react';

interface HaloProcessTimelineProps {
  language: Language;
  onOpenVoice: () => void;
  onOpenDocScanner: () => void;
  theme?: 'dark' | 'light';
}

export const HaloProcessTimeline: React.FC<HaloProcessTimelineProps> = ({
  language,
  onOpenVoice,
  onOpenDocScanner,
  theme = 'dark',
}) => {
  const isHi = language === 'hi';
  const isLight = theme === 'light';

  const steps = [
    {
      stepNumber: '01',
      badgeColor: 'from-orange-500 to-amber-500',
      badgeBorder: isLight ? 'border-orange-300' : 'border-orange-500/40',
      glowShadow: isLight ? 'shadow-[0_4px_25px_rgba(249,115,22,0.08)]' : 'shadow-[0_0_35px_rgba(249,115,22,0.2)]',
      accentText: isLight ? 'text-orange-700' : 'text-orange-400',
      accentBg: isLight ? 'bg-orange-50' : 'bg-orange-500/10',
      icon: Mic,
      categoryHi: 'चरण 01 • स्मार्ट वॉयस AI',
      categoryEn: 'STEP 01 • SMART VOICE AI',
      titleHi: 'अपनी भाषा में बोलें, 10 सेकंड में योजनाएं पाएं',
      titleEn: 'Speak in Your Mother Tongue, Discover in 10s',
      descHi:
        'गांव के किसान हों या शहर के छात्र—माइक दबाकर सिर्फ अपनी जरूरत बोलें। AI तुरंत जटिल सरकारी नियमों को छानकर आपकी सटीक योजनाएं निकालता है।',
      descEn:
        'Whether you are a rural farmer or a college student—tap mic and describe your need. AI parses eligibility criteria to uncover tailored schemes.',
      pillTextHi: '100% मातृभाषा समर्थन',
      pillTextEn: 'Hindi, English & Dialects',
      actionLabelHi: 'आवाज़ से बोलकर देखें →',
      actionLabelEn: 'Try Voice Search →',
      onClick: onOpenVoice,
    },
    {
      stepNumber: '02',
      badgeColor: isLight ? 'from-slate-700 to-slate-900' : 'from-white via-slate-200 to-slate-400',
      badgeBorder: isLight ? 'border-slate-300' : 'border-white/40',
      glowShadow: isLight ? 'shadow-[0_4px_25px_rgba(0,0,0,0.06)]' : 'shadow-[0_0_35px_rgba(255,255,255,0.15)]',
      accentText: isLight ? 'text-slate-800' : 'text-slate-100',
      accentBg: isLight ? 'bg-slate-100' : 'bg-white/10',
      icon: ScanEye,
      categoryHi: 'चरण 02 • प्री-फ्लाइट विज़न OCR',
      categoryEn: 'STEP 02 • PRE-FLIGHT VISION OCR',
      titleHi: 'दफ्तर के चक्कर लगाने से पहले डॉक्यूमेंट्स चेक करें',
      titleEn: 'Zero-Rejection Pre-Flight Document Check',
      descHi:
        'तहसील, ब्लॉक या सीएससी के चक्कर काटने से पहले अपना आय प्रमाण पत्र, आधार या राशन कार्ड AI से स्कैन करवाएं। सरकारी सील व वैधता की तुरंत पुष्टि होती है।',
      descEn:
        'Before visiting block offices or CSCs, let AI pre-audit your income certificate, Aadhaar, or caste proof. Verifies digital seals and validity instantly.',
      pillTextHi: 'सीक्रेट व सुरक्षित (Device Side)',
      pillTextEn: '100% Client-Side Privacy',
      actionLabelHi: 'डॉक्यूमेंट स्कैन करें →',
      actionLabelEn: 'Verify Documents →',
      onClick: onOpenDocScanner,
    },
    {
      stepNumber: '03',
      badgeColor: 'from-emerald-500 to-teal-500',
      badgeBorder: isLight ? 'border-emerald-300' : 'border-emerald-500/40',
      glowShadow: isLight ? 'shadow-[0_4px_25px_rgba(16,185,129,0.08)]' : 'shadow-[0_0_35px_rgba(16,185,129,0.2)]',
      accentText: isLight ? 'text-emerald-700' : 'text-emerald-400',
      accentBg: isLight ? 'bg-emerald-50' : 'bg-emerald-500/10',
      icon: Landmark,
      categoryHi: 'चरण 03 • सीधा DBT ट्रांसफर',
      categoryEn: 'STEP 03 • DIRECT DBT BENEFIT',
      titleHi: 'बिना किसी दलाल के, सीधे बैंक खाते में पैसा पाएं',
      titleEn: 'Direct Bank Transfer With Zero Middlemen',
      descHi:
        'बिना किसी रिश्वत या बिचौलिए के, आधिकारिक .gov.in पोर्टल्स से 1-क्लिक में सीधा आवेदन करें। छात्रवृत्ति, सब्सिडी और सहायता सीधे आपके बैंक में पहुंचेगी।',
      descEn:
        'Zero bribes, zero middlemen (dalals). Apply directly to official .gov.in portals in 1 click. Welfare subsidies disburse straight to your Aadhaar-linked bank account.',
      pillTextHi: 'आधिकारिक DBT पोर्टल्स',
      pillTextEn: 'Direct DBT Linked',
      actionLabelHi: 'योजनाएं एक्सप्लोर करें ↓',
      actionLabelEn: 'Explore Schemes ↓',
      onClick: () => {
        const el = document.getElementById('schemes-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      
      {/* Background Subtle Geometric Halo Grid (Circle Website Signature) */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40 -z-10" />

      {/* Ambient Tricolor Diffused Halo Orbs */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-80 h-80 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header with Tiranga Badge */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 backdrop-blur-xl ${
            isLight
              ? 'bg-white border border-orange-300 shadow-[0_4px_15px_rgba(249,115,22,0.1)]'
              : 'bg-white/[0.04] border border-orange-500/30'
          }`}>
            <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-orange-600' : 'text-orange-400'}`} />
            <span className={`text-xs font-bold tracking-wide ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
              {isHi ? 'सरल 3-चरणीय जनकल्याण यात्रा' : 'The 3-Step Welfare Journey'}
            </span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 border border-emerald-500/40">
              Zero Dalal
            </span>
          </div>

          <h2 className={`text-2xl sm:text-4xl font-black tracking-tight leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {isHi ? (
              <>
                बिना किसी बिचौलिए के, <br />
                <span className={isLight ? "bg-gradient-to-r from-orange-600 via-slate-900 to-emerald-600 bg-clip-text text-transparent font-black" : "bg-gradient-to-r from-orange-400 via-white to-emerald-400 bg-clip-text text-transparent"}>
                  सीधे अपने बैंक खाते में लाभ पाएं
                </span>
              </>
            ) : (
              <>
                Zero Middlemen. Zero Confusion. <br />
                <span className={isLight ? "bg-gradient-to-r from-orange-600 via-slate-900 to-emerald-600 bg-clip-text text-transparent font-black" : "bg-gradient-to-r from-orange-400 via-white to-emerald-400 bg-clip-text text-transparent"}>
                  Direct Benefits in 3 Simple Steps
                </span>
              </>
            )}
          </h2>

          <p className={`mt-3 text-xs sm:text-sm leading-relaxed font-normal ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {isHi
              ? 'गोवमित्र एआई हर भारतीय नागरिक को सही योजना से जोड़ता है और आवेदन तक पूरी सुरक्षा प्रदान करता है।'
              : 'GovMitra AI eliminates bureaucratic confusion, verifies your eligibility, and connects you straight to DBT portals.'}
          </p>
        </div>

        {/* 3-Step Halo Cards Grid (Circle Website 01, 02, 03 Architecture) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Subtle Connecting Process Line on desktop */}
          <div className={`hidden md:block absolute top-14 left-[15%] right-[15%] h-[1px] pointer-events-none -z-1 ${
            isLight
              ? 'bg-gradient-to-r from-orange-400/30 via-slate-300 to-emerald-400/30'
              : 'bg-gradient-to-r from-orange-500/30 via-white/20 to-emerald-500/30'
          }`} />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -6 }}
                className={`group relative p-6 sm:p-7 rounded-3xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between ${step.glowShadow} ${
                  isLight
                    ? 'bg-white border border-slate-200/90 shadow-lg hover:border-slate-300'
                    : 'bg-[#090E17]/80 border border-white/[0.08] hover:border-white/25'
                }`}
              >
                <div>
                  {/* Top Bar: Circular Index Badge + Category */}
                  <div className="flex items-center justify-between mb-5">
                    
                    {/* Glowing Circular Number Badge (Signature Circle Feature) */}
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.badgeColor} p-[1px] shadow-lg`}
                    >
                      <div className={`w-full h-full rounded-[15px] flex items-center justify-center ${isLight ? 'bg-slate-50' : 'bg-[#0A101D]'}`}>
                        <span className={`text-base font-black font-mono tracking-tight group-hover:scale-110 transition-transform ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {step.stepNumber}
                        </span>
                      </div>
                    </div>

                    {/* Step Category Pill */}
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${step.accentBg} ${step.accentText} border ${step.badgeBorder}`}
                    >
                      {isHi ? step.categoryHi : step.categoryEn}
                    </span>
                  </div>

                  {/* Icon + Step Title */}
                  <div className="mb-3 flex items-start gap-3">
                    <div className={`p-2 rounded-xl ${step.accentBg} ${step.accentText} shrink-0 mt-0.5`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className={`text-base sm:text-lg font-black leading-snug transition-colors ${
                      isLight
                        ? 'text-slate-900 group-hover:text-orange-600'
                        : 'text-white group-hover:text-slate-100'
                    }`}>
                      {isHi ? step.titleHi : step.titleEn}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className={`text-xs sm:text-sm leading-relaxed font-normal mb-6 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {isHi ? step.descHi : step.descEn}
                  </p>
                </div>

                {/* Bottom Meta & Interactive Action Link */}
                <div className={`pt-4 flex items-center justify-between gap-2 border-t ${isLight ? 'border-slate-100' : 'border-white/[0.06]'}`}>
                  <span className={`text-[10px] font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${step.accentText}`} />
                    {isHi ? step.pillTextHi : step.pillTextEn}
                  </span>

                  <button
                    onClick={step.onClick}
                    className={`text-xs font-black ${step.accentText} hover:underline flex items-center gap-1 cursor-pointer group-hover:translate-x-0.5 transition-transform`}
                  >
                    <span>{isHi ? step.actionLabelHi : step.actionLabelEn}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
