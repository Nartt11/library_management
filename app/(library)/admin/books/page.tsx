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

export default function BookManagement() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { booksQuery, createMutation } = useBooks(page, pageSize);

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
    name: "",
  };
  const [formData, setFormData] = useState<any>(emptyForm);
  const [errors, setErrors] = useState({
    name: "",
  });

  function validateForm() {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ---------------- ADD publisher -----------------
  const openAddDialog = () => {
    setFormData(emptyForm);
    setErrors({
      name: "",
    });
    setIsAddOpen(true);
  };

  const handleAdd = () => {
    if (!validateForm()) return;
    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsAddOpen(false);
        setFormData(emptyForm);
      },
    });
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
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              {/* <Input
                placeholder="Search by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              /> */}
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

      <BooksTable books={books} />

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
    </div>
  );
}
