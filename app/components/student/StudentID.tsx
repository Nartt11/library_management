import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { User, Edit3, Save, X, Eye, EyeOff, Copy } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { User } from '../../App';

interface StudentIDProps {
  user: User;
}

export function StudentID({ user }: StudentIDProps) {
  const [studentNumber, setStudentNumber] = useState(user.studentNumber || 'ST001234567');
  const [isEditing, setIsEditing] = useState(false);
  const [tempStudentNumber, setTempStudentNumber] = useState(studentNumber);
  const [showNumber, setShowNumber] = useState(true);

  const handleSave = () => {
    if (!tempStudentNumber.trim()) {
      toast.error('Student number cannot be empty');
      return;
    }
    
    setStudentNumber(tempStudentNumber);
    setIsEditing(false);
    toast.success('Student ID updated successfully');
  };

  const handleCancel = () => {
    setTempStudentNumber(studentNumber);
    setIsEditing(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(studentNumber).then(() => {
      toast.success('Student number copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy student number');
    });
  };

  const formatStudentNumber = (number: string) => {
    if (!showNumber) {
      return '••••••••••';
    }
    return number;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2 flex items-center gap-2">
          <User className="h-6 w-6" />
          Student ID
        </h1>
        <p className="text-muted-foreground">Manage your student identification number and settings.</p>
      </div>

      {/* Student ID Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Digital Student ID
          </CardTitle>
          <CardDescription>Your primary identification for library services</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* ID Display */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg mb-1">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Student Number</label>
                  <div className="flex items-center gap-3">
                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          value={tempStudentNumber}
                          onChange={(e) => setTempStudentNumber(e.target.value)}
                          placeholder="Enter student number"
                          className="text-lg"
                        />
                        <Button size="sm" onClick={handleSave}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <p className="text-xl font-mono tracking-wider">
                            {formatStudentNumber(studentNumber)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowNumber(!showNumber)}
                            title={showNumber ? "Hide number" : "Show number"}
                          >
                            {showNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={copyToClipboard}
                            title="Copy to clipboard"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            title="Edit student number"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-muted-foreground">Account Status</span>
                    </div>
                    <p className="text-lg">Active</p>
                    <p className="text-xs text-muted-foreground">Member since 2024</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Copy className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-muted-foreground">Quick Copy</span>
                    </div>
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      Copy Student Number
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card>
        <CardHeader>
          <CardTitle>Important Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="text-green-600">✓ Your Student ID is used for:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Library access and verification</li>
                <li>• Book borrowing and returns</li>
                <li>• Manual check-in when QR is unavailable</li>
                <li>• Attendance tracking</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-orange-600">⚠ Security Notes:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Keep your student number secure</li>
                <li>• Report lost or stolen ID immediately</li>
                <li>• Use manual input if ID is hidden/lost</li>
                <li>• Update your number if it changes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Input Helper */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Input Helper</CardTitle>
          <CardDescription>In case your physical ID is lost or hidden</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="text-amber-800 mb-2">Lost or Hidden ID?</h4>
            <p className="text-amber-700 text-sm mb-3">
              If your physical student ID is lost or hidden, you can still access library services:
            </p>
            <ol className="text-amber-700 text-sm space-y-1">
              <li>1. Use the "Manual Check-In" option in the sidebar</li>
              <li>2. Enter your student number manually</li>
              <li>3. Date and time will be filled automatically</li>
              <li>4. Contact library staff if you need assistance</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}