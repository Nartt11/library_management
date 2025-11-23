"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../components/ui/alert-dialog";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { UserPen, Search, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PasswordConfirmation } from "../../../../components/PasswordConfirmation";
import type { User } from "../../../../types/user";
import { Author } from "@/types/author";
import { getAuthors } from "@/services/author";

// interface Author {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
// }

interface AuthorManagementProps {
  currentUser: User;
}

export default function AuthorManagement({
  currentUser,
}: AuthorManagementProps) {
  // const [authors, setAuthors] = useState<Author[]>([
  //   {
  //     id: "AUTH-001",
  //     name: "John Smith",
  //     email: "john.smith@publisher.com",
  //     phone: "+1 (555) 123-4567",
  //     address: "123 Writer St, New York, NY 10001",
  //   },
  //   {
  //     id: "AUTH-002",
  //     name: "Jane Doe",
  //     email: "jane.doe@authors.com",
  //     phone: "+1 (555) 234-5678",
  //     address: "456 Book Ave, Boston, MA 02101",
  //   },
  //   {
  //     id: "AUTH-003",
  //     name: "Robert Johnson",
  //     email: "r.johnson@writing.org",
  //     phone: "+1 (555) 345-6789",
  //     address: "789 Literary Ln, Chicago, IL 60601",
  //   },
  //   {
  //     id: "AUTH-004",
  //     name: "Dr. Emily Chen",
  //     email: "emily.chen@academic.edu",
  //     phone: "+1 (555) 456-7890",
  //     address: "321 Scholar Rd, San Francisco, CA 94101",
  //   },
  // ]);

  const [authors, setAuthors] = useState<Author[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAuthors(pageNumber, pageSize);
        // setAuthors(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };
    fetchData();
  }, [pageNumber, pageSize]);

  console.log("Authors:", authors);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [deletingAuthor, setDeletingAuthor] = useState<Author | null>(null);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "add" | "edit" | "delete";
    action: () => void;
    title: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
  };

  // const handleAddAuthor = () => {
  //   const action = () => {
  //     const newAuthor: Author = {
  //       id: `AUTH-${String(authors.length + 1).padStart(3, "0")}`,
  //       ...formData,
  //     };
  //     setAuthors([...authors, newAuthor]);
  //     setIsAddDialogOpen(false);
  //     resetForm();
  //     toast.success("Author added successfully");
  //   };

  //   setPendingAction({
  //     type: "add",
  //     action,
  //     title: "Add New Author",
  //   });
  //   setShowPasswordConfirmation(true);
  // };

  // const handleEditAuthor = (author: Author) => {
  //   setEditingAuthor(author);
  //   setFormData({
  //     name: author.name,
  //     email: author.email,
  //     phone: author.phone,
  //     address: author.address,
  //   });
  //   setIsEditDialogOpen(true);
  // };

  const handleUpdateAuthor = () => {
    if (!editingAuthor) return;

    const action = () => {
      setAuthors(
        authors.map((a) =>
          a.id === editingAuthor.id ? { ...a, ...formData } : a
        )
      );
      setIsEditDialogOpen(false);
      setEditingAuthor(null);
      resetForm();
      toast.success("Author updated successfully");
    };

    setPendingAction({
      type: "edit",
      action,
      title: "Update Author",
    });
    setShowPasswordConfirmation(true);
  };

  const handleDeleteAuthor = (author: Author) => {
    const action = () => {
      setAuthors(authors.filter((a) => a.id !== author.id));
      setDeletingAuthor(null);
      toast.success("Author deleted successfully");
    };

    setPendingAction({
      type: "delete",
      action,
      title: "Delete Author",
    });
    setShowPasswordConfirmation(true);
    setDeletingAuthor(author);
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
    setDeletingAuthor(null);
  };

  const filteredAuthors = authors.filter(
    (author) => author.name.toLowerCase().includes(searchTerm.toLowerCase())
    //  ||
    // author.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    // author.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Author Management</h1>
            <p className="text-muted-foreground">
              Manage author information and details
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => resetForm()}>
                <Plus className="h-4 w-4" />
                Add Author
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Author</DialogTitle>
                <DialogDescription>
                  Enter the author's information below
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Author Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter author name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="author@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Enter full address"
                    rows={3}
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
                {/* <Button onClick={handleAddAuthor}>Add Author</Button> */}
              </div>
            </DialogContent>
          </Dialog>
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
                    placeholder="Search authors by name, email, or ID..."
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
                      <th className="p-3 text-left">Author ID</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Phone</th>
                      <th className="p-3 text-left">Address</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAuthors.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-8 text-center text-muted-foreground"
                        >
                          No authors found
                        </td>
                      </tr>
                    ) : (
                      filteredAuthors.map((author) => (
                        <tr
                          key={author.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-3">{author.id}</td>
                          <td className="p-3">{author.name}</td>
                          {/* <td className="p-3">{author.yearOfBirth}</td>
                          <td className="p-3">{author.briefDescription}</td> */}

                          <td className="p-3">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                // onClick={() => handleEditAuthor(author)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAuthor(author)}
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
                  Showing {filteredAuthors.length} of {authors.length} author(s)
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
            <DialogTitle>Edit Author</DialogTitle>
            <DialogDescription>Update author information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Author Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter author name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="author@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Textarea
                id="edit-address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Enter full address"
                rows={3}
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
            <Button onClick={handleUpdateAuthor}>Update Author</Button>
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
      {deletingAuthor && !showPasswordConfirmation && (
        <AlertDialog
          open={!!deletingAuthor}
          onOpenChange={() => setDeletingAuthor(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete author "{deletingAuthor.name}". This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteAuthor(deletingAuthor)}
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
