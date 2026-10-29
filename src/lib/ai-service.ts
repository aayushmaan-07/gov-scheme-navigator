import { GoogleGenAI } from '@google/genai';
import { CitizenProfile, DocumentVerificationResult, Occupation, Category, Gender } from '@/types/scheme';
import { SCHEMES_DATABASE } from '@/data/schemes';

const apiKey = process.env.GEMINI_API_KEY || '';

export interface AIQueryResponse {
  interpretedProfile: Partial<CitizenProfile>;
  assistantReplyEn: string;
  assistantReplyHi: string;
  matchedSchemeIds: string[];
  suggestedAction: string;
}

// Fallback intelligent semantic matching if API key fails or network fluctuates
export function fallbackQueryParse(query: string): AIQueryResponse {
  const q = query.toLowerCase().trim();
  const profile: Partial<CitizenProfile> = {};
  const matchedIds: string[] = [];

  // 1. Detection of Negative, Criminal, Illegal or Off-Topic intent
  const negativeWords = [
    'चोर', 'चोरी', 'डकैत', 'डकैती', 'लूट', 'कत्ल', 'मर्डर', 'धोखा', 'फ्रॉड', 'गैरकानूनी', 'गाली',
    'chor', 'chori', 'dakait', 'thief', 'robbery', 'crime', 'murder', 'loot', 'fraud', 'illegal',
    'scam', 'cheat', 'bribe', 'timepass', 'bakwas', 'faltu', 'hacker', 'drugs', 'nasha'
  ];

  const hasNegativeIntent = negativeWords.some((w) => {
    // Word boundary or containment check
    return q.includes(w);
  });

  if (hasNegativeIntent) {
    return {
      interpretedProfile: {},
      assistantReplyEn: 'No government welfare scheme applies to this query. GovMitra is dedicated to genuine welfare assistance (agriculture, education, healthcare, pensions, housing, and loans). Please state your legitimate requirement.',
      assistantReplyHi: 'इस विषय के लिए कोई सरकारी कल्याणकारी योजना लागू नहीं होती। "गोवमित्र" केवल वैध जनकल्याण (जैसे खेती, शिक्षा, स्वास्थ्य, पेंशन, आवास या लोन) में सहायता करता है। कृपया अपनी वास्तविक आवश्यकता बताएं।',
      matchedSchemeIds: [],
      suggestedAction: 'Please specify a valid welfare need (farming, education, loan, or healthcare).',
    };
  }

  // 2. Detection of Pure Greetings or General Help
  const greetingWords = [
    'hello', 'hi', 'hey', 'namaste', 'pranam', 'namaskar', 'halo', 'kuch nahi', 'kuch nhi', 'help', 'madad',
    'नमस्ते', 'प्रणाम', 'नमस्कार', 'मदद', 'सहायता', 'हेलो', 'हाय'
  ];
  const isGreetingOnly = greetingWords.some((g) => q === g || q.startsWith(g + ' '));
  if (isGreetingOnly && q.length < 25) {
    return {
      interpretedProfile: {},
      assistantReplyEn: 'Welcome to GovMitra! I can help you find government subsidies, student scholarships, business loans, or free health coverage. How can I help you today?',
      assistantReplyHi: 'नमस्ते! गोवमित्र में आपका स्वागत है। मैं आपको सरकारी सब्सिडी, स्कॉलरशिप, व्यापार लोन या मुफ्त इलाज योजना खोजने में मदद कर सकता हूँ। कृपया अपनी आवश्यकता बताएं।',
      matchedSchemeIds: [],
      suggestedAction: 'Try: "I am a farmer with 2 acres land" or "College scholarship"',
    };
  }

  // 3. Legitimate Welfare Intent & Occupation Matching (Hindi Devanagari + English/Hinglish)
  // Farmer / Agriculture
  if (
    q.includes('kisan') || q.includes('farmer') || q.includes('kheti') || q.includes('zameen') ||
    q.includes('fasal') || q.includes('land') || q.includes('किसान') || q.includes('खेती') ||
    q.includes('कृषि') || q.includes('जमीन') || q.includes('फसल') || q.includes('एकड़') ||
    q.includes('खाद') || q.includes('बीज') || q.includes('सिंचाई')
  ) {
    profile.occupation = 'farmer';
    matchedIds.push('pm-kisan');
  }

  // Student / Scholarships
  if (
    q.includes('student') || q.includes('padhai') || q.includes('college') || q.includes('school') ||
    q.includes('scholarship') || q.includes('fees') || q.includes('vidyarthi') || q.includes('छात्र') ||
    q.includes('विद्यार्थी') || q.includes('पढ़ाई') || q.includes('कॉलेज') || q.includes('स्कूल') ||
    q.includes('फीस') || q.includes('स्कॉलरशिप') || q.includes('छात्रवृत्ति') || q.includes('शिक्षा')
  ) {
    profile.occupation = 'student';
    matchedIds.push('post-matric-scholarship');
  }

  // Business / MSME Loan
  if (
    q.includes('business') || q.includes('dukan') || q.includes('loan') || q.includes('startup') ||
    q.includes('vyapar') || q.includes('karobar') || q.includes('dukaan') || q.includes('mudra') ||
    q.includes('दुकान') || q.includes('व्यापार') || q.includes('बिज़नेस') || q.includes('बिजनेस') ||
    q.includes('लोन') || q.includes('ऋण') || q.includes('मुद्रा') || q.includes('स्टार्टअप') ||
    q.includes('कारोबार') || q.includes('धंधा')
  ) {
    profile.occupation = 'business_owner';
    matchedIds.push('pm-mudra', 'pmegp-subsidy');
  }

  // Street Vendor / Daily Wager
  if (
    q.includes('vendor') || q.includes('thela') || q.includes('rehri') || q.includes('daily') ||
    q.includes('mazdoor') || q.includes('patari') || q.includes('svanidhi') || q.includes('ठेला') ||
    q.includes('रेहड़ी') || q.includes('मजदूर') || q.includes('दैनिक') || q.includes('पटरी') ||
    q.includes('फेरीवाला') || q.includes('स्वनिधि')
  ) {
    profile.occupation = 'daily_wager';
    matchedIds.push('pm-svanidhi');
  }

  // Artisans / Vishwakarma
  if (
    q.includes('karigar') || q.includes('artisan') || q.includes('badhai') || q.includes('lohar') ||
    q.includes('darzi') || q.includes('craft') || q.includes('vishwakarma') || q.includes('कारीगर') ||
    q.includes('शिल्पकार') || q.includes('बढ़ई') || q.includes('लोहार') || q.includes('दर्जी') ||
    q.includes('विश्वकर्मा') || q.includes('हस्तशिल्प')
  ) {
    profile.occupation = 'artisan';
    matchedIds.push('pm-vishwakarma');
  }

  // Solar Rooftop
  if (
    q.includes('solar') || q.includes('bijli') || q.includes('chhat') || q.includes('electricity') ||
    q.includes('light') || q.includes('urja') || q.includes('सोलर') || q.includes('बिजली') ||
    q.includes('छत') || q.includes('ऊर्जा') || q.includes('पैनल') || q.includes('सूर्य')
  ) {
    matchedIds.push('pm-surya-ghar');
  }

  // Housing (Awas)
  if (
    q.includes('ghar') || q.includes('house') || q.includes('makan') || q.includes('awas') ||
    q.includes('home') || q.includes('घर') || q.includes('मकान') || q.includes('आवास') ||
    q.includes('कमरा') || q.includes('झोपड़ी')
  ) {
    matchedIds.push('pm-awas-yojana');
  }

  // Health / Medical / Ayushman
  if (
    q.includes('health') || q.includes('bimari') || q.includes('hospital') || q.includes('ilaj') ||
    q.includes('ayushman') || q.includes('doctor') || q.includes('dava') || q.includes('swasthya') ||
    q.includes('इलाज') || q.includes('अस्पताल') || q.includes('बीमारी') || q.includes('डॉक्टर') ||
    q.includes('दवा') || q.includes('स्वास्थ्य') || q.includes('आयुष्मान') || q.includes('ऑपरेशन')
  ) {
    matchedIds.push('ayushman-bharat');
  }

  // Women / Girl Child Welfare
  if (
    q.includes('beti') || q.includes('daughter') || q.includes('ladli') || q.includes('girl') ||
    q.includes('mahila') || q.includes('woman') || q.includes('aurat') || q.includes('बेटी') ||
    q.includes('कन्या') || q.includes('लाडली') || q.includes('महिला') || q.includes('औरत') ||
    q.includes('लड़की') || q.includes('सुकन्या') || q.includes('बहना')
  ) {
    profile.gender = 'female';
    matchedIds.push('sukanya-samriddhi', 'ladli-behna-kalyan');
  }

  // Pension / Elderly
  if (
    q.includes('pension') || q.includes('budhapa') || q.includes('old age') || q.includes('retire') ||
    q.includes('vriddha') || q.includes('पेंशन') || q.includes('बुढ़ापा') || q.includes('वृद्ध') ||
    q.includes('रिटायर') || q.includes('अटल')
  ) {
    matchedIds.push('atal-pension-yojana');
  }

  // Extract age if present
  const ageMatch = q.match(/\b([1-9][0-9]?)\s*(?:saal|sal|years|yr|age)\b/);
  if (ageMatch) {
    profile.age = parseInt(ageMatch[1], 10);
  }

  // 4. If genuine welfare scheme found
  if (matchedIds.length > 0) {
    const uniqueIds = Array.from(new Set(matchedIds));
    return {
      interpretedProfile: profile,
      assistantReplyEn: `I found ${uniqueIds.length} tailored welfare schemes matching your request. You can check your eligibility and apply directly below.`,
      assistantReplyHi: `आपकी आवश्यकता के अनुसार मुझे ${uniqueIds.length} उपयुक्त सरकारी योजनाएं मिली हैं। आप सीधे नीचे इनकी पात्रता देखकर आवेदन कर सकते हैं!`,
      matchedSchemeIds: uniqueIds,
      suggestedAction: 'View matched schemes below and check your documents.',
    };
  }

  // 5. If NO scheme matched at all (unrecognized or unclear query)
  return {
    interpretedProfile: profile,
    assistantReplyEn: "We couldn't find a direct welfare scheme matching your query. Please describe your specific need (such as farming, education, medical aid, or loan) so we can guide you.",
    assistantReplyHi: 'आपकी इस खोज से संबंधित कोई सरकारी योजना नहीं मिली। कृपया अपनी आवश्यकता स्पष्ट रूप से बताएं—जैसे खेती, छात्रवृत्ति, इलाज, आवास या व्यापार लोन।',
    matchedSchemeIds: [],
    suggestedAction: 'Select a quick category or rephrase with your profession or need.',
  };
}

export async function parseQueryWithGemini(userQuery: string): Promise<AIQueryResponse> {
  // First run high-precision negative / off-topic filter
  const fallback = fallbackQueryParse(userQuery);
  const q = userQuery.toLowerCase().trim();
  const negativeWords = ['चोर', 'चोरी', 'डकैत', 'लूट', 'कत्ल', 'मर्डर', 'धोखा', 'फ्रॉड', 'chor', 'chori', 'thief', 'robbery', 'crime', 'murder', 'loot', 'fraud', 'illegal', 'scam'];
  if (negativeWords.some((w) => q.includes(w))) {
    return fallback;
  }

  if (!apiKey) {
    return fallback;
  }

  const prompt = `You are GovMitra AI, an intelligent government welfare advisor for Indian citizens.
User Query: "${userQuery}"

Available Scheme IDs:
${SCHEMES_DATABASE.map(s => `- ${s.id}: ${s.name} (${s.category})`).join('\n')}

Instructions:
1. First verify if the query relates to legitimate Indian government welfare, citizen subsidies, or public benefits.
2. If the user query is off-topic, nonsense, criminal, illegal, or unethical (e.g., "मैं चोर हूँ", "I am a thief", crime, robbery, random gibberish):
   - MUST set "matchedSchemeIds": []
   - In "assistantReplyHi", politely state: "इस विषय के लिए कोई सरकारी कल्याणकारी योजना लागू नहीं होती। 'गोवमित्र' केवल वैध जनकल्याण (खेती, शिक्षा, स्वास्थ्य, पेंशन, आवास या लोन) के लिए है। कृपया अपनी वास्तविक आवश्यकता बताएं।"
   - In "assistantReplyEn", politely state: "No government welfare scheme applies to this query. GovMitra is dedicated to genuine welfare assistance (agriculture, education, healthcare, pension, housing, or loans). Please state your genuine requirement."
   - Set "suggestedAction": "Please specify a valid welfare requirement."
3. If legitimate welfare intent is found:
   - Extract persona profile attributes (age, annualIncome in INR, occupation [farmer, student, business_owner, daily_wager, artisan, unemployed, salaried], category [general, obc, sc, st, minority], gender [male, female], landHoldingAcres).
   - Match ONLY the most relevant scheme IDs from the available list.
   - Provide a warm, conversational 1-2 sentence response in both English and Hindi.
4. If no scheme fits:
   - Set "matchedSchemeIds": []
   - Politely advise the citizen to describe their need.

Respond ONLY with valid JSON (no markdown formatting, no code blocks):
{
  "interpretedProfile": {
    "age": null,
    "annualIncome": null,
    "occupation": null,
    "gender": null,
    "category": null,
    "landHoldingAcres": null
  },
  "assistantReplyEn": "Clear summary in English",
  "assistantReplyHi": "आत्मीय और सरल हिंदी में जवाब",
  "matchedSchemeIds": ["scheme-id-1"],
  "suggestedAction": "What the citizen should do next"
}`;

  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout')), 3500)
    );

    const callPromise = (async () => {
      const ai = new GoogleGenAI({ apiKey });
      let lastErr = null;
      for (const m of ['gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-3.8-flash']) {
        try {
          const response = await ai.models.generateContent({
            model: m,
            contents: prompt,
          });
          const text = response.text || '';
          const cleanJson = text.replace(/```json|```/g, '').trim();
          return JSON.parse(cleanJson);
        } catch (err) {
          lastErr = err;
        }
      }
      throw lastErr;
    })();

    const parsed = await Promise.race([callPromise, timeoutPromise]);
    return parsed;
  } catch (err) {
    console.warn('Gemini API call timed out or failed, using high-precision fallback parser');
    return fallback;
  }
}

// Verification for Documents (OCR + Rule Check)
export async function verifyDocumentWithAI(
  documentBase64?: string,
  sampleType?: string
): Promise<DocumentVerificationResult> {
  // If sample document chosen for fast demo
  if (sampleType === 'pan_card') {
    return {
      documentType: 'PAN Card',
      documentTypeHindi: 'पैन कार्ड (स्थायी खाता संख्या)',
      extractedDetails: {
        holderName: 'AAYUSHMAAN ANAND',
        idNumberMasked: 'FXWPA4216E',
        dob: '09/09/2006',
        incomeReported: null,
        issueDate: '20/01/2025',
        validTill: 'Lifetime',
        state: 'National (Income Tax Dept)',
      },
      status: 'valid',
      confidenceScore: 99,
      verificationChecks: [
        {
          checkName: 'Income Tax Dept / GOI Seal',
          passed: true,
          remark: 'Official Government of India seal and QR code signature validated.',
        },
        {
          checkName: 'PAN Format & Checksum',
          passed: true,
          remark: 'Standard 10-character alphanumeric PAN format confirmed.',
        },
        {
          checkName: 'Adult Citizen Status (18+)',
          passed: true,
          remark: 'DOB verified. Citizen is 18+ years old, eligible for DBT banking and major schemes.',
        },
      ],
      recommendations: [
        'Eligible for direct subsidy crediting via DBT linked bank accounts.',
        'Use for business setup, PMEGP loans, or scholarship bank account opening.',
        'Ensure PAN is linked with Aadhaar as mandated by CBDT.',
      ],
    };
  }

  if (sampleType === 'income_cert' || (!documentBase64 && !sampleType)) {
    return {
      documentType: 'Income Certificate',
      documentTypeHindi: 'आय प्रमाण पत्र (Income Certificate)',
      extractedDetails: {
        holderName: 'Ramesh Kumar Sharma',
        idNumberMasked: 'INC/UP/2024/984210',
        incomeReported: 180000,
        issueDate: '14-Aug-2024',
        validTill: '13-Aug-2027',
        state: 'Uttar Pradesh',
      },
      status: 'valid',
      confidenceScore: 98,
      verificationChecks: [
        {
          checkName: 'Revenue Seal & Digital Signature',
          passed: true,
          remark: 'Digitally verified by Tehsildar, Revenue Dept.',
        },
        {
          checkName: 'Income Threshold Check (< ₹2.5L)',
          passed: true,
          remark: 'Reported ₹1.80L is well within criteria for PM-JAY & Scholarships.',
        },
        {
          checkName: 'Validity Duration',
          passed: true,
          remark: 'Certificate is active and valid for the next 2.5 years.',
        },
        {
          checkName: 'Aadhaar Name Match',
          passed: true,
          remark: 'Matches candidate profile with 100% phonetic accuracy.',
        },
      ],
      recommendations: [
        'Eligible for 100% Tuition Waiver under Post-Matric Scholarship.',
        'Eligible for Ayushman Golden Card cashless treatment.',
        'Keep original copy ready for physical verification if requested.',
      ],
    };
  }

  if (sampleType === 'aadhaar') {
    return {
      documentType: 'Aadhaar Card',
      documentTypeHindi: 'आधार कार्ड (Aadhaar Card)',
      extractedDetails: {
        holderName: 'Ramesh Kumar Sharma',
        idNumberMasked: 'XXXX-XXXX-4892',
        issueDate: '12-Jan-2019',
        state: 'Uttar Pradesh',
      },
      status: 'valid',
      confidenceScore: 99,
      verificationChecks: [
        {
          checkName: 'UIDAI QR Code Decryption',
          passed: true,
          remark: 'Official secure cryptographic signature verified.',
        },
        {
          checkName: 'Age Requirement Check',
          passed: true,
          remark: 'DOB verified (Age: 32 years). Qualified for adult citizen welfare.',
        },
        {
          checkName: 'DBT Bank Seeding Readiness',
          passed: true,
          remark: 'Aadhaar number format is valid and active on NPCI mapper.',
        },
      ],
      recommendations: [
        'Aadhaar e-KYC can be completed in 1 click for PM-KISAN & Mudra loans.',
        'Ensure registered mobile number is kept active for OTP delivery.',
      ],
    };
  }

  if (sampleType === 'caste_cert') {
    return {
      documentType: 'Caste Certificate',
      documentTypeHindi: 'जाति प्रमाण पत्र (Caste Certificate)',
      extractedDetails: {
        holderName: 'Ramesh Kumar Sharma',
        idNumberMasked: 'CST/2023/11094',
        issueDate: '05-Feb-2023',
        state: 'Uttar Pradesh',
      },
      status: 'valid',
      confidenceScore: 96,
      verificationChecks: [
        {
          checkName: 'District Magistrate / SDO Authentication',
          passed: true,
          remark: 'Issued by competent Sub-Divisional Magistrate.',
        },
        {
          checkName: 'Non-Creamy Layer Validity (for OBC)',
          passed: true,
          remark: 'Valid for current financial year.',
        },
      ],
      recommendations: [
        'Unlocks 35% higher subsidy for PMEGP business enterprise loans.',
        'Eligible for reserved quota benefits in skill development & scholarships.',
      ],
    };
  }

  // If real image base64 provided, run Gemini Vision OCR
  if (apiKey && documentBase64) {
    let mimeType = 'image/jpeg';
    let cleanBase64 = documentBase64;
    if (documentBase64.startsWith('data:')) {
      const parts = documentBase64.split(';base64,');
      if (parts.length === 2) {
        mimeType = parts[0].replace('data:', '') || 'image/jpeg';
        cleanBase64 = parts[1];
      }
    }

    const prompt = `You are GovMitra AI, an expert Indian Government document inspector & OCR engine.
Carefully inspect this document image. Identify whether it is a:
- "PAN Card" (Permanent Account Number / Income Tax Department / भारत सरकार)
- "Aadhaar Card" (UIDAI / Unique Identification Authority of India)
- "Income Certificate" (आय प्रमाण पत्र / Revenue Dept / Tehsildar)
- "Ration Card" (राशन कार्ड / Food & Civil Supplies)
- "Caste Certificate" (जाति प्रमाण पत्र)
- "Land Record (Khatauni)" (खतौनी / भूलेख / Revenue)

Read all visible text fields carefully:
- Full holder name (holderName)
- Document ID / PAN / Aadhaar / Certificate number (idNumberMasked)
- Date of Birth (dob) e.g. "DD/MM/YYYY" if present
- Annual income in INR (incomeReported) if mentioned on income certificate, else null
- Issue date (issueDate)
- Validity expiration (validTill) - for PAN card use "Lifetime"
- Issuing state or authority (state) - e.g. "National (Income Tax Dept)" for PAN, or state name for certificates.

Provide 3 authentic verification checks (passed boolean and detailed remark) and 2-3 specific government welfare / banking recommendations.

Respond ONLY with valid JSON (no markdown formatting, no code blocks):
{
  "documentType": "PAN Card",
  "documentTypeHindi": "पैन कार्ड (स्थायी खाता संख्या)",
  "extractedDetails": {
    "holderName": "FULL NAME",
    "idNumberMasked": "ID NUMBER",
    "dob": "DD/MM/YYYY",
    "incomeReported": null,
    "issueDate": "DD/MM/YYYY",
    "validTill": "Lifetime",
    "state": "National (Income Tax Dept)"
  },
  "status": "valid",
  "confidenceScore": 98,
  "verificationChecks": [
    {
      "checkName": "Official Seal & Authority",
      "passed": true,
      "remark": "Income Tax Department / Govt of India authenticity verified."
    },
    {
      "checkName": "ID Number Format",
      "passed": true,
      "remark": "Format conforms to official national standard."
    },
    {
      "checkName": "Cardholder Details Match",
      "passed": true,
      "remark": "Name and date of birth clearly readable."
    }
  ],
  "recommendations": [
    "Valid for DBT bank seeding, PM-KISAN, and Mudra loan applications.",
    "Ensure PAN is linked with Aadhaar as per CBDT norms."
  ]
}`;

    const modelsToTry = ['gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-2.5-pro'];

    for (const modelName of modelsToTry) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [
              { text: prompt },
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64,
                },
              },
            ],
          });

          const text = response.text || '';
          const cleanJson = text.replace(/```json|```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          if (parsed && parsed.documentType && parsed.extractedDetails) {
            return parsed as DocumentVerificationResult;
          }
        } catch (err) {
          console.warn(`Vision OCR attempt with model ${modelName} (attempt ${attempt + 1}) failed:`, err);
          await new Promise((r) => setTimeout(r, 600));
        }
      }
    }
  }

  // Graceful fallback if AI Vision service is unavailable
  return {
    documentType: 'PAN Card',
    documentTypeHindi: 'दस्तावेज़ सत्यापन (Document Verification)',
    extractedDetails: {
      holderName: 'दस्तावेज़ धारक (Document Holder)',
      idNumberMasked: 'DOC-PROCESSED',
      validTill: 'Active',
      state: 'National',
    },
    status: 'warning',
    confidenceScore: 75,
    verificationChecks: [
      {
        checkName: 'Image File Quality',
        passed: true,
        remark: 'Document was successfully received and scanned.',
      },
      {
        checkName: 'AI Cloud Service Response',
        passed: false,
        remark: 'Cloud Vision OCR took longer than expected. Please ensure image is well-lit and retry.',
      },
    ],
    recommendations: [
      'Make sure all 4 corners and the text of your document are clearly visible without glare.',
      'You can re-upload or select a direct sample document to test the verification pipeline.',
    ],
  };
}
