import React, { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { NavigationSidebar } from "./NavigationSidebar";
import { StudentDashboardHome } from "./student/StudentDashboardHome";
import { BookCatalog } from "./student/BookCatalog";
import { EquipmentCatalog } from "./student/EquipmentCatalog";
import { UnifiedCart } from "./student/UnifiedCart";
import { QRTicket } from "./student/QRTicket";
import { StudentAttendance } from "./student/StudentAttendance";
import { StudentHistory } from "./student/StudentHistory";
import { ManageAccount } from "./ManageAccount";
import { toast } from "sonner";
import type { User, PendingBook } from "../page";

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
  pendingBook?: PendingBook | null;
  onPendingBookProcessed?: () => void;
}

export function StudentDashboard({
  user,
  onLogout,
  pendingBook,
  onPendingBookProcessed,
}: StudentDashboardProps) {
  const [activeView, setActiveView] = useState("dashboard");
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [equipmentCartItems, setEquipmentCartItems] = useState<string[]>([]);
  const [currentTicketData, setCurrentTicketData] = useState<any>(null);

  // Handle pending book from Showroom
  useEffect(() => {
    // Only navigate to cart if we have a valid pending book with required properties
    if (
      pendingBook &&
      pendingBook.id &&
      pendingBook.title &&
      onPendingBookProcessed
    ) {
      // Add the book to cart
      setCartItems((prev) => {
        if (prev.includes(pendingBook.id)) {
          toast.info(`"${pendingBook.title}" is already in your cart`);
          return prev;
        }
        toast.success(`"${pendingBook.title}" has been added to your cart`);
        return [...prev, pendingBook.id];
      });

      // Navigate to cart view only if there was a valid pending book
      setActiveView("cart");

      // Clear the pending book
      onPendingBookProcessed();
    }
    // If no valid pending book, stay on dashboard (which is the default activeView)
  }, [pendingBook, onPendingBookProcessed]);

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <StudentDashboardHome user={user} onNavigate={setActiveView} />;
      case "catalog":
        return <BookCatalog cartItems={cartItems} onAddToCart={setCartItems} />;
      case "equipment":
        return (
          <EquipmentCatalog
            cartItems={equipmentCartItems}
            onAddToCart={setEquipmentCartItems}
          />
        );
      case "cart":
        return (
          <UnifiedCart
            bookCartItems={cartItems}
            equipmentCartItems={equipmentCartItems}
            onUpdateBookCart={setCartItems}
            onUpdateEquipmentCart={setEquipmentCartItems}
            onNavigateToQRTicket={(ticketData) => {
              setCurrentTicketData(ticketData);
              setActiveView("qr-ticket");
            }}
          />
        );
      case "qr-ticket":
        return <QRTicket user={user} ticketData={currentTicketData} />;
      case "attendance":
        return <StudentAttendance user={user} />;
      case "history":
        return <StudentHistory user={user} />;
      case "account":
        return <ManageAccount user={user} />;
      default:
        return <StudentDashboardHome user={user} onNavigate={setActiveView} />;
    }
  };

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      sidebar={
        <NavigationSidebar
          role={user.role}
          activeView={activeView}
          onViewChange={setActiveView}
        />
      }
    >
      {renderContent()}
    </DashboardLayout>
  );
}
