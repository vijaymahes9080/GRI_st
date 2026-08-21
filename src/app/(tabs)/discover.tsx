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
} from 'lucide-react-native';

import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { GRI_INSTITUTIONAL_DATA, GRI_MOBILE_NAV_TAGS } from '../../core/services/institutionalData';

export default function DiscoverScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ECOSYSTEM' | 'CIRCULARS' | 'EVENTS' | 'TENDERS' | 'CAREERS' | 'STUDENT_CORNER'>('ECOSYSTEM');

  const categories = [
    { title: 'Admissions 2026-27', count: 'CUET & Prospectus', icon: GraduationCap, color: '#518214' },
    { title: '7 Schools & 30+ Depts', count: `${GRI_INSTITUTIONAL_DATA.schools.length} Schools`, icon: BookOpen, color: '#911C03' },
    { title: '15+ Specialized Facilities', count: `${GRI_INSTITUTIONAL_DATA.facilities.length} Facilities`, icon: MapPin, color: '#F16236' },
    { title: '16+ Institutional Cells', count: `${GRI_INSTITUTIONAL_DATA.cells.length} Cells`, icon: Shield, color: '#0D47A1' },
    { title: 'Operational Manuals', count: `${GRI_INSTITUTIONAL_DATA.manuals.length} Manuals`, icon: FileText, color: '#00838F' },
    { title: 'Unnat Bharat Abhiyan', count: 'UBA & KVK Advisories', icon: Sun, color: '#6A1B9A' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Discover GRI" subtitle={GRI_INSTITUTIONAL_DATA.motto} variant="green" />

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Global Search Bar */}
        <View className="flex-row items-center bg-white border border-gray-300 rounded-2xl px-3.5 py-2.5 mb-3.5 shadow-sm">
          <Search size={20} color="#6B7280" />
          <TextInput
            placeholder="Search departments, circulars, tenders, careers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2.5 text-sm text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Dedicated Navigation Page Banner */}
        <TouchableOpacity
          onPress={() => router.push('/navigation')}
          className="bg-[#518214] p-3.5 rounded-2xl mb-4 flex-row items-center justify-between shadow-sm"
        >
          <View className="flex-row items-center flex-1 pr-2">
            <Compass size={22} color="#FFFFFF" />
            <View className="ml-3 flex-1">
              <Text className="text-sm font-bold text-white">Full GRI Navigation Directory</Text>
              <Text className="text-[11px] text-emerald-100 font-medium">Browse all 16 categories & 150+ portal links</Text>
            </View>
          </View>
          <View className="bg-white/20 px-2.5 py-1 rounded-lg">
            <Text className="text-xs font-bold text-white">OPEN →</Text>
          </View>
        </TouchableOpacity>

        {/* Dynamic Category Selector Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {[
            { id: 'ECOSYSTEM', label: 'Overview', icon: Compass },
            { id: 'CIRCULARS', label: 'Circulars', icon: Bell },
            { id: 'EVENTS', label: 'Events', icon: Calendar },
            { id: 'TENDERS', label: 'Tenders', icon: FileSpreadsheet },
            { id: 'CAREERS', label: 'Careers', icon: Briefcase },
            { id: 'STUDENT_CORNER', label: 'Student Corner', icon: UserCheck },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id as any)}
                className={`flex-row items-center px-3.5 py-2 rounded-xl mr-2.5 border ${
                  isActive ? 'bg-[#518214] border-[#518214]' : 'bg-white border-gray-200'
                }`}
              >
                <TabIcon size={16} color={isActive ? '#FFFFFF' : '#4B5563'} />
                <Text className={`text-xs font-bold ml-1.5 ${isActive ? 'text-white' : 'text-gray-700'}`}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* OVERVIEW / ECOSYSTEM TAB */}
        {activeTab === 'ECOSYSTEM' && (
          <>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-gray-900">Institutional Ecosystem</Text>
              <Compass size={20} color="#518214" />
            </View>

            <View className="flex-row flex-wrap justify-between mb-4">
              {categories.map((cat, index) => {
                const Icon = cat.icon;
                return (
                  <Card
                    key={index}
                    onPress={() => router.push('/(tabs)/home')}
                    className="w-[48%] mb-3.5 p-4 items-center border-gray-200 bg-white shadow-sm"
                  >
                    <View className="p-3 rounded-2xl mb-2" style={{ backgroundColor: `${cat.color}15` }}>
                      <Icon size={24} color={cat.color} />
                    </View>
                    <Text className="text-sm font-bold text-gray-900 text-center">{cat.title}</Text>
                    <Text className="text-[11px] font-medium text-gray-500 text-center mt-0.5">{cat.count}</Text>
                  </Card>
                );
              })}
            </View>

            <Text className="text-base font-bold text-gray-900 mb-2">Schools & Departments</Text>
            {GRI_INSTITUTIONAL_DATA.schools.map((school) => (
              <View key={school.id} className="bg-white p-3.5 rounded-xl mb-3 border border-gray-200 shadow-sm">
                <Text className="text-sm font-bold text-emerald-800 mb-1">{school.name}</Text>
                {school.departments.map((dept) => (
                  <Text key={dept.code} className="text-xs text-gray-600 font-medium py-0.5">
                    • {dept.name} ({dept.head})
                  </Text>
                ))}
              </View>
            ))}
          </>
        )}

        {/* CIRCULARS TAB */}
        {activeTab === 'CIRCULARS' && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">📢 Official Circulars & Notifications</Text>
            {GRI_INSTITUTIONAL_DATA.circulars.map((circ) => (
              <View key={circ.id} className="bg-white p-4 rounded-xl mb-3 border border-gray-200 shadow-sm">
                <View className="flex-row items-center justify-between mb-1.5">
                  <Text className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {circ.category}
                  </Text>
                  <Text className="text-[11px] text-gray-400 font-medium">{circ.publishDate}</Text>
                </View>
                <Text className="text-sm font-bold text-gray-900 mb-2">{circ.title}</Text>
                <TouchableOpacity className="flex-row items-center text-[#518214]">
                  <ExternalLink size={14} color="#518214" />
                  <Text className="text-xs font-bold text-[#518214] ml-1">Download Circular PDF</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'EVENTS' && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">📅 Events & Conferences</Text>
            {GRI_INSTITUTIONAL_DATA.events.map((evt) => (
              <View key={evt.id} className="bg-white p-4 rounded-xl mb-3 border border-gray-200 shadow-sm">
                <View className="flex-row items-center justify-between mb-1.5">
                  <Text className="text-[11px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {evt.category}
                  </Text>
                  <Text className="text-[11px] text-indigo-600 font-bold">{evt.eventDate}</Text>
                </View>
                <Text className="text-sm font-bold text-gray-900 mb-1">{evt.title}</Text>
                <Text className="text-xs text-gray-600 font-medium mb-1">Organizer: {evt.organizer}</Text>
                <Text className="text-xs text-gray-500 mb-2.5">📍 {evt.venue}</Text>
                <TouchableOpacity className="bg-indigo-600 py-2 rounded-lg items-center">
                  <Text className="text-xs font-bold text-white">Register / Details</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* TENDERS TAB */}
        {activeTab === 'TENDERS' && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">📑 Active Tenders & E-Procurement</Text>
            {GRI_INSTITUTIONAL_DATA.tenders.map((tend) => (
              <View key={tend.tenderNo} className="bg-white p-4 rounded-xl mb-3 border border-gray-200 shadow-sm">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-xs font-mono font-bold text-gray-500">{tend.tenderNo}</Text>
                  <View className="bg-amber-100 px-2 py-0.5 rounded-full">
                    <Text className="text-[10px] font-bold text-amber-800">{tend.status}</Text>
                  </View>
                </View>
                <Text className="text-sm font-bold text-gray-900 mb-1.5">{tend.title}</Text>
                <Text className="text-xs text-red-600 font-semibold mb-2">
                  ⏰ Submission Closing: {tend.closingDate}
                </Text>
                <TouchableOpacity className="flex-row items-center">
                  <ExternalLink size={14} color="#0D47A1" />
                  <Text className="text-xs font-bold text-[#0D47A1] ml-1">Download Tender Document PDF</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* CAREERS TAB */}
        {activeTab === 'CAREERS' && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">💼 Careers & Recruitment Notices</Text>
            {GRI_INSTITUTIONAL_DATA.careers.map((car) => (
              <View key={car.advtNo} className="bg-white p-4 rounded-xl mb-3 border border-gray-200 shadow-sm">
                <Text className="text-xs font-mono font-bold text-emerald-700 mb-0.5">{car.advtNo}</Text>
                <Text className="text-sm font-bold text-gray-900 mb-1">{car.postName}</Text>
                <Text className="text-xs text-gray-600 mb-1">Dept: {car.department} · Scale: {car.salary}</Text>
                <Text className="text-xs text-gray-500 mb-2">Qualifications: {car.qualification}</Text>
                <View className="flex-row items-center justify-between border-t border-gray-100 pt-2.5">
                  <Text className="text-xs font-bold text-red-600">Last Date: {car.lastDate}</Text>
                  <TouchableOpacity className="bg-[#518214] px-3 py-1.5 rounded-lg">
                    <Text className="text-xs font-bold text-white">Apply / Prospectus</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* STUDENT CORNER TAB */}
        {activeTab === 'STUDENT_CORNER' && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">👨‍🎓 Student Corner Self-Services</Text>

            <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Core Portals</Text>
            {GRI_INSTITUTIONAL_DATA.studentCorner.portals.map((p, idx) => (
              <View key={idx} className="bg-white p-3.5 rounded-xl mb-2.5 flex-row items-center justify-between border border-gray-200">
                <Text className="text-sm font-bold text-gray-800">{p.name}</Text>
                <Text className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {p.badge}
                </Text>
              </View>
            ))}

            <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-3 mb-2">Academic & Exam Services</Text>
            {GRI_INSTITUTIONAL_DATA.studentCorner.academic_services.map((a, idx) => (
              <View key={idx} className="bg-white p-3 rounded-xl mb-2 flex-row items-center justify-between border border-gray-200">
                <Text className="text-xs font-medium text-gray-700">• {a.title}</Text>
                <ExternalLink size={14} color="#518214" />
              </View>
            ))}

            <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-3 mb-2">Welfare & Grievances</Text>
            {GRI_INSTITUTIONAL_DATA.studentCorner.welfare_grievances.map((w, idx) => (
              <View key={idx} className="bg-white p-3 rounded-xl mb-2 flex-row items-center justify-between border border-gray-200">
                <Text className="text-xs font-medium text-gray-700">• {w.title}</Text>
                <ExternalLink size={14} color="#911C03" />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

