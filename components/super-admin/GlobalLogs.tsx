import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Activity, Search, Filter, Download } from 'lucide-react';
import { Button } from '../ui/button';

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'authentication' | 'book_management' | 'user_management' | 'system' | 'attendance';
  details: string;
  ip: string;
}

export function GlobalLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const logs: LogEntry[] = [
    {
      id: '1',
      timestamp: '2025-08-01 14:30:15',
      user: 'Sarah Chen (Librarian)',
      action: 'Book Borrowed',
      category: 'book_management',
      details: 'Student Alex Johnson borrowed "Introduction to Computer Science"',
      ip: '192.168.1.45',
    },
    {
      id: '2',
      timestamp: '2025-08-01 14:15:32',
      user: 'John Anderson (Admin)',
      action: 'User Created',
      category: 'user_management',
      details: 'Created new student account for Emma Wilson',
      ip: '192.168.1.23',
    },
    {
      id: '3',
      timestamp: '2025-08-01 13:45:21',
      user: 'Alex Johnson (Student)',
      action: 'Login',
      category: 'authentication',
      details: 'Successful login to student dashboard',
      ip: '192.168.1.67',
    },
    {
      id: '4',
      timestamp: '2025-08-01 13:30:08',
      user: 'System',
      action: 'Backup Completed',
      category: 'system',
      details: 'Daily database backup completed successfully',
      ip: 'localhost',
    },
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'authentication': return 'default';
      case 'book_management': return 'secondary';
      case 'user_management': return 'outline';
      case 'system': return 'destructive';
      case 'attendance': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2 flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Global Activity Logs
          </h1>
          <p className="text-muted-foreground">Monitor all system activities and user actions.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs by user, action, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="authentication">Authentication</SelectItem>
                <SelectItem value="book_management">Book Management</SelectItem>
                <SelectItem value="user_management">User Management</SelectItem>
                <SelectItem value="attendance">Attendance</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Showing {filteredLogs.length} entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getCategoryColor(log.category)}>
                        {log.category.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm">{log.action}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>User: {log.user}</span>
                      <span>IP: {log.ip}</span>
                      <span>Time: {log.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}