// services/authService.ts
import type { User } from "@/types/user";
import { extractUserFromToken } from "@/lib/jwtUtils";
import { postApi } from "../base";

export async function loginService(username: string, password: string) {
  // Use centralized postApi which attaches headers and base URL
  const data = await postApi<any>("/auth/login", {
    userName: username,
    password,
  });

  // Normalize token location (some APIs return { token } or { data: { JWTtoken } })
  const token = data?.data ?? data?.data?.JWTtoken ?? null;
  if (!token) throw new Error("Invalid login response: no token returned");

  // Save token
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("token", token);
    } catch (_) {}
  }

  // Extract user info from token
  const user = extractUserFromToken(token);
  if (user && typeof window !== "undefined") {
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch (_) {}
  }

  // Notify app about login
  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth-login", { detail: user }));
    }
  } catch (_) {}

  return { token, user };
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getUserFromToken(): User | null {
  if (typeof window === "undefined") return null;
  const token = getToken();
  if (!token) return null;
  return extractUserFromToken(token);
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  try {
    window.dispatchEvent(new CustomEvent("auth-logout"));
  } catch (_) {}
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem("user");
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (_) {
      return null;
    }
  }
  const token = localStorage.getItem("token");
  if (token) return { token };
  return null;
}

export async function requestPasswordReset(email: string) {
  const data = await postApi<any>("/auth/request-password-reset", { email });
  return data;
}

export async function resetPassword(
  email: string,
  token: number,
  newPassword: string
) {
  const data = await postApi<any>("/auth/reset-password", {
    email,
    token,
    newPassword,
  });
  return data;
}
