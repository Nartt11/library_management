export interface Book {
  id: string;
  isbn: string;
  title: string;
  imgUrl: string | null;
  publisher: string | null;
  publicationYear: number;
  description: string;
  authors: { id: string; name: string }[];
  bookCategories: { id: string; name: string }[];
}
