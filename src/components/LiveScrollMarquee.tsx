'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Zap, Award, CheckCircle } from 'lucide-react';

interface LiveScrollMarqueeProps {
  theme?: 'dark' | 'light';
}

export const LiveScrollMarquee: React.FC<LiveScrollMarqueeProps> = ({ theme = 'dark' }) => {
  const isLight = theme === 'light';

  const items = [
    { icon: '🌾', text: '₹3.2 Lakh Crore Direct DBT to 11 Crore Farmers (PM-KISAN)' },
    { icon: '🏥', text: '29,000+ Empanelled Hospitals for Free ₹5 Lakh Treatment (PM-JAY)' },
    { icon: '⚡', text: '₹78,000 Solar Subsidy & 300 Units Free Power (PM Surya Ghar)' },
    { icon: '🎓', text: '4.5 Crore Students Supported with Fee Reimbursement (NSP)' },
    { icon: '💼', text: '44 Crore Collateral-Free Loans Disbursed (PM MUDRA)' },
    { icon: '🛡️', text: 'Zero Middlemen • 100% Direct Aadhaar-Seeded Bank Transfer' },
  ];

  return (
    <div className={`w-full overflow-hidden border-y py-3.5 my-8 backdrop-blur-xl relative marquee-container ${
      isLight ? 'border-slate-200 bg-white/95 shadow-xs' : 'border-white/[0.08] bg-[#0A101D]/90'
    }`}>
      {/* Side Fade Gradient Masks */}
      <div className={`absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none marquee-fade-left ${
        isLight ? 'bg-gradient-to-r from-slate-50 to-transparent' : 'bg-gradient-to-r from-[#060913] to-transparent'
      }`} />
      <div className={`absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none marquee-fade-right ${
        isLight ? 'bg-gradient-to-l from-slate-50 to-transparent' : 'bg-gradient-to-l from-[#060913] to-transparent'
      }`} />

      <div className="flex gap-8 whitespace-nowrap animate-[marquee_28s_linear_infinite] hover:[animation-play-state:paused]">
        {[...items, ...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className={`inline-flex items-center gap-2.5 text-xs font-bold px-4 py-1.5 rounded-full border marquee-pill ${
              isLight
                ? 'text-slate-800 bg-white border-slate-200 shadow-xs'
                : 'text-slate-300 bg-white/[0.03] border-white/[0.06]'
            }`}
          >
            <span className="text-sm">{item.icon}</span>
            <span className="tracking-wide">{item.text}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-2" />
          </div>
        ))}
      </div>
    </div>
  );
};
