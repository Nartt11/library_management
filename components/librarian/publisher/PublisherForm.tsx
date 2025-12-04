import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Props {
  formData: any;
  setFormData: (v: any) => void;
  errors: any;
}

export default function PublisherForm({
  formData,
  setFormData,
  errors,
}: Props) {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="name">Publisher Name*</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e: any) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="Enter publisher name"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone number*</Label>
        <Input
          id="phone"
          value={formData.phoneNumber}
          onChange={(e: any) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          placeholder="+84 123 456 789"
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address*</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e: any) =>
            setFormData({ ...formData, address: e.target.value })
          }
          placeholder="Enter full address"
          rows={3}
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address}</p>
        )}
      </div>
    </div>
  );
}
