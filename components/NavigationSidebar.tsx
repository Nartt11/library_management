import React from "react";
import { Button } from "./ui/button";
import type { UserRole } from "@/types/user";
import { usePathname, useRouter } from "next/navigation";
import {
  AdminNavBarData,
  StudentNavBarData,
} from "@/lib/NavBarData";

interface NavigationSidebarProps {
  role: UserRole | undefined;
  activeView: string;
}

export function NavigationSidebar({
  role,
  activeView,
}: NavigationSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const getMenuItems = () => {
    switch (role) {
      case "admin":
        return AdminNavBarData;
      case "student":
        return StudentNavBarData;
      default:
        return StudentNavBarData; // Default to student view
    }
  };

  const menuItems = getMenuItems();

  return (
    <nav className="p-4 space-y-2 flex flex-col h-full">
      <div className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.link;
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => {
                router.push(item.link || "/dashboard");
              }}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
