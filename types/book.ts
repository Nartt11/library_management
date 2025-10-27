interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  bookId: string;
  category: string;
  status: "available" | "borrowed" | "overdue";
  location: string;
  description: string;
  copies: number;
  availableCopies: number;
  expectedReturnDate?: string;
  borrowedBy?: string;
  imageUrl: string;
}