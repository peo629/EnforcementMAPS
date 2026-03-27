---
title: API Quick Reference
scope: api-reference
last_reviewed: "2026-03-27"
---

# API Quick Reference

Condensed reference of all `Zello` singleton methods and properties.

## Lifecycle

| Method | Description |
|---|---|
| `start()` | Initialize the SDK (call once) |
| `configure(options)` | Set push notifications & foreground service options |
| `connect(credentials)` | Sign into Zello Work network |
| `disconnect()` | Sign out |

## Properties (Read-Only After Connection)

| Property | Type | Description |
|---|---|---|
| `state` | `ZelloState` | SDK state (started/stopped) |
| `connectionState` | `ZelloConnectionState` | Connection state |
| `accountStatus` | `ZelloAccountStatus?` | Online/busy/standby |
| `users` | `ZelloUser[]` | Contact list users |
| `channels` | `ZelloChannel[]` | Channels |
| `groupConversations` | `ZelloGroupConversation[]` | Ad-hoc groups |
| `recents` | `ZelloRecentEntry[]` | Recent messages |
| `selectedContact` | `ZelloContact?` | Currently selected contact |
| `incomingVoiceMessage` | `ZelloIncomingVoiceMessage?` | Active incoming PTT |
| `outgoingVoiceMessage` | `ZelloOutgoingVoiceMessage?` | Active outgoing PTT |
| `incomingEmergencies` | `ZelloIncomingEmergency[]` | Active emergencies |
| `outgoingEmergency` | `ZelloOutgoingEmergency?` | Own emergency |
| `emergencyChannel` | `ZelloChannel?` | Configured emergency channel |
| `consoleSettings` | `ZelloConsoleSettings` | Network feature flags |
| `historyVoiceMessage` | `ZelloHistoryVoiceMessage?` | Playing history message |

## Voice

| Method | Description |
|---|---|
| `startVoiceMessage(contact)` | Begin PTT transmission |
| `stopVoiceMessage()` | End PTT transmission |

## Rich Messaging

| Method | Description |
|---|---|
| `sendText(text, contact)` | Send text message |
| `sendImage(data, contact)` | Send image message |
| `sendLocation(contact)` | Send current location |
| `sendAlert(text, contact)` | Send alert message |

## Channels

| Method | Description |
|---|---|
| `connectChannel(channel)` | Join a channel |
| `disconnectChannel(channel)` | Leave a channel |

## Group Conversations

| Method | Description |
|---|---|
| `createGroupConversation(users, name?)` | Create ad-hoc group |
| `addUsersToGroupConversation(conv, users)` | Add members |
| `renameGroupConversation(conv, name)` | Rename group |
| `leaveGroupConversation(conv)` | Leave group |

## Emergency

| Method | Description |
|---|---|
| `startEmergency()` | Activate emergency mode |
| `stopEmergency()` | Deactivate emergency mode |

## Dispatch

| Method | Description |
|---|---|
| `endDispatchCall(call, channel)` | End a dispatch call |

## Contacts

| Method | Description |
|---|---|
| `getUser(name)` | Lookup user by name |
| `getChannel(name)` | Lookup channel by name |
| `getGroupConversation(name)` | Lookup group by name |
| `setSelectedContact(contact)` | Set active contact |
| `muteContact(contact)` | Mute a contact |
| `unmuteContact(contact)` | Unmute a contact |

## History

| Method | Description |
|---|---|
| `getHistory(contact, size?)` | Get message history |
| `getHistoryMessage(id, contact)` | Get specific history entry |
| `playHistoryMessage(message)` | Play voice history |
| `stopHistoryMessagePlayback()` | Stop voice playback |
| `loadBitmapForHistoryImageMessage(msg, cb)` | Load history image |

## Notifications

| Method | Description |
|---|---|
| `clearAllMessageNotifications()` | Clear all notifications |
| `clearMessageNotificationsForContact(contact)` | Clear per-contact |

## Account

| Method | Description |
|---|---|
| `setAccountStatus(status)` | Set online status |

## Diagnostics

| Method | Description |
|---|---|
| `submitProblemReport()` | Send logs to Zello support |

## Full API Docs

- **Android (Kotlin):** <https://developers.zello.com/sdk/v2.0/android/>
- **React Native SDK source:** <https://github.com/zelloptt/react-native-zello-sdk/tree/master/src>
