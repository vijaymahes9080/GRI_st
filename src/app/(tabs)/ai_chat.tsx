import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Send, Bot, User, Sparkles } from 'lucide-react-native';
import { Header } from '../../components/Header';
import { useResponsive } from '../../core/responsive/useResponsive';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export default function AiChatScreen() {
  const { isTablet } = useResponsive();
  
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
    <View className="flex-1 bg-slate-50">
      <Header title="AI Knowledge Assistant" subtitle="RAG Vector Engine · Tamil & English" variant="white" />
      
      <View className="flex-1" style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
        <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 16 }}>
          {messages.map((msg) => (
            <View
              key={msg.id}
              className={`flex-row mb-6 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <View className="bg-emerald-700 p-2.5 rounded-lg mr-3 self-end shadow-sm">
                  <Bot size={20} color="#FFFFFF" />
                </View>
              )}
              <View
                className={`max-w-[80%] p-4 rounded-xl shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#0D47A1] rounded-br-none'
                    : 'bg-white border border-slate-200 rounded-bl-none'
                }`}
              >
                <Text className={`text-base leading-relaxed ${msg.sender === 'user' ? 'text-white' : 'text-slate-800'}`}>
                  {msg.text}
                </Text>
                <Text
                  className={`text-[10px] mt-2 font-medium tracking-wider uppercase text-right ${
                    msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </Text>
              </View>
              {msg.sender === 'user' && (
                <View className="bg-slate-800 p-2.5 rounded-lg ml-3 self-end shadow-sm">
                  <User size={20} color="#FFFFFF" />
                </View>
              )}
            </View>
          ))}
          {loading && (
            <View className="flex-row items-center bg-white p-4 rounded-xl border border-slate-200 self-start mb-6 shadow-sm rounded-bl-none ml-12">
              <ActivityIndicator size="small" color="#059669" />
              <Text className="text-sm text-slate-500 font-medium ml-3">Searching Official Knowledge Base...</Text>
            </View>
          )}
        </ScrollView>

        {/* Suggested Quick Questions */}
        <View className="px-4 pb-3 flex-row gap-3">
          <TouchableOpacity
            onPress={() => setInput('What is the minimum attendance required?')}
            className="bg-white border border-slate-200 px-4 py-2.5 rounded-full flex-row items-center hover:bg-slate-50 shadow-sm"
          >
            <Sparkles size={14} color="#059669" />
            <Text className="text-sm font-medium text-slate-700 ml-2">Attendance Rule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setInput('How many outpasses allowed per month?')}
            className="bg-white border border-slate-200 px-4 py-2.5 rounded-full flex-row items-center hover:bg-slate-50 shadow-sm"
          >
            <Sparkles size={14} color="#059669" />
            <Text className="text-sm font-medium text-slate-700 ml-2">Hostel Outpass Rule</Text>
          </TouchableOpacity>
        </View>

        {/* Input Bar */}
        <View className="p-4 bg-white border-t border-slate-200 flex-row items-center shadow-sm">
          <TextInput
            className="flex-1 bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-xl text-base text-slate-900 mr-3 outline-none"
            placeholder="Ask AI in English or Tamil..."
            placeholderTextColor="#94A3B8"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!input.trim() || loading}
            className={`p-4 rounded-xl shadow-sm ${input.trim() ? 'bg-khadi-blue' : 'bg-slate-200'}`}
          >
            <Send size={20} color={input.trim() ? '#FFFFFF' : '#94A3B8'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
