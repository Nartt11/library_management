import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { BookOpen, Users, AlertTriangle, QrCode, Calendar, TrendingUp } from 'lucide-react';
import type { User } from '../../App';

interface LibrarianDashboardHomeProps {
  user: User;
  onNavigate?: (view: string) => void;
  onAddBook?: () => void;
}

export function LibrarianDashboardHome({ user, onNavigate, onAddBook }: LibrarianDashboardHomeProps) {
  const kpiData = [
    {
      title: 'Books Borrowed Today',
      value: '24',
      description: '+3 from yesterday',
      icon: BookOpen,
      color: 'text-blue-600',
      trend: 'up',
    },
    {
      title: 'Active Visitors',
      value: '47',
      description: 'Currently in library',
      icon: Users,
      color: 'text-green-600',
      trend: 'up',
    },
    {
      title: 'Overdue Books',
      value: '8',
      description: 'Need attention',
      icon: AlertTriangle,
      color: 'text-red-600',
      trend: 'down',
    },
    {
      title: 'QR Scans',
      value: '156',
      description: 'Today',
      icon: QrCode,
      color: 'text-purple-600',
      trend: 'up',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">Here's your library overview for today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">{kpi.title}</CardTitle>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{kpi.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : null}
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common librarian tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => onNavigate?.('scanner')}
            >
              <QrCode className="h-6 w-6" />
              <span>Scan QR Code</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => onAddBook?.()}
            >
              <BookOpen className="h-6 w-6" />
              <span>Add New Book</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => onNavigate?.('overdue')}
            >
              <AlertTriangle className="h-6 w-6" />
              <span>View Overdue</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => onNavigate?.('attendance')}
            >
              <Calendar className="h-6 w-6" />
              <span>Attendance Logs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}