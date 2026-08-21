import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import {
  CreditCard,
  Building2,
  Library,
  AlertCircle,
  QrCode,
  Download,
  Bus,
  ShieldCheck,
  X,
  User,
  GraduationCap,
} from 'lucide-react-native';

import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { useAuthStore } from '../../core/auth/authStore';

export default function ServicesScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [showDigitalId, setShowDigitalId] = useState(false);

  const services = [
    { title: 'Digital Student ID', subtitle: 'QR Verification Card', icon: QrCode, color: '#518214', action: () => setShowDigitalId(true) },
    { title: 'Samarth Fee Portal', subtitle: 'Semester & Exam Fees', icon: CreditCard, color: '#911C03', route: '/(tabs)/academics' },
    { title: 'Hostel & Out-Pass', subtitle: 'Leave Requests & Warden', icon: Building2, color: '#F16236', route: '/(tabs)/hostel' },
    { title: 'Library OPAC', subtitle: 'Book Search & Catalog', icon: Library, color: '#6A1B9A', route: '/(tabs)/academics' },
    { title: 'Grievance Portal', subtitle: 'File & Track Complaints', icon: AlertCircle, color: '#C62828', route: '/(tabs)/profile' },
    { title: 'Document Vault', subtitle: 'Hall Tickets & Receipts', icon: Download, color: '#00838F', route: '/(tabs)/examinations' },
    { title: 'Transport & Bus', subtitle: 'Routes & Bus Passes', icon: Bus, color: '#F57F17', route: '/(tabs)/home' },
    { title: 'Security & Biometrics', subtitle: 'MFA & Fingerprint Auth', icon: ShieldCheck, color: '#2E7D32', route: '/(tabs)/profile' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="GRI Services" subtitle="University Student & Staff Services" variant="green" />

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Digital ID Highlight Banner */}
        <TouchableOpacity
          onPress={() => setShowDigitalId(true)}
          activeOpacity={0.85}
          className="bg-gradient-to-r bg-[#518214] p-4 rounded-2xl mb-5 shadow-sm border border-emerald-800 flex-row items-center justify-between"
        >
          <View className="flex-1 pr-3">
            <View className="flex-row items-center mb-1">
              <QrCode size={18} color="#A7F3D0" />
              <Text className="text-xs font-bold text-emerald-200 ml-1.5 uppercase tracking-wider">
                Official Digital Identity
              </Text>
            </View>
            <Text className="text-white font-bold text-base">GRI Digital Student ID Card</Text>
            <Text className="text-xs text-emerald-100 mt-0.5">Tap to view your QR-verified student credential</Text>
          </View>
          <View className="bg-white/20 p-3 rounded-full">
            <QrCode size={28} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* Services List */}
        <Text className="text-lg font-bold text-gray-900 mb-3">All Portal Services</Text>
        <View className="gap-3 mb-6">
          {services.map((svc, index) => {
            const Icon = svc.icon;
            return (
              <Card
                key={index}
                onPress={() => {
                  if (svc.action) svc.action();
                  else if (svc.route) router.push(svc.route as any);
                }}
                className="p-4 flex-row items-center border-gray-200 bg-white shadow-sm"
              >
                <View className="p-3 rounded-xl mr-3.5" style={{ backgroundColor: `${svc.color}15` }}>
                  <Icon size={24} color={svc.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-900">{svc.title}</Text>
                  <Text className="text-xs text-gray-500 mt-0.5">{svc.subtitle}</Text>
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>

      {/* Digital ID Modal */}
      <Modal visible={showDigitalId} transparent animationType="slide">
        <View className="flex-1 bg-black/60 items-center justify-center p-6">
          <View className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl">
            {/* ID Header */}
            <View className="bg-[#518214] p-5 items-center">
              <TouchableOpacity
                onPress={() => setShowDigitalId(false)}
                className="absolute top-4 right-4 p-1 bg-white/20 rounded-full"
              >
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <GraduationCap size={44} color="#FFFFFF" />
              <Text className="text-lg font-bold text-white text-center mt-2">Gandhigram Rural Institute</Text>
              <Text className="text-xs text-emerald-100">Deemed to be University · Official ID</Text>
            </View>

            {/* ID Body */}
            <View className="p-6 items-center">
              <View className="w-24 h-24 rounded-full bg-emerald-100 items-center justify-center mb-4 border-2 border-[#518214]">
                <User size={48} color="#518214" />
              </View>
              <Text className="text-xl font-bold text-gray-900 text-center">{user?.fullName || 'Vijay Maheswari'}</Text>
              <Text className="text-sm font-semibold text-[#911C03] mt-0.5">{user?.rollNumber || 'GRI-2024-8841'}</Text>
              <Text className="text-xs text-gray-500 mt-1 text-center">
                {user?.department || 'Computer Science & Applications'}
              </Text>

              {/* QR Code Placeholder */}
              <View className="mt-5 p-4 bg-gray-50 border border-gray-200 rounded-2xl items-center">
                <QrCode size={110} color="#1F2937" />
                <Text className="text-[10px] text-gray-400 font-mono mt-2">SECURE VERIFIED TOKEN: GRI-88419921</Text>
              </View>

              <View className="flex-row items-center mt-4">
                <ShieldCheck size={16} color="#518214" />
                <Text className="text-xs font-semibold text-emerald-800 ml-1">Valid Academic Year 2025-2026</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
