"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";

import { DemoBanner } from "../../components/DemoBanner";
import { DashboardFooter } from "../../components/DashboardFooter";
import Image from "next/image";

import uitLogo from "./../../public/UITLogo.jpg";
import { useAuth } from "@/context/authContext";
import { NavigationSidebar } from "@/components/NavigationSidebar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, currentUser } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [displayImage, setDisplayImage] = useState("");

  const updateDisplayInfo = () => {
    if (currentUser) {
      setDisplayName(
        (currentUser as any)?.fullName || currentUser?.name || "User"
      );
      setDisplayImage((currentUser as any)?.imageUrl || "");
    }
  };

  useEffect(() => {
    updateDisplayInfo();
  }, [currentUser]);

  // Listen for auth-login and storage events to immediately update header
  useEffect(() => {
    const handleAuthLogin = (e: any) => {
      const user = e?.detail;
      if (user) {
        setDisplayName((user as any)?.fullName || user?.name || "User");
        setDisplayImage((user as any)?.imageUrl || "");
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "user" && e.newValue) {
        try {
          const user = JSON.parse(e.newValue);
          setDisplayName((user as any)?.fullName || user?.name || "User");
          setDisplayImage((user as any)?.imageUrl || "");
        } catch (_) {}
      }
    };

    window.addEventListener("auth-login", handleAuthLogin as EventListener);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        "auth-login",
        handleAuthLogin as EventListener
      );
      window.removeEventListener("storage", handleStorage);
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
              <h2 className="text-xl text-sidebar-foreground">
                Library System
              </h2>
            </div>
          </div>
        </div>
        <NavigationSidebar role={currentUser?.role} activeView="" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

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
                        <h2 className="text-xl">Library System</h2>
                      </div>
                    </div>
                  </div>
                  <NavigationSidebar role={currentUser?.role} activeView="" />
                </SheetContent>
              </Sheet>

              <div>
                <h1 className="text-xl text-foreground capitalize">
                  {currentUser?.role ? currentUser.role.replace(/-/g, "") : ""}{" "}
                  Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <AvatarFallback>
                      {displayName
                        ? displayName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm text-foreground">{displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {currentUser?.email || ""}
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
    </div>
  );
}
