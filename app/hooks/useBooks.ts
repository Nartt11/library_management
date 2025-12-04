// hooks/useBooks.ts
import { createBook, deleteBook, getAllBooks, updateBook } from "@/services/book";
import { Book } from "@/types/book";
import { useState, useEffect } from "react";

export function useBooks() {
  // List state
  const [books, setBooks] = useState<Book[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [errorList, setErrorList] = useState<string | null>(null);

  // CRUD state
  const [loadingAction, setLoadingAction] = useState(false);
  const [errorAction, setErrorAction] = useState<string | null>(null);

  // Optional: search
  const [searchKeyword, setSearchKeyword] = useState("");

  // Fetch list
  const fetchBooks = async () => {
    try {
      setLoadingList(true);
      const data = await getAllBooks(1,10);
      setBooks(data.data);
      setErrorList(null);
    } catch (err: any) {
      setErrorList(err.message);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // CRUD Actions
  const handleCreate = async (payload: any) => {
    try {
      setLoadingAction(true);
      await createBook(payload);
      await fetchBooks();
      setErrorAction(null);
      return true;
    } catch (err: any) {
      setErrorAction(err.message);
      return false;
    } finally {
      setLoadingAction(false);
    }
  };

  const handleUpdate = async (id: string, payload: any) => {
    try {
      setLoadingAction(true);
      await updateBook(id, payload);
      await fetchBooks();
      setErrorAction(null);
      return true;
    } catch (err: any) {
      setErrorAction(err.message);
      return false;
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoadingAction(true);
      await deleteBook(id);
      await fetchBooks();
      setErrorAction(null);
      return true;
    } catch (err: any) {
      setErrorAction(err.message);
      return false;
    } finally {
      setLoadingAction(false);
    }
  };

  // Filter search
  // const filteredBooks = books.filter((b) =>
  //   b.title.toLowerCase().includes(searchKeyword.toLowerCase())
  // );

  return {
    // list
    books: books,
    loadingList,
    errorList,
    refetch: fetchBooks,

    // search
    searchKeyword,
    setSearchKeyword,

    // CRUD
    handleCreate,
    handleUpdate,
    handleDelete,
    loadingAction,
    errorAction,
  };
}
