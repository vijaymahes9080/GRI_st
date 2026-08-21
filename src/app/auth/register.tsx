import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  User,
  Mail,
  Lock,
  Phone,
  ShieldAlert,
  CheckCircle,
  Building,
  KeyRound,
  ArrowRight,
  AlertCircle,
} from 'lucide-react-native';
import { apiClient } from '../../core/api';

export default function RegisterScreen() {
  const router = useRouter();

  const [registerType, setRegisterType] = useState<'USER_REQUEST' | 'ADMIN_SELF'>('USER_REQUEST');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [department, setDepartment] = useState('Computer Science & Applications');
  const [programme, setProgramme] = useState('B.Sc. Computer Science');
  const [year, setYear] = useState('1');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required fields (Full Name, Email, Password).');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (registerType === 'ADMIN_SELF' && !adminSecret.trim()) {
      setErrorMsg('Admin secret key is required for Admin self-registration.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (registerType === 'ADMIN_SELF') {
        const response = await apiClient.post('/auth/admin/register', {
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          password: password.trim(),
          admin_secret: adminSecret.trim(),
        });

        if (response.data) {
          setSuccessMsg('Admin registration successful! You can now sign in with your credentials.');
          Alert.alert(
            'Admin Account Created',
            'Your admin account has been created and approved in the database.',
            [{ text: 'Go to Sign In', onPress: () => router.replace('/auth/login') }]
          );
        }
      } else {
        // Registration flow with channel availability
        const response = await apiClient.post('/auth/register', {
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          whatsapp_number: whatsappNumber.trim() || phone.trim() || undefined,
          university_id: universityId.trim() || undefined,
          password: password.trim(),
          role: role,
          department: department,
          programme: programme,
          year: parseInt(year) || 1,
        });

        setSuccessMsg('Registration successful! You can now sign in with your credentials.');
        Alert.alert(
          'Account Registered',
          'Your GRI user account has been registered and approved.',
          [{ text: 'Go to Sign In', onPress: () => router.replace('/auth/login') }]
        );
      }
    } catch (err: any) {
      console.warn('[RegisterScreen] Registration error:', err?.response?.data || err.message);
      const detail = err?.response?.data?.detail;
      setErrorMsg(typeof detail === 'string' ? detail : 'Registration failed. Please check inputs and secret key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-[#518214] pt-12 pb-6 px-4 rounded-b-3xl shadow-md">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
              <ChevronLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-xl font-bold text-white">Create Account / Register</Text>
              <Text className="text-xs text-emerald-100 font-medium">GRI Multi-User Portal Access</Text>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
          {/* Toggle Type */}
          <View className="flex-row bg-gray-200 p-1.5 rounded-2xl mb-5">
            <TouchableOpacity
              onPress={() => {
                setRegisterType('USER_REQUEST');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-xl items-center ${
                registerType === 'USER_REQUEST' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  registerType === 'USER_REQUEST' ? 'text-[#518214]' : 'text-gray-600'
                }`}
              >
                Student / Staff Request
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setRegisterType('ADMIN_SELF');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-xl items-center ${
                registerType === 'ADMIN_SELF' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  registerType === 'ADMIN_SELF' ? 'text-[#911C03]' : 'text-gray-600'
                }`}
              >
                Admin Self-Registration
              </Text>
            </TouchableOpacity>
          </View>

          {/* Alert Messages */}
          {errorMsg && (
            <View className="bg-red-50 border border-red-200 p-3.5 rounded-xl mb-4 flex-row items-center">
              <AlertCircle size={18} color="#D32F2F" />
              <Text className="text-xs text-red-700 font-semibold ml-2 flex-1">{errorMsg}</Text>
            </View>
          )}

          {successMsg && (
            <View className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl mb-4 flex-row items-center">
              <CheckCircle size={18} color="#518214" />
              <Text className="text-xs text-emerald-800 font-semibold ml-2 flex-1">{successMsg}</Text>
            </View>
          )}

          {/* Form Card */}
          <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-6">
            <Text className="text-base font-bold text-gray-900 mb-4">
              {registerType === 'ADMIN_SELF' ? 'System Administrator Registration' : 'New User Registration Request'}
            </Text>

            {/* Full Name */}
            <Text className="text-xs font-bold text-gray-700 uppercase mb-1">Full Name *</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 mb-3">
              <User size={18} color="#6B7280" />
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="e.g. Vijay Maheswari"
                className="flex-1 ml-2.5 text-sm text-gray-900 font-medium"
              />
            </View>

            {/* Email */}
            <Text className="text-xs font-bold text-gray-700 uppercase mb-1">Email Address *</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 mb-3">
              <Mail size={18} color="#6B7280" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="user@ruraluniv.ac.in or personal@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 ml-2.5 text-sm text-gray-900 font-medium"
              />
            </View>

            {/* Phone */}
            <Text className="text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 mb-3">
              <Phone size={18} color="#6B7280" />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+91 98765 43210"
                keyboardType="phone-pad"
                className="flex-1 ml-2.5 text-sm text-gray-900 font-medium"
              />
            </View>

            {/* Department */}
            <Text className="text-xs font-bold text-gray-700 uppercase mb-1">Department / School</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 mb-3">
              <Building size={18} color="#6B7280" />
              <TextInput
                value={department}
                onChangeText={setDepartment}
                placeholder="e.g. Computer Science & Applications"
                className="flex-1 ml-2.5 text-sm text-gray-900 font-medium"
              />
            </View>

            {/* Password */}
            <Text className="text-xs font-bold text-gray-700 uppercase mb-1">Password * (Min 8 chars)</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 mb-3">
              <Lock size={18} color="#6B7280" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
                className="flex-1 ml-2.5 text-sm text-gray-900 font-medium"
              />
            </View>

            {/* Confirm Password */}
            <Text className="text-xs font-bold text-gray-700 uppercase mb-1">Confirm Password *</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 mb-3">
              <Lock size={18} color="#6B7280" />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="••••••••"
                className="flex-1 ml-2.5 text-sm text-gray-900 font-medium"
              />
            </View>

            {/* Admin Secret key input if ADMIN_SELF */}
            {registerType === 'ADMIN_SELF' && (
              <View className="mt-2 mb-3 bg-red-50 p-3 rounded-xl border border-red-200">
                <Text className="text-xs font-bold text-red-800 uppercase mb-1">Admin Secret Protection Key *</Text>
                <View className="flex-row items-center bg-white border border-red-300 rounded-xl px-3 py-2">
                  <KeyRound size={18} color="#D32F2F" />
                  <TextInput
                    value={adminSecret}
                    onChangeText={setAdminSecret}
                    placeholder="Enter ADMIN_REGISTER_SECRET"
                    secureTextEntry
                    className="flex-1 ml-2.5 text-sm text-gray-900 font-medium"
                  />
                </View>
                <Text className="text-[10px] text-red-600 mt-1">
                  Required key from backend .env (`ADMIN_REGISTER_SECRET`)
                </Text>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              className="bg-[#518214] py-3.5 rounded-xl items-center flex-row justify-center mt-3 shadow-sm"
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-white font-bold text-sm uppercase">
                  {registerType === 'ADMIN_SELF' ? 'Create Admin Account' : 'Submit Registration Request'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Already have an account */}
          <TouchableOpacity
            onPress={() => router.replace('/auth/login')}
            className="items-center mb-8"
          >
            <Text className="text-xs font-semibold text-gray-600">
              Already have an account? <Text className="text-[#518214] font-bold">Sign In Here</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
