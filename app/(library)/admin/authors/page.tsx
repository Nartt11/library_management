"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useAuthors } from "../../../../hooks/useAuthors";
import { Plus, Search, UserPen } from "lucide-react";
import { AuthorTable } from "@/components/librarian/author/TableAuthors";
import { AuthorForm } from "@/components/librarian/author/AuthorForm";

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

  // DIALOG STATES
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedAuthor, setSelectedAuthor] = useState<any>(null);

  const emptyForm = {
    name: "",
    yearOfBirth: 2025,
    briefDescription: "",
  };

  const [formData, setFormData] = useState<any>(emptyForm);
  const [errors, setErrors] = useState({
    name: "",
    yearOfBirth: "",
  });

  // Validate fields
  function validateForm() {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.yearOfBirth) {
      newErrors.yearOfBirth = "Year of birth is required";
    } else if (isNaN(Number(formData.yearOfBirth))) {
      newErrors.yearOfBirth = "Must be a number";
    } else if (Number(formData.yearOfBirth) < 1900) {
      newErrors.yearOfBirth = "Year must be >= 1900";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ---------------- ADD AUTHOR -----------------
  const openAddDialog = () => {
    setFormData(emptyForm);
    setErrors({
      name: "",
      yearOfBirth: "",
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

  // ---------------- EDIT AUTHOR -----------------
  const handleEdit = (author: any) => {
    setSelectedAuthor(author);

    setFormData({
      id: author.id,
      name: author.name,
      yearOfBirth: author.yearOfBirth,
      briefDescription: author.briefDescription || "",
    });
    setErrors({
      name: "",
      yearOfBirth: "",
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!validateForm()) return;
    const { id, ...payload } = formData; // loại ID khỏi body

    updateMutation.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          setIsEditOpen(false);
        },
      }
    );
  };

  // ---------------- DELETE AUTHOR -----------------
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
          <CardDescription>Browse and manage all authors</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* TABLE */}
            <div className="rounded-md border">
              <AuthorTable
                authors={authors}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Showing <b>{authors.length}</b> of <b>{totalItems}</b> author(s)
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
        </CardContent>
      </Card>

      {/* ADD DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Author</DialogTitle>
          </DialogHeader>

          <AuthorForm
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Author</DialogTitle>
          </DialogHeader>

          <AuthorForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <DialogDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete Author "${selectedAuthor?.name}"`}
        description="Are you sure? This action cannot be undone."
        onConfirm={confirmDelete}
      />
    </div>
  );
}
