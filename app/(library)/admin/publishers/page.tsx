"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Plus, Search, UserPen } from "lucide-react";
import { SmartPagination } from "@/components/ui/SmartPagination";
import DialogDelete from "@/components/librarian/DialogDelete";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePublishers } from "@/hooks/usePublishers";
import TablePublishers from "@/components/librarian/publisher/TablePublishers";
import PublisherForm from "@/components/librarian/publisher/PublisherForm";
import { Input } from "@/components/ui/input";

export default function publisherPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState("");

  const { publishersQuery, createMutation, updateMutation, deleteMutation } =
    usePublishers(searchTerm, page, pageSize);

  const publishers = publishersQuery.data?.data ?? [];
  const totalPages = publishersQuery.data?.totalPages ?? 1;
  const currentPage = publishersQuery.data?.pageNumber ?? page;
  const totalItems = publishersQuery.data?.totalItems ?? 0;

  // DIALOG STATES
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedPublisher, setSelectedPublisher] = useState<any>(null);

  const emptyForm = {
    name: "",
    phoneNumber: "",
    address: "",
  };

  const [formData, setFormData] = useState<any>(emptyForm);
  const [errors, setErrors] = useState({
    name: "",
    phoneNumber: "",
    address: "",
  });

  // Validate fields ****************
  function validateForm() {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // if (!formData.phoneNumber.trim()) {
    //   newErrors.phoneNumber = "Phone number is required";
    // } else if (isNaN(Number(formData.yearOfBirth))) {
    //   newErrors.yearOfBirth = "Must be a number";
    // } else if (Number(formData.yearOfBirth) < 1900) {
    //   newErrors.yearOfBirth = "Year must be >= 1900";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ---------------- ADD publisher -----------------
  const openAddDialog = () => {
    setFormData(emptyForm);
    setErrors({
      name: "",
      phoneNumber: "",
      address: "",
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

  // ---------------- EDIT publisher -----------------
  const handleEdit = (publisher: any) => {
    setSelectedPublisher(publisher);

    setFormData({
      id: publisher.id,
      name: publisher.name,
      phoneNumber: publisher.phoneNumber,
      address: publisher.address || "",
    });
    setErrors({
      name: "",
      phoneNumber: "",
      address: "",
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
  const handleDelete = (publisher: any) => {
    setSelectedPublisher(publisher);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedPublisher.id, {
      onSuccess: () => setDeleteOpen(false),
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Publisher Management</h1>
          <p className="text-muted-foreground">
            Manage publisher information and details
          </p>
        </div>

        <Button className="gap-2" onClick={openAddDialog}>
          <Plus className="h-4 w-4" /> Add publisher
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPen className="h-5 w-5" />
            publishers
          </CardTitle>
          <CardDescription>Browse and manage all publishers</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search categories by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {/* TABLE */}
            <div className="rounded-md border">
              <TablePublishers
                publishers={publishers}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Showing <b>{publishers.length}</b> of <b>{totalItems}</b>{" "}
                publisher(s)
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
            <DialogTitle>Add publisher</DialogTitle>
          </DialogHeader>

          <PublisherForm
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
            <DialogTitle>Edit publisher</DialogTitle>
          </DialogHeader>

          <PublisherForm
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
        title={`Delete publisher "${selectedPublisher?.name}"`}
        description="Are you sure? This action cannot be undone."
        onConfirm={confirmDelete}
      />
    </div>
  );
}
