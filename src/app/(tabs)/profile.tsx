import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { User, ShieldCheck, Bell, Lock, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { useAuthStore, UserRole } from '../../core/auth/authStore';
import { useResponsive } from '../../core/responsive/useResponsive';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuthStore();
  const { isTablet } = useResponsive();
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
    { title: 'Notification Preferences', icon: Bell, action: () => setShowPreferences(!showPreferences) },
    { title: 'Help & Grievance Portal', icon: HelpCircle, action: () => router.push('/(tabs)/services' as any) },
  ];

  return (
    <View className="flex-1 bg-slate-50">
      <Header title="My Profile" subtitle="GRI Unified Identity" variant="white" />
      <ScrollView className="flex-1" contentContainerStyle={{ padding: isTablet ? 24 : 16 }} showsVerticalScrollIndicator={false}>
        
        <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
          {/* User Card */}
          <Card className="p-6 mb-8 border-slate-200 bg-white flex-row items-center shadow-sm">
            <View className="bg-khadi-blue p-4 rounded-xl mr-6">
              <User size={36} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-slate-900 tracking-tight">{user?.fullName || 'Authenticated User'}</Text>
              <View className="bg-emerald-100 px-3 py-1 rounded-md self-start mt-2 mb-2">
                <Text className="text-xs font-bold text-emerald-800 tracking-wider uppercase">{user?.role || 'STUDENT'}</Text>
              </View>
              <Text className="text-sm text-slate-600">{user?.department || 'Gandhigram Rural Institute'}</Text>
              <Text className="text-sm font-medium text-slate-500 mt-1">ID: {user?.rollNumber || 'GRI-2026'}</Text>
            </View>
          </Card>

          {/* Menu Items */}
          <Text className="text-lg font-bold text-slate-900 mb-4 px-1">Settings & Options</Text>
          <View className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={item.action}
                  className={`p-4 flex-row items-center justify-between bg-white ${idx !== menuItems.length - 1 ? 'border-b border-slate-100' : ''}`}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    <View className="bg-slate-50 p-2.5 rounded-lg mr-4 border border-slate-100">
                      <Icon size={20} color="#475569" />
                    </View>
                    <Text className="text-base font-medium text-slate-800">{item.title}</Text>
                  </View>
                  <ChevronRight size={18} color="#94A3B8" />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-50 border border-red-200 p-4 rounded-xl flex-row items-center justify-center shadow-sm"
            activeOpacity={0.7}
          >
            <LogOut size={20} color="#DC2626" />
            <Text className="text-base font-bold text-red-600 ml-2">Sign Out of GRI Portal</Text>
          </TouchableOpacity>
          <View className="h-12" />
        </View>
      </ScrollView>

      {/* Read-Only RBAC Scope Security Audit Modal */}
      <React.Fragment>
        {showRoleModal && (
          <View className="absolute inset-0 bg-slate-900/60 items-center justify-center p-4 z-50">
            <View className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl max-h-[80%]">
              <Text className="text-xl font-bold text-slate-900 mb-2 text-center">Authenticated RBAC Scope</Text>
              <Text className="text-sm text-slate-500 mb-6 text-center">
                Verified identity permissions signed by GRI Authentication Server
              </Text>
              
              <View className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl mb-6">
                <Text className="text-xs font-bold text-emerald-800 tracking-wider uppercase mb-2">Active Institutional Role</Text>
                <Text className="text-xl font-extrabold text-emerald-700">{user?.role || 'STUDENT'}</Text>
                <Text className="text-sm text-emerald-900 mt-2">
                  User ID: <Text className="font-medium">{user?.id || 'Verified'}</Text>
                </Text>
                <Text className="text-sm text-emerald-900 mt-1">
                  Email: <Text className="font-medium">{user?.email || 'Verified'}</Text>
                </Text>
              </View>
              
              <Text className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-3">Role Access Control Details</Text>
              
              <ScrollView className="mb-6" showsVerticalScrollIndicator={false}>
                {allRoles
                  .filter((r) => r.role === user?.role)
                  .map((r, i) => (
                    <View key={i} className="p-4 rounded-xl border bg-slate-50 border-slate-200 mb-2 flex-row items-center justify-between">
                      <View className="flex-1 pr-4">
                        <Text className="text-sm font-bold text-slate-900">{r.title}</Text>
                        <Text className="text-sm text-slate-500 mt-1 leading-relaxed">{r.desc}</Text>
                      </View>
                      <ShieldCheck size={24} color="#059669" />
                    </View>
                  ))}
              </ScrollView>
              
              <TouchableOpacity
                onPress={() => setShowRoleModal(false)}
                className="bg-slate-100 p-4 rounded-xl items-center border border-slate-200"
              >
                <Text className="text-base font-bold text-slate-700">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </React.Fragment>
    </View>
  );
}
