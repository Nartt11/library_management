import React, { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { NavigationSidebar } from "./NavigationSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ScanAlert } from "./ui/scan-alert";
import {
  QrCode,
  Camera,
  CheckCircle,
  XCircle,
  UserRound,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import type { User } from "../page";

interface ScannerDashboardProps {
  user: User;
  onLogout: () => void;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  checkInTime: string;
  checkInTimestamp: string;
  status: "active" | "completed";
  duration?: number;
}

export function ScannerDashboard({ user, onLogout }: ScannerDashboardProps) {
  const [activeView, setActiveView] = useState("scanner");
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [lastScanResult, setLastScanResult] = useState<any>(null);
  const [showScanAlert, setShowScanAlert] = useState(false);
  const [scanAlertMessage, setScanAlertMessage] = useState("");
  const [scanAlertType, setScanAlertType] = useState<"scan" | "attendance">(
    "scan"
  );
  const [attendanceHistory, setAttendanceHistory] = useState<
    AttendanceRecord[]
  >([
    {
      id: "1",
      studentId: "ST-001",
      studentName: "Alex Johnson",
      studentNumber: "ST001234567",
      checkInTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      checkInTimestamp: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(),
      status: "active",
    },
    {
      id: "2",
      studentId: "ST-002",
      studentName: "Maria Garcia",
      studentNumber: "ST001234568",
      checkInTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      checkInTimestamp: new Date(
        Date.now() - 2 * 60 * 60 * 1000
      ).toLocaleString(),
      status: "completed",
      duration: 90,
    },
  ]);

  const startScanning = () => {
    setIsScanning(true);
    // Simulate scanning after 3 seconds
    setTimeout(() => {
      // Show immediate scan success message
      setScanAlertMessage("Scanned Successfully");
      setScanAlertType("scan");
      setShowScanAlert(true);

      // Mock student QR data for attendance
      const mockStudentQR = {
        type: "student_attendance",
        studentId: "ST-003",
        studentName: "David Wilson",
        studentNumber: "ST001234569",
        timestamp: new Date().toISOString(),
        action: "check-in",
      };

      setLastScanResult(mockStudentQR);
      setIsScanning(false);
    }, 3000);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const handleManualInput = () => {
    if (!manualInput.trim()) {
      toast.error("Please enter QR code data");
      return;
    }

    try {
      const parsedData = JSON.parse(manualInput);
      setLastScanResult(parsedData);
      setManualInput("");
      setScanAlertMessage("Scanned Successfully");
      setScanAlertType("scan");
      setShowScanAlert(true);
    } catch (error) {
      toast.error("Invalid QR code format");
    }
  };

  const processAttendance = () => {
    if (!lastScanResult) return;

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      studentId: lastScanResult.studentId,
      studentName: lastScanResult.studentName,
      studentNumber: lastScanResult.studentNumber,
      checkInTime: new Date().toISOString(),
      checkInTimestamp: new Date().toLocaleString(),
      status: "active",
    };

    setAttendanceHistory((prev) => [newRecord, ...prev]);
    setLastScanResult(null);
    setScanAlertMessage("Attendance Recorded");
    setScanAlertType("attendance");
    setShowScanAlert(true);
  };

  const getActiveStudents = () => {
    return attendanceHistory.filter((record) => record.status === "active")
      .length;
  };

  const getTodayAttendance = () => {
    const today = new Date().toDateString();
    return attendanceHistory.filter(
      (record) => new Date(record.checkInTime).toDateString() === today
    ).length;
  };

  const renderContent = () => {
    switch (activeView) {
      case "scanner":
        return (
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-2xl mb-2 flex items-center gap-2">
                <QrCode className="h-6 w-6" />
                Attendance Scanner
              </h1>
              <p className="text-muted-foreground">
                Scan student QR codes for library attendance tracking.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <UserRound className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-muted-foreground">
                      Active Students
                    </span>
                  </div>
                  <p className="text-2xl">{getActiveStudents()}</p>
                  <p className="text-xs text-muted-foreground">
                    Currently in library
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-muted-foreground">Today</span>
                  </div>
                  <p className="text-2xl">{getTodayAttendance()}</p>
                  <p className="text-xs text-muted-foreground">
                    Total attendance
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <QrCode className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-muted-foreground">
                      Scanner Status
                    </span>
                  </div>
                  <p className="text-lg">{isScanning ? "Active" : "Ready"}</p>
                  <p className="text-xs text-muted-foreground">Current state</p>
                </CardContent>
              </Card>
            </div>

            {/* QR Scanner */}
            <Card>
              <CardHeader>
                <CardTitle>QR Code Scanner</CardTitle>
                <CardDescription>
                  Scan student QR codes to record library attendance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative max-w-md mx-auto">
                  {isScanning ? (
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                      <p className="text-sm text-muted-foreground">
                        Scanning for QR codes...
                      </p>
                      <div className="absolute inset-4 border-2 border-blue-500 border-dashed rounded-lg animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Click to start scanning
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-center">
                  {!isScanning ? (
                    <Button onClick={startScanning} className="gap-2">
                      <Camera className="h-4 w-4" />
                      Start Scanner
                    </Button>
                  ) : (
                    <Button onClick={stopScanning} variant="outline">
                      Stop Scanner
                    </Button>
                  )}
                </div>

                {/* Manual Input */}
                <div className="border-t pt-4 space-y-3">
                  <h4 className="text-sm font-medium">Manual QR Code Input</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste QR code data here..."
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleManualInput} variant="outline">
                      Process
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scan Result */}
            {lastScanResult && (
              <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                    <CheckCircle className="h-5 w-5" />
                    QR Code Detected
                  </CardTitle>
                  <CardDescription className="text-orange-700 dark:text-orange-300">
                    Review and confirm the attendance record
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Student Name
                      </p>
                      <p className="font-medium">
                        {lastScanResult.studentName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Student Number
                      </p>
                      <p className="font-mono text-sm">
                        {lastScanResult.studentNumber}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Action</p>
                      <Badge variant="default">{lastScanResult.action}</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Scan Time</p>
                      <p className="text-sm">
                        {new Date(lastScanResult.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={processAttendance} className="gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Record Attendance
                    </Button>
                    <Button
                      onClick={() => setLastScanResult(null)}
                      variant="outline"
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Attendance */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Attendance Records</CardTitle>
                <CardDescription>
                  Latest student check-ins and activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attendanceHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <UserRound className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg mb-2">No attendance records</h3>
                      <p className="text-muted-foreground">
                        Scanned attendance will appear here.
                      </p>
                    </div>
                  ) : (
                    attendanceHistory.slice(0, 10).map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-0">
                            <p className="text-sm">
                              {new Date(record.checkInTime).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" }
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(record.checkInTime).toLocaleDateString(
                                "en-US",
                                { weekday: "short" }
                              )}
                            </p>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <UserRound className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {record.studentName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {record.studentNumber} •{" "}
                                {new Date(
                                  record.checkInTime
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <Badge
                            variant={
                              record.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {record.status === "active"
                              ? "Active"
                              : "Completed"}
                          </Badge>
                          {record.duration && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {record.duration}min
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Scan Alert */}
            <ScanAlert
              isVisible={showScanAlert}
              message={scanAlertMessage}
              type={scanAlertType}
              onClose={() => setShowScanAlert(false)}
            />
          </div>
        );
      default:
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg mb-2">Access Restricted</h3>
              <p className="text-muted-foreground">
                You only have access to the Attendance Scanner feature.
              </p>
            </div>
          </div>
        );
    }
  };

  const sidebar = (
    <NavigationSidebar
      role={user.role}
      activeView={activeView}
      onViewChange={setActiveView}
    />
  );

  return (
    <DashboardLayout user={user} sidebar={sidebar} onLogout={onLogout}>
      {renderContent()}
    </DashboardLayout>
  );
}
