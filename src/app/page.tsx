'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Language, CitizenProfile, Scheme } from '@/types/scheme';
import { SCHEMES_DATABASE } from '@/data/schemes';
import { PendingScheme, INITIAL_PENDING_SCHEMES, CRAWLABLE_PIB_SCHEMES } from '@/data/pendingSchemes';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ScrollProgressBar } from '@/components/ScrollProgressBar';
import { LiveScrollMarquee } from '@/components/LiveScrollMarquee';
import { BenefitCounter } from '@/components/BenefitCounter';
import { InteractiveSimulator } from '@/components/InteractiveSimulator';
import { SchemeCard } from '@/components/SchemeCard';
import { SchemeDrawer } from '@/components/SchemeDrawer';
import { VoiceModal } from '@/components/VoiceModal';
import { DocumentModal } from '@/components/DocumentModal';
import { AdminSchemeApprovalModal } from '@/components/AdminSchemeApprovalModal';
import { ScamShieldBanner } from '@/components/ScamShieldBanner';
import { HaloProcessTimeline } from '@/components/HaloProcessTimeline';
import { BackgroundAshokChakra } from '@/components/BackgroundAshokChakra';
import { Footer } from '@/components/Footer';
import { Sparkles, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_PROFILE: CitizenProfile = {
  age: 28,
  annualIncome: 200000,
  occupation: 'all',
  category: 'all',
  gender: 'all',
  state: 'All India (केंद्रीय)',
  landHoldingAcres: 2,
  hasDisability: false,
};

export default function Home() {
  const [language, setLanguage] = useState<Language>('hi');
  const [profile, setProfile] = useState<CitizenProfile>(DEFAULT_PROFILE);
  const [activePersona, setActivePersona] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');

  // AI Search state
  const [isSearching, setIsSearching] = useState(false);
  const [aiMatchedSchemeIds, setAiMatchedSchemeIds] = useState<string[]>([]);
  const [aiAssistantMessage, setAiAssistantMessage] = useState<string>('');

  // Modals & Drawers state
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isDocScannerOpen, setIsDocScannerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Dynamic Schemes List (Base 12 + Approved from Admin Hub)
  const [approvedCustomSchemes, setApprovedCustomSchemes] = useState<Scheme[]>([]);
  const [pendingSchemesList, setPendingSchemesList] = useState<PendingScheme[]>(INITIAL_PENDING_SCHEMES);
  const [approvalToast, setApprovalToast] = useState<string | null>(null);

  // Load saved custom & pending schemes on mount
  useEffect(() => {
    try {
      const savedApproved = localStorage.getItem('govmitra_approved_schemes');
      if (savedApproved) {
        const parsed = JSON.parse(savedApproved);
        if (Array.isArray(parsed)) {
          setApprovedCustomSchemes(parsed);
        }
      }

      const savedPending = localStorage.getItem('govmitra_pending_schemes');
      if (savedPending) {
        const parsedP = JSON.parse(savedPending);
        if (Array.isArray(parsedP)) {
          // Clean out schemes already in base SCHEMES_DATABASE & sync updated image URLs
          const baseIds = new Set(SCHEMES_DATABASE.map((s) => s.id));
          const allTemplatesMap = new Map<string, string>([
            ...INITIAL_PENDING_SCHEMES.map((s) => [s.id, s.imageUrl] as [string, string]),
            ...CRAWLABLE_PIB_SCHEMES.map((s) => [s.id, s.imageUrl] as [string, string]),
          ]);

          const cleaned = parsedP
            .filter((s) => !baseIds.has(s.id) && !s.id.includes('-batch-'))
            .map((s) => {
              const freshImg = allTemplatesMap.get(s.id);
              if (freshImg) {
                return { ...s, imageUrl: freshImg };
              }
              return s;
            });

          setPendingSchemesList(cleaned);
          try {
            localStorage.setItem('govmitra_pending_schemes', JSON.stringify(cleaned));
          } catch {}
        }
      }
    } catch {}
  }, []);

  // Merge base schemes + approved custom schemes
  const allActiveSchemes = useMemo(() => {
    const baseMap = new Map(SCHEMES_DATABASE.map((s) => [s.id, s]));
    approvedCustomSchemes.forEach((s) => baseMap.set(s.id, s));
    return Array.from(baseMap.values());
  }, [approvedCustomSchemes]);

  const handleApproveScheme = (scheme: PendingScheme) => {
    // 1. Add to approved
    setApprovedCustomSchemes((prev) => {
      const updated = [...prev.filter((s) => s.id !== scheme.id), scheme];
      try {
        localStorage.setItem('govmitra_approved_schemes', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 2. Remove from pending
    setPendingSchemesList((prev) => {
      const updated = prev.filter((s) => s.id !== scheme.id);
      try {
        localStorage.setItem('govmitra_pending_schemes', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 3. Show celebration toast
    setApprovalToast(
      language === 'hi'
        ? `🎉 "${scheme.nameHindi}" स्वीकृत होकर पोर्टल पर लाइव हो चुकी है!`
        : `🎉 "${scheme.name}" approved & published live to the portal!`
    );
    setTimeout(() => setApprovalToast(null), 5000);
  };

  const handleRejectScheme = (schemeId: string) => {
    setPendingSchemesList((prev) => {
      const updated = prev.filter((s) => s.id !== schemeId);
      try {
        localStorage.setItem('govmitra_pending_schemes', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleAddPendingSchemes = (newSchemes: PendingScheme[]) => {
    const baseIds = new Set(SCHEMES_DATABASE.map((s) => s.id));
    const approvedIds = new Set(approvedCustomSchemes.map((s) => s.id));
    const existingPendingIds = new Set(pendingSchemesList.map((s) => s.id));

    // Strictly ensure that schemes already on the portal are NEVER added to pending!
    const toAdd = newSchemes.filter(
      (s) => !baseIds.has(s.id) && !approvedIds.has(s.id) && !existingPendingIds.has(s.id)
    );

    // If nothing new was added, do NOT show fake "new scheme added" toast!
    if (toAdd.length === 0) {
      setApprovalToast(
        language === 'hi'
          ? 'ℹ️ सभी उपलब्ध योजनाएं पहले से ही पोर्टल या कतार में मौजूद हैं!'
          : 'ℹ️ All available schemes are already active or in the queue!'
      );
      setTimeout(() => setApprovalToast(null), 3500);
      return;
    }

    setPendingSchemesList((prev) => {
      const updated = [...toAdd, ...prev];
      try {
        localStorage.setItem('govmitra_pending_schemes', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setApprovalToast(
      language === 'hi'
        ? `📡 PIB व सरकारी गजट से ${toAdd.length} नई योजनाएं स्वीकृति कतार में जोड़ी गईं!`
        : `📡 ${toAdd.length} new scheme(s) detected from PIB added to Pending Queue!`
    );
    setTimeout(() => setApprovalToast(null), 4500);
  };

  const handleResetToDefaultSchemes = () => {
    setApprovedCustomSchemes([]);
    setPendingSchemesList(INITIAL_PENDING_SCHEMES);
    try {
      localStorage.removeItem('govmitra_approved_schemes');
      localStorage.removeItem('govmitra_pending_schemes');
    } catch {}
    setApprovalToast(
      language === 'hi'
        ? 'डिफ़ॉल्ट 12 योजनाओं पर रीसेट कर दिया गया।'
        : 'Reset to default 12 welfare schemes.'
    );
    setTimeout(() => setApprovalToast(null), 3000);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('govmitra_theme');
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved);
        if (saved === 'light') {
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
        }
      }
    } catch {}
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('govmitra_theme', nextTheme);
    } catch {}
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  const isHi = language === 'hi';

  // Handle Preset Persona clicks from Hero
  const handleSelectPresetPersona = (key: string) => {
    setActivePersona(key);
    setSearchQuery('');
    setAiMatchedSchemeIds([]);
    setAiAssistantMessage('');

    if (key === 'all') {
      setProfile(DEFAULT_PROFILE);
      setSelectedCategoryTab('all');
    } else if (key === 'farmer') {
      setProfile((prev) => ({ ...prev, occupation: 'farmer', landHoldingAcres: 2.5 }));
      setSelectedCategoryTab('Agriculture');
    } else if (key === 'student') {
      setProfile((prev) => ({ ...prev, occupation: 'student', age: 20, annualIncome: 180000 }));
      setSelectedCategoryTab('Education');
    } else if (key === 'business_owner') {
      setProfile((prev) => ({ ...prev, occupation: 'business_owner', age: 30 }));
      setSelectedCategoryTab('Business & Startup');
    } else if (key === 'artisan') {
      setProfile((prev) => ({ ...prev, occupation: 'artisan', age: 34 }));
      setSelectedCategoryTab('Artisans & Crafts');
    } else if (key === 'women') {
      setProfile((prev) => ({ ...prev, gender: 'female', age: 26, annualIncome: 150000 }));
      setSelectedCategoryTab('Social Security');
    } else if (key === 'solar') {
      setSelectedCategoryTab('Housing & Energy');
    }
  };

  // AI-Powered Natural Language Search
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchQuery('');
      setAiMatchedSchemeIds([]);
      setAiAssistantMessage('');
      return;
    }

    setSearchQuery(query);
    setIsSearching(true);
    setSelectedCategoryTab('all');

    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (data.matchedSchemeIds && data.matchedSchemeIds.length > 0) {
        setAiMatchedSchemeIds(data.matchedSchemeIds);
      } else {
        setAiMatchedSchemeIds(['__NONE__']);
      }

      const msg = isHi ? data.assistantReplyHi : data.assistantReplyEn;
      setAiAssistantMessage(msg || '');

      if (data.interpretedProfile) {
        setProfile((prev) => ({ ...prev, ...data.interpretedProfile }));
        if (data.interpretedProfile.occupation) {
          setActivePersona(data.interpretedProfile.occupation);
        }
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearAISearch = () => {
    setSearchQuery('');
    setAiMatchedSchemeIds([]);
    setAiAssistantMessage('');
    setProfile(DEFAULT_PROFILE);
    setActivePersona('all');
    setSelectedCategoryTab('all');
  };

  // Filter schemes matching current profile, search, and AI matches
  const filteredSchemes = useMemo(() => {
    return allActiveSchemes.filter((scheme) => {
      // 1. If AI explicitly returned zero matches
      if (aiMatchedSchemeIds.includes('__NONE__')) {
        return false;
      }

      // 2. If AI matched specific scheme IDs from Natural Language query
      if (aiMatchedSchemeIds.length > 0) {
        return aiMatchedSchemeIds.includes(scheme.id);
      }

      // 3. Keyword Search Query filter
      if (searchQuery.trim()) {
        const STOP_WORDS = new Set([
          'मैं', 'हूँ', 'है', 'हैं', 'का', 'की', 'के', 'को', 'में', 'से', 'पर', 'और', 'या', 'था', 'थी', 'थे',
          'i', 'am', 'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'is', 'are', 'was', 'were', 'my', 'me', 'hu', 'hoon', 'mai', 'main'
        ]);
        const tokens = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
        const meaningfulTokens = tokens.filter((t) => !STOP_WORDS.has(t) && t.length > 1);

        if (meaningfulTokens.length === 0) {
          return false;
        }

        const corpus = `${scheme.name} ${scheme.nameHindi} ${scheme.category} ${scheme.categoryHindi} ${scheme.tags.join(' ')} ${scheme.tagsHindi.join(' ')} ${scheme.eli5.whoGetsIt} ${scheme.eli5.whoGetsItHindi} ${scheme.benefitAmountDisplay}`.toLowerCase();

        const matchesAnyToken = meaningfulTokens.some((token) => corpus.includes(token));
        if (!matchesAnyToken) return false;
      }

      // 4. Category Tab filter
      if (selectedCategoryTab !== 'all' && scheme.category !== selectedCategoryTab) {
        return false;
      }

      // 4. Age filter
      if (scheme.eligibility.minAge && profile.age < scheme.eligibility.minAge) {
        return false;
      }
      if (scheme.eligibility.maxAge && profile.age > scheme.eligibility.maxAge) {
        return false;
      }

      // 5. Annual Income filter
      if (
        scheme.eligibility.maxAnnualIncome &&
        profile.annualIncome > scheme.eligibility.maxAnnualIncome
      ) {
        return false;
      }

      // 6. Gender filter
      if (
        scheme.eligibility.genders &&
        profile.gender !== 'all' &&
        !scheme.eligibility.genders.includes(profile.gender)
      ) {
        return false;
      }

      // 7. Occupation filter
      if (
        scheme.eligibility.occupations &&
        profile.occupation !== 'all' &&
        !scheme.eligibility.occupations.includes(profile.occupation)
      ) {
        return false;
      }

      // 8. Category filter
      if (
        scheme.eligibility.categories &&
        profile.category !== 'all' &&
        !scheme.eligibility.categories.includes(profile.category)
      ) {
        return false;
      }

      return true;
    });
  }, [profile, searchQuery, selectedCategoryTab, aiMatchedSchemeIds]);

  // Calculate total unlocked value
  const totalUnlockedAmount = useMemo(() => {
    return filteredSchemes.reduce((acc, curr) => acc + curr.benefitAmountValue, 0);
  }, [filteredSchemes]);

  // Handle Voice Assistant callback
  const handleApplyVoiceUpdates = (
    updates: Partial<CitizenProfile>,
    reply: string,
    matchedSchemeIds?: string[]
  ) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    setAiAssistantMessage(reply);
    setSelectedCategoryTab('all');
    if (matchedSchemeIds && matchedSchemeIds.length > 0) {
      setAiMatchedSchemeIds(matchedSchemeIds);
    } else {
      setAiMatchedSchemeIds(['__NONE__']);
    }
    if (updates.occupation) {
      setActivePersona(updates.occupation);
    }
  };

  const categoryTabs = [
    { key: 'all', labelEn: 'All Schemes', labelHi: 'सभी योजनाएं' },
    { key: 'Agriculture', labelEn: '🌾 Agriculture', labelHi: '🌾 कृषि एवं किसान' },
    { key: 'Healthcare', labelEn: '🏥 Healthcare', labelHi: '🏥 स्वास्थ्य' },
    { key: 'Business & Startup', labelEn: '💼 Loans & MSME', labelHi: '💼 ऋण एवं व्यापार' },
    { key: 'Education', labelEn: '🎓 Scholarships', labelHi: '🎓 छात्रवृत्ति' },
    { key: 'Housing & Energy', labelEn: '⚡ Solar & Housing', labelHi: '⚡ आवास व सोलर' },
    { key: 'Social Security', labelEn: '🛡️ Social Security', labelHi: '🛡️ पेंशन व सहायता' },
    { key: 'Artisans & Crafts', labelEn: '🔨 Artisans', labelHi: '🔨 कारीगर' },
  ];

  return (
    <div
      className={`min-h-screen ${
        theme === 'light' ? 'light bg-[#F8FAFC] text-slate-900' : 'bg-[#060913] text-slate-100'
      } flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 cyber-grid relative overflow-x-hidden transition-colors duration-300`}
    >
      {/* Scroll Progress Neon Line */}
      <ScrollProgressBar />

      {/* Global Scroll-Driven Rotating Background Ashok Chakra (Tiranga Theme) */}
      <BackgroundAshokChakra theme={theme} />

      {/* Light Theme Exclusive: Subtle Tiranga Ambient Side Tints (Left Orange, Right Green) */}
      {theme === 'light' && (
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Left Side: Soft Saffron / Orange Ambient Wash */}
          <div className="absolute top-0 -left-24 w-[480px] sm:w-[650px] h-full bg-gradient-to-r from-orange-500/[0.08] via-amber-500/[0.03] to-transparent blur-3xl pointer-events-none" />
          <div className="absolute top-[18%] -left-32 w-[540px] h-[540px] rounded-full bg-orange-400/[0.11] blur-[150px] pointer-events-none" />
          <div className="absolute top-[62%] -left-32 w-[500px] h-[500px] rounded-full bg-amber-500/[0.08] blur-[140px] pointer-events-none" />

          {/* Right Side: Soft India Green / Emerald Ambient Wash */}
          <div className="absolute top-0 -right-24 w-[480px] sm:w-[650px] h-full bg-gradient-to-l from-emerald-500/[0.08] via-teal-500/[0.03] to-transparent blur-3xl pointer-events-none" />
          <div className="absolute top-[22%] -right-32 w-[540px] h-[540px] rounded-full bg-emerald-400/[0.11] blur-[150px] pointer-events-none" />
          <div className="absolute top-[68%] -right-32 w-[500px] h-[500px] rounded-full bg-teal-500/[0.08] blur-[140px] pointer-events-none" />
        </div>
      )}

      {/* 1. Header Navbar */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenDocScanner={() => setIsDocScannerOpen(true)}
        onOpenAdminHub={() => setIsAdminOpen(true)}
        pendingApprovalsCount={pendingSchemesList.length}
        totalUnlockedAmount={totalUnlockedAmount}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="flex-1 relative z-10">
        
        {/* 2. Hero Section with Real Tiranga Photo Gallery */}
        <Hero
          language={language}
          onSearch={handleSearch}
          onOpenVoice={() => setIsVoiceOpen(true)}
          onSelectPresetPersona={handleSelectPresetPersona}
          activePersona={activePersona}
          isSearching={isSearching}
          onSelectShowcaseScheme={(id) => {
            const found = allActiveSchemes.find((s) => s.id === id);
            if (found) setSelectedScheme(found);
          }}
          theme={theme}
        />

        {/* Live Scrolling Stat Ticker (Dynamic Marquee) */}
        <LiveScrollMarquee theme={theme} />

        {/* Halo Lab Circle-Style: The 3-Step Welfare Journey (01, 02, 03) */}
        <HaloProcessTimeline
          language={language}
          onOpenVoice={() => setIsVoiceOpen(true)}
          onOpenDocScanner={() => setIsDocScannerOpen(true)}
          theme={theme}
        />

        {/* AI Interpretation Notification Banner */}
        {aiAssistantMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto px-4 sm:px-6 mb-8"
          >
            <div className={`p-4 rounded-2xl flex items-center justify-between gap-4 transition-all ${
              theme === 'light'
                ? 'bg-emerald-50 border border-emerald-300 text-slate-900 shadow-md'
                : 'glass-panel-glow text-white'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${
                  theme === 'light' ? 'bg-emerald-200 text-emerald-800' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider font-mono ${
                    theme === 'light' ? 'text-emerald-800' : 'text-emerald-400'
                  }`}>
                    GovMitra 3D AI Match
                  </span>
                  <p className={`text-xs sm:text-sm font-medium leading-relaxed ${
                    theme === 'light' ? 'text-slate-700' : 'text-slate-200'
                  }`}>
                    {aiAssistantMessage}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClearAISearch}
                className={`p-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                  theme === 'light'
                    ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Clear AI Match"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* 3. Benefit Unlocked Counter Bar (Scroll Reveal) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <BenefitCounter
            language={language}
            totalAmount={totalUnlockedAmount}
            schemeCount={filteredSchemes.length}
            onOpenDocScanner={() => setIsDocScannerOpen(true)}
            theme={theme}
          />
        </motion.div>

        {/* 4. Interactive Eligibility Simulator (Scroll Reveal) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          <InteractiveSimulator
            language={language}
            profile={profile}
            onChange={(updated) => {
              setProfile((prev) => ({ ...prev, ...updated }));
              setAiMatchedSchemeIds([]);
            }}
            onReset={handleClearAISearch}
            theme={theme}
          />
        </motion.div>

        {/* 5. Category Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto px-4 sm:px-6 mb-8"
        >
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoryTabs.map((tab) => {
              const isActive = selectedCategoryTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setSelectedCategoryTab(tab.key);
                    setAiMatchedSchemeIds([]);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? theme === 'light'
                        ? 'bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 text-slate-950 font-black shadow-[0_4px_16px_rgba(249,115,22,0.35)] scale-105 border border-orange-400/40'
                        : 'bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 text-slate-950 font-black shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-105'
                      : theme === 'light'
                      ? 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300 hover:text-orange-800 hover:bg-orange-50/50 shadow-xs'
                      : 'glass-panel text-slate-300 hover:border-emerald-500/40 hover:text-white'
                  }`}
                >
                  {isHi ? tab.labelHi : tab.labelEn}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* 6. Bento Grid of Schemes (Scroll Reveal & Stagger) */}
        <motion.div
          id="schemes-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 scroll-mt-24"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5 ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                {isHi ? 'आपके लिए योग्य सरकारी योजनाएं' : 'Matched Government Schemes'}
                <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  theme === 'light'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                }`}>
                  {filteredSchemes.length} Active
                </span>
              </h2>
              <p className={`text-xs mt-1 font-medium ${
                theme === 'light' ? 'text-slate-600' : 'text-slate-400'
              }`}>
                {isHi
                  ? `कुल ${filteredSchemes.length} योजनाएं आपकी वर्तमान प्रोफाइल से मेल खाती हैं`
                  : `Showing ${filteredSchemes.length} schemes matching your eligibility rules`}
              </p>
            </div>

            {(searchQuery || aiMatchedSchemeIds.length > 0) && (
              <button
                onClick={handleClearAISearch}
                className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer"
              >
                {isHi ? 'फ़िल्टर साफ़ करें ✕' : 'Clear Filters ✕'}
              </button>
            )}
          </div>

          {filteredSchemes.length === 0 ? (
            <div className={`rounded-3xl p-8 sm:p-12 text-center border ${
              theme === 'light'
                ? 'bg-amber-50/90 border-2 border-amber-300 shadow-md text-slate-900'
                : 'glass-panel border-amber-500/30 bg-amber-500/[0.03]'
            }`}>
              <span className="text-5xl mb-3 block">⚠️</span>
              <h3 className={`text-base sm:text-lg font-bold mb-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                {isHi ? 'कोई संबंधित सरकारी योजना नहीं मिली' : 'No Matching Government Schemes Found'}
              </h3>
              
              {aiAssistantMessage ? (
                <div className={`max-w-xl mx-auto mb-6 p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed font-medium ${
                  theme === 'light'
                    ? 'bg-amber-100/90 border-amber-300 text-amber-900'
                    : 'bg-black/40 border-amber-500/40 text-amber-200'
                }`}>
                  {aiAssistantMessage}
                </div>
              ) : (
                <p className={`text-xs max-w-sm mx-auto mb-6 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                  {isHi
                    ? 'कृपया अपनी आवश्यकता स्पष्ट रूप से बताएं (जैसे खेती, शिक्षा, स्वास्थ्य, या लोन) या फ़िल्टर रीसेट करें।'
                    : 'Please specify a welfare need (farming, education, healthcare, loan) or reset filters.'}
                </p>
              )}

              {/* Quick suggestions to guide user */}
              <div className="max-w-lg mx-auto mb-6">
                <p className={`text-[11px] font-black uppercase tracking-wider mb-2.5 ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  {isHi ? '💡 इनमें से किसी एक पर क्लिक करके तुरंत देखें:' : '💡 Try clicking one of these genuine welfare categories:'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {[
                    { label: isHi ? '🌾 किसान योजना' : '🌾 Farmer Aid', q: 'kisan samman 2 acre zameen' },
                    { label: isHi ? '🎓 कॉलेज स्कॉलरशिप' : '🎓 Scholarships', q: 'college student scholarship' },
                    { label: isHi ? '💼 मुद्रा व्यापार लोन' : '💼 Business Loan', q: 'dukan business mudra loan' },
                    { label: isHi ? '⚡ सोलर बिजली' : '⚡ Solar Subsidy', q: 'chhat par solar panel subsidy' },
                    { label: isHi ? '🏥 आयुष्मान कार्ड' : '🏥 Free Healthcare', q: 'ayushman bharat muft ilaj' },
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(chip.q)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'bg-white hover:bg-orange-50 border-slate-200 hover:border-orange-300 text-slate-800 shadow-xs'
                          : 'bg-white/[0.05] hover:bg-orange-500/20 hover:border-orange-500/50 border-white/10 text-slate-200'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleClearAISearch}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 text-slate-950 text-xs font-black hover:brightness-110 transition-all cursor-pointer shadow-[0_0_20px_rgba(249,115,22,0.3)]"
              >
                {isHi ? 'सभी 12 सरकारी योजनाएं देखें ✕' : 'View All 12 Government Schemes ✕'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchemes.map((scheme) => (
                <SchemeCard
                  key={scheme.id}
                  scheme={scheme}
                  language={language}
                  onOpenDetails={(s) => setSelectedScheme(s)}
                  onVerifyDocs={() => setIsDocScannerOpen(true)}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* 7. Scam Shield Banner (Scroll Reveal) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <ScamShieldBanner language={language} theme={theme} />
        </motion.div>

      </main>

      {/* 8. Footer */}
      <Footer language={language} theme={theme} />

      {/* 9. Scheme Detail Drawer */}
      <SchemeDrawer
        scheme={selectedScheme}
        language={language}
        theme={theme}
        onClose={() => setSelectedScheme(null)}
        onOpenDocScanner={() => {
          setSelectedScheme(null);
          setIsDocScannerOpen(true);
        }}
      />

      {/* 10. Voice Intelligence Modal with Direct Access */}
      <VoiceModal
        isOpen={isVoiceOpen}
        language={language}
        theme={theme}
        onClose={() => setIsVoiceOpen(false)}
        onApplyProfileUpdates={handleApplyVoiceUpdates}
        onOpenSchemeDetails={(scheme) => setSelectedScheme(scheme)}
      />

      {/* 11. AI Document Pre-Flight Scanner Modal */}
      <DocumentModal
        isOpen={isDocScannerOpen}
        language={language}
        theme={theme}
        onClose={() => setIsDocScannerOpen(false)}
      />

      {/* 12. Admin Scheme Ingestion & Approval Modal */}
      <AdminSchemeApprovalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        language={language}
        theme={theme}
        pendingSchemes={pendingSchemesList}
        allActiveSchemes={allActiveSchemes}
        onApproveScheme={handleApproveScheme}
        onRejectScheme={handleRejectScheme}
        onResetToDefault={handleResetToDefaultSchemes}
        onAddPendingSchemes={handleAddPendingSchemes}
        activeSchemesCount={allActiveSchemes.length}
      />

      {/* Floating Approval Celebration Toast */}
      <AnimatePresence>
        {approvalToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-950 text-white border-2 border-emerald-400 shadow-[0_10px_40px_rgba(16,185,129,0.4)] backdrop-blur-xl"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs sm:text-sm font-bold text-slate-100">{approvalToast}</p>
            <button
              onClick={() => setApprovalToast(null)}
              className="ml-2 text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
