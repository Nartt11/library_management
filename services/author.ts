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

import { apiGet } from '../lib/api';

export async function getAuthors(
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<Author>> {
  return apiGet<PaginatedResponse<Author>>('/authors', { pageNumber, pageSize });
}
