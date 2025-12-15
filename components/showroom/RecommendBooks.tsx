import { Book } from "@/types/book";
import { BookOpen, Flame, ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Badge } from "../ui/badge";
import { useAuth } from "@/context/authContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { addBookToCart } from "@/services/cart";
import { useRouter } from "next/navigation";

export default function RecommendBooks({
  recommendBooks,
}: {
  recommendBooks: Book[];
}) {
  const router = useRouter();
  const [addingToCart, setAddingToCart] = useState(false);
  const { currentUser, setPendingBook } = useAuth();
  const [selectedBook, setSelectedBook] = useState<Book>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsDialogOpen(true);
  };

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
    <>
      {/* Enhanced Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="p-2 bg-linear-to-br from-green-500 to-teal-500 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
          ) : (
            <div className="p-2 bg-linear-to-br from-red-500 to-yellow-500 rounded-lg">
              <Flame className="h-5 w-5 text-white" />
            </div>
          )}

          <div>
            <p className="text-lg font-semibold text-foreground">
              {!currentUser ? "Hot book" : "Recommend Book"}
            </p>
            <p className="text-sm text-muted-foreground">
              Total collection: {recommendBooks.length} books
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Books Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {recommendBooks.map((book) => (
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

      {recommendBooks.length === 0 && (
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
    </>
  );
}
