---
title: Package Installation
scope: dependencies, pnpm, peer-deps
sdk: "@zelloptt/react-native-zello-sdk@2.0.1"
platform: EnforcementMAPS (Expo 54 / React Native 0.81)
updated: 2026-03-27
---

# Package Installation

## Install the SDK

From the project root (where `package.json` lives):

```bash
pnpm add @zelloptt/react-native-zello-sdk
```

## Peer Dependencies

The SDK requires these peers — all already present in EnforcementMAPS:

| Peer Dependency | Required | Installed |
|-----------------|----------|-----------|
| `react` ≥ 18 | ✅ | 19.1.0 |
| `react-native` ≥ 0.73 | ✅ | 0.81.5 |

## Firebase Dependencies

For FCM push integration (required for background PTT wake):

```bash
pnpm add @react-native-firebase/app @react-native-firebase/messaging
```

> **Note:** `@react-native-firebase/*` packages are native modules.
> They require an EAS **dev build** — they will not work in Expo Go.
> The project already uses dev builds via `eas.json`.

## Verify Lock File

After installation, confirm the lock file updated cleanly:

```bash
pnpm install --frozen-lockfile
```

## What NOT to Install

- Do **not** install `zello-android-client-sdk` separately — the React Native
  wrapper bundles the native AAR automatically.
- Do **not** install `expo-notifications` FCM plugins — Zello handles its own
  FCM channel. See [09-background-push.md](./09-background-push.md).

## Post-Install

Proceed to:
1. [03-android-native-config.md](./03-android-native-config.md) — Expo config plugin setup
2. [04-permissions.md](./04-permissions.md) — Required permissions
