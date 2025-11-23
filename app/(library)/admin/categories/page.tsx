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
import { Edit, FolderTree, Plus, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import DialogDelete from "@/components/librarian/DialogDelete";
import { toast } from "sonner";

import {
  createBookCategory,
  deleteBookCategory,
  getAllBookCategories,
  updateBookCategory,
} from "@/services/book-category";

export default function CategoryManagement() {
  const [categories, setCategories] = useState<bookCategory[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
  });

  const fetchCategories = async () => {
    const data = await getAllBookCategories(pageNumber, pageSize);
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, [pageNumber, pageSize]);

  const resetForm = () => {
    setFormData({ name: "" });
    setEditingId(null);
  };

  const onSubmitAdd = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    await createBookCategory(formData);
    toast.success("Book Category added successfully");
    setIsAddDialogOpen(false);
    resetForm();
    fetchCategories();
  };

  const handleEditCategory = (category: bookCategory) => {
    setEditingId(category.id);
    setFormData({ name: category.name });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    await updateBookCategory(editingId, formData);
    toast.success("Book Category updated successfully");

    setIsEditDialogOpen(false);
    resetForm();
    fetchCategories();
  };

  const handleDeleteCategory = async (category: bookCategory) => {
    await deleteBookCategory(category.id);
    toast.success("Book Category deleted successfully");
    fetchCategories();
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

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => resetForm()}>
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Label>Category Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter category name"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={onSubmitAdd}>Add</Button>
            </div>
          </DialogContent>
        </Dialog>
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
                          onClick={() => handleEditCategory(cat)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <DialogDelete
                          title="Delete Category"
                          description={`Delete "${cat.name}"? This cannot be undone.`}
                          onConfirm={() => handleDeleteCategory(cat)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
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
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
