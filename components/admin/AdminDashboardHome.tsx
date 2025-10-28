import React, { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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
  Users,
  BookOpen,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  Calendar,
  BarChart3,
  Activity,
  Settings,
} from "lucide-react";
import type { User } from "@/types/user";

interface AdminDashboardHomeProps {
  user: User;
  onNavigate?: (view: string) => void;
}

export function AdminDashboardHome({
  user,
  onNavigate,
}: AdminDashboardHomeProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const kpiData = [
    {
      title: "Total Users",
      value: "234",
      description: "+12 this month",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Active Books",
      value: "1,247",
      description: "89% available",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Daily Visitors",
      value: "47",
      description: "Today",
      icon: UserCheck,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  const monthlyData = [
    { name: "Alex Johnson", visits: 24 },
    { name: "Maria Garcia", visits: 22 },
    { name: "David Wilson", visits: 20 },
    { name: "Emma Davis", visits: 18 },
    { name: "Michael Brown", visits: 16 },
    { name: "Sophie Wilson", visits: 15 },
    { name: "James Taylor", visits: 14 },
    { name: "Lisa Anderson", visits: 12 },
  ];

  const attendanceData = [
    { day: "Mon", visitors: 45, books: 12 },
    { day: "Tue", visitors: 52, books: 18 },
    { day: "Wed", visitors: 48, books: 15 },
    { day: "Thu", visitors: 61, books: 22 },
    { day: "Fri", visitors: 55, books: 19 },
    { day: "Sat", visitors: 38, books: 8 },
    { day: "Sun", visitors: 25, books: 5 },
  ];

  const topVisitorsData =
    selectedPeriod === "month" ? monthlyData.slice(0, 5) : monthlyData;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Here's your library system overview.
        </p>
      </div>

      {/* Quick Admin Actions - Moved to Top */}
      <Card className="border-t-4 border-t-indigo-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Admin Actions
          </CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => onNavigate?.("users")}
            >
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => onNavigate?.("books")}
            >
              <BookOpen className="h-6 w-6" />
              <span>Book Inventory</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => onNavigate?.("overdue")}
            >
              <AlertTriangle className="h-6 w-6" />
              <span>System Alerts</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => onNavigate?.("logs")}
            >
              <Activity className="h-6 w-6" />
              <span>Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => {
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
                <div className="text-2xl">{kpi.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Visitors Chart */}
        <Card className="border-t-4 border-t-green-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top Visitors
                </CardTitle>
                <CardDescription>
                  Most frequent library visitors
                </CardDescription>
              </div>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="semester">Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topVisitorsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity Trends */}
        <Card className="border-t-4 border-t-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Weekly Activity
            </CardTitle>
            <CardDescription>Daily visitors and book checkouts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Visitors"
                  />
                  <Line
                    type="monotone"
                    dataKey="books"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Books Borrowed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
