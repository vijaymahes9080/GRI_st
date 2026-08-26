import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Search,
  BookOpen,
  GraduationCap,
  Briefcase,
  Users,
  Building,
  FileText,
  MapPin,
  Newspaper,
  Compass,
  Award,
  Shield,
  Sun,
  Key,
  Bell,
  Calendar,
  FileSpreadsheet,
  UserCheck,
  ExternalLink,
  Phone,
  Mail,
  ChevronRight,
  Activity,
  Server,
  HeartHandshake
} from 'lucide-react-native';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { GRI_INSTITUTIONAL_DATA } from '../../core/services/institutionalData';
import { useResponsive } from '../../core/responsive/useResponsive';

type DiscoverTab = 'ACADEMICS' | 'ADMINISTRATION' | 'CENTRES' | 'FACILITIES' | 'CIRCULARS' | 'EVENTS' | 'TENDERS' | 'CAREERS' | 'MANUALS' | 'STUDENT_CORNER';

const DISCOVER_TABS: { id: DiscoverTab; label: string }[] = [
  { id: 'ACADEMICS', label: 'Academics & Schools' },
  { id: 'ADMINISTRATION', label: 'Administration' },
  { id: 'CENTRES', label: 'Centres & Cells' },
  { id: 'FACILITIES', label: 'Campus Facilities' },
  { id: 'STUDENT_CORNER', label: 'Student Corner' },
  { id: 'CIRCULARS', label: 'Circulars & Notices' },
  { id: 'EVENTS', label: 'Events' },
  { id: 'TENDERS', label: 'Tenders' },
  { id: 'CAREERS', label: 'Careers' },
  { id: 'MANUALS', label: 'Manuals & Policies' },
];

const ADMIN_OFFICIALS = [
  { role: 'Chancellor', name: 'Dr. K. M. Annamalai', phone: '0451-2452323', email: 'chancellor@ruraluniv.ac.in' },
  { role: 'Vice-Chancellor', name: 'Prof. S. R. Ramanathan', phone: '0451-2452371', email: 'vc@ruraluniv.ac.in' },
  { role: 'Registrar', name: 'Dr. T. Kalaiselvan', phone: '0451-2452323', email: 'registrar@ruraluniv.ac.in' },
  { role: 'Controller of Examinations', name: 'Dr. P. Murugesan', phone: '0451-2452222', email: 'coe@ruraluniv.ac.in' },
  { role: 'Finance Officer', name: 'Mr. V. Krishnan', phone: '0451-2452324', email: 'fo@ruraluniv.ac.in' },
  { role: 'Dean, Students Welfare', name: 'Dr. S. Raja', phone: '0451-2452325', email: 'dsw@ruraluniv.ac.in' },
];

export default function DiscoverScreen() {
  const router = useRouter();
  const { isTablet } = useResponsive();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<DiscoverTab>('ACADEMICS');

  return (
    <View className="flex-1 bg-slate-50">
      <Header title="Explore GRI" subtitle="The Gandhigram Rural Institute Directory" variant="white" />
      
      <View className="bg-white border-b border-slate-200">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-3" contentContainerStyle={{ gap: 8 }}>
          {DISCOVER_TABS.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              onPress={() => setActiveTab(tag.id)}
              className={`px-4 py-2 rounded-lg border ${
                activeTab === tag.id
                  ? 'bg-khadi-blue border-khadi-blue'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
              activeOpacity={0.7}
            >
              <Text
                className={`text-sm font-bold ${
                  activeTab === tag.id ? 'text-white' : 'text-slate-600'
                }`}
              >
                {tag.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: isTablet ? 24 : 16 }} showsVerticalScrollIndicator={false}>
        <View style={{ maxWidth: 1000, width: '100%', alignSelf: 'center' }}>
          
          {/* Search Bar */}
          <View className="bg-white flex-row items-center px-4 py-3 rounded-lg border border-slate-200 mb-6 shadow-sm">
            <Search size={20} color="#94A3B8" />
            <TextInput
              className="flex-1 ml-3 text-base text-slate-900 font-medium p-0 outline-none h-6"
              placeholder={`Search ${activeTab.replace('_', ' ').toLowerCase()}...`}
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* ACADEMICS TAB */}
          {activeTab === 'ACADEMICS' && (
            <View>
              <Text className="text-lg font-bold text-slate-900 mb-4">Schools & Departments</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                {GRI_INSTITUTIONAL_DATA.schools.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((school) => (
                  <View key={school.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm" style={{ width: isTablet ? 'calc(50% - 8px)' : '100%' }}>
                    <View className="flex-row items-center mb-3">
                      <BookOpen size={18} color="#059669" />
                      <Text className="text-sm font-bold text-emerald-800 tracking-wide uppercase ml-2 flex-1">{school.name}</Text>
                    </View>
                    <View className="gap-3">
                      {school.departments.map((dept) => (
                        <View key={dept.code} className="flex-row items-start pt-3 border-t border-slate-100">
                          <Text className="text-slate-400 mr-2 mt-0.5">•</Text>
                          <View className="flex-1">
                            <Text className="text-sm text-slate-800 font-bold mb-1">{dept.name}</Text>
                            <Text className="text-xs text-slate-500 font-medium mb-1">Head: {dept.head}</Text>
                            <View className="flex-row items-center">
                              <Mail size={12} color="#64748B" />
                              <Text className="text-xs text-slate-500 ml-1">{dept.email}</Text>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ADMINISTRATION TAB */}
          {activeTab === 'ADMINISTRATION' && (
            <View>
              <Text className="text-lg font-bold text-slate-900 mb-4">University Administration</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                {ADMIN_OFFICIALS.filter(a => a.role.toLowerCase().includes(searchQuery.toLowerCase()) || a.name.toLowerCase().includes(searchQuery.toLowerCase())).map((official, idx) => (
                  <View key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm" style={{ width: isTablet ? 'calc(33.33% - 11px)' : 'calc(50% - 8px)' }}>
                    <Text className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">{official.role}</Text>
                    <Text className="text-lg font-bold text-slate-900 mb-3">{official.name}</Text>
                    <View className="gap-2">
                      <View className="flex-row items-center">
                        <Phone size={14} color="#64748B" />
                        <Text className="text-sm text-slate-600 ml-2">{official.phone}</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Mail size={14} color="#64748B" />
                        <Text className="text-sm text-slate-600 ml-2">{official.email}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* CENTRES TAB */}
          {activeTab === 'CENTRES' && (
            <View>
              <Text className="text-lg font-bold text-slate-900 mb-4">Centres & Cells</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                {GRI_INSTITUTIONAL_DATA.cells.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase())).map((cell, idx) => (
                  <View key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm" style={{ width: isTablet ? 'calc(50% - 8px)' : '100%' }}>
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-xs font-bold text-khadi-blue tracking-wider">{cell.code}</Text>
                      <ExternalLink size={16} color="#0D47A1" />
                    </View>
                    <Text className="text-base font-bold text-slate-900 mb-2">{cell.name}</Text>
                    <Text className="text-sm text-slate-600 font-medium">Coordinator: {cell.coordinator}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* FACILITIES TAB */}
          {activeTab === 'FACILITIES' && (
            <View>
              <Text className="text-lg font-bold text-slate-900 mb-4">Campus Facilities</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                {GRI_INSTITUTIONAL_DATA.facilities.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).map((facility, idx) => (
                  <View key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm" style={{ width: isTablet ? 'calc(50% - 8px)' : '100%' }}>
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md tracking-wider uppercase">
                        {facility.category}
                      </Text>
                    </View>
                    <Text className="text-base font-bold text-slate-900 mb-2">{facility.name}</Text>
                    <Text className="text-sm text-slate-600 mb-3 leading-relaxed">{facility.description}</Text>
                    <TouchableOpacity className="flex-row items-center self-start">
                      <Text className="text-sm font-bold text-indigo-600 mr-1.5">View Details</Text>
                      <ChevronRight size={16} color="#4F46E5" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* MANUALS TAB */}
          {activeTab === 'MANUALS' && (
            <View>
              <Text className="text-lg font-bold text-slate-900 mb-4">Operational Manuals & Policies</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                {GRI_INSTITUTIONAL_DATA.manuals.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase())).map((manual, idx) => (
                  <View key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex-row items-center justify-between shadow-sm" style={{ width: isTablet ? 'calc(50% - 8px)' : '100%' }}>
                    <View className="flex-1 pr-4">
                      <Text className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded self-start tracking-wider uppercase mb-1.5">
                        {manual.category}
                      </Text>
                      <Text className="text-sm font-bold text-slate-800">{manual.title}</Text>
                    </View>
                    <TouchableOpacity className="bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                      <FileText size={18} color="#059669" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* CIRCULARS TAB */}
          {activeTab === 'CIRCULARS' && (
            <View className="mb-4">
              <Text className="text-lg font-bold text-slate-900 mb-4">📢 Official Circulars & Notifications</Text>
              <View className="gap-3">
                {GRI_INSTITUTIONAL_DATA.circulars.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).map((circ) => (
                  <View key={circ.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md tracking-wider uppercase">
                        {circ.category}
                      </Text>
                      <Text className="text-[11px] text-slate-400 font-medium tracking-wider uppercase">{circ.publishDate}</Text>
                    </View>
                    <Text className="text-base font-bold text-slate-900 mb-3">{circ.title}</Text>
                    <TouchableOpacity className="flex-row items-center self-start">
                      <ExternalLink size={14} color="#059669" />
                      <Text className="text-sm font-bold text-emerald-600 ml-1.5">Download Circular PDF</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* EVENTS TAB */}
          {activeTab === 'EVENTS' && (
            <View className="mb-4">
              <Text className="text-lg font-bold text-slate-900 mb-4">📅 Events & Conferences</Text>
              <View className="gap-3">
                {GRI_INSTITUTIONAL_DATA.events.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase())).map((evt) => (
                  <View key={evt.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-row items-start">
                    <View className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 items-center justify-center mr-4 w-16 hidden sm:flex">
                      <Text className="text-xs font-bold text-indigo-800 uppercase tracking-widest">{evt.eventDate.split('-')[1] || evt.eventDate.split(' ')[1]}</Text>
                      <Text className="text-xl font-extrabold text-indigo-900">{evt.eventDate.split('-')[2] || evt.eventDate.split(' ')[0]}</Text>
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between mb-1.5">
                        <Text className="text-[11px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md tracking-wider uppercase">
                          {evt.category}
                        </Text>
                        <Text className="text-xs font-bold text-slate-500 sm:hidden">{evt.eventDate}</Text>
                      </View>
                      <Text className="text-base font-bold text-slate-900 mb-1">{evt.title}</Text>
                      <Text className="text-sm text-slate-600 font-medium mb-1">{evt.organizer}</Text>
                      <Text className="text-xs text-slate-500 mb-3">📍 {evt.venue}</Text>
                      <TouchableOpacity className="bg-indigo-600 px-4 py-2 rounded-lg self-start">
                        <Text className="text-sm font-bold text-white">Register / Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* TENDERS TAB */}
          {activeTab === 'TENDERS' && (
            <View className="mb-4">
              <Text className="text-lg font-bold text-slate-900 mb-4">📑 Active Tenders & E-Procurement</Text>
              <View className="gap-3">
                {GRI_INSTITUTIONAL_DATA.tenders.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).map((tend) => (
                  <View key={tend.tenderNo} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-xs font-mono font-medium text-slate-500">{tend.tenderNo}</Text>
                      <View className="bg-amber-100 px-2.5 py-1 rounded-md">
                        <Text className="text-[10px] font-bold text-amber-800 tracking-wider uppercase">{tend.status}</Text>
                      </View>
                    </View>
                    <Text className="text-base font-bold text-slate-900 mb-2">{tend.title}</Text>
                    <Text className="text-sm text-red-600 font-semibold mb-3">
                      ⏰ Submission Closing: {tend.closingDate}
                    </Text>
                    <TouchableOpacity className="flex-row items-center self-start">
                      <ExternalLink size={14} color="#0D47A1" />
                      <Text className="text-sm font-bold text-blue-700 ml-1.5">Download Tender Document</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* CAREERS TAB */}
          {activeTab === 'CAREERS' && (
            <View className="mb-4">
              <Text className="text-lg font-bold text-slate-900 mb-4">💼 Careers & Recruitment Notices</Text>
              <View className="gap-3">
                {GRI_INSTITUTIONAL_DATA.careers.filter(c => c.postName.toLowerCase().includes(searchQuery.toLowerCase())).map((car) => (
                  <View key={car.advtNo} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <Text className="text-xs font-mono font-bold text-emerald-700 mb-1 tracking-wider">{car.advtNo}</Text>
                    <Text className="text-lg font-bold text-slate-900 mb-2">{car.postName}</Text>
                    <View className="flex-row flex-wrap gap-x-4 gap-y-2 mb-3">
                      <Text className="text-sm text-slate-600"><Text className="font-semibold text-slate-700">Dept:</Text> {car.department}</Text>
                      <Text className="text-sm text-slate-600"><Text className="font-semibold text-slate-700">Scale:</Text> {car.salary}</Text>
                    </View>
                    <Text className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <Text className="font-semibold text-slate-800">Requirements:</Text> {car.qualification}
                    </Text>
                    <View className="flex-row items-center justify-between border-t border-slate-100 pt-4">
                      <Text className="text-sm font-bold text-red-600">Closes: {car.lastDate}</Text>
                      <TouchableOpacity className="bg-khadi-blue px-4 py-2 rounded-lg">
                        <Text className="text-sm font-bold text-white">Apply / Prospectus</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* STUDENT CORNER TAB */}
          {activeTab === 'STUDENT_CORNER' && (
            <View className="mb-4">
              <Text className="text-lg font-bold text-slate-900 mb-4">👨‍🎓 Student Corner Self-Services</Text>
              
              <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Core Portals</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                {GRI_INSTITUTIONAL_DATA.studentCorner.portals.map((p, idx) => (
                  <View key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex-row items-center justify-between shadow-sm" style={{ width: isTablet ? 'calc(50% - 6px)' : '100%' }}>
                    <Text className="text-base font-bold text-slate-800">{p.name}</Text>
                    <Text className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-widest">
                      {p.badge}
                    </Text>
                  </View>
                ))}
              </View>

              <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-6 mb-3">Academic & Exam Services</Text>
              <View className="gap-2">
                {GRI_INSTITUTIONAL_DATA.studentCorner.academic_services.map((a, idx) => (
                  <View key={idx} className="bg-white p-4 rounded-xl flex-row items-center justify-between border border-slate-200 hover:bg-slate-50 shadow-sm">
                    <Text className="text-sm font-medium text-slate-700">{a.title}</Text>
                    <ExternalLink size={16} color="#059669" />
                  </View>
                ))}
              </View>

              <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-6 mb-3">Welfare & Grievances</Text>
              <View className="gap-2 mb-8">
                {GRI_INSTITUTIONAL_DATA.studentCorner.welfare_grievances.map((w, idx) => (
                  <View key={idx} className="bg-white p-4 rounded-xl flex-row items-center justify-between border border-slate-200 hover:bg-slate-50 shadow-sm">
                    <Text className="text-sm font-medium text-slate-700">{w.title}</Text>
                    <ExternalLink size={16} color="#DC2626" />
                  </View>
                ))}
              </View>
            </View>
          )}
          
          <View className="h-12" />
        </View>
      </ScrollView>
    </View>
  );
}

