// import React from "react";

// export default function AdminDashboard() {
//   return <div>AdminDashboard</div>;
// }

"use client";
import React, { useState, useEffect } from "react";
import type { User } from "@/../../types/user";
import { useAuth } from "@/context/authContext";
import { getTopCategories, TopCategory, getBorrowStatistics, BorrowCountStatDto, getTopMembersByBorrowCount, MemberBorrowCountStatDto, getTotalCounts, TotalCountsDto } from "@/services/dashboard";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  UserRound,
  BookOpen,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  Calendar,
  BarChart3,
  Activity,
  Settings,
  RoseIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");
  const router = useRouter();
  console.log("Current User in AdminDashboard:", currentUser);

  // Top categories state
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  // Borrow statistics state
  const [weeklyBorrowStats, setWeeklyBorrowStats] = useState<BorrowCountStatDto | null>(null);
  const [topMembers, setTopMembers] = useState<MemberBorrowCountStatDto[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  
  // Dashboard counts state
  const [totalCounts, setTotalCounts] = useState<TotalCountsDto>({
    totalMembers: 0,
    totalBooks: 0,
    totalBorrowRequests: 0,
  });
  const [loadingCounts, setLoadingCounts] = useState(false);
  
  // Helper to get last 7 days
  const getLastWeekDates = () => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 7);
    return {
      from: from.toISOString().split('T')[0],
      to: to.toISOString().split('T')[0]
    };
  };
  
  // Helper to get last 30 days
  const getLastMonthDates = () => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);
    return {
      from: from.toISOString().split('T')[0],
      to: to.toISOString().split('T')[0]
    };
  };
  
  // Date range states for each chart
  // Borrow Count Chart (default: last 7 days)
  const [borrowFromDate, setBorrowFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });
  const [borrowToDate, setBorrowToDate] = useState(() => new Date().toISOString().split('T')[0]);
  
  // Top Members Chart (default: last 30 days)
  const [membersFromDate, setMembersFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [membersToDate, setMembersToDate] = useState(() => new Date().toISOString().split('T')[0]);
  
  // Categories Chart (default: last 3 months)
  const getDefaultFromDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return date.toISOString().split('T')[0];
  };
  
  const getDefaultToDate = () => {
    return new Date().toISOString().split('T')[0];
  };
  
  const [fromDate, setFromDate] = useState(getDefaultFromDate());
  const [toDate, setToDate] = useState(getDefaultToDate());

  // Debug: Log totalCounts whenever it changes
  useEffect(() => {
    console.log('🔄 totalCounts updated:', totalCounts);
  }, [totalCounts]);

  const kpiData = [
    {
      title: "Total Members",
      value: (totalCounts?.totalMembers ?? 0).toString(),
      description: "Registered members",
      icon: UserRound,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Books",
      value: (totalCounts?.totalBooks ?? 0).toString(),
      description: `${totalCounts?.totalBorrowRequests ?? 0} total requests`,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  // Fetch top categories
  useEffect(() => {
    const fetchTopCategories = async () => {
      try {
        setLoadingCategories(true);
        const fromISO = `${fromDate}T00:00:00Z`;
        const toISO = `${toDate}T23:59:59Z`;
        const response = await getTopCategories(fromISO, toISO, 1, 5);
        setTopCategories(response.data || []);
      } catch (error: any) {
        console.error('Error fetching top categories:', error);
        toast.error('Failed to load top categories');
        setTopCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (fromDate && toDate) {
      fetchTopCategories();
    }
  }, [fromDate, toDate]);
  
  // Fetch dashboard counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoadingCounts(true);
        const counts = await getTotalCounts();
        console.log('📊 Fetched total counts:', counts);
        setTotalCounts(counts);
      } catch (error: any) {
        console.error('❌ Error fetching counts:', error);
        toast.error('Failed to load total counts');
      } finally {
        setLoadingCounts(false);
      }
    };

    fetchCounts();
  }, []);
  
  // Fetch borrow statistics based on date range
  useEffect(() => {
    const fetchBorrowStats = async () => {
      try {
        setLoadingStats(true);
        const fromISO = `${borrowFromDate}T00:00:00Z`;
        const toISO = `${borrowToDate}T23:59:59Z`;
        console.log('➡️ Fetching borrow stats with:', { fromISO, toISO });
        const borrowStats = await getBorrowStatistics(fromISO, toISO);
        console.log('📈 Borrow stats:', borrowStats);
        setWeeklyBorrowStats(borrowStats);
      } catch (error: any) {
        console.error('Error fetching borrow statistics:', error);
        toast.error('Failed to load borrow statistics');
        setWeeklyBorrowStats(null);
      } finally {
        setLoadingStats(false);
      }
    };

    if (borrowFromDate && borrowToDate) {
      fetchBorrowStats();
    }
  }, [borrowFromDate, borrowToDate]);
  
  // Fetch top members based on date range
  useEffect(() => {
    const fetchTopMembers = async () => {
      try {
        const fromISO = `${membersFromDate}T00:00:00Z`;
        const toISO = `${membersToDate}T23:59:59Z`;
        console.log('➡️ Fetching top members with:', { fromISO, toISO });
        const topMembersData = await getTopMembersByBorrowCount(fromISO, toISO, 5);
        console.log('👥 Top members:', topMembersData);
        setTopMembers(topMembersData);
      } catch (error: any) {
        console.error('Error fetching top members:', error);
        toast.error('Failed to load top members');
        setTopMembers([]);
      }
    };

    if (membersFromDate && membersToDate) {
      fetchTopMembers();
    }
  }, [membersFromDate, membersToDate]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  // const renderContent = () => {
  //   switch (activeView) {
  //     case "dashboard":
  //       return <AdminDashboardHome user={user} onNavigate={setActiveView} />;
  //     case "users":
  //       return (
  //         <UserManagement
  //         //onDeleteUser={addToBackup.user}
  //         />
  //       );
  //     case "books":
  //       return (
  //         <AdminBookManagement
  //         //onDeleteBook={null}
  //         // currentUser={user}
  //         />
  //       );
  //     // case "equipment":
  //     //   return (
  //     //     <AdminEquipmentManagement
  //     //       onDeleteEquipment={addToBackup.equipment}
  //     //       currentUser={user}
  //     //     />
  //     //   );
  //     // case "attendance":
  //     //   return <AdminAttendanceLogs />;
  //     case "history":
  //       return <AdminBorrowingHistory />;
  //     case "overdue":
  //       return <OverdueAlerts />;
  //     case "logs":
  //       return <GlobalLogs />;

  //     case "features":
  //       return <Features currentUser={user} />;
  //     case "account":
  //       return <ManageAccount user={user} />;
  //     default:
  //       return <AdminDashboardHome user={user} onNavigate={setActiveView} />;
  //   }
  // };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2">Welcome back, {currentUser.name}!</h1>
        <p className="text-muted-foreground">
          Here's your library system overview.
        </p>
      </div>

      {/* Row 1: KPI Cards - User and Book Counts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loadingCounts ? (
          <>
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="pt-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="pt-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          kpiData.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.title} className="border-l-4 border-l-orange-500">
                <CardHeader
                  className={`flex flex-row items-center justify-between space-y-0 pb-2 ${kpi.bgColor}`}
                >
                  <CardTitle className="text-sm">{kpi.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    {kpi.description}
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Row 2: Weekly Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Borrow Count */}
        <Card className="border-t-4 border-t-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Borrow Count Statistics
            </CardTitle>
            <CardDescription>
              Daily borrow count • Total: {weeklyBorrowStats?.total || 0}
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <div className="flex-1">
                <label className="text-xs font-medium">From</label>
                <input
                  type="date"
                  value={borrowFromDate}
                  onChange={(e) => setBorrowFromDate(e.target.value)}
                  max={borrowToDate}
                  className="w-full px-2 py-1 text-sm border rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium">To</label>
                <input
                  type="date"
                  value={borrowToDate}
                  onChange={(e) => setBorrowToDate(e.target.value)}
                  min={borrowFromDate}
                  max={getDefaultToDate()}
                  className="w-full px-2 py-1 text-sm border rounded-md"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <div className="h-64 flex items-center justify-center">
                <div className="text-muted-foreground">Loading...</div>
              </div>
            ) : !weeklyBorrowStats || weeklyBorrowStats.dailyCounts.length === 0 ? (
              <div className="h-64 flex items-center justify-center">
                <div className="text-muted-foreground">No data available</div>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyBorrowStats.dailyCounts.map((count, index) => {
                    const date = new Date(weeklyBorrowStats.fromDate);
                    date.setDate(date.getDate() + index);
                    return { date: date.toISOString().split('T')[0], count };
                  })}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      formatter={(value) => [`${value} borrows`, 'Books']}
                    />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Members by Borrow Count */}
        <Card className="border-t-4 border-t-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Top Members by Borrows
            </CardTitle>
            <CardDescription>Members with most borrows</CardDescription>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <div className="flex-1">
                <label className="text-xs font-medium">From</label>
                <input
                  type="date"
                  value={membersFromDate}
                  onChange={(e) => setMembersFromDate(e.target.value)}
                  max={membersToDate}
                  className="w-full px-2 py-1 text-sm border rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium">To</label>
                <input
                  type="date"
                  value={membersToDate}
                  onChange={(e) => setMembersToDate(e.target.value)}
                  min={membersFromDate}
                  max={getDefaultToDate()}
                  className="w-full px-2 py-1 text-sm border rounded-md"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <div className="h-64 flex items-center justify-center">
                <div className="text-muted-foreground">Loading...</div>
              </div>
            ) : topMembers.length === 0 ? (
              <div className="h-64 flex items-center justify-center">
                <div className="text-muted-foreground">No data available</div>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topMembers} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="memberName"
                      width={120}
                      fontSize={11}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} borrows`, 'Total Borrows']}
                    />
                    <Bar dataKey="borrowCount" fill="#a855f7" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Top Categories with Date Filter */}
      <Card className="border-t-4 border-t-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Top Book Categories
          </CardTitle>
          <CardDescription>
            Most borrowed categories in selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end mb-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                max={toDate}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                min={fromDate}
                max={getDefaultToDate()}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button
              onClick={() => {
                setFromDate(getDefaultFromDate());
                setToDate(getDefaultToDate());
              }}
              variant="outline"
            >
              Reset to Last 3 Months
            </Button>
          </div>
          {loadingCategories ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-muted-foreground">Loading categories...</div>
            </div>
          ) : topCategories.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-muted-foreground">No data available for selected period</div>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCategories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="categoryName"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis 
                    label={{ value: 'Borrow Count', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} borrows`, 'Borrow Count']}
                    labelFormatter={(label) => `Category: ${label}`}
                  />
                  <Bar dataKey="borrowCount" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
