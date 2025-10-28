import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { DemoHelper } from "./DemoHelper";
import { DemoBanner } from "./DemoBanner";
import { DashboardFooter } from "./DashboardFooter";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { User } from "../types/user";
import uitLogo from "../../public/UITLogo.jpg";
import uccLogo from "./../public/globe.svg";

interface DashboardLayoutProps {
  user: User;
  children: React.ReactNode;
  sidebar: React.ReactNode;
  onLogout: () => void;
}

export function DashboardLayout({
  user,
  children,
  sidebar,
  onLogout,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src={uccLogo}
              alt="University of Caloocan City Logo"
              className="h-8 w-8 object-contain"
            />
            <div>
              <h2 className="text-sm text-sidebar-foreground">
                Library System
              </h2>
            </div>
          </div>
        </div>
        {sidebar}
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
                      <ImageWithFallback
                        src={uccLogo}
                        alt="University of Caloocan City Logo"
                        className="h-8 w-8 object-contain"
                      />
                      <div>
                        <h2 className="text-sm">Library System</h2>
                      </div>
                    </div>
                  </div>
                  {sidebar}
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
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <Button variant="ghost" size="icon" onClick={onLogout}>
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
      <DemoHelper userRole={user.role} />
    </div>
  );
}
