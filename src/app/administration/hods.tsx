import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Users, Mail } from 'lucide-react-native';

export default function HeadsOfDepartmentsScreen() {
  const router = useRouter();

  const hodList = [
    { dept: 'Department of Computer Science & Applications', hod: 'Dr. K. Ziyarath Ali', email: 'cs@ruraluniv.ac.in' },
    { dept: 'Department of Agriculture', hod: 'Dr. T. Senthil Kumar', email: 'agri@ruraluniv.ac.in' },
    { dept: 'Department of Mathematics', hod: 'Dr. P. Balasubramaniam', email: 'maths@ruraluniv.ac.in' },
    { dept: 'Department of Physics', hod: 'Dr. K. Marimuthu', email: 'physics@ruraluniv.ac.in' },
    { dept: 'Department of Chemistry', hod: 'Dr. S. Abraham John', email: 'chemistry@ruraluniv.ac.in' },
    { dept: 'Department of Tamil', hod: 'Dr. P. Murugesan', email: 'tamil@ruraluniv.ac.in' },
    { dept: 'Department of Rural Management', hod: 'Dr. N. Kannan', email: 'management@ruraluniv.ac.in' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#0D47A1] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Heads of Departments (HoDs)</Text>
            <Text className="text-xs text-blue-100 font-medium">Departmental Academic Leadership Directory</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {hodList.map((item, idx) => (
          <View key={idx} className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm flex-row items-center">
            <View className="p-3 bg-blue-50 rounded-2xl mr-3.5 border border-blue-100">
              <Users size={20} color="#0D47A1" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-[#0D47A1] mb-0.5">{item.dept}</Text>
              <Text className="text-sm font-bold text-gray-900">{item.hod}</Text>
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
