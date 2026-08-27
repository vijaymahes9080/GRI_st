import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { X, Smartphone, Bell, Wifi, Battery, Signal, ShieldAlert, Sparkles, Clock } from 'lucide-react-native';
import { themeTokens } from '../../core/theme/tokens';

interface NotificationPreviewModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  category: string;
  priority: string;
}

export const NotificationPreviewModal: React.FC<NotificationPreviewModalProps> = ({
  isVisible,
  onClose,
  title,
  message,
  category,
  priority,
}) => {
  const { colors } = themeTokens;
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 backdrop-blur-sm items-center justify-center p-4">
        <View className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Modal Header */}
          <View className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex-row items-center justify-between">
            <View className="flex-row items-center space-x-2">
              <View className="w-8 h-8 rounded-xl bg-primary-600/20 border border-primary-500/30 items-center justify-center mr-2">
                <Smartphone size={18} color={colors.primary} />
              </View>
              <View>
                <Text className="text-sm font-bold text-white">Mobile Notification Preview</Text>
                <Text className="text-[11px] text-slate-400">Live Lockscreen Simulation</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2 rounded-full bg-slate-700 hover:bg-slate-600">
              <X size={18} color="white" />
            </TouchableOpacity>
          </View>

          {/* Phone Screen Mockup Body */}
          <View className="p-6 bg-slate-950 items-center">
            
            {/* Phone Bezel */}
            <View className="w-[300px] h-[520px] bg-slate-900 rounded-[40px] border-[6px] border-slate-700 p-4 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              
              {/* Phone Speaker & Camera Notch */}
              <View className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full flex-row items-center justify-center space-x-2 z-20">
                <View className="w-3 h-3 rounded-full bg-slate-950" />
                <View className="w-10 h-1 bg-slate-950 rounded-full" />
              </View>

              {/* Status Bar */}
              <View className="pt-2 px-2 flex-row justify-between items-center z-10">
                <Text className="text-[11px] font-bold text-slate-300">{currentTime}</Text>
                <View className="flex-row items-center space-x-1.5">
                  <Signal size={12} color="#cbd5e1" />
                  <Wifi size={12} color="#cbd5e1" />
                  <Battery size={12} color="#cbd5e1" />
                </View>
              </View>

              {/* Lockscreen Clock & Date */}
              <View className="items-center mt-6">
                <Text className="text-3xl font-extralight text-white tracking-wider">{currentTime}</Text>
                <Text className="text-xs font-medium text-slate-400 mt-1">Wednesday, August 26</Text>
              </View>

              {/* Push Notification Card Popup */}
              <View className="my-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-xl">
                
                {/* Notification App Info Header */}
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <View className="w-5 h-5 rounded-md bg-primary-600 items-center justify-center mr-1.5">
                      <Bell size={11} color="white" />
                    </View>
                    <Text className="text-[11px] font-bold text-slate-300 tracking-wider">GRI PORTAL</Text>
                  </View>
                  <Text className="text-[10px] text-slate-400">Now</Text>
                </View>

                {/* Badge Row */}
                <View className="flex-row items-center space-x-2 mb-2">
                  <View className="px-2 py-0.5 bg-primary-600/30 rounded-md border border-primary-500/40">
                    <Text className="text-[9px] font-bold text-primary-300 uppercase tracking-wider">{category || 'academic'}</Text>
                  </View>
                  <View className={`px-2 py-0.5 rounded-md border ${priority === 'URGENT' || priority === 'HIGH' ? 'bg-amber-500/30 border-amber-500/40' : 'bg-slate-700/50 border-slate-600'}`}>
                    <Text className={`text-[9px] font-bold uppercase tracking-wider ${priority === 'URGENT' || priority === 'HIGH' ? 'text-amber-300' : 'text-slate-300'}`}>
                      {priority || 'NORMAL'}
                    </Text>
                  </View>
                </View>

                {/* Title & Message */}
                <Text className="text-sm font-bold text-white mb-1 leading-snug" numberOfLines={2}>
                  {title.trim() || 'Notification Title Preview'}
                </Text>
                <Text className="text-xs text-slate-300 leading-relaxed" numberOfLines={4}>
                  {message.trim() || 'Notification message content preview will appear here as broadcasted to students and faculty members across the university.'}
                </Text>
              </View>

              {/* Home Indicator Bar */}
              <View className="w-24 h-1 bg-slate-600 rounded-full mx-auto mb-1" />
            </View>

          </View>

          {/* Footer Close Button */}
          <View className="p-4 bg-slate-900 border-t border-slate-800 items-center">
            <TouchableOpacity
              onPress={onClose}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl items-center border border-slate-700"
            >
              <Text className="text-sm font-bold text-white">Close Preview</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};
