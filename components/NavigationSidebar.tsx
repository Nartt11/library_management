import React, { use } from "react";
import { Button } from "./ui/button";
import {
  Home,
  Users,
  BookOpen,
  Activity,
  QrCode,
  ShoppingCart,
  History,
  UserCheck,
  BarChart3,
  AlertTriangle,
  Database,
  Monitor,
  Settings,
  UserPen,
  FolderTree,
  Building2,
  Package,
  User,
} from "lucide-react";
import type { UserRole } from "@/types/user";
import { usePathname, useRouter } from "next/navigation";
import { link } from "fs";
import { LibrarianNavBarData } from "@/lib/NavBarData";

interface NavigationSidebarProps {
  role: UserRole | undefined;
  activeView: string;
  // onViewChange: (view: string) => void;
}

export function NavigationSidebar({
  role,
  activeView,
}: // onViewChange,
NavigationSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const getMenuItems = () => {
    switch (role) {
      // case "admin":
      //   return [
      //     { id: "dashboard", label: "Dashboard", icon: Home },
      //     { id: "users", label: "User Management", icon: Users },
      //     { id: "features", label: "Features", icon: Settings },
      //     { id: "books", label: "Book Management", icon: BookOpen },
      //     { id: "equipment", label: "Equipment Management", icon: Monitor },
      //     { id: "attendance", label: "Attendance Logs", icon: UserCheck },
      //     { id: "history", label: "Borrowing History", icon: History },
      //     { id: "overdue", label: "Overdue Alerts", icon: AlertTriangle },
      //     { id: "logs", label: "Global Logs", icon: Activity },
      //     { id: "backup", label: "Backup & Restore", icon: Database },
      //     { id: "account", label: "Manage My Account", icon: User },
      //   ];
      case "librarian":
        return LibrarianNavBarData;
      // case "student":
      //   return [
      //     { id: "dashboard", label: "Dashboard", icon: Home },
      //     { id: "catalog", label: "Book Catalog", icon: BookOpen },
      //     { id: "equipment", label: "Equipment Catalog", icon: Monitor },
      //     { id: "cart", label: "My Cart", icon: ShoppingCart },
      //     { id: "qr-ticket", label: "QR Borrow Ticket", icon: QrCode },
      //     { id: "attendance", label: "My Attendance", icon: UserCheck },
      //     { id: "history", label: "My Borrowing History", icon: History },
      //     { id: "account", label: "Manage My Account", icon: User },
      //   ];
      // case "scanner":
      //   return [{ id: "scanner", label: "Attendance Scanner", icon: QrCode }];
      default:
        return [
          { id: "dashboard", label: "Dashboard", icon: Home },
          { id: "catalog", label: "Book Catalog", icon: BookOpen },
          { id: "equipment", label: "Equipment Catalog", icon: Monitor },
          { id: "cart", label: "My Cart", icon: ShoppingCart },
          { id: "qr-ticket", label: "QR Borrow Ticket", icon: QrCode },
          { id: "attendance", label: "My Attendance", icon: UserCheck },
          { id: "history", label: "My Borrowing History", icon: History },
          { id: "account", label: "Manage My Account", icon: User },
        ];
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
