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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Calendar, Clock, UserRound, Plus, LogIn } from "lucide-react";
import { toast } from "sonner";
import type { User } from "../../page";

interface StudentAttendanceProps {
  user: User;
}

interface AttendanceRecord {
  id: string;
  date: string;
  timeIn: string;
  type: "qr" | "manual";
}

export function StudentAttendance({ user }: StudentAttendanceProps) {
  const [activeTab, setActiveTab] = useState("month");
  const [studentId, setStudentId] = useState("ST001");
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [manualStudentNumber, setManualStudentNumber] = useState("");

  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([
    { id: "1", date: "2025-08-01", timeIn: "09:15", type: "qr" },
    { id: "2", date: "2025-07-31", timeIn: "14:00", type: "qr" },
    { id: "3", date: "2025-07-30", timeIn: "10:30", type: "qr" },
    { id: "4", date: "2025-07-29", timeIn: "13:20", type: "qr" },
    { id: "5", date: "2025-07-28", timeIn: "08:45", type: "qr" },
    { id: "6", date: "2025-07-26", timeIn: "11:00", type: "qr" },
    { id: "7", date: "2025-07-25", timeIn: "15:30", type: "qr" },
    { id: "8", date: "2025-07-24", timeIn: "10:00", type: "manual" },
    { id: "9", date: "2025-07-23", timeIn: "16:00", type: "qr" },
    { id: "10", date: "2025-08-02", timeIn: "08:30", type: "qr" },
  ]);

  const getFilteredRecords = (filter: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let filtered: AttendanceRecord[];

    switch (filter) {
      case "day":
        filtered = attendanceRecords.filter((record) => {
          const recordDate = new Date(record.date);
          return recordDate.toDateString() === today.toDateString();
        });
        break;
      case "week":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        filtered = attendanceRecords.filter((record) => {
          const recordDate = new Date(record.date);
          return recordDate >= weekStart && recordDate <= weekEnd;
        });
        break;
      case "year":
        filtered = attendanceRecords.filter((record) => {
          const recordDate = new Date(record.date);
          return recordDate.getFullYear() === now.getFullYear();
        });
        break;
      case "month":
      default:
        filtered = attendanceRecords.filter((record) => {
          const recordDate = new Date(record.date);
          return (
            recordDate.getMonth() === now.getMonth() &&
            recordDate.getFullYear() === now.getFullYear()
          );
        });
        break;
    }

    // Sort by date descending (most recent first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date + " " + a.timeIn);
      const dateB = new Date(b.date + " " + b.timeIn);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const getFilterLabel = (filter: string) => {
    switch (filter) {
      case "day":
        return "Today";
      case "week":
        return "This Week";
      case "year":
        return "This Year";
      case "month":
      default:
        return "This Month";
    }
  };

  const handleManualAttendance = () => {
    if (!manualStudentNumber) {
      toast.error("Please enter your student number");
      return;
    }

    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().split(" ")[0].substring(0, 5);

    const newRecord: AttendanceRecord = {
      id: `manual-${Date.now()}`,
      date: currentDate,
      timeIn: currentTime,
      type: "manual",
    };

    setAttendanceRecords((prev) => [...prev, newRecord]);

    // Reset form
    setManualStudentNumber("");
    setShowManualDialog(false);

    toast.success("Manual attendance record added successfully");
  };

  const renderAttendanceContent = (filter: string) => {
    const filteredRecords = getFilteredRecords(filter);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Your library visits for {getFilterLabel(filter).toLowerCase()} (
              {filteredRecords.length} records)
            </p>
          </div>
          <Button
            onClick={() => setShowManualDialog(true)}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Manual Entry
          </Button>
        </div>

        <div className="space-y-3">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg mb-2">No attendance records</h3>
              <p className="text-muted-foreground">
                No visits found for the selected time period.
              </p>
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-0">
                    <p className="text-sm">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">Check-in: {record.timeIn}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Badge
                        variant={
                          record.type === "manual" ? "outline" : "default"
                        }
                        className="text-xs"
                      >
                        {record.type === "manual" ? "Manual" : "QR"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right min-w-0">
                  <p className="text-sm font-medium text-center">Checked In</p>
                  <p className="text-xs text-muted-foreground text-center">
                    Status
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2 flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            My Attendance
          </h1>
          <p className="text-muted-foreground">
            Track your library visits and check-in times.
          </p>
        </div>
      </div>

      {/* Student ID Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5" />
            Student Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Student ID</label>
              <Input
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter your student ID"
                className="max-w-xs"
              />
            </div>
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <LogIn className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-muted-foreground">
                      Total Visits
                    </span>
                  </div>
                  <p className="text-2xl">{attendanceRecords.length}</p>
                  <p className="text-xs text-muted-foreground text-center">
                    All time
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>
            View your library check-ins by time period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="day" className="space-y-4">
                {renderAttendanceContent("day")}
              </TabsContent>

              <TabsContent value="week" className="space-y-4">
                {renderAttendanceContent("week")}
              </TabsContent>

              <TabsContent value="month" className="space-y-4">
                {renderAttendanceContent("month")}
              </TabsContent>

              <TabsContent value="year" className="space-y-4">
                {renderAttendanceContent("year")}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Manual Attendance Dialog */}
      <Dialog open={showManualDialog} onOpenChange={setShowManualDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Manual Check-in
            </DialogTitle>
            <DialogDescription>
              Enter your student number to add a manual check-in record. Date
              and time will be automatically generated.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student-number">Student Number</Label>
              <Input
                id="student-number"
                type="text"
                value={manualStudentNumber}
                onChange={(e) => setManualStudentNumber(e.target.value)}
                placeholder="Enter your student number"
              />
            </div>

            <div className="bg-muted/50 p-3 rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground">
                Auto-generated details:
              </p>
              <div className="flex justify-between text-sm">
                <span>Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Time:</span>
                <span>
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleManualAttendance} className="flex-1">
                <LogIn className="h-4 w-4 mr-2" />
                Add Check-in
              </Button>
              <Button
                onClick={() => setShowManualDialog(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
