---
title: Events & Listener Reference
scope: event-catalog, hook-patterns
sdk: "@zelloptt/react-native-zello-sdk@2.0.1"
platform: EnforcementMAPS (Expo 54 / React Native 0.81)
updated: 2026-03-27
---

# Events & Listener Reference

## Listener Registration

```typescript
import Zello from '@zelloptt/react-native-zello-sdk';

// Register
const subscription = Zello.Listener.on('eventName', handler);

// Unregister (in useEffect cleanup)
subscription.remove();
```

## Connection Events

| Event | Payload | When |
|-------|---------|------|
| `onConnected` | — | SDK authenticated with Zello servers |
| `onDisconnected` | — | SDK disconnected |
| `onWillReconnect` | — | SDK will auto-reconnect after drop |
| `onConnectFailed` | `{ error }` | Authentication or network failure |

## Contact & Channel Events

| Event | Payload | When |
|-------|---------|------|
| `onContactsChanged` | `ZelloContact[]` | Contact list or status updated |
| `onChannelsChanged` | `ZelloChannel[]` | Channel list or status updated |
| `onSelectedContactChanged` | `ZelloContact` | Active contact changed |

## Voice Message Events

| Event | Payload | When |
|-------|---------|------|
| `onOutgoingVoiceMessageConnecting` | `message` | PTT send initiated |
| `onOutgoingVoiceMessageStarted` | `message` | Server accepted stream |
| `onOutgoingVoiceMessageStopped` | `message` | Send completed |
| `onIncomingVoiceMessage` | `message` | Receiving live audio |
| `onIncomingVoiceMessageStopped` | `message` | Incoming audio ended |

## Rich Message Events

| Event | Payload | When |
|-------|---------|------|
| `onIncomingTextMessage` | `{ contact, text, channel }` | Text received |
| `onIncomingImageMessage` | `{ contact, image, channel }` | Image received |
| `onIncomingLocationMessage` | `{ contact, lat, lng, channel }` | Location received |
| `onIncomingAlertMessage` | `{ contact, text, level, channel }` | Alert received |

## Emergency Events

| Event | Payload | When |
|-------|---------|------|
| `onEmergencyStarted` | `{ contact }` | An officer activated emergency |
| `onEmergencyStopped` | `{ contact }` | Emergency deactivated |

## History Events

| Event | Payload | When |
|-------|---------|------|
| `onHistoryUpdated` | `messages[]` | New history messages available |
| `onHistoryPlaybackStarted` | `message` | History playback began |
| `onHistoryPlaybackStopped` | — | History playback ended |

## Hook Pattern for Event Subscription

Follow the existing hook patterns in the codebase:

```typescript
// src/features/zello/hooks/useZelloEvents.ts
import { useEffect, useState } from 'react';
import Zello, { ZelloContact, ZelloChannel } from '@zelloptt/react-native-zello-sdk';

export function useZelloStatus() {
  const [connected, setConnected] = useState(false);
  const [contacts, setContacts] = useState<ZelloContact[]>([]);
  const [channels, setChannels] = useState<ZelloChannel[]>([]);

  useEffect(() => {
    const subs = [
      Zello.Listener.on('onConnected', () => setConnected(true)),
      Zello.Listener.on('onDisconnected', () => setConnected(false)),
      Zello.Listener.on('onContactsChanged', setContacts),
      Zello.Listener.on('onChannelsChanged', setChannels),
    ];
    return () => subs.forEach((s) => s.remove());
  }, []);

  return { connected, contacts, channels };
}
```

## Error Events

| Event | Payload | When |
|-------|---------|------|
| `onError` | `{ error, context }` | General SDK error |
| `onOutgoingVoiceMessageFailed` | `{ error }` | PTT send failed |

Handle errors following the `http.ts` pattern — log technical details,
show user-friendly messages.
