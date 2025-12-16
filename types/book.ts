export interface Author {
  id: string;
  name: string;
  yearOfBirth?: number;
  briefDescription?: string;
}

export interface BookCategory {
  id: string;
  name: string;
}

export interface Book {
  id: string;
  isbn: string;
  title: string; 
  imgUrl: string;
  publisher: string | null;
  publicationYear: number;
  description: string;
  authors: Author[];
  bookCategories: BookCategory[];
  availableCopiesCount: number;
}

// Extended type for student catalog view with availability info
export interface BookWithAvailability extends Book {
  totalCopies?: number;
  availableCopies?: number;
  status?: "available" | "borrowed" | "overdue";
  location?: string;
  expectedReturnDate?: string;
}

export interface BookImportResponse {
  data: BookImport[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
export interface BookImport {
  id: string;
  supplier: Supplier;
  staff: Staff;
  importDate: string;      // ISO string
  totalAmount: number;
  note: string | null;
  bookImportDetails: BookImportDetail[];
}
export interface Supplier {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
}
export interface Staff {
  id: string;
  hireDate: string;        // ISO string
  fullName: string;
  email: string;
  phoneNumber: string;
}
export interface BookImportDetail {
  bookTitle: string;
  bookISBN: string;
  quantity: number;
  unitPrice: number;
}
