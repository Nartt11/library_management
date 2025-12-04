"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useAuthors } from "../../../../app/hooks/useAuthors";
import { Plus, Search, UserPen } from "lucide-react";
import { AuthorTable } from "@/components/librarian/author/TableAuthors";
import { AuthorForm } from "@/components/librarian/author/AuthorForm";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SmartPagination } from "@/components/ui/SmartPagination";
import DialogDelete from "@/components/librarian/DialogDelete";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthorPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { authorsQuery, createMutation, updateMutation, deleteMutation } =
    useAuthors(page, pageSize);

  const authors = authorsQuery.data?.data ?? [];
  const totalPages = authorsQuery.data?.totalPages ?? 1;
  const currentPage = authorsQuery.data?.pageNumber ?? page;
  const totalItems = authorsQuery.data?.totalItems ?? 0;

  console.log("a", totalPages);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    yearOfBirth: 2025,
    briefDescription: "",
  });

  const emptyForm = {
    name: "",
    yearOfBirth: 2025,
    briefDescription: "",
  };

  const [selectedAuthor, setSelectedAuthor] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // ADD
  const openAddDialog = () => {
    setFormData(emptyForm);
    setIsAddOpen(true);
  };

  const handleAdd = () => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsAddOpen(false);
        setFormData(emptyForm);
      },
    });
  };

  // EDIT
  const handleEdit = (author: any) => {
    setSelectedAuthor(author);
    setFormData(author);
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    updateMutation.mutate(
      { id: selectedAuthor.id, data: formData },
      {
        onSuccess: () => {
          setIsEditOpen(false);
        },
      }
    );
  };

  // DELETE
  const handleDelete = (author: any) => {
    setSelectedAuthor(author);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedAuthor.id, {
      onSuccess: () => setDeleteOpen(false),
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Author Management</h1>
          <p className="text-muted-foreground">
            Manage author information and details
          </p>
        </div>

        <Button className="gap-2" onClick={openAddDialog}>
          <Plus className="h-4 w-4" /> Add Author
        </Button>
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
                {/* <Input
                  placeholder="Search authors by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                /> */}
              </div>
            </div>

            <div className="rounded-md border">
              <AuthorTable
                authors={authors}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Showing {totalItems.length} of {authors.length} author(s)
              </div>

              {/* PAGINATION */}
              <div className="pt-4 flex justify-center">
                <SmartPagination
                  page={page}
                  totalPages={authorsQuery.data?.totalPages ?? 1}
                  onChange={(p) => setPage(p)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}

      {/* ADD DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Author</DialogTitle>
          </DialogHeader>

          <AuthorForm formData={formData} setFormData={setFormData} />

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Author</DialogTitle>
          </DialogHeader>

          <AuthorForm formData={formData} setFormData={setFormData} />

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>

      <DialogDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete  Author ${selectedAuthor?.name}`}
        description="Are you sure you want to delete this author? This action cannot be undone."
        onConfirm={confirmDelete}
      />
    </div>
  );
}
