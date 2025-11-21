"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { BookOpen, Calendar, Clock, AlertTriangle, Search, QrCode, History } from 'lucide-react';

export default function StudentDashboardHome() {
  const kpiData = [
    {
      title: 'Books Borrowed',
      value: '3',
      description: 'Currently borrowed',
      icon: BookOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Days Visited',
      value: '12',
      description: 'This month',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Overdue Books',
      value: '1',
      description: 'Need attention',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  const recentBorrowedBooks = [
    { id: '1', title: 'Introduction to Computer Science', author: 'John Smith', dueDate: '2025-08-15', status: 'Borrowed', color: 'text-green-600' },
    { id: '2', title: 'Data Structures and Algorithms', author: 'Jane Doe', dueDate: '2025-08-10', status: 'Overdue', color: 'text-red-600' },
    { id: '3', title: 'Database Management Systems', author: 'Mike Johnson', dueDate: '2025-08-20', status: 'Borrowed', color: 'text-green-600' },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'overdue':
        return 'destructive';
      case 'borrowed':
        return 'default';
      case 'returned':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const router = useRouter();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2">Welcome back, {"PLACEHOLDER"}!</h1>
        <p className="text-muted-foreground">Here's your library overview for today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="border-l-4 border-l-green-500">
              <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${kpi.bgColor}`}>
                <CardTitle className="text-sm">{kpi.title}</CardTitle>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">{kpi.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-t-4 border-t-orange-500">
          <CardHeader>
            <CardTitle>Currently Borrowed Books</CardTitle>
            <CardDescription>Books you need to return</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBorrowedBooks.map((book) => (
                <div key={book.id} className="flex items-center justify-between p-3 bg-linear-to-r from-orange-50 to-amber-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{book.title}</p>
                    <p className="text-xs text-muted-foreground">by {book.author}</p>
                    <p className="text-xs text-muted-foreground">Due: {book.dueDate}</p>
                  </div>
                  <Badge variant={getStatusColor(book.status)}>
                    {book.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-teal-500">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button 
                variant="outline"
                className="h-auto p-4 flex items-center gap-3 bg-orange-50 border-orange-200 hover:bg-orange-100"
                onClick={() => router.push('/student/bookcatalog')}
              >
                <Search className="h-5 w-5 text-orange-600" />
                <div className="text-left flex-1">
                  <h4 className="text-sm text-orange-700">Search Books</h4>
                  <p className="text-xs text-orange-600">Find books in our catalog</p>
                </div>
              </Button>
              <Button 
                variant="outline"
                className="h-auto p-4 flex items-center gap-3 bg-green-50 border-green-200 hover:bg-green-100"
                onClick={() => router.push('/student/qr-ticket')}
              >
                <QrCode className="h-5 w-5 text-green-600" />
                <div className="text-left flex-1">
                  <h4 className="text-sm text-green-700">Generate QR Ticket</h4>
                  <p className="text-xs text-green-600">For borrowing books</p>
                </div>
              </Button>
              <Button 
                variant="outline"
                className="h-auto p-4 flex items-center gap-3 bg-amber-50 border-amber-200 hover:bg-amber-100"
                onClick={() => router.push('/student/history')}
              >
                <History className="h-5 w-5 text-amber-600" />
                <div className="text-left flex-1">
                  <h4 className="text-sm text-amber-700">View History</h4>
                  <p className="text-xs text-amber-600">Check your borrowing history</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}