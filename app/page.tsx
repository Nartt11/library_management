"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "@/app/(public)/login/page";
import { Showroom } from "@/components/Showroom";
// import { AdminDashboard } from "@/components/AdminDashboard";
// import { LibrarianDashboard } from "@/components/LibrarianDashboard";
// import { StudentDashboard } from "@/components/StudentDashboard";
// import { ScannerDashboard } from "@/components/ScannerDashboard";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/authContext";
import { getUserFromToken } from "@/services/auth/authService";

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const { currentUser, saveUser, logout, setPendingBook, pendingBook } =
    useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is logged in, redirect to role dashboard
    if (currentUser && typeof currentUser.role === "string" && currentUser.role.trim() !== "") {
      const normalizedRole = currentUser.role.replace(/-/g, "").trim();
      const rolePath = `/${normalizedRole}/dashboard`;
      router.push(rolePath);
      return;
    }

    // If there is a token but no currentUser saved, try to deserialize user from token
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token && !currentUser) {
        const userFromToken = getUserFromToken();
        if (userFromToken) {
          // persist into context and trigger redirect on next render
          saveUser(userFromToken);
          return;
        }

        // if token exists but cannot parse user, clear stale user storage
        localStorage.removeItem("user");
      }
    } catch (_) {}
  }, [currentUser, router]);

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
      // case "admin":
      //   return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
      // case "librarian":
      //   return (
      //     <LibrarianDashboard user={currentUser} onLogout={handleLogout} />
      //   );
      // case "student":
      //   return (
      //     <StudentDashboard
      //       user={currentUser}
      //       onLogout={handleLogout}
      //       pendingBook={pendingBook}
      //       onPendingBookProcessed={handlePendingBookProcessed}
      //     />
      //   );
      // case "scanner":
      //   return <ScannerDashboard user={currentUser} onLogout={handleLogout} />;
      default:
        return <Showroom />;
    }
  };

  return (
    <>
      {renderDashboard()}
      <Toaster />
    </>
  );
}
