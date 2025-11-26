"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Search, ShoppingCart, Filter, Calendar, BookOpen, Loader2, AlertCircle } from "lucide-react";
import { ImageWithFallback } from "../../../../components/figma/ImageWithFallback";
import { toast } from "sonner";
import { getCategories } from "@/services/book-category";
import { Book } from "@/types/book";
import { useDebounce } from "@/lib/hooks/useDebounce";

// TODO: Replace with actual cart management system (Redux/Zustand/Context API)
// Current implementation uses local state with mock data for demonstration

export default function BookCatalog() {
  // TODO: Remove mock cart state and integrate with global cart management
  const [cartItems, setCartItems] = useState<string[]>([]); // Mock cart state
  const [allBooks, setAllBooks] = useState<Book[]>([]); // Store all fetched books
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fetch categories from API (no pagination needed)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const categoryNames = response.map((cat: any) => cat.name) || [];
        setCategories(["all", ...categoryNames]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories(["all"]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch books from API using same approach as Showroom
  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/books?pageNumber=${pageNumber}&pageSize=${pageSize}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.status}`);
      }
      const data = await response.json();
      
      setAllBooks(data.data ?? []);
      setTotalPages(data.totalPages ?? 1);
      setTotalCount(data.totalCount ?? 0);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch books";
      setError(message);
      toast.error(message);
      setAllBooks([]);
    } finally {
      setIsLoading(false);
    }
  }, [pageNumber, pageSize]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Client-side filtering (search, category, status)
  const filteredBooks = allBooks.filter((book) => {
    // Search filter
    const matchesSearch = debouncedSearch === "" || 
      book.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      book.isbn.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      book.authors?.some(author => 
        author.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      ) ||
      book.publisher?.toLowerCase().includes(debouncedSearch.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategory === "all" || 
      book.bookCategories?.some(cat => cat.name === selectedCategory);

    // Status filter - removed since Book type doesn't have status field
    // TODO: Add status filtering when backend provides book availability status

    return matchesSearch && matchesCategory;
  });

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsDialogOpen(true);
  };

  const handleAddToCart = (bookId: string, bookTitle: string) => {
    // TODO: Replace with actual cart API call/state management
    // Example: dispatch(addToCart(bookId)) or mutate cart in backend
    
    if (cartItems.includes(bookId)) {
      toast.error("Book is already in your cart");
      return;
    }

    // Mock cart update - replace with real implementation
    const newCartItems = [...cartItems, bookId];
    setCartItems(newCartItems); // TODO: Replace with global cart state update
    
    toast.success(`"${bookTitle}" added to cart`);
    setIsDialogOpen(false);
  };

  const getStatusColor = (status?: string) => {
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
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-green-50 p-6">
      <div className="container mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-orange-600 via-orange-500 to-amber-500 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
          <div className="relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookOpen className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Book Catalog
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <Search className="h-4 w-4" />
                  <p className="text-orange-100">
                    Search and browse available books in our library
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-linear-to-br from-orange-500 to-amber-500 rounded-lg text-white">
                <Search className="h-5 w-5" />
              </div>
              Search & Discover
            </CardTitle>
            <CardDescription className="text-base">
              Find exactly what you're looking for with our advanced search tools
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
            <div className="p-2 bg-linear-to-br from-green-500 to-teal-500 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {filteredBooks.length} Books Found
              </p>
              <p className="text-sm text-muted-foreground">
                Total collection: {totalCount} books
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm border-green-200 bg-green-50 text-green-700"
            >
              Results: {filteredBooks.length}
            </Badge>
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm border-amber-200 bg-amber-50 text-amber-700 gap-2"
            >
              <ShoppingCart className="h-3 w-3" />
              {cartItems.length} in cart
            </Badge>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="shadow-lg border-0 bg-red-50">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">{error}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchBooks}
                className="border-red-200 hover:bg-red-100"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading ? (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
                <p className="text-lg font-semibold text-foreground">
                  Loading books...
                </p>
                <p className="text-muted-foreground">
                  Please wait while we fetch the catalog
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Enhanced Books Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {filteredBooks.map((book) => (
                <Card
                  key={book.id}
                  className="group cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm overflow-hidden"
                  onClick={() => handleBookClick(book)}
                >
                  <CardContent className="p-0">
                    <div className="aspect-3/4 relative overflow-hidden">
                      <ImageWithFallback
                        src={book.imgUrl || ""}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Badge
                        variant="default"
                        className="absolute top-3 right-3 text-xs font-semibold shadow-lg"
                      >
                        {book.publicationYear}
                      </Badge>
                      {/* Available Status Badge - TODO: Replace with actual availability from API */}
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                        Available
                      </div>
                      {cartItems.includes(book.id) && (
                        <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                          In Cart
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold line-clamp-2 text-foreground mb-2 group-hover:text-orange-600 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-1">
                        by {book.authors?.map(a => a.name).join(", ") || "Unknown"}
                      </p>
                      <p className="text-xs text-orange-600 font-medium">
                        {book.bookCategories?.[0]?.name || "Uncategorized"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredBooks.length === 0 && !isLoading && (
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

            {/* Pagination */}
            {!isLoading && filteredBooks.length > 0 && totalPages > 1 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing page {pageNumber} of {totalPages} ({totalCount} total books)
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                        disabled={pageNumber === 1 || isLoading}
                      >
                        Previous
                      </Button>
                      <span className="px-3 py-2 text-sm">
                        Page {pageNumber} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))}
                        disabled={pageNumber === totalPages || isLoading}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

      {/* Book Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[400px] h-[550px] border-0 shadow-2xl rounded-2xl bg-white/95 backdrop-blur-sm p-6">
          {selectedBook && (
            <div className="flex flex-col h-full">
              <DialogHeader className="flex-shrink-0 pb-4">
                <DialogTitle className="text-lg font-bold line-clamp-2 text-foreground leading-tight">
                  {selectedBook.title}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  by {selectedBook.authors?.map(a => a.name).join(", ") || "Unknown"}
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 flex flex-col space-y-4">
                  <div className="flex justify-center flex-shrink-0">
                  <div className="w-20 h-28 relative rounded-lg overflow-hidden shadow-md">
                    <ImageWithFallback
                      src={selectedBook.imgUrl || ""}
                      alt={selectedBook.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>                <div className="grid grid-cols-2 gap-3 text-xs flex-shrink-0">
                    <div className="space-y-2">
                      <div>
                        <span className="text-muted-foreground text-xs uppercase tracking-wide block">
                          ISBN
                        </span>
                        <span className="font-mono text-xs truncate block text-orange-600 font-semibold">
                          {selectedBook.isbn}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs uppercase tracking-wide block">
                          Categories
                        </span>
                        <span className="text-xs block">
                          {selectedBook.bookCategories?.map((c: any) => c.name).join(", ") || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs uppercase tracking-wide block">
                          Publisher
                        </span>
                        <span className="text-xs truncate block">
                          {selectedBook.publisher || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-muted-foreground text-xs uppercase tracking-wide block">
                          Year
                        </span>
                        <Badge
                          variant="default"
                          className="text-xs mt-1"
                        >
                          {selectedBook.publicationYear}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs uppercase tracking-wide block">
                          Authors
                        </span>
                        <span className="text-xs">
                          {selectedBook.authors?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-linear-to-r from-orange-50 to-amber-50 rounded-lg p-3 flex-1 min-h-0">
                    <h4 className="font-medium text-xs text-orange-900 mb-2">
                      Description
                    </h4>
                    <div className="overflow-y-auto max-h-20">
                      <p className="text-xs text-orange-800 leading-relaxed">
                        {selectedBook.description || "No description available."}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="shrink-0">
                    <Button
                      className="w-full gap-2 h-12 shadow-lg hover:shadow-xl transition-all duration-200"
                      disabled={cartItems.includes(selectedBook.id)}
                      onClick={() =>
                        handleAddToCart(selectedBook.id, selectedBook.title)
                      }
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {cartItems.includes(selectedBook.id)
                        ? "Already in Cart"
                        : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
