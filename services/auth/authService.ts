// services/auth.service.ts
import { loginApi } from "@/lib/api/auth";

export async function login(username: string, password: string) {
  const user = await loginApi(username, password);

  // Save to localStorage (đơn giản)
  localStorage.setItem("user", JSON.stringify(user));

  return user;
}

export function logout() {
  localStorage.removeItem("user");
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
}
