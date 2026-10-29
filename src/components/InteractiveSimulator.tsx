'use client';

import React from 'react';
import { CitizenProfile, Language, Occupation, Category } from '@/types/scheme';
import { STATES_LIST } from '@/data/schemes';
import { SlidersHorizontal, RotateCcw, User, Briefcase, MapPin, IndianRupee, Sparkles } from 'lucide-react';

interface SimulatorProps {
  language: Language;
  profile: CitizenProfile;
  onChange: (updated: Partial<CitizenProfile>) => void;
  onReset: () => void;
  theme?: 'dark' | 'light';
}

export const InteractiveSimulator: React.FC<SimulatorProps> = ({
  language,
  profile,
  onChange,
  onReset,
  theme = 'dark',
}) => {
  const isHi = language === 'hi';
  const isLight = theme === 'light';

  const occupations: { key: Occupation; labelEn: string; labelHi: string }[] = [
    { key: 'all', labelEn: 'All', labelHi: 'सभी' },
    { key: 'farmer', labelEn: 'Farmer', labelHi: 'किसान' },
    { key: 'student', labelEn: 'Student', labelHi: 'छात्र' },
    { key: 'business_owner', labelEn: 'Business', labelHi: 'व्यापारी' },
    { key: 'daily_wager', labelEn: 'Worker/Vendor', labelHi: 'मजदूर/रेहड़ी' },
    { key: 'artisan', labelEn: 'Artisan', labelHi: 'कारीगर' },
  ];

  const categories: { key: Category; labelEn: string; labelHi: string }[] = [
    { key: 'all', labelEn: 'All', labelHi: 'सभी' },
    { key: 'general', labelEn: 'General', labelHi: 'सामान्य' },
    { key: 'obc', labelEn: 'OBC', labelHi: 'ओबीसी' },
    { key: 'sc', labelEn: 'SC', labelHi: 'एससी' },
    { key: 'st', labelEn: 'ST', labelHi: 'एसटी' },
    { key: 'minority', labelEn: 'Minority', labelHi: 'अल्पसंख्यक' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
      <div className={`rounded-3xl p-6 sm:p-7 transition-all duration-300 ${
        isLight
          ? 'bg-white border border-slate-200 shadow-xl text-slate-900'
          : 'bg-gradient-to-b from-[#0A1224]/95 via-[#0A101D]/95 to-[#081622]/95 border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl text-white'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between pb-5 border-b mb-6 ${isLight ? 'border-slate-100' : 'border-white/[0.08]'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${
              isLight
                ? 'bg-orange-100 text-orange-700 border-orange-200 shadow-xs'
                : 'bg-orange-500/20 text-orange-400 border-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.25)]'
            }`}>
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-extrabold text-base sm:text-lg flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {isHi ? 'पात्रता सिमुलेटर' : 'Eligibility Simulator'}
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                  isLight
                    ? 'bg-orange-50 text-orange-800 border-orange-300'
                    : 'bg-gradient-to-r from-orange-500/20 to-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  Real-time
                </span>
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {isHi ? 'स्लाइडर बदलें और देखें कौन सी योजनाएं आपके लिए खुलती हैं' : 'Adjust sliders to see live qualification updates'}
              </p>
            </div>
          </div>

          <button
            onClick={onReset}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isLight
                ? 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200'
                : 'text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08]'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isHi ? 'रीसेट करें' : 'Reset'}</span>
          </button>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. Age Slider (Saffron Accent) */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isLight
              ? 'bg-slate-50/80 border-slate-200/90 hover:border-orange-400'
              : 'bg-white/[0.03] border-white/[0.07] hover:border-orange-500/40'
          }`}>
            <div className="flex justify-between items-center mb-2">
              <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                <User className={`w-3.5 h-3.5 ${isLight ? 'text-orange-600' : 'text-orange-400'}`} />
                {isHi ? 'उम्र (Age)' : 'Age'}
              </span>
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-md font-mono border ${
                isLight
                  ? 'bg-orange-100 border-orange-300 text-orange-900'
                  : 'bg-orange-500/20 border-orange-500/40 text-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.2)]'
              }`}>
                {profile.age} {isHi ? 'वर्ष' : 'yrs'}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={85}
              value={profile.age}
              onChange={(e) => onChange({ age: Number(e.target.value) })}
              className="w-full cursor-pointer accent-orange-500"
            />
            <div className={`flex justify-between text-[10px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400 font-medium'}`}>
              <span>1 yr (Child)</span>
              <span>18 (Youth)</span>
              <span>60+ (Senior)</span>
            </div>
          </div>

          {/* 2. Annual Income Slider (India Green Accent) */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isLight
              ? 'bg-slate-50/80 border-slate-200/90 hover:border-emerald-500/50'
              : 'bg-white/[0.03] border-white/[0.07] hover:border-emerald-500/40'
          }`}>
            <div className="flex justify-between items-center mb-2">
              <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                <IndianRupee className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                {isHi ? 'पारिवारिक वार्षिक आय' : 'Annual Income'}
              </span>
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-md font-mono border ${
                isLight
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
              }`}>
                ₹{(profile.annualIncome / 1000).toLocaleString('en-IN')}k
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={800000}
              step={25000}
              value={profile.annualIncome}
              onChange={(e) => onChange({ annualIncome: Number(e.target.value) })}
              className="w-full cursor-pointer accent-emerald-500"
            />
            <div className={`flex justify-between text-[10px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400 font-medium'}`}>
              <span>BPL (₹0)</span>
              <span>₹2.5L (EWS)</span>
              <span>₹8L+</span>
            </div>
          </div>

          {/* 3. State Selector (Ashok Blue Accent) */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isLight
              ? 'bg-slate-50/80 border-slate-200/90 hover:border-blue-400'
              : 'bg-white/[0.03] border-white/[0.07] hover:border-sky-500/40'
          }`}>
            <div className="flex justify-between items-center mb-2">
              <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                <MapPin className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-sky-400'}`} />
                {isHi ? 'राज्य (State)' : 'State'}
              </span>
            </div>
            <select
              value={profile.state}
              onChange={(e) => onChange({ state: e.target.value })}
              className={`w-full px-3 py-2 rounded-xl text-xs font-bold outline-none cursor-pointer simulator-select ${
                isLight
                  ? 'bg-white border border-slate-300 text-slate-900 focus:border-blue-500 shadow-xs'
                  : 'bg-[#0A1224] border border-sky-500/30 text-slate-100 focus:border-sky-400'
              }`}
            >
              {STATES_LIST.map((st) => (
                <option key={st} value={st} className={`simulator-option ${isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Occupation Pills (Saffron Kesari Format) */}
          <div className={`p-4 rounded-2xl border md:col-span-2 ${
            isLight ? 'bg-slate-50/80 border-slate-200/90' : 'bg-white/[0.03] border-white/[0.07]'
          }`}>
            <span className={`text-xs font-bold flex items-center gap-1.5 mb-2.5 ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
              <Briefcase className={`w-3.5 h-3.5 ${isLight ? 'text-orange-600' : 'text-orange-400'}`} />
              {isHi ? 'व्यवसाय (Occupation)' : 'Occupation'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {occupations.map((occ) => {
                const isSelected = profile.occupation === occ.key;
                return (
                  <button
                    key={occ.key}
                    onClick={() => onChange({ occupation: occ.key })}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-[0_4px_14px_rgba(249,115,22,0.4)]'
                        : isLight
                        ? 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 hover:text-slate-900 shadow-xs'
                        : 'bg-white/[0.04] text-slate-300 border border-white/[0.08] hover:border-orange-500/40 hover:text-white'
                    }`}
                  >
                    {isHi ? occ.labelHi : occ.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Category Pills (India Green Emerald Format) */}
          <div className={`p-4 rounded-2xl border ${
            isLight ? 'bg-slate-50/80 border-slate-200/90' : 'bg-white/[0.03] border-white/[0.07]'
          }`}>
            <span className={`text-xs font-bold flex items-center gap-1.5 mb-2.5 ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
              <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
              {isHi ? 'सामाजिक वर्ग (Category)' : 'Category'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const isSelected = profile.category === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => onChange({ category: cat.key })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)]'
                        : isLight
                        ? 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-slate-900 shadow-xs'
                        : 'bg-white/[0.04] text-slate-300 border border-white/[0.08] hover:border-emerald-500/40 hover:text-white'
                    }`}
                  >
                    {isHi ? cat.labelHi : cat.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
