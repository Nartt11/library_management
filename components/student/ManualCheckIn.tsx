import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { ScanAlert } from "../ui/scan-alert";
import { LogIn, Clock, Calendar, UserRound, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import type { User } from "../../../types/user";

interface ManualCheckInProps {
  user: User;
}

interface CheckInRecord {
  id: string;
  studentNumber: string;
  date: string;
  time: string;
  timestamp: string;
}

export function ManualCheckIn({ user }: ManualCheckInProps) {
  const [studentNumber, setStudentNumber] = useState(user.studentNumber || "");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showScanAlert, setShowScanAlert] = useState(false);
  const [recentCheckIns, setRecentCheckIns] = useState<CheckInRecord[]>([
    {
      id: "1",
      studentNumber: "ST001234567",
      date: "2025-08-01",
      time: "14:30:00",
      timestamp: "2025-08-01T14:30:00",
    },
    {
      id: "2",
      studentNumber: "ST001234567",
      date: "2025-07-31",
      time: "10:15:00",
      timestamp: "2025-07-31T10:15:00",
    },
  ]);

  // Auto-fill current date and time
  const currentDate = new Date().toISOString().split("T")[0];
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCheckIn = () => {
    if (!studentNumber.trim()) {
      toast.error("Please enter your student number");
      return;
    }

    // Validate student number format (basic validation)
    if (studentNumber.length < 5) {
      toast.error("Student number must be at least 5 characters");
      return;
    }

    const newCheckIn: CheckInRecord = {
      id: `checkin-${Date.now()}`,
      studentNumber: studentNumber,
      date: currentDate,
      time: currentTime,
      timestamp: new Date().toISOString(),
    };

    setRecentCheckIns((prev) => [newCheckIn, ...prev.slice(0, 4)]); // Keep only 5 most recent
    setIsCheckedIn(true);

    setShowScanAlert(true);

    // Reset checked-in state after 3 seconds
    setTimeout(() => {
      setIsCheckedIn(false);
    }, 3000);
  };

  const getTodayCheckIns = () => {
    return recentCheckIns.filter((checkIn) => checkIn.date === currentDate);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2 flex items-center gap-2">
          <LogIn className="h-6 w-6" />
          Manual Check-In
        </h1>
        <p className="text-muted-foreground">
          Check into the library using your student number when QR scanning is
          unavailable.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">Today</span>
            </div>
            <p className="text-2xl">{getTodayCheckIns().length}</p>
            <p className="text-xs text-muted-foreground">Check-ins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">
                Current Time
              </span>
            </div>
            <p className="text-xl">{currentTime}</p>
            <p className="text-xs text-muted-foreground">Auto-filled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <UserRound className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-muted-foreground">Status</span>
            </div>
            <p className="text-lg">{isCheckedIn ? "Checked In" : "Ready"}</p>
            <p className="text-xs text-muted-foreground">Current</p>
          </CardContent>
        </Card>
      </div>

      {/* Check-In Form */}
      <Card className={isCheckedIn ? "border-green-500 bg-green-50" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Check-In Form
          </CardTitle>
          <CardDescription>
            Enter your student number to record your library visit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isCheckedIn && (
            <div className="flex items-center gap-2 p-3 bg-green-100 rounded-lg border border-green-300">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800">
                Check-in successful! You are now logged in.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-2">
              <Label htmlFor="student-number">Student Number *</Label>
              <Input
                id="student-number"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                placeholder="Enter your student number"
                disabled={isCheckedIn}
              />
              <p className="text-xs text-muted-foreground">
                Enter your complete student number (e.g., ST001234567)
              </p>
            </div>

            <div className="space-y-2">
              <Label>Date (Auto-filled)</Label>
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {new Date(currentDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Time (Auto-filled)</Label>
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{currentTime}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleCheckIn}
              disabled={isCheckedIn || !studentNumber.trim()}
              className="gap-2 min-w-48"
              size="lg"
            >
              {isCheckedIn ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Checked In Successfully
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Check In Now
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Check-ins */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Check-ins</CardTitle>
          <CardDescription>Your recent manual check-in records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCheckIns.length === 0 ? (
              <div className="text-center py-8">
                <LogIn className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg mb-2">No check-ins yet</h3>
                <p className="text-muted-foreground">
                  Your manual check-ins will appear here.
                </p>
              </div>
            ) : (
              recentCheckIns.map((checkIn) => (
                <div
                  key={checkIn.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-0">
                      <p className="text-sm">
                        {new Date(checkIn.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(checkIn.date).toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <UserRound className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          ID: {checkIn.studentNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">Time: {checkIn.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <Badge
                      variant={
                        checkIn.date === currentDate ? "default" : "secondary"
                      }
                    >
                      {checkIn.date === currentDate ? "Today" : "Completed"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="text-green-600">✓ When to use Manual Check-In:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• QR scanner is unavailable or broken</li>
                <li>• Your phone battery is dead</li>
                <li>• QR code app is not working</li>
                <li>• Physical student ID is lost or hidden</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-blue-600">ℹ How it works:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Enter your student number</li>
                <li>• Date and time are automatically filled</li>
                <li>• Click "Check In Now" to record your visit</li>
                <li>• Your check-in is logged immediately</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scan Alert */}
      <ScanAlert
        isVisible={showScanAlert}
        message="Attendance Recorded"
        type="attendance"
        onClose={() => setShowScanAlert(false)}
      />
    </div>
  );
}
