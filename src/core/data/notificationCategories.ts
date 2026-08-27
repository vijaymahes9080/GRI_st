import { CircularItem } from '../../types';

export interface NotificationCategoryDef {
  id: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
  bgLight: string;
  badgeClass: string;
  iconName: 'FileText' | 'Briefcase' | 'BookOpen' | 'DollarSign' | 'Calendar' | 'Building' | 'Bus' | 'AlertTriangle';
  tags: string[];
}

export const ALL_NOTIFICATION_CATEGORIES: NotificationCategoryDef[] = [
  {
    id: 'exam',
    name: 'Exam Updates & Results',
    shortName: 'Exam Updates',
    description: 'End semester schedules, hall ticket notifications, CIA internal marks, revaluation & results',
    color: '#0284C7',
    bgLight: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    badgeClass: 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-200 border-sky-300',
    iconName: 'FileText',
    tags: ['EXAM', 'EXAMINATION', 'RESULTS', 'HALL TICKET', 'CIA', 'TIMETABLE', 'ARREAR', 'REVALUATION', 'CONTROLLER']
  },
  {
    id: 'placement',
    name: 'Placement Drives & Careers',
    shortName: 'Placement Drives',
    description: 'Campus recruitment drives, company interview schedules, internship offers & CTC packages',
    color: '#EA580C',
    bgLight: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    badgeClass: 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200 border-orange-300',
    iconName: 'Briefcase',
    tags: ['PLACEMENT', 'CAREER', 'INTERVIEW', 'RECRUITMENT', 'JOB', 'INTERNSHIP', 'TCS', 'ITC', 'HDFC', 'ZOHO']
  },
  {
    id: 'academic',
    name: 'Academic Circulars & Admissions',
    shortName: 'Academic Circulars',
    description: 'CUET admissions, syllabus updates, CBCS regulations, academic calendar & department memos',
    color: '#059669',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    badgeClass: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-300',
    iconName: 'BookOpen',
    tags: ['ACADEMIC', 'ADMISSIONS', 'CIRCULAR', 'REGULATION', 'DEPARTMENT', 'SYLLABUS', 'CBCS', 'RAC', 'BOARD OF STUDIES']
  },
  {
    id: 'fees',
    name: 'Fee & Scholarship Alerts',
    shortName: 'Fee & Scholarship',
    description: 'Semester tuition dues, examination fee portals, National Scholarship Portal (NSP) deadlines & receipts',
    color: '#16A34A',
    bgLight: 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    badgeClass: 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 border-green-300',
    iconName: 'DollarSign',
    tags: ['FEE', 'FINANCE', 'SCHOLARSHIP', 'PAYMENT', 'NSP', 'TUITION', 'CHALLAN', 'DUE']
  },
  {
    id: 'events',
    name: 'Campus Events & Workshops',
    shortName: 'Campus Events',
    description: 'National conferences, Gandhian peace workshops, cultural fests, Shanti Sena & sports tournaments',
    color: '#9333EA',
    bgLight: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    badgeClass: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 border-purple-300',
    iconName: 'Calendar',
    tags: ['EVENT', 'CONFERENCE', 'WORKSHOP', 'SEMINAR', 'CULTURAL', 'SPORTS', 'SHANTI SENA', 'UBA', 'OUTREACH', 'NSS']
  },
  {
    id: 'hostel',
    name: 'Hostel & Mess Notices',
    shortName: 'Hostel & Mess',
    description: 'Warden advisories, digital out-pass status, room allocations, mess menu changes & hostel dues',
    color: '#E11D48',
    bgLight: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    badgeClass: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-300',
    iconName: 'Building',
    tags: ['HOSTEL', 'MESS', 'OUT-PASS', 'WARDEN', 'RESIDENCE', 'KAVERI', 'DINING']
  },
  {
    id: 'transport',
    name: 'Transport & Bus Schedule',
    shortName: 'Transport Alerts',
    description: 'Madurai/Dindigul bus route changes, pass renewal dates, conductor updates & live GPS tracking',
    color: '#D97706',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    badgeClass: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border-amber-300',
    iconName: 'Bus',
    tags: ['TRANSPORT', 'BUS', 'ROUTE', 'PASS', 'VEHICLE', 'DRIVER', 'SCHEDULE']
  },
  {
    id: 'emergency',
    name: 'Emergency & Weather Alerts',
    shortName: 'Emergency & Weather',
    description: 'District Collector weather advisories, flood/cyclone holidays, and urgent administrative notices',
    color: '#DC2626',
    bgLight: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    badgeClass: 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-300',
    iconName: 'AlertTriangle',
    tags: ['EMERGENCY', 'URGENT', 'WEATHER', 'HOLIDAY', 'ALERT', 'DISASTER', 'COLLECTOR', 'IMPORTANT']
  }
];

export const DEFAULT_SUBSCRIBED_CATEGORY_IDS = [
  'exam',
  'placement',
  'academic',
  'fees',
  'events',
  'hostel',
  'transport',
  'emergency'
];

/**
 * Matches a circular item against user's subscribed categories
 */
export function isCircularMatchingSubscriptions(
  circular: CircularItem,
  subscribedCategoryIds: string[] | undefined
): boolean {
  // If user has all categories subscribed or no restrictions, allow all
  if (!subscribedCategoryIds || subscribedCategoryIds.length === 0) {
    return true;
  }

  // Emergency / Important alerts are always visible to all users
  if (circular.isImportant && subscribedCategoryIds.includes('emergency')) {
    return true;
  }

  const circCat = (circular.category || '').toUpperCase();
  const circTitle = (circular.title || '').toUpperCase();
  const circDesc = (circular.description || '').toUpperCase();

  // Find category definitions that user is subscribed to
  const activeCategoryDefs = ALL_NOTIFICATION_CATEGORIES.filter(c => 
    subscribedCategoryIds.includes(c.id)
  );

  for (const catDef of activeCategoryDefs) {
    if (catDef.tags.some(tag => circCat.includes(tag) || circTitle.includes(tag) || circDesc.includes(tag))) {
      return true;
    }
  }

  return false;
}
