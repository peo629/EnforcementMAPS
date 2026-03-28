import { Platform } from "react-native";

export interface ApiResult<T = unknown> {
  ok: true;
  data: T;
}

export interface ApiError {
  ok: false;
  error: string;
  technicalDetail?: string;
}

export type ApiResponse<T = unknown> = ApiResult<T> | ApiError;

export function classifyHttpError(status: number): "auth" | "forbidden" | "not_found" | "validation" | "infrastructure" | "server" | "unknown" {
  if (status === 401) return "auth";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 400 || status === 422) return "validation";
  if (status === 502 || status === 503 || status === 504) return "infrastructure";
  if (status >= 500) return "server";
  return "unknown";
}

const USER_MESSAGES: Record<ReturnType<typeof classifyHttpError>, string> = {
  auth: "Invalid credentials. Please check your officer number and password.",
  forbidden: "Your account does not have access. Contact your supervisor.",
  not_found: "Unable to connect to the system. Please try again or contact support.",
  validation: "Please check your input and try again.",
  infrastructure: "The system is temporarily unavailable. Please try again in a few minutes.",
  server: "Something went wrong on the server. Please try again or contact support.",
  unknown: "An unexpected error occurred. Please try again.",
};

export function getUserMessage(classification: ReturnType<typeof classifyHttpError>): string {
  return USER_MESSAGES[classification];
}

export function isJsonResponse(response: Response): boolean {
  const ct = response.headers.get("content-type") ?? "";
  return /^application\/json\\b/i.test(ct);
}

export async function parseApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!isJsonResponse(response)) {
    const classification = classifyHttpError(response.status);
    let technicalDetail: string | undefined;

    try {
      const text = await response.text();
      technicalDetail = `Non-JSON response (${response.status}): ${text.slice(0, 200)}`;
    } catch {
      technicalDetail = `Non-JSON response (${response.status}), body unreadable`;
    }

    if (Platform.OS !== "web") {
      console.error(`[HTTP] ${technicalDetail}`);
    }

    return {
      ok: false,
      error: getUserMessage(classification),
      technicalDetail,
    };
  }

  let data: T & { error?: string | { message?: string }; message?: string; details?: Array<{ message?: string }> };
  try {
    data = await response.json();
  } catch {
    return {
      ok: false,
      error: getUserMessage("server"),
      technicalDetail: `JSON parse failed for ${response.status} response`,
    };
  }

  if (response.ok) {
    return { ok: true, data: data as T };
  }

  const classification = classifyHttpError(response.status);

  if (classification === "auth" || classification === "validation") {
    const serverMessage = extractServerError(data);
    if (serverMessage) {
      return { ok: false, error: serverMessage };
    }
  }

  return {
    ok: false,
    error: getUserMessage(classification),
    technicalDetail: `${response.status}: ${JSON.stringify(data).slice(0, 200)}`,
  };
}

function extractServerError(data: { error?: string | { message?: string }; message?: string; details?: Array<{ message?: string }> }): string | null {
  if (typeof data?.error === "string") return data.error;
  if (typeof data?.error === "object" && typeof data.error?.message === "string") return data.error.message;
  if (Array.isArray(data?.details) && typeof data.details[0]?.message === "string") return data.details[0].message;
  return null;
}
