// services/auth.service.ts
// import { loginApi } from "@/lib/api/auth";

export async function loginService(username: string, password: string) {
  
  const res = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Login failed");

  const user = res.json();
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
