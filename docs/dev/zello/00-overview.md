---
title: Zello SDK Overview
scope: architecture
version: "2.0.1"
sdk_package: "@zelloptt/react-native-zello-sdk"
native_android_sdk: "com.zello:sdk:1.0.+"
last_reviewed: "2026-03-27"
---

# Zello SDK — Overview

## What Is Zello SDK?

Zello SDK embeds **push-to-talk (PTT)** voice communication directly into a custom application. It provides real-time half-duplex voice, rich messaging (text, image, location, alert), channels, dispatch, emergency mode, and group conversations — all backed by the **Zello Work** infrastructure.

## Supported Platforms

| Platform | Package | Min Version |
|---|---|---|
| React Native (wrapper) | `@zelloptt/react-native-zello-sdk` | RN 0.74+ |
| Android (native) | `com.zello:sdk:1.0.+` | API 21 (Android 5.0) |
| iOS (native) | via CocoaPods | iOS 15+ |

> **This documentation targets Android integration via React Native.**

## Architecture

```
┌─────────────────────────────────────┐
│  React Native (TypeScript / JS)     │
│  @zelloptt/react-native-zello-sdk   │
├─────────────────────────────────────┤
│  Native Bridge (Kotlin / Java)      │
│  Hilt Dependency Injection          │
├─────────────────────────────────────┤
│  Zello Android SDK (AAR)            │
│  Foreground Service · Audio Engine  │
├─────────────────────────────────────┤
│  Zello Work Servers (Cloud)         │
│  AES-256 · TLS · WebSocket          │
└─────────────────────────────────────┘
```

## Feature Matrix

| Feature | SDK Support |
|---|---|
| PTT Voice Messages | ✅ |
| Text Messages | ✅ |
| Image Messages | ✅ |
| Location Messages | ✅ |
| Alert Messages | ✅ |
| Channels | ✅ |
| Group Conversations | ✅ |
| Dispatch Channels | ✅ |
| Emergency Mode | ✅ |
| Message History | ✅ |
| Push Notifications (FCM) | ✅ |
| Foreground Service | ✅ |
| Contact Muting | ✅ |
| Status Management | ✅ |

## Key Resources

| Resource | URL |
|---|---|
| Official Docs | <https://sdk.zello.com/> |
| React Native SDK Repo | <https://github.com/zelloptt/react-native-zello-sdk> |
| Android SDK Example | <https://github.com/zelloptt/zello-android-sdk-example> |
| Android API Reference | <https://developers.zello.com/sdk/v2.0/android/> |
| npm Package | `@zelloptt/react-native-zello-sdk` |
