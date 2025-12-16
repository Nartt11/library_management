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
import { BookImport, BookImportResponse, Staff, Supplier } from "@/types/book";
import { getAllBooksImport } from "@/services/book";
import { getAllSupplier } from "@/services/supplier";
import { getAllStaff } from "@/services/staff";

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
  
  // Filters - declare before useEffect that depends on them
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterStaff, setFilterStaff] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");
  
  // Search inputs
  const [staffSearchTerm, setStaffSearchTerm] = useState("");
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  
  useEffect(() => {
    let mounted = true;

    async function fetchBookImports() {
      setLoading(true);
      setError(null);

      try {
        const res = (await getAllBooksImport(
          currentPage,
          pageSize,
          filterSupplier,
          filterStaff,
          filterDateFrom,
          filterDateTo
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
  }, [currentPage, pageSize, filterSupplier, filterStaff, filterDateFrom, filterDateTo]);

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
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  
  // Debounced fetch for staff
  useEffect(() => {
    if (!staffSearchTerm || staffSearchTerm === filterStaff) {
      setStaffList([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const staffRes = await getAllStaff(1, 20, staffSearchTerm);
        setStaffList(staffRes.data ?? []);
      } catch (err: any) {
        console.error("Failed to fetch staff:", err);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [staffSearchTerm, filterStaff]);

  // Debounced fetch for supplier
  useEffect(() => {
    if (!supplierSearchTerm || supplierSearchTerm === filterSupplier) {
      setSupplierList([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const supplierRes = await getAllSupplier(supplierSearchTerm, 1, 20);
        setSupplierList(supplierRes.data ?? []);
      } catch (err: any) {
        console.error("Failed to fetch supplier:", err);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [supplierSearchTerm, filterSupplier]);

  // Filter handlers
  const handleApplyStaffFilter = () => {
    setCurrentPage(1);
  };

  const handleApplySupplierFilter = () => {
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterStaff("");
    setFilterSupplier("");
    setStaffSearchTerm("");
    setSupplierSearchTerm("");
    setCurrentPage(1);
  };

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

  // const handleDeleteRevision = (id: string) => {
  //   setRevisions(revisions.filter((r) => r.id !== id));
  //   toast.success("Inventory revision deleted");
  // };

  const handleExportPDF = () => {
    toast.success("Exporting to PDF...");
  };

  const handleExportCSV = () => {
    toast.success("Exporting to CSV...");
  };

  // Calculate totals for current form

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
          <div className="space-y-4">
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
                <Label className="text-sm text-gray-600">Search & Select Staff</Label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Type to search staff..."
                    value={staffSearchTerm}
                    onChange={(e) => setStaffSearchTerm(e.target.value)}
                    onFocus={() => setStaffList([])}
                    className="h-10"
                    style={{
                      borderRadius: "8px",
                      backgroundColor: "#F5F1ED",
                      border: "1px solid #E5E0DB",
                    }}
                  />
                  {staffList.length > 0 && (
                    <div
                      className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #E5E0DB",
                      }}
                    >
                      <div
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                          setFilterStaff("");
                          setStaffSearchTerm("");
                          setStaffList([]);
                        }}
                      >
                        All Staff
                      </div>
                      {staffList.map((staff) => (
                        <div
                          key={staff.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-sm border-t"
                          onClick={() => {
                            setFilterStaff(staff.fullName);
                            setStaffSearchTerm(staff.fullName);
                            setStaffList([]);
                          }}
                        >
                          {staff.fullName}
                          <span className="text-xs text-gray-500 ml-2">
                            ({staff.email})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {filterStaff && (
                  <div className="text-xs text-gray-600 mt-1">
                    Selected: <span className="font-medium">{filterStaff}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Search & Select Supplier</Label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Type to search supplier..."
                    value={supplierSearchTerm}
                    onChange={(e) => setSupplierSearchTerm(e.target.value)}
                    onFocus={() => setSupplierList([])}
                    className="h-10"
                    style={{
                      borderRadius: "8px",
                      backgroundColor: "#F5F1ED",
                      border: "1px solid #E5E0DB",
                    }}
                  />
                  {supplierList.length > 0 && (
                    <div
                      className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #E5E0DB",
                      }}
                    >
                      <div
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                          setFilterSupplier("");
                          setSupplierSearchTerm("");
                          setSupplierList([]);
                        }}
                      >
                        All Suppliers
                      </div>
                      {supplierList.map((supplier) => (
                        <div
                          key={supplier.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-sm border-t"
                          onClick={() => {
                            setFilterSupplier(supplier.name);
                            setSupplierSearchTerm(supplier.name);
                            setSupplierList([]);
                          }}
                        >
                          {supplier.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {filterSupplier && (
                  <div className="text-xs text-gray-600 mt-1">
                    Selected: <span className="font-medium">{filterSupplier}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="gap-2"
                style={{ borderRadius: "8px" }}
              >
                <RotateCcw className="h-4 w-4" />
                Clear Filters
              </Button>
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
                    Supplier Name
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
                    Noted
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
                      <td className="p-3 text-sm">{revision.supplier.name}</td>
                      <td className="p-3 text-sm">{revision.staff.fullName}</td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(revision.importDate).toLocaleString("vi-VN")}
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="secondary">
                          {revision.bookImportDetails.length}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="secondary">
                          {revision.totalAmount}
                        </Badge>
                      </td>
                      <td
                        className="p-3 text-right"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {revision.note}
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
