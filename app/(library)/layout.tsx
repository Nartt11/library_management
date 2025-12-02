"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";

import { DemoBanner } from "../../components/DemoBanner";
import { DashboardFooter } from "../../components/DashboardFooter";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import Image from "next/image";

import uitLogo from "./../../public/UITLogo.jpg";
import { useAuth } from "@/context/authContext";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { getUserFromToken } from "@/services/auth/authService";
import type { User } from "@/types/user";

interface DashboardLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Decode user from token on mount
    const decodedUser = getUserFromToken();
    setUser(decodedUser);

    // Listen for storage events to update user when token changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        const updatedUser = getUserFromToken();
        setUser(updatedUser);
      }
    };

    // Listen for custom auth events
    const handleAuthLogin = (e: CustomEvent) => {
      const updatedUser = getUserFromToken();
      setUser(updatedUser);
    };

    const handleAuthLogout = () => {
      setUser(null);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-login", handleAuthLogin as EventListener);
    window.addEventListener("auth-logout", handleAuthLogout);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-login", handleAuthLogin as EventListener);
      window.removeEventListener("auth-logout", handleAuthLogout);
    };
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Image
              src={uitLogo}
              alt="University of Infomation of Technology Logo"
              className="h-8 w-8 object-contain"
            />
            <div>
              <h2 className="text-sm text-sidebar-foreground">
                Library System
              </h2>
            </div>
          </div>
        </div>
        <NavigationSidebar role={user?.role} activeView="" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Demo Banner */}
        <DemoBanner />

        {/* Header */}
        <header className="bg-card border-b border-border px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Image
                        src={uitLogo}
                        alt="University of Infomation of Technology Logo"
                        className="h-8 w-8 object-contain"
                      />
                      <div>
                        <h2 className="text-sm">Library System</h2>
                      </div>
                    </div>
                  </div>
                  <NavigationSidebar role={user?.role} activeView="" />
                </SheetContent>
              </Sheet>

              <div>
                <h1 className="text-xl text-foreground capitalize">
                  {/* {user.role.replace("-", " ")} Dashboard */}
                  Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {user?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>

              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-background">{children}</main>

        {/* Dashboard Footer */}
        <DashboardFooter />
      </div>

      {/* Demo Helper */}
      {/* <DemoHelper userRole={user?.role} /> */}
    </div>
  );
}
