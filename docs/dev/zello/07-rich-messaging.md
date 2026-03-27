---
title: Rich Messaging
scope: messaging
last_reviewed: "2026-03-27"
---

# Rich Messaging

Beyond voice, the Zello SDK supports text, image, location, and alert messages.

## Text Messages

```typescript
Zello.sendText('Hello from EnforcementMAPS', contact);
```

| Event | Description |
|---|---|
| `onOutgoingTextMessageSent` | Text delivered successfully |
| `onOutgoingTextMessageSendFailed` | Delivery failed |
| `onIncomingTextMessage` | Text received from another user |

```typescript
Zello.on('incomingTextMessage', (message) => {
  // message.text — the message content
  // message.contact — the sender
  // message.channelUser — sender in channel context
});
```

## Image Messages

```typescript
// imageData: byte array of the image
Zello.sendImage(imageData, contact);
```

| Event | Description |
|---|---|
| `onOutgoingImageMessageSent` | Image delivered |
| `onOutgoingImageMessageSendFailed` | Delivery failed |
| `onIncomingImageMessage` | Image received (includes thumbnail + full image) |

## Location Messages

```typescript
Zello.sendLocation(contact);
```

The SDK obtains the device location automatically. Requires `ACCESS_FINE_LOCATION` permission.

| Event | Description |
|---|---|
| `onOutgoingLocationMessageSent` | Location delivered |
| `onOutgoingLocationMessageSendFailed` | Delivery failed |
| `onIncomingLocationMessage` | Location received (lat, lng, accuracy, address) |

```typescript
Zello.on('incomingLocationMessage', (message) => {
  // message.latitude, message.longitude
  // message.accuracy, message.address
});
```

## Alert Messages

Alerts play a recurring sound until the user acknowledges them. Ideal for urgent notifications.

```typescript
Zello.sendAlert('Officer needs assistance', contact);
```

| Event | Description |
|---|---|
| `onOutgoingAlertMessageSent` | Alert delivered |
| `onOutgoingAlertMessageSendFailed` | Delivery failed |
| `onIncomingAlertMessage` | Alert received |

## Console Settings

Message types can be enabled/disabled at the network level via the Zello Work Administrative Console. Check availability at runtime:

```typescript
// Available after connection
const settings = Zello.consoleSettings;
// settings.allowTextMessages
// settings.allowImageMessages
// settings.allowLocationMessages
// settings.allowAlertMessages
// settings.allowGroupConversations
```
