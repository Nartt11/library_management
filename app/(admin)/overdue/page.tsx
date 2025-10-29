"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { AlertTriangle, Mail, Calendar } from "lucide-react";
import { toast } from "sonner";

interface OverdueBook {
  id: string;
  title: string;
  author: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  borrowDate: string;
  dueDate: string;
  daysOverdue: number;
}

export default function OverdueAlerts() {
  const [overdueBooks] = useState<OverdueBook[]>([
    {
      id: "1",
      title: "Data Structures and Algorithms",
      author: "Jane Doe",
      studentName: "Alex Johnson",
      studentId: "ST001",
      studentEmail: "alex.johnson@student.university.edu",
      borrowDate: "2025-07-15",
      dueDate: "2025-07-29",
      daysOverdue: 3,
    },
    {
      id: "2",
      title: "Advanced Chemistry",
      author: "Maria Garcia",
      studentName: "David Wilson",
      studentId: "ST002",
      studentEmail: "david.wilson@student.university.edu",
      borrowDate: "2025-07-10",
      dueDate: "2025-07-24",
      daysOverdue: 8,
    },
    {
      id: "3",
      title: "World Literature",
      author: "Sarah Brown",
      studentName: "Emma Davis",
      studentId: "ST003",
      studentEmail: "emma.davis@student.university.edu",
      borrowDate: "2025-07-05",
      dueDate: "2025-07-19",
      daysOverdue: 13,
    },
    {
      id: "4",
      title: "Linear Algebra",
      author: "Robert Smith",
      studentName: "Michael Brown",
      studentId: "ST004",
      studentEmail: "michael.brown@student.university.edu",
      borrowDate: "2025-07-20",
      dueDate: "2025-08-03",
      daysOverdue: -2, // Due in 2 days (upcoming due)
    },
    {
      id: "5",
      title: "Modern Physics",
      author: "Lisa Johnson",
      studentName: "Sophie Wilson",
      studentId: "ST005",
      studentEmail: "sophie.wilson@student.university.edu",
      borrowDate: "2025-07-22",
      dueDate: "2025-08-05",
      daysOverdue: -4, // Due in 4 days (upcoming due)
    },
  ]);

  const overdueBooksOnly = overdueBooks.filter((book) => book.daysOverdue > 0);
  const upcomingDue = overdueBooks.filter(
    (book) => book.daysOverdue <= 0 && book.daysOverdue >= -7
  );

  const getSeverityColor = (daysOverdue: number) => {
    if (daysOverdue <= 0) return "outline"; // Upcoming due
    if (daysOverdue <= 3) return "secondary"; // 1-3 days overdue
    if (daysOverdue <= 7) return "default"; // 4-7 days overdue
    return "destructive"; // 8+ days overdue
  };

  const getSeverityLabel = (daysOverdue: number) => {
    if (daysOverdue <= 0) return `Due in ${Math.abs(daysOverdue)} days`;
    if (daysOverdue <= 3) return `${daysOverdue} days overdue`;
    if (daysOverdue <= 7) return `${daysOverdue} days overdue`;
    return `${daysOverdue} days overdue - URGENT`;
  };

  const sendReminder = (book: OverdueBook) => {
    toast.success(`Email reminder sent to ${book.studentName}`);
  };

  const markAsReturned = (bookId: string, bookTitle: string) => {
    toast.success(`"${bookTitle}" marked as returned`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2 flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          Overdue Alerts
        </h1>
        <p className="text-muted-foreground">
          Monitor and manage overdue books and upcoming due dates.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Overdue Books
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-red-600">
                    {overdueBooksOnly.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    require immediate action
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Due Soon
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-orange-600">
                    {upcomingDue.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    within next 7 days
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Reminders Sent
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-green-600">12</p>
                  <p className="text-sm text-muted-foreground">this week</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Books */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            Critical Overdue Books ({overdueBooksOnly.length})
          </CardTitle>
          <CardDescription>
            Books that are past their due date and require immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-5">
            {overdueBooksOnly.map((book) => (
              <div
                key={book.id}
                className="border-2 rounded-xl p-6 bg-gradient-to-r from-red-50 to-orange-50 border-red-200 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h4 className="text-lg font-semibold text-gray-900 line-clamp-1">
                          {book.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          by {book.author}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant={getSeverityColor(book.daysOverdue)}
                          className="px-3 py-1 text-sm font-medium"
                        >
                          {getSeverityLabel(book.daysOverdue)}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-center space-y-2">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Student Info
                          </span>
                          <div>
                            <p className="font-medium text-sm">
                              {book.studentName}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              ID: {book.studentId}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-center space-y-2">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Contact
                          </span>
                          <div>
                            <p className="text-xs text-blue-600 break-all">
                              {book.studentEmail}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-center space-y-2">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Timeline
                          </span>
                          <div className="space-y-1">
                            <p className="text-xs">
                              Borrowed:{" "}
                              <span className="font-medium">
                                {new Date(book.borrowDate).toLocaleDateString()}
                              </span>
                            </p>
                            <p className="text-xs">
                              Due:{" "}
                              <span className="font-medium text-red-600">
                                {new Date(book.dueDate).toLocaleDateString()}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:w-48">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 h-10 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                      onClick={() => sendReminder(book)}
                    >
                      <Mail className="h-4 w-4" />
                      Send Reminder
                    </Button>
                    <Button
                      size="sm"
                      className="gap-2 h-10 bg-green-600 hover:bg-green-700 transition-colors"
                      onClick={() => markAsReturned(book.id, book.title)}
                    >
                      Mark as Returned
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {overdueBooksOnly.length === 0 && (
            <div className="text-center py-12">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                  <AlertTriangle className="h-10 w-10 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-green-800">
                    No Overdue Books!
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Excellent work! All books are returned on time and no
                    immediate action is required.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Due Dates */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            Upcoming Due Dates ({upcomingDue.length})
          </CardTitle>
          <CardDescription>
            Books approaching their due date within the next 7 days
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {upcomingDue.map((book) => (
              <div
                key={book.id}
                className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-4 hover:border-orange-300 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm line-clamp-1 text-gray-900">
                        {book.title}
                      </h4>
                      <Badge
                        variant={getSeverityColor(book.daysOverdue)}
                        className="px-3 py-1 text-xs font-medium"
                      >
                        {getSeverityLabel(book.daysOverdue)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium">{book.studentName}</span>
                      <span>
                        Due:{" "}
                        <span className="font-medium text-orange-700">
                          {new Date(book.dueDate).toLocaleDateString()}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {upcomingDue.length === 0 && (
            <div className="text-center py-12">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                  <Calendar className="h-10 w-10 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-blue-800">
                    No Upcoming Due Dates
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Great! No books are due in the next 7 days. Students are
                    managing their borrowing well.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
