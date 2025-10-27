import React from 'react';
import { Button } from './ui/button';
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
  User
} from 'lucide-react';
import type { UserRole } from '@/types/user';

interface NavigationSidebarProps {
  role: UserRole;
  activeView: string;
  onViewChange: (view: string) => void;
}

export function NavigationSidebar({ role, activeView, onViewChange }: NavigationSidebarProps) {
  const getMenuItems = () => {
    switch (role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'features', label: 'Features', icon: Settings },
          { id: 'books', label: 'Book Management', icon: BookOpen },
          { id: 'equipment', label: 'Equipment Management', icon: Monitor },
          { id: 'attendance', label: 'Attendance Logs', icon: UserCheck },
          { id: 'history', label: 'Borrowing History', icon: History },
          { id: 'overdue', label: 'Overdue Alerts', icon: AlertTriangle },
          { id: 'logs', label: 'Global Logs', icon: Activity },
          { id: 'backup', label: 'Backup & Restore', icon: Database },
          { id: 'account', label: 'Manage My Account', icon: User },
        ];
      case 'librarian':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'books', label: 'Book Management', icon: BookOpen },
          { id: 'equipment', label: 'Equipment Management', icon: Monitor },
          { id: 'scanner', label: 'QR Scanner', icon: QrCode },
          { id: 'attendance', label: 'Attendance Logs', icon: UserCheck },
          { id: 'analytics', label: 'Top Visitors', icon: BarChart3 },
          { id: 'overdue', label: 'Overdue Alerts', icon: AlertTriangle },
          { id: 'history', label: 'Borrowing History', icon: History },
          { id: 'backup', label: 'Backup & Restore', icon: Database },
          { id: 'account', label: 'Manage My Account', icon: User },
        ];
      case 'student':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'catalog', label: 'Book Catalog', icon: BookOpen },
          { id: 'equipment', label: 'Equipment Catalog', icon: Monitor },
          { id: 'cart', label: 'My Cart', icon: ShoppingCart },
          { id: 'qr-ticket', label: 'QR Borrow Ticket', icon: QrCode },
          { id: 'attendance', label: 'My Attendance', icon: UserCheck },
          { id: 'history', label: 'My Borrowing History', icon: History },
          { id: 'account', label: 'Manage My Account', icon: User },
        ];
      case 'scanner':
        return [
          { id: 'scanner', label: 'Attendance Scanner', icon: QrCode },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <nav className="p-4 space-y-2 flex flex-col h-full">
      <div className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeView === item.id ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => onViewChange(item.id)}
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