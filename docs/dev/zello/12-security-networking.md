---
title: Security & Networking
scope: encryption, tls, firewall, credential-storage
sdk: "@zelloptt/react-native-zello-sdk@2.0.1"
platform: EnforcementMAPS (Expo 54 / React Native 0.81)
updated: 2026-03-27
---

# Security & Networking

## Encryption

| Layer | Method |
|-------|--------|
| Voice data | AES-256-CBC, per-message key |
| Signalling | TLS 1.2+ (HTTPS) |
| Media transport | DTLS-SRTP |
| At rest | Not stored on device by default |

All encryption is handled by the SDK — no application-level crypto needed.

## Network Requirements

### Ports

| Port | Protocol | Purpose |
|------|----------|---------|
| 443 | TCP/TLS | Signalling, API, auth |
| 3478 | UDP | STUN/TURN media relay |
| 10000–20000 | UDP | Direct media (if available) |

### Firewall Allowlist

If operating on restricted networks (e.g., council IT):

```
*.zellowork.com       — API and signalling
*.jfrog.io            — SDK artefact delivery (build time only)
*.firebaseio.com      — FCM push
*.googleapis.com      — FCM push
```

## Credential Security

Follow the project's existing security practices from `CLAUDE.md`:

| Credential | Storage | Notes |
|-----------|---------|-------|
| Zello network issuer | `eas.json` env var | Build-time only |
| Zello credential key | `eas.json` env var | Build-time only |
| Zello session token | SDK internal | Not accessible to app code |
| App JWT | `expo-secure-store` | Existing — unchanged |
| Firebase `google-services.json` | `.gitignore` | **Must not** be committed |

> **Important:** Add `google-services.json` to `.gitignore` if not
> already present.

## Offline Behaviour

- Zello requires an active network connection for PTT.
- The SDK auto-reconnects when connectivity is restored (`onWillReconnect` event).
- The app's existing offline-first patterns (per `CLAUDE.md` guidelines)
  should handle graceful degradation — show a "PTT unavailable" indicator
  when Zello is disconnected.

## Audit Logging

Zello Work admin console provides:
- Message history and timestamps
- Emergency event logs
- User connection/disconnection logs

These complement the MAPS API's own audit trail.
