"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  BookOpen,
  ShoppingCart,
  LogIn,
  Sparkles,
  Library,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Footer } from "./Footer";

import { Book } from "@/types/book";
import { addBookToCart } from "@/services/cart";
import { toast } from "sonner";

import { useAuth } from "@/context/authContext";
import { getAllBooks, getAllBooksRecommend, getTopBooks } from "@/services/book";
import RecommendBooks from "./showroom/RecommendBooks";

export function Showroom() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [booksRecommend, setBooksRecommend] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 24;
  const [jumpPage, setJumpPage] = useState("");
  const categories = [
    undefined,
    ...Array.from(
      new Set(books.flatMap((book) => book.bookCategories.map((c) => c.name)))
    ),
  ];

  const { currentUser, setPendingBook } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchBooks() {
      setLoading(true);
      try {
        const data = await getAllBooks(
          currentPage,
          pageSize,
          selectedCategory,
          undefined,
          searchTerm
        );
        if (!mounted) return;
        setBooks(data.data ?? []);
        setTotalPages(data.totalPages ?? 1);
        setTotalCount(data.totalItems ?? 0);

        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err: any) {
        console.error(err);
        if (!mounted) return;
        setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchBooks();
    return () => {
      mounted = false;
    };
  }, [currentPage, selectedCategory, searchTerm]);

  // const filteredBooks = books.filter((book) => {
  //   const authorNames = book.authors
  //     .map((a) => a.name)
  //     .join(" ")
  //     .toLowerCase();
  //   const matchesSearch =
  //     book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     authorNames.includes(searchTerm.toLowerCase()) ||
  //     book.isbn.includes(searchTerm);

  //   const matchesCategory =
  //     selectedCategory === "all" ||
  //     book.bookCategories.some((c) => c.name === selectedCategory);

  //   // Remove status filter since API doesn't provide status
  //   const matchesStatus = statusFilter === "all";

  //   return matchesSearch && matchesCategory && matchesStatus;
  // });

  useEffect(() => {
    let mounted = true;
    async function fetchBooks() {
      setLoading(true);
      try {
        let data;
        if (currentUser) {
          data = await getAllBooksRecommend(1, 10);
        } else {
          // fallback to top-books for anonymous users
          data = await getTopBooks(1, 6);
        }
        if (!mounted) return;
        setBooksRecommend(data.data ?? []);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err: any) {
        console.error(err);
        if (!mounted) return;
        setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchBooks();
    return () => {
      mounted = false;
    };
  }, [currentPage]);
  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsDialogOpen(true);
  };

  const [addingToCart, setAddingToCart] = useState(false);

  const handleCheckoutReserve = async (action: "borrow" | "reserve") => {
    if (!selectedBook) return;

    const pendingBook = {
      id: selectedBook.id,
      title: selectedBook.title,
      author:
        selectedBook.authors.map((a: { name: string }) => a.name).join(", ") ||
        "Unknown",
      isbn: selectedBook.isbn,
      bookId: selectedBook.isbn,
      category: selectedBook.bookCategories[0]?.name || "Uncategorized",
      action,
    };

    setIsDialogOpen(false);

    // Handle non-logged in users
    if (!currentUser) {
      setPendingBook(pendingBook);
      router.push("/login");
      return;
    }

    // Logged-in users: add book to cart
    try {
      setAddingToCart(true);
      const response = await addBookToCart(selectedBook.id);
      // Show API response message if present, otherwise a default
      const message =
        (response as any)?.message || `"${selectedBook.title}" added to cart`;
      toast.success(message);
    } catch (err: any) {
      const msg = err?.message || "Failed to add book to cart";
      toast.error(msg);
      console.error("Add to cart error:", err);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div
      className={`min-h-screen  ${
        currentUser
          ? "bg-white"
          : "bg-linear-to-br from-orange-50 via-amber-50 to-green-50"
      }`}
    >
      <div className="container mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        {!currentUser && (
          <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-orange-600 via-orange-500 to-amber-500 p-8 text-white shadow-2xl">
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
                  Browse our comprehensive collection of academic resources.
                  Find books, check availability, and seamlessly add them to
                  your borrowing cart.
                </p>
              </div>
              <div className="hidden lg:block">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push("/login");
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
                  router.push("/login");
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
        )}

        <RecommendBooks recommendBooks={booksRecommend} />
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
              Find exactly what you're looking for with our advanced search
              tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
                <Input
                  placeholder="Search by title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-2 border-orange-100 focus:border-orange-500 bg-white/70 backdrop-blur-sm rounded-xl transition-all duration-200"
                />
              </div>
              <div className="flex gap-4">
                <Select
                  value={selectedCategory ?? "all"}
                  onValueChange={(v) =>
                    setSelectedCategory(v === "all" ? undefined : v)
                  }
                >
                  <SelectTrigger className="w-full lg:w-48 h-12 border-2 border-orange-100 focus:border-orange-500 bg-white/70 backdrop-blur-sm rounded-xl">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-orange-200">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(
                      (category) =>
                        category && (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        )
                    )}
                  </SelectContent>
                </Select>
                {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                </Select> */}
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
                {totalCount} Books Found
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Books Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {books.map((book) => (
            <Card
              key={book.id}
              className="group cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm overflow-hidden"
              onClick={() => handleBookClick(book)}
            >
              <CardContent className="p-0">
                <div className="aspect-3/4 relative overflow-hidden">
                  <ImageWithFallback
                    src={book.imgUrl}
                    alt="/UITLogo.jpg"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Badge
                    variant="default"
                    className="absolute top-3 right-3 text-xs font-semibold shadow-lg"
                  >
                    {book.publicationYear}
                  </Badge>
                  {book.availableCopiesCount && (
                    <Badge
                      variant="secondary"
                      className="absolute top-3 left-3 text-xs font-semibold shadow-lg"
                    >
                      {book.availableCopiesCount} left
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold line-clamp-2 text-foreground mb-2 group-hover:text-orange-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-1">
                    by {book.authors.map((a) => a.name).join(", ") || "Unknown"}
                  </p>
                  <p className="text-xs text-orange-600 font-medium">
                    {book.bookCategories[0]?.name || "Uncategorized"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {books.length === 0 && (
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1 || loading}
                    className="gap-2"
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1 || loading}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          disabled={loading}
                          className="w-10 h-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Jump to page input */}
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Go to"
                      value={jumpPage}
                      onChange={(e) => setJumpPage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const n = Number(jumpPage);
                          if (!Number.isInteger(n) || n < 1 || n > totalPages) {
                            setJumpPage("");
                            return;
                          }
                          setCurrentPage(n);
                          setJumpPage("");
                        }
                      }}
                      className="w-20 h-10 text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const n = Number(jumpPage);
                        if (!Number.isInteger(n) || n < 1 || n > totalPages) {
                          setJumpPage("");
                          return;
                        }
                        setCurrentPage(n);
                        setJumpPage("");
                      }}
                      disabled={loading}
                      className="h-10"
                    >
                      Go
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages || loading}
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || loading}
                    className="gap-2"
                  >
                    Last
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Call-to-Action */}
        {!currentUser && (
          <Card className="shadow-xl border-0 bg-linear-to-r from-green-500 via-teal-500 to-green-600 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-size-[20px_20px] opacity-50"></div>
            <CardContent className="relative py-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Sparkles className="h-8 w-8" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">Ready to Start Reading?</h3>
                <p className="text-green-100 text-lg max-w-2xl mx-auto">
                  Sign in with your student credentials to add books to your
                  cart and generate QR borrow tickets. Access thousands of
                  academic resources instantly.
                </p>
              </div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push("/login");
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
        )}

        {/* Enhanced Book Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="min-w-[400px] min-h-[550px] border-0 shadow-2xl rounded-2xl bg-white/95 backdrop-blur-sm p-6">
            {selectedBook && (
              <div className="flex flex-col h-full">
                <DialogHeader className="shrink-0 pb-4">
                  <DialogTitle className="text-lg font-bold line-clamp-2 text-foreground leading-tight">
                    {selectedBook.title}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    by{" "}
                    {selectedBook.authors
                      .map((a: { name: string }) => a.name)
                      .join(", ") || "Unknown"}
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 flex flex-col space-y-4">
                  <div className="flex justify-center shrink-0">
                    <div className="w-20 h-28 relative rounded-lg overflow-hidden shadow-md">
                      <ImageWithFallback
                        src={selectedBook.imgUrl}
                        alt="/UITLogo.jpg"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs shrink-0">
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
                          {selectedBook.bookCategories
                            .map((c: { name: string }) => c.name)
                            .join(", ")}
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
                        <Badge variant="secondary" className="text-xs mt-1">
                          {selectedBook.publicationYear}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs uppercase tracking-wide block">
                          available
                        </span>
                        <span className="text-xs truncate block">
                          {" "}
                          {selectedBook.availableCopiesCount} book(S)
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
                        {selectedBook.description}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="shrink-0">
                    <Button
                      className="w-full gap-2 h-12 shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCheckoutReserve("borrow");
                      }}
                      disabled={addingToCart}
                      style={{
                        WebkitTapHighlightColor: "transparent",
                        fontSize: "16px",
                      }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {addingToCart ? "Adding..." : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      {!currentUser && <Footer />}
    </div>
  );
}
