import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, User, Phone, Mail, Building } from 'lucide-react-native';

export default function RegistrarScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#0D47A1] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Office of the Registrar</Text>
            <Text className="text-xs text-blue-100 font-medium">Custodian of Records & Administrative Head</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 mb-4 shadow-sm items-center">
          <View className="p-4 bg-blue-100 rounded-full mb-3">
            <User size={40} color="#0D47A1" />
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-0.5">Dr. L. Raja</Text>
          <Text className="text-xs font-semibold text-[#0D47A1] mb-4">Registrar, Gandhigram Rural Institute</Text>

          <View className="w-full bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
            <Text className="text-xs font-bold text-[#0D47A1] uppercase mb-1">Administrative Mandate</Text>
            <Text className="text-xs text-gray-700 leading-relaxed">
              Head of University Administration, Secretary to Board of Management, Academic Council, and Planning Board.
            </Text>
          </View>

          <View className="w-full border-t border-gray-100 pt-3">
            <Text className="text-xs font-bold text-gray-800 uppercase mb-2">Registrar Office Contact</Text>
            <TouchableOpacity onPress={() => Linking.openURL('tel:+914512452305')} className="flex-row items-center bg-gray-50 p-3 rounded-xl border border-gray-200 mb-2">
              <Phone size={16} color="#0D47A1" />
              <Text className="text-xs font-semibold text-gray-800 ml-2.5">+91 451 2452305</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('mailto:registrar@ruraluniv.ac.in')} className="flex-row items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
              <Mail size={16} color="#0D47A1" />
              <Text className="text-xs font-semibold text-gray-800 ml-2.5">registrar@ruraluniv.ac.in</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
