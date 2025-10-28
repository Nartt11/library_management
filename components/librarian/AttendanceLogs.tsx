// DELETE
// import React, { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
// import { Input } from '../ui/input';
// import { Button } from '../ui/button';
// import { Badge } from '../ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
// import { Calendar, User, Filter, Download } from 'lucide-react';

// interface AttendanceRecord {
//   id: string;
//   studentName: string;
//   studentId: string;
//   checkInTime: string;
//   date: string;
// }

// export function AttendanceLogs() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedDate, setSelectedDate] = useState('today');
//   const [activeTab, setActiveTab] = useState('week');

//   const attendanceRecords: AttendanceRecord[] = [
//     {
//       id: '1',
//       studentName: 'Alex Johnson',
//       studentId: 'ST001',
//       checkInTime: '09:15',
//       date: '2025-08-01',
//     },
//     {
//       id: '2',
//       studentName: 'Maria Garcia',
//       studentId: 'ST002',
//       checkInTime: '10:30',
//       date: '2025-08-01',
//     },
//     {
//       id: '3',
//       studentName: 'David Wilson',
//       studentId: 'ST003',
//       checkInTime: '14:00',
//       date: '2025-08-01',
//     },
//     {
//       id: '4',
//       studentName: 'Emma Davis',
//       studentId: 'ST004',
//       checkInTime: '11:20',
//       date: '2025-08-01',
//     },
//     {
//       id: '5',
//       studentName: 'Michael Brown',
//       studentId: 'ST005',
//       checkInTime: '08:45',
//       date: '2025-07-31',
//     },
//   ];

//   const filteredRecords = attendanceRecords.filter(record => {
//     const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          record.studentId.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesDate = selectedDate === 'all' ||
//                        (selectedDate === 'today' && record.date === '2025-08-01') ||
//                        record.date === selectedDate;

//     return matchesSearch && matchesDate;
//   }).sort((a, b) => {
//     // Sort by date descending (most recent first), then by time descending
//     const dateA = new Date(a.date + ' ' + a.checkInTime);
//     const dateB = new Date(b.date + ' ' + b.checkInTime);
//     return dateB.getTime() - dateA.getTime();
//   });

//   // Mock data for different time periods
//   const getVisitorsByPeriod = (period: string) => {
//     const now = new Date('2025-08-01'); // Using current date as reference
//     switch (period) {
//       case 'week':
//         // Mock weekly data - 45 visitors this week
//         return 45;
//       case 'month':
//         // Mock monthly data - 180 visitors this month
//         return 180;
//       case 'year':
//         // Mock yearly data - 2340 visitors this year
//         return 2340;
//       default:
//         return 0;
//     }
//   };

//   const exportLogs = () => {
//     // Mock export functionality
//     const csvContent = [
//       'Date,Student Name,Student ID,Check-in Time',
//       ...filteredRecords.map(record =>
//         `${record.date},${record.studentName},${record.studentId},${record.checkInTime}`
//       )
//     ].join('\n');

//     const element = document.createElement('a');
//     const file = new Blob([csvContent], { type: 'text/csv' });
//     element.href = URL.createObjectURL(file);
//     element.download = `attendance-logs-${new Date().toISOString().split('T')[0]}.csv`;
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl mb-2 flex items-center gap-2">
//             <Calendar className="h-6 w-6" />
//             Attendance Logs
//           </h1>
//           <p className="text-muted-foreground">Monitor student visits and library usage patterns.</p>
//         </div>
//         <Button onClick={exportLogs} variant="outline" className="gap-2">
//           <Download className="h-4 w-4" />
//           Export Logs
//         </Button>
//       </div>

//       {/* Total Visitors with Filters */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Total Visitors</CardTitle>
//           <CardDescription>View visitor statistics by time period</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <TabsList className="grid w-full grid-cols-3">
//               <TabsTrigger value="week">Week</TabsTrigger>
//               <TabsTrigger value="month">Month</TabsTrigger>
//               <TabsTrigger value="year">Year</TabsTrigger>
//             </TabsList>

//             <div className="mt-6">
//               <TabsContent value="week" className="space-y-4">
//                 <Card>
//                   <CardContent className="p-6 text-center">
//                     <div className="flex items-center justify-center gap-2 mb-2">
//                       <User className="h-5 w-5 text-blue-600" />
//                       <span className="text-sm text-muted-foreground">This Week</span>
//                     </div>
//                     <p className="text-3xl mb-1">{getVisitorsByPeriod('week')}</p>
//                     <p className="text-xs text-muted-foreground">Total visitors</p>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="month" className="space-y-4">
//                 <Card>
//                   <CardContent className="p-6 text-center">
//                     <div className="flex items-center justify-center gap-2 mb-2">
//                       <User className="h-5 w-5 text-green-600" />
//                       <span className="text-sm text-muted-foreground">This Month</span>
//                     </div>
//                     <p className="text-3xl mb-1">{getVisitorsByPeriod('month')}</p>
//                     <p className="text-xs text-muted-foreground">Total visitors</p>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="year" className="space-y-4">
//                 <Card>
//                   <CardContent className="p-6 text-center">
//                     <div className="flex items-center justify-center gap-2 mb-2">
//                       <User className="h-5 w-5 text-purple-600" />
//                       <span className="text-sm text-muted-foreground">This Year</span>
//                     </div>
//                     <p className="text-3xl mb-1">{getVisitorsByPeriod('year')}</p>
//                     <p className="text-xs text-muted-foreground">Total visitors</p>
//                   </CardContent>
//                 </Card>
//               </TabsContent>
//             </div>
//           </Tabs>
//         </CardContent>
//       </Card>

//       {/* Filters - Simplified */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Filter className="h-5 w-5" />
//             Filter Logs
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <Input
//                 placeholder="Search by student name or ID..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <Select value={selectedDate} onValueChange={setSelectedDate}>
//               <SelectTrigger className="w-full md:w-48">
//                 <SelectValue placeholder="Select date" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="today">Today</SelectItem>
//                 <SelectItem value="2025-07-31">Yesterday</SelectItem>
//                 <SelectItem value="all">All dates</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Attendance Records - Simplified */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Attendance Records</CardTitle>
//           <CardDescription>
//             Showing {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             {filteredRecords.map((record) => (
//               <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
//                 <div className="flex items-center gap-4 flex-1">
//                   <div className="flex items-center gap-3">
//                     <div className="text-center min-w-0">
//                       <p className="text-sm">{new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
//                       <p className="text-xs text-muted-foreground">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
//                     </div>
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 mb-1">
//                       <User className="h-4 w-4 text-muted-foreground" />
//                       <span className="text-sm">{record.studentName}</span>
//                       <Badge variant="outline" className="text-xs">{record.studentId}</Badge>
//                     </div>
//                     <div className="text-xs text-muted-foreground">
//                       <span>Check-in: {record.checkInTime}</span>
//                     </div>
//                   </div>

//                   <div className="text-right">
//                     <p className="text-sm">Visited</p>
//                     <p className="text-xs text-muted-foreground">
//                       Library attendance
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {filteredRecords.length === 0 && (
//             <div className="text-center py-8">
//               <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//               <p className="text-muted-foreground">No attendance records found for the selected filters.</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
