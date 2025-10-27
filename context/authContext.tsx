"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import type { User,UserRole } from "@/types/user";
import type { PendingBook } from "@/types/pendingBook";

interface AuthContextType {
  currentUser: User | null;
  pendingBook: PendingBook | null;
  login: (user: User) => void;
  logout: () => void;
  setPendingBook: (book: PendingBook | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pendingBook, setPendingBook] = useState<PendingBook | null>(null);

  const login = (user: User) => setCurrentUser(user);
  const logout = () => {
    setCurrentUser(null);
    setPendingBook(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, pendingBook, login, logout, setPendingBook }}
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
