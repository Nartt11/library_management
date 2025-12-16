import { apiFetch } from "./base";
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
  publisher: Publisher;
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
  return {
    id: rb.id,
    isbn: rb.isbn || '',
    title: rb.title || 'Untitled',
    imgUrl: rb.imgUrl ?? rb.imageUrl ?? '',
    publisher: rb.publisher ?? null,
    publicationYear: rb.publicationYear ?? 0,
    description: rb.description ?? '',
    authors: rb.authors?.map(a => ({
      id: a.id || '',
      name: a.name || 'Unknown'
    })) ?? [],
    availableCopiesCount: rb.availableCopies ?? rb.copies ?? 0,
    bookCategories: rb.bookCategories?.map(c => ({
      id: c.id || '',
      name: c.name || 'Uncategorized'
    })) ?? [],
  };
}

export async function getBooks(
  pageNumber: number = 1,
  pageSize: number = 10,
): Promise<PaginatedResponse<Book>> {
  const raw = await apiFetch<RawPaginatedResponse>(`/books?pageNumber=${pageNumber}&pageSize=${pageSize}`);

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