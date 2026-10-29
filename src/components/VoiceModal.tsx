'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Language, CitizenProfile, Scheme } from '@/types/scheme';
import { SCHEMES_DATABASE } from '@/data/schemes';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  FileText,
  Building2,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  onApplyProfileUpdates: (updates: Partial<CitizenProfile>, reply: string, matchedSchemeIds?: string[]) => void;
  onOpenSchemeDetails?: (scheme: Scheme) => void;
  theme?: 'dark' | 'light';
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  language,
  onClose,
  onApplyProfileUpdates,
  onOpenSchemeDetails,
  theme = 'dark',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchedSchemes, setMatchedSchemes] = useState<Scheme[]>([]);
  const [micError, setMicError] = useState<string | null>(null);
  const [showAllSchemes, setShowAllSchemes] = useState(false);
  const [playingSchemeId, setPlayingSchemeId] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef('');
  const silenceTimerRef = useRef<any>(null);
  const handleProcessQueryRef = useRef<(queryText: string) => Promise<void>>(async () => {});
  const isHi = language === 'hi';
  const isLight = theme === 'light';

  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      setIsListening(false);
      setTranscript('');
      transcriptRef.current = '';
      setAiReply('');
      setMatchedSchemes([]);
      setMicError(null);
      setShowAllSchemes(false);
      setPlayingSchemeId(null);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError(
        isHi
          ? 'ब्राउज़र में वॉइस स्पीच उपलब्ध नहीं है। आप नीचे दिए गए 1-क्लिक कार्ड्स से सीधे एक्सेस कर सकते हैं।'
          : 'Speech recognition not supported in this browser. Use the preset voice cards below.'
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = isHi ? 'hi-IN' : 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
      setMicError(null);
    };

    recognition.onresult = (event: any) => {
      let current = '';
      for (let i = 0; i < event.results.length; i++) {
        current += event.results[i][0].transcript;
      }
      const clean = current.trim();
      setTranscript(clean);
      transcriptRef.current = clean;

      // Auto-submit silence detection: stops mic automatically after 1.1s of silence
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (clean.length > 1) {
        silenceTimerRef.current = setTimeout(() => {
          try {
            recognition.stop();
          } catch {}
        }, 1100);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (event.error === 'not-allowed') {
        setMicError(
          isHi
            ? 'माइक्रोफ़ोन की अनुमति (Permission) नहीं मिली। आप नीचे दिए गए बटनों से आसानी से चुन सकते हैं।'
            : 'Microphone permission blocked. Please select one of the voice preset buttons below.'
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      const finalQuery = transcriptRef.current.trim();
      if (finalQuery) {
        // DIRECT AUTO-SEARCH: Bolte hi turant search execute karega!
        handleProcessQueryRef.current(finalQuery);
      }
    };

    recognitionRef.current = recognition;

    // Auto-start listening cleanly 300ms after modal opens
    const autoStartTimer = setTimeout(() => {
      try {
        transcriptRef.current = '';
        recognition.start();
      } catch {}
    }, 300);

    return () => {
      clearTimeout(autoStartTimer);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      try {
        recognition.stop();
      } catch {}
    };
  }, [isOpen, isHi]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      transcriptRef.current = '';
      setTranscript('');
      setAiReply('');
      setMatchedSchemes([]);
      setMicError(null);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      recognitionRef.current.start();
    } catch (e) {
      console.warn(e);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      recognitionRef.current.stop();
      setIsListening(false);
      const finalQuery = transcriptRef.current.trim();
      if (finalQuery) {
        handleProcessQuery(finalQuery);
      }
    } catch (e) {}
  };

  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isHi ? 'hi-IN' : 'en-IN';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleSchemeAudio = (scheme: Scheme) => {
    if (!('speechSynthesis' in window)) return;

    if (playingSchemeId === scheme.id) {
      window.speechSynthesis.cancel();
      setPlayingSchemeId(null);
    } else {
      window.speechSynthesis.cancel();
      const text = isHi
        ? `${scheme.nameHindi}। सीधा लाभ: ${scheme.benefitAmountDisplayHindi}। ${scheme.eli5.whoGetsItHindi}।`
        : `${scheme.name}. Benefit: ${scheme.benefitAmountDisplay}. ${scheme.eli5.whoGetsIt}.`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isHi ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setPlayingSchemeId(null);
      utterance.onerror = () => setPlayingSchemeId(null);

      setPlayingSchemeId(scheme.id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleProcessQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setMicError(null);

    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
      });

      const data = await res.json();
      const reply = isHi ? data.assistantReplyHi : data.assistantReplyEn;
      setAiReply(reply);
      handleSpeakText(reply);

      const matchedIds: string[] = data.matchedSchemeIds || [];
      const found = SCHEMES_DATABASE.filter((s) => matchedIds.includes(s.id));
      setMatchedSchemes(found);

      if (data.interpretedProfile) {
        onApplyProfileUpdates(data.interpretedProfile, reply, matchedIds);
      }
    } catch (err) {
      console.error(err);
      const fallbackMsg = isHi
        ? 'क्षमा करें, सर्वर से संपर्क नहीं हो सका। कृपया अपनी आवाज़ या नीचे दिए गए विकल्पों से दोबारा प्रयास करें।'
        : 'Could not connect to the advisor service. Please try again or tap one of the presets below.';
      setAiReply(fallbackMsg);
      handleSpeakText(fallbackMsg);
      setMatchedSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  // Keep ref up to date for speech end callback
  handleProcessQueryRef.current = handleProcessQuery;

  const displayedSchemes = showAllSchemes ? SCHEMES_DATABASE : matchedSchemes;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto transition-colors ${
          isLight ? 'bg-slate-900/40 backdrop-blur-sm' : 'bg-black/85 backdrop-blur-xl'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`relative w-full max-w-2xl max-h-[92vh] rounded-3xl flex flex-col overflow-hidden voice-modal-content transition-colors ${
            isLight
              ? 'bg-[#FCFDFE] text-slate-900 border border-slate-200 shadow-[0_25px_70px_rgba(0,0,0,0.18)]'
              : 'bg-[#0A101D] text-slate-100 border border-orange-500/30 shadow-[0_0_60px_rgba(249,115,22,0.25)]'
          }`}
        >
          {/* Subtle Ambient Tiranga Corner Tints for Voice Studio */}
          {isLight ? (
            <>
              <div className="absolute top-0 left-0 w-80 h-80 bg-orange-500/[0.07] rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/[0.07] rounded-full blur-[100px] pointer-events-none" />
            </>
          ) : (
            <>
              <div className="absolute top-0 left-0 w-72 h-72 bg-orange-500/15 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />
            </>
          )}

          {/* Top Bar */}
          <div
            className={`sticky top-0 z-20 px-6 py-4 border-b flex items-center justify-between transition-colors ${
              isLight
                ? 'bg-white/95 backdrop-blur-2xl border-slate-200/90 shadow-2xs'
                : 'bg-[#0A101D]/90 backdrop-blur-2xl border-white/[0.08]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-orange-500 to-emerald-500" />
              </span>
              <span
                className={`text-xs font-black uppercase tracking-widest ${
                  isLight ? 'text-orange-700' : 'text-orange-400'
                }`}
              >
                GovMitra AI Voice Studio
              </span>
              <span
                className={`hidden sm:inline-flex text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isLight
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                Live Speech
              </span>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isLight
                  ? 'text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200'
                  : 'text-slate-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08]'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Studio Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 relative z-10">
            
            {/* Header & Prompt */}
            <div className="text-center max-w-xl mx-auto">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold mb-3 shadow-2xs border ${
                  isLight
                    ? 'bg-orange-50 border-orange-200 text-orange-800'
                    : 'bg-orange-500/15 border-orange-500/30 text-orange-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{isHi ? 'AI रियल-टाइम वॉइस सर्च' : 'Real-time AI Voice Search'}</span>
              </div>

              <h3
                className={`text-2xl sm:text-3xl font-black leading-tight tracking-tight ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}
              >
                {isHi ? (
                  <>
                    बोलिए, <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 bg-clip-text text-transparent">सरकारी योजनाएं तुरंत खोजें</span>
                  </>
                ) : (
                  <>
                    Speak to <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 bg-clip-text text-transparent">Discover Welfare Schemes</span>
                  </>
                )}
              </h3>
              <p
                className={`text-xs mt-2 leading-relaxed ${
                  isLight ? 'text-slate-600 font-medium' : 'text-slate-400'
                }`}
              >
                {isHi
                  ? 'माइक दबाकर अपनी उम्र, पेशा, या आवश्यकता बताएं — AI तुरंत उपयुक्त योजनाएं निकाल कर यहीं सीधा आवेदन लिंक देगा।'
                  : 'Tap the mic to describe your need, age or occupation — AI will discover matching government benefits right here.'}
              </p>
            </div>

            {/* Error Alert */}
            {micError && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
                  isLight
                    ? 'bg-amber-50 border-2 border-amber-300 text-amber-950 shadow-2xs'
                    : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                }`}
              >
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-500" />
                <span className="font-medium">{micError}</span>
              </div>
            )}

            {/* Glowing Interactive Mic Stage (Studio Design) */}
            <div
              className={`flex flex-col items-center justify-center py-8 px-6 sm:py-10 sm:px-8 rounded-3xl relative overflow-hidden transition-all ${
                isLight
                  ? 'bg-gradient-to-b from-orange-50/40 via-white to-emerald-50/40 border-2 border-slate-200/90 shadow-[0_16px_40px_rgba(0,0,0,0.04)]'
                  : 'bg-white/[0.03] border border-white/[0.08]'
              }`}
            >
              {/* Concentric Animated Soundwave Waves when Active */}
              {isListening && (
                <>
                  <span className="absolute w-52 h-52 rounded-full bg-orange-500/15 animate-ping pointer-events-none" />
                  <span className="absolute w-40 h-40 rounded-full bg-emerald-500/20 animate-pulse pointer-events-none" />
                  <span className="absolute w-32 h-32 rounded-full bg-amber-400/25 pointer-events-none" />
                </>
              )}

              {/* Ambient idle glow */}
              {!isListening && (
                <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-orange-500/10 via-amber-400/10 to-emerald-500/10 blur-2xl pointer-events-none animate-pulse" />
              )}
              
              {/* Dynamic Soundwave Frequency Bars */}
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 h-12 mb-5 z-10">
                {[14, 28, 44, 20, 36, 48, 26, 42, 54, 30, 46, 22, 38, 18, 32, 24, 40].map((height, i) => (
                  <motion.div
                    key={i}
                    animate={
                      isListening
                        ? { height: [8, height, 12, height * 0.85, 8] }
                        : { height: [6, 10 + (i % 4) * 3, 6] }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: isListening ? 0.7 + (i % 5) * 0.15 : 2 + (i % 3) * 0.4,
                      ease: 'easeInOut',
                    }}
                    className={`w-1 sm:w-1.5 rounded-full transition-all ${
                      isListening
                        ? 'bg-gradient-to-t from-orange-500 via-amber-400 to-emerald-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]'
                        : isLight
                        ? 'bg-slate-300'
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>

              {/* Central Mic Button */}
              <div className="relative flex items-center justify-center mb-4 z-10">
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-95 cursor-pointer ${
                    isListening
                      ? 'bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-500 text-white shadow-[0_0_40px_rgba(244,63,94,0.6)] ring-4 ring-rose-400/50 scale-105'
                      : 'bg-gradient-to-tr from-orange-500 via-amber-400 to-emerald-500 text-slate-950 shadow-[0_12px_36px_rgba(249,115,22,0.45)] hover:scale-108 hover:shadow-[0_16px_44px_rgba(249,115,22,0.55)]'
                  }`}
                  title={isListening ? (isHi ? 'माइक बंद करें' : 'Stop Listening') : (isHi ? 'माइक चालू करें' : 'Start Speaking')}
                >
                  {isListening ? (
                    <MicOff className="w-10 h-10 animate-bounce text-white drop-shadow-md" />
                  ) : (
                    <Mic className="w-10 h-10 text-slate-950 drop-shadow-sm" />
                  )}
                </button>
              </div>

              {/* Interactive Status Pill */}
              <div className="flex flex-col items-center gap-1.5 z-10">
                <div
                  className={`px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-2 transition-all ${
                    loading
                      ? isLight
                        ? 'bg-orange-100 text-orange-900 border border-orange-300 animate-pulse shadow-2xs'
                        : 'bg-orange-500/20 text-orange-300 border border-orange-500/40 animate-pulse'
                      : isListening
                      ? 'bg-rose-100 text-rose-900 border border-rose-300 shadow-2xs'
                      : isLight
                      ? 'bg-white text-slate-800 border border-slate-200/90 shadow-2xs'
                      : 'bg-white/[0.08] text-slate-200'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-600" />
                      <span>{isHi ? '⚡ AI तुरंत योजनाएं ढूंढ रहा है...' : '⚡ AI searching schemes directly...'}</span>
                    </>
                  ) : isListening ? (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                      <span>{isHi ? '🎙️ आपकी आवाज़ सुन रहे हैं... (बोलना बंद करते ही अपने आप खोजेगा)' : '🎙️ Listening... (Auto-submits on silence)'}</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                      <span>{isHi ? 'माइक दबाकर बोलना शुरू करें' : 'Tap microphone to speak'}</span>
                    </>
                  )}
                </div>

                {/* Sub-guidance prompt */}
                {!loading && !isListening && (
                  <p
                    className={`text-[11px] font-medium mt-1 text-center max-w-sm ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    {isHi
                      ? '💡 उदाहरण: "मुझे 2 एकड़ जमीन पर खाद-बीज के लिए मदद चाहिए" या "विद्यार्थियों के लिए स्कॉलरशिप बताएं"'
                      : '💡 Try saying: "I need agricultural loan for 2 acres" or "Scholarship for college students"'}
                  </p>
                )}
              </div>

              {/* Live Transcript Preview Bubble */}
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-5 p-4 rounded-2xl text-xs text-center font-medium max-w-md w-full transition-all z-10 ${
                    isLight
                      ? 'bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/50 border-2 border-orange-200 text-orange-950 shadow-sm'
                      : 'bg-black/50 border border-orange-500/40 text-slate-200'
                  }`}
                >
                  <span
                    className={`text-[10px] font-black block uppercase tracking-wider mb-1 ${
                      isLight ? 'text-orange-700' : 'text-orange-400'
                    }`}
                  >
                    💬 {isHi ? 'आपकी बात:' : 'You said:'}
                  </span>
                  <p className="text-sm font-bold leading-relaxed">
                    &quot;{transcript}&quot;
                  </p>
                </motion.div>
              )}
            </div>

            {/* ======================================================== */}
            {/* DIRECT SCHEME ACCESS RIGHT INSIDE THE MODAL */}
            {/* ======================================================== */}
            {displayedSchemes.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-2"
              >
                {/* AI Announcement Message */}
                <div
                  className={`p-4 rounded-2xl flex items-center justify-between gap-3 transition-all ${
                    isLight
                      ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-2 border-emerald-300 text-emerald-950 shadow-md'
                      : 'bg-gradient-to-r from-emerald-950/60 to-[#0A101D] border border-emerald-500/40 text-white shadow-[0_0_30px_rgba(16,185,129,0.15)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-xl ${
                        isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className={`text-xs font-black ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>
                        {isHi ? 'AI द्वारा सुझाई गई सरकारी योजनाएं:' : 'AI Matched Schemes Available Right Here:'}
                      </p>
                      <p className={`text-xs mt-0.5 leading-relaxed font-medium ${isLight ? 'text-emerald-950' : 'text-slate-200'}`}>
                        {aiReply || (isHi ? 'आपके लिए उपयुक्त योजनाएं नीचे तैयार हैं।' : 'Your eligible schemes are ready below.')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSpeakText(aiReply)}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      isLight
                        ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                        : 'bg-white/[0.05] hover:bg-white/[0.1] text-emerald-400'
                    }`}
                    title="Listen again"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* All Matched Schemes with Direct Access & Apply Links! */}
                <div className="space-y-3">
                  {displayedSchemes.map((scheme) => (
                    <div
                      key={scheme.id}
                      className={`p-4 rounded-2xl transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isLight
                          ? 'bg-white border-2 border-slate-200/90 hover:border-orange-400 shadow-2xs hover:shadow-xs'
                          : 'bg-white/[0.03] border border-white/[0.08] hover:border-orange-500/50'
                      }`}
                    >
                      {/* Left: Photo & Meta */}
                      <div className="flex items-center gap-3.5">
                        <img
                          src={scheme.imageUrl}
                          alt={scheme.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';
                          }}
                          className={`w-16 h-16 rounded-xl object-cover object-center shrink-0 shadow-md ${
                            isLight ? 'border border-slate-200' : 'border border-white/10'
                          }`}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                isLight
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              }`}
                            >
                              {isHi ? scheme.categoryHindi : scheme.category}
                            </span>
                            <span
                              className={`text-[10px] font-bold flex items-center gap-1 ${
                                isLight ? 'text-emerald-700' : 'text-amber-300'
                              }`}
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              100% Eligible
                            </span>
                          </div>

                          <h5 className={`font-extrabold text-sm mt-1 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                            {isHi ? scheme.nameHindi : scheme.name}
                          </h5>

                          <p className={`text-xs font-black font-mono mt-0.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                            {isHi ? scheme.benefitAmountDisplayHindi : scheme.benefitAmountDisplay}
                          </p>
                        </div>
                      </div>

                      {/* Right: Direct Access Buttons */}
                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                        
                        {/* Audio Speak Aloud */}
                        <button
                          onClick={() => handleToggleSchemeAudio(scheme)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            playingSchemeId === scheme.id
                              ? 'bg-orange-500 text-slate-950 border-orange-400 animate-pulse'
                              : isLight
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-2xs'
                              : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border-white/[0.08]'
                          }`}
                          title={isHi ? 'योजना का विवरण आवाज़ में सुनें' : 'Listen aloud'}
                        >
                          {playingSchemeId === scheme.id ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>

                        {/* View Guidelines Drawer */}
                        {onOpenSchemeDetails && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenSchemeDetails(scheme);
                            }}
                            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              isLight
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-2xs'
                                : 'bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-slate-200'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5 text-orange-500" />
                            <span>{isHi ? 'पूरी गाइड' : 'Guidelines'}</span>
                          </button>
                        )}

                        {/* Direct Official Apply Portal Link */}
                        <a
                          href={scheme.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 hover:brightness-105 text-slate-950 text-xs font-black transition-all shadow-[0_2px_12px_rgba(249,115,22,0.35)]"
                        >
                          <span>{isHi ? 'सीधे आवेदन करें' : 'Apply Now'}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
                        </a>

                      </div>
                    </div>
                  ))}
                </div>

                {/* View All Schemes Toggle */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => setShowAllSchemes(!showAllSchemes)}
                    className={`text-xs font-bold underline cursor-pointer transition-colors ${
                      isLight ? 'text-orange-600 hover:text-orange-700' : 'text-orange-400 hover:text-orange-300'
                    }`}
                  >
                    {showAllSchemes
                      ? isHi
                        ? 'केवल सुझाई गई योजनाएं देखें'
                        : 'Show only matched schemes'
                      : isHi
                      ? '👉 भारत सरकार की अन्य सभी योजनाएं भी यहीं देखें (' + SCHEMES_DATABASE.length + ' Schemes)'
                      : '👉 Explore all other government schemes right here (' + SCHEMES_DATABASE.length + ' Schemes)'}
                  </button>
                </div>
              </motion.div>
            ) : aiReply ? (
              /* Intelligent Refusal & Zero-Match Feedback */
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`space-y-3.5 p-5 rounded-2xl transition-all ${
                  isLight
                    ? 'bg-amber-50/95 border-2 border-amber-300 text-amber-950 shadow-2xs'
                    : 'bg-amber-500/10 border border-amber-500/30 text-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isLight ? 'bg-amber-100 text-amber-600' : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-black uppercase tracking-wide ${isLight ? 'text-amber-900' : 'text-amber-300'}`}>
                        {isHi ? 'कोई संबंधित सरकारी योजना नहीं मिली' : 'No Matching Welfare Scheme Found'}
                      </h4>
                      <p className={`text-xs mt-1 leading-relaxed font-medium ${isLight ? 'text-amber-950/90' : 'text-slate-200'}`}>
                        {aiReply}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSpeakText(aiReply)}
                    className={`p-2 rounded-xl shrink-0 cursor-pointer transition-all ${
                      isLight
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                        : 'bg-white/[0.05] hover:bg-white/[0.1] text-amber-400'
                    }`}
                    title="Listen again"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div
                  className={`pt-2 border-t flex flex-wrap items-center justify-between gap-2 ${
                    isLight ? 'border-amber-200 text-amber-900' : 'border-amber-500/20 text-slate-300'
                  }`}
                >
                  <span className="text-[11px] font-semibold">
                    {isHi ? '💡 कृपया अपनी आवश्यकता को विस्तार से बोलें:' : '💡 Please speak your requirement in detail:'}
                  </span>

                  <button
                    onClick={() => setShowAllSchemes(true)}
                    className={`text-xs font-bold underline cursor-pointer ml-auto ${
                      isLight ? 'text-orange-600 hover:text-orange-700' : 'text-orange-400 hover:text-orange-300'
                    }`}
                  >
                    {isHi ? 'सभी 12 योजनाएं देखें →' : 'Browse All 12 Schemes →'}
                  </button>
                </div>
              </motion.div>
            ) : null}

          </div>

          {/* Modal Bottom Bar */}
          <div
            className={`px-6 py-4 border-t flex items-center justify-between transition-colors z-20 ${
              isLight
                ? 'bg-slate-50/90 border-slate-200/90 text-slate-600'
                : 'bg-white/[0.02] border-white/[0.08]'
            }`}
          >
            <p className={`text-[11px] font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span className="text-sm">🇮🇳</span>
              <span>
                {isHi
                  ? 'सभी योजनाएं आधिकारिक gazette से सत्यापित हैं।'
                  : 'Official gazetted portal verification.'}
              </span>
            </p>
            <button
              onClick={onClose}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-2xs'
                  : 'bg-white/[0.08] hover:bg-white/[0.14] text-white'
              }`}
            >
              {isHi ? 'बंद करें' : 'Close'}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
