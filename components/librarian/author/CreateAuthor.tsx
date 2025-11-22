"use client";

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
import { Plus } from "lucide-react";
import { Author } from "@/types/author";

interface ChildProps {
  // isAddDialogOpen: boolean;
  // setIsAddDialogOpen: (open: boolean) => void;
  handleAddAuthor: (author: Author) => void;
}

export default function DialogAddNewItem({
  // isAddDialogOpen,
  // setIsAddDialogOpen,
  handleAddAuthor,
}: ChildProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    yearOfBirth: "",
    briefDescription: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    yearOfBirth: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      yearOfBirth: "",
      briefDescription: "",
    });

    setErrors({
      name: "",
      yearOfBirth: "",
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.yearOfBirth.trim()) {
      newErrors.yearOfBirth = "Year is required";
      isValid = false;
    } else if (isNaN(Number(formData.yearOfBirth))) {
      newErrors.yearOfBirth = "Year must be a number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = () => {
    if (!validateForm()) return;

    const author: Author = {
      id: "",
      name: formData.name,
      yearOfBirth: Number(formData.yearOfBirth),
      briefDescription: formData.briefDescription,
    };

    handleAddAuthor(author);
    resetForm();
    setIsAddDialogOpen(false);
  };

  return (
    <div>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2" onClick={resetForm}>
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
            {/* Name */}
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
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Year */}
            <div className="space-y-2">
              <Label htmlFor="birth">Birthday</Label>
              <Input
                id="birth"
                type="number"
                value={formData.yearOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, yearOfBirth: e.target.value })
                }
                placeholder="1990"
              />
              {errors.yearOfBirth && (
                <p className="text-red-500 text-sm">{errors.yearOfBirth}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.briefDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    briefDescription: e.target.value,
                  })
                }
                placeholder="Short description"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>

            <Button onClick={onSubmit}>Add Author</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
