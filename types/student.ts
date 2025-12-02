export interface BorrowedBook {
  id: string;
  title: string;
  author: string;
  dueDate: string;
  status: 'Borrowed' | 'Overdue' | 'Returned';
}

export interface StudentDashboardData {
  booksBorrowed: number;
  daysVisited: number;
  overdueBooks: number;
  currentlyBorrowedBooks: BorrowedBook[];
}

export interface StudentStatistics {
  booksBorrowed: number;
  daysVisited: number;
  overdueBooks: number;
}

export interface BorrowingHistory {
  id: string;
  bookTitle: string;
  author: string;
  borrowDate: string;
  returnDate: string | null;
  dueDate: string;
  status: 'Borrowed' | 'Returned' | 'Overdue';
}

export interface QRTicketData {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: string;
  purpose: string;
  status: 'active' | 'scanned' | 'expired';
  bookIds?: string[]; // Array of book IDs for checkout
  expiresAt?: string;
}

export interface CheckoutResponse {
  success: boolean;
  ticketId: string;
  message?: string;
}

export interface BorrowRequestPayload {
  memberId: string;
  bookIds: string[];
  notes?: string;
}

export interface BorrowRequestResponse {
  requestId: string;
  qrCode: string;
  message: string;
}
