import { getToken } from "./auth/authService";
import { API_BASE } from "@/lib/apiConfig";

export interface ApiError {
  status: number;
  message: string;
  data?: any;
}
export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    const token = getToken();

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,            // headers final
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type");
    let data: any = null;

    if (contentType?.includes("application/json")) {
      data = await response.json().catch(() => null);
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: data?.message || data?.errorMessage || data?.error || "API Request Failed",
        data,
      };
    }

    return data as T;

  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}


// GET
export function getApi<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  return apiFetch<T>(path, {
    method: "GET",
    ...options,
  });
}

// POST
export function postApi<T = any>(
  path: string,
  body: any = {},
  options: RequestInit = {}
): Promise<T> {
  return apiFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
    },
  });
}

// PUT
export function putApi<T = any>(
  path: string,
  body: any = {},
  options: RequestInit = {}
): Promise<T> {
  return apiFetch<T>(path, {
    method: "PUT",
    body: JSON.stringify(body),
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
    },
  });
}

// DELETE
export function deleteApi<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  return apiFetch<T>(path, {
    method: "DELETE",
    ...options,
  });
}
