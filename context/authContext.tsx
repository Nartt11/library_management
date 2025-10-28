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

interface AuthContextType {
  currentUser: User | null;
  pendingBook: PendingBook | null;
  saveUser: (user: User | null) => void; // CHỈ lưu user
  logout: () => void;
  setPendingBook: (book: PendingBook | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
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

  const logout = () => {
    saveUser(null);
    setPendingBook(null);
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
