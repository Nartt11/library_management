"use client";
import React, { useState } from "react";
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
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [selectedRevision, setSelectedRevision] =
    useState<InventoryRevision | null>(null);

  // Sample data for revisions
  const [revisions, setRevisions] = useState<InventoryRevision[]>([
    {
      id: "1",
      revisionCode: "INV-2024-001",
      supplierId: "SUP-001",
      staffId: "STAFF-001",
      timestamp: "2024-01-15 14:30:00",
      totalItems: 5,
      totalQuantity: 150,
      totalValue: 4250.5,
      status: "completed",
      items: [
        {
          id: "1",
          isbn: "978-0-123456-78-9",
          bookTitle: "Introduction to Computer Science",
          quantity: 30,
          unitPrice: 89.99,
          totalPrice: 2699.7,
        },
        {
          id: "2",
          isbn: "978-0-123456-79-6",
          bookTitle: "Data Structures",
          quantity: 25,
          unitPrice: 95.5,
          totalPrice: 2387.5,
        },
      ],
    },
    {
      id: "2",
      revisionCode: "INV-2024-002",
      supplierId: "SUP-002",
      staffId: "STAFF-002",
      timestamp: "2024-01-16 09:15:00",
      totalItems: 3,
      totalQuantity: 85,
      totalValue: 3150.0,
      status: "completed",
      items: [],
    },
    {
      id: "3",
      revisionCode: "INV-2024-003",
      supplierId: "SUP-001",
      staffId: "STAFF-001",
      timestamp: "2024-01-17 11:45:00",
      totalItems: 8,
      totalQuantity: 220,
      totalValue: 6800.75,
      status: "completed",
      items: [],
    },
  ]);

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
  const staffList = [
    "all",
    ...Array.from(new Set(revisions.map((r) => r.staffId))),
  ];
  const supplierList = [
    "all",
    ...Array.from(new Set(revisions.map((r) => r.supplierId))),
  ];

  // Filter revisions
  const filteredRevisions = revisions.filter((revision) => {
    const matchesStaff =
      filterStaff === "all" || revision.staffId === filterStaff;
    const matchesSupplier =
      filterSupplier === "all" || revision.supplierId === filterSupplier;

    let matchesDate = true;
    if (filterDateFrom || filterDateTo) {
      const revDate = new Date(revision.timestamp);
      if (filterDateFrom)
        matchesDate = matchesDate && revDate >= new Date(filterDateFrom);
      if (filterDateTo)
        matchesDate = matchesDate && revDate <= new Date(filterDateTo);
    }

    return matchesStaff && matchesSupplier && matchesDate;
  });

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
    setViewMode("create");
  };

  const handleViewDetails = (revision: InventoryRevision) => {
    setSelectedRevision(revision);
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
    setViewMode("detail");
  };

  const handleDeleteRevision = (id: string) => {
    setRevisions(revisions.filter((r) => r.id !== id));
    toast.success("Inventory revision deleted");
  };

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

    const newRevision: InventoryRevision = {
      id: String(Date.now()),
      revisionCode: `INV-2024-${String(revisions.length + 1).padStart(3, "0")}`,
      supplierId,
      staffId,
      timestamp: inventoryTimestamp,
      totalItems: validItems.length,
      totalQuantity,
      totalValue,
      items: validItems,
      status: "completed",
    };

    setRevisions([newRevision, ...revisions]);
    toast.success("Inventory revision saved successfully");
    setViewMode("dashboard");
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
              <select
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
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Supplier</Label>
              <select
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
              </select>
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
                {filteredRevisions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      No inventory revisions found
                    </td>
                  </tr>
                ) : (
                  filteredRevisions.map((revision) => (
                    <tr
                      key={revision.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3">
                        <Badge variant="outline" className="font-mono">
                          {revision.revisionCode}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm">{revision.supplierId}</td>
                      <td className="p-3 text-sm">{revision.staffId}</td>
                      <td className="p-3 text-sm text-gray-600">
                        {revision.timestamp}
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="secondary">{revision.totalItems}</Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="secondary">
                          {revision.totalQuantity}
                        </Badge>
                      </td>
                      <td
                        className="p-3 text-right"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        ${revision.totalValue.toFixed(2)}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(revision)}
                            className="h-8 gap-1 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                            <span className="text-xs">View</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRevision(revision.id)}
                            className="h-8 w-8 p-0 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
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
            {filteredRevisions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No inventory revisions found
              </div>
            ) : (
              filteredRevisions.map((revision) => (
                <Card
                  key={revision.id}
                  className="shadow-sm"
                  style={{ borderRadius: "12px" }}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="font-mono">
                        {revision.revisionCode}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(revision)}
                          className="h-8 w-8 p-0 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRevision(revision.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Supplier:</span>
                        <div>{revision.supplierId}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Staff:</span>
                        <div>{revision.staffId}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Time:</span>
                        <div className="text-xs">{revision.timestamp}</div>
                      </div>
                    </div>
                    <div className="flex gap-4 pt-2 border-t text-sm">
                      <div>
                        <span className="text-gray-600">Items:</span>
                        <Badge variant="secondary" className="ml-1">
                          {revision.totalItems}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-600">Qty:</span>
                        <Badge variant="secondary" className="ml-1">
                          {revision.totalQuantity}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-600">Value:</span>
                        <span
                          className="ml-1"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          ${revision.totalValue.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredRevisions.length} of {revisions.length} revision(s)
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
