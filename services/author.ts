import { Author } from "@/types/author";


export interface PaginatedResponse<T> {
  data: Author[];
  totalPages: number;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export async function getAuthors(
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<Author>> {
  const url = `https://librarymanagementapi-x5bq.onrender.com/api/authors?pageNumber=${pageNumber}&pageSize=${pageSize}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch authors");
  }

  const data = await res.json();
  return data;
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

import { apiFetch } from "./base";

// GET /api/authors?page=1&pageSize=10
export function getAllAuthors(page: number, pageSize: number) {
  return apiFetch(`/authors?page=${page}&pageSize=${pageSize}`);
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
