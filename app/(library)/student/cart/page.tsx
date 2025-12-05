"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Checkbox } from "../../../../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import {
  Trash2,
  Calendar,
  ShoppingCart,
  QrCode,
  CheckCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { BorrowRequestResponse } from "../../../../types/student";
import { CartItemDto } from "../../../../types/cart";
import { getCartItems, createBorrowRequest, removeBookFromCart, clearCart as clearCartApi } from "../../../../services/cart";
import { getUserFromToken } from "../../../../services/auth/authService";

export default function BookCart() {
  const router = useRouter();
  const [showQRDisplay, setShowQRDisplay] = useState(false);
  const [currentQR, setCurrentQR] = useState<BorrowRequestResponse | null>(null);
  const [cartItems, setCartItems] = useState<CartItemDto[]>([]);
  const [selectedBookIds, setSelectedBookIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted flag
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch cart items from backend
  useEffect(() => {
    async function fetchCart() {
      if (!mounted) return;
      
      try {
        setLoading(true);
        const items = await getCartItems();
        setCartItems(items);
        // Auto-select all available books
        const availableIds = items.filter(item => item.isAvailable).map(item => item.bookId);
        setSelectedBookIds(new Set(availableIds));
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load cart');
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, [mounted]);

  const removeFromCart = async (bookId: string, bookTitle: string) => {
    try {
      await removeBookFromCart(bookId);
      setCartItems(cartItems.filter(item => item.bookId !== bookId));
      setSelectedBookIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
      toast.success(`"${bookTitle}" removed from cart`);
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove book from cart');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCartApi();
      setCartItems([]);
      setSelectedBookIds(new Set());
      toast.success("Cart cleared");
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const toggleBookSelection = (bookId: string) => {
    setSelectedBookIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
      } else {
        newSet.add(bookId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedBookIds.size === cartItems.filter(item => item.isAvailable).length) {
      setSelectedBookIds(new Set());
    } else {
      const availableIds = cartItems.filter(item => item.isAvailable).map(item => item.bookId);
      setSelectedBookIds(new Set(availableIds));
    }
  };

  const handleCheckout = async () => {
    if (selectedBookIds.size === 0) {
      toast.error("Please select at least one book to borrow");
      return;
    }

    const user = getUserFromToken();
    if (!user) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      
      const bookIds = Array.from(selectedBookIds);
      const borrowResponse = await createBorrowRequest(bookIds, "Student borrow request");
      
      setCurrentQR(borrowResponse);
      setShowQRDisplay(true);
      
      // Remove borrowed books from cart
      const remainingItems = cartItems.filter(item => !selectedBookIds.has(item.bookId));
      setCartItems(remainingItems);
      setSelectedBookIds(new Set());

      toast.success(borrowResponse.message || "Borrow request created successfully!");
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error?.message || 'Failed to create borrow request');
    } finally {
      setLoading(false);
    }
  };

  const getReturnDate = () => {
    if (!mounted) return 'Loading...';
    const date = new Date();
    date.setDate(date.getDate() + 14); // 14 days from now
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Use same QR generation format as QRTicket
  const generateQRCode = (qrCodeData: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCodeData)}`;
  };

  const handleQRClose = () => {
    setShowQRDisplay(false);
    setCurrentQR(null);
    // Navigate to QR ticket history or dashboard
    router.push('/student/dashboard');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2 flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            My Cart
          </h1>
          <p className="text-muted-foreground">
            Review and checkout your selected books.
          </p>
        </div>
        <div className="flex gap-2">
          {cartItems.length > 0 && (
            <>
              <Button 
                variant="outline" 
                onClick={toggleSelectAll}
                disabled={cartItems.filter(item => item.isAvailable).length === 0}
              >
                {selectedBookIds.size === cartItems.filter(item => item.isAvailable).length ? 'Deselect All' : 'Select All'}
              </Button>
              <Button variant="outline" onClick={handleClearCart}>
                Clear Cart
              </Button>
            </>
          )}
        </div>
      </div>

      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-4">
              Add books from the catalog to get started.
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
                {selectedBookIds.size} of {cartItems.length} book(s) selected for borrowing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Expected return date:</span>
                </div>
                <div className="text-center">
                  <Badge variant="outline">{getReturnDate()}</Badge>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleCheckout} 
                  className="flex-1"
                  disabled={loading || selectedBookIds.size === 0}
                >
                  {loading ? 'Processing...' : `Borrow ${selectedBookIds.size} Book${selectedBookIds.size !== 1 ? 's' : ''}`}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cart Items */}
          <div className="space-y-4">
            <h3 className="text-lg">Books in Cart</h3>
            {cartItems.map((item) => {
              const isSelected = selectedBookIds.has(item.bookId);
              const canSelect = item.isAvailable;
              
              return (
                <Card key={item.id} className={isSelected ? 'border-primary' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <div className="pt-1">
                        <Checkbox
                          checked={isSelected}
                          disabled={!canSelect}
                          onCheckedChange={() => canSelect && toggleBookSelection(item.bookId)}
                        />
                      </div>

                      {/* Book Image */}
                      <div className="shrink-0">
                        <img
                          src={item.bookImageUrl || '/placeholder-book.jpg'}
                          alt={item.bookTitle || 'Book cover'}
                          className="w-20 h-28 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-book.jpg';
                          }}
                        />
                      </div>

                      {/* Book Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold line-clamp-2 mb-2">
                          {item.bookTitle || 'Unknown Title'}
                        </h4>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-2">
                          {item.bookISBN && <span>ISBN: {item.bookISBN}</span>}
                        </div>
                        {!item.isAvailable && (
                          <Badge variant="destructive" className="text-xs">
                            Currently Unavailable
                          </Badge>
                        )}
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.bookId, item.bookTitle || 'Book')}
                        className="shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Current QR Display Modal */}
      <Dialog open={showQRDisplay} onOpenChange={setShowQRDisplay}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center pb-3">
            <div className="mx-auto w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mb-2">
              <QrCode className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-lg">
              Borrow Ticket Generated
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Present this QR code to the librarian to complete your checkout
            </DialogDescription>
          </DialogHeader>

          {currentQR && (
            <div className="space-y-4">
              {/* QR Code Display */}
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-orange-100">
                  <img
                    src={generateQRCode(currentQR.qrCode)}
                    alt="QR Borrow Ticket"
                    className="w-40 h-40"
                  />
                </div>
              </div>

              {/* Ticket Information Card */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-3 space-y-3">
                <div className="text-center">
                  <div className="text-xs text-orange-700 font-medium mb-1">
                    Request ID
                  </div>
                  <div className="font-mono text-xs bg-white px-2 py-1 rounded border break-all">
                    {currentQR.requestId}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-orange-700 font-medium mb-1">
                    QR Code
                  </div>
                  <div className="font-mono text-xs bg-white px-2 py-1 rounded border break-all">
                    {currentQR.qrCode}
                  </div>
                </div>

                <div className="bg-white border border-orange-200 rounded-lg p-2">
                  <div className="flex items-center justify-center gap-2 text-xs text-orange-600">
                    <Clock className="h-3 w-3" />
                    <span>
                      Generated: {mounted && new Date().toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3">
                <p className="text-sm text-teal-700 text-center">
                  {currentQR.message}
                </p>
              </div>

              <div>
                <Button
                  onClick={handleQRClose}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete & Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
