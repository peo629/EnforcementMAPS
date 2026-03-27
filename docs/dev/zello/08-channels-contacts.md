---
title: Channels, Contacts & Group Conversations
scope: channel-management, user-provisioning, groups
sdk: "@zelloptt/react-native-zello-sdk@2.0.1"
platform: EnforcementMAPS (Expo 54 / React Native 0.81)
updated: 2026-03-27
---

# Channels, Contacts & Group Conversations

## Channel Strategy for EnforcementMAPS

Map Zello channels to the patrol zone structure:

| Zello Channel | Purpose |
|---------------|---------|
| `dispatch` | Central dispatch — all officers monitor |
| `zone-north` | North patrol zone officers |
| `zone-south` | South patrol zone officers |
| `zone-east` | East patrol zone officers |
| `zone-west` | West patrol zone officers |
| `supervisors` | Supervisor-only channel |

Channels are created in the **Zello Work admin console**, not in the SDK.

## Connecting to Channels

```typescript
// Auto-connect to dispatch on login
Zello.connectChannel('dispatch');

// Connect to assigned zone channel
const zoneChannel = `zone-${user.assignedZone.toLowerCase()}`;
Zello.connectChannel(zoneChannel);
```

## Listing Channels and Contacts

```typescript
Zello.Listener.on('onChannelsChanged', (channels) => {
  // channels: ZelloChannel[]
  // Each has: name, status, usersOnline
});

Zello.Listener.on('onContactsChanged', (contacts) => {
  // contacts: ZelloContact[]
  // Each has: name, displayName, status, isMuted
});
```

## Muting

Officers can mute channels they are monitoring but not actively using:

```typescript
Zello.muteContact(channel); // Mute a channel
Zello.unmuteContact(channel); // Unmute
```

## Group Conversations

Ad-hoc groups for multi-officer operations (e.g., a coordinated
enforcement action):

```typescript
const group = await Zello.createGroupConversation([
  officer_101,
  officer_205,
  officer_629,
]);

// Send PTT to the group
Zello.send(group);
```

## User Provisioning

Officers must exist in the Zello Work network before they can connect.
Two approaches:

1. **Manual** — Admin creates users in Zello Work console.
2. **API provisioning** — Backend (`maps-api`) calls the Zello
   provisioning API to create/update users when officers are registered
   in the CIVIC MAPS system.

See Zello docs: <https://sdk.zello.com/core-concepts/user-+-channel-provisioning>

## Integration With Presence

The existing `presence.api.ts` tracks officer online status via
heartbeats. Zello contact status can augment this:

```typescript
// In the Zello provider or a dedicated hook
Zello.Listener.on('onContactsChanged', (contacts) => {
  // Cross-reference with app's officer roster
  // Update presence indicators on the patrol map
});
```
