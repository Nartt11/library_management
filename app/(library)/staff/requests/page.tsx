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
import { Textarea } from "../../../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Camera,
  X,
  Search,
  Filter,
  FileCheck,
  QrCode,
  Plus,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { BorrowRequestDto, BookCopyAssignment } from "../../../../types/borrow-request";
import { 
  getBorrowRequests, 
  confirmBorrowRequest, 
  rejectBorrowRequest,
  searchMembers,
  adminCreateBorrowRequest
} from "../../../../services/borrow-request";
import { generateBarcodeUrl, parseBarcode } from "../../../../services/barcode";

export default function BorrowRequestsPage() {
  // State
  const [requests, setRequests] = useState<BorrowRequestDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BorrowRequestDto | null>(null);
  const [bookCopyAssignments, setBookCopyAssignments] = useState<Record<string, string>>({});
  
  // Dialog states
  const [showBookInfoDialog, setShowBookInfoDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  
  // Form states
  const [rejectReason, setRejectReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'pending' | 'borrowed' | 'overdue'>("pending");
  const [manualInput, setManualInput] = useState("");
  const [currentScanningBookId, setCurrentScanningBookId] = useState<string | null>(null);
  
  // Admin create borrow request states
  const [showAdminCreateDialog, setShowAdminCreateDialog] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [scannedBookCopyIds, setScannedBookCopyIds] = useState<string[]>([]);
  const [adminNotes, setAdminNotes] = useState("");
  const [adminCreateLoading, setAdminCreateLoading] = useState(false);
  const [showAdminScanner, setShowAdminScanner] = useState(false);
  const [adminScanInput, setAdminScanInput] = useState("");
  const [searching, setSearching] = useState(false);
  
  // Pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [borrowedCount, setBorrowedCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  // Effects
  useEffect(() => {
    fetchRequests();
  }, [pageNumber, statusFilter]);

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
          if (showAdminScanner) {
            setAdminScanInput(code.data);
            setTimeout(() => processAdminScannedCode(code.data), 500);
          } else {
            setManualInput(code.data);
            setTimeout(() => processScannedCode(code.data), 500);
          }
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

  // Scanner handlers
  const openScanner = (bookId: string) => {
    setCurrentScanningBookId(bookId);
    setManualInput("");
    setShowBarcodeScanner(true);
    setTimeout(() => startCamera(), 100);
  };

  const closeScanner = () => {
    stopCamera();
    setShowBarcodeScanner(false);
    setCurrentScanningBookId(null);
    setManualInput("");
  };

  const processScannedCode = (barcodeData: string) => {
    const bookCopyId = parseBarcode(barcodeData);
    if (bookCopyId && currentScanningBookId) {
      setBookCopyAssignments(prev => ({
        ...prev,
        [currentScanningBookId]: bookCopyId
      }));
      toast.success(`Book copy ${bookCopyId} assigned`);
      closeScanner();
    } else {
      toast.error('Invalid QR code format. Expected: COPY-{id}');
    }
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      processScannedCode(manualInput.trim());
    }
  };

  // Admin create borrow handlers
  const handleMemberSearch = async () => {
    if (!memberSearchTerm.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    try {
      setSearching(true);
      const results = await searchMembers(memberSearchTerm);
      setSearchResults(results || []);
      if (results.length === 0) {
        toast.info('No members found');
      }
    } catch (error: any) {
      console.error('Error searching members:', error);
      toast.error(error?.message || 'Failed to search members');
    } finally {
      setSearching(false);
    }
  };

  const selectMember = (member: any) => {
    setSelectedMember(member);
    setSearchResults([]);
    setMemberSearchTerm("");
  };

  const openAdminScanner = () => {
    setAdminScanInput("");
    setShowAdminScanner(true);
    setTimeout(() => startCamera(), 100);
  };

  const processAdminScannedCode = (barcodeData: string) => {
    const bookCopyId = parseBarcode(barcodeData);
    if (bookCopyId) {
      if (scannedBookCopyIds.includes(bookCopyId)) {
        toast.warning('This book copy is already added');
      } else {
        setScannedBookCopyIds(prev => [...prev, bookCopyId]);
        toast.success(`Book copy ${bookCopyId} added`);
      }
      stopCamera();
      setShowAdminScanner(false);
    } else {
      toast.error('Invalid QR code format. Expected: COPY-{id}');
    }
  };

  const handleAdminScanSubmit = () => {
    if (adminScanInput.trim()) {
      processAdminScannedCode(adminScanInput.trim());
    }
  };

  const removeBookCopy = (copyId: string) => {
    setScannedBookCopyIds(prev => prev.filter(id => id !== copyId));
  };

  const handleAdminCreateSubmit = async () => {
    if (!selectedMember) {
      toast.error('Please select a member');
      return;
    }
    if (scannedBookCopyIds.length === 0) {
      toast.error('Please scan at least one book copy');
      return;
    }

    try {
      setAdminCreateLoading(true);
      await adminCreateBorrowRequest({
        memberId: selectedMember.id,
        bookCopyIds: scannedBookCopyIds,
        notes: adminNotes.trim() || undefined,
      });
      toast.success('Borrow request created successfully');
      setShowAdminCreateDialog(false);
      resetAdminCreateDialog();
      fetchRequests();
    } catch (error: any) {
      console.error('Error creating borrow request:', error);
      toast.error(error?.message || 'Failed to create borrow request');
    } finally {
      setAdminCreateLoading(false);
    }
  };

  const resetAdminCreateDialog = () => {
    setSelectedMember(null);
    setScannedBookCopyIds([]);
    setAdminNotes("");
    setMemberSearchTerm("");
    setSearchResults([]);
    setAdminScanInput("");
  };

  // API handlers
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await getBorrowRequests(pageNumber, pageSize, statusFilter);
      setRequests(response.data || []);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
      // update aggregated stats whenever requests are fetched
      fetchStats();
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load borrow requests');
    } finally {
      setLoading(false);
    }
  };

  // Fetch aggregated counts for all types so cards always show full numbers
  const fetchStats = async () => {
    try {
      const [pending, borrowed, overdue] = await Promise.all([
        getBorrowRequests(1, 1, 'pending'),
        getBorrowRequests(1, 1, 'borrowed'),
        getBorrowRequests(1, 1, 'overdue'),
      ]);
      const p = pending.totalItems || 0;
      const b = borrowed.totalItems || 0;
      const o = overdue.totalItems || 0;
      setPendingCount(p);
      setBorrowedCount(b);
      setOverdueCount(o);
      setTotalCount(p + b + o);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleConfirm = async () => {
    if (!selectedRequest) return;

    const missingAssignments = selectedRequest.items.filter(
      item => !bookCopyAssignments[item.bookId]
    );
    if (missingAssignments.length > 0) {
      toast.error('Please assign book copies for all books');
      return;
    }

    try {
      setLoading(true);
      const assignments: BookCopyAssignment[] = selectedRequest.items.map(item => ({
        bookId: item.bookId,
        bookCopyId: bookCopyAssignments[item.bookId],
      }));

      await confirmBorrowRequest({
        requestId: selectedRequest.id,
        bookCopyAssignments: assignments,
      });

      toast.success('Borrow request confirmed successfully');
      setShowConfirmDialog(false);
      setSelectedRequest(null);
      setBookCopyAssignments({});
      fetchRequests();
    } catch (error: any) {
      console.error('Error confirming request:', error);
      toast.error(error?.message || 'Failed to confirm request');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      setLoading(true);
      await rejectBorrowRequest(selectedRequest.id, { reason: rejectReason });
      toast.success('Borrow request rejected');
      setShowRejectDialog(false);
      setSelectedRequest(null);
      setRejectReason("");
      fetchRequests();
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast.error(error?.message || 'Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  // View handlers
  const openRequestDetails = (request: BorrowRequestDto) => {
    setSelectedRequest(request);
    setShowBookInfoDialog(true);
  };

  const openRejectDialog = (request: BorrowRequestDto) => {
    setSelectedRequest(request);
    setShowRejectDialog(true);
  };

  const removeAssignment = (bookId: string) => {
    const newAssignments = { ...bookCopyAssignments };
    delete newAssignments[bookId];
    setBookCopyAssignments(newAssignments);
  };

  const proceedToConfirm = () => {
    setShowBookInfoDialog(false);
    setShowConfirmDialog(true);
  };

  // Helper functions
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Confirmed</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Prefer API-provided due date fields (dueTo or dueDate). Fallback to computing from confirmedAt.
  const formatDueDate = (request: BorrowRequestDto) => {
    const apiDue = (request as any).dueTo || (request as any).dueDate;
    if (apiDue) {
      try {
        return new Date(apiDue).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      } catch (e) {
        return String(apiDue);
      }
    }
    if (request.confirmedAt) {
      const due = new Date(request.confirmedAt);
      due.setDate(due.getDate() + 14);
      return due.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return 'N/A';
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.memberEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.items.some(item => item.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const stats = {
    total: totalCount || totalItems,
    pending: pendingCount,
    borrowed: borrowedCount,
    overdue: overdueCount,
  };

  const allBooksScanned = selectedRequest?.items.every(item => bookCopyAssignments[item.bookId]) || false;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2 flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-primary" />
            Borrow Requests
          </h1>
          <p className="text-muted-foreground">Manage student borrow requests with QR code scanning</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setShowAdminCreateDialog(true)}>
            <UserPlus className="h-4 w-4 mr-1" />
            Create Borrow Request
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-medium">{stats.total}</p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <FileCheck className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-medium text-yellow-600">{stats.pending}</p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Borrowed</p>
                <p className="text-2xl font-medium text-green-600">{stats.borrowed}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-medium text-red-600">{stats.overdue}</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filter & Search
          </CardTitle>
          <CardDescription>Find specific borrow requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by member name, email, or book title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 shadow-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'pending' | 'borrowed' | 'overdue')}>
              <SelectTrigger className="w-full md:w-48 shadow-sm">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending Requests</SelectItem>
                <SelectItem value="borrowed">Borrowed Books</SelectItem>
                <SelectItem value="overdue">Overdue Books</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Borrow Requests
          </CardTitle>
          <CardDescription>Showing {filteredRequests.length} of {requests.length} requests on this page</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-muted-foreground">Loading requests...</div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredRequests.length === 0 ? (
                <div className="p-8 text-center">
                  <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No requests found</h3>
                  <p className="text-muted-foreground">Try adjusting your search criteria</p>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <div key={request.id} className="p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="h-4 w-4 text-primary flex-shrink-0" />
                              <h4 className="font-medium">{request.memberName || 'Unknown'}</h4>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {request.memberEmail}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {request.items.length} book(s) requested
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            {getStatusBadge(request.status)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-2.5 rounded-lg">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Calendar className="h-3 w-3 text-orange-600 shrink-0" />
                              <span className="text-xs font-medium text-orange-800">Created</span>
                            </div>
                            <p className="text-xs font-medium text-orange-900 whitespace-nowrap">
                              {new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>

                          <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-2.5 rounded-lg">
                            <div className="flex items-center gap-1.5 mb-1">
                              <CheckCircle className="h-3 w-3 text-green-600 shrink-0" />
                              <span className="text-xs font-medium text-green-800">Confirmed</span>
                            </div>
                            <p className="text-xs font-medium text-green-900 whitespace-nowrap">
                              {request.confirmedAt ? new Date(request.confirmedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                            </p>
                          </div>

                          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2.5 rounded-lg">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Clock className="h-3 w-3 text-blue-600 shrink-0" />
                              <span className="text-xs font-medium text-blue-800">Due Date</span>
                            </div>
                            <p className="text-xs font-medium text-blue-900 whitespace-nowrap">
                              {formatDueDate(request)}
                            </p>
                          </div>

                          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-2.5 rounded-lg">
                            <div className="flex items-center gap-1.5 mb-1">
                              <User className="h-3 w-3 text-purple-600 shrink-0" />
                              <span className="text-xs font-medium text-purple-800">Staff</span>
                            </div>
                            <p className="text-xs font-medium text-purple-900 truncate">{request.staffName || ''}</p>
                          </div>
                        </div>

                        {/* Books List */}
                        <div className="mt-4">
                          <div className="text-sm font-medium mb-2">Books</div>
                          <div className="space-y-2">
                            {request.items.map((item) => (
                              <div 
                                key={item.id} 
                                className="flex items-center gap-3 p-2 border rounded-lg bg-card text-sm"
                              >
                                <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">{item.bookTitle || 'Unknown Book'}</div>
                                  <div className="text-xs text-muted-foreground">ISBN: {item.bookISBN || 'N/A'}</div>
                                </div>
                                {item.isConfirmed && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs shrink-0">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Confirmed
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {request.status === 'Pending' && (
                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => openRequestDetails(request)}
                            >
                              <Camera className="h-3 w-3 mr-1" />
                              View & Scan
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openRejectDialog(request)}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {pageNumber} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
              disabled={pageNumber === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))}
              disabled={pageNumber === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Book Info & Scanning Dialog */}
      <Dialog open={showBookInfoDialog} onOpenChange={setShowBookInfoDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Borrow Request Details</DialogTitle>
            <DialogDescription>
              Scan QR codes on book copies to fulfill this request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="text-sm font-medium">Member: {selectedRequest.memberName}</div>
                <div className="text-xs text-muted-foreground">{selectedRequest.memberEmail}</div>
                {selectedRequest.notes && (
                  <div className="text-xs text-muted-foreground mt-2">Notes: {selectedRequest.notes}</div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Books in Request</h4>
                {selectedRequest.items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <div className="font-medium">{item.bookTitle}</div>
                          <div className="text-xs text-muted-foreground">ISBN: {item.bookISBN}</div>
                        </div>

                        {bookCopyAssignments[item.bookId] ? (
                          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-green-900">Scanned</div>
                              <code className="text-xs text-green-700">COPY-{bookCopyAssignments[item.bookId]}</code>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeAssignment(item.bookId)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => openScanner(item.bookId)}
                          >
                            <QrCode className="h-4 w-4 mr-2" />
                            Scan Book Copy QR Code
                          </Button>
                        )}

                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="text-xs text-muted-foreground mb-2">Expected QR code format:</div>
                          <div className="bg-white p-2 rounded border text-center">
                            <img
                              src={generateBarcodeUrl('example-book-copy-id')}
                              alt="Example QR code"
                              className="w-24 h-24 mx-auto"
                            />
                            <div className="text-xs text-muted-foreground mt-1">COPY-{'{book-copy-id}'}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedRequest.items.length > 0 && allBooksScanned && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">All books scanned!</span>
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={proceedToConfirm}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Proceed to Confirm Request
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookInfoDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Scanner Dialog */}
      <Dialog open={showBarcodeScanner} onOpenChange={(open) => !open && closeScanner()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Scan Book Copy QR Code</DialogTitle>
            <DialogDescription>
              Position the QR code in front of the camera or enter manually
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
                  <div className="border-4 border-green-500 w-64 h-64 rounded-lg"></div>
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Or enter QR code data manually:</label>
              <div className="flex gap-2">
                <Input
                  placeholder="COPY-{book-copy-id}"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && manualInput.trim()) {
                      handleManualSubmit();
                    }
                  }}
                />
                <Button
                  onClick={handleManualSubmit}
                  disabled={!manualInput.trim()}
                >
                  Submit
                </Button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              💡 Tip: For testing, you can scan the example QR code shown in the book details or enter manually
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeScanner}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Create Borrow Request Dialog */}
      <Dialog open={showAdminCreateDialog} onOpenChange={(open) => { if (!open) resetAdminCreateDialog(); setShowAdminCreateDialog(open); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Create Borrow Request
            </DialogTitle>
            <DialogDescription>
              Search for a member and scan book copies to create a borrow request
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Member Search */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">1. Select Member</h4>
              {selectedMember ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-green-900">{selectedMember.name || selectedMember.fullName}</div>
                      <div className="text-xs text-green-700">{selectedMember.email}</div>
                      {selectedMember.phone && <div className="text-xs text-green-700">{selectedMember.phone}</div>}
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedMember(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, email, or phone..."
                        value={memberSearchTerm}
                        onChange={(e) => setMemberSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleMemberSearch()}
                        className="pl-10"
                      />
                    </div>
                    <Button onClick={handleMemberSearch} disabled={searching || !memberSearchTerm.trim()}>
                      {searching ? 'Searching...' : 'Search'}
                    </Button>
                  </div>
                  {searchResults.length > 0 && (
                    <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                      {searchResults.map((member) => (
                        <div
                          key={member.id}
                          className="p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => selectMember(member)}
                        >
                          <div className="font-medium">{member.name || member.fullName}</div>
                          <div className="text-xs text-muted-foreground">{member.email}</div>
                          {member.phone && <div className="text-xs text-muted-foreground">{member.phone}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Book Copy Scanning */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">2. Scan Book Copies</h4>
              <Button variant="outline" onClick={openAdminScanner} disabled={!selectedMember}>
                <QrCode className="h-4 w-4 mr-2" />
                Scan Book Copy QR Code
              </Button>
              
              {scannedBookCopyIds.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">{scannedBookCopyIds.length} book(s) scanned</div>
                  {scannedBookCopyIds.map((copyId) => (
                    <div key={copyId} className="flex items-center gap-2 p-2 border rounded-lg bg-card">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <code className="flex-1 text-xs">COPY-{copyId}</code>
                      <Button size="sm" variant="ghost" onClick={() => removeBookCopy(copyId)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">3. Notes (Optional)</label>
              <Textarea
                placeholder="Add any notes for this request..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { resetAdminCreateDialog(); setShowAdminCreateDialog(false); }}>
              Cancel
            </Button>
            <Button 
              onClick={handleAdminCreateSubmit} 
              disabled={adminCreateLoading || !selectedMember || scannedBookCopyIds.length === 0}
            >
              {adminCreateLoading ? 'Creating...' : 'Create Borrow Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Scanner Dialog */}
      <Dialog open={showAdminScanner} onOpenChange={(open) => { if (!open) { stopCamera(); setShowAdminScanner(false); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Scan Book Copy QR Code</DialogTitle>
            <DialogDescription>
              Position the QR code in front of the camera or enter manually
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
                  <div className="border-4 border-blue-500 w-64 h-64 rounded-lg"></div>
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Or enter QR code data manually:</label>
              <div className="flex gap-2">
                <Input
                  placeholder="COPY-{book-copy-id}"
                  value={adminScanInput}
                  onChange={(e) => setAdminScanInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && adminScanInput.trim()) {
                      handleAdminScanSubmit();
                    }
                  }}
                />
                <Button
                  onClick={handleAdminScanSubmit}
                  disabled={!adminScanInput.trim()}
                >
                  Submit
                </Button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              💡 Scan the QR code on the book copy or enter the code manually (format: COPY-id)
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { stopCamera(); setShowAdminScanner(false); }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Borrow Request</DialogTitle>
            <DialogDescription>
              All books have been scanned. Ready to confirm?
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="text-sm font-medium">Member: {selectedRequest.memberName}</div>
                <div className="text-xs text-muted-foreground">{selectedRequest.memberEmail}</div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Scanned Books</h4>
                {selectedRequest.items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3 space-y-2">
                    <div>
                      <div className="font-medium text-sm">{item.bookTitle}</div>
                      <div className="text-xs text-muted-foreground">ISBN: {item.bookISBN}</div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        COPY-{bookCopyAssignments[item.bookId]}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={loading}>
              {loading ? 'Confirming...' : 'Confirm Borrow Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Borrow Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={loading}>
              {loading ? 'Rejecting...' : 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}