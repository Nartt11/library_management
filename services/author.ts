import { Author } from "@/types/author";
import { apiFetch } from "./base";

export interface PaginatedResponse<T> {
  data: Author[];
  totalPages: number;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

interface AuthorFormData {
  name: string;
  yearOfBirth: number;
  briefDescription: string;
}
export async function AddAuthor(formData: AuthorFormData) {
  try {
    const res = await fetch(
      "https://librarymanagementapi-x5bq.onrender.com/api/authors",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // truyền thẳng formData
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to add author");
    }

    const data: Author = await res.json();
    return {
      success: true,
      author: data,
    };
  } catch (error: any) {
    console.error("Error adding author:", error);
    return {
      success: false,
      message: error.message || "Unknown error",
    };
  }
}


// GET /api/authors?page=1&pageSize=10
export function getAllAuthors(page: number, pageSize: number,nameQuery: string) {
  return apiFetch(`/authors/search?nameQuery=${nameQuery}&pageNumber=${page}&pageSize=${pageSize}`);
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