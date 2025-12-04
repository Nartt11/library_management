import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Props {
  formData: any;
  setFormData: (v: any) => void;
  errors: any;
}

export function AuthorForm({ formData, setFormData, errors }: Props) {
  return (
    <div className="space-y-4 py-4">
      {formData.id && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">ID</label>
          <input
            value={formData.id}
            disabled
            className="bg-gray-100 border p-2 rounded cursor-not-allowed"
          />
        </div>
      )}

      {/* Name */}
      <div className="space-y-1">
        <Label>Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
      </div>

      {/* Year of Birth */}
      <div className="space-y-1">
        <Label>Year of birth</Label>
        <Input
          type="number"
          value={formData.yearOfBirth}
          onChange={(e) =>
            setFormData({ ...formData, yearOfBirth: e.target.value })
          }
        />
        {errors.yearOfBirth && (
          <p className="text-red-500 text-xs">{errors.yearOfBirth}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1">
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
