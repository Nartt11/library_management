import { apiFetch } from "./base";

// GET /api/book-categories?page=1&pageSize=10
export function getAllBookCategories(page: number, pageSize: number) {
  return apiFetch(`/book-categories?pageNumber=${page}&pageSize=${pageSize}`);
}

// GET /api/book-categories/{id}
export function getBookCategoryById(id:string) {
  return apiFetch(`/book-categories/${id}`);
}

// POST /api/book-categories
export function createBookCategory(bookCategory: any) {
  return apiFetch(`/book-categories`, {
    method: "POST",
    body: JSON.stringify(bookCategory),
  });
}

// PUT /api/book-categories/{id}
export function updateBookCategory(id: string, bookCategory: any) {
  return apiFetch(`/book-categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(bookCategory),
  });
}

// DELETE /api/book-categories/{id}
export function deleteBookCategory(id: string) {
  return apiFetch(`/book-categories/${id}`, {
    method: "DELETE",
  });
}
