import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Trash2, Calendar, ShoppingCart, QrCode, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface BookCartProps {
  cartItems: string[];
  onUpdateCart: (items: string[]) => void;
  onNavigateToQRTicket?: (ticketData: any) => void;
}

// Updated QR data structure to match QRTicket format
interface QRData {
  id: string; // Changed from ticketId to id to match QRTicket
  studentId: string;
  studentName: string;
  timestamp: string; // Changed from checkoutTime to timestamp to match QRTicket
  purpose: string; // Added purpose field to match QRTicket
  status: 'active' | 'scanned' | 'expired'; // Updated status values to match QRTicket
  books?: any[]; // Optional books array for checkout-specific QRs
  expiresAt?: string; // Optional expiry for checkout QRs
}

export function BookCart({ cartItems, onUpdateCart, onNavigateToQRTicket }: BookCartProps) {
  const [showQRDisplay, setShowQRDisplay] = useState(false);
  const [currentQR, setCurrentQR] = useState<QRData | null>(null);

  // Mock book data - in real app, this would be fetched based on cart item IDs
  const allBooks = [
    {
      id: '1',
      title: 'Introduction to Computer Science',
      author: 'John Smith',
      isbn: '978-0-123456-78-9',
      category: 'Computer Science',
      location: 'Section A, Shelf 2',
    },
    {
      id: '3',
      title: 'Modern Physics',
      author: 'Robert Johnson',
      isbn: '978-0-123456-80-2',
      category: 'Physics',
      location: 'Section B, Shelf 1',
    },
    {
      id: '4',
      title: 'Organic Chemistry',
      author: 'Maria Garcia',
      isbn: '978-0-123456-81-9',
      category: 'Chemistry',
      location: 'Section C, Shelf 2',
    },
    {
      id: '6',
      title: 'World History',
      author: 'Sarah Brown',
      isbn: '978-0-123456-83-3',
      category: 'History',
      location: 'Section E, Shelf 3',
    },
  ];

  const cartBooks = allBooks.filter(book => cartItems.includes(book.id));

  const removeFromCart = (bookId: string, bookTitle: string) => {
    const newCartItems = cartItems.filter(id => id !== bookId);
    onUpdateCart(newCartItems);
    toast.success(`"${bookTitle}" removed from cart`);
  };

  const clearCart = () => {
    onUpdateCart([]);
    toast.success('Cart cleared');
  };

  const handleCheckout = () => {
    if (cartBooks.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Generate checkout QR using same format as QRTicket
    const ticketId = 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const currentTime = new Date().toISOString();
    
    const checkout: QRData = {
      id: ticketId, // Using same format as QRTicket
      studentId: 'ST-001',
      studentName: 'Alex Johnson',
      timestamp: currentTime, // Using same field name as QRTicket
      purpose: 'book-checkout', // Specific purpose for checkout
      status: 'active', // Using same status values as QRTicket
      books: cartBooks, // Additional field for book checkout
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes expiry
    };

    // Show QR immediately
    setCurrentQR(checkout);
    setShowQRDisplay(true);
    
    // Clear cart
    onUpdateCart([]);
    
    toast.success('QR code generated! Show this to the librarian to complete checkout.');
  };

  const getReturnDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14); // 14 days from now
    return date.toLocaleDateString();
  };

  // Use same QR generation format as QRTicket
  const generateQRCode = (data: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data)}`;
  };

  const handleQRClose = () => {
    setShowQRDisplay(false);
    if (currentQR && onNavigateToQRTicket) {
      onNavigateToQRTicket(currentQR);
    }
    setCurrentQR(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2 flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            My Cart
          </h1>
          <p className="text-muted-foreground">Review and checkout your selected books.</p>
        </div>
        <div className="flex gap-2">
          {cartBooks.length > 0 && (
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
          )}
        </div>
      </div>

      {cartBooks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-4">Add books from the catalog to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Cart Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Checkout Summary</CardTitle>
              <CardDescription>
                {cartBooks.length} book(s) selected for borrowing
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
                <Button onClick={handleCheckout} className="flex-1">
                  Checkout & Generate QR
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cart Items */}
          <div className="space-y-4">
            <h3 className="text-lg">Selected Books</h3>
            {cartBooks.map((book) => (
              <Card key={book.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="line-clamp-1 mb-1">{book.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>ISBN: {book.isbn}</span>
                        <span>Category: {book.category}</span>
                        <span>Location: {book.location}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(book.id, book.title)}
                      className="shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                    src={generateQRCode(JSON.stringify(currentQR))}
                    alt="QR Borrow Ticket"
                    className="w-40 h-40"
                  />
                </div>
              </div>
              
              {/* Ticket Information Card */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-xs text-orange-700 font-medium mb-1">Ticket ID</div>
                    <div className="font-mono text-xs bg-white px-2 py-1 rounded border">{currentQR.id}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-orange-700 font-medium mb-1">Books</div>
                    <div className="text-xs bg-white px-2 py-1 rounded border font-medium">
                      {currentQR.books?.length || 0} item(s)
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-orange-200 rounded-lg p-2">
                  <div className="flex items-center justify-center gap-2 text-xs text-orange-600">
                    <Clock className="h-3 w-3" />
                    <span>Generated: {new Date(currentQR.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Books List */}
              {currentQR.books && currentQR.books.length > 0 && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-3">
                  <h4 className="text-sm font-medium text-teal-700 mb-2 text-center">Books to Checkout</h4>
                  <div className="space-y-2 max-h-24 overflow-y-auto">
                    {currentQR.books.map((book: any, index: number) => (
                      <div key={book.id} className="bg-white p-2 rounded-lg border border-teal-100">
                        <div className="text-xs font-medium text-gray-900">{book.title}</div>
                        <div className="text-xs text-gray-600">by {book.author}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <Button onClick={handleQRClose} className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700">
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