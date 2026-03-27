---
title: Authentication & Connection
scope: authentication
last_reviewed: "2026-03-27"
---

# Authentication & Connection

## Network Credentials

Every SDK session requires three credentials:

| Field | Description | Example |
|---|---|---|
| `network` | Zello Work network name | `"mycompany"` |
| `username` | User account name | `"officer1"` |
| `password` | User account password | `"s3cur3p@ss"` |

> Obtain the network name from your Zello Work URL: `{network}.zellowork.com`.

## SDK Lifecycle

```
start() → configure() → connect(credentials) → [use SDK] → disconnect()
```

### 1. Start the SDK

```typescript
import Zello from '@zelloptt/react-native-zello-sdk';

// Call once, typically in app entry point
Zello.start();
```

### 2. Configure

```typescript
Zello.configure({
  enableOfflineMessagePushNotifications: true,
  enableForegroundService: true,
});
```

### 3. Connect

```typescript
Zello.connect({
  network: 'mycompany',
  username: 'officer1',
  password: 's3cur3p@ss',
});
```

### 4. Listen for Connection State

```typescript
Zello.on('connectSucceeded', () => {
  console.log('Connected to Zello network');
});

Zello.on('connectFailed', (error) => {
  console.error('Connection failed:', error);
});

Zello.on('disconnected', () => {
  console.log('Disconnected');
});
```

### 5. Disconnect

```typescript
Zello.disconnect();
```

## Connection States

| State | Description |
|---|---|
| `disconnected` | Not connected to any network |
| `connecting` | Connection in progress |
| `connected` | Authenticated and ready |

## Connection Errors

| Error | Cause |
|---|---|
| `INVALID_STATE` | SDK not started or already connecting |
| `INVALID_CREDENTIALS` | Wrong network/username/password |
| `NETWORK_NOT_FOUND` | Network name does not exist |
| `NOT_AUTHORIZED` | Account suspended or SDK not enabled |

## User & Channel Provisioning

Users and channels are provisioned via the **Zello Work Administrative Console**, not through the SDK. The SDK connects as an existing user. See `08-channels-contacts.md` for runtime channel operations.
