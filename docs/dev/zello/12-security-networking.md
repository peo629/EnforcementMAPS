---
title: Security & Networking
scope: security
last_reviewed: "2026-03-27"
---

# Security & Networking

## Encryption

All Zello SDK communication is encrypted:

| Layer | Encryption |
|---|---|
| Transport | TLS (HTTPS / WSS) |
| Voice payload | AES-256 |
| Key exchange | RSA-1024 |

Voice data is encrypted end-to-end between devices. The Zello server relays encrypted packets without decrypting them.

## Network Requirements

### Ports

| Protocol | Port | Purpose |
|---|---|---|
| HTTPS | 443 | API and signaling |
| WSS | 443 | WebSocket (voice streaming) |
| UDP | 443, 80 | Media transport (fallback) |

### Domains to Allowlist

If operating behind a corporate firewall or MDM:

- `*.zellowork.com`
- `*.zello.com`
- `zello-sdk.s3.amazonaws.com` (SDK Maven repo)
- `fcm.googleapis.com` (push notifications)

## Proxy Support

The SDK supports HTTP proxies configured at the OS level. Custom proxy configuration is not exposed via the SDK API.

## Certificate Pinning

The SDK performs certificate validation against standard Android trust stores. Custom CA certificates must be added to the Android network security config if required.

## Data at Rest

- Message history is stored locally on device in an encrypted database managed by the SDK.
- No Zello data is synced to external cloud storage by the SDK.

## Compliance Notes

- The SDK does not collect personal data beyond what is required for PTT functionality.
- User provisioning and data retention policies are managed through the Zello Work Administrative Console.
- For CJIS or other compliance requirements, contact Zello directly for their compliance documentation.
