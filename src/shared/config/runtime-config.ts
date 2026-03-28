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

let _resolved: { url: string | null; logged: boolean } | null = null;

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
