---
title: Background Services & Push Notifications
scope: foreground-service, FCM, expo-notifications-coexistence
sdk: "@zelloptt/react-native-zello-sdk@2.0.1"
platform: EnforcementMAPS (Expo 54 / React Native 0.81)
updated: 2026-03-27
---

# Background Services & Push Notifications

## Current Push Architecture

EnforcementMAPS uses **Expo Push Tokens** via `expo-notifications`:

```
Device → Expo Push Service → FCM → Device
```

`usePushNotifications.ts` registers an Expo Push Token on login and
sends it to the MAPS API via `presenceService.registerDevice()`.

## Zello Push Architecture

Zello requires **native FCM** for PTT wake-up:

```
Zello Server → FCM → Device → Zello SDK wakes → Audio stream starts
```

## Coexistence Strategy

Both systems can share the same Firebase project but handle messages
independently:

1. **Expo Push** continues using `expo-notifications` with Expo Push
   Tokens for dispatch alerts (Code21), system notifications.
2. **Zello FCM** uses `@react-native-firebase/messaging` for PTT
   wake-up messages.

The key: Zello's FCM messages include a Zello-specific data payload
that the Zello SDK intercepts. Non-Zello messages pass through to
`expo-notifications` as before.

### Firebase Messaging Handler

```typescript
// src/features/zello/zello-fcm-handler.ts
import messaging from '@react-native-firebase/messaging';

// Background message handler — must be registered at app root level
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  // Zello SDK automatically intercepts its own messages.
  // Non-Zello messages fall through to expo-notifications.
  console.log('[ZELLO-FCM] Background message:', remoteMessage.messageId);
});
```

## Foreground Service

On Android, Zello runs a **foreground service** to maintain the audio
connection. This shows a persistent notification. The SDK manages this
automatically when connected.

### Notification Channel

The SDK creates its own notification channel. Ensure
`POST_NOTIFICATIONS` permission is granted (see [04-permissions.md](./04-permissions.md)).

## Battery Optimisation

Instruct officers to **disable battery optimisation** for
EnforcementMAPS in Android settings. Without this, the OS may kill
the foreground service during extended patrols.

Add a check on app startup:

```typescript
import { Linking, Alert } from 'react-native';

function promptBatteryOptimisation() {
  Alert.alert(
    'Battery Optimisation',
    'For reliable PTT, disable battery optimisation for this app.',
    [
      { text: 'Open Settings', onPress: () =>
        Linking.openSettings()
      },
      { text: 'Later', style: 'cancel' },
    ]
  );
}
```

## Key Consideration

- **Do not** replace `expo-notifications` with Firebase messaging for
  app-level notifications. They serve different purposes.
- Zello handles its own FCM registration internally after `connect()`.
- The `google-services.json` file must match the `au.melbourne.patrolzones`
  package name.
