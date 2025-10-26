import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { QrCode, Download, BookOpen, Monitor, Gamepad2 } from 'lucide-react';
import type { User } from '../../App';

interface QRTicketProps {
  user: User;
  ticketData?: any;
}

export function QRTicket({ user, ticketData: externalTicketData }: QRTicketProps) {
  const [defaultTicketData] = useState({
    id: 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    studentId: user.id,
    studentName: user.name,
    timestamp: new Date().toISOString(),
    purpose: 'book-borrowing',
    status: 'active',
  });

  const ticketData = externalTicketData || defaultTicketData;

  const getPurposeDisplay = (purpose: string) => {
    switch (purpose) {
      case 'book-checkout':
        return 'Book Checkout';
      case 'equipment-checkout':
        return 'Equipment Checkout';
      case 'book-equipment-checkout':
        return 'Book & Equipment Checkout';
      case 'book-borrowing':
        return 'Book Borrowing';
      default:
        return 'Library Access';
    }
  };

  const downloadTicket = () => {
    // In a real app, this would generate a downloadable QR code
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(ticketData, null, 2)], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `qr-ticket-${ticketData.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Generate QR code URL using QR Server API - same format as BookCart
  const generateQRCode = (data: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data)}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2 flex items-center gap-2">
          <QrCode className="h-6 w-6" />
          QR Borrow Ticket
        </h1>
        <p className="text-muted-foreground">Your QR code for book borrowing and library access.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Display */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Your QR Ticket</CardTitle>
            <CardDescription>Present this to the librarian</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className={`bg-white p-6 rounded-lg border-2 ${ticketData.status === 'expired' ? 'border-red-200 opacity-50' : 'border-gray-200'} flex justify-center relative`}>
              <img
                src={generateQRCode(JSON.stringify(ticketData))}
                alt="QR Borrow Ticket"
                className="w-64 h-64"
              />
              {ticketData.status === 'expired' && (
                <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <div className="bg-red-500 text-white px-3 py-2 rounded text-sm font-medium">
                    EXPIRED
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="text-center">
                <Badge variant="outline" className="text-sm">
                  Ticket ID: {ticketData.id}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Generated: {new Date(ticketData.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="flex justify-center">
              <Button onClick={downloadTicket} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Ticket Information */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
            <CardDescription>Information encoded in your QR ticket</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Student ID:</span>
                <span className="text-sm">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Name:</span>
                <span className="text-sm">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="text-sm truncate ml-2">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Purpose:</span>
                <span className="text-sm">{getPurposeDisplay(ticketData.purpose)}</span>
              </div>
              {ticketData.books && ticketData.books.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Books:</span>
                  <span className="text-sm">{ticketData.books.length} book(s)</span>
                </div>
              )}
              {ticketData.equipment && ticketData.equipment.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Equipment:</span>
                  <span className="text-sm">{ticketData.equipment.length} item(s)</span>
                </div>
              )}
              {ticketData.expiresAt && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Expires:</span>
                  <span className={`text-sm ${ticketData.status === 'expired' ? 'text-red-600' : ''}`}>
                    {new Date(ticketData.expiresAt).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <div className="text-center">
                  <Badge variant={ticketData.status === 'expired' ? 'destructive' : 'default'}>
                    {ticketData.status ? ticketData.status.toUpperCase() : 'ACTIVE'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm mb-2">How to use:</h4>
              <ol className="text-xs text-muted-foreground space-y-1">
                <li>1. Show this QR code to the librarian</li>
                <li>2. They will scan it to verify your identity</li>
                <li>3. Proceed with book borrowing or return</li>
                <li>4. Use cart checkout for specific book borrowing</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items List - show books and equipment */}
      {((ticketData.books && ticketData.books.length > 0) || (ticketData.equipment && ticketData.equipment.length > 0)) && (
        <Card>
          <CardHeader>
            <CardTitle>Items in this Checkout</CardTitle>
            <CardDescription>Books and equipment included in this QR ticket</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Books */}
              {ticketData.books && ticketData.books.map((book: any, index: number) => (
                <div key={`book-${book.id}`} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <h4 className="text-sm font-medium line-clamp-1">{book.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">by {book.author}</p>
                      <p className="text-xs text-muted-foreground">ISBN: {book.isbn}</p>
                    </div>
                    <Badge variant="outline" className="text-xs ml-2">
                      Book #{index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {/* Equipment */}
              {ticketData.equipment && ticketData.equipment.map((item: any, index: number) => (
                <div key={`equipment-${item.id}`} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {item.type === 'computer' ? <Monitor className="h-4 w-4 text-muted-foreground" /> : <Gamepad2 className="h-4 w-4 text-muted-foreground" />}
                        <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                      <p className="text-xs text-muted-foreground">Location: {item.location}</p>
                    </div>
                    <Badge variant="outline" className="text-xs ml-2">
                      Equipment #{index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="text-green-600">✓ Valid for:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Book borrowing and returns</li>
                <li>• Library access verification</li>
                <li>• Attendance recording</li>
                <li>• Study room reservations</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-red-600">⚠ Remember:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Use cart checkout for specific books</li>
                <li>• Don't share your QR code with others</li>
                <li>• Have your student ID as backup</li>
                <li>• Checkout tickets expire in 15 minutes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}