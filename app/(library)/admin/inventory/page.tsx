"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Eye,
  Filter,
  FileDown,
  FileSpreadsheet,
  ChevronLeft,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { BookImport, BookImportResponse } from "@/types/book";
import { getAllBooksImport } from "@/services/book";

interface BookItem {
  id: string;
  isbn: string;
  bookTitle: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface InventoryRevision {
  id: string;
  revisionCode: string;
  supplierId: string;
  staffId: string;
  timestamp: string;
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  items: BookItem[];
  status: "draft" | "completed";
}

type ViewMode = "dashboard" | "create" | "edit" | "detail";

export default function BookInventoryManagement() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [imports, setImports] = useState<BookImport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;

    async function fetchBookImports() {
      setLoading(true);
      setError(null);

      try {
        const res = (await getAllBooksImport(
          currentPage,
          pageSize
        )) as BookImportResponse;

        if (!mounted) return;

        setImports(res.data);
        setTotalPages(res.totalPages);
        setTotalItems(res.totalItems);
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || "Failed to fetch book imports");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchBookImports();

    return () => {
      mounted = false;
    };
  }, [currentPage, pageSize]);

  // Filters
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterStaff, setFilterStaff] = useState("all");
  const [filterSupplier, setFilterSupplier] = useState("all");

  // Form state
  const [supplierId, setSupplierId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [inventoryTimestamp] = useState(
    new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  );
  const [bookItems, setBookItems] = useState<BookItem[]>([
    {
      id: "1",
      isbn: "",
      bookTitle: "",
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
    },
  ]);

  // Extract unique values for filters
  // const staffList = [
  //   "all",
  //   ...Array.from(new Set(revisions.map((r) => r.staffId))),
  // ];
  // const supplierList = [
  //   "all",
  //   ...Array.from(new Set(revisions.map((r) => r.supplierId))),
  // ];

  // Filter revisions

  // Handlers
  const handleCreateNew = () => {
    setSupplierId("");
    setStaffId("");
    setBookItems([
      {
        id: "1",
        isbn: "",
        bookTitle: "",
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
      },
    ]);
    router.push("/admin/inventory/new");
  };

  const handleViewDetails = (revision: InventoryRevision) => {
    //setSelectedRevision(revision);
    setSupplierId(revision.supplierId);
    setStaffId(revision.staffId);
    setBookItems(
      revision.items.length > 0
        ? revision.items
        : [
            {
              id: "1",
              isbn: "",
              bookTitle: "",
              quantity: 0,
              unitPrice: 0,
              totalPrice: 0,
            },
          ]
    );
  };

  // const handleDeleteRevision = (id: string) => {
  //   setRevisions(revisions.filter((r) => r.id !== id));
  //   toast.success("Inventory revision deleted");
  // };

  const handleAddBookItem = () => {
    const newItem: BookItem = {
      id: String(Date.now()),
      isbn: "",
      bookTitle: "",
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
    };
    setBookItems([...bookItems, newItem]);
  };

  const handleUpdateItem = (
    id: string,
    field: keyof BookItem,
    value: string | number
  ) => {
    setBookItems(
      bookItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          if (field === "quantity" || field === "unitPrice") {
            const qty = field === "quantity" ? Number(value) : item.quantity;
            const price =
              field === "unitPrice" ? Number(value) : item.unitPrice;
            updatedItem.totalPrice = qty * price;
          }

          return updatedItem;
        }
        return item;
      })
    );
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
    setSupplierId("");
    setStaffId("");
    setBookItems([
      {
        id: "1",
        isbn: "",
        bookTitle: "",
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
      },
    ]);
    toast.success("All items reset");
  };

  const handleSaveRevision = () => {
    if (!supplierId.trim()) {
      toast.error("Supplier Code is required");
      return;
    }
    if (!staffId.trim()) {
      toast.error("Staff ID is required");
      return;
    }

    const validItems = bookItems.filter((item) => item.isbn.trim() !== "");
    if (validItems.length === 0) {
      toast.error("Please add at least one book item");
      return;
    }

    const totalQuantity = validItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalValue = validItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    // const newRevision: InventoryRevision = {
    //   id: String(Date.now()),
    //   revisionCode: `INV-2024-${String(revisions.length + 1).padStart(3, "0")}`,
    //   supplierId,
    //   staffId,
    //   timestamp: inventoryTimestamp,
    //   totalItems: validItems.length,
    //   totalQuantity,
    //   totalValue,
    //   items: validItems,
    //   status: "completed",
    // };

    // setRevisions([newRevision, ...revisions]);
    // toast.success("Inventory revision saved successfully");
    // setViewMode("dashboard");
  };

  const handleExportPDF = () => {
    toast.success("Exporting to PDF...");
  };

  const handleExportCSV = () => {
    toast.success("Exporting to CSV...");
  };

  // Calculate totals for current form
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
    <Container>
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl mb-1"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Book Inventory Management
          </h1>
          <p className="text-gray-600 text-sm">Quản lý kiểm kê sách</p>
        </div>
        <Button
          onClick={handleCreateNew}
          className="gap-2 h-11 w-full sm:w-auto"
          style={{
            borderRadius: "10px",
            backgroundColor: "#2D6CDF",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <Plus className="h-4 w-4" />
          Create New Inventory Revision
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="shadow-sm" style={{ borderRadius: "16px" }}>
        <CardHeader>
          <CardTitle
            className="text-base flex items-center gap-2"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Date From</Label>
              <Input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="h-10"
                style={{
                  borderRadius: "8px",
                  backgroundColor: "#F5F1ED",
                  border: "1px solid #E5E0DB",
                }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Date To</Label>
              <Input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="h-10"
                style={{
                  borderRadius: "8px",
                  backgroundColor: "#F5F1ED",
                  border: "1px solid #E5E0DB",
                }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Staff</Label>
              {/* <select
                value={filterStaff}
                onChange={(e) => setFilterStaff(e.target.value)}
                className="w-full h-10 px-3 rounded-lg text-sm"
                style={{
                  borderRadius: "8px",
                  backgroundColor: "#F5F1ED",
                  border: "1px solid #E5E0DB",
                }}
              >
                {staffList.map((staff) => (
                  <option key={staff} value={staff}>
                    {staff === "all" ? "All Staff" : staff}
                  </option>
                ))}
              </select> */}
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Supplier</Label>
              {/* <select
                value={filterSupplier}
                onChange={(e) => setFilterSupplier(e.target.value)}
                className="w-full h-10 px-3 rounded-lg text-sm"
                style={{
                  borderRadius: "8px",
                  backgroundColor: "#F5F1ED",
                  border: "1px solid #E5E0DB",
                }}
              >
                {supplierList.map((supplier) => (
                  <option key={supplier} value={supplier}>
                    {supplier === "all" ? "All Suppliers" : supplier}
                  </option>
                ))}
              </select> */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revisions Table */}
      <Card className="shadow-sm" style={{ borderRadius: "16px" }}>
        <CardHeader>
          <CardTitle
            className="text-lg"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Inventory Revisions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className="border-b bg-gray-50"
                  style={{ borderRadius: "8px 8px 0 0" }}
                >
                  <th
                    className="text-left p-3 text-sm text-gray-700"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Revision Code
                  </th>
                  <th
                    className="text-left p-3 text-sm text-gray-700"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Supplier Code
                  </th>
                  <th
                    className="text-left p-3 text-sm text-gray-700"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Staff ID
                  </th>
                  <th
                    className="text-left p-3 text-sm text-gray-700"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Timestamp
                  </th>
                  <th
                    className="text-center p-3 text-sm text-gray-700"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Total Items
                    <br />
                    (Số loại sách)
                  </th>
                  <th
                    className="text-center p-3 text-sm text-gray-700"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Total Qty
                    <br />
                    (Tổng số cuốn)
                  </th>
                  <th
                    className="text-right p-3 text-sm text-gray-700"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Total Value
                    <br />
                    (Tổng tiền)
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
                {imports.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      No inventory revisions found
                    </td>
                  </tr>
                ) : (
                  imports.map((revision) => (
                    <tr
                      key={revision.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3">
                        <Badge variant="outline" className="font-mono">
                          {revision.id}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm">{revision.supplier.id}</td>
                      <td className="p-3 text-sm">{revision.staff.fullName}</td>
                      <td className="p-3 text-sm text-gray-600">
                        {revision.importDate}
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="secondary">
                          {revision.totalAmount}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="secondary">{revision.note}</Badge>
                      </td>
                      <td
                        className="p-3 text-right"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {/* ${revision.totalValue.toFixed(2)} */}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/inventory/${revision.id}`)
                            }
                            className="h-8 gap-1 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                            <span className="text-xs">View</span>
                          </Button>
                          {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRevision(revision.id)}
                            className="h-8 w-8 p-0 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {imports.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No inventory revisions found
              </div>
            ) : (
              imports.map((revision) => (
                <Card
                  key={revision.id}
                  className="shadow-sm"
                  style={{ borderRadius: "12px" }}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="font-mono">
                        {revision.id}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/inventory/${revision.id}`)
                          }
                          className="h-8 w-8 p-0 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRevision(revision.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button> */}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Supplier:</span>
                        <div>{revision.supplier.id}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Staff:</span>
                        <div>{revision.staff.fullName}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Time:</span>
                        <div className="text-xs">{revision.importDate}</div>
                      </div>
                    </div>
                    <div className="flex gap-4 pt-2 border-t text-sm">
                      <div>
                        <span className="text-gray-600">Items:</span>
                        <Badge variant="secondary" className="ml-1">
                          {revision.totalAmount}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-600">Qty:</span>
                        <Badge variant="secondary" className="ml-1">
                          {/* {revision.totalQuantity} */}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-600">Value:</span>
                        <span
                          className="ml-1"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {/* ${revision.totalValue.toFixed(2)} */}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {totalPages} of {totalItems} revision(s)
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
