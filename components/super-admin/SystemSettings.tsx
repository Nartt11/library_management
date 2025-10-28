import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Settings, Database, Shield, Bell, Clock } from 'lucide-react';

export function SystemSettings() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2 flex items-center gap-2">
          <Settings className="h-6 w-6" />
          System Settings
        </h1>
        <p className="text-muted-foreground">Configure system-wide settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Basic system configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="library-name">Library Name</Label>
              <Input id="library-name" defaultValue="University Library" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-books">Max Books Per Student</Label>
              <Input id="max-books" type="number" defaultValue="5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loan-period">Default Loan Period (days)</Label>
              <Input id="loan-period" type="number" defaultValue="14" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-renewal">Enable Auto-renewal</Label>
              <Switch id="auto-renewal" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Security and access control</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor">Require Two-Factor Auth</Label>
              <Switch id="two-factor" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password-policy">Strong Password Policy</Label>
              <Switch id="password-policy" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input id="session-timeout" type="number" defaultValue="60" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="audit-log">Enable Audit Logging</Label>
              <Switch id="audit-log" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Email and alert preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="overdue-alerts">Overdue Book Alerts</Label>
              <Switch id="overdue-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="return-reminders">Return Reminders</Label>
              <Switch id="return-reminders" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-days">Days Before Due Date</Label>
              <Input id="reminder-days" type="number" defaultValue="3" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-reports">Daily Reports</Label>
              <Switch id="daily-reports" />
            </div>
          </CardContent>
        </Card>

        {/* Backup Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backup & Maintenance
            </CardTitle>
            <CardDescription>Data backup and system maintenance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-backup">Automatic Backups</Label>
              <Switch id="auto-backup" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backup-frequency">Backup Frequency</Label>
              <Input id="backup-frequency" defaultValue="Daily" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retention-period">Retention Period (days)</Label>
              <Input id="retention-period" type="number" defaultValue="30" />
            </div>
            <Button variant="outline" className="w-full">
              Run Manual Backup
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Save Settings */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Button>Save All Settings</Button>
            <Button variant="outline">Reset to Defaults</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}