import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
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
} from "../ui/dialog";
import {
  AlertTriangle,
  Search,
  Mail,
  Calendar,
  Clock,
  User,
  BookOpen,
  Filter,
  Send,
} from "lucide-react";
import { toast } from "sonner";

interface OverdueBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  student: string;
  studentId: string;
  studentEmail: string;
  dueDate: string;
  daysOverdue: number;
  borrowDate: string;
  category: string;
  remindersSent: number;
  lastReminder: string;
  status: "overdue" | "critical" | "lost";
}

export function OverdueAlerts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBook, setSelectedBook] = useState<OverdueBook | null>(null);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [reminderMessage, setReminderMessage] = useState("");

  const [overdueBooks, setOverdueBooks] = useState<OverdueBook[]>([
    {
      id: "1",
      title: "Data Structures and Algorithms",
      author: "John Smith",
      isbn: "978-0-123456-78-9",
      student: "Alex Johnson",
      studentId: "ST001",
      studentEmail: "alex.johnson@student.university.edu",
      dueDate: "2025-07-30",
      daysOverdue: 2,
      borrowDate: "2025-07-16",
      category: "Computer Science",
      remindersSent: 1,
      lastReminder: "2025-08-01",
      status: "overdue",
    },
    {
      id: "2",
      title: "Advanced Chemistry",
      author: "Dr. Sarah Wilson",
      isbn: "978-0-987654-32-1",
      student: "Maria Garcia",
      studentId: "ST002",
      studentEmail: "maria.garcia@student.university.edu",
      dueDate: "2025-07-28",
      daysOverdue: 4,
      borrowDate: "2025-07-14",
      category: "Chemistry",
      remindersSent: 2,
      lastReminder: "2025-07-31",
      status: "overdue",
    },
    {
      id: "3",
      title: "World Literature",
      author: "Robert Brown",
      isbn: "978-0-456789-01-2",
      student: "David Wilson",
      studentId: "ST003",
      studentEmail: "david.wilson@student.university.edu",
      dueDate: "2025-07-25",
      daysOverdue: 7,
      borrowDate: "2025-07-11",
      category: "Literature",
      remindersSent: 3,
      lastReminder: "2025-07-30",
      status: "critical",
    },
    {
      id: "4",
      title: "Modern Art History",
      author: "Lisa Davis",
      isbn: "978-0-654321-98-7",
      student: "Emma Thompson",
      studentId: "ST004",
      studentEmail: "emma.thompson@student.university.edu",
      dueDate: "2025-07-20",
      daysOverdue: 12,
      borrowDate: "2025-07-06",
      category: "Art History",
      remindersSent: 4,
      lastReminder: "2025-07-28",
      status: "critical",
    },
    {
      id: "5",
      title: "Organic Chemistry Handbook",
      author: "Dr. Michael Chen",
      isbn: "978-0-111222-33-4",
      student: "James Rodriguez",
      studentId: "ST005",
      studentEmail: "james.rodriguez@student.university.edu",
      dueDate: "2025-07-15",
      daysOverdue: 17,
      borrowDate: "2025-07-01",
      category: "Chemistry",
      remindersSent: 5,
      lastReminder: "2025-07-25",
      status: "lost",
    },
  ]);

  const filteredBooks = overdueBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || book.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "destructive";
      case "critical":
        return "destructive";
      case "lost":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getSeverityColor = (daysOverdue: number) => {
    if (daysOverdue > 14) return "text-red-900 bg-red-100 border-red-300";
    if (daysOverdue > 7) return "text-red-800 bg-red-50 border-red-200";
    return "text-orange-800 bg-orange-50 border-orange-200";
  };

  const sendReminder = (book: OverdueBook) => {
    const defaultMessage = `Dear ${book.student},\n\nThis is a reminder that the following book is overdue:\n\nTitle: ${book.title}\nDue Date: ${book.dueDate}\nDays Overdue: ${book.daysOverdue}\n\nPlease return this book as soon as possible.\n\nThank you,\nLibrary Administration`;

    setSelectedBook(book);
    setReminderMessage(defaultMessage);
    setIsReminderDialogOpen(true);
  };

  const sendReminderMessage = () => {
    if (!selectedBook || !reminderMessage.trim()) {
      toast.error("Please enter a reminder message");
      return;
    }

    // Simulate sending reminder
    toast.success(`Email reminder sent to ${selectedBook.student}`);
    setIsReminderDialogOpen(false);
    setSelectedBook(null);
    setReminderMessage("");
  };

  const sendBulkReminders = () => {
    const count = filteredBooks.filter((book) => book.daysOverdue >= 3).length;
    toast.success(`${count} email notifications sent successfully!`);
  };

  const generateReport = () => {
    toast.success("Overdue books report generated and downloaded!");
  };

  const criticalCount = filteredBooks.filter(
    (book) => book.daysOverdue > 7
  ).length;
  const avgOverdueDays =
    Math.round(
      filteredBooks.reduce((sum, book) => sum + book.daysOverdue, 0) /
        filteredBooks.length
    ) || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            Overdue Alerts Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage overdue books and student notifications.
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={generateReport} variant="outline" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Generate Report
          </Button>
          <Button onClick={sendBulkReminders} className="gap-2">
            <Send className="h-4 w-4" />
            Send Bulk Reminders
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
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
                    Total Overdue
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-red-600">
                    {filteredBooks.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    books requiring attention
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
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Critical Cases
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-orange-600">
                    {criticalCount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    7+ days overdue
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Average Overdue
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-blue-600">
                    {avgOverdueDays}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    days on average
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Filter className="h-5 w-5 text-blue-600" />
            </div>
            Search & Filter Options
          </CardTitle>
          <CardDescription>
            Find and filter overdue books by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by book title, student name, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 border-2 focus:border-primary transition-colors"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-56 h-11 border-2 focus:border-primary transition-colors">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="overdue">Recently Overdue</SelectItem>
                <SelectItem value="critical">Critical (7+ days)</SelectItem>
                <SelectItem value="lost">Potentially Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Overdue Books Table */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-red-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-red-600" />
            </div>
            Overdue Books ({filteredBooks.length})
          </CardTitle>
          <CardDescription>
            Comprehensive overview of all overdue items requiring immediate
            attention
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 border-b-2 border-border">
                <tr className="text-left">
                  <th className="p-4 text-sm font-medium text-foreground">
                    Book Information
                  </th>
                  <th className="p-4 text-sm font-medium text-foreground text-center">
                    Student Details
                  </th>
                  <th className="p-4 text-sm font-medium text-foreground text-center">
                    Overdue Information
                  </th>
                  <th className="p-4 text-sm font-medium text-foreground text-center">
                    Status
                  </th>
                  <th className="p-4 text-sm font-medium text-foreground text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr
                    key={book.id}
                    className="border-b hover:bg-muted/30 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                          {book.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          by {book.author}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          ISBN: {book.isbn}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {book.category}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-center space-y-1">
                        <div className="flex items-center justify-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm font-medium">{book.student}</p>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono">
                          ID: {book.studentId}
                        </p>
                        <p className="text-xs text-blue-600 truncate">
                          {book.studentEmail}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-center space-y-1">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Due:{" "}
                            <span className="font-medium">
                              {new Date(book.dueDate).toLocaleDateString()}
                            </span>
                          </p>
                          <div className="flex items-center justify-center gap-1">
                            <Clock className="h-3 w-3 text-red-500" />
                            <p className="text-sm font-bold text-red-600">
                              {book.daysOverdue} days overdue
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Borrowed:{" "}
                            {new Date(book.borrowDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="pt-1">
                          <p className="text-xs text-muted-foreground">
                            {book.remindersSent} reminders sent
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <Badge
                          variant={getStatusColor(book.status)}
                          className="px-3 py-1 text-xs font-medium"
                        >
                          {book.status.toUpperCase()}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendReminder(book)}
                          className="gap-2 text-xs hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        >
                          <Mail className="h-3 w-3" />
                          Send Reminder
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Send Reminder Dialog */}
      <Dialog
        open={isReminderDialogOpen}
        onOpenChange={setIsReminderDialogOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Email Reminder</DialogTitle>
            <DialogDescription>
              Send an email reminder to {selectedBook?.student} about the
              overdue book
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedBook && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Book:</strong> {selectedBook.title}
                </p>
                <p className="text-sm">
                  <strong>Student:</strong> {selectedBook.student}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {selectedBook.studentEmail}
                </p>
                <p className="text-sm">
                  <strong>Days Overdue:</strong> {selectedBook.daysOverdue}
                </p>
              </div>
            )}
            <div>
              <Label htmlFor="reminder-message">Message</Label>
              <Textarea
                id="reminder-message"
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                rows={8}
                placeholder="Enter reminder message..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={sendReminderMessage} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button
                onClick={() => setIsReminderDialogOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {filteredBooks.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-green-800">
                  No Overdue Books Found
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all"
                    ? "No books match your search criteria. Try adjusting your filters."
                    : "Excellent! All books are returned on time or no books are currently overdue."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
