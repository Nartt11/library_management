"use client";
import React, { useState, useEffect, useRef } from "react";
import jsQR from "jsqr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Input } from "../../../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import {
  PackageCheck,
  User,
  Calendar,
  BookOpen,
  Scan,
  ChevronLeft,
  ChevronRight,
  QrCode,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import { BorrowRequestDto } from "../../../../types/borrow-request";
import { getActiveBorrows, returnBookCopy } from "../../../../services/borrow-request";
import { parseBarcode } from "../../../../services/barcode";

export default function ReturnBooksPage() {
  const [borrows, setBorrows] = useState<BorrowRequestDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState<BorrowRequestDto | null>(null);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [bookCopyId, setBookCopyId] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Scanner states
  const [showReturnScanner, setShowReturnScanner] = useState(false);
  const [returnManualInput, setReturnManualInput] = useState("");
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnResult, setReturnResult] = useState<{ bookTitle?: string; memberName?: string; message?: string } | null>(null);
  const [showReturnResult, setShowReturnResult] = useState(false);

  // Refs for camera
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    fetchActiveBorrows();
  }, [pageNumber]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Camera functions
  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const scanQRCode = () => {
    if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code && code.data) {
          setReturnManualInput(code.data);
          setTimeout(() => processReturnScannedCode(code.data), 500);
        }
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        scanIntervalRef.current = window.setInterval(scanQRCode, 300);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera');
    }
  };

  const openReturnScanner = () => {
    setReturnManualInput("");
    setShowReturnScanner(true);
    setTimeout(() => startCamera(), 100);
  };

  const processReturnScannedCode = async (barcodeData: string) => {
    const bookCopyId = parseBarcode(barcodeData);
    if (!bookCopyId) {
      toast.error('Invalid QR code format. Expected: COPY-{id}');
      return;
    }

    try {
      setReturnLoading(true);
      const resp = await returnBookCopy({ bookCopyId });
      // Expecting response { bookTitle, memberName, message }
      setReturnResult({
        bookTitle: resp?.bookTitle || resp?.book?.title,
        memberName: resp?.memberName || resp?.member?.name,
        message: resp?.message || 'Returned successfully',
      });
      setShowReturnResult(true);
      // stop camera and close scanner dialog
      stopCamera();
      setShowReturnScanner(false);
      fetchActiveBorrows(); // Refresh list
    } catch (err: any) {
      console.error('Return error:', err);
      toast.error(err?.message || 'Failed to process return');
    } finally {
      setReturnLoading(false);
    }
  };

  const handleReturnManualSubmit = () => {
    if (returnManualInput.trim()) {
      processReturnScannedCode(returnManualInput.trim());
    }
  };

  const fetchActiveBorrows = async () => {
    try {
      setLoading(true);
      const response = await getActiveBorrows(pageNumber, pageSize);
      setBorrows(response.data || []);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching active borrows:', error);
      toast.error('Failed to load borrowed books');
    } finally {
      setLoading(false);
    }
  };

  const openReturnDialog = (borrow: BorrowRequestDto, copyId?: string) => {
    setSelectedBorrow(borrow);
    setBookCopyId(copyId || "");
    setShowReturnDialog(true);
  };

  const handleReturn = async () => {
    if (!bookCopyId.trim()) {
      toast.error('Please enter or scan a book copy ID');
      return;
    }

    try {
      setLoading(true);
      await returnBookCopy({ bookCopyId });
      toast.success('Book returned successfully');
      setShowReturnDialog(false);
      setSelectedBorrow(null);
      setBookCopyId("");
      fetchActiveBorrows();
    } catch (error: any) {
      console.error('Error returning book:', error);
      toast.error(error?.message || 'Failed to return book');
    } finally {
      setLoading(false);
    }
  };

  const isOverdue = (confirmedAt?: string) => {
    if (!confirmedAt) return false;
    const dueDate = new Date(confirmedAt);
    dueDate.setDate(dueDate.getDate() + 14);
    return new Date() > dueDate;
  };

  const getDueDate = (confirmedAt?: string) => {
    if (!confirmedAt) return 'N/A';
    const dueDate = new Date(confirmedAt);
    dueDate.setDate(dueDate.getDate() + 14);
    return dueDate.toLocaleDateString();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2 flex items-center gap-2">
            <PackageCheck className="h-6 w-6" />
            Return Books
          </h1>
          <p className="text-muted-foreground">Manage book returns from borrowers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={openReturnScanner}>
            <QrCode className="h-4 w-4 mr-1" />
            Return by Scan
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Borrowed Books</CardTitle>
          <CardDescription>{borrows.length} active borrow(s) found</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : borrows.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No active borrowed books</div>
          ) : (
            <>
              <div className="space-y-4">
                {borrows.map((borrow) => (
                  <Card key={borrow.id} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="font-medium truncate">{borrow.memberName}</div>
                              <div className="text-xs text-muted-foreground truncate">{borrow.memberEmail}</div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <div className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                              <Calendar className="h-3 w-3" />
                              Due: {getDueDate(borrow.confirmedAt)}
                            </div>
                            {isOverdue(borrow.confirmedAt) && (
                              <Badge variant="destructive" className="text-xs mt-1">Overdue</Badge>
                            )}
                          </div>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[40%]">Book</TableHead>
                                <TableHead className="w-[25%]">ISBN</TableHead>
                                <TableHead className="w-[20%]">Copy ID</TableHead>
                                <TableHead className="w-[15%]">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {borrow.items.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell className="max-w-0">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                      <span className="font-medium truncate">{item.bookTitle}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-sm text-muted-foreground truncate">{item.bookISBN}</TableCell>
                                  <TableCell>
                                    <code className="text-xs bg-muted px-2 py-1 rounded whitespace-nowrap">
                                      {item.bookCopyId || 'N/A'}
                                    </code>
                                  </TableCell>
                                  <TableCell>
                                    {item.isConfirmed && item.bookCopyId && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openReturnDialog(borrow, item.bookCopyId)}
                                        className="whitespace-nowrap"
                                      >
                                        <PackageCheck className="h-3 w-3 mr-1" />
                                        Return
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">Page {pageNumber} of {totalPages}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber === 1}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))} disabled={pageNumber === totalPages}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Return Scanner Dialog */}
      <Dialog open={showReturnScanner} onOpenChange={(open) => { if (!open) { stopCamera(); setShowReturnScanner(false); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Return Book Copy - Scan QR</DialogTitle>
            <DialogDescription>
              Scan the book copy QR to process return or enter the code manually
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="border-4 border-indigo-500 w-64 h-64 rounded-lg"></div>
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-400 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-400 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-400 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-400 rounded-br-lg"></div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Or enter QR code data manually:</label>
              <div className="flex gap-2">
                <Input
                  placeholder="COPY-{book-copy-id}"
                  value={returnManualInput}
                  onChange={(e) => setReturnManualInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && returnManualInput.trim()) {
                      handleReturnManualSubmit();
                    }
                  }}
                />
                <Button onClick={handleReturnManualSubmit} disabled={!returnManualInput.trim() || returnLoading}>
                  {returnLoading ? 'Processing...' : 'Submit'}
                </Button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              After a successful return, a confirmation with the book and member details will be shown.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { stopCamera(); setShowReturnScanner(false); }}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Result Dialog */}
      <Dialog open={showReturnResult} onOpenChange={setShowReturnResult}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-green-600" />
              Return Successful
            </DialogTitle>
            <DialogDescription>
              Book has been returned successfully
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 p-2">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm font-medium text-green-900 mb-2">{returnResult?.message}</div>
              <div className="space-y-1">
                <div className="text-sm"><span className="font-medium">Book:</span> {returnResult?.bookTitle || 'N/A'}</div>
                <div className="text-sm"><span className="font-medium">Member:</span> {returnResult?.memberName || 'N/A'}</div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReturnResult(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Book</DialogTitle>
            <DialogDescription>Scan or enter the book copy ID to process return</DialogDescription>
          </DialogHeader>

          {selectedBorrow && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-lg text-sm">
                <div className="font-medium truncate">Borrower: {selectedBorrow.memberName}</div>
                <div className="text-muted-foreground text-xs truncate">{selectedBorrow.memberEmail}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Book Copy ID</label>
                <div className="flex gap-2 items-center">
                  <Scan className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    placeholder="Scan or enter Book Copy ID"
                    value={bookCopyId}
                    onChange={(e) => setBookCopyId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && bookCopyId.trim() && handleReturn()}
                    autoFocus
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReturnDialog(false)}>Cancel</Button>
            <Button onClick={handleReturn} disabled={loading || !bookCopyId.trim()}>
              {loading ? 'Processing...' : 'Confirm Return'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
