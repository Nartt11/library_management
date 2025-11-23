import { apiFetch } from "./base";

// GET /api/books?page=1&pageSize=10
export function getAllBooks(page: number, pageSize: number) {
  return apiFetch(`/books?page=${page}&pageSize=${pageSize}`);
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

// PUT /api/books/{id}
export function updateBook(id: string, book: any) {
  return apiFetch(`/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(book),
  });
}

// DELETE /api/books/{id}
export function deleteBook(id: string) {
  return apiFetch(`/books/${id}`, {
    method: "DELETE",
  });
}
