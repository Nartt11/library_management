export interface BorrowRequestDto {
  id: string;
  memberId: string;
  memberName?: string;
  memberEmail?: string;
  staffId?: string;
  staffName?: string;
  createdAt: string;
  confirmedAt?: string;
  status: string;
  qrCode?: string;
  notes?: string;
  items: BorrowRequestItemDto[];
}

export interface BorrowRequestItemDto {
  id: string;
  bookId: string;
  bookTitle?: string;
  bookISBN?: string;
  bookCopyId?: string;
  isConfirmed: boolean;
}

export interface BookCopyAssignment {
  bookId: string;
  bookCopyId: string;
}

export interface ConfirmBorrowRequestPayload {
  requestId: string;
  bookCopyAssignments: BookCopyAssignment[];
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
