"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getBookImportById } from "@/services/book";

export default function BookImportDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    async function fetchDetail() {
      try {
        setLoading(true);
        const res = await getBookImportById(id);
        if (mounted) setData(res);
      } catch (err: any) {
        if (mounted) setError(err?.message || "Failed to load import detail");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchDetail();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!data) return <p className="p-6">No data</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        onClick={() => router.push("/admin/inventory")}
        className="gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Inventory Import Detail</h1>
        <p className="text-sm text-gray-600">
          View inventory import information
        </p>
      </div>

      {/* Session Info */}
      <Card>
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Supplier</p>
            <p className="font-medium">{data.supplier?.name}</p>
          </div>

          <div>
            <p className="text-gray-500">Staff</p>
            <p className="font-medium">{data.staff?.fullName}</p>
          </div>

          <div>
            <p className="text-gray-500">Import Date</p>
            <p className="font-medium">
              {new Date(data.importDate).toLocaleString("vi-VN")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p>
            <span className="text-gray-500">Total Amount:</span>{" "}
            <span className="font-medium">{data.totalAmount}</span>
          </p>
        </CardContent>
      </Card>

      {/* Book Details */}
      <Card>
        <CardHeader>
          <CardTitle>Imported Books</CardTitle>
        </CardHeader>
        <CardContent>
          {data.bookImportDetails?.length === 0 ? (
            <p className="text-sm text-gray-500">
              No book items in this import.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3">Book</th>
                  <th className="text-right p-3">Quantity</th>
                  <th className="text-right p-3">Unit Price</th>
                  <th className="text-right p-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.bookImportDetails.map((item: any, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{item.bookTitle}</td>
                    <td className="p-3 text-right">{item.quantity}</td>
                    <td className="p-3 text-right">
                      ${item.unitPrice?.toFixed(2)}
                    </td>
                    <td className="p-3 text-right">
                      ${item.totalPrice?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Note */}
      <Card>
        <CardHeader>
          <CardTitle>Note</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">{data.note || "No note"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
