import { getApi, postApi, putApi } from "./base";
import { 
  BorrowRequestDto, 
  PaginatedBorrowRequests,
  ConfirmBorrowRequestPayload,
  RejectBorrowRequestPayload,
  ReturnBookPayload
} from "../types/borrow-request";
// GET /api/borrow-requests - Admin: Get paginated borrow requests by type
export async function getBorrowRequests(
  pageNumber: number = 1,
  pageSize: number = 10,
  type: 'pending' | 'borrowed' | 'overdue' = 'pending'
): Promise<PaginatedBorrowRequests> {
  const url = `/borrow-requests/${type}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  return await getApi<PaginatedBorrowRequests>(url);
}

// GET /api/borrow-requests/my-requests - Student: Get my requests with pagination
export async function getMyBorrowRequests(
  pageNumber: number = 1,
  pageSize: number = 20
): Promise<PaginatedBorrowRequests> {
  return await getApi<PaginatedBorrowRequests>(`/borrow-requests/my-requests?pageNumber=${pageNumber}&pageSize=${pageSize}`);
}

// GET /api/borrow-requests/{id} - Get single request details
export async function getBorrowRequestById(id: string): Promise<BorrowRequestDto> {
  return await getApi<BorrowRequestDto>(`/borrow-requests/${id}`);
}

// POST /api/borrow-requests/confirm - Admin: Confirm request with book copies
export async function confirmBorrowRequest(
  payload: ConfirmBorrowRequestPayload
): Promise<BorrowRequestDto> {
  return await postApi<BorrowRequestDto>('/borrow-requests/confirm', payload);
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

// GET /api/borrow-requests/active-borrows - Admin: Get active borrowed books
export async function getActiveBorrows(
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PaginatedBorrowRequests> {
  return await getApi<PaginatedBorrowRequests>(
    `/borrow-requests/borrowed?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
}

// GET /api/borrow-requests/member/{memberId} - Admin: Get member's borrow requests
export async function getMemberBorrowRequests(
  memberId: string,
  pageNumber: number = 1,
  pageSize: number = 20
): Promise<PaginatedBorrowRequests> {
  return await getApi<PaginatedBorrowRequests>(
    `/borrow-requests/member/${memberId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
}

// GET /api/borrow-requests/search-members - Admin: Search for members by name, email, or phone
export async function searchMembers(searchTerm: string): Promise<any[]> {
  return await getApi<any[]>(`/borrow-requests/search-members?searchTerm=${encodeURIComponent(searchTerm)}`);
}

// POST /api/borrow-requests/admin-create - Admin: Create borrow request for a member
export async function adminCreateBorrowRequest(payload: {
  memberId: string;
  bookCopyIds: string[];
  notes?: string;
}): Promise<BorrowRequestDto> {
  return await postApi<BorrowRequestDto>('/borrow-requests/admin-create', payload);
}
