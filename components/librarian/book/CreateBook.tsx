"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface Author {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface BookPayload {
  isbn: string;
  title: string;
  imgUrl: string;
  categoryIds: string[];
  authorIds: string[];
  publicationYear: number;
  description: string;
}

interface CreateBookProps {
  addBook: (payload: BookPayload) => void;
}

export default function CreateBook({ addBook }: CreateBookProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const [newBook, setNewBook] = useState<
    Omit<BookPayload, "authorIds" | "categoryIds">
  >({
    isbn: "",
    title: "",
    imgUrl: "",
    publicationYear: new Date().getFullYear(),
    description: "",
  });

  // Fetch authors and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorsRes = await fetch("/api/authors");
        const authorsData = await authorsRes.json();
        setAuthors(authorsData);

        const categoriesRes = await fetch("/api/categories");
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch authors or categories", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = () => {
    if (!newBook.title || !newBook.isbn) {
      toast.error("Title and ISBN are required");
      return;
    }
    if (selectedAuthorIds.length === 0) {
      toast.error("Select at least one author");
      return;
    }
    if (selectedCategoryIds.length === 0) {
      toast.error("Select at least one category");
      return;
    }

    const payload: BookPayload = {
      ...newBook,
      authorIds: selectedAuthorIds,
      categoryIds: selectedCategoryIds,
    };

    addBook(payload);
    setIsAddDialogOpen(false);
    setNewBook({
      isbn: "",
      title: "",
      imgUrl: "",
      publicationYear: new Date().getFullYear(),
      description: "",
    });
    setSelectedAuthorIds([]);
    setSelectedCategoryIds([]);
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>
            Add a new book to the library catalog.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={newBook.title}
              onChange={(e) =>
                setNewBook({ ...newBook, title: e.target.value })
              }
              placeholder="Book title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN *</Label>
            <Input
              id="isbn"
              value={newBook.isbn}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
              placeholder="978-0-123456-78-9"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imgUrl">Image URL</Label>
            <Input
              id="imgUrl"
              value={newBook.imgUrl}
              onChange={(e) =>
                setNewBook({ ...newBook, imgUrl: e.target.value })
              }
              placeholder="https://example.com/book.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="publicationYear">Publication Year</Label>
            <Input
              id="publicationYear"
              type="number"
              value={newBook.publicationYear}
              onChange={(e) =>
                setNewBook({
                  ...newBook,
                  publicationYear:
                    parseInt(e.target.value) || new Date().getFullYear(),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newBook.description}
              onChange={(e) =>
                setNewBook({ ...newBook, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Authors *</Label>
            <Select
              value={selectedAuthorIds.join(",")}
              onValueChange={(val) => setSelectedAuthorIds(val.split(","))}
              //   multiple
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select authors" />
              </SelectTrigger>
              <SelectContent>
                {authors.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Categories *</Label>
            <Select
              value={selectedCategoryIds.join(",")}
              //   multiple
              onValueChange={(val) => setSelectedCategoryIds(val.split(","))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              Add Book
            </Button>
            <Button onClick={() => setIsAddDialogOpen(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
