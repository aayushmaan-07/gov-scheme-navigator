'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface ShowcaseItem {
  id: string;
  name: string;
  nameHindi: string;
  category: string;
  benefit: string;
  benefitHindi: string;
  imageUrl: string;
  badgeColor: string;
}

interface TirangaShowcaseProps {
  onSelectScheme: (id: string) => void;
  isHi: boolean;
  theme?: 'dark' | 'light';
}

export const TirangaSchemeShowcase: React.FC<TirangaShowcaseProps> = ({
  onSelectScheme,
  isHi,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [activeIndex, setActiveIndex] = useState(0);

  const showcaseItems: ShowcaseItem[] = [
    {
      id: 'pm-kisan',
      name: 'PM-KISAN',
      nameHindi: 'पीएम-किसान सम्मान निधि',
      category: 'कृषि एवं किसान (Agriculture)',
      benefit: '₹6,000 / yr Direct DBT Cash',
      benefitHindi: '₹6,000 / वर्ष सीधी बैंक सहायता',
      imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
      badgeColor: isLight
        ? 'border-orange-500/60 text-orange-700 bg-white shadow-xs'
        : 'border-orange-500/50 text-orange-300 bg-orange-950/40',
    },
    {
      id: 'ayushman-bharat',
      name: 'Ayushman Bharat',
      nameHindi: 'आयुष्मान भारत (PM-JAY)',
      category: 'स्वास्थ्य रक्षा (Healthcare)',
      benefit: '₹5,00,000 Free Hospital Cover',
      benefitHindi: '₹5 लाख मुफ्त अस्पताल इलाज',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      badgeColor: isLight
        ? 'border-emerald-600/60 text-emerald-700 bg-white shadow-xs'
        : 'border-emerald-500/50 text-emerald-300 bg-emerald-950/40',
    },
    {
      id: 'pm-surya-ghar',
      name: 'PM Surya Ghar',
      nameHindi: 'पीएम सूर्य घर मुफ्त बिजली',
      category: 'सौर ऊर्जा (Solar Energy)',
      benefit: '₹78,000 Subsidy + 300 Units Free',
      benefitHindi: '₹78,000 सब्सिडी + 300 यूनिट मुफ्त',
      imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=800&q=80',
      badgeColor: isLight
        ? 'border-amber-600/60 text-amber-700 bg-white shadow-xs'
        : 'border-amber-500/50 text-amber-300 bg-amber-950/40',
    },
    {
      id: 'post-matric-scholarship',
      name: 'Post-Matric Scholarship',
      nameHindi: 'पोस्ट-मैट्रिक छात्रवृत्ति',
      category: 'उच्च शिक्षा (Higher Education)',
      benefit: '100% Course Fee Reimbursement',
      benefitHindi: '100% कॉलेज फीस वापसी + मासिक भत्ता',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      badgeColor: isLight
        ? 'border-cyan-600/60 text-cyan-700 bg-white shadow-xs'
        : 'border-cyan-500/50 text-cyan-300 bg-cyan-950/40',
    },
    {
      id: 'pm-mudra',
      name: 'PM MUDRA Loan',
      nameHindi: 'प्रधानमंत्री मुद्रा योजना',
      category: 'व्यापार एवं स्वरोजगार (MSME)',
      benefit: 'Loans up to ₹20 Lakhs (No Collateral)',
      benefitHindi: '₹20 लाख तक बिना गारंटी लोन',
      imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
      badgeColor: isLight
        ? 'border-blue-600/60 text-blue-700 bg-white shadow-xs'
        : 'border-blue-500/50 text-blue-300 bg-blue-950/40',
    },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto my-6 px-4">
      
      {/* Tiranga Ambient Glows (Hidden in Light Mode to keep it crisp) */}
      {!isLight && (
        <>
          <div className="absolute -top-10 left-1/4 w-80 h-40 bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-10 right-1/4 w-80 h-40 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
        </>
      )}

      {/* Main Tiranga Showcase Frame */}
      <div
        className={`relative rounded-3xl overflow-hidden p-1 ${
          isLight
            ? 'bg-gradient-to-r from-orange-400/40 via-slate-200 to-emerald-400/40 shadow-xl border border-slate-200'
            : 'bg-gradient-to-r from-orange-500/40 via-white/20 to-emerald-500/40 shadow-[0_0_50px_rgba(249,115,22,0.15)]'
        }`}
      >
        <div
          className={`relative rounded-[22px] p-5 sm:p-7 overflow-hidden ${
            isLight ? 'bg-white/95 backdrop-blur-xl' : 'bg-[#0A101D]/90 backdrop-blur-2xl'
          }`}
        >
          {/* Header Row */}
          <div
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b ${
              isLight ? 'border-slate-200' : 'border-white/[0.08]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 rounded-full bg-orange-500 shadow-sm" />
              <span className={`flex h-3 w-3 rounded-full ${isLight ? 'bg-slate-300' : 'bg-white shadow-[0_0_10px_#ffffff]'}`} />
              <span className="flex h-3 w-3 rounded-full bg-emerald-500 shadow-sm" />
              <span
                className={`text-xs font-black uppercase tracking-widest ml-1 ${
                  isLight ? 'text-slate-800' : 'text-slate-200'
                }`}
              >
                {isHi ? 'सशक्त भारत की 3D योजना गैलरी' : 'Tiranga Scheme Showcase (Live Reel)'}
              </span>
            </div>

            <p className={`text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {isHi ? '👉 किसी भी कार्ड पर क्लिक करके योजना का लाभ देखें' : 'Click any photo to explore direct benefits'}
            </p>
          </div>

          {/* 3D Visual Cards Reel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {showcaseItems.map((item, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => {
                    setActiveIndex(idx);
                    onSelectScheme(item.id);
                  }}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${
                    isSelected
                      ? 'border-orange-500 shadow-lg ring-2 ring-orange-400/40'
                      : isLight
                      ? 'border-slate-200 hover:border-emerald-500 bg-white shadow-xs'
                      : 'border-white/[0.08] hover:border-emerald-400/50 bg-[#0D1527]'
                  }`}
                >
                  {/* Photo with Overlay Gradient */}
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 brightness-95 group-hover:brightness-100"
                      loading="lazy"
                    />
                    <div
                      className={`absolute inset-0 ${
                        isLight
                          ? 'bg-gradient-to-t from-white/95 via-white/30 to-transparent'
                          : 'bg-gradient-to-t from-[#0A101D] via-[#0A101D]/40 to-transparent'
                      }`}
                    />

                    {/* Top Category Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border backdrop-blur-md ${item.badgeColor}`}>
                        {item.name}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className={`p-3 ${isLight ? 'bg-white border-t border-slate-100' : 'bg-[#0D1527]/95'}`}>
                    <h5
                      className={`font-extrabold text-xs line-clamp-1 transition-colors ${
                        isLight
                          ? 'text-slate-900 group-hover:text-orange-600'
                          : 'text-white group-hover:text-emerald-300'
                      }`}
                    >
                      {isHi ? item.nameHindi : item.name}
                    </h5>
                    <p
                      className={`text-[11px] font-black mt-1 line-clamp-1 font-mono ${
                        isLight ? 'text-emerald-700' : 'text-emerald-400'
                      }`}
                    >
                      {isHi ? item.benefitHindi : item.benefit}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
