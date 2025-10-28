"use client";
import React, { useState } from "react";
import { DashboardLayout } from "../../../components/DashboardLayout";
import { NavigationSidebar } from "../../../components/NavigationSidebar";
import { AdminDashboardHome } from "../../../components/admin/AdminDashboardHome";
import { UserManagement } from "../../../components/admin/UserManagement";
import { AdminBookManagement } from "../../../components/admin/AdminBookManagement";
// import { AdminEquipmentManagement } from "../../components/admin/AdminEquipmentManagement";
// import { AdminAttendanceLogs } from "../../components/admin/AdminAttendanceLogs";
import { AdminBorrowingHistory } from "../../../components/admin/AdminBorrowingHistory";
import { OverdueAlerts } from "../../../components/admin/OverdueAlerts";
import { GlobalLogs } from "../../../components/admin/GlobalLogs";
// import {
//   BackupRestore,
//   BackupRestoreData,
// } from "../../components/admin/BackupRestore";
import { Features } from "../../../components/admin/Features";
import { ManageAccount } from "../../../components/ManageAccount";
import type { User } from "@/../../types/user";
import { useAuth } from "@/context/authContext";
import { LibrarianDashboardHome } from "@/components/librarian/LibrarianDashboardHome";

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");
  console.log("Current User in AdminDashboard:", currentUser);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  // const renderContent = () => {
  //   switch (activeView) {
  //     case "dashboard":
  //       return <AdminDashboardHome user={user} onNavigate={setActiveView} />;
  //     case "users":
  //       return (
  //         <UserManagement
  //         //onDeleteUser={addToBackup.user}
  //         />
  //       );
  //     case "books":
  //       return (
  //         <AdminBookManagement
  //         //onDeleteBook={null}
  //         // currentUser={user}
  //         />
  //       );
  //     // case "equipment":
  //     //   return (
  //     //     <AdminEquipmentManagement
  //     //       onDeleteEquipment={addToBackup.equipment}
  //     //       currentUser={user}
  //     //     />
  //     //   );
  //     // case "attendance":
  //     //   return <AdminAttendanceLogs />;
  //     case "history":
  //       return <AdminBorrowingHistory />;
  //     case "overdue":
  //       return <OverdueAlerts />;
  //     case "logs":
  //       return <GlobalLogs />;

  //     case "features":
  //       return <Features currentUser={user} />;
  //     case "account":
  //       return <ManageAccount user={user} />;
  //     default:
  //       return <AdminDashboardHome user={user} onNavigate={setActiveView} />;
  //   }
  // };

  return (
    // <DashboardLayout
    //   user={currentUser}
    //   onLogout={onLogout}
    //   sidebar={
    //     <NavigationSidebar
    //       role="librarian"
    //       activeView={activeView}
    //       // onViewChange={setActiveView}
    //     />
    //   }
    // >
    //   {renderContent()}
    // </DashboardLayout>
    <AdminDashboardHome user={currentUser} />
  );
}
