---
title: Emergency Mode & Dispatch Integration
scope: emergency, code21-mapping
sdk: "@zelloptt/react-native-zello-sdk@2.0.1"
platform: EnforcementMAPS (Expo 54 / React Native 0.81)
updated: 2026-03-27
---

# Emergency Mode & Dispatch Integration

## Zello Emergency Mode

When activated, emergency mode:
- Opens a priority audio channel to dispatch
- Overrides mute settings on all recipients
- Sends the officer's location automatically
- Triggers a prominent alert on dispatch console

```typescript
Zello.startEmergency();  // Activate
Zello.stopEmergency();   // Deactivate
```

## Mapping to Code21 Dispatch

The existing `src/features/code21/` module handles dispatch requests.
Zello emergency mode should **complement**, not replace, Code21:

| Scenario | Code21 | Zello Emergency |
|----------|--------|----------------|
| Dispatch sends job to officer | ✅ Push notification | — |
| Officer acknowledges dispatch | ✅ API call | — |
| Officer needs immediate help | — | ✅ Live voice + location |
| Officer sends status update | ✅ API status change | ✅ PTT voice |

### Triggering Both Systems

When an officer triggers emergency, fire both:

```typescript
// src/features/zello/hooks/useZelloEmergency.ts
import Zello from '@zelloptt/react-native-zello-sdk';
import api from '@/shared/infra/api';

export function useZelloEmergency() {
  const startEmergency = async () => {
    // 1. Activate Zello emergency (live voice + location)
    Zello.startEmergency();

    // 2. Notify MAPS API (creates Code21 record, alerts supervisors)
    try {
      await api.post('/code21/emergency', {
        type: 'OFFICER_EMERGENCY',
        source: 'zello',
      });
    } catch {
      // Zello emergency is already active — API failure is non-blocking
      console.error('[EMERGENCY] Failed to notify MAPS API');
    }
  };

  const stopEmergency = () => {
    Zello.stopEmergency();
  };

  return { startEmergency, stopEmergency };
}
```

## Listening for Emergencies

Dispatch/supervisor app receives emergency events:

```typescript
Zello.Listener.on('onEmergencyStarted', (event) => {
  // event.contact — officer in emergency
  // Highlight on patrol map, sound alarm
});

Zello.Listener.on('onEmergencyStopped', (event) => {
  // Clear emergency state
});
```

## Emergency Button Placement

Place the emergency button in a **persistent, accessible location** —
not buried in a menu. Consider a long-press gesture to prevent
accidental activation (3-second hold).

## Dispatch Call

For non-emergency priority communications, use `Zello.sendDispatchCall()`:

```typescript
// Request attention from dispatch without full emergency
await Zello.sendDispatchCall(dispatchChannel);
```
