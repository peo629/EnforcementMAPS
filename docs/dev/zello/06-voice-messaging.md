---
title: Voice Messaging (PTT)
scope: voice
last_reviewed: "2026-03-27"
---

# Voice Messaging (PTT)

Push-to-talk voice is the core Zello feature. Audio is streamed in real-time — half-duplex (one speaker at a time).

## Sending a Voice Message

```typescript
import Zello from '@zelloptt/react-native-zello-sdk';

// Start transmitting to a contact (user or channel)
Zello.startVoiceMessage(contact);

// Stop transmitting
Zello.stopVoiceMessage();
```

The `contact` parameter is a `ZelloContact` object obtained from `Zello.users`, `Zello.channels`, or `Zello.groupConversations`.

## Outgoing Voice Events

| Event | Fired When |
|---|---|
| `onOutgoingVoiceMessageConnecting` | Transmission is being set up |
| `onOutgoingVoiceMessageStarted` | Microphone is live, audio streaming |
| `onOutgoingVoiceMessageStopped` | Transmission ended (success or error) |

```typescript
Zello.on('outgoingVoiceMessageConnecting', (message) => {
  // Show "connecting" indicator
});

Zello.on('outgoingVoiceMessageStarted', (message) => {
  // Show "transmitting" indicator
});

Zello.on('outgoingVoiceMessageStopped', (error) => {
  // Hide indicator, check error
});
```

## Receiving a Voice Message

Incoming voice messages play automatically through the device speaker. The SDK manages audio routing.

| Event | Fired When |
|---|---|
| `onIncomingVoiceMessageStarted` | Incoming audio begins playing |
| `onIncomingVoiceMessageStopped` | Incoming audio finished |

```typescript
Zello.on('incomingVoiceMessageStarted', (message) => {
  // message.contact — who is speaking
  // message.channelUser — if from a channel, the specific user
});

Zello.on('incomingVoiceMessageStopped', () => {
  // Audio finished
});
```

## History Playback

```typescript
// Retrieve history for a contact
const history = Zello.getHistory(contact, 50);

// Play a voice history entry
Zello.playHistoryMessage(voiceHistoryMessage);

// Stop playback
Zello.stopHistoryMessagePlayback();
```

## PTT UX Guidelines

1. **Press-and-hold** pattern: Start voice on press down, stop on release.
2. Show clear visual feedback for transmitting vs receiving states.
3. Only one outgoing voice message can be active at a time.
4. If another user is already transmitting on a channel, `startVoiceMessage` will fail.
