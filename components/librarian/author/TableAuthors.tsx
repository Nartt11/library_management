import { Author } from "@/types/author";
import React from "react";
import { Button } from "../../ui/button";
import { Edit, Trash2 } from "lucide-react";
import { deleteAuthor } from "@/services/author";
import { toast } from "sonner";
import EditAuthor from "./EditAuthor";
import { Dialog } from "@/components/ui/dialog";
import DialogDelete from "../DialogDelete";

export default function TableAuthors({
  authors,
  handleEditAuthor,
  handleDeleteAuthor,
}: {
  authors: Author[];
  handleEditAuthor: (author: Author) => void;
  handleDeleteAuthor: (author: Author) => void;
}) {
  // const handleDeleteAuthor = async (author: Author) => {
  //   try {
  //     console.log("Delete author:", author);

  //     const res = await deleteAuthor(author.id); // gọi API thật sự

  //     if (res) {
  //       toast.success("Author deleted successfully");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     // message.error("Xóa tác giả thất bại!");
  //   }
  // };

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-3 text-left">Author ID</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Year Of Birth</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors?.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-muted-foreground">
                No authors found
              </td>
            </tr>
          ) : (
            authors?.map((author) => (
              <tr key={author.id} className="border-b hover:bg-muted/50">
                <td className="p-3">{author.id}</td>
                <td className="p-3">{author.name}</td>
                <td className="p-3">{author.yearOfBirth}</td>
                <td className="p-3">{author.briefDescription}</td>

                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <EditAuthor
                      editingAuthor={author}
                      handleEditAuthor={handleEditAuthor}
                    />
                    <DialogDelete
                      title={`Delete Author ${author.name}`}
                      deletingItem={author}
                      handleDelete={handleDeleteAuthor}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
