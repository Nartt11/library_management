import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Search,
  Filter,
  BookOpen,
  Calendar,
  ShoppingCart,
  LogIn,
  Sparkles,
  Library,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Footer } from "./Footer";
import type { PendingBook } from "../page";

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
  expectedReturnDate?: string;
  borrowedBy?: string;
  imageUrl: string;
}

interface ShowroomProps {
  onLoginRequired: (book?: PendingBook) => void;
}

export function Showroom({ onLoginRequired }: ShowroomProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const books: Book[] = [
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
      imageUrl:
        "https://images.unsplash.com/photo-1581019055756-93b5361f9536?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHNjaWVuY2UlMjB0ZXh0Ym9va3xlbnwxfHx8fDE3NTU1NzEzMjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
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
      expectedReturnDate: "2025-01-25",
      borrowedBy: "Available after Jan 25, 2025",
      imageUrl:
        "https://images.unsplash.com/photo-1664854953181-b12e6dda8b7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc3RydWN0dXJlcyUyMGFsZ29yaXRobXMlMjBib29rfGVufDF8fHx8MTc1NTU3MTMyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
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
      imageUrl:
        "https://images.unsplash.com/photo-1626885228113-0ac4b52e6cea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwdGV4dGJvb2t8ZW58MXx8fHwxNzU1NTcxMzIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "4",
      title: "Organic Chemistry",
      author: "Maria Garcia",
      isbn: "978-0-123456-81-9",
      bookId: "CHEM-001",
      category: "Chemistry",
      status: "available",
      location: "Section C, Shelf 2",
      description: "Comprehensive guide to organic chemical reactions.",
      copies: 2,
      availableCopies: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1626885228113-0ac4b52e6cea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVtaXN0cnklMjB0ZXh0Ym9va3xlbnwxfHx8fDE3NTU1NzEzMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "5",
      title: "Linear Algebra",
      author: "David Wilson",
      isbn: "978-0-123456-82-6",
      bookId: "MATH-001",
      category: "Mathematics",
      status: "overdue",
      location: "Section D, Shelf 1",
      description: "Vector spaces, linear transformations, and matrix theory.",
      copies: 3,
      availableCopies: 0,
      expectedReturnDate: "2025-01-30",
      borrowedBy: "Expected back by Jan 30, 2025",
      imageUrl:
        "https://images.unsplash.com/photo-1588912914017-923900a34710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMHRleHRib29rfGVufDF8fHx8MTc1NTU2MzA4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "6",
      title: "World History",
      author: "Sarah Brown",
      isbn: "978-0-123456-83-3",
      bookId: "HIST-001",
      category: "History",
      status: "available",
      location: "Section E, Shelf 3",
      description:
        "A global perspective on historical events and civilizations.",
      copies: 6,
      availableCopies: 4,
      imageUrl:
        "https://images.unsplash.com/photo-1505664194779-8beaceb93744?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3J5JTIwYm9va3xlbnwxfHx8fDE3NTU1NzEzMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "7",
      title: "Database Systems",
      author: "Michael Chen",
      isbn: "978-0-123456-84-0",
      bookId: "CS-003",
      category: "Computer Science",
      status: "borrowed",
      location: "Section A, Shelf 1",
      description:
        "Database design, implementation, and management principles.",
      copies: 4,
      availableCopies: 1,
      expectedReturnDate: "2025-01-28",
      borrowedBy: "Available after Jan 28, 2025",
      imageUrl:
        "https://images.unsplash.com/photo-1619771766980-368d32e44b82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhYmFzZSUyMHN5c3RlbXMlMjBib29rfGVufDF8fHx8MTc1NTU3MTMyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "8",
      title: "Calculus and Analytical Geometry",
      author: "Lisa Anderson",
      isbn: "978-0-123456-85-7",
      bookId: "MATH-002",
      category: "Mathematics",
      status: "available",
      location: "Section D, Shelf 2",
      description:
        "Fundamental concepts of calculus with geometric applications.",
      copies: 5,
      availableCopies: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1708011271954-c0d2b3155ded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxjdWx1cyUyMG1hdGhlbWF0aWNzJTIwYm9va3xlbnwxfHx8fDE3NTU1NzEzMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

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

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsDialogOpen(true);
  };

  const handleCheckoutReserve = (action: "borrow" | "reserve") => {
    if (selectedBook) {
      const pendingBook: PendingBook = {
        id: selectedBook.id,
        title: selectedBook.title,
        author: selectedBook.author,
        isbn: selectedBook.isbn,
        bookId: selectedBook.bookId,
        category: selectedBook.category,
        action: action,
      };
      setIsDialogOpen(false);
      onLoginRequired(pendingBook);
    }
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

  const formatExpectedDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-green-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Library className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">
                    Book Collections
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Sparkles className="h-4 w-4" />
                    <p className="text-orange-100">
                      Discover your next great read
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-orange-100 max-w-md">
                Browse our comprehensive collection of academic resources. Find
                books, check availability, and seamlessly add them to your
                borrowing cart.
              </p>
            </div>
            <div className="hidden lg:block">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onLoginRequired();
                }}
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50 active:bg-orange-100 shadow-lg hover:shadow-xl transition-all duration-200 gap-3 touch-manipulation"
                style={{
                  WebkitTapHighlightColor: "transparent",
                  minHeight: "48px",
                }}
              >
                <LogIn className="h-5 w-5" />
                Sign In to Borrow
              </Button>
            </div>
          </div>
          <div className="relative lg:hidden mt-6 z-10">
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onLoginRequired();
              }}
              size="lg"
              className="relative w-full bg-white text-orange-600 hover:bg-orange-50 active:bg-orange-100 shadow-lg hover:shadow-xl transition-all duration-200 gap-3 touch-manipulation z-20"
              style={{
                WebkitTapHighlightColor: "transparent",
                minHeight: "48px",
                fontSize: "16px",
                position: "relative",
                zIndex: 50,
              }}
            >
              <LogIn className="h-5 w-5" />
              Sign In to Borrow
            </Button>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg text-white">
                <Search className="h-5 w-5" />
              </div>
              Search & Discover
            </CardTitle>
            <CardDescription className="text-base">
              Find exactly what you're looking for with our advanced search
              tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
                <Input
                  placeholder="Search by title, author, ISBN, Book ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-2 border-orange-100 focus:border-orange-500 bg-white/70 backdrop-blur-sm rounded-xl transition-all duration-200"
                />
              </div>
              <div className="flex gap-4">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full lg:w-48 h-12 border-2 border-orange-100 focus:border-orange-500 bg-white/70 backdrop-blur-sm rounded-xl">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-orange-200">
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="rounded-lg"
                      >
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-48 h-12 border-2 border-orange-100 focus:border-orange-500 bg-white/70 backdrop-blur-sm rounded-xl">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-orange-200">
                    <SelectItem value="all" className="rounded-lg">
                      All Status
                    </SelectItem>
                    <SelectItem value="available" className="rounded-lg">
                      Available
                    </SelectItem>
                    <SelectItem value="borrowed" className="rounded-lg">
                      Borrowed
                    </SelectItem>
                    <SelectItem value="overdue" className="rounded-lg">
                      Overdue
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Results Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {filteredBooks.length} Books Found
              </p>
              <p className="text-sm text-muted-foreground">
                Total collection: {books.length} books
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm border-green-200 bg-green-50 text-green-700"
            >
              Available:{" "}
              {books.filter((book) => book.status === "available").length}
            </Badge>
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm border-amber-200 bg-amber-50 text-amber-700"
            >
              Total Copies: {books.reduce((sum, book) => sum + book.copies, 0)}
            </Badge>
          </div>
        </div>

        {/* Enhanced Books Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              className="group cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm overflow-hidden"
              onClick={() => handleBookClick(book)}
            >
              <CardContent className="p-0">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <ImageWithFallback
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Badge
                    variant={getStatusColor(book.status)}
                    className="absolute top-3 right-3 text-xs font-semibold shadow-lg"
                  >
                    {book.status}
                  </Badge>
                  {book.status === "available" && book.availableCopies > 0 && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {book.availableCopies} left
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold line-clamp-2 text-foreground mb-2 group-hover:text-orange-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-1">
                    by {book.author}
                  </p>
                  <p className="text-xs text-orange-600 font-medium">
                    {book.category}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <div className="p-4 bg-orange-100 rounded-full w-fit mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-lg font-semibold text-foreground mb-2">
                No books found
              </p>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or browse all categories.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Call-to-Action */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-green-500 via-teal-500 to-green-600 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-50"></div>
          <CardContent className="relative py-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Sparkles className="h-8 w-8" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">Ready to Start Reading?</h3>
              <p className="text-green-100 text-lg max-w-2xl mx-auto">
                Sign in with your student credentials to add books to your cart
                and generate QR borrow tickets. Access thousands of academic
                resources instantly.
              </p>
            </div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onLoginRequired();
              }}
              size="lg"
              className="bg-white text-green-600 hover:bg-green-50 active:bg-green-100 shadow-xl hover:shadow-2xl transition-all duration-200 gap-3 px-8 py-3 touch-manipulation"
              style={{
                WebkitTapHighlightColor: "transparent",
                minHeight: "48px",
                fontSize: "16px",
              }}
            >
              <LogIn className="h-5 w-5" />
              Get Started Now
            </Button>
          </CardContent>
        </Card>

        {/* Enhanced Book Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="w-[400px] h-[550px] border-0 shadow-2xl rounded-2xl bg-white/95 backdrop-blur-sm p-6">
            {selectedBook && (
              <div className="flex flex-col h-full">
                <DialogHeader className="flex-shrink-0 pb-4">
                  <DialogTitle className="text-lg font-bold line-clamp-2 text-foreground leading-tight">
                    {selectedBook.title}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    by {selectedBook.author}
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 flex flex-col space-y-4">
                  <div className="flex justify-center flex-shrink-0">
                    <div className="w-20 h-28 relative rounded-lg overflow-hidden shadow-md">
                      <ImageWithFallback
                        src={selectedBook.imageUrl}
                        alt={selectedBook.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs flex-shrink-0">
                    <div className="space-y-2">
                      <div>
                        <span className="text-muted-foreground text-xs uppercase tracking-wide block">
                          Book ID
                        </span>
                        <span className="font-mono text-xs truncate block text-orange-600 font-semibold">
                          {selectedBook.bookId}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs uppercase tracking-wide block">
                          ISBN
                        </span>
                        <span className="font-mono text-xs truncate block">
                          {selectedBook.isbn}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs uppercase tracking-wide block">
                          Category
                        </span>
                        <span className="text-xs truncate block">
                          {selectedBook.category}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs uppercase tracking-wide block">
                          Location
                        </span>
                        <span className="text-xs truncate block">
                          {selectedBook.location}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-muted-foreground text-xs uppercase tracking-wide block">
                          Status
                        </span>
                        <Badge
                          variant={getStatusColor(selectedBook.status)}
                          className="text-xs mt-1"
                        >
                          {selectedBook.status}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs uppercase tracking-wide block">
                          Available
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            selectedBook.availableCopies > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {selectedBook.availableCopies} of{" "}
                          {selectedBook.copies}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expected Return Date */}
                  {selectedBook.status === "borrowed" &&
                    selectedBook.expectedReturnDate && (
                      <div className="flex items-center gap-2 text-xs bg-blue-50 text-blue-700 rounded-lg p-2 flex-shrink-0">
                        <Calendar className="h-3 w-3 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium">Next available</p>
                          <p className="truncate">
                            {formatExpectedDate(
                              selectedBook.expectedReturnDate
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                  {selectedBook.status === "overdue" &&
                    selectedBook.expectedReturnDate && (
                      <div className="flex items-center gap-2 text-xs bg-red-50 text-red-700 rounded-lg p-2 flex-shrink-0">
                        <Calendar className="h-3 w-3 text-red-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium">Expected return</p>
                          <p className="truncate">
                            {formatExpectedDate(
                              selectedBook.expectedReturnDate
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-3 flex-1 min-h-0">
                    <h4 className="font-medium text-xs text-orange-900 mb-2">
                      Description
                    </h4>
                    <div className="overflow-y-auto max-h-20">
                      <p className="text-xs text-orange-800 leading-relaxed">
                        {selectedBook.description}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons - only show for available books */}
                  {selectedBook.status === "available" && (
                    <div className="flex-shrink-0">
                      <Button
                        className="w-full gap-2 h-12 shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation"
                        disabled={selectedBook.availableCopies === 0}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCheckoutReserve("borrow");
                        }}
                        style={{
                          WebkitTapHighlightColor: "transparent",
                          fontSize: "16px",
                        }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {selectedBook.availableCopies > 0
                          ? "Add to Cart"
                          : "Not Available"}
                      </Button>
                    </div>
                  )}

                  {/* For borrowed/overdue books, show return information instead of action buttons */}
                  {(selectedBook.status === "borrowed" ||
                    selectedBook.status === "overdue") && (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 text-center border flex-shrink-0">
                      <div className="p-2 bg-gray-200 rounded-full w-fit mx-auto mb-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                        Currently Unavailable
                      </h4>
                      <p className="text-xs text-gray-600 mb-1">
                        This book is not available for reservation at this time.
                      </p>
                      <p className="text-xs text-gray-500">
                        Please check back after the expected return date above.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
}
