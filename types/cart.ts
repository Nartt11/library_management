// Cart API DTOs matching backend response
export interface CartItemDto {
  id: string;
  bookId: string;
  bookTitle?: string;
  bookISBN?: string;
  bookImageUrl?: string;
  addedAt: string;
  isAvailable: boolean;
}

export interface CartDto {
  id: string;
  memberId: string;
  createdAt: string;
  updatedAt: string;
  items: CartItemDto[];
  totalItems: number;
}
