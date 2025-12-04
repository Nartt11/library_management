// components/author/AuthorForm.tsx
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Props {
  formData: any;
  setFormData: (v: any) => void;
}

export function AuthorForm({ formData, setFormData }: Props) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Year of birth</Label>
        <Input
          type="number"
          value={formData.yearOfBirth}
          onChange={(e) =>
            setFormData({ ...formData, yearOfBirth: e.target.value })
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
  );
}
