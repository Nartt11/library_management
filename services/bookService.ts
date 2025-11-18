import { apiGet } from "@/lib/api";
import { Book } from "@/types/book";
import { PaginatedResponse } from "@/types/paginatedResponse";

type RawBook = {
  id: string;
  isbn?: string;
  title?: string;
  imgUrl?: string;
  imageUrl?: string;
  description?: string;
  authors?: Array<{ id?: string; name?: string }>;
  bookCategories?: Array<{ id?: string; name?: string }>;
  publicationYear?: number;
  publisher?: string | null;
  // optional fields that may exist in other responses
  location?: string;
  copies?: number;
  availableCopies?: number;
  expectedReturnDate?: string;
};

type RawPaginatedResponse = {
  data?: RawBook[];
  items?: RawBook[];
  pageNumber?: number;
  pageSize?: number;
  totalItems?: number;
  totalCount?: number;
  totalPages?: number;
};

function mapRawToBook(rb: RawBook): Book {
  const authors = rb.authors && rb.authors.length > 0 ? rb.authors.map(a => a.name).filter(Boolean).join(', ') : 'Unknown';
  const category = rb.bookCategories && rb.bookCategories.length > 0 ? rb.bookCategories[0].name || 'Uncategorized' : 'Uncategorized';

  return {
    id: rb.id,
    title: rb.title || 'Untitled',
    author: authors,
    isbn: rb.isbn || '',
    bookId: rb.isbn ?? rb.id,
    category,
    status: 'available',
    location: rb.location ?? '',
    description: rb.description ?? '',
    copies: rb.copies ?? 1,
    availableCopies: rb.availableCopies ?? (rb.copies ?? 1),
    expectedReturnDate: rb.expectedReturnDate,
    borrowedBy: undefined,
    imageUrl: rb.imgUrl ?? rb.imageUrl ?? '',
  } as Book;
}

export async function getBooks(
  pageNumber: number = 1,
  pageSize: number = 10,
): Promise<PaginatedResponse<Book>> {
  const raw = await apiGet<RawPaginatedResponse>('/books', { pageNumber, pageSize });

  const rawItems = raw.data ?? raw.items ?? [];

  const items = rawItems.map(mapRawToBook);

  const totalCount = raw.totalItems ?? raw.totalCount ?? items.length;
  const totalPages = raw.totalPages ?? Math.max(1, Math.ceil((totalCount || items.length) / (raw.pageSize ?? pageSize)));

  return {
    items,
    totalPages,
    totalCount,
    pageNumber: raw.pageNumber ?? pageNumber,
    pageSize: raw.pageSize ?? pageSize,
  };
}