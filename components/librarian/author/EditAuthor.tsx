"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import { Author } from "@/types/author";

export default function EditAuthor({
  editingAuthor,
  handleEditAuthor,
}: {
  editingAuthor: Author;
  handleEditAuthor: (author: Author) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState<Author>({
    id: "",
    name: "",
    yearOfBirth: 0,
    briefDescription: "",
  });

  const handleOpen = () => {
    setFormData(editingAuthor);
    setIsOpen(true);
  };

  const onSubmit = () => {
    handleEditAuthor(
      //id: editingAuthor.id, // giữ id cũ
      formData
    );

    setIsOpen(false); // đóng dialog
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" onClick={handleOpen}>
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Author</DialogTitle>
          <DialogDescription>
            Update the selected author information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Year of Birth</Label>
            <Input
              type="number"
              value={formData.yearOfBirth}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  yearOfBirth: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={formData.briefDescription}
              onChange={(e) =>
                setFormData({ ...formData, briefDescription: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={onSubmit}>Update Author</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
