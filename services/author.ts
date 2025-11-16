export interface Author {
  id: number;
  name: string;
  yearOfBirth?: number;
  briefDescription?: string;
  // thêm các field khác nếu có
}

export interface PaginatedResponse<T> {
  items: T[];
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
