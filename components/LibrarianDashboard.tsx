// import React, { useState } from "react";
// import { DashboardLayout } from "./DashboardLayout";
// import { NavigationSidebar } from "./NavigationSidebar";
// import { LibrarianDashboardHome } from "./librarian/LibrarianDashboardHome";
// import { BookManagement } from "./librarian/BookManagement";
// // import { EquipmentManagement } from './librarian/EquipmentManagement';
// //import { QRScanner } from './librarian/QRScanner';
// import { AttendanceLogs } from "./librarian/AttendanceLogs";
// import { TopVisitors } from "./librarian/TopVisitors";
// import { OverdueAlerts } from "./librarian/OverdueAlerts";
// import { BorrowingHistory } from "./librarian/BorrowingHistory";
// import { LibrarianBackupRestore } from "./librarian/LibrarianBackupRestore";
// // import { LibrarianUserManagement } from './librarian/LibrarianUserManagement';
// import { ManageAccount } from "./ManageAccount";
// import type { User } from "../page";

// interface LibrarianDashboardProps {
//   user: User;
//   onLogout: () => void;
// }

// export function LibrarianDashboard({
//   user,
//   onLogout,
// }: LibrarianDashboardProps) {
//   const [activeView, setActiveView] = useState("dashboard");
//   const [isAddBookDialogOpen, setIsAddBookDialogOpen] = useState(false);
//   const [isAddEquipmentDialogOpen, setIsAddEquipmentDialogOpen] =
//     useState(false);

//   const handleAddBook = () => {
//     setIsAddBookDialogOpen(true);
//     setActiveView("books"); // Navigate to books page when Add Book is clicked
//   };

//   const handleAddEquipment = () => {
//     setIsAddEquipmentDialogOpen(true);
//     setActiveView("equipment"); // Navigate to equipment page when Add Equipment is clicked
//   };

//   const renderContent = () => {
//     switch (activeView) {
//       case "dashboard":
//         return (
//           <LibrarianDashboardHome
//             user={user}
//             onNavigate={setActiveView}
//             onAddBook={handleAddBook}
//           />
//         );
//       // case 'users':
//       //   return <LibrarianUserManagement currentUser={user} />;
//       case "books":
//         return (
//           <BookManagement
//             isAddDialogOpen={isAddBookDialogOpen}
//             onAddDialogOpenChange={setIsAddBookDialogOpen}
//             currentUser={user}
//           />
//         );
//       // case 'equipment':
//       //   return <EquipmentManagement isAddDialogOpen={isAddEquipmentDialogOpen} onAddDialogOpenChange={setIsAddEquipmentDialogOpen} currentUser={user} />;
//       case "scanner":
//       // case 'qr-scanner':
//       //   return <QRScanner user={user} />;
//       case "attendance":
//         return <AttendanceLogs />;
//       case "analytics":
//         return <TopVisitors />;
//       case "overdue":
//         return <OverdueAlerts />;
//       case "history":
//         return <BorrowingHistory />;
//       case "backup":
//         return <LibrarianBackupRestore currentUser={user} />;
//       case "account":
//         return <ManageAccount user={user} />;
//       default:
//         return (
//           <LibrarianDashboardHome
//             user={user}
//             onNavigate={setActiveView}
//             onAddBook={handleAddBook}
//           />
//         );
//     }
//   };

//   return (
//     <DashboardLayout
//       user={user}
//       onLogout={onLogout}
//       sidebar={
//         <NavigationSidebar
//           role={user.role}
//           activeView={activeView}
//           onViewChange={setActiveView}
//         />
//       }
//     >
//       {renderContent()}
//     </DashboardLayout>
//   );
// }
