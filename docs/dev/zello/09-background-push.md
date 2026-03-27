---
title: Background Services & Push Notifications
scope: background
last_reviewed: "2026-03-27"
---

# Background Services & Push Notifications

## Foreground Service

The Android SDK includes a **foreground service** that keeps PTT operational when the app is in the background. This is enabled by default.

```typescript
Zello.configure({
  enableForegroundService: true,  // default: true
  enableOfflineMessagePushNotifications: true,
});
```

The foreground service:
- Shows a persistent notification while active.
- Prevents the OS from killing the PTT connection.
- Uses `FOREGROUND_SERVICE_PHONE_CALL` type.

> To disable the foreground service, set `enableForegroundService: false`. The SDK will lose background connectivity.

## Push Notifications (Firebase Cloud Messaging)

Push notifications deliver messages when the app is not running. The Zello SDK uses **Firebase Cloud Messaging (FCM)**.

### Setup Steps

1. **Create a Firebase project** at <https://console.firebase.google.com/>.
2. **Register your Android app** in the Firebase console.
3. **Download `google-services.json`** and place it in `android/app/`.
4. **Add Firebase Gradle dependencies:**

```groovy
// android/build.gradle (project level)
buildscript {
    dependencies {
        classpath "com.google.gms:google-services:4.4.0"
    }
}
```

```groovy
// android/app/build.gradle
apply plugin: "com.google.gms.google-services"

dependencies {
    implementation platform("com.google.firebase:firebase-bom:32.7.0")
    implementation "com.google.firebase:firebase-messaging"
}
```

5. **Install React Native Firebase:**

```bash
yarn add @react-native-firebase/app @react-native-firebase/messaging
```

6. **Upload the FCM server key** to the Zello Work Administrative Console under **Management → Developers → Push Notifications**.

### How It Works

```
App closed → Zello server sends FCM push → Device wakes →
Notification displayed → User opens app → SDK reconnects →
Message available in history
```

## Notification Channel

The Zello SDK registers its own Android notification channel. Customize the notification appearance through the Zello Work console settings if needed.

## Battery Optimization

Advise users to **exclude the app from battery optimization** for reliable background operation:
- Settings → Battery → Battery Optimization → Your App → Don't Optimize
