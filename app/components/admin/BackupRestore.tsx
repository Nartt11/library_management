import React, { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Database,
  Search,
  RotateCcw,
  Trash2,
  Filter,
  Users,
  BookOpen,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import type { UserRole, User } from "../../page";
import { PasswordConfirmation } from "../PasswordConfirmation";

interface DeletedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
  joinDate: string;
  lastActive: string;
  deletedDate: string;
  deletedBy: string;
}

interface DeletedBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: "available" | "borrowed" | "overdue";
  location: string;
  description: string;
  copies: number;
  availableCopies: number;
  deletedDate: string;
  deletedBy: string;
}

export interface BackupRestoreData {
  deletedUsers: DeletedUser[];
  deletedBooks: DeletedBook[];
  deletedEquipment: any[];
}

interface BackupRestoreProps {
  backupData: BackupRestoreData;
  onRestoreUser: (user: DeletedUser) => void;
  onRestoreBook: (book: DeletedBook) => void;
  onPermanentDeleteUser: (userId: string) => void;
  onPermanentDeleteBook: (bookId: string) => void;
  currentUser?: User;
}

export function BackupRestore({
  backupData,
  onRestoreUser,
  onRestoreBook,
  onRestoreEquipment,
  onPermanentDeleteUser,
  onPermanentDeleteBook,
  currentUser,
}: BackupRestoreProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [bookCategoryFilter, setBookCategoryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("users");
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [pendingAction, setPendingAction] = useState<{
    action: () => void;
    title: string;
    description: string;
  } | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    isOpen: boolean;
    type: "restore" | "delete";
    action: () => void;
    message: string;
  }>({
    isOpen: false,
    type: "restore",
    action: () => {},
    message: "",
  });

  const filteredUsers = backupData.deletedUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      userRoleFilter === "all" || user.role === userRoleFilter;

    return matchesSearch && matchesRole;
  });

  const bookCategories = [
    "all",
    ...Array.from(
      new Set(backupData.deletedBooks.map((book) => book.category))
    ),
  ];

  const filteredBooks = backupData.deletedBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);
    const matchesCategory =
      bookCategoryFilter === "all" || book.category === bookCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const confirmRestoreUser = (user: DeletedUser) => {
    setPendingAction({
      action: () => handleRestoreUser(user),
      title: "Restore User",
      description: `You are about to restore ${user.name} back to the active system. This will give them access to the library system again.`,
    });
    setShowPasswordConfirmation(true);
  };

  const confirmRestoreBook = (book: DeletedBook) => {
    setPendingAction({
      action: () => handleRestoreBook(book),
      title: "Restore Book",
      description: `You are about to restore "${book.title}" back to the active library catalog. This will make it available for borrowing again.`,
    });
    setShowPasswordConfirmation(true);
  };

  const confirmPermanentDeleteUser = (userId: string, userName: string) => {
    setPendingAction({
      action: () => handlePermanentDeleteUser(userId, userName),
      title: "Permanently Delete User",
      description: `You are about to permanently delete ${userName} from the system. This action cannot be undone and will completely remove all user data.`,
    });
    setShowPasswordConfirmation(true);
  };

  const confirmPermanentDeleteBook = (bookId: string, bookTitle: string) => {
    setPendingAction({
      action: () => handlePermanentDeleteBook(bookId, bookTitle),
      title: "Permanently Delete Book",
      description: `You are about to permanently delete "${bookTitle}" from the system. This action cannot be undone and will completely remove the book from all records.`,
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

  const handleRestoreUser = (user: DeletedUser) => {
    onRestoreUser(user);
    toast.success(`${user.name} restored successfully!`);
  };

  const handleRestoreBook = (book: DeletedBook) => {
    onRestoreBook(book);
    toast.success(`"${book.title}" restored successfully!`);
  };

  const handlePermanentDeleteUser = (userId: string, userName: string) => {
    onPermanentDeleteUser(userId);
    toast.success(`${userName} permanently deleted!`);
  };

  const handlePermanentDeleteBook = (bookId: string, bookTitle: string) => {
    onPermanentDeleteBook(bookId);
    toast.success(`"${bookTitle}" permanently deleted!`);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "default";
      case "borrowed":
        return "secondary";
      case "overdue":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2 flex items-center gap-2">
          <Database className="h-6 w-6" />
          Backup & Restore
        </h1>
        <p className="text-muted-foreground">
          Manage deleted users and books. Items can be restored or permanently
          deleted.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Deleted Users ({backupData.deletedUsers.length})
          </TabsTrigger>
          <TabsTrigger value="books" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Deleted Books ({backupData.deletedBooks.length})
          </TabsTrigger>
        </TabsList>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={
                    activeTab === "users"
                      ? "Search by name or email..."
                      : "Search by title, author, or ISBN..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {activeTab === "users" ? (
                <Select
                  value={userRoleFilter}
                  onValueChange={setUserRoleFilter}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="librarian">Librarians</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Select
                  value={bookCategoryFilter}
                  onValueChange={setBookCategoryFilter}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {bookCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deleted Users ({filteredUsers.length})</CardTitle>
              <CardDescription>
                Users that have been deleted can be restored or permanently
                removed.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4 text-sm">User</th>
                        <th className="p-4 text-sm">Role</th>
                        <th className="p-4 text-sm">Status</th>
                        <th className="p-4 text-sm">Deleted Date</th>
                        <th className="p-4 text-sm">Deleted By</th>
                        <th className="p-4 text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-4">
                            <div>
                              <p className="line-clamp-1">{user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={getRoleColor(user.role)}>
                              {user.role.replace("-", " ")}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={
                                user.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-3 w-3" />
                              {new Date(user.deletedDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-4 text-sm">{user.deletedBy}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => confirmRestoreUser(user)}
                                className="gap-1"
                              >
                                <RotateCcw className="h-3 w-3" />
                                Restore
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  confirmPermanentDeleteUser(user.id, user.name)
                                }
                                className="gap-1 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No deleted users found.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="books" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deleted Books ({filteredBooks.length})</CardTitle>
              <CardDescription>
                Books that have been deleted can be restored or permanently
                removed.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filteredBooks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4 text-sm">Book Details</th>
                        <th className="p-4 text-sm">Category</th>
                        <th className="p-4 text-sm">Status</th>
                        <th className="p-4 text-sm">Copies</th>
                        <th className="p-4 text-sm">Deleted Date</th>
                        <th className="p-4 text-sm">Deleted By</th>
                        <th className="p-4 text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBooks.map((book) => (
                        <tr
                          key={book.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-4">
                            <div>
                              <p className="line-clamp-1">{book.title}</p>
                              <p className="text-sm text-muted-foreground">
                                by {book.author}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ISBN: {book.isbn}
                              </p>
                            </div>
                          </td>
                          <td className="p-4 text-sm">{book.category}</td>
                          <td className="p-4">
                            <Badge variant={getStatusColor(book.status)}>
                              {book.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              <span>{book.copies}</span>
                              <p className="text-xs text-muted-foreground">
                                total
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-3 w-3" />
                              {new Date(book.deletedDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-4 text-sm">{book.deletedBy}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => confirmRestoreBook(book)}
                                className="gap-1"
                              >
                                <RotateCcw className="h-3 w-3" />
                                Restore
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  confirmPermanentDeleteBook(
                                    book.id,
                                    book.title
                                  )
                                }
                                className="gap-1 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No deleted books found.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmAction.isOpen}
        onOpenChange={(open) =>
          setConfirmAction({ ...confirmAction, isOpen: open })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              {confirmAction.type === "restore"
                ? "Confirm Restore"
                : "Confirm Permanent Deletion"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() =>
                setConfirmAction({
                  isOpen: false,
                  type: "restore",
                  action: () => {},
                  message: "",
                })
              }
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction.action}
              className={
                confirmAction.type === "delete"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-orange-600 hover:bg-orange-700"
              }
            >
              {confirmAction.type === "restore"
                ? "Yes, Restore"
                : "Yes, Delete Permanently"}
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
        actionName="Confirm Action"
        currentUser={currentUser}
      />
    </div>
  );
}
