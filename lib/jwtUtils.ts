import type { User, UserRole } from "@/types/user";

/**
 * Centralized JWT utilities
 * Reusable functions for decoding and extracting user info from JWT tokens
 */

function base64UrlDecode(input: string): string {
  // Replace URL-safe chars
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  // Pad with '='
  const pad = input.length % 4;
  if (pad === 2) input += "==";
  else if (pad === 3) input += "=";
  else if (pad !== 0) {
    // invalid padding
  }
  try {
    return decodeURIComponent(
      atob(input)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  } catch (e) {
    // fallback
    return atob(input);
  }
}

/**
 * Decode JWT token and return payload
 */
export function decodeJwt(token: string): any | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = parts[1];
    const json = base64UrlDecode(payload);
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    return null;
  }
}

/**
 * Map role string to UserRole type
 */
export function mapRole(raw?: string): UserRole {
  const r = (raw || "").toLowerCase();
  if (r.includes("admin")) return "admin";
  if (r.includes("staff")) return "staff";
  return "student";
}

/**
 * Extract user information from JWT token
 * Handles various claim formats from the backend
 */
export function extractUserFromToken(token: string): User | null {
  const payload = decodeJwt(token);
  if (!payload) return null;

  // Extract claims (handles multiple formats)
  const id = payload.AccountId ?? payload.UserId ?? payload.userId ?? payload.sub ?? "";
  const fullname = payload.FullName ?? payload.Name ?? payload.UserName ?? payload.name ?? payload.userName ?? payload.fullname ?? "";
  const email = payload.Email ?? payload.email ?? "";
  const role = mapRole(payload.Role ?? payload.role ?? "");

  const user: User = {
    id: String(id),
    name: String(fullname),
    email: String(email),
    role,
  };
console.log('Extracted user from token:', user);
  // If the role is student, attach studentNumber field
  if (role === "student" && id) {
    (user as any).studentNumber = String(id);
  }

  return user;
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * Get token expiration time
 */
export function getTokenExpiration(token: string): Date | null {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return null;
  
  return new Date(payload.exp * 1000);
}
