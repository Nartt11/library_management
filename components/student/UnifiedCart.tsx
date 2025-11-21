import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Trash2,
  Calendar,
  ShoppingCart,
  QrCode,
  CheckCircle,
  Clock,
  Monitor,
  Gamepad2,
  BookOpen,
  MapPin,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { toast } from "sonner";

interface UnifiedCartProps {
  bookCartItems: string[];
  equipmentCartItems: string[];
  onUpdateBookCart: (items: string[]) => void;
  onUpdateEquipmentCart: (items: string[]) => void;
  onNavigateToQRTicket?: (ticketData: any) => void;
}

interface QRData {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: string;
  purpose: string;
  status: "active" | "scanned" | "expired";
  books?: any[];
  equipment?: any[];
  expiresAt?: string;
}

export function UnifiedCart({
  bookCartItems,
  equipmentCartItems,
  onUpdateBookCart,
  onUpdateEquipmentCart,
  onNavigateToQRTicket,
}: UnifiedCartProps) {
  const [showQRDisplay, setShowQRDisplay] = useState(false);
  const [currentQR, setCurrentQR] = useState<QRData | null>(null);
  const [qrExpired, setQrExpired] = useState(false);

  // Mock data - in real app, this would be fetched based on cart item IDs
  const allBooks = [
    {
      id: "1",
      title: "Introduction to Computer Science",
      author: "John Smith",
      isbn: "978-0-123456-78-9",
      category: "Computer Science",
      location: "Section A, Shelf 2",
    },
    {
      id: "3",
      title: "Modern Physics",
      author: "Robert Johnson",
      isbn: "978-0-123456-80-2",
      category: "Physics",
      location: "Section B, Shelf 1",
    },
    {
      id: "4",
      title: "Organic Chemistry",
      author: "Maria Garcia",
      isbn: "978-0-123456-81-9",
      category: "Chemistry",
      location: "Section C, Shelf 2",
    },
    {
      id: "6",
      title: "World History",
      author: "Sarah Brown",
      isbn: "978-0-123456-83-3",
      category: "History",
      location: "Section E, Shelf 3",
    },
  ];

  const allEquipment = [
    {
      id: "comp-1",
      name: "Desktop 1",
      type: "computer",
      category: "Desktop",
      location: "Computer Lab A, Station 1",
      specifications: "Intel i5, 8GB RAM, 256GB SSD",
      serialNumber: "DESK-001",
      image:
        "https://images.unsplash.com/photo-1593486544625-13ef2368e43a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGRlc2t0b3AlMjB3b3Jrc3RhdGlvbnxlbnwxfHx8fDE3NTY4NjIxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "bg-1",
      name: "Chess",
      type: "board-game",
      category: "Strategy",
      location: "Recreation Room, Shelf A",
      maxPlayers: 2,
      image:
        "https://images.unsplash.com/photo-1653510640359-cbc4c1f3a90f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzcyUyMGJvYXJkJTIwZ2FtZXxlbnwxfHx8fDE3NTY4MzM1ODV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const cartBooks = allBooks.filter((book) => bookCartItems.includes(book.id));
  const cartEquipment = allEquipment.filter((equipment) =>
    equipmentCartItems.includes(equipment.id)
  );

  const removeFromBookCart = (bookId: string, bookTitle: string) => {
    const newCartItems = bookCartItems.filter((id) => id !== bookId);
    onUpdateBookCart(newCartItems);
    toast.success(`"${bookTitle}" removed from cart`);
  };

  const removeFromEquipmentCart = (
    equipmentId: string,
    equipmentName: string
  ) => {
    const newCartItems = equipmentCartItems.filter((id) => id !== equipmentId);
    onUpdateEquipmentCart(newCartItems);
    toast.success(`"${equipmentName}" removed from cart`);
  };

  const clearBookCart = () => {
    onUpdateBookCart([]);
    toast.success("Book cart cleared");
  };

  const clearEquipmentCart = () => {
    onUpdateEquipmentCart([]);
    toast.success("Equipment cart cleared");
  };

  const clearAllCart = () => {
    onUpdateBookCart([]);
    onUpdateEquipmentCart([]);
    toast.success("Cart cleared");
  };

  const handleCheckout = () => {
    if (cartBooks.length === 0 && cartEquipment.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const ticketId =
      "TKT-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    const currentTime = new Date().toISOString();

    // Determine purpose based on what's being borrowed
    let purpose = "";
    if (cartBooks.length > 0 && cartEquipment.length > 0) {
      purpose = "book-equipment-checkout";
    } else if (cartBooks.length > 0) {
      purpose = "book-checkout";
    } else {
      purpose = "equipment-checkout";
    }

    const checkout: QRData = {
      id: ticketId,
      studentId: "ST-001",
      studentName: "Alex Johnson",
      timestamp: currentTime,
      purpose: purpose,
      status: "active",
      books: cartBooks.length > 0 ? cartBooks : undefined,
      equipment: cartEquipment.length > 0 ? cartEquipment : undefined,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
    };

    setCurrentQR(checkout);
    setQrExpired(false);
    setShowQRDisplay(true);
    onUpdateBookCart([]);
    onUpdateEquipmentCart([]);
    toast.success("Checkout QR code generated!");
  };

  const getReturnDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toLocaleDateString();
  };

  const generateQRCode = (data: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
      data
    )}`;
  };

  const handleQRClose = () => {
    setShowQRDisplay(false);
    if (currentQR && onNavigateToQRTicket) {
      // Mark QR as expired when closing if 15 minutes have passed
      const updatedQR = {
        ...currentQR,
        status: qrExpired ? "expired" : currentQR.status,
      };
      onNavigateToQRTicket(updatedQR);
    }
    setCurrentQR(null);
    setQrExpired(false);
  };

  // Effect to handle QR expiration
  useEffect(() => {
    if (currentQR && showQRDisplay) {
      const expirationTime = new Date(currentQR.expiresAt!).getTime();
      const timeUntilExpiration = expirationTime - Date.now();

      if (timeUntilExpiration > 0) {
        const timer = setTimeout(() => {
          setQrExpired(true);
          if (currentQR) {
            setCurrentQR({
              ...currentQR,
              status: "expired",
            });
          }
          toast.error("QR code has expired");
        }, timeUntilExpiration);

        return () => clearTimeout(timer);
      } else {
        // Already expired
        setQrExpired(true);
        if (currentQR) {
          setCurrentQR({
            ...currentQR,
            status: "expired",
          });
        }
      }
    }
  }, [currentQR, showQRDisplay]);

  const getTypeIcon = (type: string) => {
    return type === "computer" ? Monitor : Gamepad2;
  };

  const getPurposeDisplay = (purpose: string) => {
    switch (purpose) {
      case "book-checkout":
        return "Book Checkout";
      case "equipment-checkout":
        return "Equipment Checkout";
      case "book-equipment-checkout":
        return "Book & Equipment Checkout";
      default:
        return "Checkout";
    }
  };

  const totalItems = cartBooks.length + cartEquipment.length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2 flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            My Cart
          </h1>
          <p className="text-muted-foreground">
            Review and checkout your selected items.
          </p>
        </div>
        <Badge variant="outline" className="gap-2">
          <ShoppingCart className="h-3 w-3" />
          {totalItems} total items
        </Badge>
      </div>

      {totalItems === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-4">
              Add books or equipment from the catalog to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Cart Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Checkout Summary</CardTitle>
              <CardDescription>
                {cartBooks.length} book(s) and {cartEquipment.length} equipment
                item(s) selected for borrowing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartBooks.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Expected return date (books):
                    </span>
                  </div>
                  <Badge variant="outline">{getReturnDate()}</Badge>
                </div>
              )}
              <div className="flex gap-3">
                <Button onClick={handleCheckout} className="flex-1">
                  Checkout All Items & Generate QR
                </Button>
                <Button variant="outline" onClick={clearAllCart}>
                  Clear Cart
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cart Items */}
          <div className="space-y-4">
            <h3 className="text-lg">Selected Items</h3>

            {/* Books */}
            {cartBooks.map((book) => (
              <Card key={`book-${book.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <BookOpen className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <h4 className="line-clamp-1 mb-1">{book.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          by {book.author}
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span>ISBN: {book.isbn}</span>
                          <span>Category: {book.category}</span>
                          <span>Location: {book.location}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromBookCart(book.id, book.title)}
                      className="shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Equipment */}
            {cartEquipment.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <Card key={`equipment-${item.id}`}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src="/UITLogo.jpg"
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <TypeIcon className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                            <div className="min-w-0">
                              <h4 className="font-medium line-clamp-1">
                                {item.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {item.category}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              removeFromEquipmentCart(item.id, item.name)
                            }
                            className="shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{item.location}</span>
                          </div>
                        </div>

                        {item.specifications && (
                          <p className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">Specs:</span>{" "}
                            {item.specifications}
                          </p>
                        )}

                        {item.maxPlayers && (
                          <p className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">Max Players:</span>{" "}
                            {item.maxPlayers}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* QR Display Modal */}
      <Dialog open={showQRDisplay} onOpenChange={setShowQRDisplay}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center pb-3">
            <div className="mx-auto w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mb-2">
              <QrCode className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-lg">
              {getPurposeDisplay(currentQR?.purpose || "")} Ticket
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {qrExpired
                ? "This QR code has expired and cannot be scanned"
                : "Present this QR code to the librarian to complete your checkout"}
            </DialogDescription>
          </DialogHeader>

          {currentQR && (
            <div className="space-y-4">
              {/* QR Code Display */}
              <div className="flex justify-center">
                <div
                  className={`bg-white p-4 rounded-xl shadow-sm border-2 ${
                    qrExpired
                      ? "border-red-200 opacity-50"
                      : "border-orange-100"
                  } relative`}
                >
                  <img
                    src={generateQRCode(JSON.stringify(currentQR))}
                    alt="QR Borrow Ticket"
                    className="w-40 h-40"
                  />
                  {qrExpired && (
                    <div className="absolute inset-0 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        EXPIRED
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ticket Information */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-xs text-orange-700 font-medium mb-1">
                      Ticket ID
                    </div>
                    <div className="font-mono text-xs bg-white px-2 py-1 rounded border">
                      {currentQR.id}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-orange-700 font-medium mb-1">
                      Items
                    </div>
                    <div className="text-xs bg-white px-2 py-1 rounded border font-medium">
                      {(currentQR.books?.length || 0) +
                        (currentQR.equipment?.length || 0)}{" "}
                      item(s)
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-orange-200 rounded-lg p-2 space-y-1">
                  <div className="flex items-center justify-center gap-2 text-xs text-orange-600">
                    <Clock className="h-3 w-3" />
                    <span>
                      Generated:{" "}
                      {new Date(currentQR.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-orange-600">
                    <Clock className="h-3 w-3" />
                    <span>
                      {qrExpired
                        ? "Expired"
                        : `Expires: ${new Date(
                            currentQR.expiresAt!
                          ).toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleQRClose}
                className={`w-full ${
                  qrExpired
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                }`}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {qrExpired ? "Close Expired Ticket" : "Complete & Close"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
