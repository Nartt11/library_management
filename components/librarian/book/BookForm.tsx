"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { getAllBookCategories } from "@/services/book-category";
import { getAllAuthors } from "@/services/author";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { updateBookCategories, updateBookAuthors } from "@/services/book";
import { toast } from "sonner";
import { Book } from "@/types/book";

interface Props {
  formData: any;
  setFormData: (v: any) => void;
  errors: any;
}

export default function BookFormCreate({
  formData,
  setFormData,
  errors,
}: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);

  // Load category & author từ server
  useEffect(() => {
    async function loadData() {
      const cat = await getAllBookCategories("", 1, 50);
      const au = await getAllAuthors(1, 50, "");
      setCategories(cat.data ?? cat);
      setAuthors(au.data ?? au);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-4 grid grid-cols-3 gap-10">
      <div>
        <Label>Upload Image</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // set vào formData
            setFormData({
              ...formData,
              imgUrl: file, // file thực tế để gửi FormData
            });

            // preview ảnh
            const url = URL.createObjectURL(file);
            setFormData((prev: any) => ({
              ...prev,
              imgUrl: url,
            }));
          }}
        />

        {/* Hiển thị ảnh preview nếu có */}
        {formData.imgUrl && (
          <img
            src={formData.imgUrl}
            alt="preview"
            className="w-32 h-32 object-cover mt-3 rounded border"
          />
        )}
      </div>

      <div className="col-span-2">
        {/* ISBN */}
        <div>
          <Label>ISBN</Label>
          <Input
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
          />
          {errors?.isbn && <p className="text-red-500">{errors.isbn}</p>}
        </div>

        {/* Title */}
        <div>
          <Label>Title</Label>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          {errors?.title && <p className="text-red-500">{errors.title}</p>}
        </div>

        {/* Categories Select multiple */}
        <div>
          <Label>Categories</Label>

          <Select
            onValueChange={(value) => {
              if (!value) return;
              if (!formData.categoryIds.includes(value)) {
                setFormData({
                  ...formData,
                  categoryIds: [...formData.categoryIds, value],
                });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select categories" />
            </SelectTrigger>

            <SelectContent>
              {categories.map((c: any) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 flex-wrap mt-2">
            {formData.categoryIds.map((id: string) => {
              const item = categories.find((c) => c.id === id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      categoryIds: formData.categoryIds.filter(
                        (x: string) => x !== id
                      ),
                    })
                  }
                  className="inline-flex items-center gap-2 px-2 py-1 rounded bg-blue-100 hover:bg-blue-200"
                >
                  <span>{item?.name ?? id}</span>
                  <span className="text-xs text-red-500">×</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Authors Select multiple */}
        <div>
          <Label>Authors</Label>

          <Select
            onValueChange={(value) => {
              if (!value) return;
              if (!formData.authorIds.includes(value)) {
                setFormData({
                  ...formData,
                  authorIds: [...formData.authorIds, value],
                });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select authors" />
            </SelectTrigger>

            <SelectContent>
              {authors.map((a: any) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 flex-wrap mt-2">
            {formData.authorIds.map((id: string) => {
              const item = authors.find((a) => a.id === id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      authorIds: formData.authorIds.filter(
                        (x: string) => x !== id
                      ),
                    })
                  }
                  className="inline-flex items-center gap-2 px-2 py-1 rounded bg-green-100 hover:bg-green-200"
                >
                  <span>{item?.name ?? id}</span>
                  <span className="text-xs text-red-500">×</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Publication Year */}
        <div>
          <Label>Publication Year</Label>
          <Input
            type="number"
            value={formData.publicationYear}
            onChange={(e) =>
              setFormData({
                ...formData,
                publicationYear: Number(e.target.value),
              })
            }
          />
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}

export function BookFormUpdate({
  book,
  onClose,
}: {
  book: Book;
  onClose?: () => void;
}) {
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    book.bookCategories?.map((c) => c.id) ?? []
  );
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>(
    book.authors?.map((a) => a.id) ?? []
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    async function loadData() {
      const cat = await getAllBookCategories("", 1, 200);
      const au = await getAllAuthors(1, 200, "");
      setCategories(cat.data ?? cat);
      setAuthors(au.data ?? au);
    }
    loadData();
  }, []);

  const updateCategoriesMutation = useMutation({
    mutationFn: (payload: { id: string; categoryIds: string[] }) =>
      updateBookCategories(payload.id, payload.categoryIds),
    onSuccess: () => {
      toast.success("Book categories updated");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: () => toast.error("Failed to update book categories"),
  });

  const updateAuthorsMutation = useMutation({
    mutationFn: (payload: { id: string; authorIds: string[] }) =>
      updateBookAuthors(payload.id, payload.authorIds),
    onSuccess: () => {
      toast.success("Book authors updated");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: () => toast.error("Failed to update book authors"),
  });

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAuthor = (id: string) => {
    setSelectedAuthorIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    try {
      const origCatIds = book.bookCategories?.map((c) => c.id) ?? [];
      const origAuthorIds = book.authors?.map((a) => a.id) ?? [];

      if (
        JSON.stringify(selectedCategoryIds.slice().sort()) !==
        JSON.stringify(origCatIds.slice().sort())
      ) {
        await updateCategoriesMutation.mutateAsync({
          id: book.id,
          categoryIds: selectedCategoryIds,
        });
      }

      if (
        JSON.stringify(selectedAuthorIds.slice().sort()) !==
        JSON.stringify(origAuthorIds.slice().sort())
      ) {
        await updateAuthorsMutation.mutateAsync({
          id: book.id,
          authorIds: selectedAuthorIds,
        });
      }

      onClose?.();
    } catch (err) {
      // mutations already show toast on error
    }
  };

  return (
    <div className="space-y-4 grid grid-cols-3 gap-10">
      <div className="">
        <Label>Upload Image</Label>
        <Input type="file" accept="image/*" disabled />

        {/* Hiển thị ảnh preview nếu có */}
        {book.imgUrl && (
          <img
            src={book.imgUrl}
            alt="preview"
            className="w-32 h-32 object-cover mt-3 rounded border"
          />
        )}
      </div>

      <div className="col-span-2">
        <div>
          <Label>ISBN</Label>
          <Input value={book.isbn} disabled />
        </div>

        <div>
          <Label>Title</Label>
          <Input value={book.title} disabled />
        </div>

        <div>
          <Label>Publisher</Label>
          <Input value={book.publisher ?? ""} disabled />
        </div>

        <div>
          <Label>Publication Year</Label>
          <Input value={String(book.publicationYear)} disabled />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea value={book.description} disabled />
        </div>

        <div>
          <Label>Categories</Label>
          <Select
            value={selectedCategoryIds.join(",")}
            onValueChange={(val) => {
              const vals = val ? val.split(",").filter(Boolean) : [];
              setSelectedCategoryIds(vals);
            }}
          >
            <SelectTrigger>
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

          <div className="flex gap-2 flex-wrap mt-2">
            {selectedCategoryIds.map((id) => {
              const item = categories.find((c) => c.id === id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleCategory(id)}
                  className="inline-flex items-center gap-2 px-2 py-1 rounded bg-blue-100 hover:bg-blue-200"
                >
                  <span>{item?.name ?? id}</span>
                  <span className="text-xs text-red-500">×</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label>Authors</Label>

          <Select
            value={selectedAuthorIds.join(",")}
            onValueChange={(val) => {
              const vals = val ? val.split(",").filter(Boolean) : [];
              setSelectedAuthorIds(vals);
            }}
          >
            <SelectTrigger>
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

          <div className="flex gap-2 flex-wrap mt-2">
            {selectedAuthorIds.map((id) => {
              const item = authors.find((a) => a.id === id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleAuthor(id)}
                  className="inline-flex items-center gap-2 px-2 py-1 rounded bg-green-100 hover:bg-green-200"
                >
                  <span>{item?.name ?? ""}</span>
                  <span className="text-xs text-red-500">×</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onClose?.()}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
}
