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
}

// Extended type for student catalog view with availability info
export interface BookWithAvailability extends Book {
  totalCopies?: number;
  availableCopies?: number;
  status?: "available" | "borrowed" | "overdue";
  location?: string;
  expectedReturnDate?: string;
}
