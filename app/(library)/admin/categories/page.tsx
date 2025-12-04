"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, FolderTree, Plus, Search, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import DialogDelete from "@/components/librarian/DialogDelete";
import { toast } from "sonner";

import {
  createBookCategory,
  deleteBookCategory,
  getAllBookCategories,
  updateBookCategory,
} from "@/services/book-category";
import { useCategories } from "@/hooks/useCategories";
import { SmartPagination } from "@/components/ui/SmartPagination";

export default function CategoryManagement() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { categoriesQuery, createMutation, updateMutation, deleteMutation } =
    useCategories(page, pageSize);

  const categories: bookCategory[] = categoriesQuery.data ?? [];
  console.log(categoriesQuery.data);

  const totalPages = categoriesQuery.data?.totalPages ?? 1;
  const currentPage = categoriesQuery.data?.pageNumber ?? page;
  const totalItems = categoriesQuery.data?.totalItems ?? 0;

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<any>(null);

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

  const handleEdit = (category: any) => {
    setSelectedCategory(category);

    setFormData({
      id: category.id,
      name: category.name,
    });
    setErrors({
      name: "",
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    alert("update");
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

  // ---------------- DELETE publisher -----------------
  const handleDelete = (category: any) => {
    setSelectedCategory(category);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedCategory.id, {
      onSuccess: () => setDeleteOpen(false),
    });
  };
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Category Management</h1>
          <p className="text-muted-foreground">
            Organize and manage book categories
          </p>
        </div>

        <Button className="gap-2" onClick={openAddDialog}>
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            Categories
          </CardTitle>
          <CardDescription>Browse and manage book categories</CardDescription>
        </CardHeader>

        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td className="p-4 text-center" colSpan={3}>
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="border-b">
                    <td className="p-3">{cat.id}</td>
                    <td className="p-3">{cat.name}</td>

                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(cat)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(cat)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* FOOTER */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Showing <b>{categories.length}</b> of <b>{totalItems}</b>{" "}
              categories
            </div>

            {/* <div className="pt-4 flex justify-center">
              <SmartPagination
                page={page}
                totalPages={totalPages}
                onChange={(c) => setPage(c)}
              />
            </div> */}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add category</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Label>Category Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

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
            <DialogTitle>Edit publisher</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Label>Category ID</Label>
            <Input
              value={formData.id}
              disabled
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            />
          </div>

          <div className="space-y-4 py-4">
            <Label>Category Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

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
        title={`Delete category "${selectedCategory?.name}"`}
        description="Are you sure? This action cannot be undone."
        onConfirm={confirmDelete}
      />
    </div>
  );
}
