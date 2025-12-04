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
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

export default function BooksTable({
  books,
  onEdit,
  onDelete,
}: {
  books: Book[];
  onEdit?: any;
  onDelete?: any;
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
                    <Image
                      src={book.imgUrl}
                      height={80}
                      width={60}
                      alt={book.title}
                      className="object-cover rounded-md"
                    />
                  </td>
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
                    {book.bookCategories.map((cat) => cat.name).join(", ")}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(book)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(book)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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
