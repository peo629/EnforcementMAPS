---
title: Permissions
scope: android-manifest, runtime-prompts, expo-config
sdk: "@zelloptt/react-native-zello-sdk@2.0.1"
platform: EnforcementMAPS (Expo 54 / React Native 0.81)
updated: 2026-03-27
---

# Permissions

## Current App Permissions

`app.config.ts` already declares:

```typescript
android: {
  permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
}
```

## Additional Permissions for Zello

Update the `android.permissions` array in `app.config.ts`:

```typescript
android: {
  permissions: [
    // Existing
    'ACCESS_FINE_LOCATION',
    'ACCESS_COARSE_LOCATION',
    // Zello PTT
    'RECORD_AUDIO',
    'BLUETOOTH_CONNECT',
    'POST_NOTIFICATIONS',
    'FOREGROUND_SERVICE',
    'FOREGROUND_SERVICE_MICROPHONE',
  ],
}
```

| Permission | Purpose | Runtime Prompt? |
|------------|---------|----------------|
| `RECORD_AUDIO` | PTT voice capture | Yes (Android 6+) |
| `BLUETOOTH_CONNECT` | Bluetooth headset PTT button | Yes (Android 12+) |
| `POST_NOTIFICATIONS` | Zello foreground service notification | Yes (Android 13+) |
| `FOREGROUND_SERVICE` | Keep Zello alive in background | No (manifest only) |
| `FOREGROUND_SERVICE_MICROPHONE` | Microphone access in foreground service | No (manifest only) |

## Runtime Permission Flow

Request microphone permission **before** the first PTT attempt.
Follow the existing pattern from `usePushNotifications.ts`:

```typescript
// src/features/zello/hooks/useZelloPermissions.ts
import { PermissionsAndroid, Platform } from 'react-native';

export async function requestZelloPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  const grants = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  ]);

  return grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
}
```

## Permission Timing

- Request on **first PTT tap**, not on app launch.
- If denied, show a user-friendly message (follow the `http.ts` error
  message pattern — plain language, no technical jargon).
- Bluetooth permission is optional — PTT works without it; only needed
  for hardware PTT buttons.

## iOS (Future)

If iOS support is added later, `NSMicrophoneUsageDescription` and
`NSBluetoothAlwaysUsageDescription` must be added to `ios.infoPlist`
in `app.config.ts`.
