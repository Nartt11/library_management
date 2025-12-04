import { apiFetch } from "./base";

// GET /api/books?page=1&pageSize=10
export function getAllBooks(page: number, pageSize: number) {
  return apiFetch(`/books?pageNumber=${page}&pageSize=${pageSize}`);
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


