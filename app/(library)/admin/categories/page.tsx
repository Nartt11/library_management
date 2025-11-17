"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { FolderTree, Search, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PasswordConfirmation } from "./../../../components/PasswordConfirmation";
import type { User } from "../../../types/user";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface CategoryManagementProps {
  currentUser: User;
}

export default function CategoryManagement({
  currentUser,
}: CategoryManagementProps) {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "CAT-001",
      name: "Computer Science",
      description:
        "Books related to computer science, programming, and software development",
    },
    {
      id: "CAT-002",
      name: "Physics",
      description:
        "Books covering physics principles, theories, and applications",
    },
    {
      id: "CAT-003",
      name: "Mathematics",
      description:
        "Mathematical textbooks, reference materials, and problem-solving guides",
    },
    {
      id: "CAT-004",
      name: "Literature",
      description:
        "Classic and contemporary literature, poetry, and literary analysis",
    },
    {
      id: "CAT-005",
      name: "Engineering",
      description:
        "Engineering textbooks covering various disciplines and applications",
    },
    {
      id: "CAT-006",
      name: "Business",
      description:
        "Business management, economics, finance, and entrepreneurship",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "add" | "edit" | "delete";
    action: () => void;
    title: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
  };

  const handleAddCategory = () => {
    const action = () => {
      const newCategory: Category = {
        id: `CAT-${String(categories.length + 1).padStart(3, "0")}`,
        ...formData,
      };
      setCategories([...categories, newCategory]);
      setIsAddDialogOpen(false);
      resetForm();
      toast.success("Category added successfully");
    };

    setPendingAction({
      type: "add",
      action,
      title: "Add New Category",
    });
    setShowPasswordConfirmation(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;

    const action = () => {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id ? { ...c, ...formData } : c
        )
      );
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      resetForm();
      toast.success("Category updated successfully");
    };

    setPendingAction({
      type: "edit",
      action,
      title: "Update Category",
    });
    setShowPasswordConfirmation(true);
  };

  const handleDeleteCategory = (category: Category) => {
    const action = () => {
      setCategories(categories.filter((c) => c.id !== category.id));
      setDeletingCategory(null);
      toast.success("Category deleted successfully");
    };

    setPendingAction({
      type: "delete",
      action,
      title: "Delete Category",
    });
    setShowPasswordConfirmation(true);
    setDeletingCategory(category);
  };

  const handlePasswordSuccess = () => {
    if (pendingAction) {
      pendingAction.action();
      setPendingAction(null);
    }
    setShowPasswordConfirmation(false);
  };

  const handlePasswordCancel = () => {
    setShowPasswordConfirmation(false);
    setPendingAction(null);
    setDeletingCategory(null);
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-6">
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
                <DialogDescription>
                  Create a new book category
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter category name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter category description"
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddCategory}>Add Category</Button>
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
            <CardDescription>
              Browse and manage all book categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search categories by name, description, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left">Category ID</th>
                      <th className="p-3 text-left">Category Name</th>
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-8 text-center text-muted-foreground"
                        >
                          No categories found
                        </td>
                      </tr>
                    ) : (
                      filteredCategories.map((category) => (
                        <tr
                          key={category.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-3">{category.id}</td>
                          <td className="p-3">{category.name}</td>
                          <td className="p-3 max-w-md">
                            <p className="line-clamp-2">
                              {category.description}
                            </p>
                          </td>
                          <td className="p-3">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditCategory(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCategory(category)}
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
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  Showing {filteredCategories.length} of {categories.length}{" "}
                  category(ies)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter category description"
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory}>Update Category</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Confirmation Dialog */}
      {showPasswordConfirmation && pendingAction && (
        <PasswordConfirmation
          isOpen={showPasswordConfirmation}
          onConfirm={handlePasswordSuccess}
          onClose={handlePasswordCancel}
          title={pendingAction.title}
          description="Please enter your password to confirm this action."
          currentUser={currentUser}
        />
      )}

      {/* Delete Confirmation Alert */}
      {deletingCategory && !showPasswordConfirmation && (
        <AlertDialog
          open={!!deletingCategory}
          onOpenChange={() => setDeletingCategory(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete category "{deletingCategory.name}". This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteCategory(deletingCategory)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
