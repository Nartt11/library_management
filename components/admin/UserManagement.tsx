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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import {
  Users,
  Search,
  Plus,
  Trash2,
  Upload,
  Shield,
  BookOpen,
  Calendar,
  Clock,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { PasswordConfirmation } from "../PasswordConfirmation";
import type { UserRole } from "../../page";

interface UserPermissions {
  archives: string[];
  inventory: string[];
  borrowingSystem: string[];
  userManagement: string[];
  reports: string[];
  systemSettings: string[];
}

interface BorrowRecord {
  id: string;
  bookTitle: string;
  author: string;
  isbn: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: "returned" | "active" | "overdue";
  staffName: string;
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

interface UserManagementProps {
  onDeleteUser?: (user: UserData) => void;
}

export function UserManagement({ onDeleteUser }: UserManagementProps) {
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
    userManagement: [
      { id: "view_users", name: "View users" },
      { id: "add_users", name: "Add users" },
      { id: "edit_users", name: "Edit users" },
      { id: "delete_users", name: "Delete users" },
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
        userManagement: [],
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
        userManagement: ["view_users"],
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
        userManagement: [
          "view_users",
          "add_users",
          "edit_users",
          "delete_users",
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkImportDialogOpen, setIsBulkImportDialogOpen] = useState(false);
  const [isBorrowingHistoryOpen, setIsBorrowingHistoryOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<UserData | null>(null);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "add" | "edit" | "delete" | "import";
    action: () => void;
    title: string;
    description: string;
  } | null>(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "student" as UserRole,
    newPassword: "",
  });

  const [userPermissions, setUserPermissions] = useState<UserPermissions>({
    archives: [],
    inventory: [],
    borrowingSystem: [],
    userManagement: [],
    reports: [],
    systemSettings: [],
  });

  // Mock borrowing history data
  const borrowingHistory: Record<string, BorrowRecord[]> = {
    "1": [
      // Alex Johnson
      {
        id: "br-1",
        bookTitle: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        isbn: "9780262033848",
        borrowDate: "2025-07-15",
        dueDate: "2025-07-29",
        returnDate: "2025-07-28",
        status: "returned",
        staffName: "Sarah Chen",
      },
      {
        id: "br-2",
        bookTitle: "Clean Code: A Handbook of Agile Software Craftsmanship",
        author: "Robert C. Martin",
        isbn: "9780132350884",
        borrowDate: "2025-08-01",
        dueDate: "2025-08-15",
        status: "active",
        staffName: "Sarah Chen",
      },
      {
        id: "br-3",
        bookTitle:
          "Design Patterns: Elements of Reusable Object-Oriented Software",
        author: "Gang of Four",
        isbn: "9780201633610",
        borrowDate: "2025-07-20",
        dueDate: "2025-08-03",
        status: "overdue",
        staffName: "Dr. Maria Santos",
      },
      {
        id: "br-4",
        bookTitle: "The Pragmatic Programmer",
        author: "David Thomas, Andrew Hunt",
        isbn: "9780201616224",
        borrowDate: "2025-06-10",
        dueDate: "2025-06-24",
        returnDate: "2025-06-23",
        status: "returned",
        staffName: "Sarah Chen",
      },
    ],
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const requirePasswordConfirmation = (
    actionType: "add" | "edit" | "delete" | "import",
    action: () => void,
    title: string,
    description: string
  ) => {
    setPendingAction({ type: actionType, action, title, description });
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

  const confirmAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    requirePasswordConfirmation(
      "add",
      addUser,
      "Add New User",
      `You are about to add ${newUser.name} as a ${newUser.role}. This will grant them access to the library system with the selected permissions.`
    );
  };

  const addUser = () => {
    const user: UserData = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "active" as const,
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString().split("T")[0],
      permissions: userPermissions,
    };

    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "student", newPassword: "" });
    setUserPermissions({
      archives: [],
      inventory: [],
      borrowingSystem: [],
      userManagement: [],
      reports: [],
      systemSettings: [],
    });
    setIsAddDialogOpen(false);
    toast.success("User added successfully!");
  };

  const confirmDeleteUser = (userId: string, userName: string) => {
    requirePasswordConfirmation(
      "delete",
      () => deleteUser(userId, userName),
      "Delete User",
      `You are about to permanently delete ${userName} from the system. This action will move the user to backup storage and cannot be undone.`
    );
  };

  const deleteUser = (userId: string, userName: string) => {
    const userToDelete = users.find((user) => user.id === userId);
    if (userToDelete && onDeleteUser) {
      onDeleteUser(userToDelete);
    }
    setUsers(users.filter((user) => user.id !== userId));
    toast.success(`${userName} moved to backup!`);
  };

  const updateUserStatus = (
    userId: string,
    newStatus: "active" | "disabled",
    userName: string
  ) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    toast.success(`${userName} status updated to ${newStatus}!`);
  };

  const confirmBulkImport = () => {
    requirePasswordConfirmation(
      "import",
      bulkImportUsers,
      "Bulk Import Users",
      "You are about to import multiple users at once. This will add 3 sample student accounts to the system with default permissions."
    );
  };

  const bulkImportUsers = () => {
    const sampleUsers = [
      {
        name: "John Smith",
        email: "john.smith@student.university.edu",
        role: "student" as UserRole,
      },
      {
        name: "Jane Doe",
        email: "jane.doe@student.university.edu",
        role: "student" as UserRole,
      },
      {
        name: "Mike Johnson",
        email: "mike.johnson@student.university.edu",
        role: "student" as UserRole,
      },
    ];

    const newUsers: UserData[] = sampleUsers.map((user) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...user,
      status: "active" as const,
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString().split("T")[0],
    }));

    setUsers([...users, ...newUsers]);
    setIsBulkImportDialogOpen(false);
    toast.success(`${newUsers.length} users imported successfully!`);
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
      case "userManagement":
        return "User Management";
      case "reports":
        return "Reports";
      case "systemSettings":
        return "System Settings";
      default:
        return category;
    }
  };

  const handleStudentClick = (user: UserData) => {
    if (user.role === "student") {
      setSelectedStudent(user);
      setIsBorrowingHistoryOpen(true);
    }
  };

  const getStudentBorrowingHistory = (studentId: string) => {
    return borrowingHistory[studentId] || [];
  };

  const getBorrowingStats = (studentId: string) => {
    const records = getStudentBorrowingHistory(studentId);
    const returned = records.filter((r) => r.status === "returned").length;
    const active = records.filter((r) => r.status === "active").length;
    const overdue = records.filter((r) => r.status === "overdue").length;

    return { returned, active, overdue, total: records.length };
  };

  const getStatusBadgeVariant = (status: BorrowRecord["status"]) => {
    switch (status) {
      case "returned":
        return "default";
      case "active":
        return "secondary";
      case "overdue":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "default";
      case "librarian":
        return "secondary";
      case "student":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2 flex items-center gap-2">
            <Users className="h-6 w-6" />
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage students, librarians, and system access.
          </p>
        </div>

        <div className="flex gap-2">
          <Dialog
            open={isBulkImportDialogOpen}
            onOpenChange={setIsBulkImportDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Bulk Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Bulk Import Users</DialogTitle>
                <DialogDescription>
                  Import multiple users from a CSV file or use sample data.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drop CSV file here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expected format: Name, Email, Role
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Or use sample data
                  </p>
                  <Button
                    onClick={confirmBulkImport}
                    variant="outline"
                    size="sm"
                  >
                    Import 3 Sample Users
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsBulkImportDialogOpen(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[85vw] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New User
                </DialogTitle>
                <DialogDescription>
                  Create a new user account with specific permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        placeholder="user@university.edu"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value) =>
                        setNewUser({ ...newUser, role: value as UserRole })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="librarian">Librarian</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <h3 className="text-lg font-medium">Permissions</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select the functions this user should have access to.
                    Checking a function grants full access to that feature.
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(permissionCategories).map(
                      ([categoryKey, permissions]) => (
                        <div
                          key={categoryKey}
                          className="border rounded-md p-3 bg-orange-50/50"
                        >
                          <h4 className="font-medium mb-2 text-orange-700 text-sm border-b border-orange-200 pb-1">
                            {getCategoryDisplayName(categoryKey)}
                          </h4>
                          <div className="space-y-1.5">
                            {permissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`add-${permission.id}`}
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
                                  className="h-3 w-3"
                                />
                                <Label
                                  htmlFor={`add-${permission.id}`}
                                  className="text-xs cursor-pointer"
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

                <div className="flex gap-2 pt-4">
                  <Button onClick={confirmAddUser} className="flex-1">
                    Add User
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setNewUser({
                        name: "",
                        email: "",
                        role: "student",
                        newPassword: "",
                      });
                      setUserPermissions({
                        archives: [],
                        inventory: [],
                        borrowingSystem: [],
                        userManagement: [],
                        reports: [],
                        systemSettings: [],
                      });
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Database</CardTitle>
              <CardDescription>
                All registered users in the system
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="librarian">Librarian</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Join Date</th>
                  <th className="text-left p-4 font-medium">Last Active</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td
                      className={`p-4 ${
                        user.role === "student"
                          ? "cursor-pointer hover:bg-orange-50/50"
                          : ""
                      }`}
                      onClick={() => handleStudentClick(user)}
                    >
                      <div>
                        <p className="line-clamp-1 flex items-center gap-2">
                          {user.name}
                          {user.role === "student" && (
                            <BookOpen className="h-4 w-4 text-orange-600" />
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                        {user.role === "student" &&
                          getBorrowingStats(user.id).total > 0 && (
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {getBorrowingStats(user.id).active} active
                              </Badge>
                              {getBorrowingStats(user.id).overdue > 0 && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  {getBorrowingStats(user.id).overdue} overdue
                                </Badge>
                              )}
                            </div>
                          )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={getRoleColor(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "destructive"
                        }
                      >
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm">
                      {new Date(user.lastActive).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Select
                          value={user.status}
                          onValueChange={(value: "active" | "disabled") =>
                            updateUserStatus(user.id, value, user.name)
                          }
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => confirmDeleteUser(user.id, user.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              No users found matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Borrowing History Dialog */}
      <Dialog
        open={isBorrowingHistoryOpen}
        onOpenChange={setIsBorrowingHistoryOpen}
      >
        <DialogContent className="fixed inset-4 p-0 max-w-none w-auto h-auto flex flex-col">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-orange-600" />
              Borrowing History
            </DialogTitle>
            <DialogDescription>
              Complete borrowing record for {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 p-6 overflow-auto">
            {selectedStudent && (
              <>
                {/* Summary Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {(() => {
                    const stats = getBorrowingStats(selectedStudent.id);
                    return (
                      <>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {stats.returned}
                          </div>
                          <div className="text-sm text-green-700">
                            Books Returned
                          </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {stats.active}
                          </div>
                          <div className="text-sm text-blue-700">
                            Currently Borrowed
                          </div>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {stats.overdue}
                          </div>
                          <div className="text-sm text-red-700">
                            Overdue Items
                          </div>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {stats.total}
                          </div>
                          <div className="text-sm text-orange-700">
                            Total Books
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Detailed History */}
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Detailed Borrowing History
                  </h3>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-orange-50">
                        <tr>
                          <th className="text-left p-4 font-medium text-orange-900 border-b border-orange-200 w-[40%]">
                            Book Details
                          </th>
                          <th className="text-left p-4 font-medium text-orange-900 border-b border-orange-200 w-[12%]">
                            Borrow Date
                          </th>
                          <th className="text-left p-4 font-medium text-orange-900 border-b border-orange-200 w-[12%]">
                            Due Date
                          </th>
                          <th className="text-left p-4 font-medium text-orange-900 border-b border-orange-200 w-[12%]">
                            Return Date
                          </th>
                          <th className="text-left p-4 font-medium text-orange-900 border-b border-orange-200 w-[10%]">
                            Status
                          </th>
                          <th className="text-left p-4 font-medium text-orange-900 border-b border-orange-200 w-[14%]">
                            Staff Member
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getStudentBorrowingHistory(selectedStudent.id).map(
                          (record) => (
                            <tr
                              key={record.id}
                              className="border-b hover:bg-muted/50"
                            >
                              <td className="p-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {record.bookTitle}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    by {record.author}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    ISBN: {record.isbn}
                                  </p>
                                </div>
                              </td>
                              <td className="p-4 text-sm">
                                {new Date(
                                  record.borrowDate
                                ).toLocaleDateString()}
                              </td>
                              <td className="p-4 text-sm">
                                {new Date(record.dueDate).toLocaleDateString()}
                              </td>
                              <td className="p-4 text-sm">
                                {record.returnDate
                                  ? new Date(
                                      record.returnDate
                                    ).toLocaleDateString()
                                  : "Not returned"}
                              </td>
                              <td className="p-4">
                                <Badge
                                  variant={getStatusBadgeVariant(record.status)}
                                >
                                  {record.status === "returned"
                                    ? "Returned"
                                    : record.status === "active"
                                    ? "Active"
                                    : "Overdue"}
                                </Badge>
                              </td>
                              <td className="p-4 text-sm">
                                {record.staffName}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="p-6 border-t bg-muted/25">
            <div className="flex justify-end">
              <Button
                onClick={() => setIsBorrowingHistoryOpen(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Confirmation Dialog */}
      {showPasswordConfirmation && pendingAction && (
        <PasswordConfirmation
          isOpen={showPasswordConfirmation}
          onClose={handlePasswordCancelled}
          title={pendingAction.title}
          description={pendingAction.description}
          onConfirm={handlePasswordConfirmed}
        />
      )}
    </div>
  );
}
