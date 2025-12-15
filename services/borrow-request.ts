import { getApi, postApi, putApi } from "./base";
import { 
  BorrowRequestDto, 
  PaginatedBorrowRequests,
  ConfirmBorrowRequestPayload,
  RejectBorrowRequestPayload,
  ReturnBookPayload
} from "../types/borrow-request";
// GET /api/borrow-requests - Admin: Get paginated borrow requests with optional status filter
export async function getBorrowRequests(
  pageNumber: number = 1,
  pageSize: number = 10,
  status?: 'Pending' | 'Borrowed' | 'Overdue' | 'Returned' | 'OverdueReturned' | 'Rejected' | 'Cancelled'
): Promise<PaginatedBorrowRequests> {
  let url = `/borrow-requests?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  if (status) {
    url += `&status=${status}`;
  }
  return await getApi<PaginatedBorrowRequests>(url);
}

// GET /api/borrow-requests/my-requests - Student: Get my requests with pagination and optional status filter
export async function getMyBorrowRequests(
  pageNumber: number = 1,
  pageSize: number = 20,
  status?: 'Pending' | 'Borrowed' | 'Overdue' | 'Returned' | 'OverdueReturned' | 'Rejected' | 'Cancelled'
): Promise<PaginatedBorrowRequests> {
  let url = `/borrow-requests/my-requests?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  if (status) {
    url += `&status=${status}`;
  }
  return await getApi<PaginatedBorrowRequests>(url);
}

// GET /api/borrow-requests/my-history - Student: Get my completed requests (Returned or OverdueReturned)
export async function getMyHistory(
  pageNumber: number = 1,
  pageSize: number = 20
): Promise<PaginatedBorrowRequests> {
  return await getApi<PaginatedBorrowRequests>(`/borrow-requests/my-history?pageNumber=${pageNumber}&pageSize=${pageSize}`);
}

// GET /api/borrow-requests/{id} - Get single request details
export async function getBorrowRequestById(id: string): Promise<BorrowRequestDto> {
  return await getApi<BorrowRequestDto>(`/borrow-requests/${id}`);
}

// GET /api/borrow-requests/qr/{qrCode} - Staff: Get request by QR code
export async function getRequestByQR(qrCode: string): Promise<BorrowRequestDto> {
  return await getApi<BorrowRequestDto>(`/borrow-requests/qr/${qrCode}`);
}

// POST /api/borrow-requests/confirm - Staff: Confirm request with single book copy
export async function confirmBorrowRequest(
  payload: ConfirmBorrowRequestPayload
): Promise<{ message: string }> {
  return await postApi<{ message: string }>('/borrow-requests/confirm', payload);
}

// PUT /api/borrow-requests/{id}/reject - Admin: Reject request
export async function rejectBorrowRequest(
  id: string,
  payload: RejectBorrowRequestPayload
): Promise<BorrowRequestDto> {
  return await putApi<BorrowRequestDto>(`/borrow-requests/${id}/reject`, payload);
}

// POST /api/borrow-requests/return - Admin: Return a book copy
export async function returnBookCopy(payload: ReturnBookPayload): Promise<any> {
  return await postApi<any>('/borrow-requests/return', payload);
}

// GET /api/borrow-requests - Admin: Get active borrowed books (using status=Borrowed)
export async function getActiveBorrows(
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PaginatedBorrowRequests> {
  return await getApi<PaginatedBorrowRequests>(
    `/borrow-requests?status=Borrowed&pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
}

// GET /api/borrow-requests/member/{memberId} - Admin: Get member's borrow requests with optional status filter
export async function getMemberBorrowRequests(
  memberId: string,
  pageNumber: number = 1,
  pageSize: number = 20,
  status?: 'Pending' | 'Borrowed' | 'Overdue' | 'Returned' | 'OverdueReturned' | 'Rejected' | 'Cancelled'
): Promise<PaginatedBorrowRequests> {
  let url = `/borrow-requests/member/${memberId}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  if (status) {
    url += `&status=${status}`;
  }
  return await getApi<PaginatedBorrowRequests>(url);
}

// GET /api/borrow-requests/search-members - Admin: Search for members by name, email, or phone
export async function searchMembers(searchTerm: string): Promise<any[]> {
  return await getApi<any[]>(`/borrow-requests/search-members?searchTerm=${encodeURIComponent(searchTerm)}`);
}

// POST /api/borrow-requests/admin-create - Admin: Create and confirm borrow request immediately
export async function adminCreateBorrowRequest(payload: {
  memberId: string;
  bookCopyId: string;
  notes?: string;
}): Promise<BorrowRequestDto> {
  return await postApi<BorrowRequestDto>('/borrow-requests/admin-create', payload);
}
