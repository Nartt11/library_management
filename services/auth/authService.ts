// services/auth.service.ts
import type { User } from "@/types/user";
import { decodeJwt, extractUserFromToken } from "@/lib/jwtUtils";

export async function loginService(username: string, password: string) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // the API route expects `email` and `password` in the body
    body: JSON.stringify({ userName: username, password }),
  });

  if (!res.ok) {
    let errMsg = "Login failed";
    try {
      const err = await res.json();
      errMsg = err?.error || err?.message || errMsg;
    } catch (_) {}
    throw new Error(errMsg);
  }

  const data = await res.json();
  // The API route currently returns `{ token: string }` (see server route),
  // and the backend may return `{ data: { JWTtoken: string } }` in other flows.
  const token = data?.token ?? data?.data?.JWTtoken ?? null;
  if (!token) throw new Error("Invalid login response: no token returned");

  // Save token
  localStorage.setItem("token", token);

  // Extract user info from the token using centralized utility
  const user = extractUserFromToken(token);
  
  if (user) {
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch (_) {}
  }

    // Notify other parts of the app about login (so AuthContext can pick it up)
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
  // Clear both possible stored keys
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  // Notify other parts of the app about logout
  window.dispatchEvent(new CustomEvent("auth-logout"));
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  // Prefer full user object if available, otherwise return token wrapper
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
