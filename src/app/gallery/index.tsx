import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Image as ImageIcon, Video } from 'lucide-react-native';

export default function GalleryScreen() {
  const router = useRouter();

  // Mocked images using placeholders since real photos aren't guaranteed to be linked right now
  const images = [
    { title: 'Convocation 2025', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { title: 'Campus Main Building', url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { title: 'NSS Camp', url: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { title: 'Science Exhibition', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#0284C7] pt-12 pb-5 px-4 rounded-b-3xl shadow-md">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/20 rounded-full mr-3">
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Photo Gallery</Text>
            <Text className="text-xs text-sky-100 font-medium">Events, Infrastructure & Campus Life</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-[#0284C7] py-2 rounded-xl mr-2">
            <ImageIcon size={18} color="#FFFFFF" />
            <Text className="text-sm font-bold text-white ml-2">Photos</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-white border border-gray-200 py-2 rounded-xl ml-2">
            <Video size={18} color="#6B7280" />
            <Text className="text-sm font-bold text-gray-700 ml-2">Videos</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {images.map((img, idx) => (
            <View key={idx} className="w-[48%] mb-4 bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <Image source={{ uri: img.url }} style={{ width: '100%', height: 120 }} />
              <View className="p-3">
                <Text className="text-xs font-bold text-gray-900" numberOfLines={1}>{img.title}</Text>
              </View>
            </View>
          ))}
        </View>
        
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
