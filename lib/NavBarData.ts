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

// Admin Navigation
export const AdminNavBarData = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    link: "/admin/dashboard",
  },
  {
    id: "users",
    label: "User Management",
    icon: Users,
    link: "/admin/users",
  },
  {
    id: "books",
    label: "Book Management",
    icon: BookOpen,
    link: "/admin/books",
  },
  {
    id: "authors",
    label: "Author Management",
    icon: UserPen,
    link: "/admin/authors",
  },
  {
    id: "categories",
    label: "Category Management",
    icon: FolderTree,
    link: "/admin/categories",
  },
  {
    id: "publishers",
    label: "Publisher Management",
    icon: Building2,
    link: "/admin/publishers",
  },
  {
    id: "inventory",
    label: "Book Inventory",
    icon: Package,
    link: "/admin/inventory",
  },
  {
    id: "requests",
    label: "Borrow Requests",
    icon: QrCode,
    link: "/staff/requests",
  },
  {
    id: "Returns",
    label: "Return book copies",
    icon: AlertTriangle,
    link: "/staff/return",
  },

  {
    id: "account",
    label: "Manage My Account",
    icon: User,
    link: "/admin/account",
  },
];

// Student Navigation
export const StudentNavBarData = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    link: "/student/dashboard",
  },
  {
    id: "catalog",
    label: "Book Catalog",
    icon: BookOpen,
    link: "/student/books",
  },
  {
    id: "cart",
    label: "My Cart",
    icon: ShoppingCart,
    link: "/student/cart",
  },
  {
    id: "history",
    label: "My Borrowing History",
    icon: History,
    link: "/student/borrow",
  },
  {
    id: "account",
    label: "Manage My Account",
    icon: User,
    link: "/student/account",
  },
];

export const StaffNavBarData = [
  {
    id: "inventory",
    label: "Book Inventory",
    icon: Package,
    link: "/staff/inventory",
  },
  {
    id: "requests",
    label: "Borrow Requests",
    icon: QrCode,
    link: "/staff/requests",
  },
  {
    id: "Returns",
    label: "Return book copies",
    icon: AlertTriangle,
    link: "/staff/return",
  },
  {
    id: "account",
    label: "Manage My Account",
    icon: User,
    link: "/staff/account",
  },
];
