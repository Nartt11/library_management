"use client";
import React, { useState } from "react";
import { AdminDashboardHome } from "../../../components/admin/AdminDashboardHome";
import type { User } from "@/../../types/user";
import { useAuth } from "@/context/authContext";

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
