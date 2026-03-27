---
title: Rich Messaging (Text, Image, Location, Alert)
scope: non-voice-message-types
sdk: "@zelloptt/react-native-zello-sdk@2.0.1"
platform: EnforcementMAPS (Expo 54 / React Native 0.81)
updated: 2026-03-27
---

# Rich Messaging

## Message Types

| Type | Method | Use Case |
|------|--------|----------|
| Text | `Zello.sendText(contact, text)` | Quick status updates, notes |
| Image | `Zello.sendImage(contact, uri)` | Photo evidence, scene photos |
| Location | `Zello.sendLocation(contact)` | Share current GPS position |
| Alert | `Zello.sendAlert(contact, text, level)` | Emergency pings, priority alerts |

## Text Messages

```typescript
await Zello.sendText(contact, 'Proceeding to Section 4B');
```

Listen for incoming text:

```typescript
Zello.Listener.on('onIncomingTextMessage', (event) => {
  // event.contact, event.text, event.channel
});
```

## Image Messages

The app can use the device camera or gallery. The SDK accepts a
local file URI:

```typescript
// From expo-image-picker or camera capture
const imageUri = 'file:///path/to/photo.jpg';
await Zello.sendImage(contact, imageUri);
```

Incoming images:

```typescript
Zello.Listener.on('onIncomingImageMessage', (event) => {
  // event.image — image data/URI
  // event.contact — sender
});
```

## Location Messages

Leverages the device GPS. The app already uses `expo-location` —
Zello's location sharing uses its own internal GPS access:

```typescript
await Zello.sendLocation(contact);
```

Incoming locations:

```typescript
Zello.Listener.on('onIncomingLocationMessage', (event) => {
  // event.latitude, event.longitude
  // event.contact — sender
});
```

> **Integration note:** Incoming location messages could be plotted on
> the existing `react-native-maps` patrol zone map alongside officer
> markers.

## Alert Messages

High-priority messages that trigger prominent notifications:

```typescript
// level: 1 (low), 2 (medium), 3 (high)
await Zello.sendAlert(contact, 'Officer requires assistance', 3);
```

## Hook Pattern

```typescript
// src/features/zello/hooks/useZelloMessaging.ts
import Zello, { ZelloContact } from '@zelloptt/react-native-zello-sdk';

export function useZelloMessaging() {
  const sendText = (contact: ZelloContact, text: string) =>
    Zello.sendText(contact, text);

  const sendImage = (contact: ZelloContact, uri: string) =>
    Zello.sendImage(contact, uri);

  const sendLocation = (contact: ZelloContact) =>
    Zello.sendLocation(contact);

  const sendAlert = (contact: ZelloContact, text: string, level: number) =>
    Zello.sendAlert(contact, text, level);

  return { sendText, sendImage, sendLocation, sendAlert };
}
```
