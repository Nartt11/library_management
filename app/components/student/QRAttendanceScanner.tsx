import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ScanAlert } from "../ui/scan-alert";
import {
  QrCode,
  Camera,
  CheckCircle,
  Clock,
  UserRound,
  MapPin,
} from "lucide-react";

// import { toast } from 'sonner@2.0.3';
import type { User } from "../../page";

interface QRAttendanceScannerProps {
  user: User;
}

export function QRAttendanceScanner({ user }: QRAttendanceScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [showAttendanceQR, setShowAttendanceQR] = useState(false);
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [showScanAlert, setShowScanAlert] = useState(false);
  const [scanAlertMessage, setScanAlertMessage] = useState("");
  const [scanAlertType, setScanAlertType] = useState<"scan" | "attendance">(
    "scan"
  );

  // Check if user is currently signed in
  const isSignedIn = currentSession !== null;

  const simulateLibrarianScan = () => {
    if (!attendanceData) return;

    const now = new Date();

    if (attendanceData.action === "check-in") {
      // Sign in
      const newSession = {
        id: Date.now().toString(),
        studentId: user.id,
        studentName: user.name,
        checkInTime: now.toISOString(),
        checkInTimestamp: now.toLocaleString(),
        status: "active",
      };

      setCurrentSession(newSession);
      setScanAlertMessage("Attendance Recorded");
      setScanAlertType("attendance");
      setShowScanAlert(true);
    } else {
      // Sign out
      if (currentSession) {
        const duration = Math.floor(
          (now.getTime() - new Date(currentSession.checkInTime).getTime()) /
            (1000 * 60)
        );
        setScanAlertMessage("Attendance Recorded");
        setScanAlertType("attendance");
        setShowScanAlert(true);
        setCurrentSession(null);
      }
    }

    setShowAttendanceQR(false);
    setAttendanceData(null);
  };

  const generateQRCode = (data: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      data
    )}`;
  };

  const startScanning = () => {
    setIsScanning(true);
    // Simulate finding student's own QR code after 3 seconds
    setTimeout(() => {
      // Show immediate scan success message for attendance
      setScanAlertMessage("Scanned Successfully");
      setScanAlertType("scan");
      setShowScanAlert(true);

      const mockStudentQR = {
        type: "student_attendance",
        studentId: user.id,
        studentName: user.name,
        studentNumber: "ST-001",
        timestamp: new Date().toISOString(),
        action: isSignedIn ? "check-out" : "check-in",
      };

      setAttendanceData(mockStudentQR);
      setIsScanning(false);
      setShowAttendanceQR(true);
    }, 3000);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2 flex items-center gap-2">
          <QrCode className="h-6 w-6" />
          Attendance QR Scanner
        </h1>
        <p className="text-muted-foreground">
          Scan QR codes for library attendance tracking.
        </p>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSignedIn ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-green-800">
                    Currently signed in to library
                  </p>
                  <p className="text-sm text-green-700">
                    Since:{" "}
                    {new Date(currentSession.checkInTime).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="w-fit">
                  Active Session
                </Badge>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <Clock className="h-5 w-5 text-gray-600" />
                <p className="text-gray-800">Not currently signed in</p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="w-fit">
                  No Active Session
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scan QR Code */}
      <Card>
        <CardHeader>
          <CardTitle>QR Code Scanner</CardTitle>
          <CardDescription>
            Scan your student QR code for library{" "}
            {isSignedIn ? "check-out" : "check-in"}
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
                Start Scanning for {isSignedIn ? "Check-Out" : "Check-In"}
              </Button>
            ) : (
              <Button onClick={stopScanning} variant="outline">
                Stop Scanning
              </Button>
            )}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Place your student QR code in front of the camera to scan</p>
            <p className="mt-1">
              For manual attendance entry, use the My Attendance section
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Attendance QR Modal */}
      <Dialog open={showAttendanceQR} onOpenChange={setShowAttendanceQR}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-green-600" />
              QR Code Detected
            </DialogTitle>
            <DialogDescription>
              Confirm your {attendanceData?.action} attendance.
            </DialogDescription>
          </DialogHeader>

          {attendanceData && (
            <div className="space-y-6">
              {/* QR Code Display */}
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  <img
                    src={generateQRCode(JSON.stringify(attendanceData))}
                    alt="Detected QR Code"
                    className="w-32 h-32"
                  />
                </div>
              </div>

              {/* Attendance Details */}
              <div className="space-y-3">
                <div className="bg-muted/50 p-3 rounded-lg text-center">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Student Name:</span>
                    <p className="font-medium">{attendanceData.studentName}</p>
                  </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg text-center">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Student ID:</span>
                    <p className="font-mono">{attendanceData.studentNumber}</p>
                  </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg text-center">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Action:</span>
                    <div className="mt-1 flex justify-center">
                      <Badge
                        variant={
                          attendanceData.action === "check-in"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {attendanceData.action === "check-in"
                          ? "Check In"
                          : "Check Out"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-sm text-blue-700">
                    <Clock className="h-4 w-4" />
                    <span className="text-center">
                      Scanned:{" "}
                      {new Date(attendanceData.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={simulateLibrarianScan}
                  className="flex-1 gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Confirm{" "}
                  {attendanceData.action === "check-in"
                    ? "Check In"
                    : "Check Out"}
                </Button>
                <Button
                  onClick={() => setShowAttendanceQR(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Scan Alert */}
      <ScanAlert
        isVisible={showScanAlert}
        message={scanAlertMessage}
        type={scanAlertType}
        onClose={() => setShowScanAlert(false)}
      />
    </div>
  );
}
