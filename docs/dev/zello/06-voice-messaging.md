---
title: Voice Messaging (PTT)
scope: send, receive, playback, UI
sdk: "@zelloptt/react-native-zello-sdk@2.0.1"
platform: EnforcementMAPS (Expo 54 / React Native 0.81)
updated: 2026-03-27
---

# Voice Messaging (PTT)

## Core Flow

1. Officer presses and holds the PTT button → `Zello.send(contact)`
2. SDK captures audio from microphone → streams to Zello servers
3. Officer releases → `Zello.stopSending()`
4. Recipients hear audio in real time

## Hook Implementation

```typescript
// src/features/zello/hooks/useZelloPTT.ts
import { useState, useCallback } from 'react';
import Zello, { ZelloContact } from '@zelloptt/react-native-zello-sdk';
import { requestZelloPermissions } from './useZelloPermissions';

export function useZelloPTT() {
  const [isSending, setIsSending] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);

  const startSending = useCallback(async (contact: ZelloContact) => {
    const granted = await requestZelloPermissions();
    if (!granted) return;
    Zello.send(contact);
    setIsSending(true);
  }, []);

  const stopSending = useCallback(() => {
    Zello.stopSending();
    setIsSending(false);
  }, []);

  return { isSending, isReceiving, startSending, stopSending };
}
```

## PTT Button Component

Use `onPressIn` / `onPressOut` for press-and-hold behaviour:

```tsx
// src/features/zello/components/PTTButton.tsx
import { Pressable, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

interface PTTButtonProps {
  contact: ZelloContact;
  isSending: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
}

export function PTTButton({ isSending, onPressIn, onPressOut }: PTTButtonProps) {
  return (
    <Pressable
      onPressIn={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPressIn();
      }}
      onPressOut={onPressOut}
      style={[styles.button, isSending && styles.active]}
    >
      <Text style={styles.label}>
        {isSending ? 'TRANSMITTING' : 'PUSH TO TALK'}
      </Text>
    </Pressable>
  );
}
```

## Receiving Messages

Register an `onIncomingVoiceMessage` listener via `Zello.Listener`:

```typescript
Zello.Listener.on('onIncomingVoiceMessage', (message) => {
  // message.contact — who is speaking
  // message.channel — which channel (if channel message)
  setIsReceiving(true);
});

Zello.Listener.on('onIncomingVoiceMessageStopped', () => {
  setIsReceiving(false);
});
```

## History Playback

Replay the last message on a channel:

```typescript
Zello.playHistory(historyMessage);
Zello.stopPlayback(); // To cancel
```

## UX Guidelines

- Provide **visual + haptic feedback** during transmit (the app already
  uses `expo-haptics`).
- Show a "receiving" indicator with the sender's identity.
- Disable the PTT button when `isReceiving` is true (half-duplex).
- Display transmission duration for officer awareness.
