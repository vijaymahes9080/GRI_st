import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Building2, ChevronRight, Home } from 'lucide-react-native';

export default function InfrastructureDirectoryScreen() {
  const router = useRouter();

  const infraList = [
    { title: 'Boys & Girls Hostels', category: 'RESIDENTIAL', route: '/infrastructure/hostels', desc: '12 On-Campus Hostels & Mess Facilities' },
    { title: 'Faculty & Guest House', category: 'AMENITY', route: '/infrastructure/hostels', desc: 'VIP Guest House & Visitor Quarters' },
    { title: 'University Health Centre', category: 'MEDICAL', route: '/infrastructure/hostels', desc: '24/7 Medical Care & Ambulance' },
    { title: 'GRI Co-operative Store & Canteen', category: 'CONVENIENCE', route: '/infrastructure/hostels', desc: 'Student Stores, Food Court & Bank Branch' },
    { title: 'High-Speed Wi-Fi Campus & NKN', category: 'IT INFRASTRUCTURE', route: '/infrastructure/hostels', desc: '1 Gbps Optical Fiber NKN Back-bone' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#C2185B] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Campus Infrastructure</Text>
            <Text className="text-xs text-pink-100 font-medium">Hostels, Health Centre, Wi-Fi & Amenities</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {infraList.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => router.push(item.route as any)}
            className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1 pr-3">
              <View className="p-3 bg-pink-50 rounded-xl mr-3 border border-pink-100">
                <Building2 size={22} color="#C2185B" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-[#C2185B] uppercase mb-0.5">{item.category}</Text>
                <Text className="text-base font-bold text-gray-900">{item.title}</Text>
                <Text className="text-xs text-gray-500 mt-0.5">{item.desc}</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
