---
title: Android Permissions
scope: permissions
last_reviewed: "2026-03-27"
---

# Android Permissions

## Manifest Permissions

The Zello SDK declares the following permissions. Most are included automatically via the AAR manifest merge. Verify they are present in your merged manifest:

```xml
<!-- Core PTT -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />

<!-- Foreground service -->
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_PHONE_CALL" />
<uses-permission android:name="android.permission.WAKE_LOCK" />

<!-- Location (for location messages + emergency) -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

<!-- Notifications (Android 13+) -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- Vibration -->
<uses-permission android:name="android.permission.VIBRATE" />
```

## Runtime Permission Requests

Android 6.0+ requires runtime prompts for dangerous permissions. Request these before using the corresponding SDK feature:

| Permission | Required For | When to Request |
|---|---|---|
| `RECORD_AUDIO` | Voice messages | Before first PTT action |
| `ACCESS_FINE_LOCATION` | Location messages, emergency | Before `sendLocation()` or `startEmergency()` |
| `POST_NOTIFICATIONS` | Push notifications (API 33+) | At app start or before `configure()` |
| `BLUETOOTH_CONNECT` | Bluetooth audio (API 31+) | Before audio routing to BT |

### Recommended Library

Use `react-native-permissions` for cross-platform runtime permission handling:

```typescript
import { request, PERMISSIONS } from 'react-native-permissions';

await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
```
