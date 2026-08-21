import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react-native';
import { processOfflineSyncQueue } from './syncQueue';
import { apiClient } from '../api';

export function OfflineNotice() {
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  const triggerSyncQueue = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await processOfflineSyncQueue();
      if (res.successCount > 0) {
        setSyncSuccessMsg(`Synced ${res.successCount} offline action(s)`);
        setTimeout(() => setSyncSuccessMsg(null), 4000);
      }
    } catch {
      // Ignore sync errors
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const checkConnectivity = useCallback(async () => {
    try {
      const response = await apiClient.get('/health', { timeout: 4000 });
      if (response.status === 200) {
        setIsOffline((prev) => {
          if (prev) {
            triggerSyncQueue();
          }
          return false;
        });
      }
    } catch {
      setIsOffline(true);
    }
  }, [triggerSyncQueue]);

  useEffect(() => {
    const interval = setInterval(checkConnectivity, 10000);
    return () => clearInterval(interval);
  }, [checkConnectivity]);

  if (syncSuccessMsg) {
    return (
      <View className="bg-emerald-600 px-4 py-2 flex-row items-center justify-between z-50">
        <View className="flex-row items-center">
          <CheckCircle2 size={16} color="white" />
          <Text className="text-xs font-bold text-white ml-2">{syncSuccessMsg}</Text>
        </View>
      </View>
    );
  }

  if (!isOffline) return null;

  return (
    <View className="bg-amber-600 px-4 py-2 flex-row items-center justify-between z-50 shadow-md">
      <View className="flex-row items-center flex-1 pr-2">
        <WifiOff size={16} color="white" />
        <Text className="text-xs font-bold text-white ml-2" numberOfLines={1}>
          Offline Mode — Viewing cached data. Auto-syncing when online.
        </Text>
      </View>

      <TouchableOpacity
        onPress={checkConnectivity}
        disabled={isSyncing}
        className="bg-amber-700/80 px-2.5 py-1 rounded-lg flex-row items-center"
      >
        <RefreshCw size={12} color="white" className={isSyncing ? 'animate-spin' : ''} />
        <Text className="text-[10px] font-bold text-white ml-1">Retry</Text>
      </TouchableOpacity>
    </View>
  );
}
