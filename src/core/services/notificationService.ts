import { Platform } from 'react-native';

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
}

export const registerForPushNotificationsAsync = async (): Promise<string | null> => {
  if (Platform.OS !== 'android') return null;

  // FCM token registration simulation
  const mockFcmToken = 'fcm_token_gri_android_' + Math.random().toString(36).substring(2, 10);
  return mockFcmToken;
};

export const handleIncomingNotification = (notification: PushNotificationPayload) => {
  console.log('[FCM Push Notification Received]', notification.title, notification.body);
};
