---
title: Zello SDK — Integration Overview
scope: architecture, feature-map, project-alignment
sdk: "@zelloptt/react-native-zello-sdk@2.0.1"
platform: EnforcementMAPS (Expo 54 / React Native 0.81)
updated: 2026-03-27
---

# Zello SDK — Integration Overview

## Purpose

Integrate Zello Work push-to-talk (PTT) into the EnforcementMAPS field
officer application so patrol officers, supervisors, and dispatch can
communicate via live voice, text, image, location, and alert messages
without leaving the app.

## SDK Identity

| Field | Value |
|-------|-------|
| Package | `@zelloptt/react-native-zello-sdk` |
| Version | 2.0.1 |
| Native engine | Zello Android SDK (AAR via Maven) |
| Licence | Proprietary — requires Zello Work subscription |
| Source | <https://github.com/zelloptt/react-native-zello-sdk> |

## Feature Matrix

| Capability | SDK Method | EnforcementMAPS Touchpoint |
|------------|-----------|---------------------------|
| Live PTT voice | `Zello.send()` / `Zello.stopSending()` | New `src/features/zello/` module |
| Text messages | `Zello.sendText()` | Channel/contact chat |
| Image messages | `Zello.sendImage()` | Attach photo evidence |
| Location sharing | `Zello.sendLocation()` | Extends `expo-location` usage |
| Alert messages | `Zello.sendAlert()` | Emergency pings |
| Emergency mode | `Zello.startEmergency()` | Maps to Code21 dispatch flow |
| Channel management | `Zello.connectChannel()` | Patrol zone channels |
| Contact presence | `onContactsChanged` event | Augments existing presence system |
| History playback | `Zello.playHistory()` | Review missed transmissions |
| Group conversations | `Zello.createGroupConversation()` | Ad-hoc officer groups |

## Integration Into Existing Architecture

The Zello feature follows the established project structure:

```
src/features/zello/
  ├── api/               # Zello provisioning API calls (if needed)
  ├── components/        # PTT button, channel list, message UI
  ├── hooks/             # useZello, useZelloAuth, useZelloChannels
  ├── domain.ts          # Zello types and business logic
  └── zello-provider.tsx # Context provider (mounted in app/_layout.tsx)
```

**Provider chain** — `ZelloProvider` mounts inside the existing
`AuthProvider` → `QueryClientProvider` hierarchy so it can react to
auth state changes and auto-connect/disconnect Zello when the officer
logs in/out.

## Key Integration Points

| Existing Module | Integration |
|-----------------|-------------|
| `src/shared/infra/auth-context.tsx` | Trigger Zello `connect()` on login, `disconnect()` on logout |
| `src/shared/hooks/usePushNotifications.ts` | FCM token sharing — Zello needs its own FCM handling alongside Expo Push |
| `src/features/code21/` | Map Zello emergency mode to Code21 dispatch acknowledgement |
| `src/features/presence/` | Augment heartbeat presence with Zello contact online status |
| `app.config.ts` | Add Zello permissions and config plugin |
| `metro.config.js` | No changes required — SDK resolves from `node_modules` |

## Official Resources

- SDK docs: <https://sdk.zello.com>
- RN installation: <https://sdk.zello.com/installation-guides/react-native-installation-guide>
- RN example app: <https://sdk.zello.com/sdk-example-apps/example-apps-react-native>
- Android SDK repo: <https://github.com/zelloptt/zello-android-client-sdk>
- React Native SDK repo: <https://github.com/zelloptt/react-native-zello-sdk>
