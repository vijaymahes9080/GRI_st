import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Building,
  GraduationCap,
  FileCheck,
  MapPin,
  Shield,
  Users,
  Award,
  Download,
  Archive,
} from 'lucide-react-native';

interface NavSubItem {
  name: string;
  route: string;
  badge?: string;
}

interface NavSection {
  id: string;
  title: string;
  icon: any;
  color: string;
  items: NavSubItem[];
}

export default function DedicatedNavigationDirectoryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    about: true,
    academics: true,
    admissions: true,
    examination: true,
  });

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const navTaxonomy: NavSection[] = [
    {
      id: 'about',
      title: 'About GRI',
      icon: Building,
      color: '#518214',
      items: [
        { name: 'Vision & Mission', route: '/about/vision' },
        { name: 'History & Genesis (1956)', route: '/about/history' },
        { name: 'Institutional Profile', route: '/about/profile' },
        { name: 'Institutional Objectives', route: '/about/objectives' },
        { name: 'Organisational Structure', route: '/about/organisational' },
        { name: 'Important Documents & MoA', route: '/about/documents' },
        { name: 'Annual Reports & Audits', route: '/about/annual_reports' },
        { name: 'Mandatory Disclosures & NAAC', route: '/about/naac' },
        { name: 'NIRF Ranking Report', route: '/about/nirf' },
      ],
    },
    {
      id: 'governance',
      title: 'Governance & Statutory Bodies',
      icon: Shield,
      color: '#911C03',
      items: [
        { name: 'Governance System Overview', route: '/governance/system' },
        { name: 'GRI Society', route: '/governance/society' },
        { name: 'Board of Management (BoM)', route: '/governance/bom' },
        { name: 'Academic Council', route: '/governance/academic_council' },
        { name: 'Finance Committee', route: '/governance/finance_committee' },
        { name: 'Planning & Monitoring Board', route: '/governance/planning_board' },
        { name: 'Governance Documents & Gazette', route: '/governance/documents' },
      ],
    },
    {
      id: 'admin',
      title: 'Administration',
      icon: Users,
      color: '#0D47A1',
      items: [
        { name: 'Chancellor', route: '/administration/chancellor' },
        { name: 'Vice-Chancellor', route: '/administration/vc' },
        { name: 'Registrar', route: '/administration/registrar' },
        { name: 'Controller of Examinations (CoE)', route: '/administration/coe' },
        { name: 'Finance Officer', route: '/administration/finance_officer' },
        { name: 'Chief Vigilance Officer (CVO)', route: '/administration/cvo' },
        { name: 'Deans of 7 Schools', route: '/administration/deans' },
        { name: 'Heads of Departments (HoDs)', route: '/administration/hods' },
        { name: 'Administrative Offices Directory', route: '/administration/offices' },
      ],
    },
    {
      id: 'academics',
      title: 'Academics & Schools',
      icon: BookOpen,
      color: '#F16236',
      items: [
        { name: '7 Major Schools Directory', route: '/academics/schools' },
        { name: 'Academic Programmes (UG/PG/Ph.D.)', route: '/academics/programmes' },
        { name: 'Department of Computer Science & Apps', route: '/academics/department_detail?deptId=cs' },
        { name: 'Department of Agriculture', route: '/academics/department_detail?deptId=agri' },
        { name: 'Choice Based Credit System (CBCS)', route: '/academics/cbcs' },
        { name: 'Student Handbook & Calendar', route: '/academics/calendar' },
      ],
    },
    {
      id: 'admissions',
      title: 'Admissions 2026-2027',
      icon: GraduationCap,
      color: '#6A1B9A',
      items: [
        { name: 'Admissions Prospectus 2026-27', route: '/admissions/prospectus' },
        { name: 'Fee Structure & Refund Policy', route: '/admissions/fees' },
        { name: 'UG & PG Admission Guidelines', route: '/admissions/ug' },
      ],
    },
    {
      id: 'examination',
      title: 'Examination System',
      icon: FileCheck,
      color: '#00838F',
      items: [
        { name: 'ESE Examination Timetable Query', route: '/examination/timetable' },
        { name: 'Official Academic Transcripts', route: '/examination/transcripts' },
        { name: 'Ph.D. Online Status Tracking', route: '/examination/phd_tracking' },
        { name: 'e-SANAD Document Verification', route: '/examination/esanad' },
      ],
    },
    {
      id: 'facilities',
      title: 'Campus Facilities & Labs',
      icon: MapPin,
      color: '#33691E',
      items: [
        { name: 'Facilities Overview', route: '/facilities' },
        { name: 'Central Library & OPAC', route: '/facilities/library' },
        { name: 'Computer Centre & NKN Network', route: '/facilities/computer_centre' },
      ],
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure & Hostels',
      icon: Building,
      color: '#C2185B',
      items: [
        { name: 'Infrastructure Overview', route: '/infrastructure' },
        { name: 'Boys & Girls Hostels', route: '/infrastructure/hostels' },
      ],
    },
    {
      id: 'research',
      title: 'Research & Development Cell',
      icon: Award,
      color: '#6A1B9A',
      items: [
        { name: 'RDC Overview & Policy', route: '/research' },
      ],
    },
    {
      id: 'enews',
      title: 'e-News & Bulletins',
      icon: Archive,
      color: '#E65100',
      items: [
        { name: 'Latest News & Bulletins', route: '/enews' },
      ],
    },
    {
      id: 'alumni',
      title: 'Alumni Association',
      icon: Award,
      color: '#E65100',
      items: [
        { name: 'Alumni Network Overview', route: '/alumni' },
        { name: 'Alumni Registration & RaiseGRI', route: '/alumni/registration' },
      ],
    },
    {
      id: 'public_vault',
      title: 'Downloads & Campus Contact',
      icon: Download,
      color: '#518214',
      items: [
        { name: 'Downloads Vault (Circulars & Forms)', route: '/downloads' },
        { name: 'Contact GRI & Campus Info', route: '/contact' },
        { name: 'Forgot Password & Credentials', route: '/auth/forgot_password' },
      ],
    },
  ];

  const filteredSections = navTaxonomy
    .map((section) => {
      const matchingItems = section.items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        matchingItems.length > 0
      ) {
        return {
          ...section,
          items: searchQuery.length > 0 ? matchingItems : section.items,
        };
      }
      return null;
    })
    .filter(Boolean) as NavSection[];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Navigation Directory</Text>
            <Text className="text-xs text-emerald-100 font-medium">Dedicated Pages for 100+ University Elements</Text>
          </View>
        </View>

        <View className="flex-row items-center bg-white rounded-2xl px-3.5 py-2.5 shadow-sm mt-1">
          <Search size={18} color="#6B7280" />
          <TextInput
            placeholder="Search all dedicated menu pages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2.5 text-sm text-gray-900 font-medium"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {filteredSections.map((section) => {
          const SectionIcon = section.icon;
          const isExpanded = expandedSections[section.id] ?? true;

          return (
            <View key={section.id} className="bg-white rounded-2xl border border-gray-200 mb-3 shadow-sm overflow-hidden">
              <TouchableOpacity
                onPress={() => toggleSection(section.id)}
                className="flex-row items-center justify-between p-4 bg-gray-50/80"
              >
                <View className="flex-row items-center flex-1 pr-2">
                  <View className="p-2.5 rounded-xl mr-3" style={{ backgroundColor: `${section.color}15` }}>
                    <SectionIcon size={20} color={section.color} />
                  </View>
                  <Text className="text-base font-bold text-gray-900">{section.title}</Text>
                </View>
                {isExpanded ? <ChevronDown size={20} color="#6B7280" /> : <ChevronRight size={20} color="#6B7280" />}
              </TouchableOpacity>

              {isExpanded && (
                <View className="px-4 pb-3 pt-1 border-t border-gray-100">
                  {section.items.map((item, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => router.push(item.route as any)}
                      className="py-2.5 border-b border-gray-100 flex-row items-center justify-between"
                    >
                      <Text className="text-xs font-semibold text-gray-800 flex-1 pr-2">{item.name}</Text>
                      <View className="flex-row items-center">
                        {item.badge && (
                          <View className="bg-emerald-100 px-2 py-0.5 rounded-md mr-2">
                            <Text className="text-[10px] font-bold text-[#518214]">{item.badge}</Text>
                          </View>
                        )}
                        <ChevronRight size={16} color="#9CA3AF" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
