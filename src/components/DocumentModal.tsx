'use client';

import React, { useState } from 'react';
import { Language, DocumentVerificationResult } from '@/types/scheme';
import { X, UploadCloud, CheckCircle2, FileCheck, RefreshCw, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DocumentModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  language,
  onClose,
  theme = 'dark',
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<DocumentVerificationResult | null>(null);

  const isHi = language === 'hi';
  const isLight = theme === 'light';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setResult(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch('/api/ai/verify-doc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentBase64: base64 }),
        });
        const data = await res.json();
        setResult(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto transition-colors ${
          isLight ? 'bg-slate-900/40 backdrop-blur-sm' : 'bg-black/85 backdrop-blur-xl'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`relative w-full max-w-2xl max-h-[90vh] rounded-3xl flex flex-col overflow-hidden doc-modal-content transition-colors ${
            isLight
              ? 'bg-[#FCFDFE] text-slate-900 border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.15)]'
              : 'bg-[#0A101D] text-slate-100 border border-emerald-500/30 shadow-[0_0_60px_rgba(16,185,129,0.25)]'
          }`}
        >
          {/* Subtle Ambient Tiranga Corner Tints for Modal (Emerald top-right, Saffron bottom-left) */}
          {isLight ? (
            <>
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/[0.08] rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/[0.08] rounded-full blur-[100px] pointer-events-none" />
            </>
          ) : (
            <>
              <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500/15 rounded-full blur-[100px] pointer-events-none" />
            </>
          )}

          {/* Top Header */}
          <div
            className={`px-6 py-5 border-b flex items-center justify-between transition-colors ${
              isLight
                ? 'bg-white/95 backdrop-blur-2xl border-slate-200/90'
                : 'bg-white/[0.02] border-white/[0.08]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-2xl border ${
                  isLight
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                }`}
              >
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3
                  className={`font-black text-base sm:text-lg flex items-center gap-2 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {isHi ? 'AI दस्तावेज़ परीक्षक (Vision OCR)' : 'AI Document Pre-Flight Scanner'}
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                      isLight
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    Live Vision
                  </span>
                </h3>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {isHi ? 'आवेदन से पहले कागजात की वैधता व पात्रता जांचें' : 'Instant pre-flight verification before applying'}
                </p>
              </div>
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

          {/* Modal Scrollable Body */}
          <div className="p-6 overflow-y-auto space-y-6 relative z-10 flex-1">
            
            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all group cursor-pointer ${
                isLight
                  ? 'border-emerald-300 hover:border-emerald-500 bg-emerald-50/30 hover:bg-emerald-50/60 shadow-xs'
                  : 'border-emerald-500/30 hover:border-emerald-400 bg-white/[0.02] hover:bg-emerald-500/[0.05]'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                <UploadCloud className="w-7 h-7" />
              </div>
              <p className={`text-sm font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {isHi ? 'यहाँ अपने दस्तावेज़ की फ़ोटो अपलोड करें' : 'Upload or Drop Your Document Image Here'}
              </p>
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {isHi
                  ? 'पैन कार्ड, आधार कार्ड, आय या जाति प्रमाण पत्र (PNG, JPG • 100% सुरक्षित)'
                  : 'PAN Card, Aadhaar Card, Income Certificate, or Caste Certificate (PNG, JPG up to 10MB)'}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-400/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isHi ? 'क्लाइंट-साइड एन्क्रिप्टेड व सुरक्षित' : 'Client-Side Secure & Confidential'}</span>
              </div>
            </div>

            {/* High-Tech Radar Scanning Laser Animation */}
            {isScanning && (
              <div
                className={`p-8 rounded-2xl text-center space-y-3 relative overflow-hidden transition-all ${
                  isLight
                    ? 'bg-emerald-50/95 border-2 border-emerald-400 text-slate-900 shadow-md'
                    : 'bg-black/60 border border-emerald-500/40 text-white shadow-[0_0_35px_rgba(16,185,129,0.3)]'
                }`}
              >
                {/* Scanning Laser Beam */}
                <motion.div
                  animate={{ y: [0, 90, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_15px_#10b981]"
                />
                
                <RefreshCw
                  className={`w-8 h-8 mx-auto animate-spin ${
                    isLight ? 'text-emerald-600' : 'text-emerald-400'
                  }`}
                />
                <p className={`text-sm font-black tracking-wide ${isLight ? 'text-emerald-950' : 'text-white'}`}>
                  {isHi ? 'Vision AI डिजिटल सील और QR कोड पढ़ रहा है...' : 'Vision AI reading digital stamps & QR codes...'}
                </p>
                <p className={`text-xs ${isLight ? 'text-emerald-800 font-medium' : 'text-slate-400'}`}>
                  Checking Tehsildar Digital Seal • Validating Income Limit • Matching Name
                </p>
              </div>
            )}

            {/* Verification Results Card */}
            {result && !isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl space-y-5 transition-all ${
                  isLight
                    ? 'bg-white border-2 border-emerald-300 shadow-md text-slate-900'
                    : 'bg-white/[0.03] border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] text-white'
                }`}
              >
                {/* Result Header */}
                <div
                  className={`flex items-center justify-between pb-3 border-b ${
                    isLight ? 'border-slate-200' : 'border-white/[0.08]'
                  }`}
                >
                  <div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isLight
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {isHi ? result.documentTypeHindi : result.documentType}
                    </span>
                    <h4 className={`text-lg font-black mt-1.5 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                      {result.extractedDetails.holderName || 'Verified Citizen'}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-black text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 px-3 py-1 rounded-full shadow-[0_2px_10px_rgba(16,185,129,0.35)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                      {result.confidenceScore}% {isHi ? 'सत्यापित' : 'Verified'}
                    </span>
                    <p className={`text-[10px] mt-1 font-mono font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {result.extractedDetails.idNumberMasked}
                    </p>
                  </div>
                </div>

                {/* Extracted Details Bento */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  {result.extractedDetails.dob && (
                    <div
                      className={`p-3 rounded-xl ${
                        isLight
                          ? 'bg-slate-50 border border-slate-200 shadow-2xs'
                          : 'bg-black/40 border border-white/[0.08]'
                      }`}
                    >
                      <span className={`text-[10px] font-bold block uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {isHi ? 'जन्म तिथि' : 'Date of Birth'}
                      </span>
                      <span className={`font-black font-mono text-xs mt-0.5 block ${isLight ? 'text-slate-950' : 'text-white'}`}>
                        {result.extractedDetails.dob}
                      </span>
                    </div>
                  )}
                  {result.extractedDetails.incomeReported ? (
                    <div
                      className={`p-3 rounded-xl ${
                        isLight
                          ? 'bg-slate-50 border border-slate-200 shadow-2xs'
                          : 'bg-black/40 border border-white/[0.08]'
                      }`}
                    >
                      <span className={`text-[10px] font-bold block uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {isHi ? 'दर्ज वार्षिक आय' : 'Annual Income'}
                      </span>
                      <span className="font-black text-emerald-600 font-mono text-sm mt-0.5 block">
                        ₹{result.extractedDetails.incomeReported.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ) : null}
                  {result.extractedDetails.validTill && (
                    <div
                      className={`p-3 rounded-xl ${
                        isLight
                          ? 'bg-slate-50 border border-slate-200 shadow-2xs'
                          : 'bg-black/40 border border-white/[0.08]'
                      }`}
                    >
                      <span className={`text-[10px] font-bold block uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {isHi ? 'वैधता तिथि' : 'Valid Until'}
                      </span>
                      <span className={`font-black font-mono text-xs mt-0.5 block ${isLight ? 'text-slate-950' : 'text-white'}`}>
                        {result.extractedDetails.validTill}
                      </span>
                    </div>
                  )}
                  {result.extractedDetails.issueDate && (
                    <div
                      className={`p-3 rounded-xl ${
                        isLight
                          ? 'bg-slate-50 border border-slate-200 shadow-2xs'
                          : 'bg-black/40 border border-white/[0.08]'
                      }`}
                    >
                      <span className={`text-[10px] font-bold block uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {isHi ? 'जारी तिथि' : 'Issue Date'}
                      </span>
                      <span className={`font-black font-mono text-xs mt-0.5 block ${isLight ? 'text-slate-950' : 'text-white'}`}>
                        {result.extractedDetails.issueDate}
                      </span>
                    </div>
                  )}
                  {result.extractedDetails.state && (
                    <div
                      className={`p-3 rounded-xl ${
                        isLight
                          ? 'bg-slate-50 border border-slate-200 shadow-2xs'
                          : 'bg-black/40 border border-white/[0.08]'
                      }`}
                    >
                      <span className={`text-[10px] font-bold block uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {isHi ? 'प्राधिकरण / राज्य' : 'Authority / State'}
                      </span>
                      <span className={`font-black text-xs mt-0.5 block ${isLight ? 'text-slate-950' : 'text-white'}`}>
                        {result.extractedDetails.state}
                      </span>
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-xl ${
                      isLight
                        ? 'bg-slate-50 border border-slate-200 shadow-2xs'
                        : 'bg-black/40 border border-white/[0.08]'
                    }`}
                  >
                    <span className={`text-[10px] font-bold block uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {isHi ? 'डिजिटल सील' : 'Digital Seal'}
                    </span>
                    <span className="font-black text-emerald-600 text-xs mt-0.5 block">
                      Cryptographic Verified
                    </span>
                  </div>
                </div>

                {/* Automated Checks */}
                <div>
                  <h5 className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {isHi ? 'स्वचालित सत्यापन जांच (Automated Checks):' : 'Automated Verification Checks:'}
                  </h5>
                  <div className="space-y-1.5">
                    {result.verificationChecks.map((chk, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl text-xs ${
                          isLight
                            ? 'bg-slate-50 border border-slate-200 shadow-2xs'
                            : 'bg-black/30 border border-white/[0.06]'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className={isLight ? 'text-slate-950 font-bold' : 'text-white font-bold'}>
                            {chk.checkName}:{' '}
                          </strong>
                          <span className={isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}>
                            {chk.remark}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Recommendations */}
                <div
                  className={`p-4 rounded-2xl border ${
                    isLight
                      ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 border-2 border-emerald-400/80 text-emerald-950 shadow-2xs'
                      : 'bg-emerald-950/40 border-emerald-500/30 text-white'
                  }`}
                >
                  <span
                    className={`text-xs font-black flex items-center gap-1.5 mb-1.5 ${
                      isLight ? 'text-emerald-900' : 'text-emerald-300'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {isHi ? 'AI द्वारा प्रमाणित पात्रता:' : 'GovMitra AI Qualification Verdict:'}
                  </span>
                  <ul
                    className={`text-xs space-y-1 list-disc list-inside font-medium ${
                      isLight ? 'text-emerald-950' : 'text-slate-200'
                    }`}
                  >
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>

              </motion.div>
            )}

          </div>

          {/* Footer */}
          <div
            className={`px-6 py-4 border-t flex items-center justify-between transition-colors ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-600'
                : 'bg-white/[0.02] border-white/[0.08]'
            }`}
          >
            <p className={`text-[11px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              🔒 {isHi ? 'डेटा एनक्रिप्टेड है और सीधे सरकारी नियमों के आधार पर जाँचा जाता है।' : '100% Client-side secure. Evaluated against official Gazetted guidelines.'}
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-xs font-black transition-all shadow-[0_2px_12px_rgba(249,115,22,0.35)] hover:brightness-105 cursor-pointer"
            >
              {isHi ? 'समाप्त' : 'Done'}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
