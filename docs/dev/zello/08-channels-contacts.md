---
title: Channels & Contacts
scope: contacts
last_reviewed: "2026-03-27"
---

# Channels & Contacts

## Contact Types

All communication targets implement `ZelloContact`:

| Type | Description |
|---|---|
| `ZelloUser` | Individual user (1:1 messaging) |
| `ZelloChannel` | Multi-user channel (provisioned via console) |
| `ZelloDispatchChannel` | Special channel with dispatcher/caller roles |
| `ZelloGroupConversation` | Ad-hoc group created by end users |

## Accessing Contacts

```typescript
// After successful connection:
const users = Zello.users;           // ZelloUser[]
const channels = Zello.channels;     // ZelloChannel[]
const groups = Zello.groupConversations; // ZelloGroupConversation[]
const recents = Zello.recents;       // ZelloRecentEntry[]

// Lookup by name
const user = Zello.getUser('officer2');
const channel = Zello.getChannel('Patrol-Alpha');
```

## Channel Operations

```typescript
// Connect to a channel (start receiving messages)
Zello.connectChannel(channel);

// Disconnect from a channel
Zello.disconnectChannel(channel);
```

### Channel Status

| Status | Description |
|---|---|
| `online` | Connected, sending/receiving |
| `connecting` | Connection in progress |
| `offline` | Not connected |

## Group Conversations

Group conversations are ad-hoc multi-user channels created at runtime:

```typescript
// Create a new group
Zello.createGroupConversation([user1, user2], 'Field Team Alpha');

// Add users to existing group
Zello.addUsersToGroupConversation(conversation, [user3]);

// Rename
Zello.renameGroupConversation(conversation, 'New Name');

// Leave
Zello.leaveGroupConversation(conversation);
```

## Selected Contact

Track which contact the user is currently interacting with:

```typescript
Zello.setSelectedContact(contact);
// Zello.selectedContact — current selection
```

## Contact Muting

```typescript
Zello.muteContact(contact);
Zello.unmuteContact(contact);
// Muted contacts: messages still arrive in history but don't play live
```

## User Properties

| Property | Type | Description |
|---|---|---|
| `name` | `string` | Username |
| `displayName` | `string` | Display name |
| `status` | `Status` | `online`, `offline`, `busy`, `standby` |
| `isMuted` | `boolean` | Mute state |
| `customStatusText` | `string?` | Custom status |
| `profilePictureUrl` | `string?` | Profile picture URL |
| `supportedFeatures` | `SupportedFeatures` | Feature flags |

## Events

| Event | Trigger |
|---|---|
| `onContactListUpdated` | Any change to users, channels, or groups |
| `onSelectedContactChanged` | Selected contact changed |
