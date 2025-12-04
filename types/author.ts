export interface Author {
  id: string;
  name: string;
  yearOfBirth: number;
  briefDescription: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

