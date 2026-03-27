# EnforcementMAPS

A parking enforcement officer app built with [Expo](https://expo.dev) (SDK 54) and [React Native](https://reactnative.dev).

## Fresh Start

This branch builds the enforcement app **from the ground up**, following the official [Expo Tutorial](https://docs.expo.dev/tutorial/introduction) as a foundation.

### Current State: Chapter 1 — Base Application

The app currently matches the end state of [Create your first app](https://docs.expo.dev/tutorial/create-your-first-app/):

- Minimal `app/index.tsx` with "Home screen" display
- Basic `Stack` root layout
- TypeScript configured with `@/*` path alias
- Expo Router for file-based navigation

### Roadmap

- [ ] **Chapter 2** — Add navigation (stack + bottom tabs)
- [ ] **Chapter 3** — Build a screen (image viewer + buttons)
- [ ] **Chapter 4** — Use an image picker
- [ ] **Chapter 5** — Create a modal
- [ ] **Chapter 6** — Add gestures
- [ ] **Chapter 7** — Take a screenshot
- [ ] **Chapter 8** — Handle platform differences
- [ ] **Chapter 9** — Configure status bar, splash screen & app icon
- [ ] Add authentication (login/register)
- [ ] Add patrol map with zone detection
- [ ] Add officer presence & location tracking
- [ ] Add Code 21 dispatch system
- [ ] Add push notifications

## Getting Started

### Prerequisites

- [Node.js (LTS)](https://nodejs.org/en)
- [pnpm](https://pnpm.io/)
- [Expo Go](https://expo.dev/go) on your mobile device

### Install & Run

```bash
pnpm install
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS) to open on your device.
Press `w` in the terminal to open in a web browser.

## Project Structure

```
app/
  _layout.tsx      # Root layout (Stack navigator)
  index.tsx        # Home screen (matches route '/')
assets/
  images/          # App icons and images
app.config.ts      # Expo app configuration
package.json       # Dependencies
tsconfig.json      # TypeScript configuration
```

## Tech Stack

- **Expo SDK 54** — Universal app platform
- **Expo Router** — File-based navigation
- **React Native** — Cross-platform UI
- **TypeScript** — Type safety
