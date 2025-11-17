"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./../../../components/ui/card";
import { Button } from "./../../../components/ui/button";
import { Input } from "./../../../components/ui/input";
import { Badge } from "./../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./../../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./../../../components/ui/alert-dialog";
import { Label } from "./../../../components/ui/label";
import { Textarea } from "./../../../components/ui/textarea";
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";
import { PasswordConfirmation } from "./../../../components/PasswordConfirmation";
import type { User } from "../../../types/user";

interface BookInventory {
  id: string;
  bookId: string;
  title: string;
  authorName: string;
  categoryName: string;
  publisherName: string;
  quantity: number;
  price: number;
  isbn: string;
}

interface BookInventoryManagementProps {
  currentUser: User;
}

export default function BookInventoryManagement({
  currentUser,
}: BookInventoryManagementProps) {
  const [inventory, setInventory] = useState<BookInventory[]>([
    {
      id: "INV-001",
      bookId: "CS-001",
      title: "Introduction to Computer Science",
      authorName: "John Smith",
      categoryName: "Computer Science",
      publisherName: "Oxford University Press",
      quantity: 15,
      price: 89.99,
      isbn: "978-0-123456-78-9",
    },
    {
      id: "INV-002",
      bookId: "CS-002",
      title: "Data Structures and Algorithms",
      authorName: "Jane Doe",
      categoryName: "Computer Science",
      publisherName: "Pearson Education",
      quantity: 12,
      price: 95.5,
      isbn: "978-0-123456-79-6",
    },
    {
      id: "INV-003",
      bookId: "PHY-001",
      title: "Modern Physics",
      authorName: "Robert Johnson",
      categoryName: "Physics",
      publisherName: "O'Reilly Media",
      quantity: 8,
      price: 75.0,
      isbn: "978-0-123456-80-2",
    },
    {
      id: "INV-004",
      bookId: "MATH-001",
      title: "Advanced Mathematics",
      authorName: "Dr. Emily Chen",
      categoryName: "Mathematics",
      publisherName: "McGraw-Hill Education",
      quantity: 20,
      price: 110.0,
      isbn: "978-0-123456-81-9",
    },
    {
      id: "INV-005",
      bookId: "LIT-001",
      title: "World Literature Anthology",
      authorName: "Various Authors",
      categoryName: "Literature",
      publisherName: "Wiley",
      quantity: 5,
      price: 65.0,
      isbn: "978-0-123456-82-6",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [selectedPublisher, setSelectedPublisher] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookInventory | null>(null);
  const [stockBook, setStockBook] = useState<BookInventory | null>(null);
  const [stockChange, setStockChange] = useState(0);
  const [deletingBook, setDeletingBook] = useState<BookInventory | null>(null);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "add" | "edit" | "delete" | "stock";
    action: () => void;
    title: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    bookId: "",
    title: "",
    authorName: "",
    categoryName: "",
    publisherName: "",
    quantity: 0,
    price: 0,
    isbn: "",
  });

  const resetForm = () => {
    setFormData({
      bookId: "",
      title: "",
      authorName: "",
      categoryName: "",
      publisherName: "",
      quantity: 0,
      price: 0,
      isbn: "",
    });
  };

  // Extract unique values for filters
  const categories = [
    "all",
    ...Array.from(new Set(inventory.map((item) => item.categoryName))),
  ];
  const authors = [
    "all",
    ...Array.from(new Set(inventory.map((item) => item.authorName))),
  ];
  const publishers = [
    "all",
    ...Array.from(new Set(inventory.map((item) => item.publisherName))),
  ];

  const handleAddBook = () => {
    const action = () => {
      const newBook: BookInventory = {
        id: `INV-${String(inventory.length + 1).padStart(3, "0")}`,
        ...formData,
      };
      setInventory([...inventory, newBook]);
      setIsAddDialogOpen(false);
      resetForm();
      toast.success("Book added to inventory successfully");
    };

    setPendingAction({
      type: "add",
      action,
      title: "Add Book to Inventory",
    });
    setShowPasswordConfirmation(true);
  };

  const handleEditBook = (book: BookInventory) => {
    setEditingBook(book);
    setFormData({
      bookId: book.bookId,
      title: book.title,
      authorName: book.authorName,
      categoryName: book.categoryName,
      publisherName: book.publisherName,
      quantity: book.quantity,
      price: book.price,
      isbn: book.isbn,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateBook = () => {
    if (!editingBook) return;

    const action = () => {
      setInventory(
        inventory.map((b) =>
          b.id === editingBook.id ? { ...b, ...formData } : b
        )
      );
      setIsEditDialogOpen(false);
      setEditingBook(null);
      resetForm();
      toast.success("Book updated successfully");
    };

    setPendingAction({
      type: "edit",
      action,
      title: "Update Book",
    });
    setShowPasswordConfirmation(true);
  };

  const handleUpdateStock = (book: BookInventory) => {
    setStockBook(book);
    setStockChange(0);
    setIsStockDialogOpen(true);
  };

  const handleConfirmStockUpdate = () => {
    if (!stockBook) return;

    const action = () => {
      setInventory(
        inventory.map((b) =>
          b.id === stockBook.id
            ? { ...b, quantity: b.quantity + stockChange }
            : b
        )
      );
      setIsStockDialogOpen(false);
      setStockBook(null);
      setStockChange(0);
      toast.success(
        `Stock ${stockChange > 0 ? "increased" : "decreased"} successfully`
      );
    };

    setPendingAction({
      type: "stock",
      action,
      title: "Update Stock",
    });
    setShowPasswordConfirmation(true);
  };

  const handleDeleteBook = (book: BookInventory) => {
    const action = () => {
      setInventory(inventory.filter((b) => b.id !== book.id));
      setDeletingBook(null);
      toast.success("Book removed from inventory successfully");
    };

    setPendingAction({
      type: "delete",
      action,
      title: "Delete Book",
    });
    setShowPasswordConfirmation(true);
    setDeletingBook(book);
  };

  const handlePasswordSuccess = () => {
    if (pendingAction) {
      pendingAction.action();
      setPendingAction(null);
    }
    setShowPasswordConfirmation(false);
  };

  const handlePasswordCancel = () => {
    setShowPasswordConfirmation(false);
    setPendingAction(null);
    setDeletingBook(null);
  };

  const filteredInventory = inventory.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.bookId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || book.categoryName === selectedCategory;
    const matchesAuthor =
      selectedAuthor === "all" || book.authorName === selectedAuthor;
    const matchesPublisher =
      selectedPublisher === "all" || book.publisherName === selectedPublisher;

    return (
      matchesSearch && matchesCategory && matchesAuthor && matchesPublisher
    );
  });

  const totalValue = filteredInventory.reduce(
    (sum, book) => sum + book.quantity * book.price,
    0
  );
  const totalBooks = filteredInventory.reduce(
    (sum, book) => sum + book.quantity,
    0
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Book Inventory Management</h1>
            <p className="text-muted-foreground">
              Track and manage book stock and pricing
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => resetForm()}>
                <Plus className="h-4 w-4" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Book to Inventory</DialogTitle>
                <DialogDescription>
                  Enter the book details and stock information
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="bookId">Book ID</Label>
                  <Input
                    id="bookId"
                    value={formData.bookId}
                    onChange={(e) =>
                      setFormData({ ...formData, bookId: e.target.value })
                    }
                    placeholder="CS-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) =>
                      setFormData({ ...formData, isbn: e.target.value })
                    }
                    placeholder="978-0-123456-78-9"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="title">Book Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter book title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authorName">Author Name</Label>
                  <Input
                    id="authorName"
                    value={formData.authorName}
                    onChange={(e) =>
                      setFormData({ ...formData, authorName: e.target.value })
                    }
                    placeholder="Author name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Category</Label>
                  <Input
                    id="categoryName"
                    value={formData.categoryName}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryName: e.target.value })
                    }
                    placeholder="Category"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publisherName">Publisher</Label>
                  <Input
                    id="publisherName"
                    value={formData.publisherName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        publisherName: e.target.value,
                      })
                    }
                    placeholder="Publisher name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddBook}>Add to Inventory</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Books</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{totalBooks}</div>
              <p className="text-xs text-muted-foreground">
                In stock across all titles
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Titles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{filteredInventory.length}</div>
              <p className="text-xs text-muted-foreground">
                Unique book titles
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Current inventory value
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Book Inventory
            </CardTitle>
            <CardDescription>
              Manage stock levels and pricing for all books
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, book ID, author, or ISBN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedAuthor}
                  onValueChange={setSelectedAuthor}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Author" />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((author) => (
                      <SelectItem key={author} value={author}>
                        {author === "all" ? "All Authors" : author}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedPublisher}
                  onValueChange={setSelectedPublisher}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Publisher" />
                  </SelectTrigger>
                  <SelectContent>
                    {publishers.map((publisher) => (
                      <SelectItem key={publisher} value={publisher}>
                        {publisher === "all" ? "All Publishers" : publisher}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left">Book ID</th>
                      <th className="p-3 text-left">Title</th>
                      <th className="p-3 text-left">Author</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-left">Publisher</th>
                      <th className="p-3 text-right">Quantity</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="p-8 text-center text-muted-foreground"
                        >
                          No books found in inventory
                        </td>
                      </tr>
                    ) : (
                      filteredInventory.map((book) => (
                        <tr
                          key={book.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-3">{book.bookId}</td>
                          <td className="p-3">{book.title}</td>
                          <td className="p-3">{book.authorName}</td>
                          <td className="p-3">
                            <Badge variant="outline">{book.categoryName}</Badge>
                          </td>
                          <td className="p-3 text-sm">{book.publisherName}</td>
                          <td className="p-3 text-right">
                            <Badge
                              variant={
                                book.quantity < 5 ? "destructive" : "secondary"
                              }
                            >
                              {book.quantity}
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            ${book.price.toFixed(2)}
                          </td>
                          <td className="p-3">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateStock(book)}
                                title="Update Stock"
                              >
                                <TrendingUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditBook(book)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteBook(book)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  Showing {filteredInventory.length} of {inventory.length}{" "}
                  book(s)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>Update book information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-bookId">Book ID</Label>
              <Input
                id="edit-bookId"
                value={formData.bookId}
                onChange={(e) =>
                  setFormData({ ...formData, bookId: e.target.value })
                }
                placeholder="CS-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-isbn">ISBN</Label>
              <Input
                id="edit-isbn"
                value={formData.isbn}
                onChange={(e) =>
                  setFormData({ ...formData, isbn: e.target.value })
                }
                placeholder="978-0-123456-78-9"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-title">Book Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter book title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-authorName">Author Name</Label>
              <Input
                id="edit-authorName"
                value={formData.authorName}
                onChange={(e) =>
                  setFormData({ ...formData, authorName: e.target.value })
                }
                placeholder="Author name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-categoryName">Category</Label>
              <Input
                id="edit-categoryName"
                value={formData.categoryName}
                onChange={(e) =>
                  setFormData({ ...formData, categoryName: e.target.value })
                }
                placeholder="Category"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-publisherName">Publisher</Label>
              <Input
                id="edit-publisherName"
                value={formData.publisherName}
                onChange={(e) =>
                  setFormData({ ...formData, publisherName: e.target.value })
                }
                placeholder="Publisher name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantity</Label>
              <Input
                id="edit-quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price ($)</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateBook}>Update Book</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stock Update Dialog */}
      <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
            <DialogDescription>
              Adjust inventory quantity for {stockBook?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Stock</Label>
              <div className="text-2xl">{stockBook?.quantity || 0} units</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock-change">Stock Change</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setStockChange(stockChange - 1)}
                >
                  <TrendingDown className="h-4 w-4" />
                </Button>
                <Input
                  id="stock-change"
                  type="number"
                  value={stockChange}
                  onChange={(e) =>
                    setStockChange(parseInt(e.target.value) || 0)
                  }
                  className="text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setStockChange(stockChange + 1)}
                >
                  <TrendingUp className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Use positive numbers to increase stock, negative to decrease
              </p>
            </div>
            <div className="space-y-2">
              <Label>New Stock</Label>
              <div className="text-2xl">
                {(stockBook?.quantity || 0) + stockChange} units
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsStockDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmStockUpdate}>Update Stock</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Confirmation Dialog */}
      {showPasswordConfirmation && pendingAction && (
        <PasswordConfirmation
          isOpen={showPasswordConfirmation}
          onConfirm={handlePasswordSuccess}
          onClose={handlePasswordCancel}
          title={pendingAction.title}
          description=""
          currentUser={currentUser}
        />
      )}

      {/* Delete Confirmation Alert */}
      {deletingBook && !showPasswordConfirmation && (
        <AlertDialog
          open={!!deletingBook}
          onOpenChange={() => setDeletingBook(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove "{deletingBook.title}" from inventory. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleteBook(deletingBook)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
