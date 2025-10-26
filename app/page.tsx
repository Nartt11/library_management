"use client";

import React, { useState, useCallback } from "react";
import { LoginPage } from "@/components/LoginPage";
import { Showroom } from "@/components/Showroom";
import { AdminDashboard } from "@/components/AdminDashboard";
import { LibrarianDashboard } from "@/components/LibrarianDashboard";
import { StudentDashboard } from "@/components/StudentDashboard";
import { ScannerDashboard } from "@/components/ScannerDashboard";
import { Toaster } from "@/components/ui/sonner";

export type UserRole = "admin" | "librarian" | "student" | "scanner";

export interface User {
  id: string;
  name: string;
  email: string;
  studentNumber?: string;
  role: UserRole;
  avatar?: string;
}

export interface PendingBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  bookId: string;
  category: string;
  action: "borrow" | "reserve";
}

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [pendingBook, setPendingBook] = useState<PendingBook | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowLogin(true);
    setPendingBook(null);
  };

  const handleLoginRequired = (book?: PendingBook) => {
    if (book) {
      setPendingBook(book);
    } else {
      setPendingBook(null);
    }
    setShowLogin(true);
  };

  const handleBackToShowroom = () => {
    setShowLogin(false);
    setPendingBook(null);
  };

  const handlePendingBookProcessed = useCallback(() => {
    setPendingBook(null);
  }, []);

  if (!currentUser) {
    if (showLogin) {
      return (
        <LoginPage
          onLogin={handleLogin}
          onBackToShowroom={handleBackToShowroom}
        />
      );
    } else {
      return <Showroom onLoginRequired={handleLoginRequired} />;
    }
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case "admin":
        return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
      case "librarian":
        return (
          <LibrarianDashboard user={currentUser} onLogout={handleLogout} />
        );
      case "student":
        return (
          <StudentDashboard
            user={currentUser}
            onLogout={handleLogout}
            pendingBook={pendingBook}
            onPendingBookProcessed={handlePendingBookProcessed}
          />
        );
      case "scanner":
        return <ScannerDashboard user={currentUser} onLogout={handleLogout} />;
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <>
      {renderDashboard()}
      <Toaster />
    </>
  );
}
