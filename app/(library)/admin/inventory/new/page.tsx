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
  ChevronsUpDown,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getAllBooks, importBooks } from "@/services/book";
import { Book } from "@/types/book";
import { useAuth } from "@/context/authContext";
import { Supplier } from "@/types/supplier";
import { getAllSupplier } from "@/services/supplier";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

type BookItem = {
  isbn: string;
  bookTitle: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export default function InventoryCreatePage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const inventoryTimestamp = new Date().toLocaleString("vi-VN");

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [staffId, setStaffId] = useState(currentUser?.name);
  const [notes, setNotes] = useState("");
  const [openSupplierSelect, setOpenSupplierSelect] = useState(false);
  const [openBookSelect, setOpenBookSelect] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;

    async function fetchSuppliers() {
      setLoading(true);
      setError(null);

      try {
        const res = await getAllSupplier("", 1, 50);

        if (!mounted) return;

        // Giả sử API trả về dạng { data: Supplier[] }
        setSuppliers(res.data ?? res);
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || "Failed to fetch suppliers");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchSuppliers();

    return () => {
      mounted = false;
    };
  }, [selectedSupplier]);

  const [bookItems, setBookItems] = useState([
    {
      id: String(Date.now()),
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
        id: String(Date.now()),
        isbn: "",
        bookTitle: "",
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
      },
    ]);
  };
  const handleDeleteItem = (id: string) => {
    if (bookItems.length === 1) {
      toast.error("Cannot delete the last item");
      return;
    }
    setBookItems(bookItems.filter((item) => item.id !== id));
    toast.success("Book item removed");
  };

  const handleResetItems = () => {
    setSelectedSupplier(undefined);
    setBookItems([
      {
        id: String(Date.now()),
        isbn: "",
        bookTitle: "",
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
      },
    ]);
    toast.success("All items reset");
  };

  const handleUpdateItem = (
    index: number,
    field: keyof BookItem,
    value: any
  ) => {
    const updated = [...bookItems];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    // ✅ Book Title → ISBN (when selecting from dropdown)
    if (field === "bookTitle") {
      const book = findBookByTitle(books, value);
      updated[index].isbn = book ? book.isbn : "";
    }

    // auto total
    updated[index].totalPrice =
      updated[index].quantity * updated[index].unitPrice;

    setBookItems(updated);
  };

  const handleISBNBlur = (index: number, isbn: string) => {
    const book = findBookByISBN(books, isbn);
    if (book) {
      handleUpdateItem(index, "bookTitle", book.title);
    }
  };

  function findBookById(id: string) {
    return books.find((b) => b.id === id) || null;
  }

  function findBookByISBN(books: Book[], isbn: string) {
    if (!isbn) return null;
    return books.find((b) => b.isbn === isbn) || null;
  }

  function findBookByTitle(books: Book[], title: string) {
    if (!title) return null;
    return books.find((b) => b.title === title) || null;
  }

  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  // Load initial books
  useEffect(() => {
    async function load() {
      const data = await getAllBooks(1, 50);
      setBooks(data.data);
    }
    load();
  }, []);

  // Search books when user types
  useEffect(() => {
    if (!searchQuery) {
      // Reset to initial books if search is empty
      async function load() {
        const data = await getAllBooks(1, 50);
        setBooks(data.data);
      }
      load();
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await getAllBooks(
          1,
          50,
          undefined,
          undefined,
          searchQuery
        );
        setBooks(data.data);
      } catch (error) {
        console.error("Error searching books:", error);
        toast.error("Failed to search books");
      } finally {
        setIsSearching(false);
      }
    }, 2000); // Debounce 2000ms (wait 2s after typing stops)

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  console.log("book in inventory", books);

  const handleSave = async () => {
    const supplierId = selectedSupplier?.id || "";
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
    if (!selectedSupplier?.id) {
      toast.error("Please select a supplier");
      return;
    }

    console.log("payload import book", payload);

    const res = await importBooks(payload);
    toast.success(res);
    router.push("/admin/inventory");
  };

  const totalBookTitles = bookItems.filter(
    (item) => item.isbn.trim() !== ""
  ).length;
  const totalQuantity = bookItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  const totalMoney = bookItems.reduce(
    (sum, item) => sum + (item.totalPrice || 0),
    0
  );

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

      <Card className="shadow-sm" style={{ borderRadius: "16px" }}>
        <CardHeader>
          <CardTitle
            className="text-lg"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Session Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-700">
                Supplier Name <span className="text-red-500">*</span>
              </Label>

              <Popover
                open={openSupplierSelect}
                onOpenChange={setOpenSupplierSelect}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-11"
                    style={{
                      borderRadius: "10px",
                      backgroundColor: "#F5F1ED",
                      border: "1px solid #E5E0DB",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {selectedSupplier?.name || "Select supplier"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search supplier..." />
                    <CommandEmpty>No supplier found.</CommandEmpty>

                    <CommandGroup>
                      {suppliers?.map((supplier) => (
                        <CommandItem
                          key={supplier.id}
                          value={supplier.name}
                          onSelect={() => {
                            setSelectedSupplier(supplier);

                            setOpenSupplierSelect(false);
                          }}
                        >
                          {supplier.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="staffId" className="text-sm text-gray-700">
                Staff Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="staffId"
                value={staffId}
                // onChange={(e) => setStaffId(e.target.value)}
                disabled={true}
                placeholder="e.g. STAFF-001"
                className="h-11"
                style={{
                  borderRadius: "10px",
                  backgroundColor: "#F5F1ED",
                  border: "1px solid #E5E0DB",
                  fontFamily: "Inter, sans-serif",
                }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-700">
                Inventory Timestamp
              </Label>
              <Input
                value={inventoryTimestamp}
                disabled
                className="h-11"
                style={{
                  borderRadius: "10px",
                  backgroundColor: "#F5F1ED",
                  border: "1px solid #E5E0DB",
                  fontFamily: "Inter, sans-serif",
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

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
                {totalBookTitles}
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
                {totalQuantity}
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
                ${totalMoney.toFixed(2)}
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
                    key={`${index}`}
                    className="border-b hover:bg-gray-50 transition-colors align-top"
                  >
                    <td className="p-3 top-0">
                      <Input
                        value={item.isbn}
                        onChange={(e) =>
                          handleUpdateItem(index, "isbn", e.target.value)
                        }
                        onBlur={(e) => handleISBNBlur(index, e.target.value)}
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
                      <div className="relative">
                        <Input
                          value={item.bookTitle}
                          onChange={(e) => {
                            handleUpdateItem(
                              index,
                              "bookTitle",
                              e.target.value
                            );
                            setOpenBookSelect(index);
                            setSearchQuery(e.target.value);
                          }}
                          onFocus={() => {
                            setOpenBookSelect(index);
                            setSearchQuery(item.bookTitle);
                          }}
                          placeholder="Type to search book title..."
                          className="h-10 min-w-[200px]"
                          style={{
                            borderRadius: "8px",
                            backgroundColor: "#F5F1ED",
                            border: "1px solid #E5E0DB",
                          }}
                        />
                        {openBookSelect === index && books.length > 0 && (
                          <div className=" z-500 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-[300px] overflow-auto">
                            {isSearching ? (
                              <div className="p-4 text-center text-sm text-gray-500">
                                Searching...
                              </div>
                            ) : books.length === 0 ? (
                              <div className="p-4 text-center text-sm text-gray-500">
                                No book found.
                              </div>
                            ) : (
                              books.map((book) => (
                                <div
                                  key={book.id}
                                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                                  onClick={() => {
                                    handleUpdateItem(
                                      index,
                                      "bookTitle",
                                      book.title
                                    );
                                    setOpenBookSelect(null);
                                    setSearchQuery("");
                                  }}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">
                                      {book.title}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      ISBN: {book.isbn}
                                    </span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
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
                          onClick={() => handleDeleteItem(item.id)}
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
                key={`${item.isbn}-${index}`}
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
                      onClick={() => handleDeleteItem(item.id)}
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
                      onBlur={(e) => handleISBNBlur(index, e.target.value)}
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
                    <div className="relative">
                      <Input
                        value={item.bookTitle}
                        onChange={(e) => {
                          handleUpdateItem(index, "bookTitle", e.target.value);
                          setOpenBookSelect(index);
                          setSearchQuery(e.target.value);
                        }}
                        onFocus={() => {
                          setOpenBookSelect(index);
                          setSearchQuery(item.bookTitle);
                        }}
                        placeholder="Type to search book title..."
                        className="h-10"
                        style={{
                          borderRadius: "8px",
                          backgroundColor: "#F5F1ED",
                          border: "1px solid #E5E0DB",
                        }}
                      />
                      {openBookSelect === index && books.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-[300px] overflow-auto">
                          {isSearching ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                              Searching...
                            </div>
                          ) : books.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                              No book found.
                            </div>
                          ) : (
                            books.map((book) => (
                              <div
                                key={book.id}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                                onClick={() => {
                                  handleUpdateItem(
                                    index,
                                    "bookTitle",
                                    book.title
                                  );
                                  setOpenBookSelect(null);
                                  setSearchQuery("");
                                }}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">
                                    {book.title}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ISBN: {book.isbn}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
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
        <Button
          variant="outline"
          onClick={() => handleResetItems()}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" /> Save Revision
        </Button>
      </div>
    </div>
  );
}
