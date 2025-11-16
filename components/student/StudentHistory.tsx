import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  BookOpen,
  Calendar,
  UserRound,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import type { User } from "../../types/user";

interface StudentHistoryProps {
  user: User;
}

export function StudentHistory({ user }: StudentHistoryProps) {
  const borrowingHistory = [
    {
      id: "1",
      bookTitle: "Introduction to Computer Science",
      author: "John Smith",
      borrowDate: "2025-07-28",
      dueDate: "2025-08-11",
      returnDate: "2025-08-01",
      status: "Returned",
      staffInCharge: "Sarah Chen",
    },
    {
      id: "2",
      bookTitle: "Data Structures and Algorithms",
      author: "Jane Doe",
      borrowDate: "2025-07-25",
      dueDate: "2025-08-08",
      returnDate: null,
      status: "Overdue",
      staffInCharge: "Sarah Chen",
    },
    {
      id: "3",
      bookTitle: "Modern Physics",
      author: "Robert Johnson",
      borrowDate: "2025-07-30",
      dueDate: "2025-08-13",
      returnDate: null,
      status: "Borrowed",
      staffInCharge: "Mike Wilson",
    },
    {
      id: "4",
      bookTitle: "Linear Algebra",
      author: "David Wilson",
      borrowDate: "2025-07-20",
      dueDate: "2025-08-03",
      returnDate: "2025-08-02",
      status: "Returned",
      staffInCharge: "Sarah Chen",
    },
    {
      id: "5",
      bookTitle: "World History",
      author: "Sarah Brown",
      borrowDate: "2025-07-15",
      dueDate: "2025-07-29",
      returnDate: "2025-07-28",
      status: "Returned",
      staffInCharge: "Emily Davis",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "borrowed":
        return "default";
      case "returned":
        return "secondary";
      case "overdue":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "borrowed":
        return <BookOpen className="h-3 w-3" />;
      case "returned":
        return <CheckCircle className="h-3 w-3" />;
      case "overdue":
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getDaysOverdue = (dueDate: string, returnDate: string | null) => {
    if (returnDate) return 0;
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const stats = {
    totalBorrowed: borrowingHistory.length,
    currentlyBorrowed: borrowingHistory.filter(
      (h) => h.status === "Borrowed" || h.status === "Overdue"
    ).length,
    overdue: borrowingHistory.filter((h) => h.status === "Overdue").length,
    totalReturned: borrowingHistory.filter((h) => h.status === "Returned")
      .length,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          My Borrowing History
        </h1>
        <p className="text-muted-foreground">
          Complete record of your library borrowing activity with detailed
          information.
        </p>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Borrowed</p>
                <p className="text-2xl font-medium">{stats.totalBorrowed}</p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Currently Borrowed
                </p>
                <p className="text-2xl font-medium text-green-600">
                  {stats.currentlyBorrowed}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Active books
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-medium text-red-600">
                  {stats.overdue}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Need attention
                </p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Returned</p>
                <p className="text-2xl font-medium text-blue-600">
                  {stats.totalReturned}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Completed</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced History Records */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Borrowing Records
          </CardTitle>
          <CardDescription>
            Complete history of your book borrowings with detailed information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {borrowingHistory.length === 0 ? (
              <div className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No borrowing history
                </h3>
                <p className="text-muted-foreground">
                  You haven't borrowed any books yet. Visit the catalog to get
                  started!
                </p>
              </div>
            ) : (
              borrowingHistory.map((record) => (
                <div
                  key={record.id}
                  className="p-6 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
                            <h4 className="font-medium line-clamp-1">
                              {record.bookTitle}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <UserRound className="h-3 w-3" />
                            <span>by {record.author}</span>
                          </div>
                          {/* {record.fineAmount > 0 && (
                            <div className="flex items-center gap-2 text-sm text-amber-600">
                              <DollarSign className="h-3 w-3" />
                              <span className="font-medium">
                                Fine: ${record.fineAmount.toFixed(2)}
                              </span>
                            </div>
                          )} */}
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <Badge
                            variant={getStatusColor(record.status)}
                            className="flex items-center gap-1 shadow-sm"
                          >
                            {getStatusIcon(record.status)}
                            {record.status}
                            {record.status === "Overdue" && (
                              <span className="ml-1 text-xs">
                                (+
                                {getDaysOverdue(
                                  record.dueDate,
                                  record.returnDate
                                )}
                                d)
                              </span>
                            )}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-3 w-3 text-orange-600" />
                            <span className="text-xs font-medium text-orange-800">
                              Borrowed
                            </span>
                          </div>
                          <p className="text-sm font-medium text-orange-900">
                            {new Date(record.borrowDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-3 w-3 text-blue-600" />
                            <span className="text-xs font-medium text-blue-800">
                              Due Date
                            </span>
                          </div>
                          <p className="text-sm font-medium text-blue-900">
                            {new Date(record.dueDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-xs font-medium text-green-800">
                              Returned
                            </span>
                          </div>
                          <p className="text-sm font-medium text-green-900">
                            {record.returnDate
                              ? new Date(record.returnDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )
                              : "Not returned"}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <UserRound className="h-3 w-3 text-purple-600" />
                            <span className="text-xs font-medium text-purple-800">
                              Staff
                            </span>
                          </div>
                          <p className="text-sm font-medium text-purple-900">
                            {record.staffInCharge}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
