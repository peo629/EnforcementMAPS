---
title: Troubleshooting
scope: build-errors, runtime-issues, expo-specific
sdk: "@zelloptt/react-native-zello-sdk@2.0.1"
platform: EnforcementMAPS (Expo 54 / React Native 0.81)
updated: 2026-03-27
---

# Troubleshooting

## Build Errors

### Hilt / Dagger annotation processor failure

```
error: [Hilt] ProcessedRootSentinel(...)
```

**Cause:** Zello's native Android SDK uses Hilt. In Expo managed
workflow, the kapt/ksp annotation processor may not be configured.

**Fix:** Create a custom Expo config plugin or use `expo-build-properties`:

```bash
pnpm add expo-build-properties
```

In `app.config.ts`:

```typescript
[
  'expo-build-properties',
  {
    android: {
      kotlinVersion: '1.9.24',
      enableProguardInReleaseBuilds: true,
    },
  },
],
```

### Maven repository not found

```
Could not resolve com.zello:zello-sdk
```

**Fix:** The React Native SDK's `build.gradle` should add the repo
automatically. If not, use a config plugin to add:

```
maven { url 'https://zello.jfrog.io/artifactory/maven/' }
```

### Duplicate class errors

```
Duplicate class kotlin.collections.jdk8.*
```

**Fix:** Add to `app.config.ts` via `expo-build-properties`:

```typescript
android: {
  packagingOptions: {
    pickFirst: ['**/kotlin/**'],
  },
},
```

## Runtime Errors

### "Zello is not connected" when sending PTT

**Cause:** `Zello.send()` called before `onConnected` event fired.

**Fix:** Guard PTT actions on connection state in `useZelloStatus()` hook.

### No audio on incoming message

**Cause:** Audio focus not acquired, or volume at zero.

**Fix:** Check device volume. The SDK manages audio focus, but other
apps (especially other `expo-notifications` sounds) may interfere.

### Microphone permission denied silently

**Cause:** On Android 11+, if the user denies twice, the OS stops
showing the prompt.

**Fix:** Detect `NEVER_ASK_AGAIN` state and direct the user to
Settings → App Permissions.

## Expo-Specific Issues

### "Cannot use native module in Expo Go"

**Expected.** The Zello SDK is a native module and requires an EAS dev
build. It will **never** work in Expo Go.

```bash
eas build --platform android --profile development
```

### Metro bundler cannot resolve Zello SDK

**Fix:** Clear Metro cache:

```bash
pnpm start --clear
```

### EAS build timeout

Zello's native dependencies (Hilt, protobuf) increase build time.
If EAS builds timeout, increase the resource class in `eas.json`:

```json
"android": {
  "resourceClass": "m-medium"
}
```

## Debugging

### Enable SDK logging

```typescript
Zello.setLogLevel('debug');
```

### Check connection state

```typescript
Zello.Listener.on('onConnectFailed', ({ error }) => {
  console.error('[ZELLO] Connection failed:', error);
});
```

### Verify FCM token delivery

Check the Firebase console → Cloud Messaging → Diagnostics for
delivery status to `au.melbourne.patrolzones`.
