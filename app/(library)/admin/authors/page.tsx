"use client";
import DialogAddNewItem from "@/components/librarian/author/CreateAuthor";
import TableAuthors from "@/components/librarian/author/TableAuthors";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  createAuthor,
  deleteAuthor,
  getAllAuthors,
  updateAuthor,
} from "@/services/author";
import { Author } from "@/types/author";
import { Search, UserPen } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function AuthorManagement() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // ---- FETCH DATA ----
  const fetchData = async () => {
    try {
      const data = await getAllAuthors(pageNumber, pageSize);
      console.log("Authors:", data);

      setAuthors(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  };

  // Chỉ chạy khi pageNumber hoặc pageSize đổi
  useEffect(() => {
    fetchData();
  }, [pageNumber, pageSize]);

  // ---- ADD ----
  const handleAddAuthor = async (author: Author) => {
    const payload = {
      name: author.name,
      yearOfBirth: author.yearOfBirth,
      briefDescription: author.briefDescription,
    };

    await createAuthor(payload);
    fetchData(); // refresh sau khi add
  };

  // ---- UPDATE ----
  const handleEditAuthor = async (author: Author) => {
    const payload = {
      name: author.name,
      yearOfBirth: author.yearOfBirth,
      briefDescription: author.briefDescription,
    };

    await updateAuthor(author.id, payload);
    fetchData(); // refresh sau update
  };

  // ---- DELETE ----
  const handleDeleteAuthor = async (author: Author) => {
    await deleteAuthor(author.id!);
    fetchData(); // refresh sau delete
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Author Management</h1>
          <p className="text-muted-foreground">
            Manage author information and details
          </p>
        </div>

        <DialogAddNewItem handleAddAuthor={handleAddAuthor} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPen className="h-5 w-5" />
            Authors
          </CardTitle>
          <CardDescription>
            Browse and manage all authors in the system
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search authors by name..."
                  className="pl-10"
                />
              </div>
            </div>

            <TableAuthors
              authors={authors}
              handleEditAuthor={handleEditAuthor}
              handleDeleteAuthor={handleDeleteAuthor}
            />

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Showing {authors.length} of {totalPages * pageSize} author(s)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
