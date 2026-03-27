---
title: Android Native Configuration
scope: expo-config-plugin, gradle, firebase
sdk: "@zelloptt/react-native-zello-sdk@2.0.1"
platform: EnforcementMAPS (Expo 54 / React Native 0.81)
updated: 2026-03-27
---

# Android Native Configuration

## Expo Managed Workflow

EnforcementMAPS uses Expo's managed workflow with EAS builds.
**Do not manually edit** `android/` files — they are generated at build time.
All native config goes through `app.config.ts` and Expo config plugins.

## app.config.ts Changes

Add the Firebase and Zello plugins to the existing `plugins` array:

```typescript
plugins: [
  'expo-router',
  'expo-secure-store',
  [
    'expo-notifications',
    {
      defaultChannel: 'default',
    },
  ],
  // ── Zello PTT ──────────────────────────────────────────────
  '@react-native-firebase/app',
  // Zello SDK auto-links via React Native autolinking — no
  // explicit plugin entry needed for the SDK itself.
],
```

## Firebase Setup

### google-services.json

Place the Firebase config file at the project root:

```
EnforcementMAPS/
  google-services.json   ← Android Firebase config
  app.config.ts
  package.json
```

Add the path in `app.config.ts` under the `android` block:

```typescript
android: {
  package: 'au.melbourne.patrolzones',
  googleServicesFile: './google-services.json',
  // ... existing config
},
```

### EAS Build Environment

Ensure `eas.json` includes `google-services.json` in the build:

```json
{
  "build": {
    "development": {
      "env": {
        "GOOGLE_SERVICES_JSON": "./google-services.json"
      }
    }
  }
}
```

## Zello Maven Repository

The React Native Zello SDK's `android/build.gradle` automatically adds
the Zello Maven repo (`https://zello.jfrog.io/...`). In Expo managed
workflow, this is handled by autolinking at EAS build time. No manual
Gradle changes are needed.

## Hilt / Dagger Dependency Injection

The Zello Android SDK uses Hilt internally. The React Native wrapper
handles this — **do not** add Hilt plugins to the project. If build
errors reference `dagger.hilt`, see [13-troubleshooting.md](./13-troubleshooting.md).

## Build Verification

After configuration, create a dev build to verify native linking:

```bash
eas build --platform android --profile development
```

Watch for:
- ✅ `@zelloptt/react-native-zello-sdk` in autolinking output
- ✅ `@react-native-firebase/app` resolved
- ❌ Any Hilt/Dagger annotation processor errors → see troubleshooting
