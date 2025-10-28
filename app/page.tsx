"use client";

import React, { useState } from "react";
// import { LoginPage } from "@/components/LoginPage";
import { Showroom } from "@/components/Showroom";
import { AdminDashboard } from "@/components/AdminDashboard";
import { LibrarianDashboard } from "@/components/LibrarianDashboard";
import { StudentDashboard } from "@/components/StudentDashboard";
import { ScannerDashboard } from "@/components/ScannerDashboard";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/authContext";

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const { currentUser, saveUser, logout, setPendingBook, pendingBook } =
    useAuth();

  const handleLogout = () => {
    logout();
    setShowLogin(true);
  };

  const handleLoginRequired = (book?: any) => {
    if (book) {
      setPendingBook(book);
    }
    setShowLogin(true);
  };

  const handleBackToShowroom = () => {
    setShowLogin(false);
    setPendingBook(null);
  };

  const handlePendingBookProcessed = () => {
    setPendingBook(null);
  };

  if (!currentUser) {
    if (showLogin) {
      return (
        <LoginPage onLogin={saveUser} onBackToShowroom={handleBackToShowroom} />
      );
    } else {
      return <Showroom />;
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
        return <LoginPage onLogin={saveUser} />;
    }
  };

  return (
    <>
      {renderDashboard()}
      <Toaster />
    </>
  );
}
