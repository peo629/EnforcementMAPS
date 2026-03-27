---
title: Prerequisites
scope: environment
last_reviewed: "2026-03-27"
---

# Prerequisites

## Zello Work Account

All SDK functionality requires a **Zello Work** network subscription.

1. Sign up at <https://zello.com/work/>.
2. In the Zello Work Administrative Console, navigate to **Management → Developers** and create an SDK application entry.
3. Record your **network name** — this is the first segment of your Zello Work URL (e.g. `mycompany` from `mycompany.zellowork.com`).

> The SDK does **not** work with the free Zello consumer app. A Zello Work subscription is mandatory.

## Development Environment

| Requirement | Minimum Version |
|---|---|
| Node.js | ≥ 18 |
| React Native | 0.74.x |
| JDK | 17 |
| Android SDK | API 21+ (compile target 34) |
| Android Gradle Plugin | 8.5.1 |
| Kotlin | 1.9.x |
| Gradle | 8.x |
| npm / yarn | Latest |

## Hardware

- Physical Android device recommended for PTT audio testing.
- Emulator works for non-audio flows but microphone behaviour may differ.

## Accounts & Credentials Checklist

- [ ] Zello Work network subscription active
- [ ] Network name recorded
- [ ] At least two test user accounts provisioned in the Zello Work console
- [ ] Firebase project created (for push notifications — see `09-background-push.md`)
