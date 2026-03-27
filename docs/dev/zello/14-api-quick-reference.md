---
title: API Quick Reference
scope: method-summary, property-summary, types
sdk: "@zelloptt/react-native-zello-sdk@2.0.1"
platform: EnforcementMAPS (Expo 54 / React Native 0.81)
updated: 2026-03-27
---

# API Quick Reference

## Connection

| Method | Signature | Purpose |
|--------|-----------|---------|
| `connect` | `(config: ZelloConfig) → void` | Authenticate and connect |
| `disconnect` | `() → void` | End session |
| `setLogLevel` | `(level: string) → void` | Set SDK log verbosity |

## Voice

| Method | Signature | Purpose |
|--------|-----------|---------|
| `send` | `(contact: ZelloContact) → void` | Start PTT to contact/channel |
| `stopSending` | `() → void` | End PTT transmission |
| `playHistory` | `(message: ZelloHistoryMessage) → void` | Replay history message |
| `stopPlayback` | `() → void` | Stop history playback |

## Messaging

| Method | Signature | Purpose |
|--------|-----------|---------|
| `sendText` | `(contact, text: string) → void` | Send text message |
| `sendImage` | `(contact, uri: string) → void` | Send image message |
| `sendLocation` | `(contact) → void` | Send current location |
| `sendAlert` | `(contact, text, level) → void` | Send priority alert |

## Channels & Contacts

| Method | Signature | Purpose |
|--------|-----------|---------|
| `connectChannel` | `(name: string) → void` | Join a channel |
| `disconnectChannel` | `(name: string) → void` | Leave a channel |
| `muteContact` | `(contact) → void` | Mute contact/channel |
| `unmuteContact` | `(contact) → void` | Unmute |
| `createGroupConversation` | `(contacts[]) → ZelloContact` | Create ad-hoc group |

## Emergency

| Method | Signature | Purpose |
|--------|-----------|---------|
| `startEmergency` | `() → void` | Activate emergency mode |
| `stopEmergency` | `() → void` | Deactivate emergency mode |
| `sendDispatchCall` | `(channel) → void` | Request dispatch attention |

## Key Types

```typescript
interface ZelloConfig {
  network: string;   // Network issuer URL
  username: string;  // Officer Zello username
  password: string;  // Credential key or password
}

interface ZelloContact {
  name: string;
  displayName: string;
  type: 'user' | 'channel' | 'group_conversation';
  status: 'online' | 'offline' | 'busy' | 'standby';
  isMuted: boolean;
}

interface ZelloChannel {
  name: string;
  status: 'connected' | 'disconnected' | 'connecting';
  usersOnline: number;
}

interface ZelloHistoryMessage {
  messageId: string;
  contact: ZelloContact;
  timestamp: number;
  type: 'voice' | 'text' | 'image' | 'location' | 'alert';
}
```

## EnforcementMAPS Feature Module Structure

```
src/features/zello/
  ├── api/                    # Provisioning API calls (optional)
  ├── components/
  │   ├── PTTButton.tsx       # Press-to-talk button
  │   ├── ChannelList.tsx     # Channel picker
  │   └── MessageFeed.tsx     # Incoming message display
  ├── hooks/
  │   ├── useZelloPTT.ts      # PTT state management
  │   ├── useZelloEvents.ts   # Event subscriptions
  │   ├── useZelloMessaging.ts # Rich message helpers
  │   ├── useZelloEmergency.ts # Emergency mode
  │   └── useZelloPermissions.ts # Runtime permission requests
  ├── domain.ts               # Zello types, username mapping
  └── zello-provider.tsx      # Context provider (auth lifecycle)
```
