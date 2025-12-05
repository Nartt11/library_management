import { apiFetch, getApi, postApi, deleteApi } from "./base";
import { BorrowRequestResponse, BorrowRequestPayload } from "../types/student";
import { CartDto, CartItemDto } from "../types/cart";
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

// GET /api/cart - Get student's cart with items
export async function getCart(): Promise<CartDto> {
  return await getApi<CartDto>('/cart');
}

// GET /api/cart - Get just the cart items
export async function getCartItems(): Promise<CartItemDto[]> {
  const cart = await getCart();
  return cart.items ?? [];
}

// POST /api/cart/items - Add book to cart
export async function addBookToCart(bookId: string): Promise<CartDto> {
  return await postApi<CartDto>('/cart/add', { bookId });
}

// DELETE /api/cart/items/{bookId} - Remove book from cart
export async function removeBookFromCart(bookId: string): Promise<CartDto> {
  return await deleteApi<CartDto>(`/cart/items/${bookId}`);
}

// DELETE /api/cart - Clear entire cart
export async function clearCart(): Promise<void> {
  await deleteApi('/cart');
}
