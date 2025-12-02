import { Author } from "@/types/author";
import { apiFetch } from "./base";

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

// GET /api/authors?pageNumber=1&pageSize=10
export function getAllAuthors(pageNumber: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Author>> {
  return apiFetch<PaginatedResponse<Author>>(`/authors?pageNumber=${pageNumber}&pageSize=${pageSize}`);
}

// GET /api/authors/{id}
export function getAuthorById(id:string) {
  return apiFetch(`/authors/${id}`);
}

// POST /api/authors
export function createAuthor(author: any) {
  return apiFetch(`/authors`, {
    method: "POST",
    body: JSON.stringify(author),
  });
}

// PUT /api/authors/{id}
export function updateAuthor(id: string, author: any) {
  return apiFetch(`/authors/${id}`, {
    method: "PUT",
    body: JSON.stringify(author),
  });
}

// DELETE /api/authors/{id}
export function deleteAuthor(id: string) {
  return apiFetch(`/authors/${id}`, {
    method: "DELETE",
  });
}

// GET /api/authors/{id}/books
export function getAuthorBooks(id: number | string) {
  return apiFetch(`/authors/${id}/books`);
}
