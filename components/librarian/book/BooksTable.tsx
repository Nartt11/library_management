import { Book } from "@/types/book";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default function BooksTable({
  books,
  onEdit,
  onDelete,
}: {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-4 text-sm">Book Image</th>
                <th className="p-4 text-sm">Book Details</th>
                <th className="p-4 text-sm">Category</th>
                <th className="p-4 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <div>
                      <p className="line-clamp-1">{book.title}</p>
                      <p className="text-sm text-muted-foreground">
                        by {book.authors.map((a) => a.name).join(", ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ISBN: {book.isbn}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-sm">
                    {book.bookCategories.map((c) => c.name).join(", ")}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      {/* <EditBook /> */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(book)}
                        className="gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>

                      {/* <DialogDelete
                        title="Delete Book"
                        description={`Are you sure you want to delete "${book.title}"? This action cannot be undone.`}
                        onConfirm={() => confirmDeleteBook(book.id)}
                      /> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
