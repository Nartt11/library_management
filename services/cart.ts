import { apiFetch } from "./base";
import { QRTicketData, CheckoutResponse, BorrowRequestResponse, BorrowRequestPayload } from "../types/student";
import { Book } from "../types/book";
import { getUserFromToken } from "./auth/authService";

// POST /api/borrow-requests - Create borrow request and get QR code
export async function createBorrowRequest(
  bookIds: string[],
  notes?: string
): Promise<BorrowRequestResponse> {
  const user = getUserFromToken();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const payload: BorrowRequestPayload = {
    memberId: user.id,
    bookIds: bookIds,
    notes: notes || "",
  };

  const response = await apiFetch<BorrowRequestResponse>("/borrow-requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response;
}

// GET /api/student/cart - Get student's cart books
export async function getCartBooks(): Promise<Book[]> {
  const data = await apiFetch<{ books: Book[] }>('/student/cart');
  return data.books ?? [];
}

// POST /api/student/cart - Add book to cart
export async function addBookToCart(bookId: string): Promise<{ success: boolean; message?: string }> {
  return await apiFetch('/student/cart/add', {
    method: 'POST',
    body: JSON.stringify({ bookId }),
  });
}

// DELETE /api/student/cart - Remove book from cart
export async function removeBookFromCart(bookId: string): Promise<{ success: boolean; message?: string }> {
  return await apiFetch(`/student/cart/remove?bookId=${bookId}`, {
    method: 'DELETE',
  });
}
