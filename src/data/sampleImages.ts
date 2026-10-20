export interface SamplePhoto {
  id: string;
  titleUrdu: string;
  titleEnglish: string;
  category: string;
  era: string;
  description: string;
  promptSuggestion: string;
  sampleSvg: string; // fallback SVG representation to ensure instant visual preview
}

export const SAMPLE_PHOTOS: SamplePhoto[] = [
  {
    id: 'pearl-dhow',
    titleUrdu: 'روایتی لکڑی کی کشتی اور غوطہ خور (1950 سے قبل)',
    titleEnglish: 'Traditional Pearling Dhow & Arabian Gulf Divers (Pre-1950)',
    category: 'Historical Heritage',
    era: '1940s-1950s',
    description: 'Archival depiction of wooden dhow vessels in the Arabian Gulf where Emirati divers harvested natural pearls before oil discovery.',
    promptSuggestion: 'Analyze this pre-oil pearl diving era photograph. Describe the visual composition, hardships, and write 2 solemn Urdu documentary narration lines.',
    sampleSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
      <defs>
        <linearGradient id="sky1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#b45309"/>
          <stop offset="50%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#fef3c7"/>
        </linearGradient>
        <linearGradient id="sea1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0f766e"/>
          <stop offset="100%" stop-color="#042f2e"/>
        </linearGradient>
      </defs>
      <rect width="400" height="150" fill="url(#sky1)"/>
      <circle cx="200" cy="110" r="38" fill="#fffbeb" opacity="0.9"/>
      <rect y="150" width="400" height="100" fill="url(#sea1)"/>
      <!-- Dhow silhouette -->
      <path d="M 80 160 C 130 190, 240 190, 310 155 L 290 150 C 230 155, 140 155, 95 150 Z" fill="#292524"/>
      <line x1="170" y1="150" x2="160" y2="70" stroke="#292524" stroke-width="4"/>
      <path d="M 160 70 L 250 145 L 165 145 Z" fill="#44403c" opacity="0.95"/>
      <line x1="240" y1="150" x2="235" y2="90" stroke="#292524" stroke-width="3"/>
      <path d="M 235 90 L 285 145 L 238 145 Z" fill="#44403c" opacity="0.9"/>
      <text x="200" y="235" fill="#facc15" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="2">HISTORICAL PEARL DHOW (ARCHIVAL ARABIAN GULF)</text>
    </svg>`,
  },
  {
    id: 'oil-rig-1958',
    titleUrdu: '1958 باب-2 اور اُم شیف کا پہلا آئل ڈرلنگ ریگ',
    titleEnglish: '1958 Bab-2 & Umm Shaif First Oil Rig Discovery',
    category: 'Energy Discovery',
    era: '1958-1962',
    description: 'The monumental moment when oil exploration struck vast reserves at Bab-2 and offshore Umm Shaif in Abu Dhabi.',
    promptSuggestion: 'Evaluate this oil exploration photo. How does the industrial rig symbolize the shift from scarcity to black gold? Provide Urdu documentary narration.',
    sampleSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
      <defs>
        <linearGradient id="desert" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#78350f"/>
          <stop offset="60%" stop-color="#b45309"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <rect width="400" height="250" fill="url(#desert)"/>
      <!-- Sand dunes -->
      <path d="M 0 180 Q 120 130 240 190 T 400 170 L 400 250 L 0 250 Z" fill="#92400e" opacity="0.8"/>
      <!-- Oil derrick structure -->
      <polygon points="180,60 220,60 235,210 165,210" fill="none" stroke="#1c1917" stroke-width="3"/>
      <line x1="180" y1="60" x2="235" y2="210" stroke="#1c1917" stroke-width="2"/>
      <line x1="220" y1="60" x2="165" y2="210" stroke="#1c1917" stroke-width="2"/>
      <line x1="175" y1="100" x2="225" y2="100" stroke="#1c1917" stroke-width="2"/>
      <line x1="170" y1="140" x2="230" y2="140" stroke="#1c1917" stroke-width="2"/>
      <line x1="166" y1="180" x2="234" y2="180" stroke="#1c1917" stroke-width="2"/>
      <circle cx="200" cy="50" r="10" fill="#dc2626" opacity="0.9"/>
      <text x="200" y="240" fill="#fef08a" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="2">ABU DHABI 1958: BAB-2 OIL DISCOVERY</text>
    </svg>`,
  },
  {
    id: 'union-1971',
    titleUrdu: '2 دسمبر 1971: یونین ہاؤس اور شیخ زاید کا خواب',
    titleEnglish: 'Dec 2, 1971: Union House & The Founding of UAE',
    category: 'Founding History',
    era: '1971',
    description: 'The historic summit at Union House in Dubai where the Rulers signed the Constitution and hoisted the UAE flag.',
    promptSuggestion: 'Analyze the significance of the 1971 UAE Union. Highlight Sheikh Zayed’s governance model and provide an inspiring Urdu narration block.',
    sampleSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
      <rect width="400" height="250" fill="#0f172a"/>
      <!-- UAE flag colors bar -->
      <rect x="50" y="40" width="40" height="120" fill="#dc2626"/>
      <rect x="90" y="40" width="180" height="40" fill="#16a34a"/>
      <rect x="90" y="80" width="180" height="40" fill="#f8fafc"/>
      <rect x="90" y="120" width="180" height="40" fill="#020617"/>
      <!-- Flagpole -->
      <line x1="50" y1="20" x2="50" y2="210" stroke="#94a3b8" stroke-width="4"/>
      <!-- Union house pillar motif -->
      <rect x="300" y="70" width="60" height="130" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <text x="200" y="235" fill="#38bdf8" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="2">UNION HOUSE 1971: BIRTH OF THE FEDERATION</text>
    </svg>`,
  },
  {
    id: 'burj-skyline',
    titleUrdu: 'جدید دبئی: برج خلیفہ اور مستقبل کا شہر',
    titleEnglish: 'Modern Dubai: Burj Khalifa & The Futuristic Metropolis',
    category: 'Modern Wonder',
    era: 'Present Day',
    description: 'The record-breaking skyline of Downtown Dubai centered around the 828-meter Burj Khalifa surrounded by highways and mega-malls.',
    promptSuggestion: 'Analyze this modern architectural marvel. Contrast it with the empty desert of 70 years ago, highlighting economic transformation.',
    sampleSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
      <defs>
        <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="70%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#311042"/>
        </linearGradient>
      </defs>
      <rect width="400" height="250" fill="url(#nightSky)"/>
      <!-- Glowing stars -->
      <circle cx="80" cy="40" r="1.5" fill="#fff"/>
      <circle cx="320" cy="50" r="1.5" fill="#fff"/>
      <!-- Skyline silhouettes -->
      <rect x="40" y="140" width="45" height="110" fill="#0f172a"/>
      <rect x="90" y="110" width="35" height="140" fill="#1e293b"/>
      <rect x="270" y="120" width="40" height="130" fill="#1e293b"/>
      <rect x="315" y="150" width="50" height="100" fill="#0f172a"/>
      <!-- Burj Khalifa center -->
      <polygon points="198,15 202,15 204,60 208,120 215,190 220,250 180,250 185,190 192,120 196,60" fill="#38bdf8" opacity="0.85"/>
      <line x1="200" y1="5" x2="200" y2="250" stroke="#f0f9ff" stroke-width="1.5"/>
      <!-- Highway light trails -->
      <path d="M 0 240 Q 200 210 400 245" stroke="#f59e0b" stroke-width="4" fill="none" opacity="0.8"/>
      <path d="M 0 245 Q 200 215 400 250" stroke="#ef4444" stroke-width="3" fill="none" opacity="0.8"/>
      <text x="200" y="240" fill="#e0f2fe" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="2">DOWNTOWN DUBAI: 828M BURJ KHALIFA</text>
    </svg>`,
  },
];
