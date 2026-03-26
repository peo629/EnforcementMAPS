import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { presenceService } from '../../features/presence/presence.api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  if (!Device.isDevice) {
    console.log('[PUSH] Must use physical device for push notifications');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('[PUSH] Permission not granted');
    return null;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId
    ?? 'af957afa-01a5-4a77-bc19-bc46967b8edc';

  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
  return tokenData.data;
}

export function usePushNotifications(isAuthenticated: boolean) {
  const lastAuthState = useRef<boolean>(false);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    if (!isAuthenticated) {
      lastAuthState.current = false;
      return;
    }

    if (lastAuthState.current) return;

    let cancelled = false;

    (async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (cancelled || !token) return;

        const platform = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
        await presenceService.registerDevice(token, platform);
        lastAuthState.current = true;
        console.log('[PUSH] Device registered with token');
      } catch (err) {
        console.error('[PUSH] Registration failed:', err);
      }
    })();

    return () => { cancelled = true; };
  }, [isAuthenticated]);
}
