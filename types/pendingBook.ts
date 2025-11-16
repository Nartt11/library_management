export interface PendingBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  bookId: string;
  category: string;
  action: "borrow" | "reserve";
}