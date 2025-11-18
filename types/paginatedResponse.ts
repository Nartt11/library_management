export interface PaginatedResponse<T> {
  items: T[];
  totalPages: number;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}