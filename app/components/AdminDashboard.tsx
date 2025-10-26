import React, { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { NavigationSidebar } from "./NavigationSidebar";
import { AdminDashboardHome } from "./admin/AdminDashboardHome";
import { UserManagement } from "./admin/UserManagement";
import { AdminBookManagement } from "./admin/AdminBookManagement";
import { AdminEquipmentManagement } from "./admin/AdminEquipmentManagement";
import { AdminAttendanceLogs } from "./admin/AdminAttendanceLogs";
import { AdminBorrowingHistory } from "./admin/AdminBorrowingHistory";
import { OverdueAlerts } from "./admin/OverdueAlerts";
import { GlobalLogs } from "./admin/GlobalLogs";
import { BackupRestore, BackupRestoreData } from "./admin/BackupRestore";
import { Features } from "./admin/Features";
import { ManageAccount } from "./ManageAccount";
import type { User } from "../page";

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeView, setActiveView] = useState("dashboard");

  // Backup data state
  const [backupData, setBackupData] = useState<BackupRestoreData>({
    deletedUsers: [
      {
        id: "deleted_1",
        name: "Michael Johnson",
        email: "michael.johnson@student.university.edu",
        role: "student",
        status: "active",
        joinDate: "2024-08-15",
        lastActive: "2025-07-30",
        deletedDate: "2025-08-01",
        deletedBy: "Admin",
      },
      {
        id: "deleted_2",
        name: "Lisa Wang",
        email: "lisa.wang@university.edu",
        role: "librarian",
        status: "active",
        joinDate: "2023-09-01",
        lastActive: "2025-07-29",
        deletedDate: "2025-07-30",
        deletedBy: "Dr. Maria Santos",
      },
    ],
    deletedBooks: [
      {
        id: "deleted_book_1",
        title: "Deleted Programming Book",
        author: "Test Author",
        isbn: "978-0-111111-11-1",
        category: "Computer Science",
        status: "available",
        location: "Section A, Shelf 1",
        description: "A programming book that was deleted.",
        copies: 3,
        availableCopies: 2,
        deletedDate: "2025-08-02",
        deletedBy: "Admin",
      },
    ],
    deletedEquipment: [
      {
        id: "deleted_equipment_1",
        name: "Old Desktop Computer",
        type: "computer",
        category: "Desktop",
        status: "available",
        location: "Computer Lab A",
        description: "Legacy desktop computer.",
        quantity: 1,
        availableQuantity: 1,
        deletedDate: "2025-08-02",
        deletedBy: "Admin",
      },
    ],
  });

  // Add deleted item to backup
  const addToBackup = {
    user: (deletedUser: any) => {
      setBackupData((prev) => ({
        ...prev,
        deletedUsers: [
          ...prev.deletedUsers,
          {
            ...deletedUser,
            deletedDate: new Date().toISOString().split("T")[0],
            deletedBy: user.name,
          },
        ],
      }));
    },
    book: (deletedBook: any) => {
      setBackupData((prev) => ({
        ...prev,
        deletedBooks: [
          ...prev.deletedBooks,
          {
            ...deletedBook,
            deletedDate: new Date().toISOString().split("T")[0],
            deletedBy: user.name,
          },
        ],
      }));
    },
    equipment: (deletedEquipment: any) => {
      setBackupData((prev) => ({
        ...prev,
        deletedEquipment: [
          ...prev.deletedEquipment,
          {
            ...deletedEquipment,
            deletedDate: new Date().toISOString().split("T")[0],
            deletedBy: user.name,
          },
        ],
      }));
    },
  };

  // Restore functions
  const handleRestoreUser = (restoredUser: any) => {
    setBackupData((prev) => ({
      ...prev,
      deletedUsers: prev.deletedUsers.filter((u) => u.id !== restoredUser.id),
    }));
    // Here you would add the user back to the main users list
  };

  const handleRestoreBook = (restoredBook: any) => {
    setBackupData((prev) => ({
      ...prev,
      deletedBooks: prev.deletedBooks.filter((b) => b.id !== restoredBook.id),
    }));
    // Here you would add the book back to the main books list
  };

  const handleRestoreEquipment = (restoredEquipment: any) => {
    setBackupData((prev) => ({
      ...prev,
      deletedEquipment: prev.deletedEquipment.filter(
        (e) => e.id !== restoredEquipment.id
      ),
    }));
    // Here you would add the equipment back to the main equipment list
  };

  // Permanent delete functions
  const handlePermanentDeleteUser = (userId: string) => {
    setBackupData((prev) => ({
      ...prev,
      deletedUsers: prev.deletedUsers.filter((u) => u.id !== userId),
    }));
  };

  const handlePermanentDeleteBook = (bookId: string) => {
    setBackupData((prev) => ({
      ...prev,
      deletedBooks: prev.deletedBooks.filter((b) => b.id !== bookId),
    }));
  };

  const handlePermanentDeleteEquipment = (equipmentId: string) => {
    setBackupData((prev) => ({
      ...prev,
      deletedEquipment: prev.deletedEquipment.filter(
        (e) => e.id !== equipmentId
      ),
    }));
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <AdminDashboardHome user={user} onNavigate={setActiveView} />;
      case "users":
        return <UserManagement onDeleteUser={addToBackup.user} />;
      // case "books":
      //   return (
      //     <AdminBookManagement
      //       onDeleteBook={addToBackup.book}
      //       currentUser={user}
      //     />
      //   );
      // case "equipment":
      //   return (
      //     <AdminEquipmentManagement
      //       onDeleteEquipment={addToBackup.equipment}
      //       currentUser={user}
      //     />
      //   );
      case "attendance":
        return <AdminAttendanceLogs />;
      case "history":
        return <AdminBorrowingHistory />;
      case "overdue":
        return <OverdueAlerts />;
      case "logs":
        return <GlobalLogs />;
      case "backup":
        return (
          <BackupRestore
            backupData={backupData}
            onRestoreUser={handleRestoreUser}
            onRestoreBook={handleRestoreBook}
            onPermanentDeleteUser={handlePermanentDeleteUser}
            onPermanentDeleteBook={handlePermanentDeleteBook}
            currentUser={user}
          />
        );
      case "features":
        return <Features currentUser={user} />;
      case "account":
        return <ManageAccount user={user} />;
      default:
        return <AdminDashboardHome user={user} onNavigate={setActiveView} />;
    }
  };

  return (
    // <DashboardLayout
    //   user={user}
    //   onLogout={onLogout}
    //   sidebar={
    //     <NavigationSidebar
    //       role={user.role}
    //       activeView={activeView}
    //       onViewChange={setActiveView}
    //     />
    //   }
    // >
    //   {renderContent()}
    // </DashboardLayout>
    <div></div>
  );
}
