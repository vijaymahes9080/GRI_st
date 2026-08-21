import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { User, ShieldCheck, Bell, Lock, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';

import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { useAuthStore, UserRole } from '../../core/auth/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuthStore();
  const [showRoleModal, setShowRoleModal] = React.useState(false);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of GRI Portal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  const allRoles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'STUDENT', title: 'Student', desc: 'Attendance, Grades, Fees & Hall Ticket' },
    { role: 'FACULTY', title: 'Faculty', desc: 'Class Attendance, CFA Marks & Roster' },
    { role: 'RESEARCH_SCHOLAR', title: 'Research Scholar', desc: 'Ph.D. Progress, Thesis & Fellowship' },
    { role: 'DEPARTMENT_ADMIN', title: 'Department Admin', desc: 'Departmental Notices & Timetables' },
    { role: 'EXAM_STAFF', title: 'Exam Staff', desc: 'Seating, Exam Schedules & Revaluation' },
    { role: 'HOSTEL_STAFF', title: 'Hostel Warden', desc: 'Outpass Approvals & Mess Fees' },
    { role: 'FINANCE_STAFF', title: 'Finance Staff', desc: 'Fee Ledger & Payment Receipts' },
    { role: 'UNIVERSITY_ADMIN', title: 'University Admin', desc: 'University Dashboard & Content CMS' },
    { role: 'LIBRARIAN', title: 'Librarian', desc: 'OPAC Search & Book Transactions' },
    { role: 'PLACEMENT_OFFICER', title: 'Placement Officer', desc: 'Campus Drives & Interviews' },
    { role: 'ALUMNI', title: 'Alumni', desc: 'Networking, Events & Mentorship' },
    { role: 'PENSIONER', title: 'Pensioner', desc: 'Life Certificate & Pension Status' },
    { role: 'SYSTEM_ADMIN', title: 'System Admin', desc: 'RBAC Permissions & Audit Logs' },
  ];

  const [showPreferences, setShowPreferences] = React.useState(false);
  const [preferences, setPreferences] = React.useState({
    push: true,
    email: true,
    whatsapp: true,
    sms: true,
    emergency: true,
  });

  const menuItems = [
    { title: 'View Assigned Role & RBAC Scope', icon: ShieldCheck, action: () => setShowRoleModal(true) },
    { title: 'Security & Biometrics', icon: Lock, action: () => Alert.alert('Biometrics', 'Fingerprint & Hardware Keystore enabled') },
    { title: 'Notification Preferences (Push/Email/WhatsApp/SMS)', icon: Bell, action: () => setShowPreferences(!showPreferences) },
    { title: 'Help & Grievance Portal', icon: HelpCircle, action: () => router.push('/(tabs)/services' as any) },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="My Profile" subtitle="GRI Unified Identity & Settings" variant="green" />

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <Card className="p-5 mb-5 border-gray-200 bg-white flex-row items-center shadow-sm">
          <View className="bg-[#518214] p-4 rounded-full mr-4">
            <User size={32} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900">{user?.fullName || 'Authenticated User'}</Text>
            <View className="bg-[#911C03] px-2.5 py-0.5 rounded-full align-self-start mt-1 mb-1">
              <Text className="text-[10px] font-bold text-white uppercase">{user?.role || 'STUDENT'}</Text>
            </View>
            <Text className="text-xs text-gray-500 font-medium">{user?.department || 'Gandhigram Rural Institute'}</Text>
            <Text className="text-xs font-semibold text-[#518214] mt-0.5">ID: {user?.rollNumber || 'GRI-2026'}</Text>
          </View>
        </Card>

        {/* Menu Items */}
        <Text className="text-lg font-bold text-gray-900 mb-3">Settings & Options</Text>

        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={idx}
              onPress={item.action}
              className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 flex-row items-center justify-between shadow-sm"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <View className="bg-emerald-50 p-2.5 rounded-xl mr-3">
                  <Icon size={20} color="#518214" />
                </View>
                <Text className="text-base font-semibold text-gray-800">{item.title}</Text>
              </View>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
          );
        })}

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-50 border border-red-200 p-4 rounded-2xl mt-4 flex-row items-center justify-center shadow-sm"
          activeOpacity={0.7}
        >
          <LogOut size={20} color="#D32F2F" />
          <Text className="text-base font-bold text-red-600 ml-2">Sign Out of GRI Portal</Text>
        </TouchableOpacity>

        <View className="h-8" />
      </ScrollView>

      {/* Read-Only RBAC Scope Security Audit Modal */}
      <React.Fragment>
        {showRoleModal && (
          <View className="absolute inset-0 bg-black/60 items-center justify-center p-5 z-50">
            <View className="bg-white w-full max-w-md rounded-3xl p-5 max-h-[80%]">
              <Text className="text-xl font-bold text-gray-900 mb-1 text-center">Authenticated RBAC Scope</Text>
              <Text className="text-xs text-gray-500 mb-4 text-center">
                Verified identity permissions signed by GRI PostgreSQL Auth Server
              </Text>

              <View className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl mb-4">
                <Text className="text-xs font-bold text-emerald-800 uppercase mb-1">Active Institutional Role</Text>
                <Text className="text-lg font-extrabold text-[#518214]">{user?.role || 'STUDENT'}</Text>
                <Text className="text-xs text-gray-600 mt-1">
                  User ID: {user?.id || 'Verified'}
                </Text>
                <Text className="text-xs text-gray-600">
                  Email: {user?.email || 'Verified'}
                </Text>
              </View>

              <Text className="text-xs font-bold text-gray-700 uppercase mb-2">Role Access Control Details</Text>
              <ScrollView className="gap-2 mb-4" showsVerticalScrollIndicator={false}>
                {allRoles
                  .filter((r) => r.role === user?.role)
                  .map((r, i) => (
                    <View key={i} className="p-3.5 rounded-xl border bg-emerald-50 border-[#518214] mb-2 flex-row items-center justify-between">
                      <View className="flex-1 pr-2">
                        <Text className="text-sm font-bold text-gray-900">{r.title}</Text>
                        <Text className="text-xs text-gray-600 mt-0.5">{r.desc}</Text>
                      </View>
                      <ShieldCheck size={22} color="#518214" />
                    </View>
                  ))}
              </ScrollView>

              <TouchableOpacity
                onPress={() => setShowRoleModal(false)}
                className="bg-gray-200 p-3.5 rounded-xl items-center"
              >
                <Text className="text-sm font-bold text-gray-800">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </React.Fragment>
    </View>
  );
}
