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
  isbn: string;
  title: string;
  imgUrl: string;
  publisher: string | null;
  publicationYear: number;
  description: string;
  authors: Author[];
  bookCategories: BookCategory[];
}
