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
import { useRouter, usePathname } from "next/navigation";
import { getMyProfile } from "@/services/profile";
import {
  logout as authServiceLogout,
  getUserFromToken,
} from "@/services/auth/authService";

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
    const token = localStorage.getItem("token");

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as User;
        // If saved user lacks role, try to fill it from token
        if (!parsed?.role && token) {
          const fromToken = getUserFromToken();
          if (fromToken?.role) {
            parsed.role = fromToken.role;
            parsed.id = fromToken.id || parsed.id;
            parsed.name = fromToken.name || parsed.name;
            parsed.email = fromToken.email || parsed.email;
            try {
              localStorage.setItem("user", JSON.stringify(parsed));
            } catch (_) {}
          }
        }
        _setCurrentUser(parsed);
      } catch (_) {
        _setCurrentUser(null);
      }
    } else if (token) {
      // If no saved user but token exists, extract user from token
      const fromToken = getUserFromToken();
      if (fromToken) {
        _setCurrentUser(fromToken);
        try {
          localStorage.setItem("user", JSON.stringify(fromToken));
        } catch (_) {}
      }
    }
  }, []);

  // On mount, verify token by calling profile endpoint. If unauthorized, force logout.
  useEffect(() => {
    let mounted = true;
    const verify = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const profile = await getMyProfile();
        // If profile returned, sync current user (some APIs return user object)
        if (mounted && profile) {
          try {
            const prof = profile as any;
            // Always merge role and other info from token if missing from profile
            const fromToken = getUserFromToken();
            if (fromToken) {
              prof.role = prof.role || fromToken.role;
              prof.id = prof.id || fromToken.id;
              prof.name = prof.name || fromToken.name;
              prof.email = prof.email || fromToken.email;
            }
            _setCurrentUser(prof);
            localStorage.setItem("user", JSON.stringify(prof));
          } catch (_) {}
        }
      } catch (err: any) {
        // If API returned unauthorized, clear auth and redirect to sign-in
        const status = err?.status ?? err?.statusCode ?? null;
        if (status === 401) {
          try {
            authServiceLogout();
          } catch (_) {}
          saveUser(null);
          setPendingBook(null);
          if (mounted) router.push("/");
        }
      }
    };

    verify();

    return () => {
      mounted = false;
    };
  }, []);

  // Validate token on every route change. If profile endpoint returns 401, force logout.
  const pathname = usePathname();
  useEffect(() => {
    let mounted = true;
    
    // Skip validation for public routes
    const publicRoutes = ["/", "/login", "/register", "/about"];
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname?.startsWith(route + "/"));
    
    const verifyOnRoute = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // If no token and trying to access protected route, redirect to login
          if (!isPublicRoute && mounted) {
            router.push("/");
          }
          return;
        }

        // Skip validation on public routes when token exists (user is logged in)
        if (isPublicRoute) return;

        await getMyProfile();
      } catch (err: any) {
        const status = err?.status ?? err?.statusCode ?? null;
        if (status === 401) {
          console.warn("Token validation failed on route change - logging out");
          try {
            authServiceLogout();
          } catch (_) {}
          saveUser(null);
          setPendingBook(null);
          if (mounted) router.push("/");
        }
        // For other errors (network, 500, etc), don't force logout
      }
    };

    verifyOnRoute();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
