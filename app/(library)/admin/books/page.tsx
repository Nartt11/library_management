"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Upload,
  Download,
  FileText,
  Delete,
} from "lucide-react";
import { toast } from "sonner";
import type { User } from "./../../../../types/user";
import { useBooks } from "@/hooks/useBooks";
import BooksTable from "@/components/librarian/book/BooksTable";
import { Book } from "@/types/book";
import { SmartPagination } from "@/components/ui/SmartPagination";
import BookForm, { BookFormUpdate } from "@/components/librarian/book/BookForm";
import BookFormCreate from "@/components/librarian/book/BookForm";

export default function BookManagement() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [title, setTitle] = useState(""); // search keyword title
  const [debouncedTitle, setDebouncedTitle] = useState(title);

  const [author, setAuthor] = useState(""); // search keyword author
  const [debouncedAuthor, setDebouncedAuthor] = useState(author);

  // debounce title (500ms)
  useEffect(() => {
    const id = setTimeout(() => setDebouncedTitle(title), 500);
    return () => clearTimeout(id);
  }, [title]);

  // debounce author (500ms)
  useEffect(() => {
    const id = setTimeout(() => setDebouncedAuthor(author), 500);
    return () => clearTimeout(id);
  }, [author]);

  const { booksQuery, createMutation } = useBooks(
    page,
    pageSize,
    debouncedTitle,
    debouncedAuthor
  );

  const books: Book[] = booksQuery.data?.data ?? [];
  console.log(booksQuery.data);

  const totalPages = booksQuery.data?.totalPages ?? 1;
  const currentPage = booksQuery.data?.pageNumber ?? page;
  const totalItems = booksQuery.data?.totalItems ?? 0;

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedBook, setSelectedBooks] = useState<any>(null);

  const emptyForm = {
    isbn: "",
    title: "",
    imgUrl: "",
    categoryIds: [],
    authorIds: [],
    publicationYear: new Date().getFullYear(),
    description: "",
  };
  const [formData, setFormData] = useState<any>(emptyForm);
  const [errors, setErrors] = useState({
    isbn: "",
  });

  function validateForm() {
    const newErrors: any = {};

    if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ---------------- ADD publisher -----------------
  const openAddDialog = () => {
    setFormData(emptyForm);
    setErrors({ isbn: "" });
    setIsAddOpen(true);
  };

  const handleAdd = () => {
    if (!validateForm()) return;

    const payload = {
      ...formData,
      categoryIds: (formData.categoryIds ?? []).filter(Boolean),
      authorIds: (formData.authorIds ?? []).filter(Boolean),
      publicationYear:
        Number(formData.publicationYear) || new Date().getFullYear(),
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        setIsAddOpen(false);
        setFormData(emptyForm);
      },
    });
  };
  const st = new FormData();

  // open update dialog with selected book
  const openUpdateDialog = (book: Book) => {
    setSelectedBooks(book);
    setIsEditOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2 flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Book Management
          </h1>
          <p className="text-muted-foreground">
            Manage library books, availability, and inventory.
          </p>
        </div>

        <Button className="gap-2" onClick={openAddDialog}>
          <Plus className="h-4 w-4" /> Add Book
        </Button>
      </div>

      {/* Edit Book Dialog */}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* search = title */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={title}
                onChange={(e) => {
                  setPage(1); // reset page khi search
                  setTitle(e.target.value);
                }}
                placeholder="Search book title..."
                className="pl-10"
              />
            </div>
            {/* search = author */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={author}
                onChange={(e) => {
                  setPage(1);
                  setAuthor(e.target.value);
                }}
                placeholder="Search book author..."
                className="pl-10"
              />
            </div>
            {/* <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="borrowed">Borrowed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
        </CardContent>
      </Card>

      <BooksTable books={books} onEdit={openUpdateDialog} />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing <b>{books.length}</b> of <b>{totalItems}</b> author(s)
        </div>

        <div className="pt-4 flex justify-center">
          <SmartPagination
            page={page}
            totalPages={totalPages}
            onChange={(p) => setPage(p)}
          />
        </div>
      </div>

      {/* ADD DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="min-w-200">
          <DialogHeader>
            <DialogTitle>Add publisher</DialogTitle>
          </DialogHeader>

          <BookFormCreate
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="min-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>

          {selectedBook && (
            <BookFormUpdate
              book={selectedBook as Book}
              onClose={() => setIsEditOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
