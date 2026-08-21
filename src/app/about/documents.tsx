import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, FileText, Download, CheckCircle2 } from 'lucide-react-native';

export default function ImportantDocumentsScreen() {
  const router = useRouter();

  const docs = [
    { title: 'GRI Memorandum of Association (MoA)', size: '2.4 MB', type: 'PDF' },
    { title: 'GRI Rules & Bye-Laws Document', size: '1.8 MB', type: 'PDF' },
    { title: 'UGC Deemed to be University Regulations 2023', size: '3.1 MB', type: 'PDF' },
    { title: 'GRI Master Plan & Green Campus Policy', size: '4.5 MB', type: 'PDF' },
    { title: 'Code of Ethics in Academic Research', size: '1.2 MB', type: 'PDF' },
    { title: 'Equal Opportunity & Reservation Policy', size: '980 KB', type: 'PDF' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Important Documents</Text>
            <Text className="text-xs text-emerald-100 font-medium">Statutory MoA, Bye-Laws & Official Regulations</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <Text className="text-sm font-bold text-gray-800 uppercase mb-3">Institutional Policy Documents</Text>

          {docs.map((doc, idx) => (
            <View key={idx} className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 mb-3 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 pr-2">
                <View className="p-2 bg-emerald-100 rounded-lg mr-3">
                  <FileText size={18} color="#518214" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold text-gray-900 mb-0.5">{doc.title}</Text>
                  <Text className="text-[11px] font-semibold text-gray-500">{doc.type} • {doc.size}</Text>
                </View>
              </View>
              <View className="bg-emerald-100 px-2.5 py-1 rounded-lg">
                <Text className="text-[11px] font-bold text-[#518214]">VERIFIED</Text>
              </View>
            </View>
          ))}
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
