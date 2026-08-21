import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Award, Mail } from 'lucide-react-native';

export default function DeansScreen() {
  const router = useRouter();

  const deansList = [
    { school: 'School of Agriculture & Rural Development', dean: 'Dr. M. Seetharaman', email: 'dean_agri@ruraluniv.ac.in' },
    { school: 'School of Sciences', dean: 'Dr. S. Ramesh', email: 'dean_sci@ruraluniv.ac.in' },
    { school: 'School of Management Studies', dean: 'Dr. V. Ramachandran', email: 'dean_mgt@ruraluniv.ac.in' },
    { school: 'School of Social Sciences', dean: 'Dr. A. Sundaram', email: 'dean_soc@ruraluniv.ac.in' },
    { school: 'School of Tamil & Indian Languages', dean: 'Dr. P. Velmurugan', email: 'dean_lang@ruraluniv.ac.in' },
    { school: 'School of Health Sciences & Sanitation', dean: 'Dr. K. Rajendran', email: 'dean_health@ruraluniv.ac.in' },
    { school: 'School of Engineering & Technology', dean: 'Dr. G. Muralidharan', email: 'dean_engg@ruraluniv.ac.in' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#0D47A1] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Deans of 7 Schools</Text>
            <Text className="text-xs text-blue-100 font-medium">Academic & Administrative Heads of Schools</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {deansList.map((item, idx) => (
          <View key={idx} className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm flex-row items-center">
            <View className="p-3 bg-blue-50 rounded-2xl mr-3.5 border border-blue-100">
              <Award size={22} color="#0D47A1" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-[#0D47A1] uppercase mb-0.5">{item.school}</Text>
              <Text className="text-sm font-bold text-gray-900">{item.dean}</Text>
              <View className="flex-row items-center mt-1">
                <Mail size={12} color="#6B7280" />
                <Text className="text-xs text-gray-500 ml-1">{item.email}</Text>
              </View>
            </View>
          </View>
        ))}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
