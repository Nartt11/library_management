import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Ghost, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function EditPublisher({
  editingPublisher,
  handleEditPublisher,
}: {
  editingPublisher: Publisher;
  handleEditPublisher: (publisher: Publisher) => void;
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: editingPublisher.name,
    phoneNumber: editingPublisher.phoneNumber,
    address: editingPublisher.address,
  });

  const [errors, setErrors] = useState({
    name: "",
    phoneNumber: "",
    address: "",
  });

  const resetForm = () => {
    setFormData({
      name: editingPublisher.name,
      phoneNumber: editingPublisher.phoneNumber,
      address: editingPublisher.address,
    });

    setErrors({
      name: "",
      phoneNumber: "",
      address: "",
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = () => {
    if (!validateForm()) return;

    const publisher: Publisher = {
      id: editingPublisher.id,
      name: formData.name,
      address: formData.address,
      phoneNumber: formData.phoneNumber,
    };

    handleEditPublisher(publisher);
    resetForm();
    toast.success("Publisher added successfully");
    setIsEditDialogOpen(false);
  };
  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="gap-2" onClick={() => resetForm()}>
          <Edit className="h-4 w-4" />
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
            <Label htmlFor="name">Publisher Name*</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter publisher name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number*</Label>
            <Input
              id="phone"
              type="string"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              placeholder="+84 123 456 789"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address*</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Enter full address"
              rows={3}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Update Publisher</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
