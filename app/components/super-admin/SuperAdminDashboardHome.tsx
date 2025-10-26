import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Users, BookOpen, Activity, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import type { User } from '../../App';

interface SuperAdminDashboardHomeProps {
  user: User;
}

export function SuperAdminDashboardHome({ user }: SuperAdminDashboardHomeProps) {
  const systemStats = [
    {
      title: 'Total Users',
      value: '234',
      description: 'All roles combined',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Total Books',
      value: '1,247',
      description: 'Across all categories',
      icon: BookOpen,
      color: 'text-green-600',
    },
    {
      title: 'System Activity',
      value: '2,847',
      description: 'Actions today',
      icon: Activity,
      color: 'text-purple-600',
    },
    {
      title: 'Security Status',
      value: 'Secure',
      description: 'All systems operational',
      icon: Shield,
      color: 'text-green-600',
    },
  ];

  const userBreakdown = [
    { role: 'Students', count: 198, change: '+12' },
    { role: 'Librarians', count: 24, change: '+2' },
    { role: 'Admins', count: 10, change: '+1' },
    { role: 'Super Admins', count: 2, change: '0' },
  ];

  const systemAlerts = [
    { id: '1', type: 'warning', message: '8 books are overdue and need attention', time: '2 hours ago' },
    { id: '2', type: 'info', message: 'Daily backup completed successfully', time: '6 hours ago' },
    { id: '3', type: 'success', message: 'System security scan passed', time: '12 hours ago' },
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-orange-600';
      case 'error': return 'text-red-600';
      case 'success': return 'text-green-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2">System Overview</h1>
        <p className="text-muted-foreground">Complete library management system dashboard.</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
            <CardDescription>User count by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userBreakdown.map((user) => (
                <div key={user.role} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{user.count}</span>
                    <Badge variant={user.change.startsWith('+') ? 'default' : 'outline'}>
                      {user.change}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Recent system notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${getAlertColor(alert.type)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-clamp-2">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>System Management</CardTitle>
          <CardDescription>Administrative actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Users className="h-6 w-6 text-blue-600 mb-2" />
              <h4 className="text-sm mb-1">Manage All Users</h4>
              <p className="text-xs text-muted-foreground">Add, edit, or remove user accounts</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <BookOpen className="h-6 w-6 text-green-600 mb-2" />
              <h4 className="text-sm mb-1">Global Book Management</h4>
              <p className="text-xs text-muted-foreground">Oversee entire book inventory</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Activity className="h-6 w-6 text-purple-600 mb-2" />
              <h4 className="text-sm mb-1">System Logs</h4>
              <p className="text-xs text-muted-foreground">Monitor all system activities</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}