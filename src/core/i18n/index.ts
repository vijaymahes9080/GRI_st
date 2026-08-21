export type Language = 'en' | 'ta';

export const translations = {
  en: {
    welcome: 'Welcome to Gandhigram Rural Institute',
    loginTitle: 'GRI Student & Staff Portal',
    academics: 'Academics & Attendance',
    examinations: 'Examinations & Results',
    hostel: 'Hostel & Digital Out-Pass',
    aiAssistant: 'AI Knowledge Assistant',
    markAttendance: 'Mark Geo Attendance',
    attendanceVerified: 'Attendance Verified via BLE Beacon',
    hallTicket: 'Download Hall Ticket PDF',
    cgpa: 'Cumulative Grade Point Average',
    outpassRequest: 'Request Weekend Out-Pass',
    askAi: 'Ask AI in English or Tamil...',
    signOut: 'Sign Out of GRI Portal',
  },
  ta: {
    welcome: 'காந்தி கிராம கிராமியப் பல்கலைக்கழகத்திற்கு நல்வரவு',
    loginTitle: 'GRI மாணவர் மற்றும் பணியாளர் நுழைவு வாயில்',
    academics: 'கல்வி மற்றும் வருகைப்பதிவு',
    examinations: 'தேர்வுகள் மற்றும் முடிவுகள்',
    hostel: 'விடுதி மற்றும் வெளியனுமதி சீட்டு',
    aiAssistant: 'செயற்கை நுண்ணறிவு உதவி',
    markAttendance: 'வருகை பதிவு செய்க',
    attendanceVerified: 'வருகைப்பதிவு உறுதி செய்யப்பட்டது',
    hallTicket: 'தேர்வு அனுமதி சீட்டு பதிவிறக்கு',
    cgpa: 'மொத்த தரப்புள்ளி சராசரி',
    outpassRequest: 'வெளியனுமதி சீட்டு கோருக',
    askAi: 'தமிழில் அல்லது ஆங்கிலத்தில் கேட்கவும்...',
    signOut: 'வெளியேறு',
  },
};

let currentLanguage: Language = 'en';

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
};

export const t = (key: keyof typeof translations['en']): string => {
  return translations[currentLanguage][key] || translations['en'][key] || key;
};
