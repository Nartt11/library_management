import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Activity, Search, Filter, Shield, BookOpen, Users, Server, UserCheck, Clock } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'authentication' | 'book_management' | 'user_management' | 'system' | 'attendance';
  details: string;
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
    },
    {
      id: '2',
      timestamp: '2025-08-01 14:15:32',
      user: 'John Anderson (Admin)',
      action: 'User Created',
      category: 'user_management',
      details: 'Created new student account for Emma Wilson',
    },
    {
      id: '3',
      timestamp: '2025-08-01 13:45:21',
      user: 'Alex Johnson (Student)',
      action: 'Login',
      category: 'authentication',
      details: 'Successful login to student dashboard',
    },
    {
      id: '4',
      timestamp: '2025-08-01 13:30:08',
      user: 'System',
      action: 'Backup Completed',
      category: 'system',
      details: 'Daily database backup completed successfully',
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return <Shield className="h-3 w-3" />;
      case 'book_management': return <BookOpen className="h-3 w-3" />;
      case 'user_management': return <Users className="h-3 w-3" />;
      case 'system': return <Server className="h-3 w-3" />;
      case 'attendance': return <UserCheck className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const stats = {
    total: logs.length,
    authentication: logs.filter(l => l.category === 'authentication').length,
    bookManagement: logs.filter(l => l.category === 'book_management').length,
    userManagement: logs.filter(l => l.category === 'user_management').length,
    system: logs.filter(l => l.category === 'system').length,
    attendance: logs.filter(l => l.category === 'attendance').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2 flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          Global Activity Logs
        </h1>
        <p className="text-muted-foreground">Comprehensive monitoring of all system activities and user actions across the platform.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Logs</p>
                <p className="text-2xl font-medium">{stats.total}</p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Activity className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Authentication</p>
                <p className="text-2xl font-medium text-blue-600">{stats.authentication}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Books</p>
                <p className="text-2xl font-medium text-green-600">{stats.bookManagement}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Users</p>
                <p className="text-2xl font-medium text-purple-600">{stats.userManagement}</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Attendance</p>
                <p className="text-2xl font-medium text-amber-600">{stats.attendance}</p>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg">
                <UserCheck className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System</p>
                <p className="text-2xl font-medium text-red-600">{stats.system}</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <Server className="h-5 w-5 text-red-600" />
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
            Filter & Search Logs
          </CardTitle>
          <CardDescription>Filter activity logs by category or search for specific events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs by user, action, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 shadow-sm"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 shadow-sm">
                <SelectValue placeholder="Filter by Category" />
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

      {/* Enhanced Logs */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Activity Log
          </CardTitle>
          <CardDescription>Showing {filteredLogs.length} of {logs.length} log entries</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No logs found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria to find more log entries.</p>
              </div>
            ) : (
              filteredLogs.map((log) => {
                const timestamp = formatTimestamp(log.timestamp);
                return (
                  <div key={log.id} className="p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="p-2 bg-muted rounded-lg">
                          {getCategoryIcon(log.category)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{log.action}</span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{log.details}</p>
                          </div>
                          
                          <div className="flex-shrink-0 text-right flex flex-col items-end gap-2">
                            <Badge 
                              variant={getCategoryColor(log.category)} 
                              className="flex items-center gap-1 shadow-sm"
                            >
                              {getCategoryIcon(log.category)}
                              {log.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{timestamp.date}</span>
                              <span>{timestamp.time}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="h-3 w-3 text-blue-600" />
                              <span className="text-xs font-medium text-blue-800">User</span>
                            </div>
                            <p className="text-sm font-medium text-blue-900">{log.user}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}