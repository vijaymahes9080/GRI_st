import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Info, 
  Users, 
  GraduationCap, 
  FileText, 
  Building, 
  BookOpen, 
  Phone, 
  Briefcase, 
  ChevronRight, 
  ShieldCheck, 
  Globe, 
  Award, 
  Image as ImageIcon,
  Activity,
  CheckCircle2,
  Calendar,
  CreditCard,
  Download,
  Sparkles,
  Server
} from 'lucide-react-native';
import { useAuthStore } from '../../core/auth/authStore';
import { useResponsive } from '../../core/responsive/useResponsive';
import { themeTokens } from '../../core/theme/tokens';
import { RoleSwitcherModal } from '../../components/dashboard/RoleSwitcherModal';

export default function MenuScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { isTablet } = useResponsive();
  const { colors } = themeTokens;
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  // Role-specific featured sections
  const getRoleSpecificSection = () => {
    if (!user) return null;

    if (user.role === 'STUDENT') {
      return {
        title: 'Student Portal Modules (Samarth ERP)',
        color: '#2563EB',
        items: [
          { label: 'ESE Hall Ticket Download', route: '/(tabs)/home', icon: Download },
          { label: 'Semester Results & Marksheet', route: '/(tabs)/home', icon: FileText },
          { label: 'Class Timetable & Schedule', route: '/examination/timetable', icon: Calendar },
          { label: 'Tuition & Exam Fee Payment', route: '/(tabs)/services', icon: CreditCard },
          { label: 'Hostel Out-Pass & Mess', route: '/infrastructure/hostels', icon: Building },
        ]
      };
    }

    if (user.role === 'FACULTY') {
      return {
        title: 'Faculty Teaching & Assessment Desk',
        color: '#059669',
        items: [
          { label: 'Daily Attendance & Biometrics', route: '/(tabs)/home', icon: CheckCircle2 },
          { label: 'Continuous Internal Assessment (CIA)', route: '/(tabs)/home', icon: FileText },
          { label: 'e-Leave & Duty Permission (OD)', route: '/(tabs)/home', icon: Calendar },
          { label: 'CBCS Course Syllabus & Planner', route: '/academics/cbcs', icon: BookOpen },
          { label: 'Research Projects & CAS Appraisal', route: '/research', icon: Award },
        ]
      };
    }

    if (user.role === 'RESEARCH_SCHOLAR') {
      return {
        title: 'Doctoral Research & Fellowship Desk',
        color: '#7C3AED',
        items: [
          { label: 'Ph.D. Lifecycle Tracker', route: '/examination/phd_tracking', icon: Award },
          { label: 'RAC Progress Report & Synopsis', route: '/(tabs)/home', icon: FileText },
          { label: 'Central Instrumentation (CIF) Booking', route: '/(tabs)/home', icon: Sparkles },
          { label: 'Shodhganga & INFLIBNET Repository', route: '/research', icon: Globe },
        ]
      };
    }

    if (user.role === 'UNIVERSITY_ADMIN' || user.role === 'ADMIN' || user.role === 'SYSTEM_ADMIN' || user.role === 'DEPARTMENT_ADMIN' || user.role === 'WARDEN') {
      return {
        title: 'Institutional Governance & Command',
        color: '#DC2626',
        items: [
          { label: 'Administrator Command Dashboard', route: '/admin/dashboard', icon: ShieldCheck },
          { label: 'Leave & Out-Pass Approval Queue', route: '/admin/approval_queue', icon: CheckCircle2 },
          { label: 'Backend Health & Diagnostics', route: '/admin/diagnostics', icon: Activity },
          { label: 'Hostel Wardenship & Room Allotment', route: '/infrastructure/hostels', icon: Building },
        ]
      };
    }

    return null;
  };

  const roleSection = getRoleSpecificSection();

  const standardMenuSections = [
    {
      title: 'Gandhian Heritage & Leadership',
      items: [
        { label: 'Founders & Nai Talim Heritage', route: '/about/heritage', icon: Award },
        { label: 'Profile & Historical Milestone (1956)', route: '/about/profile', icon: Info },
        { label: 'Vision, Mission & Tripillar Objectives', route: '/about/vision', icon: ShieldCheck },
        { label: 'Governance (Board of Management)', route: '/governance', icon: Building },
        { label: 'NAAC A++ & NIRF Quality Rankings', route: '/about/naac', icon: CheckCircle2 },
        { label: 'Administration & Officers Directory', route: '/administration', icon: Users },
      ]
    },
    {
      title: 'Extension & Rural Outreach (3rd Dimension)',
      items: [
        { label: 'Extension Hub (Shanti Sena, VPP, KVK)', route: '/extension', icon: Sparkles },
        { label: 'Village Placement Programme (VPP)', route: '/extension', icon: Users },
        { label: 'ICAR Krishi Vigyan Kendra (KVK)', route: '/extension', icon: Award },
        { label: 'Sanitary Park & Rural Technology', route: '/extension', icon: ShieldCheck },
        { label: 'Unnat Bharat Abhiyan (UBA RCI)', route: '/extension', icon: Globe },
      ]
    },
    {
      title: 'Central Facilities & Research',
      items: [
        { label: 'Central Instrumentation Facility (CIF)', route: '/facilities/cif', icon: Sparkles },
        { label: 'Dr. G. Ramachandran Central Library', route: '/facilities/library', icon: BookOpen },
        { label: 'Museums & Freedom Fighter Gallery', route: '/facilities/museums', icon: Building },
        { label: 'Comprehensive Campus Facilities', route: '/facilities', icon: Server },
        { label: 'Computer Centre & IT Backbone', route: '/facilities/computer_centre', icon: Server },
        { label: 'Hostels & Residential Guest House', route: '/infrastructure/hostels', icon: Building },
      ]
    },
    {
      title: 'Admissions & Academic Schools',
      items: [
        { label: 'Schools & Departments (7 Schools)', route: '/(tabs)/academics', icon: BookOpen },
        { label: 'Programmes Offered (UG/PG/Ph.D)', route: '/academics/programmes', icon: GraduationCap },
        { label: 'Admissions 2026 Portal', route: '/admissions', icon: Globe },
        { label: 'Examinations & Timetable', route: '/(tabs)/examinations', icon: FileText },
        { label: 'Academic Calendar', route: '/academics/calendar', icon: Calendar },
      ]
    },
    {
      title: 'Research, Placements & Alumni',
      items: [
        { label: 'Research & Development (R&D)', route: '/research', icon: Globe },
        { label: 'Training & Placements Bureau', route: '/placements', icon: Briefcase },
        { label: 'Alumni Association Network', route: '/alumni', icon: Users },
        { label: 'Important Downloads & Circulars', route: '/downloads', icon: Download },
        { label: 'Institutional Helpdesk & Contact', route: '/contact', icon: Phone },
      ]
    }
  ];

  return (
    <View className="flex-1 bg-slate-50">
      
      {/* Header */}
      <View className="bg-slate-900 pt-16 pb-6 px-6 border-b border-slate-800">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-white mb-0.5">Directory & Menu</Text>
            <Text className="text-xs text-slate-300">Gandhigram Rural Institute Institutional Index</Text>
          </View>
          <TouchableOpacity
            onPress={() => setRoleSwitcherOpen(true)}
            className="bg-white/10 px-3 py-1.5 rounded-full border border-white/20 flex-row items-center"
          >
            <Sparkles size={14} color="#93C5FD" className="mr-1" />
            <Text className="text-xs font-bold text-white">Switch Role</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        <View style={{ maxWidth: 840, width: '100%', alignSelf: 'center' }}>
          
          {/* Highlighted Role Section */}
          {roleSection && (
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-3 ml-2">
                <Text className="text-xs font-bold uppercase tracking-wider text-primary-700">
                  {roleSection.title}
                </Text>
                <View className="bg-primary-50 px-2 py-0.5 rounded-md border border-primary-200">
                  <Text className="text-[10px] font-bold text-primary-800">My Persona</Text>
                </View>
              </View>
              <View className="bg-white rounded-2xl border border-primary-200 overflow-hidden shadow-xs">
                {roleSection.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const isLast = itemIdx === roleSection.items.length - 1;
                  return (
                    <TouchableOpacity
                      key={itemIdx}
                      onPress={() => router.push(item.route as any)}
                      className={`flex-row items-center px-4 py-3.5 bg-white ${!isLast ? 'border-b border-slate-100' : ''}`}
                      activeOpacity={0.7}
                    >
                      <View 
                        className="w-9 h-9 rounded-xl items-center justify-center mr-3"
                        style={{ backgroundColor: `${roleSection.color}15` }}
                      >
                        <Icon size={18} color={roleSection.color} />
                      </View>
                      <Text className="flex-1 text-sm font-bold text-slate-900">{item.label}</Text>
                      <ChevronRight size={18} color="#94A3B8" />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Standard Menu Sections */}
          {standardMenuSections.map((section, idx) => (
            <View key={idx} className="mb-6">
              <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-2">
                {section.title}
              </Text>
              <View className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const isLast = itemIdx === section.items.length - 1;
                  return (
                    <TouchableOpacity
                      key={itemIdx}
                      onPress={() => router.push(item.route as any)}
                      className={`flex-row items-center px-4 py-3.5 bg-white ${!isLast ? 'border-b border-slate-100' : ''}`}
                      activeOpacity={0.7}
                    >
                      <View className="w-9 h-9 rounded-xl bg-slate-100 items-center justify-center mr-3">
                        <Icon size={18} color={colors.primary} />
                      </View>
                      <Text className="flex-1 text-sm font-medium text-slate-800">{item.label}</Text>
                      <ChevronRight size={18} color="#94A3B8" />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
          
          {/* Quick Samarth ERP Login Banner */}
          <View className="mb-10">
            <TouchableOpacity
              onPress={() => setRoleSwitcherOpen(true)}
              className="flex-row items-center justify-between p-5 bg-slate-900 rounded-2xl shadow-sm border border-slate-800"
            >
              <View>
                <Text className="text-base font-bold text-white">Institutional Multi-User System</Text>
                <Text className="text-xs text-slate-300">Switch between Student, Faculty, Scholar & Admin profiles</Text>
              </View>
              <View className="bg-white/20 p-2.5 rounded-full">
                <Sparkles size={18} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
          
        </View>
      </ScrollView>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        visible={roleSwitcherOpen}
        onClose={() => setRoleSwitcherOpen(false)}
      />

    </View>
  );
}
