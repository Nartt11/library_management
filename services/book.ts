import { apiFetch } from "./base";

// GET /api/books?pageNumber=1&pageSize=10
// GET /api/books/search?pageNumber=1&pageSize=10&categoryName=...&isbn=...&titleQuery=...
export function getAllBooks(
  page: number,
  pageSize: number,
  categoryName?: string,
  isbn?: string,
  titleQuery?: string
) {
  const params = new URLSearchParams({
    pageNumber: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (categoryName) params.append("categoryName", categoryName);
  if (isbn) params.append("isbn", isbn);
  if (titleQuery) params.append("titleQuery", titleQuery);

  return apiFetch(`/books/search?${params.toString()}`);
}


export function getAllBooksRecommend(page: number, pageSize: number) {
  return apiFetch(`/books/recommend?pageNumber=${page}&pageSize=${pageSize}`);
}

// GET /api/books/{id}
export function getBookById(id:string) {
  return apiFetch(`/books/${id}`);
}

// POST /api/books
export function createBook(book: any) {
  return apiFetch(`/books`, {
    method: "POST",
    body: JSON.stringify(book),
  });
}

// GET /api/books/search/title?title=...&pageNumber=1&pageSize=20
export function searchBooksByTitle(title: string, pageNumber = 1, pageSize = 20) {
  const q = `title=${title}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
  return apiFetch(`/books/search/title?${q}`);
}

// GET /api/books/search/author?author=...&pageNumber=1&pageSize=20
export function searchBooksByAuthor(author: string, pageNumber = 1, pageSize = 20) {
  const q = `author=${encodeURIComponent(author)}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
  return apiFetch(`/books/search/author?${q}`);
}

// PATCH /api/books/{id}/categories
export function updateBookCategories(id: string, categoryIds: string[]) {
  return apiFetch(`/books/${id}/categories`, {
    method: "PATCH",
    body: JSON.stringify({ categoryIds }),
  });
}

// PATCH /api/books/{id}/authors
export function updateBookAuthors(id: string, authorIds: string[]) {
  return apiFetch(`/books/${id}/authors`, {
    method: "PATCH",
    body: JSON.stringify({ authorIds }),
  });
}

// POST /api/books/import
export function importBooks(payload: {
  supplierId: string;
  notes: string;
  details: {
    bookId: string;
    quantity: number;
    unitPrice: number;
  }[];
}) {
  return apiFetch(`/books/import`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// GET /api/books/{id}/copies/qrs
export function getBookCopiesQRs(id: string) {
  return apiFetch(`/books/${id}/copies/qrs`);
}

