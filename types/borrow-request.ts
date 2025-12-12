export interface BorrowRequestDto {
  id: string;
  memberId: string;
  memberName?: string;
  memberEmail?: string;
  staffId?: string;
  staffName?: string;
  bookId: string;
  bookTitle?: string;
  bookISBN?: string;
  bookImageUrl?: string;
  bookCopyId?: string;
  createdAt: string;
  confirmedAt?: string;
  borrowDate?: string;
  dueDate?: string;
  returnedAt?: string;
  status: string;
  qrCode?: string;
  notes?: string;
  isOverdue: boolean;
}

export interface ConfirmBorrowRequestPayload {
  requestId: string;
  bookCopyId: string;
}

export interface RejectBorrowRequestPayload {
  reason: string;
}

export interface ReturnBookPayload {
  bookCopyId: string;
}

export interface PaginatedBorrowRequests {
  data: BorrowRequestDto[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
