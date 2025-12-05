import { Book } from "@/types/book";
import { BookOpen, Flame } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Badge } from "../ui/badge";
import { useAuth } from "@/context/authContext";

export default function RecommendBooks({
  recommendBooks,
}: {
  recommendBooks: Book[];
}) {
  const { currentUser } = useAuth();
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
            //onClick={() => handleBookClick(book)}
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
    </>
  );
}
