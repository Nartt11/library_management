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
  DialogDescription,  DialogFooter,  DialogHeader,
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
  QrCode,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import type { User } from "./../../../../types/user";
import { useBooks } from "@/hooks/useBooks";
import BooksTable from "@/components/librarian/book/BooksTable";
import { Book } from "@/types/book";
import { SmartPagination } from "@/components/ui/SmartPagination";
import BookForm, { BookFormUpdate } from "@/components/librarian/book/BookForm";
import BookFormCreate from "@/components/librarian/book/BookForm";
import { getBookCopiesQRs } from "@/services/book";
import { generateBarcodeUrl } from "@/services/barcode";

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

  // QR Modal state
  const [isQROpen, setIsQROpen] = useState(false);
  const [qrData, setQrData] = useState<any[]>([]);
  const [qrLoading, setQrLoading] = useState(false);
  const [selectedBookForQR, setSelectedBookForQR] = useState<Book | null>(null);

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

  // handle view QR codes
  const handleViewQRs = async (book: Book) => {
    setSelectedBookForQR(book);
    setQrLoading(true);
    setIsQROpen(true);

    try {
      const response = await getBookCopiesQRs(book.id);
      setQrData(response || []);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      toast.error('Failed to load QR codes');
      setQrData([]);
    } finally {
      setQrLoading(false);
    }
  };

  // handle print QR codes
  const handlePrintQRs = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const qrHtml = qrData.map((item, index) => `
      <div style="page-break-inside: avoid; margin: 20px; text-align: center; border: 1px solid #ccc; padding: 20px; display: inline-block;">
        <h3 style="margin-bottom: 10px;">${selectedBookForQR?.title || 'Book'}</h3>
        <p style="margin-bottom: 10px;">Copy ID: ${item.copyId}</p>
        <p style="margin-bottom: 10px;">Status: ${item.status}</p>
        <img src="${generateBarcodeUrl(item.copyId)}" style="width: 150px; height: 150px;" />
        <p style="margin-top: 10px; font-size: 12px;">${item.copyId}</p>
      </div>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Codes - ${selectedBookForQR?.title || 'Book'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .qr-grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }
            @media print {
              body { margin: 0; }
              .qr-grid { display: flex; flex-wrap: wrap; gap: 10px; }
            }
          </style>
        </head>
        <body>
          <h1 style="text-align: center; margin-bottom: 30px;">QR Codes for ${selectedBookForQR?.title || 'Book'}</h1>
          <div class="qr-grid">${qrHtml}</div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
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

      <BooksTable books={books} onEdit={openUpdateDialog} onViewQRs={handleViewQRs} />

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

      {/* QR CODES MODAL */}
      <Dialog open={isQROpen} onOpenChange={setIsQROpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Codes for {selectedBookForQR?.title || 'Book'}
            </DialogTitle>
            <DialogDescription>
              View and print QR codes for all copies of this book
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end mb-4">
            <Button
              onClick={handlePrintQRs}
              disabled={qrLoading || qrData.length === 0}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              Print All QR Codes
            </Button>
          </div>

          {qrLoading ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Loading QR codes...</div>
            </div>
          ) : qrData.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">No QR codes found for this book</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {qrData.map((item, index) => (
                <Card key={item.copyId || index} className="overflow-hidden">
                  <CardContent className="p-4 text-center">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm">Copy ID: {item.copyId}</h4>
                        <Badge
                          variant={item.status === 'Available' ? 'default' : item.status === 'Borrowed' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {item.status}
                        </Badge>
                      </div>

                      <div className="bg-white p-2 rounded-lg border inline-block">
                        <img
                          src={generateBarcodeUrl(item.copyId)}
                          alt={`QR Code for copy ${item.copyId}`}
                          className="w-24 h-24"
                        />
                      </div>

                      <div className="text-xs text-muted-foreground break-all">
                        {item.copyId}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQROpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
