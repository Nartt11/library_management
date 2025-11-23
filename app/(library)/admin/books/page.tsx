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
import { PasswordConfirmation } from "./../../../../components/PasswordConfirmation";
import DialogDelete from "@/components/librarian/DialogDelete";
import CreateBook from "@/components/librarian/book/CreateBook";
import { Book } from "@/types/book";
import { deleteBook, getAllBooks } from "@/services/book";
import EditBook from "@/components/librarian/book/EditBook";

export default function BookManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // ---- FETCH DATA ----
  const fetchData = async () => {
    try {
      const data = await getAllBooks(pageNumber, pageSize);
      console.log("Authors:", data);

      setBooks(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageNumber, pageSize]);

  const addBook = async (newBook: any) => {
    await CreateBook(newBook);
    toast.success("Book added successfully!");
    fetchData();
  };

  const confirmDeleteBook = async (bookId: string) => {
    alert("Delete book with ID: " + bookId);
    // await deleteBook(bookId);
    // toast.success("Book deleted successfully!");
    // fetchData();
  };

  // const editBook = async (book: Book) => {
  //   await EditBook();
  //   toast.success("Book edited successfully!");
  //   fetchData();
  // };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "default";
      case "borrowed":
        return "secondary";
      case "overdue":
        return "destructive";
      default:
        return "default";
    }
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

        <div className="flex gap-2">
          {/* import */}
          {/* <Dialog open={isBulkImportOpen} onOpenChange={setIsBulkImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Bulk Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Bulk Import Books</DialogTitle>
                <DialogDescription>
                  Import multiple books from a CSV file.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload a CSV file with book information
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Choose File
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Required columns: title, author, isbn</p>
                  <p className="mb-2">
                    Optional columns: category, location, description, copies
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={downloadTemplate}
                  className="w-full gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>
              </div>
            </DialogContent>
          </Dialog> */}

          <CreateBook addBook={addBook} />
        </div>
      </div>

      {/* Edit Book Dialog */}

      {/* Search and Filters */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
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
            </Select>
          </div>
        </CardContent>
      </Card> */}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {books.length} of {books.length} books
        </p>
      </div>

      {/* Books Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 text-sm">Book Image</th>
                  <th className="p-4 text-sm">Book Details</th>
                  <th className="p-4 text-sm">Category</th>
                  <th className="p-4 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <p className="line-clamp-1">{book.title}</p>
                        <p className="text-sm text-muted-foreground">
                          by {book.authors.map((a) => a.name).join(", ")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ISBN: {book.isbn}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      {book.bookCategories.map((c) => c.name).join(", ")}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2">
                        <EditBook />

                        <DialogDelete
                          title="Delete Book"
                          description={`Are you sure you want to delete "${book.title}"? This action cannot be undone.`}
                          onConfirm={() => confirmDeleteBook(book.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {books.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              No books found matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
