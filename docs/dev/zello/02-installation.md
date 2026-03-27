---
title: Installation
scope: setup
package: "@zelloptt/react-native-zello-sdk"
version: "2.0.1"
last_reviewed: "2026-03-27"
---

# Installation

## 1. Install the npm Package

```bash
# yarn
yarn add @zelloptt/react-native-zello-sdk

# npm
npm install @zelloptt/react-native-zello-sdk
```

The current version is **2.0.1**. SDK v2.0.0+ is **required** for Zello server communication (mandatory since Aug 12, 2025).

## 2. Why No Auto-linking?

The Zello Android SDK uses **Hilt** dependency injection, which requires Gradle plugin configuration at the project level. Standard React Native auto-linking cannot apply project-level Gradle changes. **Manual native configuration is required** — see `03-android-native-config.md`.

## 3. Peer Dependencies

The SDK declares the following peer dependencies:

| Package | Version |
|---|---|
| `react` | ≥ 18.2.0 |
| `react-native` | ≥ 0.74.x |

## 4. Recommended Companion Packages

These are not required by the SDK but are used in the official example app and recommended for a complete PTT experience:

| Package | Purpose |
|---|---|
| `react-native-permissions` | Runtime permission prompts (mic, location) |
| `@react-native-firebase/app` | Firebase core (required for FCM push) |
| `react-native-toast-message` | User notifications / feedback |

## 5. Verify Installation

After native config (next doc), run:

```bash
cd android && ./gradlew assembleDebug
```

A successful build confirms the Zello SDK AAR resolved from the Maven repository.
