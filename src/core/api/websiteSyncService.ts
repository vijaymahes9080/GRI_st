/**
 * Official Website Sync API Client (ruraluniv.ac.in Integration)
 */

import { api, ApiResponse } from './index';

export interface OfficialNavItem {
  label: string;
  url: string;
}

export interface OfficialNavSection {
  id: string;
  label: string;
  items: OfficialNavItem[];
}

export interface OfficialPortal {
  id: string;
  name: string;
  description: string;
  url: string;
  type: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
}

export interface GovernanceBody {
  name: string;
  description: string;
  url: string;
}

export interface GovernanceStructure {
  chancellor: string;
  viceChancellor: string;
  registrar: string;
  bodies: GovernanceBody[];
}

export interface SchoolOrCentre {
  type: 'SCHOOL' | 'CENTRE';
  name: string;
  departments?: string[];
  description?: string;
  url?: string;
}

export interface CampusFacility {
  name: string;
  category: 'ACADEMIC' | 'IT' | 'MEDIA' | 'SPORTS' | 'RESEARCH' | 'INNOVATION' | 'HERITAGE' | 'CULTURE';
  url: string;
}

export interface LiveHomeData {
  universityName: string;
  officialUrl: string;
  founders: Array<{ name: string; role: string }>;
  activeAdmissions: Array<{ title: string; url: string; isHot: boolean }>;
  quickActions: Array<{ label: string; url: string }>;
}

export const websiteSyncService = {
  async getNavigation(): Promise<OfficialNavSection[]> {
    try {
      const response = await api.get<ApiResponse<OfficialNavSection[]>>('/website/navigation');
      return response.data.data;
    } catch {
      return [
        {
          id: 'about',
          label: 'About GRI',
          items: [
            { label: 'Vision & Mission', url: 'https://ruraluniv.ac.in/aboutgri?content=vm' },
            { label: 'Profile', url: 'https://ruraluniv.ac.in/aboutgri?content=profile' },
            { label: 'Campus Infrastructure', url: 'https://ruraluniv.ac.in/aboutgri?content=campus' },
          ],
        },
        {
          id: 'governance',
          label: 'Governance',
          items: [
            { label: 'Executive Council', url: 'https://ruraluniv.ac.in/Governance?content=EC_CompositionFunctions' },
            { label: 'Academic Council', url: 'https://ruraluniv.ac.in/Governance?content=AcademicCouncil_Composition' },
          ],
        },
      ];
    }
  },

  async getPortals(): Promise<OfficialPortal[]> {
    try {
      const response = await api.get<ApiResponse<OfficialPortal[]>>('/website/portals');
      return response.data.data;
    } catch {
      return [
        {
          id: 'portal_samarth',
          name: 'Samarth@GRI Portal',
          description: 'Unified ERP System',
          url: 'https://ruraluniv.samarth.ac.in/index.php/site/login',
          type: 'ERP',
          status: 'ONLINE',
        },
        {
          id: 'portal_student',
          name: 'GRI Student Portal',
          description: 'CIA Marks, Fees, & Grievances',
          url: 'https://portal.ruraluniv.ac.in',
          type: 'STUDENT_SERVICES',
          status: 'ONLINE',
        },
      ];
    }
  },

  async getGovernance(): Promise<GovernanceStructure> {
    try {
      const response = await api.get<ApiResponse<GovernanceStructure>>('/website/governance');
      return response.data.data;
    } catch {
      return {
        chancellor: 'Dr. K. Kulandaivel',
        viceChancellor: 'Prof. N. Rajavel (Officiating)',
        registrar: 'Dr. R. Seerangarajan',
        bodies: [
          {
            name: 'Executive Council',
            description: 'Principal executive decision-making body',
            url: 'https://ruraluniv.ac.in/Governance?content=EC_CompositionFunctions',
          },
        ],
      };
    }
  },

  async getSchoolsAndCentres(): Promise<SchoolOrCentre[]> {
    try {
      const response = await api.get<ApiResponse<SchoolOrCentre[]>>('/website/schools-and-centres');
      return response.data.data;
    } catch {
      return [
        {
          type: 'SCHOOL',
          name: 'School of Sciences',
          departments: ['Computer Science', 'Mathematics', 'Physics', 'Chemistry'],
        },
      ];
    }
  },

  async getFacilities(): Promise<CampusFacility[]> {
    try {
      const response = await api.get<ApiResponse<CampusFacility[]>>('/website/facilities');
      return response.data.data;
    } catch {
      return [
        { name: 'Central Library', category: 'ACADEMIC', url: 'https://ruraluniv.ac.in/facilities?content=library' },
        { name: 'Computer Centre', category: 'IT', url: 'https://ruraluniv.ac.in/gri?CC=about' },
      ];
    }
  },

  async getLiveHome(): Promise<LiveHomeData> {
    try {
      const response = await api.get<ApiResponse<LiveHomeData>>('/website/live-home');
      return response.data.data;
    } catch {
      return {
        universityName: 'The Gandhigram Rural Institute (Deemed to be University)',
        officialUrl: 'https://ruraluniv.ac.in',
        founders: [{ name: 'Mahatma Gandhi', role: 'Inspiration & Visionary' }],
        activeAdmissions: [{ title: 'Admissions 2026-27 Open', url: 'https://ruraluniv.ac.in/adm/index.html', isHot: true }],
        quickActions: [{ label: 'Samarth ERP', url: 'https://ruraluniv.samarth.ac.in' }],
      };
    }
  },
};
