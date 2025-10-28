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
  Lock,
} from "lucide-react";
import { toast } from "sonner";
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

interface AdminBookManagementProps {
  onDeleteBook?: (book: Book) => void;
}

export function AdminBookManagement({
  onDeleteBook,
}: AdminBookManagementProps) {
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
    {
      id: "4",
      title: "Advanced Mathematics",
      author: "Dr. Emily Chen",
      isbn: "978-0-123456-81-9",
      bookId: "MATH-001",
      category: "Mathematics",
      status: "available",
      location: "Section C, Shelf 1",
      description: "Advanced mathematical concepts and applications.",
      copies: 6,
      availableCopies: 4,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "add" | "edit" | "delete" | "import";
    action: () => void;
    title: string;
    description: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      book.isbn.includes(searchTerm) ||
      book.bookId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || book.category === selectedCategory;
    const matchesStatus =
      statusFilter === "all" || book.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const requirePasswordConfirmation = (
    actionType: "add" | "edit" | "delete" | "import",
    action: () => void,
    title: string,
    description: string
  ) => {
    setPendingAction({ type: actionType, action, title, description });
    setShowPasswordConfirmation(true);
  };

  const handlePasswordConfirmed = () => {
    if (pendingAction) {
      pendingAction.action();
      setPendingAction(null);
    }
    setShowPasswordConfirmation(false);
  };

  const handlePasswordCancelled = () => {
    setPendingAction(null);
    setShowPasswordConfirmation(false);
  };

  const addBook = () => {
    if (!newBook.title || !newBook.author || !newBook.isbn || !newBook.bookId) {
      toast.error("Please fill in all required fields");
      return;
    }

    requirePasswordConfirmation(
      "add",
      () => {
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
      },
      "Add New Book",
      `You are about to add "${newBook.title}" to the library catalog. This action will make the book available for borrowing.`
    );
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

  const updateBook = () => {
    if (
      !editingBook ||
      !newBook.title ||
      !newBook.author ||
      !newBook.isbn ||
      !newBook.bookId
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    requirePasswordConfirmation(
      "edit",
      () => {
        const updatedBook: Book = {
          ...editingBook,
          ...newBook,
          availableCopies:
            editingBook.availableCopies + (newBook.copies - editingBook.copies),
        };

        setBooks(
          books.map((book) => (book.id === editingBook.id ? updatedBook : book))
        );
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
        setIsEditDialogOpen(false);
        toast.success("Book updated successfully!");
      },
      "Update Book",
      `You are about to update "${editingBook.title}". This will modify the book information in the library catalog.`
    );
  };

  const deleteBook = (bookId: string, bookTitle: string) => {
    requirePasswordConfirmation(
      "delete",
      () => {
        const bookToDelete = books.find((book) => book.id === bookId);
        if (bookToDelete && onDeleteBook) {
          onDeleteBook(bookToDelete);
        }
        setBooks(books.filter((book) => book.id !== bookId));
        toast.success(`"${bookTitle}" moved to backup!`);
      },
      "Delete Book",
      `You are about to permanently delete "${bookTitle}" from the library catalog. This action cannot be undone.`
    );
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
        const requiredHeaders = ["title", "author", "isbn", "bookid"];
        const missingHeaders = requiredHeaders.filter(
          (h) => !headers.includes(h)
        );

        if (missingHeaders.length > 0) {
          toast.error(`Missing required headers: ${missingHeaders.join(", ")}`);
          return;
        }

        requirePasswordConfirmation(
          "import",
          () => {
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

              if (
                !bookData.title ||
                !bookData.author ||
                !bookData.isbn ||
                !bookData.bookid
              ) {
                toast.error(`Row ${i + 1} is missing required fields`);
                continue;
              }

              const book: Book = {
                id: Date.now().toString() + i,
                title: bookData.title,
                author: bookData.author,
                isbn: bookData.isbn,
                bookId: bookData.bookid,
                category: bookData.category || "Uncategorized",
                status: "available" as const,
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
          },
          "Bulk Import Books",
          `You are about to import ${file.name}. This will add multiple books to the library catalog at once.`
        );
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
      'title,author,isbn,bookid,category,location,description,copies\n"Sample Book Title","Author Name","978-0-123456-78-9","CS-001","Fiction","Section A, Shelf 1","Book description",3';
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "book_import_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportBooks = () => {
    const headers = [
      "title",
      "author",
      "isbn",
      "bookid",
      "category",
      "location",
      "description",
      "copies",
      "status",
    ];
    const csvContent = [
      headers.join(","),
      ...books.map((book) =>
        [
          `"${book.title}"`,
          `"${book.author}"`,
          book.isbn,
          book.bookId,
          `"${book.category}"`,
          `"${book.location}"`,
          `"${book.description}"`,
          book.copies,
          book.status,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `library_books_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Books exported successfully!");
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
            Admin Book Management
          </h1>
          <p className="text-muted-foreground">
            Comprehensive book management with advanced admin features.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={exportBooks} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>

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
                  <p className="mb-2">
                    Required columns: title, author, isbn, bookid
                  </p>
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
                  <Label htmlFor="bookId">Book ID *</Label>
                  <Input
                    id="bookId"
                    value={newBook.bookId}
                    onChange={(e) =>
                      setNewBook({ ...newBook, bookId: e.target.value })
                    }
                    placeholder="e.g., CS-001, PHY-002"
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
              <Label htmlFor="edit-bookId">Book ID *</Label>
              <Input
                id="edit-bookId"
                value={newBook.bookId}
                onChange={(e) =>
                  setNewBook({ ...newBook, bookId: e.target.value })
                }
                placeholder="e.g., CS-001, PHY-002"
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
              <Button onClick={updateBook} className="flex-1">
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
                placeholder="Search by title, author, ISBN, or Book ID..."
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
        <Badge variant="outline">
          Total Inventory: {books.reduce((sum, book) => sum + book.copies, 0)}{" "}
          copies
        </Badge>
      </div>

      {/* Books Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 text-sm">Book Details</th>
                  <th className="p-4 text-sm">Book ID</th>
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
                    <td className="p-4">
                      <Badge variant="outline" className="font-mono text-xs">
                        {book.bookId}
                      </Badge>
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
                          className="gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete "{book.title}" from the
                                library catalog.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteBook(book.id, book.title)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
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

      {/* Password Confirmation Dialog */}
      <PasswordConfirmation
        isOpen={showPasswordConfirmation}
        onClose={handlePasswordCancelled}
        onCancel={handlePasswordCancelled}
        onConfirm={handlePasswordConfirmed}
        title={pendingAction?.title || ""}
        description={pendingAction?.description || ""}
        actionName="Confirm Action"
        userRole="admin"
      />
    </div>
  );
}
