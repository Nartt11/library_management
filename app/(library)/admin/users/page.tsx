import React from "react";

export default function LibrarianUserManagement() {
  return <div>LibrarianUserManagement</div>;
}

// "use client";
// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../../components/ui/card";
// import { Button } from "../../../components/ui/button";
// import { Input } from "../../../components/ui/input";
// import { Badge } from "../../../components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../../components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../../../components/ui/dialog";
// import {
//   Users,
//   Search,
//   Edit,
//   Filter,
//   Eye,
//   EyeOff,
//   BookOpen,
//   Calendar,
//   Clock,
//   User as UserIcon,
// } from "lucide-react";
// import { toast } from "sonner";
// import type { UserRole, User } from "../../../types/user";
// import { Label } from "@/components/ui/label";
// import { PasswordConfirmation } from "@/components/PasswordConfirmation";

// interface BorrowRecord {
//   id: string;
//   bookTitle: string;
//   author: string;
//   isbn: string;
//   borrowDate: string;
//   dueDate: string;
//   returnDate?: string;
//   status: "returned" | "active" | "overdue";
//   staffName: string;
// }

// interface UserData {
//   id: string;
//   name: string;
//   email: string;
//   role: UserRole;
//   status: "active" | "disabled";
//   joinDate: string;
//   lastActive: string;
// }

// interface LibrarianUserManagementProps {
//   currentUser?: User;
// }

// export default function LibrarianUserManagement({
//   currentUser,
// }: LibrarianUserManagementProps) {
//   const [users, setUsers] = useState<UserData[]>([
//     {
//       id: "1",
//       name: "Alex Johnson",
//       email: "alex.johnson@student.university.edu",
//       role: "student",
//       status: "active",
//       joinDate: "2024-09-01",
//       lastActive: "2025-08-01",
//     },
//     {
//       id: "2",
//       name: "Sarah Chen",
//       email: "sarah.chen@university.edu",
//       role: "librarian",
//       status: "active",
//       joinDate: "2023-08-15",
//       lastActive: "2025-08-01",
//     },
//     {
//       id: "3",
//       name: "Dr. Maria Santos",
//       email: "maria.santos@university.edu",
//       role: "admin",
//       status: "active",
//       joinDate: "2022-01-10",
//       lastActive: "2025-07-31",
//     },
//     {
//       id: "4",
//       name: "Mike Davis",
//       email: "mike.davis@student.university.edu",
//       role: "student",
//       status: "active",
//       joinDate: "2024-08-20",
//       lastActive: "2025-07-30",
//     },
//     {
//       id: "5",
//       name: "Emma Wilson",
//       email: "emma.wilson@student.university.edu",
//       role: "student",
//       status: "disabled",
//       joinDate: "2024-07-15",
//       lastActive: "2025-07-25",
//     },
//   ]);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState<UserData | null>(null);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [isBorrowingHistoryOpen, setIsBorrowingHistoryOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState<UserData | null>(null);
//   const [showPasswordConfirmation, setShowPasswordConfirmation] =
//     useState(false);
//   const [pendingAction, setPendingAction] = useState<{
//     action: () => void;
//     title: string;
//     description: string;
//   } | null>(null);

//   const [newUser, setNewUser] = useState({
//     name: "",
//     email: "",
//     role: "student" as UserRole,
//     newPassword: "",
//   });

//   // Mock borrowing history data
//   const borrowingHistory: Record<string, BorrowRecord[]> = {
//     "1": [
//       // Alex Johnson
//       {
//         id: "br-1",
//         bookTitle: "Introduction to Algorithms",
//         author: "Thomas H. Cormen",
//         isbn: "9780262033848",
//         borrowDate: "2025-07-15",
//         dueDate: "2025-07-29",
//         returnDate: "2025-07-28",
//         status: "returned",
//         staffName: "Sarah Chen",
//       },
//       {
//         id: "br-2",
//         bookTitle: "Clean Code: A Handbook of Agile Software Craftsmanship",
//         author: "Robert C. Martin",
//         isbn: "9780132350884",
//         borrowDate: "2025-08-01",
//         dueDate: "2025-08-15",
//         status: "active",
//         staffName: "Sarah Chen",
//       },
//       {
//         id: "br-3",
//         bookTitle:
//           "Design Patterns: Elements of Reusable Object-Oriented Software",
//         author: "Gang of Four",
//         isbn: "9780201633610",
//         borrowDate: "2025-07-20",
//         dueDate: "2025-08-03",
//         status: "overdue",
//         staffName: "Dr. Maria Santos",
//       },
//       {
//         id: "br-4",
//         bookTitle: "The Pragmatic Programmer",
//         author: "David Thomas, Andrew Hunt",
//         isbn: "9780201616224",
//         borrowDate: "2025-06-10",
//         dueDate: "2025-06-24",
//         returnDate: "2025-06-23",
//         status: "returned",
//         staffName: "Sarah Chen",
//       },
//     ],
//     "4": [
//       // Mike Davis
//       {
//         id: "br-5",
//         bookTitle: "JavaScript: The Good Parts",
//         author: "Douglas Crockford",
//         isbn: "9780596517748",
//         borrowDate: "2025-07-25",
//         dueDate: "2025-08-08",
//         returnDate: "2025-08-07",
//         status: "returned",
//         staffName: "Sarah Chen",
//       },
//       {
//         id: "br-6",
//         bookTitle:
//           "Python Crash Course: A Hands-On, Project-Based Introduction",
//         author: "Eric Matthes",
//         isbn: "9781593279288",
//         borrowDate: "2025-08-05",
//         dueDate: "2025-08-19",
//         status: "active",
//         staffName: "Dr. Maria Santos",
//       },
//     ],
//     "5": [
//       // Emma Wilson
//       {
//         id: "br-7",
//         bookTitle: "The Art of Computer Programming, Volume 1",
//         author: "Donald E. Knuth",
//         isbn: "9780201896848",
//         borrowDate: "2025-06-15",
//         dueDate: "2025-06-29",
//         status: "overdue",
//         staffName: "Sarah Chen",
//       },
//     ],
//   };

//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesRole = roleFilter === "all" || user.role === roleFilter;
//     const matchesStatus =
//       statusFilter === "all" || user.status === statusFilter;

//     return matchesSearch && matchesRole && matchesStatus;
//   });

//   const confirmUpdateUserStatus = (
//     userId: string,
//     newStatus: "active" | "disabled",
//     userName: string
//   ) => {
//     setPendingAction({
//       action: () => updateUserStatus(userId, newStatus, userName),
//       title: "Update User Status",
//       description: `You are about to change ${userName}'s status to ${newStatus}. This will ${
//         newStatus === "disabled"
//           ? "prevent them from accessing the system"
//           : "allow them to access the system"
//       }.`,
//     });
//     setShowPasswordConfirmation(true);
//   };

//   const updateUserStatus = (
//     userId: string,
//     newStatus: "active" | "disabled",
//     userName: string
//   ) => {
//     setUsers(
//       users.map((user) =>
//         user.id === userId ? { ...user, status: newStatus } : user
//       )
//     );
//     toast.success(`${userName} status updated to ${newStatus}!`);
//   };

//   const editUser = (user: UserData) => {
//     setEditingUser(user);
//     setNewUser({
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       newPassword: "",
//     });
//     setIsEditDialogOpen(true);
//   };

//   const confirmUpdateUser = () => {
//     if (!editingUser || !newUser.name || !newUser.email) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     const description = newUser.newPassword
//       ? `You are about to update ${newUser.name}'s information and password. This will modify their account details and change their login credentials.`
//       : `You are about to update ${newUser.name}'s information. This will modify their account details.`;

//     setPendingAction({
//       action: updateUser,
//       title: "Update User",
//       description: description,
//     });
//     setShowPasswordConfirmation(true);
//   };

//   const updateUser = () => {
//     if (!editingUser) return;

//     const updatedUser: UserData = {
//       ...editingUser,
//       name: newUser.name,
//       email: newUser.email,
//       role: newUser.role,
//     };

//     setUsers(
//       users.map((user) => (user.id === editingUser.id ? updatedUser : user))
//     );
//     setEditingUser(null);
//     setNewUser({ name: "", email: "", role: "student", newPassword: "" });
//     setIsEditDialogOpen(false);

//     const successMessage = newUser.newPassword
//       ? "User information and password updated successfully!"
//       : "User updated successfully!";
//     toast.success(successMessage);
//   };

//   const handlePasswordConfirmed = () => {
//     if (pendingAction) {
//       pendingAction.action();
//       setPendingAction(null);
//     }
//     setShowPasswordConfirmation(false);
//   };

//   const handlePasswordCancelled = () => {
//     setPendingAction(null);
//     setShowPasswordConfirmation(false);
//   };

//   const handleStudentClick = (user: UserData) => {
//     if (user.role === "student") {
//       setSelectedStudent(user);
//       setIsBorrowingHistoryOpen(true);
//     }
//   };

//   const getStudentBorrowingHistory = (studentId: string) => {
//     return borrowingHistory[studentId] || [];
//   };

//   const getBorrowingStats = (studentId: string) => {
//     const records = getStudentBorrowingHistory(studentId);
//     const returned = records.filter((r) => r.status === "returned").length;
//     const active = records.filter((r) => r.status === "active").length;
//     const overdue = records.filter((r) => r.status === "overdue").length;

//     return { returned, active, overdue, total: records.length };
//   };

//   const getStatusBadgeVariant = (status: BorrowRecord["status"]) => {
//     switch (status) {
//       case "returned":
//         return "default";
//       case "active":
//         return "secondary";
//       case "overdue":
//         return "destructive";
//       default:
//         return "outline";
//     }
//   };

//   const getRoleColor = (role: UserRole) => {
//     switch (role) {
//       case "admin":
//         return "default";
//       case "librarian":
//         return "secondary";
//       case "student":
//         return "outline";
//       default:
//         return "outline";
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl mb-2 flex items-center gap-2">
//             <Users className="h-6 w-6" />
//             User Management
//           </h1>
//           <p className="text-muted-foreground">
//             View and manage user accounts and information.
//           </p>
//         </div>
//       </div>

//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Edit className="h-5 w-5" />
//               Edit User
//             </DialogTitle>
//             <DialogDescription>
//               Update user information and change password if needed.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-6">
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Basic Information</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="edit-name">Full Name *</Label>
//                   <Input
//                     id="edit-name"
//                     value={newUser.name}
//                     onChange={(e) =>
//                       setNewUser({ ...newUser, name: e.target.value })
//                     }
//                     placeholder="Enter full name"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="edit-email">Email *</Label>
//                   <Input
//                     id="edit-email"
//                     type="email"
//                     value={newUser.email}
//                     onChange={(e) =>
//                       setNewUser({ ...newUser, email: e.target.value })
//                     }
//                     placeholder="user@university.edu"
//                   />
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="edit-role">Role</Label>
//                   <Select
//                     value={newUser.role}
//                     onValueChange={(value) =>
//                       setNewUser({ ...newUser, role: value as UserRole })
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="student">Student</SelectItem>
//                       <SelectItem value="librarian">Librarian</SelectItem>
//                       <SelectItem value="admin">Admin</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label htmlFor="edit-password">New Password (optional)</Label>
//                   <div className="relative">
//                     <Input
//                       id="edit-password"
//                       type={showNewPassword ? "text" : "password"}
//                       value={newUser.newPassword}
//                       onChange={(e) =>
//                         setNewUser({ ...newUser, newPassword: e.target.value })
//                       }
//                       placeholder="Leave empty to keep current password"
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                       onClick={() => setShowNewPassword(!showNewPassword)}
//                     >
//                       {showNewPassword ? (
//                         <EyeOff className="h-4 w-4" />
//                       ) : (
//                         <Eye className="h-4 w-4" />
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-2 pt-4">
//               <Button onClick={confirmUpdateUser} className="flex-1">
//                 Update User
//               </Button>
//               <Button
//                 onClick={() => {
//                   setIsEditDialogOpen(false);
//                   setEditingUser(null);
//                   setNewUser({
//                     name: "",
//                     email: "",
//                     role: "student",
//                     newPassword: "",
//                   });
//                   setShowNewPassword(false);
//                 }}
//                 variant="outline"
//               >
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Filter className="h-5 w-5" />
//             Search & Filter
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by name or email..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <Select value={roleFilter} onValueChange={setRoleFilter}>
//               <SelectTrigger className="w-full md:w-48">
//                 <SelectValue placeholder="Role" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Roles</SelectItem>
//                 <SelectItem value="student">Students</SelectItem>
//                 <SelectItem value="librarian">Librarians</SelectItem>
//                 <SelectItem value="admin">Admins</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger className="w-full md:w-48">
//                 <SelectValue placeholder="Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="active">Active</SelectItem>
//                 <SelectItem value="disabled">Disabled</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Users ({filteredUsers.length})</CardTitle>
//         </CardHeader>
//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="border-b">
//                 <tr className="text-left">
//                   <th className="p-4 text-sm">User</th>
//                   <th className="p-4 text-sm">Role</th>
//                   <th className="p-4 text-sm">Status</th>
//                   <th className="p-4 text-sm">Join Date</th>
//                   <th className="p-4 text-sm">Last Active</th>
//                   <th className="p-4 text-sm">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.map((user) => (
//                   <tr key={user.id} className="border-b hover:bg-muted/50">
//                     <td
//                       className={`p-4 ${
//                         user.role === "student"
//                           ? "cursor-pointer hover:bg-orange-50/50"
//                           : ""
//                       }`}
//                       onClick={() => handleStudentClick(user)}
//                     >
//                       <div>
//                         <p className="line-clamp-1 flex items-center gap-2">
//                           {user.name}
//                           {user.role === "student" && (
//                             <BookOpen className="h-4 w-4 text-orange-600" />
//                           )}
//                         </p>
//                         <p className="text-sm text-muted-foreground">
//                           {user.email}
//                         </p>
//                         {user.role === "student" &&
//                           getBorrowingStats(user.id).total > 0 && (
//                             <div className="flex gap-2 mt-1">
//                               <Badge variant="outline" className="text-xs">
//                                 {getBorrowingStats(user.id).active} active
//                               </Badge>
//                               {getBorrowingStats(user.id).overdue > 0 && (
//                                 <Badge
//                                   variant="destructive"
//                                   className="text-xs"
//                                 >
//                                   {getBorrowingStats(user.id).overdue} overdue
//                                 </Badge>
//                               )}
//                             </div>
//                           )}
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <Badge variant={getRoleColor(user.role)}>
//                         {user.role.replace("-", " ")}
//                       </Badge>
//                     </td>
//                     <td className="p-4">
//                       <div className="flex items-center gap-2">
//                         <div
//                           className={`w-2 h-2 rounded-full ${
//                             user.status === "active"
//                               ? "bg-green-500"
//                               : "bg-red-500"
//                           }`}
//                         />
//                         <span className="text-sm">{user.status}</span>
//                       </div>
//                     </td>
//                     <td className="p-4 text-sm">{user.joinDate}</td>
//                     <td className="p-4 text-sm">{user.lastActive}</td>
//                     <td className="p-4">
//                       <div className="flex gap-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => editUser(user)}
//                         >
//                           <Edit className="h-3 w-3" />
//                         </Button>
//                         <Select
//                           value={user.status}
//                           onValueChange={(value: "active" | "disabled") =>
//                             confirmUpdateUserStatus(user.id, value, user.name)
//                           }
//                         >
//                           <SelectTrigger className="w-24 h-8">
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="active">Active</SelectItem>
//                             <SelectItem value="disabled">Disabled</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>

//       {filteredUsers.length === 0 && (
//         <Card>
//           <CardContent className="text-center py-8">
//             <p className="text-muted-foreground">
//               No users found matching your criteria.
//             </p>
//           </CardContent>
//         </Card>
//       )}

//       {/* Borrowing History Dialog */}
//       <Dialog
//         open={isBorrowingHistoryOpen}
//         onOpenChange={setIsBorrowingHistoryOpen}
//       >
//         <DialogContent className="max-w-7xl w-[96vw] max-h-[92vh] flex flex-col p-0">
//           <DialogHeader className="px-10 py-8 border-b flex-shrink-0">
//             <DialogTitle className="flex items-center gap-3">
//               <BookOpen className="h-6 w-6 text-orange-600" />
//               Borrowing History
//             </DialogTitle>
//             <DialogDescription className="mt-2">
//               Complete borrowing record for {selectedStudent?.name}
//             </DialogDescription>
//           </DialogHeader>

//           <div className="flex-1 px-10 py-8 overflow-y-auto">
//             {selectedStudent && (
//               <>
//                 {/* Summary Stats */}
//                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
//                   {(() => {
//                     const stats = getBorrowingStats(selectedStudent.id);
//                     return (
//                       <>
//                         <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
//                           <div className="text-2xl font-bold text-green-600 mb-2">
//                             {stats.returned}
//                           </div>
//                           <div className="text-sm text-green-700">
//                             Books Returned
//                           </div>
//                         </div>
//                         <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
//                           <div className="text-2xl font-bold text-blue-600 mb-2">
//                             {stats.active}
//                           </div>
//                           <div className="text-sm text-blue-700">
//                             Currently Borrowed
//                           </div>
//                         </div>
//                         <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
//                           <div className="text-2xl font-bold text-red-600 mb-2">
//                             {stats.overdue}
//                           </div>
//                           <div className="text-sm text-red-700">
//                             Overdue Items
//                           </div>
//                         </div>
//                         <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
//                           <div className="text-2xl font-bold text-orange-600 mb-2">
//                             {stats.total}
//                           </div>
//                           <div className="text-sm text-orange-700">
//                             Total Books
//                           </div>
//                         </div>
//                       </>
//                     );
//                   })()}
//                 </div>

//                 {/* Detailed History */}
//                 <div>
//                   <h3 className="text-xl font-medium mb-8 text-gray-900">
//                     Detailed Borrowing History
//                   </h3>

//                   <div className="space-y-6">
//                     {getStudentBorrowingHistory(selectedStudent.id).map(
//                       (record) => (
//                         <div
//                           key={record.id}
//                           className="border border-orange-200 rounded-xl p-8 bg-white hover:bg-orange-50/50 hover:shadow-lg transition-all duration-200"
//                         >
//                           <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
//                             {/* Book Information */}
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-start justify-between mb-4">
//                                 <div className="flex-1 min-w-0 pr-4">
//                                   <h4 className="text-lg font-medium text-gray-900 line-clamp-2 mb-2">
//                                     {record.bookTitle}
//                                   </h4>
//                                   <p className="text-gray-600 mb-1">
//                                     by {record.author}
//                                   </p>
//                                   <p className="text-sm text-gray-500">
//                                     ISBN: {record.isbn}
//                                   </p>
//                                 </div>
//                                 <Badge
//                                   variant={getStatusBadgeVariant(record.status)}
//                                   className="flex-shrink-0 px-3 py-1"
//                                 >
//                                   {record.status === "returned"
//                                     ? "Returned"
//                                     : record.status === "active"
//                                     ? "Active"
//                                     : "Overdue"}
//                                 </Badge>
//                               </div>
//                             </div>

//                             {/* Date Information */}
//                             <div className="flex flex-col sm:flex-row gap-8 lg:gap-10">
//                               <div className="flex gap-8 sm:gap-10">
//                                 <div className="text-center">
//                                   <span className="text-gray-500 block text-xs uppercase tracking-wide mb-1">
//                                     Borrowed
//                                   </span>
//                                   <span className="font-medium text-gray-900">
//                                     {new Date(
//                                       record.borrowDate
//                                     ).toLocaleDateString()}
//                                   </span>
//                                 </div>
//                                 <div className="text-center">
//                                   <span className="text-gray-500 block text-xs uppercase tracking-wide mb-1">
//                                     Due
//                                   </span>
//                                   <span className="font-medium text-gray-900">
//                                     {new Date(
//                                       record.dueDate
//                                     ).toLocaleDateString()}
//                                   </span>
//                                 </div>
//                                 <div className="text-center">
//                                   <span className="text-gray-500 block text-xs uppercase tracking-wide mb-1">
//                                     Returned
//                                   </span>
//                                   <span className="font-medium text-gray-900">
//                                     {record.returnDate
//                                       ? new Date(
//                                           record.returnDate
//                                         ).toLocaleDateString()
//                                       : "Not returned"}
//                                   </span>
//                                 </div>
//                               </div>

//                               <div className="border-l border-gray-200 pl-8 hidden lg:block">
//                                 <span className="text-gray-500 block text-xs uppercase tracking-wide mb-1">
//                                   Staff Member
//                                 </span>
//                                 <span className="font-medium text-gray-900">
//                                   {record.staffName}
//                                 </span>
//                               </div>

//                               <div className="lg:hidden pt-2 border-t border-gray-100">
//                                 <span className="text-gray-500 text-xs uppercase tracking-wide">
//                                   Staff:{" "}
//                                 </span>
//                                 <span className="font-medium text-gray-900">
//                                   {record.staffName}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )
//                     )}

//                     {getStudentBorrowingHistory(selectedStudent.id).length ===
//                       0 && (
//                       <div className="text-center py-16 text-gray-500">
//                         <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
//                         <p className="text-lg">No borrowing history found</p>
//                         <p className="text-sm mt-2">
//                           This student hasn't borrowed any books yet.
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>

//           <div className="px-10 py-8 border-t bg-gray-50/50 flex-shrink-0">
//             <div className="flex justify-end">
//               <Button
//                 onClick={() => setIsBorrowingHistoryOpen(false)}
//                 variant="outline"
//                 className="px-6 py-2"
//               >
//                 Close
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Password Confirmation Dialog */}
//       {showPasswordConfirmation && pendingAction && (
//         <PasswordConfirmation
//           title={pendingAction.title}
//           isOpen={showPasswordConfirmation}
//           description={pendingAction.description}
//           onConfirm={handlePasswordConfirmed}
//           onClose={handlePasswordCancelled}
//         />
//       )}
//     </div>
//   );
// }
