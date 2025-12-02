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
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}${path}`, {
      headers,
      cache: "no-store",
      ...options,
    });

    const contentType = response.headers.get("content-type");
    let data: any = null;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json().catch(() => null);
    }

    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        message: data?.message || data?.errorMessage || data?.error || "API Request Failed",
        data,
      };
      throw error;
    }

    return data as T;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
