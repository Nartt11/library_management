"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  Calendar,
  BookOpen,
  QrCode,
  FileText,
  Search,
  Filter,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { BorrowRequestDto } from "../../../../types/borrow-request";
import { getMyBorrowRequests } from "../../../../services/borrow-request";
import { getBookById } from "../../../../services/book";

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<BorrowRequestDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BorrowRequestDto | null>(null);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showBookDetailDialog, setShowBookDetailDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [loadingBook, setLoadingBook] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchMyRequests();
    }
  }, [mounted, pageNumber]);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const response = await getMyBorrowRequests(pageNumber, pageSize);
      setRequests(response.data || []);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (error) {
      console.error('Error fetching my requests:', error);
      toast.error('Failed to load your borrow requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'borrowed':
      case 'confirmed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Borrowed
          </Badge>
        );
      case 'overdue':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      case 'returned':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Returned
          </Badge>
        );
      case 'overduereturned':
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <Clock className="h-3 w-3 mr-1" />
            Late Return
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const generateQRCode = (qrCodeData: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCodeData)}`;
  };

  const handleViewQR = (request: BorrowRequestDto) => {
    setSelectedRequest(request);
    setShowQRDialog(true);
  };

  const getDueDate = (confirmedAt?: string) => {
    if (!confirmedAt || !mounted) return 'N/A';
    const borrowDate = new Date(confirmedAt);
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 14);
    return dueDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewBookDetail = async (bookId: string) => {
    try {
      setLoadingBook(true);
      setShowBookDetailDialog(true);
      const bookData = await getBookById(bookId);
      setSelectedBook(bookData);
    } catch (error: any) {
      console.error('Error fetching book details:', error);
      toast.error(error?.message || 'Failed to load book details');
      setShowBookDetailDialog(false);
    } finally {
      setLoadingBook(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: totalItems,
    pending: requests.filter(r => r.status === 'Pending').length,
    borrowed: requests.filter(r => r.status === 'Borrowed' || r.status === 'Confirmed').length,
    overdue: requests.filter(r => r.status === 'Overdue').length,
    returned: requests.filter(r => r.status === 'Returned' || r.status === 'OverdueReturned').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            My Borrow Requests
          </h1>
          <p className="text-muted-foreground">
            View your borrow request history and status
          </p>
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
                <FileText className="h-5 w-5 text-orange-600" />
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
                placeholder="Search by book title or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 shadow-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 shadow-sm">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Borrowed">Borrowed</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Returned">Returned (On Time)</SelectItem>
                <SelectItem value="OverdueReturned">Returned (Late)</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="All">All Status</SelectItem>
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
            My Requests
          </CardTitle>
          <CardDescription>Showing {filteredRequests.length} of {requests.length} requests</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-muted-foreground">Loading your requests...</div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredRequests.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No requests found</h3>
                  <p className="text-muted-foreground">
                    {requests.length === 0 
                      ? "Create a borrow request from your cart to see it here."
                      : "Try adjusting your search criteria"}
                  </p>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <div key={request.id} className="p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                              <h4 className="font-medium">Request #{request.id.slice(0, 8)}</h4>
                            </div>

                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(request.status)}
                            {/* {request.qrCode && request.status === 'Confirmed' && (
                              // <button 
                              //   className="p-2 hover:bg-muted rounded-lg transition-colors"
                              //   onClick={() => handleViewQR(request)}
                              // >
                              //   <QrCode className="h-5 w-5 text-primary" />
                              // </button>
                            )} */}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-2.5 rounded-lg">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Calendar className="h-3 w-3 text-orange-600 shrink-0" />
                              <span className="text-xs font-medium text-orange-800">Created</span>
                            </div>
                            <p className="text-xs font-medium text-orange-900 whitespace-nowrap">
                              {mounted && new Date(request.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-2.5 rounded-lg">
                            <div className="flex items-center gap-1.5 mb-1">
                              <CheckCircle className="h-3 w-3 text-green-600 shrink-0" />
                              <span className="text-xs font-medium text-green-800">Confirmed</span>
                            </div>
                            <p className="text-xs font-medium text-green-900 whitespace-nowrap">
                              {request.confirmedAt && mounted ? new Date(request.confirmedAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              }) : ''}
                            </p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2.5 rounded-lg">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Clock className="h-3 w-3 text-blue-600 shrink-0" />
                              <span className="text-xs font-medium text-blue-800">Due Date</span>
                            </div>
                            <p className="text-xs font-medium text-blue-900 whitespace-nowrap">
                              {request.dueDate && mounted ? new Date(request.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
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

                        {request.notes && (
                          <div className="mt-4 bg-muted/50 p-3 rounded-lg">
                            <div className="text-xs font-medium text-muted-foreground mb-1">Notes</div>
                            <p className="text-sm">{request.notes}</p>
                          </div>
                        )}

                        {/* Book Info */}
                        <div className="mt-4">
                          <div className="text-sm font-medium mb-2">Book</div>
                          <div 
                            className="flex items-center gap-3 p-2 border rounded-lg bg-card text-sm hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => request.bookId && handleViewBookDetail(request.bookId)}
                          >
                            {request.bookImageUrl ? (
                              <img 
                                src={request.bookImageUrl} 
                                alt={request.bookTitle || 'Book'}
                                className="w-12 h-16 object-cover rounded shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{request.bookTitle}</div>
                              <div className="text-xs text-muted-foreground">ISBN: {request.bookISBN}</div>
                            </div>
                            {request.bookCopyId && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs shrink-0">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Copy: {request.bookCopyId}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Book Detail Dialog */}
      <Dialog open={showBookDetailDialog} onOpenChange={setShowBookDetailDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Book Details
            </DialogTitle>
          </DialogHeader>

          {loadingBook ? (
            <div className="p-8 text-center">
              <div className="text-muted-foreground">Loading book details...</div>
            </div>
          ) : selectedBook ? (
            <div className="space-y-4">
              <div className="flex gap-4">
                {selectedBook.imgUrl && (
                  <img 
                    src={selectedBook.imgUrl} 
                    alt={selectedBook.title}
                    className="w-32 h-48 object-cover rounded-lg shadow-sm"
                  />
                )}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedBook.title}</h3>
                    {selectedBook.authors && selectedBook.authors.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedBook.authors.map((author: any) => author.name).join(', ')}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">ISBN</div>
                      <div className="text-sm font-medium">{selectedBook.isbn}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Publisher</div>
                      <div className="text-sm font-medium">{selectedBook.publisher || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Published Year</div>
                      <div className="text-sm font-medium">{selectedBook.publicationYear || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Available Copies</div>
                      <div className="text-sm font-medium text-green-600">{selectedBook.availableCopiesCount || 0}</div>
                    </div>
                  </div>

                  {selectedBook.bookCategories && selectedBook.bookCategories.length > 0 && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Categories</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedBook.bookCategories.map((cat: any, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">{cat.name}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedBook.description && (
                <div>
                  <div className="text-sm font-medium mb-2">Description</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedBook.description}</p>
                </div>
              )}

              {selectedBook.authors && selectedBook.authors.length > 0 && (
                <div className="border-t pt-3">
                  <div className="text-sm font-medium mb-2">Authors</div>
                  <div className="space-y-2">
                    {selectedBook.authors.map((author: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-sm font-medium">{author.name}</div>
                          {author.yearOfBirth && (
                            <div className="text-xs text-muted-foreground">Born: {author.yearOfBirth}</div>
                          )}
                          {author.briefDescription && (
                            <div className="text-xs text-muted-foreground mt-1">{author.briefDescription}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-muted-foreground">No book details available</div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookDetailDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {pageNumber} of {totalPages} ({totalItems} total requests)
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
    
    </div> 
  );
}
// {/* QR Code Dialog */}
//       <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
//         <DialogContent className="max-w-md">
//           <DialogHeader className="text-center pb-3">
//             <div className="mx-auto w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mb-2">
//               <QrCode className="h-5 w-5 text-white" />
//             </div>
//             <DialogTitle className="text-lg">
//               Borrow Ticket QR Code
//             </DialogTitle>
//             <DialogDescription className="text-sm text-muted-foreground">
//               Present this QR code to the librarian
//             </DialogDescription>
//           </DialogHeader>

//           {selectedRequest && selectedRequest.qrCode && (
//             <div className="space-y-4">
//               {/* QR Code Display */}
//               <div className="flex justify-center">
//                 <div className="bg-white w-48 h-48 p-4 rounded-xl shadow-sm border-2 border-green-100">
//                   <img
//                     src={generateQRCode(selectedRequest.qrCode)}
//                     alt="QR Borrow Ticket"
//                     className="w-40 h-40"
//                   />
//                 </div>
//               </div>

//               {/* Ticket Information */}
//               <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-xl p-3 space-y-3">
//                 <div className="text-center">
//                   <div className="text-xs text-green-700 font-medium mb-1">
//                     Request ID
//                   </div>
//                   <div className="font-mono text-xs bg-white px-2 py-1 rounded border break-all">
//                     {selectedRequest.id}
//                   </div>
//                 </div>

//                 <div className="text-center">
//                   <div className="text-xs text-green-700 font-medium mb-1">
//                     QR Code
//                   </div>
//                   <div className="font-mono text-xs bg-white px-2 py-1 rounded border break-all">
//                     {selectedRequest.qrCode}
//                   </div>
//                 </div>

//                 <div className="bg-white border border-green-200 rounded-lg p-2">
//                   <div className="flex items-center justify-center gap-2 text-xs text-green-600">
//                     <Clock className="h-3 w-3" />
//                     <span>
//                       Due: {getDueDate(selectedRequest.confirmedAt)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               {/* Books in Request */}
//               <div className="bg-muted/50 rounded-lg p-3">
//                 <div className="text-xs font-medium mb-2">Books in this request:</div>
//                 <div className="space-y-1">
//                   {selectedRequest.items.map((item) => (
//                     <div key={item.id} className="text-xs text-muted-foreground">
//                       • {item.bookTitle}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
