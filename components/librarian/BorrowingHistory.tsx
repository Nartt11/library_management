import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { History, Search, Filter, Download, BookOpen, Calendar, User, Clock } from 'lucide-react';
import { Button } from '../ui/button';

interface BorrowRecord {
  id: string;
  bookTitle: string;
  studentName: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'borrowed' | 'returned' | 'overdue';
  staffInCharge: string;
}

export function BorrowingHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const borrowingRecords: BorrowRecord[] = [
    {
      id: '1',
      bookTitle: 'Introduction to Computer Science',
      studentName: 'Alex Johnson',
      borrowDate: '2025-07-28',
      dueDate: '2025-08-11',
      returnDate: '2025-08-01',
      status: 'returned',
      staffInCharge: 'Sarah Chen',
    },
    {
      id: '2',
      bookTitle: 'Data Structures and Algorithms',
      studentName: 'Maria Garcia',
      borrowDate: '2025-07-25',
      dueDate: '2025-08-08',
      returnDate: null,
      status: 'overdue',
      staffInCharge: 'Sarah Chen',
    },
    {
      id: '3',
      bookTitle: 'Modern Physics',
      studentName: 'David Wilson',
      borrowDate: '2025-07-30',
      dueDate: '2025-08-13',
      returnDate: null,
      status: 'borrowed',
      staffInCharge: 'Mike Wilson',
    },
  ];

  const filteredRecords = borrowingRecords.filter(record => {
    const matchesSearch = record.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'borrowed': return 'default';
      case 'returned': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'borrowed': return <BookOpen className="h-3 w-3" />;
      case 'returned': return <Calendar className="h-3 w-3" />;
      case 'overdue': return <Clock className="h-3 w-3" />;
      default: return null;
    }
  };

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const stats = {
    total: borrowingRecords.length,
    borrowed: borrowingRecords.filter(r => r.status === 'borrowed').length,
    returned: borrowingRecords.filter(r => r.status === 'returned').length,
    overdue: borrowingRecords.filter(r => r.status === 'overdue').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2 flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            Borrowing History
          </h1>
          <p className="text-muted-foreground">Complete log of all book borrowing transactions with detailed tracking.</p>
        </div>
        <Button variant="outline" className="gap-2 shadow-sm">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-2xl font-medium">{stats.total}</p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <History className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Currently Borrowed</p>
                <p className="text-2xl font-medium text-green-600">{stats.borrowed}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Returned</p>
                <p className="text-2xl font-medium text-blue-600">{stats.returned}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-medium text-red-600">{stats.overdue}</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filter & Search
          </CardTitle>
          <CardDescription>Refine your search to find specific borrowing records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by book title or student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 shadow-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 shadow-sm">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="borrowed">Currently Borrowed</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Records */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Transaction History
          </CardTitle>
          <CardDescription>Showing {filteredRecords.length} of {borrowingRecords.length} records</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredRecords.length === 0 ? (
              <div className="p-8 text-center">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No records found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria to find more results.</p>
              </div>
            ) : (
              filteredRecords.map((record) => (
                <div key={record.id} className="p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
                            <h4 className="font-medium line-clamp-1">{record.bookTitle}</h4>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{record.studentName}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <Badge 
                            variant={getStatusColor(record.status)} 
                            className="flex items-center gap-1 shadow-sm"
                          >
                            {getStatusIcon(record.status)}
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            {record.status === 'overdue' && (
                              <span className="ml-1 text-xs">
                                (+{getDaysOverdue(record.dueDate)}d)
                              </span>
                            )}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-3 w-3 text-orange-600" />
                            <span className="text-xs font-medium text-orange-800">Borrowed</span>
                          </div>
                          <p className="text-sm font-medium text-orange-900">
                            {new Date(record.borrowDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-3 w-3 text-blue-600" />
                            <span className="text-xs font-medium text-blue-800">Due Date</span>
                          </div>
                          <p className="text-sm font-medium text-blue-900">
                            {new Date(record.dueDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-3 w-3 text-green-600" />
                            <span className="text-xs font-medium text-green-800">Returned</span>
                          </div>
                          <p className="text-sm font-medium text-green-900">
                            {record.returnDate ? 
                              new Date(record.returnDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              }) : 
                              'Not returned'
                            }
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-3 w-3 text-purple-600" />
                            <span className="text-xs font-medium text-purple-800">Staff</span>
                          </div>
                          <p className="text-sm font-medium text-purple-900">{record.staffInCharge}</p>
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