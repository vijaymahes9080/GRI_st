import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Search, Library, BookOpen, QrCode } from 'lucide-react-native';

import { Header } from '../../../components/Header';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';

export const LibraryScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [books] = useState([
    { title: 'Deep Learning Architectures', author: 'Ian Goodfellow', callNo: '005.1 GOO', status: 'AVAILABLE', rack: 'Rack B-14' },
    { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', callNo: '005.7 KLE', status: 'ISSUED', rack: 'Rack A-08' },
    { title: 'React Native & Mobile Systems', author: 'S. Meenakshi', callNo: '005.2 MEE', status: 'AVAILABLE', rack: 'Rack C-02' },
  ]);

  const handleScanBarcode = () => {
    Alert.alert('RFID Scanner Active', 'Scanning book RFID tag or barcode via camera...');
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Library & OPAC Search" subtitle="Central Library · RFID Automated Search" showBack />

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View className="flex-row items-center mb-4">
          <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-3.5 py-3 mr-2 shadow-sm">
            <Search size={18} color="#6B7280" />
            <TextInput
              className="flex-1 ml-2 text-base text-gray-900 p-0"
              placeholder="Search by Title, Author, ISBN..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <TouchableOpacity onPress={handleScanBarcode} className="bg-khadi-blue p-3.5 rounded-xl">
            <QrCode size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Issued Books Summary */}
        <Card className="bg-purple-900 p-4 mb-5 border-0 shadow-md">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Library size={18} color="#E9D5FF" />
              <Text className="text-xs font-bold text-purple-200 ml-2">MY ISSUED BOOKS</Text>
            </View>
            <Badge label="2 BOOKS ISSUED" variant="info" />
          </View>
          <Text className="text-white font-bold text-base">Introduction to Algorithms (4th Ed)</Text>
          <Text className="text-xs text-purple-200">Due Date: 18 May 2026 · No fine accrued</Text>
        </Card>

        {/* Search Catalog Results */}
        <Text className="text-lg font-bold text-gray-900 mb-3">OPAC Book Catalog</Text>

        {books
          .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()))
          .map((book, idx) => (
            <Card key={idx} className="p-4 mb-3 border-gray-100">
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-row items-center flex-1 mr-2">
                  <BookOpen size={18} color="#0D47A1" />
                  <Text className="text-base font-bold text-gray-900 ml-2" numberOfLines={1}>
                    {book.title}
                  </Text>
                </View>
                <Badge label={book.status} variant={book.status === 'AVAILABLE' ? 'success' : 'neutral'} />
              </View>

              <Text className="text-xs text-gray-600 mb-1">Author: {book.author}</Text>
              <Text className="text-xs text-gray-400 mb-3">Call No: {book.callNo} · {book.rack}</Text>

              {book.status === 'AVAILABLE' && (
                <Button
                  title="Reserve Book"
                  onPress={() => Alert.alert('Book Reserved', `Reserved "${book.title}". Collect from Circulation Desk within 24 hours.`)}
                  size="sm"
                  variant="outline"
                />
              )}
            </Card>
          ))}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};
