// components/author/AuthorTable.tsx
import { Button } from "@/components/ui/button";
import { Author } from "@/types/author";
import { Edit, Trash2 } from "lucide-react";

export function AuthorTable({ authors, onEdit, onDelete }: any) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b bg-muted/50">
          <th className="p-3 text-left">ID</th>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Year Of Birth</th>
          <th className="p-3 text-left">DescriptionS</th>
          <th className="p-3 text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        {authors.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center p-6 text-muted-foreground">
              No authors found
            </td>
          </tr>
        ) : (
          authors.map((a: Author) => (
            <tr key={a.id} className="border-b">
              <td className="p-3">{a.id}</td>
              <td className="p-3">{a.name}</td>
              <td className="p-3">{a.yearOfBirth}</td>
              <td className="p-3">{a.briefDescription}</td>
              <td className="p-3">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(a)}>
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button variant="ghost" size="sm" onClick={() => onDelete(a)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
