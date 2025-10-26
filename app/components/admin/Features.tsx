import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import {
  Settings,
  Search,
  Edit,
  Shield,
  Eye,
  EyeOff,
  Users,
  Star,
  Crown,
  UserCheck,
  CheckCircle2,
  Trash2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import type { UserRole, User } from "../../page";
import { PasswordConfirmation } from "../PasswordConfirmation";

interface UserPermissions {
  archives: string[];
  inventory: string[];
  borrowingSystem: string[];
  reports: string[];
  systemSettings: string[];
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "disabled";
  joinDate: string;
  lastActive: string;
  permissions?: UserPermissions;
}

interface FeaturesProps {
  currentUser?: User;
}

export function Features({ currentUser }: FeaturesProps) {
  const permissionCategories = {
    archives: [
      { id: "view_archives", name: "View archives" },
      { id: "add_archives", name: "Add new archives" },
      { id: "edit_archives", name: "Edit archives" },
      { id: "delete_archives", name: "Delete archives" },
    ],
    inventory: [
      { id: "view_items", name: "View items" },
      { id: "add_items", name: "Add items" },
      { id: "edit_items", name: "Edit items" },
      { id: "delete_items", name: "Delete items" },
    ],
    borrowingSystem: [
      { id: "borrow_item", name: "Borrow item" },
      { id: "return_item", name: "Return item" },
      { id: "view_borrowed_history", name: "View borrowed history" },
    ],
    reports: [
      { id: "generate_report", name: "Generate report" },
      { id: "export_report", name: "Export report" },
    ],
    systemSettings: [
      { id: "update_system_config", name: "Update system configuration" },
      { id: "manage_backup", name: "Manage backup" },
      { id: "restore_data", name: "Restore data" },
    ],
  };

  const [users, setUsers] = useState<UserData[]>([
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.johnson@student.university.edu",
      role: "student",
      status: "active",
      joinDate: "2024-09-01",
      lastActive: "2025-08-01",
      permissions: {
        archives: ["view_archives"],
        inventory: ["view_items"],
        borrowingSystem: ["borrow_item", "view_borrowed_history"],
        reports: [],
        systemSettings: [],
      },
    },
    {
      id: "2",
      name: "Sarah Chen",
      email: "sarah.chen@university.edu",
      role: "librarian",
      status: "active",
      joinDate: "2023-08-15",
      lastActive: "2025-08-01",
      permissions: {
        archives: ["view_archives", "add_archives", "edit_archives"],
        inventory: ["view_items", "add_items", "edit_items"],
        borrowingSystem: [
          "borrow_item",
          "return_item",
          "view_borrowed_history",
        ],
        reports: ["generate_report", "export_report"],
        systemSettings: ["restore_data"],
      },
    },
    {
      id: "3",
      name: "Dr. Maria Santos",
      email: "maria.santos@university.edu",
      role: "admin",
      status: "active",
      joinDate: "2022-01-10",
      lastActive: "2025-07-31",
      permissions: {
        archives: [
          "view_archives",
          "add_archives",
          "edit_archives",
          "delete_archives",
        ],
        inventory: ["view_items", "add_items", "edit_items", "delete_items"],
        borrowingSystem: [
          "borrow_item",
          "return_item",
          "view_borrowed_history",
        ],
        reports: ["generate_report", "export_report"],
        systemSettings: [
          "update_system_config",
          "manage_backup",
          "restore_data",
        ],
      },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [pendingAction, setPendingAction] = useState<{
    action: () => void;
    title: string;
    description: string;
  } | null>(null);

  const [confirmAction, setConfirmAction] = useState<{
    isOpen: boolean;
    type: "edit" | "delete";
    action: () => void;
    message: string;
  }>({
    isOpen: false,
    type: "edit",
    action: () => {},
    message: "",
  });

  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    role: "student" as UserRole,
    newPassword: "",
  });

  const [userPermissions, setUserPermissions] = useState<UserPermissions>({
    archives: [],
    inventory: [],
    borrowingSystem: [],
    reports: [],
    systemSettings: [],
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      role: user.role,
      newPassword: "",
    });
    setUserPermissions(
      user.permissions || {
        archives: [],
        inventory: [],
        borrowingSystem: [],
        reports: [],
        systemSettings: [],
      }
    );
  };

  const confirmUpdateUser = () => {
    if (!editingUser || !editUser.name || !editUser.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updateMessage = editUser.newPassword
      ? `You are about to update ${editUser.name}'s information, permissions, and password. This will affect their access to the system.`
      : `You are about to update ${editUser.name}'s information and permissions. This will affect their access to the system.`;

    setPendingAction({
      action: updateUser,
      title: "Update User Information",
      description: updateMessage,
    });
    setShowPasswordConfirmation(true);
  };

  const handlePasswordConfirmed = () => {
    if (pendingAction) {
      pendingAction.action();
      setPendingAction(null);
    }
    setShowPasswordConfirmation(false);
  };

  const handlePasswordCancelled = () => {
    setPendingAction(null);
    setShowPasswordConfirmation(false);
  };

  const updateUser = () => {
    if (!editingUser) return;

    const updatedUser: UserData = {
      ...editingUser,
      name: editUser.name,
      email: editUser.email,
      role: editUser.role,
      permissions: userPermissions,
    };

    setUsers(
      users.map((user) => (user.id === editingUser.id ? updatedUser : user))
    );
    setEditingUser(null);
    setEditUser({ name: "", email: "", role: "student", newPassword: "" });
    setUserPermissions({
      archives: [],
      inventory: [],
      borrowingSystem: [],
      reports: [],
      systemSettings: [],
    });

    const successMessage = editUser.newPassword
      ? "User information and password updated successfully!"
      : "User updated successfully!";
    toast.success(successMessage);
  };

  const handleDeleteConfirmation = (id: string) => {
    setDeleteTargetId(id);
    const user = users.find((u) => u.id === id);
    const userName = user?.name;

    setConfirmAction({
      isOpen: true,
      type: "delete",
      action: () => setShowPasswordDialog(true),
      message: `Are you sure you want to delete "${userName}"? This action cannot be undone.`,
    });
  };

  const executeDelete = () => {
    if (confirmPassword !== "123") {
      toast.error("Incorrect password. Deletion cancelled.");
      setConfirmPassword("");
      setShowPasswordDialog(false);
      return;
    }

    if (deleteTargetId) {
      setUsers(users.filter((user) => user.id !== deleteTargetId));
      toast.success("User deleted successfully");
    }

    setConfirmPassword("");
    setShowPasswordDialog(false);
    setDeleteTargetId(null);
    setConfirmAction({
      isOpen: false,
      type: "edit",
      action: () => {},
      message: "",
    });
  };

  const handlePermissionChange = (
    category: keyof UserPermissions,
    permissionId: string,
    checked: boolean
  ) => {
    setUserPermissions((prev) => ({
      ...prev,
      [category]: checked
        ? [...prev[category], permissionId]
        : prev[category].filter((id) => id !== permissionId),
    }));
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case "archives":
        return "Archives";
      case "inventory":
        return "Inventory";
      case "borrowingSystem":
        return "Borrowing System";
      case "reports":
        return "Reports";
      case "systemSettings":
        return "System Settings";
      default:
        return category;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-purple-600 to-purple-700 text-white";
      case "librarian":
        return "bg-gradient-to-r from-blue-600 to-blue-700 text-white";
      case "student":
        return "bg-gradient-to-r from-green-600 to-green-700 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin":
        return Crown;
      case "librarian":
        return Star;
      case "student":
        return UserCheck;
      default:
        return Users;
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditUser({ name: "", email: "", role: "student", newPassword: "" });
    setUserPermissions({
      archives: [],
      inventory: [],
      borrowingSystem: [],
      reports: [],
      systemSettings: [],
    });
  };

  const getTotalPermissions = (permissions: UserPermissions) => {
    return Object.values(permissions).flat().length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-8 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Settings className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">User Directory</h1>
                <p className="text-lg text-orange-100">
                  Browse and manage user access permissions
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-orange-100">Total Users</p>
                    <p className="text-2xl font-bold">{users.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-orange-100">Active Users</p>
                    <p className="text-2xl font-bold">
                      {users.filter((u) => u.status === "active").length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-orange-100">Administrators</p>
                    <p className="text-2xl font-bold">
                      {users.filter((u) => u.role === "admin").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            {/* User Accounts List */}
            <Card className="xl:col-span-2 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">User Directory</CardTitle>
                    <CardDescription className="text-orange-100">
                      Browse and select users to modify their access levels
                    </CardDescription>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-3 mt-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-36 bg-white/20 border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="librarian">Librarian</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredUsers.map((user) => {
                    const RoleIcon = getRoleIcon(user.role);
                    const isSelected = editingUser?.id === user.id;

                    return (
                      <div
                        key={user.id}
                        className={`relative group transition-all duration-300 ${
                          isSelected
                            ? "bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 shadow-lg scale-[1.02]"
                            : "bg-white border border-gray-200 hover:border-orange-300 hover:shadow-md hover:scale-[1.01]"
                        } rounded-xl p-5`}
                      >
                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="absolute top-4 right-4">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}

                        <div
                          className="flex items-start gap-4"
                          onClick={() => handleEditUser(user)}
                        >
                          {/* Avatar */}
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${getRoleColor(
                              user.role
                            )} shadow-lg`}
                          >
                            <RoleIcon className="h-6 w-6" />
                          </div>

                          {/* User Info */}
                          <div className="flex-1 min-w-0 cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                              <h3
                                className={`font-semibold ${
                                  isSelected
                                    ? "text-orange-800"
                                    : "text-gray-900"
                                } truncate`}
                              >
                                {user.name}
                              </h3>
                              <Badge
                                variant="outline"
                                className={`text-xs px-2 py-1 ${
                                  user.role === "admin"
                                    ? "border-purple-200 bg-purple-50 text-purple-700"
                                    : user.role === "librarian"
                                    ? "border-blue-200 bg-blue-50 text-blue-700"
                                    : "border-green-200 bg-green-50 text-green-700"
                                }`}
                              >
                                {user.role.charAt(0).toUpperCase() +
                                  user.role.slice(1)}
                              </Badge>
                            </div>

                            <p
                              className={`text-sm ${
                                isSelected ? "text-orange-600" : "text-gray-600"
                              } truncate mb-2`}
                            >
                              {user.email}
                            </p>

                            <div className="flex items-center justify-between">
                              <Badge
                                variant={
                                  user.status === "active"
                                    ? "default"
                                    : "destructive"
                                }
                                className="text-xs"
                              >
                                {user.status === "active"
                                  ? "Active"
                                  : "Disabled"}
                              </Badge>

                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Shield className="h-3 w-3" />
                                {/* <span>{getTotalPermissions(user.permissions || {})} permissions</span> */}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 text-red-600 hover:bg-red-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConfirmation(user.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Edit User Panel */}
            <Card className="xl:col-span-3 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader
                className={`rounded-t-lg ${
                  editingUser
                    ? "bg-gradient-to-r from-green-600 to-teal-500"
                    : "bg-gradient-to-r from-gray-500 to-gray-600"
                } text-white`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Edit className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {editingUser
                        ? `Editing ${editingUser.name}`
                        : "User Editor"}
                    </CardTitle>
                    <CardDescription
                      className={
                        editingUser ? "text-green-100" : "text-gray-300"
                      }
                    >
                      {editingUser
                        ? "Modify user details and configure system permissions"
                        : "Select a user from the directory to begin editing"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                {editingUser ? (
                  <div className="space-y-8">
                    {/* Basic Information Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 pb-4 border-b-2 border-orange-200">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                          1
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-orange-700">
                            Basic Information
                          </h3>
                          <p className="text-sm text-gray-600">
                            Update fundamental user details and credentials
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label className="text-orange-800 font-medium">
                              Full Name *
                            </Label>
                            <Input
                              value={editUser.name}
                              onChange={(e) =>
                                setEditUser({
                                  ...editUser,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Enter full name"
                              className="border-orange-200 focus:border-orange-400 focus:ring-orange-200 bg-white/70"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label className="text-orange-800 font-medium">
                              Email Address *
                            </Label>
                            <Input
                              type="email"
                              value={editUser.email}
                              onChange={(e) =>
                                setEditUser({
                                  ...editUser,
                                  email: e.target.value,
                                })
                              }
                              placeholder="user@university.edu"
                              className="border-orange-200 focus:border-orange-400 focus:ring-orange-200 bg-white/70"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label className="text-orange-800 font-medium">
                              User Role *
                            </Label>
                            <Select
                              value={editUser.role}
                              onValueChange={(value: UserRole) =>
                                setEditUser({ ...editUser, role: value })
                              }
                            >
                              <SelectTrigger className="border-orange-200 focus:border-orange-400 bg-white/70">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">
                                  Administrator
                                </SelectItem>
                                <SelectItem value="librarian">
                                  Librarian
                                </SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-orange-800 font-medium flex items-center gap-2">
                              New Password
                              <span className="text-xs text-orange-600">
                                (Leave blank to keep current)
                              </span>
                            </Label>
                            <div className="relative">
                              <Input
                                type={showNewPassword ? "text" : "password"}
                                value={editUser.newPassword}
                                onChange={(e) =>
                                  setEditUser({
                                    ...editUser,
                                    newPassword: e.target.value,
                                  })
                                }
                                placeholder="Enter new password"
                                className="border-orange-200 focus:border-orange-400 focus:ring-orange-200 bg-white/70 pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-orange-600"
                                onClick={() =>
                                  setShowNewPassword(!showNewPassword)
                                }
                              >
                                {showNewPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-8" />

                    {/* Permissions Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 pb-4 border-b-2 border-green-200">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                          2
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-green-700">
                            System Permissions
                          </h3>
                          <p className="text-sm text-gray-600">
                            Configure what this user can access and modify
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(permissionCategories).map(
                          ([categoryKey, permissions]) => (
                            <div
                              key={categoryKey}
                              className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200"
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                                  <Shield className="h-4 w-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-green-800">
                                  {getCategoryDisplayName(categoryKey)}
                                </h4>
                              </div>

                              <div className="space-y-3">
                                {permissions.map((permission) => (
                                  <div
                                    key={permission.id}
                                    className="flex items-center space-x-3"
                                  >
                                    <Checkbox
                                      id={`edit-${permission.id}`}
                                      checked={userPermissions[
                                        categoryKey as keyof UserPermissions
                                      ].includes(permission.id)}
                                      onCheckedChange={(checked) =>
                                        handlePermissionChange(
                                          categoryKey as keyof UserPermissions,
                                          permission.id,
                                          checked as boolean
                                        )
                                      }
                                      className="border-green-300 text-green-600 focus:ring-green-200"
                                    />
                                    <Label
                                      htmlFor={`edit-${permission.id}`}
                                      className="text-sm text-green-800 cursor-pointer leading-relaxed"
                                    >
                                      {permission.name}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                      <Button
                        onClick={confirmUpdateUser}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Update User
                      </Button>
                      <Button
                        onClick={cancelEdit}
                        variant="outline"
                        className="flex-1 border-gray-300 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full flex items-center justify-center mb-6">
                      <Users className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Select a User to Edit
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      Choose a user from the directory on the left to view and
                      modify their information, role, and system permissions.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmAction.isOpen}
        onOpenChange={(open) =>
          setConfirmAction({ ...confirmAction, isOpen: open })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() =>
                setConfirmAction({
                  isOpen: false,
                  type: "edit",
                  action: () => {},
                  message: "",
                })
              }
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction.action}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Confirmation Dialog */}
      <AlertDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-600" />
              Admin Password Required
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please enter the admin password to confirm this deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  executeDelete();
                }
              }}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowPasswordDialog(false);
                setConfirmPassword("");
                setConfirmAction({
                  isOpen: false,
                  type: "edit",
                  action: () => {},
                  message: "",
                });
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Confirmation Dialog */}
      <PasswordConfirmation
        isOpen={showPasswordConfirmation}
        onClose={handlePasswordCancelled}
        onConfirm={handlePasswordConfirmed}
        title={pendingAction?.title || ""}
        description={pendingAction?.description || ""}
        actionName="Confirm Update"
        currentUser={currentUser}
      />
    </div>
  );
}
