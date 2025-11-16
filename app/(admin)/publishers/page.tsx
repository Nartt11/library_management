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
import { Building2, Search, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PasswordConfirmation } from "./../../../components/PasswordConfirmation";
import type { User } from "../../../types/user";

interface Publisher {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface PublisherManagementProps {
  currentUser: User;
}

export default function PublisherManagement({
  currentUser,
}: PublisherManagementProps) {
  const [publishers, setPublishers] = useState<Publisher[]>([
    {
      id: "PUB-001",
      name: "Oxford University Press",
      email: "contact@oup.com",
      phone: "+1 (800) 445-9714",
      address: "198 Madison Avenue, New York, NY 10016",
    },
    {
      id: "PUB-002",
      name: "Pearson Education",
      email: "info@pearson.com",
      phone: "+1 (800) 922-0579",
      address: "330 Hudson Street, New York, NY 10013",
    },
    {
      id: "PUB-003",
      name: "O'Reilly Media",
      email: "contact@oreilly.com",
      phone: "+1 (800) 998-9938",
      address: "1005 Gravenstein Highway North, Sebastopol, CA 95472",
    },
    {
      id: "PUB-004",
      name: "McGraw-Hill Education",
      email: "customer.service@mheducation.com",
      phone: "+1 (800) 338-3987",
      address: "2 Penn Plaza, New York, NY 10121",
    },
    {
      id: "PUB-005",
      name: "Wiley",
      email: "info@wiley.com",
      phone: "+1 (800) 225-5945",
      address: "111 River Street, Hoboken, NJ 07030",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState<Publisher | null>(
    null
  );
  const [deletingPublisher, setDeletingPublisher] = useState<Publisher | null>(
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

  const handleAddPublisher = () => {
    const action = () => {
      const newPublisher: Publisher = {
        id: `PUB-${String(publishers.length + 1).padStart(3, "0")}`,
        ...formData,
      };
      setPublishers([...publishers, newPublisher]);
      setIsAddDialogOpen(false);
      resetForm();
      toast.success("Publisher added successfully");
    };

    setPendingAction({
      type: "add",
      action,
      title: "Add New Publisher",
    });
    setShowPasswordConfirmation(true);
  };

  const handleEditPublisher = (publisher: Publisher) => {
    setEditingPublisher(publisher);
    setFormData({
      name: publisher.name,
      email: publisher.email,
      phone: publisher.phone,
      address: publisher.address,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePublisher = () => {
    if (!editingPublisher) return;

    const action = () => {
      setPublishers(
        publishers.map((p) =>
          p.id === editingPublisher.id ? { ...p, ...formData } : p
        )
      );
      setIsEditDialogOpen(false);
      setEditingPublisher(null);
      resetForm();
      toast.success("Publisher updated successfully");
    };

    setPendingAction({
      type: "edit",
      action,
      title: "Update Publisher",
    });
    setShowPasswordConfirmation(true);
  };

  const handleDeletePublisher = (publisher: Publisher) => {
    const action = () => {
      setPublishers(publishers.filter((p) => p.id !== publisher.id));
      setDeletingPublisher(null);
      toast.success("Publisher deleted successfully");
    };

    setPendingAction({
      type: "delete",
      action,
      title: "Delete Publisher",
    });
    setShowPasswordConfirmation(true);
    setDeletingPublisher(publisher);
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
    setDeletingPublisher(null);
  };

  const filteredPublishers = publishers.filter(
    (publisher) =>
      publisher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      publisher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      publisher.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Publisher Management</h1>
            <p className="text-muted-foreground">
              Manage publisher information and details
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => resetForm()}>
                <Plus className="h-4 w-4" />
                Add Publisher
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Publisher</DialogTitle>
                <DialogDescription>
                  Enter the publisher's information below
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Publisher Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter publisher name"
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
                    placeholder="publisher@example.com"
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
                    placeholder="+1 (800) 123-4567"
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
                <Button onClick={handleAddPublisher}>Add Publisher</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Publishers
            </CardTitle>
            <CardDescription>
              Browse and manage all publishers in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search publishers by name, email, or ID..."
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
                      <th className="p-3 text-left">Publisher ID</th>
                      <th className="p-3 text-left">Publisher Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Phone</th>
                      <th className="p-3 text-left">Address</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPublishers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-8 text-center text-muted-foreground"
                        >
                          No publishers found
                        </td>
                      </tr>
                    ) : (
                      filteredPublishers.map((publisher) => (
                        <tr
                          key={publisher.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-3">{publisher.id}</td>
                          <td className="p-3">{publisher.name}</td>
                          <td className="p-3">{publisher.email}</td>
                          <td className="p-3">{publisher.phone}</td>
                          <td className="p-3">{publisher.address}</td>
                          <td className="p-3">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditPublisher(publisher)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePublisher(publisher)}
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
                  Showing {filteredPublishers.length} of {publishers.length}{" "}
                  publisher(s)
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
            <DialogTitle>Edit Publisher</DialogTitle>
            <DialogDescription>Update publisher information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Publisher Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter publisher name"
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
                placeholder="publisher@example.com"
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
                placeholder="+1 (800) 123-4567"
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
            <Button onClick={handleUpdatePublisher}>Update Publisher</Button>
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
      {deletingPublisher && !showPasswordConfirmation && (
        <AlertDialog
          open={!!deletingPublisher}
          onOpenChange={() => setDeletingPublisher(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete publisher "{deletingPublisher.name}". This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeletePublisher(deletingPublisher)}
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
