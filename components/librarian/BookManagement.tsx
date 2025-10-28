import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Upload,
  Download,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import type { User } from "../../page";
import { PasswordConfirmation } from "../PasswordConfirmation";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  bookId: string;
  category: string;
  status: "available" | "borrowed" | "overdue";
  location: string;
  description: string;
  copies: number;
  availableCopies: number;
}

interface BookManagementProps {
  isAddDialogOpen?: boolean;
  onAddDialogOpenChange?: (open: boolean) => void;
  currentUser?: User;
}

export function BookManagement({
  isAddDialogOpen: externalIsAddDialogOpen,
  onAddDialogOpenChange,
  currentUser,
}: BookManagementProps = {}) {
  const [books, setBooks] = useState<Book[]>([
    {
      id: "1",
      title: "Introduction to Computer Science",
      author: "John Smith",
      isbn: "978-0-123456-78-9",
      bookId: "CS-001",
      category: "Computer Science",
      status: "available",
      location: "Section A, Shelf 2",
      description:
        "A comprehensive introduction to computer science fundamentals.",
      copies: 5,
      availableCopies: 3,
    },
    {
      id: "2",
      title: "Data Structures and Algorithms",
      author: "Jane Doe",
      isbn: "978-0-123456-79-6",
      bookId: "CS-002",
      category: "Computer Science",
      status: "borrowed",
      location: "Section A, Shelf 3",
      description:
        "In-depth coverage of data structures and algorithmic thinking.",
      copies: 3,
      availableCopies: 0,
    },
    {
      id: "3",
      title: "Modern Physics",
      author: "Robert Johnson",
      isbn: "978-0-123456-80-2",
      bookId: "PHY-001",
      category: "Physics",
      status: "available",
      location: "Section B, Shelf 1",
      description:
        "Contemporary approaches to understanding physical phenomena.",
      copies: 4,
      availableCopies: 2,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [internalIsAddDialogOpen, setInternalIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [pendingDeleteAction, setPendingDeleteAction] = useState<{
    bookId: string;
    bookTitle: string;
  } | null>(null);
  const [showEditPasswordConfirmation, setShowEditPasswordConfirmation] =
    useState(false);
  const [pendingEditAction, setPendingEditAction] = useState<Book | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use external dialog state if provided, otherwise use internal state
  const isAddDialogOpen =
    externalIsAddDialogOpen !== undefined
      ? externalIsAddDialogOpen
      : internalIsAddDialogOpen;
  const setIsAddDialogOpen =
    onAddDialogOpenChange || setInternalIsAddDialogOpen;

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    bookId: "",
    category: "",
    location: "",
    description: "",
    copies: 1,
  });

  const categories = [
    "all",
    ...Array.from(new Set(books.map((book) => book.category))),
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);
    const matchesCategory =
      selectedCategory === "all" || book.category === selectedCategory;
    const matchesStatus =
      statusFilter === "all" || book.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const addBook = () => {
    if (!newBook.title || !newBook.author || !newBook.isbn) {
      toast.error("Please fill in all required fields");
      return;
    }

    const book: Book = {
      id: Date.now().toString(),
      ...newBook,
      status: "available" as const,
      availableCopies: newBook.copies,
    };

    setBooks([...books, book]);
    setNewBook({
      title: "",
      author: "",
      isbn: "",
      bookId: "",
      category: "",
      location: "",
      description: "",
      copies: 1,
    });
    setIsAddDialogOpen(false);
    toast.success("Book added successfully!");
  };

  const confirmDeleteBook = (bookId: string, bookTitle: string) => {
    setPendingDeleteAction({ bookId, bookTitle });
    setShowPasswordConfirmation(true);
  };

  const handlePasswordConfirmed = () => {
    if (pendingDeleteAction) {
      setBooks(books.filter((book) => book.id !== pendingDeleteAction.bookId));
      toast.success(`"${pendingDeleteAction.bookTitle}" deleted successfully!`);
      setPendingDeleteAction(null);
    }
    setShowPasswordConfirmation(false);
  };

  const handlePasswordCancelled = () => {
    setPendingDeleteAction(null);
    setShowPasswordConfirmation(false);
  };

  const editBook = (book: Book) => {
    setEditingBook(book);
    setNewBook({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      bookId: book.bookId,
      category: book.category,
      location: book.location,
      description: book.description,
      copies: book.copies,
    });
    setIsEditDialogOpen(true);
  };

  const confirmUpdateBook = () => {
    if (!editingBook || !newBook.title || !newBook.author || !newBook.isbn) {
      toast.error("Please fill in all required fields");
      return;
    }
    setPendingEditAction(editingBook);
    setShowEditPasswordConfirmation(true);
  };

  const handleEditPasswordConfirmed = () => {
    if (pendingEditAction) {
      const updatedBook: Book = {
        ...pendingEditAction,
        ...newBook,
        availableCopies:
          pendingEditAction.availableCopies +
          (newBook.copies - pendingEditAction.copies),
      };

      setBooks(
        books.map((book) =>
          book.id === pendingEditAction.id ? updatedBook : book
        )
      );
      setEditingBook(null);
      setNewBook({
        title: "",
        author: "",
        isbn: "",
        category: "",
        bookId: "",
        location: "",
        description: "",
        copies: 1,
      });
      setIsEditDialogOpen(false);
      toast.success("Book updated successfully!");
      setPendingEditAction(null);
    }
    setShowEditPasswordConfirmation(false);
  };

  const handleEditPasswordCancelled = () => {
    setPendingEditAction(null);
    setShowEditPasswordConfirmation(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line);

        if (lines.length < 2) {
          toast.error(
            "CSV file must have at least a header row and one data row"
          );
          return;
        }

        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const requiredHeaders = ["title", "author", "isbn"];
        const missingHeaders = requiredHeaders.filter(
          (h) => !headers.includes(h)
        );

        if (missingHeaders.length > 0) {
          toast.error(`Missing required headers: ${missingHeaders.join(", ")}`);
          return;
        }

        const newBooks: Book[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i]
            .split(",")
            .map((v) => v.trim().replace(/"/g, ""));

          if (values.length !== headers.length) {
            toast.error(`Row ${i + 1} has incorrect number of columns`);
            continue;
          }

          const bookData: any = {};
          headers.forEach((header, index) => {
            bookData[header] = values[index];
          });

          if (!bookData.title || !bookData.author || !bookData.isbn) {
            toast.error(`Row ${i + 1} is missing required fields`);
            continue;
          }

          const book: Book = {
            id: crypto.randomUUID(), // ✅ hoặc Date.now().toString()
            bookId: Date.now().toString() + i,
            title: bookData.title,
            author: bookData.author,
            isbn: bookData.isbn,
            category: bookData.category || "Uncategorized",
            status: "available",
            location: bookData.location || "Not assigned",
            description: bookData.description || "",
            copies: parseInt(bookData.copies) || 1,
            availableCopies: parseInt(bookData.copies) || 1,
          };

          newBooks.push(book);
        }

        if (newBooks.length > 0) {
          setBooks([...books, ...newBooks]);
          toast.success(`${newBooks.length} books imported successfully!`);
          setIsBulkImportOpen(false);
        }
      } catch (error) {
        toast.error("Error reading file. Please ensure it's a valid CSV file.");
      }
    };

    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadTemplate = () => {
    const csvContent =
      'title,author,isbn,category,location,description,copies\n"Sample Book Title","Author Name","978-0-123456-78-9","Fiction","Section A, Shelf 1","Book description",3';
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "book_import_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "default";
      case "borrowed":
        return "secondary";
      case "overdue":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2 flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Book Management
          </h1>
          <p className="text-muted-foreground">
            Manage library books, availability, and inventory.
          </p>
        </div>

        <div className="flex gap-2">
          <Dialog open={isBulkImportOpen} onOpenChange={setIsBulkImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Bulk Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Bulk Import Books</DialogTitle>
                <DialogDescription>
                  Import multiple books from a CSV file.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload a CSV file with book information
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Choose File
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Required columns: title, author, isbn</p>
                  <p className="mb-2">
                    Optional columns: category, location, description, copies
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={downloadTemplate}
                  className="w-full gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogDescription>
                  Add a new book to the library catalog.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newBook.title}
                    onChange={(e) =>
                      setNewBook({ ...newBook, title: e.target.value })
                    }
                    placeholder="Book title"
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={newBook.author}
                    onChange={(e) =>
                      setNewBook({ ...newBook, author: e.target.value })
                    }
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <Label htmlFor="isbn">ISBN *</Label>
                  <Input
                    id="isbn"
                    value={newBook.isbn}
                    onChange={(e) =>
                      setNewBook({ ...newBook, isbn: e.target.value })
                    }
                    placeholder="978-0-123456-78-9"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newBook.category}
                    onChange={(e) =>
                      setNewBook({ ...newBook, category: e.target.value })
                    }
                    placeholder="e.g., Computer Science"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newBook.location}
                    onChange={(e) =>
                      setNewBook({ ...newBook, location: e.target.value })
                    }
                    placeholder="e.g., Section A, Shelf 2"
                  />
                </div>
                <div>
                  <Label htmlFor="copies">Number of Copies</Label>
                  <Input
                    id="copies"
                    type="number"
                    min="1"
                    value={newBook.copies}
                    onChange={(e) =>
                      setNewBook({
                        ...newBook,
                        copies: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newBook.description}
                    onChange={(e) =>
                      setNewBook({ ...newBook, description: e.target.value })
                    }
                    placeholder="Book description"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addBook} className="flex-1">
                    Add Book
                  </Button>
                  <Button
                    onClick={() => setIsAddDialogOpen(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>Update book information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
                placeholder="Book title"
              />
            </div>
            <div>
              <Label htmlFor="edit-author">Author *</Label>
              <Input
                id="edit-author"
                value={newBook.author}
                onChange={(e) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
                placeholder="Author name"
              />
            </div>
            <div>
              <Label htmlFor="edit-isbn">ISBN *</Label>
              <Input
                id="edit-isbn"
                value={newBook.isbn}
                onChange={(e) =>
                  setNewBook({ ...newBook, isbn: e.target.value })
                }
                placeholder="978-0-123456-78-9"
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={newBook.category}
                onChange={(e) =>
                  setNewBook({ ...newBook, category: e.target.value })
                }
                placeholder="e.g., Computer Science"
              />
            </div>
            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={newBook.location}
                onChange={(e) =>
                  setNewBook({ ...newBook, location: e.target.value })
                }
                placeholder="e.g., Section A, Shelf 2"
              />
            </div>
            <div>
              <Label htmlFor="edit-copies">Number of Copies</Label>
              <Input
                id="edit-copies"
                type="number"
                min="1"
                value={newBook.copies}
                onChange={(e) =>
                  setNewBook({
                    ...newBook,
                    copies: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newBook.description}
                onChange={(e) =>
                  setNewBook({ ...newBook, description: e.target.value })
                }
                placeholder="Book description"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={confirmUpdateBook} className="flex-1">
                Update Book
              </Button>
              <Button
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingBook(null);
                  setNewBook({
                    title: "",
                    author: "",
                    isbn: "",
                    bookId: "",
                    category: "",
                    location: "",
                    description: "",
                    copies: 1,
                  });
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-48">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="borrowed">Borrowed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredBooks.length} of {books.length} books
        </p>
      </div>

      {/* Books Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 text-sm">Book Details</th>
                  <th className="p-4 text-sm">Category</th>
                  <th className="p-4 text-sm">Location</th>
                  <th className="p-4 text-sm">Availability</th>
                  <th className="p-4 text-sm">Status</th>
                  <th className="p-4 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <p className="line-clamp-1">{book.title}</p>
                        <p className="text-sm text-muted-foreground">
                          by {book.author}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ISBN: {book.isbn}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{book.category}</td>
                    <td className="p-4 text-sm">{book.location}</td>
                    <td className="p-4">
                      <div className="text-sm">
                        <span className="text-green-600">
                          {book.availableCopies}
                        </span>
                        <span className="text-muted-foreground">
                          {" "}
                          / {book.copies}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">available</p>
                    </td>
                    <td className="p-4">
                      <Badge variant={getStatusColor(book.status)}>
                        {book.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editBook(book)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to delete this book?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. "{book.title}"
                                will be permanently removed from the library
                                catalog.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  confirmDeleteBook(book.id, book.title)
                                }
                              >
                                Delete Book
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredBooks.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              No books found matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Password Confirmation Dialog for Delete */}
      <PasswordConfirmation
        isOpen={showPasswordConfirmation}
        onClose={handlePasswordCancelled}
        onConfirm={handlePasswordConfirmed}
        title="Delete Book"
        description={`You are about to delete "${pendingDeleteAction?.bookTitle}". This action cannot be undone and will permanently remove the book from the library catalog.`}
        actionName="Confirm Delete"
        currentUser={currentUser}
      />

      {/* Password Confirmation Dialog for Edit */}
      <PasswordConfirmation
        isOpen={showEditPasswordConfirmation}
        onClose={handleEditPasswordCancelled}
        onConfirm={handleEditPasswordConfirmed}
        title="Update Book"
        description={`You are about to update "${pendingEditAction?.title}". Please enter your password to confirm this action.`}
        actionName="Confirm Update"
        currentUser={currentUser}
      />
    </div>
  );
}
