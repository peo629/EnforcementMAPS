---
title: Troubleshooting
scope: debugging
last_reviewed: "2026-03-27"
---

# Troubleshooting

## Build Errors

### "Could not resolve com.zello:sdk"

**Cause:** Zello Maven repository not configured.

**Fix:** Add to both project-level and app-level `build.gradle`:
```groovy
maven { url = uri("https://zello-sdk.s3.amazonaws.com/android/latest") }
```

### Hilt / Dagger compilation errors

**Cause:** Missing Hilt plugin or `@HiltAndroidApp` annotation.

**Fix:**
1. Ensure `apply plugin: "com.google.dagger.hilt.android"` and `apply plugin: "kotlin-kapt"` in app build.gradle.
2. Annotate `MainApplication` with `@HiltAndroidApp`.
3. Add `kapt "com.google.dagger:hilt-compiler:2.51"` to dependencies.

### Duplicate class errors

**Cause:** Version conflicts between Hilt/Dagger transitive dependencies.

**Fix:** Force consistent versions:
```groovy
configurations.all {
    resolutionStrategy.force "com.google.dagger:hilt-android:2.51"
}
```

## Runtime Errors

### "SDK not started" / INVALID_STATE

**Cause:** Calling `connect()` before `start()`.

**Fix:** Ensure `Zello.start()` is called first (typically in `App.tsx` or `useEffect` on mount).

### Voice message fails to start

**Cause:** `RECORD_AUDIO` permission not granted.

**Fix:** Request runtime permission before calling `startVoiceMessage()`.

### Location message fails

**Cause:** `ACCESS_FINE_LOCATION` not granted or location services disabled.

**Fix:** Request permission and verify device GPS is enabled.

### Push notifications not received

**Checklist:**
1. `google-services.json` present in `android/app/`.
2. FCM server key uploaded to Zello Work console.
3. `POST_NOTIFICATIONS` permission granted (Android 13+).
4. App not battery-optimized (excluded from Doze).

## Debugging Tips

### Enable Problem Reports

```typescript
Zello.submitProblemReport();
```

Sends diagnostic logs to Zello support. Contact Zello with a description of the issue after submitting.

### Check Connection State

```typescript
console.log('State:', Zello.state);
console.log('Connection:', Zello.connectionState);
console.log('Account:', Zello.accountStatus);
```

### Verify Network Credentials

Test credentials by logging into the Zello Work web console at `https://{network}.zellowork.com` with the same username/password.

## SDK Version Compatibility

| RN SDK | Android Native SDK | Min RN | Status |
|---|---|---|---|
| 2.0.1 | 1.0.4 | 0.74 | Current |
| 2.0.0 | 1.0.x | 0.74 | Required since Aug 2025 |
| 1.x | 1.0.x | 0.74 | Deprecated |
