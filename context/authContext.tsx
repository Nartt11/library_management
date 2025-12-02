"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { User } from "@/types/user";
import type { PendingBook } from "@/types/pendingBook";
import { useRouter } from "next/navigation";

interface AuthContextType {
  currentUser: User | null;
  pendingBook: PendingBook | null;
  saveUser: (user: User | null) => void; // CHỈ lưu user
  logout: () => void;
  setPendingBook: (book: PendingBook | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [currentUser, _setCurrentUser] = useState<User | null>(null);
  const [pendingBook, setPendingBook] = useState<PendingBook | null>(null);

  const saveUser = (user: User | null) => {
    _setCurrentUser(user);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  };

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) _setCurrentUser(JSON.parse(saved));
  }, []);

  // Listen for login events dispatched by `loginService` and storage events
  useEffect(() => {
    const onAuthLogin = (e: any) => {
      const user = e?.detail ?? null;
      if (user) saveUser(user);
    };

    const onStorage = (ev: StorageEvent) => {
      if (ev.key === "user") {
        if (ev.newValue) {
          try {
            saveUser(JSON.parse(ev.newValue));
          } catch (_) {
            saveUser(null);
          }
        } else {
          saveUser(null);
        }
      }
      if (ev.key === "token" && !ev.newValue) {
        // token removed => logout
        saveUser(null);
      }
    };

    window.addEventListener("auth-login", onAuthLogin as EventListener);
    window.addEventListener("storage", onStorage as any);

    return () => {
      window.removeEventListener("auth-login", onAuthLogin as EventListener);
      window.removeEventListener("storage", onStorage as any);
    };
  }, []);

  const logout = () => {
    saveUser(null);
    setPendingBook(null);
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, pendingBook, saveUser, logout, setPendingBook }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
