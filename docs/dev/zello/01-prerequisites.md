---
title: Prerequisites & Environment
scope: accounts, credentials, tooling
sdk: "@zelloptt/react-native-zello-sdk@2.0.1"
platform: EnforcementMAPS (Expo 54 / React Native 0.81)
updated: 2026-03-27
---

# Prerequisites & Environment

## Zello Work Account

1. **Subscribe** to [Zello Work](https://zello.com/work/) (per-user licence).
2. **Create a Network** in the Zello Work admin console.
3. **Generate SDK credentials** — the admin console provides:
   - `issuer` — your network issuer URL
   - `credentialKey` — shared secret for JWT token generation

These credentials are **not** the same as individual user passwords.
See [05-authentication.md](./05-authentication.md) for the auth flow.

## Existing EnforcementMAPS Requirements

The repo already satisfies all SDK host requirements:

| Requirement | Status | Detail |
|-------------|--------|--------|
| React Native ≥ 0.73 | ✅ | RN 0.81.5 in `package.json` |
| Android `minSdkVersion` ≥ 23 | ✅ | Expo 54 defaults to 24 |
| pnpm | ✅ | Project uses pnpm workspaces |
| TypeScript ≥ 5.x | ✅ | TS 5.9.2 in `devDependencies` |
| Expo managed workflow | ✅ | EAS builds configured in `eas.json` |
| Google Maps API key | ✅ | Already in `eas.json` env vars |

## Firebase (FCM) Requirement

Zello uses Firebase Cloud Messaging for push-to-talk wake-up.
The app currently uses **Expo Push Tokens** (via `expo-notifications`).
Both can coexist — see [09-background-push.md](./09-background-push.md).

**Required:**
- Firebase project with `google-services.json` for the `au.melbourne.patrolzones` package name
- FCM enabled in the Firebase console

## Environment Variables (New)

Add to `.env.example` and `eas.json` build profiles:

```env
# ─── Zello Work PTT ─────────────────────────────────────────────────────────
EXPO_PUBLIC_ZELLO_NETWORK_ISSUER=
EXPO_PUBLIC_ZELLO_CREDENTIAL_KEY=
```

## Pre-Flight Checklist

- [ ] Zello Work subscription active
- [ ] Network created with SDK credentials
- [ ] Firebase project created with FCM enabled
- [ ] `google-services.json` obtained for `au.melbourne.patrolzones`
- [ ] Zello env vars added to `.env.example` and all `eas.json` profiles
