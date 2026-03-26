import { Platform } from "react-native";

const IS_WEB = Platform.OS === "web";

function normalizeBaseUrl(value: string): string {
  const trimmed = value.trim().replace(/\/$/, "");

  if (Platform.OS !== "android") return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      parsed.hostname = "10.0.2.2";
      return parsed.toString().replace(/\/$/, "");
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}

// Resolve once at first call. Env vars are baked in at Metro build time so
// the value never changes for the lifetime of the process. Lazy evaluation
// avoids the frozen-null issue documented below while still only computing once.
let _resolved: { url: string | null; logged: boolean } | null = null;

/**
 * Returns the base URL for API requests, or null if not configured.
 *
 * Intentionally NOT evaluated at module scope — EXPO_PUBLIC_DOMAIN is baked
 * in by Metro at build time, but module-level evaluation can freeze a null
 * value if the module loads before env substitution completes (e.g. running
 * `expo run:android` without the build script). Lazy resolution on first
 * call avoids this.
 */
export function getApiBaseUrl(): string | null {
  if (IS_WEB) return "";

  if (_resolved !== null) {
    return _resolved.url;
  }

  const explicitBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (explicitBaseUrl) {
    const url = normalizeBaseUrl(explicitBaseUrl);
    _resolved = { url, logged: false };
    console.log(`[CONFIG] API base URL: ${url}`);
    _resolved.logged = true;
    return url;
  }

  const domain = process.env.EXPO_PUBLIC_DOMAIN?.trim();
  if (!domain) {
    console.warn(
      "[CONFIG] Neither EXPO_PUBLIC_API_BASE_URL nor EXPO_PUBLIC_DOMAIN is set. " +
      "API calls will fail. Set one of these in your EAS build environment.",
    );
    _resolved = { url: null, logged: true };
    return null;
  }

  const url = normalizeBaseUrl(`https://${domain}`);
  console.log(`[CONFIG] API base URL: ${url}`);
  _resolved = { url, logged: true };
  return url;
}
