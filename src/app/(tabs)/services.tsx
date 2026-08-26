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
import { useResponsive } from '../../core/responsive/useResponsive';

export default function ServicesScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { isTablet } = useResponsive();
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
    <View className="flex-1 bg-slate-50">
      <Header title="GRI Services" subtitle="University Student & Staff Services" variant="white" />
      <ScrollView className="flex-1" contentContainerStyle={{ padding: isTablet ? 24 : 16 }} showsVerticalScrollIndicator={false}>
        
        <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
          {/* Digital ID Highlight Banner */}
          <TouchableOpacity
            onPress={() => setShowDigitalId(true)}
            activeOpacity={0.85}
            className="bg-[#0D47A1] p-5 rounded-xl mb-8 shadow-sm flex-row items-center justify-between"
          >
            <View className="flex-1 pr-4">
              <View className="flex-row items-center mb-2">
                <QrCode size={18} color="#93C5FD" />
                <Text className="text-xs font-bold text-blue-200 ml-2 uppercase tracking-wider">
                  Official Digital Identity
                </Text>
              </View>
              <Text className="text-white font-bold text-lg mb-1">GRI Digital Student ID Card</Text>
              <Text className="text-sm text-blue-100 mt-0.5">Tap to view your QR-verified student credential</Text>
            </View>
            <View className="bg-white/10 p-4 rounded-xl border border-white/20">
              <QrCode size={32} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {/* Services List */}
          <Text className="text-lg font-bold text-slate-900 mb-4 px-1">All Portal Services</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            {services.map((svc, index) => {
              const Icon = svc.icon;
              return (
                <Card
                  key={index}
                  onPress={() => {
                    if (svc.action) svc.action();
                    else if (svc.route) router.push(svc.route as any);
                  }}
                  className="bg-white border-slate-200 shadow-sm"
                  style={{ width: isTablet ? 'calc(50% - 8px)' : '100%', padding: 16, flexDirection: 'row', alignItems: 'center' }}
                >
                  <View className="p-3 rounded-lg mr-4 border border-slate-100" style={{ backgroundColor: `${svc.color}15` }}>
                    <Icon size={24} color={svc.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-slate-900">{svc.title}</Text>
                    <Text className="text-sm text-slate-500 mt-1">{svc.subtitle}</Text>
                  </View>
                </Card>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Digital ID Modal */}
      <Modal visible={showDigitalId} transparent animationType="fade">
        <View className="flex-1 bg-slate-900/60 items-center justify-center p-6 z-50">
          <View className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            {/* ID Header */}
            <View className="bg-[#0D47A1] p-6 items-center">
              <TouchableOpacity
                onPress={() => setShowDigitalId(false)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg"
              >
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <GraduationCap size={44} color="#FFFFFF" />
              <Text className="text-lg font-bold text-white text-center mt-3">Gandhigram Rural Institute</Text>
              <Text className="text-sm text-blue-200 mt-1">Deemed to be University</Text>
            </View>

            {/* ID Body */}
            <View className="p-6 items-center">
              <View className="w-24 h-24 rounded-full bg-slate-100 items-center justify-center mb-4 border-2 border-slate-200">
                <User size={48} color="#94A3B8" />
              </View>
              <Text className="text-xl font-bold text-slate-900 text-center">{user?.fullName || 'Authenticated User'}</Text>
              <Text className="text-base font-semibold text-khadi-blue mt-1">{user?.rollNumber || 'GRI-2024-8841'}</Text>
              <Text className="text-sm text-slate-500 mt-2 text-center px-4">
                {user?.department || 'Computer Science & Applications'}
              </Text>

              {/* QR Code Placeholder */}
              <View className="mt-6 p-4 bg-white border border-slate-200 rounded-xl items-center shadow-sm">
                <QrCode size={120} color="#0F172A" />
                <Text className="text-[10px] text-slate-400 font-mono mt-3 uppercase tracking-widest">SECURE VERIFIED TOKEN: GRI-88419921</Text>
              </View>

              <View className="flex-row items-center mt-6 p-2 bg-emerald-50 rounded-lg border border-emerald-100 w-full justify-center">
                <ShieldCheck size={16} color="#059669" />
                <Text className="text-xs font-semibold text-emerald-800 ml-2 uppercase tracking-wider">Valid Academic Year 2025-2026</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
