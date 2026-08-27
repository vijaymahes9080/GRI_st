import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Download, FileText, Search } from 'lucide-react-native';
import { CardSkeleton } from '../components/common/Skeleton';

export default function DownloadsVaultScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate network fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const downloads = [
    { title: 'Hall Ticket Download (May 2026 ESE)', size: '1.2 MB', category: 'EXAM' },
    { title: 'Semester Fee Payment Receipt', size: '0.8 MB', category: 'FEES' },
    { title: 'Admissions Prospectus 2026-2027', size: '12.4 MB', category: 'ADMISSIONS' },
    { title: 'Hostel Leave Out-Pass Form PDF', size: '0.5 MB', category: 'HOSTEL' },
    { title: 'Ph.D. Coursework Syllabus Booklet', size: '3.6 MB', category: 'RESEARCH' },
    { title: 'Academic Calendar 2026', size: '2.1 MB', category: 'ACADEMICS' },
    { title: 'Anti-Ragging Undertaking Form', size: '0.3 MB', category: 'REGULATIONS' },
    { title: 'Faculty Leave Application', size: '0.4 MB', category: 'ADMINISTRATION' }
  ];

  const filteredDownloads = downloads.filter(d => 
    d.title.toLowerCase().includes(query.toLowerCase()) || 
    d.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#518214] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Downloads Vault</Text>
            <Text className="text-xs text-emerald-100 font-medium">H13 Official Circulars, Forms & Prospectus PDFs</Text>
          </View>
        </View>

        {/* Input */}
        <View className="flex-row items-center bg-white rounded-2xl px-3.5 py-2.5 shadow-sm mt-3">
          <Search size={20} color="#6B7280" />
          <TextInput
            placeholder="Search PDFs..."
            value={query}
            onChangeText={setQuery}
            className="flex-1 ml-2.5 text-sm text-gray-900 font-medium"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : filteredDownloads.length > 0 ? filteredDownloads.map((d, idx) => (
          <View key={idx} className="bg-white p-4 rounded-2xl border border-gray-200 mb-3 shadow-sm flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 pr-3">
              <View className="p-3 bg-emerald-50 rounded-xl mr-3 border border-emerald-100">
                <FileText size={20} color="#518214" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-[#518214] uppercase mb-0.5">{d.category}</Text>
                <Text className="text-sm font-bold text-gray-900">{d.title}</Text>
                <Text className="text-[11px] text-gray-500 mt-0.5">{d.size}</Text>
              </View>
            </View>
            <TouchableOpacity className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
              <Download size={18} color="#518214" />
            </TouchableOpacity>
          </View>
        )) : (
          <View className="py-10 items-center justify-center">
            <Text className="text-gray-500 font-medium">No documents found matching "{query}"</Text>
          </View>
        )}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
