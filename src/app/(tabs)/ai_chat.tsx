import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Send, Bot, User, Sparkles } from 'lucide-react-native';
import { Header } from '../../components/Header';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export default function AiChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'வணக்கம்! I am your GRI AI Assistant trained on official university regulations, syllabus, and hostel rules. How can I help you today?',
      sender: 'ai',
      timestamp: '10:00 AM',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const queryText = input;
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let aiResponseText = 'According to GRI Regulations 2024 Section 4.2: Students require a minimum of 75% attendance per course to appear for the end-semester examinations.';
      if (queryText.toLowerCase().includes('hostel') || queryText.toLowerCase().includes('outpass')) {
        aiResponseText = 'According to GRI Hostel By-laws: Students are allowed 2 weekend out-passes per month with 2-tier authorization (Parent SMS OTP signoff + Warden approval).';
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 1200);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="AI Knowledge Assistant" subtitle="RAG Vector Engine · Tamil & English" />

      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 16 }}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            className={`flex-row mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <View className="bg-khadi-blue p-2 rounded-full mr-2 self-start mt-1">
                <Bot size={18} color="#FFFFFF" />
              </View>
            )}

            <View
              className={`max-w-[80%] p-3.5 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-khadi-blue rounded-tr-none'
                  : 'bg-white border border-gray-100 rounded-tl-none shadow-sm'
              }`}
            >
              <Text className={`text-sm ${msg.sender === 'user' ? 'text-white' : 'text-gray-800'}`}>
                {msg.text}
              </Text>
              <Text
                className={`text-[10px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                }`}
              >
                {msg.timestamp}
              </Text>
            </View>

            {msg.sender === 'user' && (
              <View className="bg-saffron p-2 rounded-full ml-2 self-start mt-1">
                <User size={18} color="#FFFFFF" />
              </View>
            )}
          </View>
        ))}

        {loading && (
          <View className="flex-row items-center bg-white p-3 rounded-xl border border-gray-100 self-start mb-4">
            <ActivityIndicator size="small" color="#0D47A1" />
            <Text className="text-xs text-gray-500 ml-2">Searching PGVector Statutes...</Text>
          </View>
        )}
      </ScrollView>

      {/* Suggested Quick Questions */}
      <View className="px-4 pb-2 flex-row gap-2">
        <TouchableOpacity
          onPress={() => setInput('What is the minimum attendance required?')}
          className="bg-white border border-gray-200 px-3 py-1.5 rounded-full flex-row items-center"
        >
          <Sparkles size={12} color="#0D47A1" />
          <Text className="text-xs text-gray-700 ml-1">Attendance Rule</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setInput('How many outpasses allowed per month?')}
          className="bg-white border border-gray-200 px-3 py-1.5 rounded-full flex-row items-center"
        >
          <Sparkles size={12} color="#0D47A1" />
          <Text className="text-xs text-gray-700 ml-1">Hostel Outpass Rule</Text>
        </TouchableOpacity>
      </View>

      {/* Input Bar */}
      <View className="p-3 bg-white border-t border-gray-200 flex-row items-center">
        <TextInput
          className="flex-1 bg-gray-100 px-4 py-3 rounded-xl text-base text-gray-900 mr-2"
          placeholder="Ask AI in English or Tamil..."
          placeholderTextColor="#9CA3AF"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!input.trim() || loading}
          className={`p-3.5 rounded-xl ${input.trim() ? 'bg-khadi-blue' : 'bg-gray-200'}`}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
