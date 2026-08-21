import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Building2, Phone, Mail } from 'lucide-react-native';

export default function AdministrativeOfficesScreen() {
  const router = useRouter();

  const offices = [
    { name: 'Vice-Chancellor Secretariat', location: 'Administrative Block, Ground Floor', phone: '+91 451 2452301', email: 'vc@ruraluniv.ac.in' },
    { name: 'Registrar Office', location: 'Administrative Block, 1st Floor', phone: '+91 451 2452305', email: 'registrar@ruraluniv.ac.in' },
    { name: 'Controller of Examinations (CoE)', location: 'Examination Building', phone: '+91 451 2452320', email: 'coe@ruraluniv.ac.in' },
    { name: 'Finance & Accounts Division', location: 'Finance Block', phone: '+91 451 2452310', email: 'fo@ruraluniv.ac.in' },
    { name: 'Chief Vigilance Office (CVO)', location: 'Administrative Annex', phone: '+91 451 2452315', email: 'cvo@ruraluniv.ac.in' },
    { name: 'Estate & Security Office', location: 'Main Gate Complex', phone: '+91 451 2452330', email: 'estate@ruraluniv.ac.in' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#0D47A1] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Administrative Offices</Text>
            <Text className="text-xs text-blue-100 font-medium">Campus Sections & Contact Directory</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {offices.map((off, idx) => (
          <View key={idx} className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm">
            <View className="flex-row items-center mb-2">
              <Building2 size={20} color="#0D47A1" style={{ marginRight: 8 }} />
              <Text className="text-base font-bold text-gray-900 flex-1">{off.name}</Text>
            </View>
            <Text className="text-xs text-gray-500 mb-2">📍 {off.location}</Text>
            <View className="flex-row items-center justify-between border-t border-gray-100 pt-2.5">
              <View className="flex-row items-center">
                <Phone size={13} color="#0D47A1" />
                <Text className="text-xs text-gray-700 font-medium ml-1">{off.phone}</Text>
              </View>
              <View className="flex-row items-center">
                <Mail size={13} color="#0D47A1" />
                <Text className="text-xs text-gray-700 font-medium ml-1">{off.email}</Text>
              </View>
            </View>
          </View>
        ))}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
