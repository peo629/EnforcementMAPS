---
title: Authentication & Connection Lifecycle
scope: network-credentials, auth-context-integration
sdk: "@zelloptt/react-native-zello-sdk@2.0.1"
platform: EnforcementMAPS (Expo 54 / React Native 0.81)
updated: 2026-03-27
---

# Authentication & Connection Lifecycle

## How Zello Auth Works

Zello uses **network credentials** — separate from the app's JWT auth.
Each Zello Work network has an `issuer` and `credentialKey`. Officers
authenticate with a Zello username and password (or provisioned token).

## Integration With AuthContext

The existing `auth-context.tsx` manages app login/logout. Zello must
hook into this lifecycle:

```
Officer taps Login
  → AuthContext.login() succeeds
  → token + user stored
  → ZelloProvider detects token change
  → Zello.connect(networkConfig) called
  → Zello SDK authenticates with Zello Work servers

Officer taps Logout
  → AuthContext.logout() called
  → ZelloProvider detects token = null
  → Zello.disconnect() called
  → Zello session ends
```

## ZelloProvider Implementation

```typescript
// src/features/zello/zello-provider.tsx
import { useEffect, useRef } from 'react';
import Zello from '@zelloptt/react-native-zello-sdk';
import { useAuth } from '@/shared/infra/auth-context';

const ZELLO_NETWORK = process.env.EXPO_PUBLIC_ZELLO_NETWORK_ISSUER ?? '';
const ZELLO_KEY = process.env.EXPO_PUBLIC_ZELLO_CREDENTIAL_KEY ?? '';

export function ZelloProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const connectedRef = useRef(false);

  useEffect(() => {
    if (token && user && !connectedRef.current) {
      // Map officer identity to Zello username
      const zelloUsername = `officer_${user.officerNumber}`;
      Zello.connect({
        network: ZELLO_NETWORK,
        username: zelloUsername,
        password: ZELLO_KEY,
      });
      connectedRef.current = true;
    }

    if (!token && connectedRef.current) {
      Zello.disconnect();
      connectedRef.current = false;
    }
  }, [token, user]);

  return <>{children}</>;
}
```

## Mount Order in app/_layout.tsx

```typescript
export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ZelloProvider>
          <AppNavigator />
        </ZelloProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

## Username Strategy

Map officer numbers to Zello usernames deterministically:

| App Identity | Zello Username |
|-------------|---------------|
| Officer 629 | `officer_629` |
| Supervisor 100 | `officer_100` |

Officers must be pre-provisioned in the Zello Work admin console or
via the provisioning API. See [08-channels-contacts.md](./08-channels-contacts.md).

## Credential Storage

- Zello network credentials (`issuer`, `credentialKey`) are **build-time
  env vars** — they go in `eas.json`, not in SecureStore.
- The SDK manages its own session token internally after `connect()`.
- Do **not** store Zello passwords in `expo-secure-store` alongside
  the app JWT.
