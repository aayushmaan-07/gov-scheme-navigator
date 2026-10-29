export type Language = 'en' | 'hi';

export type Occupation =
  | 'all'
  | 'farmer'
  | 'student'
  | 'business_owner'
  | 'daily_wager'
  | 'artisan'
  | 'unemployed'
  | 'salaried';

export type Category = 'all' | 'general' | 'obc' | 'sc' | 'st' | 'minority';

export type Gender = 'all' | 'male' | 'female';

export interface CitizenProfile {
  age: number;
  annualIncome: number; // in INR
  occupation: Occupation;
  category: Category;
  gender: Gender;
  state: string;
  landHoldingAcres: number; // For farmers
  hasDisability: boolean;
}

export interface Scheme {
  id: string;
  name: string;
  nameHindi: string;
  ministry: string;
  ministryHindi: string;
  category:
    | 'Agriculture'
    | 'Healthcare'
    | 'Business & Startup'
    | 'Education'
    | 'Housing & Energy'
    | 'Social Security'
    | 'Artisans & Crafts';
  categoryHindi: string;
  tags: string[];
  tagsHindi: string[];
  benefitAmountDisplay: string;
  benefitAmountDisplayHindi: string;
  benefitAmountValue: number; // Estimated annual or one-time monetary value in INR
  benefitType: 'Direct Cash' | 'Subsidy' | 'Loan' | 'Free Service' | 'Pension' | 'Scholarship';
  imageUrl: string; // High-resolution real scheme showcase photo
  
  // Eligibility criteria
  eligibility: {
    minAge?: number;
    maxAge?: number;
    maxAnnualIncome?: number; // Maximum income to qualify
    genders?: Gender[];
    occupations?: Occupation[];
    categories?: Category[];
    maxLandAcres?: number;
    requiredStates?: string[]; // Empty means Pan-India
  };

  // Plain-language 3 key points (ELI10 - Explain Like I'm 10)
  eli5: {
    whoGetsIt: string;
    whoGetsItHindi: string;
    whatYouGet: string;
    whatYouGetHindi: string;
    howToApply: string;
    howToApplyHindi: string;
  };

  documentsRequired: {
    name: string;
    nameHindi: string;
    isMandatory: boolean;
    description: string;
  }[];

  applicationUrl: string;
  portalName: string;
  scamWarning: string;
  scamWarningHindi: string;
  helplineNumber?: string;
}

export interface DocumentVerificationResult {
  documentType: 'Aadhaar Card' | 'PAN Card' | 'Income Certificate' | 'Ration Card' | 'Caste Certificate' | 'Land Record (Khatauni)';
  documentTypeHindi: string;
  extractedDetails: {
    holderName?: string;
    idNumberMasked?: string;
    dob?: string;
    incomeReported?: number | null;
    issueDate?: string;
    validTill?: string;
    state?: string;
  };
  status: 'valid' | 'warning' | 'rejected';
  confidenceScore: number;
  verificationChecks: {
    checkName: string;
    passed: boolean;
    remark: string;
  }[];
  recommendations: string[];
}
