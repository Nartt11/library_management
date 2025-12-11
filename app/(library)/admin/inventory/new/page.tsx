"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  RotateCcw,
  Save,
  Plus,
  Trash2,
  ChevronLeft,
  FileDown,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getAllBooks, importBooks } from "@/services/book";
import { Book } from "@/types/book";

export default function InventoryCreatePage() {
  const router = useRouter();

  const [supplierId, setSupplierId] = useState("");
  const [notes, setNotes] = useState("");
  const [bookItems, setBookItems] = useState([
    {
      isbn: "",
      bookTitle: "",
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
    },
  ]);

  const handleAddItem = () => {
    setBookItems([
      ...bookItems,
      {
        isbn: "",
        bookTitle: "",
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
      },
    ]);
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const updated = [...bookItems];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    // Auto update total price
    updated[index].totalPrice =
      updated[index].quantity * updated[index].unitPrice;

    // Auto fill book title khi nhập ISBN
    if (field === "isbn") {
      const book = findBookByISBN(books, value);
      updated[index].bookTitle = book ? book.title : "";
    }

    setBookItems(updated);
  };

  function findBookByISBN(books: Book[], isbn: string) {
    if (!isbn) return null;
    return books.find((b) => b.isbn === isbn) || null;
  }
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getAllBooks(1, 200);
      setBooks(data.data);
    }
    load();
  }, []);

  const handleSave = async () => {
    const payload = {
      supplierId,
      notes,
      details: bookItems.map((item) => {
        const resolvedBook = findBookByISBN(books, item.isbn);
        if (!resolvedBook) {
          throw new Error(`Book not found for ISBN: ${item.isbn}`);
        }

        return {
          bookId: resolvedBook.id, // đảm bảo string
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        };
      }),
    };
    console.log("payload import book", payload);

    //await importBooks(payload);
    toast.success("Saved revision!");
    router.push("/admin/inventory");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/inventory")}
          className="gap-2"
          style={{ borderRadius: "8px" }}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl sm:text-3xl mb-1"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Create New Inventory Revision
          </h1>
          <p className="text-gray-600 text-sm">
            Input multiple book items for warehouse inventory session
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            // onClick={handleExportPDF}
            className="gap-2 h-11"
            variant="outline"
            style={{ borderRadius: "10px", fontFamily: "Inter, sans-serif" }}
          >
            <FileDown className="h-4 w-4" />
            Export PDF
          </Button>
          <Button
            //onClick={handleExportCSV}
            className="gap-2 h-11"
            variant="outline"
            style={{ borderRadius: "10px", fontFamily: "Inter, sans-serif" }}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card
        className="shadow-md"
        style={{ borderRadius: "16px", borderLeft: "4px solid #2D6CDF" }}
      >
        <CardHeader>
          <CardTitle
            className="text-lg"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Inventory Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div
              className="text-center p-6 rounded-xl"
              style={{ backgroundColor: "#EEF5FF" }}
            >
              <div
                className="text-sm text-gray-600 mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Total Book Titles
                <br />
                <span className="text-xs">(Số loại sách)</span>
              </div>
              <div
                className="text-4xl"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {/* {totalBookTitles} */} 12
              </div>
            </div>
            <div
              className="text-center p-6 rounded-xl"
              style={{ backgroundColor: "#F0FDF4" }}
            >
              <div
                className="text-sm text-gray-600 mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Total Quantity
                <br />
                <span className="text-xs">(Tổng số cuốn)</span>
              </div>
              <div
                className="text-4xl"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {/* {totalQuantity} */}
              </div>
            </div>
            <div
              className="text-center p-6 rounded-xl"
              style={{ backgroundColor: "#FEF3C7" }}
            >
              <div
                className="text-sm text-gray-600 mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Total Money
                <br />
                <span className="text-xs">(Tổng tiền)</span>
              </div>
              <div
                className="text-4xl"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {/* ${totalMoney.toFixed(2)} */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Book Items */}
      <Card className="shadow-sm" style={{ borderRadius: "16px" }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle
            className="text-lg"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Book Inventory Table
          </CardTitle>
          <div
            className="text-sm text-gray-600"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {/* {totalBookTitles} {totalBookTitles === 1 ? "item" : "items"} */}
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th
                    className="text-left p-3 text-sm text-gray-700"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    ISBN
                  </th>
                  <th
                    className="text-left p-3 text-sm text-gray-700"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Book Title
                  </th>
                  <th
                    className="text-left p-3 text-sm text-gray-700"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Quantity
                  </th>
                  <th
                    className="text-left p-3 text-sm text-gray-700"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Unit Price ($)
                  </th>
                  <th
                    className="text-left p-3 text-sm text-gray-700"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Total Price ($)
                  </th>

                  <th
                    className="text-right p-3 text-sm text-gray-700"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookItems.map((item, index) => (
                  <tr
                    key={item.isbn}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3">
                      <Input
                        value={item.isbn}
                        onChange={(e) =>
                          handleUpdateItem(index, "isbn", e.target.value)
                        }
                        placeholder="978-0-123456-78-9"
                        // disabled={isDetailView}
                        className="h-10 min-w-[160px]"
                        style={{
                          borderRadius: "8px",
                          backgroundColor: "#F5F1ED",
                          border: "1px solid #E5E0DB",
                        }}
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        value={item.bookTitle}
                        onChange={(e) =>
                          handleUpdateItem(index, "bookTitle", e.target.value)
                        }
                        placeholder="Enter book title..."
                        // disabled={isDetailView}
                        className="h-10 min-w-[200px]"
                        style={{
                          borderRadius: "8px",
                          backgroundColor: "#F5F1ED",
                          border: "1px solid #E5E0DB",
                        }}
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        value={item.quantity || ""}
                        onChange={(e) =>
                          handleUpdateItem(
                            index,
                            "quantity",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0"
                        // disabled={isDetailView}
                        className="h-10 w-24"
                        style={{
                          borderRadius: "8px",
                          backgroundColor: "#F5F1ED",
                          border: "1px solid #E5E0DB",
                        }}
                        min="0"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice || ""}
                        onChange={(e) =>
                          handleUpdateItem(
                            index,
                            "unitPrice",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0.00"
                        // disabled={isDetailView}
                        className="h-10 w-28"
                        style={{
                          borderRadius: "8px",
                          backgroundColor: "#F5F1ED",
                          border: "1px solid #E5E0DB",
                        }}
                        min="0"
                      />
                    </td>
                    <td className="p-3">
                      <div
                        className="text-sm px-3 py-2 bg-white border rounded-md min-w-[100px]"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #E5E0DB",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        ${item.totalPrice.toFixed(2)}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          // onClick={() => handleDeleteItem(item.id)}
                          className="h-9 w-9 p-0 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {bookItems.map((item, index) => (
              <Card
                key={item.isbn}
                className="shadow-sm"
                style={{ borderRadius: "12px" }}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Item #{index + 1}
                    </span>

                    <Button
                      variant="ghost"
                      size="sm"
                      // onClick={() => handleDeleteItem(item.id)}
                      className="h-8 w-8 p-0 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">ISBN</Label>
                    <Input
                      value={item.isbn}
                      onChange={(e) =>
                        handleUpdateItem(index, "isbn", e.target.value)
                      }
                      placeholder="978-0-123456-78-9"
                      // disabled={isDetailView}
                      className="h-10"
                      style={{
                        borderRadius: "8px",
                        backgroundColor: "#F5F1ED",
                        border: "1px solid #E5E0DB",
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Book Title</Label>
                    <Input
                      value={item.bookTitle}
                      onChange={(e) =>
                        handleUpdateItem(index, "bookTitle", e.target.value)
                      }
                      placeholder="Enter book title..."
                      // disabled={isDetailView}
                      className="h-10"
                      style={{
                        borderRadius: "8px",
                        backgroundColor: "#F5F1ED",
                        border: "1px solid #E5E0DB",
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">Quantity</Label>
                      <Input
                        type="number"
                        value={item.quantity || ""}
                        onChange={(e) =>
                          handleUpdateItem(
                            index,
                            "quantity",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0"
                        // disabled={isDetailView}
                        className="h-10"
                        style={{
                          borderRadius: "8px",
                          backgroundColor: "#F5F1ED",
                          border: "1px solid #E5E0DB",
                        }}
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">
                        Unit Price ($)
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice || ""}
                        onChange={(e) =>
                          handleUpdateItem(
                            index,
                            "unitPrice",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0.00"
                        // disabled={isDetailView}
                        className="h-10"
                        style={{
                          borderRadius: "8px",
                          backgroundColor: "#F5F1ED",
                          border: "1px solid #E5E0DB",
                        }}
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Price:
                      </span>
                      <span
                        className="text-base"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        ${item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Book Item Button */}

          <div className="mt-4">
            <Button
              variant="outline"
              onClick={handleAddItem}
              className="w-full sm:w-auto gap-2 h-11"
              style={{
                borderRadius: "10px",
                borderColor: "#2D6CDF",
                color: "#2D6CDF",
                fontFamily: "Inter, sans-serif",
              }}
            >
              <Plus className="h-4 w-4" />
              Add Book Item
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm" style={{ borderRadius: "16px" }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle
            className="text-lg"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Note
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Note something"
            // disabled={isDetailView}
            className="h-10 min-w-[160px]"
            style={{
              borderRadius: "8px",
              backgroundColor: "#F5F1ED",
              border: "1px solid #E5E0DB",
            }}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" /> Save Revision
        </Button>
      </div>
    </div>
  );
}
