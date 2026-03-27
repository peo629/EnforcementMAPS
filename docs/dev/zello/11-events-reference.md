---
title: Events & Listener Reference
scope: events
last_reviewed: "2026-03-27"
---

# Events & Listener Reference

The Zello SDK uses a listener/event pattern. In React Native, subscribe with `Zello.on()`.

## Connection Events

| Event | Payload | Description |
|---|---|---|
| `onConnectStarted` | — | Connection attempt began |
| `onConnectSucceeded` | — | Authenticated successfully |
| `onConnectFailed` | `ZelloConnectionError` | Authentication failed |
| `onDisconnected` | — | Disconnected from network |

## Contact Events

| Event | Payload | Description |
|---|---|---|
| `onContactListUpdated` | — | Users, channels, or groups changed |
| `onSelectedContactChanged` | `ZelloContact?` | Selected contact changed |

## Account Events

| Event | Payload | Description |
|---|---|---|
| `onAccountStatusChanged` | `ZelloAccountStatus` | User status changed (online/busy/etc) |

## Voice Message Events

| Event | Payload | Description |
|---|---|---|
| `onOutgoingVoiceMessageConnecting` | `ZelloOutgoingVoiceMessage` | Outgoing PTT connecting |
| `onOutgoingVoiceMessageStarted` | `ZelloOutgoingVoiceMessage` | Outgoing PTT live |
| `onOutgoingVoiceMessageStopped` | `error?` | Outgoing PTT ended |
| `onIncomingVoiceMessageStarted` | `ZelloIncomingVoiceMessage` | Incoming PTT started |
| `onIncomingVoiceMessageStopped` | — | Incoming PTT ended |

## Text Message Events

| Event | Payload | Description |
|---|---|---|
| `onIncomingTextMessage` | `ZelloTextMessage` | Text received |
| `onOutgoingTextMessageSent` | — | Text delivered |
| `onOutgoingTextMessageSendFailed` | — | Text delivery failed |

## Image Message Events

| Event | Payload | Description |
|---|---|---|
| `onIncomingImageMessage` | `ZelloImageMessage` | Image received |
| `onOutgoingImageMessageSent` | — | Image delivered |
| `onOutgoingImageMessageSendFailed` | — | Image delivery failed |

## Location Message Events

| Event | Payload | Description |
|---|---|---|
| `onIncomingLocationMessage` | `ZelloLocationMessage` | Location received |
| `onOutgoingLocationMessageSent` | — | Location delivered |
| `onOutgoingLocationMessageSendFailed` | — | Location delivery failed |

## Alert Message Events

| Event | Payload | Description |
|---|---|---|
| `onIncomingAlertMessage` | `ZelloAlertMessage` | Alert received |
| `onOutgoingAlertMessageSent` | — | Alert delivered |
| `onOutgoingAlertMessageSendFailed` | — | Alert delivery failed |

## Emergency Events

| Event | Payload | Description |
|---|---|---|
| `onOutgoingEmergencyStarted` | `ZelloOutgoingEmergency` | Emergency started |
| `onOutgoingEmergencyStopped` | `ZelloOutgoingEmergency` | Emergency stopped |
| `onIncomingEmergencyStarted` | `ZelloIncomingEmergency` | Remote emergency started |
| `onIncomingEmergencyUpdated` | `ZelloIncomingEmergency` | Remote emergency updated |
| `onIncomingEmergencyStopped` | `ZelloIncomingEmergency` | Remote emergency ended |

## Dispatch Events

| Event | Payload | Description |
|---|---|---|
| `onDispatchCallTransferred` | — | Call transferred |
| `onDispatchCallEnded` | — | Call ended |

## History Events

| Event | Payload | Description |
|---|---|---|
| `onHistoryPlaybackStarted` | — | History voice playback started |
| `onHistoryPlaybackStopped` | — | History voice playback stopped |

## Group Conversation Events

| Event | Payload | Description |
|---|---|---|
| `onGroupConversationCreated` | `ZelloGroupConversation` | Group created |
| `onGroupConversationRenamed` | `ZelloGroupConversation` | Group renamed |
| `onGroupConversationLeft` | `ZelloGroupConversation` | Left group |
| `onGroupConversationInvite` | `ZelloGroupConversation` | Invited to group |
