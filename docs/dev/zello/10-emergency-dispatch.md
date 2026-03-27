---
title: Emergency Mode & Dispatch
scope: emergency
last_reviewed: "2026-03-27"
---

# Emergency Mode & Dispatch

## Emergency Mode

Emergency mode sends an urgent alert to a designated emergency channel. When activated, the SDK automatically:

1. Sends the user's **current location**.
2. Sends an **alert message**.
3. Begins recording a **10-second voice message**.

### Starting an Emergency

```typescript
Zello.startEmergency();
```

### Stopping an Emergency

```typescript
Zello.stopEmergency();
```

### Emergency Events

| Event | Description |
|---|---|
| `onOutgoingEmergencyStarted` | Emergency activated |
| `onOutgoingEmergencyStopped` | Emergency deactivated |
| `onIncomingEmergencyStarted` | Another user started an emergency |
| `onIncomingEmergencyUpdated` | Emergency status changed |
| `onIncomingEmergencyStopped` | Another user's emergency ended |

### Emergency Prerequisites

- An **emergency channel** must be configured in the Zello Work Administrative Console.
- The `ACCESS_FINE_LOCATION` permission must be granted.
- Access via: `Zello.emergencyChannel`

```typescript
Zello.on('incomingEmergencyStarted', (emergency) => {
  // emergency.channel — the emergency channel
  // emergency.channelUser — who triggered it
  // emergency.emergencyId — unique ID
  // emergency.startTimestamp — when it started
});
```

## Dispatch Channels

Dispatch channels pair **dispatchers** with **field users** through a call-based workflow.

### Dispatch Channel Properties

| Property | Description |
|---|---|
| `currentCall` | Active dispatch call (if any) |
| `call.status` | Call state |

### Ending a Dispatch Call

```typescript
Zello.endDispatchCall(call, dispatchChannel);
```

| Event | Description |
|---|---|
| `onDispatchCallTransferred` | Call transferred to another dispatcher |
| `onDispatchCallEnded` | Call ended |

> Ending calls may be restricted by console settings (`allowNonDispatchersToEndCalls`).
