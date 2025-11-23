import React from "react";

export default function QRScanner() {
  return <div>QRScanner</div>;
}

// "use client";
// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "./../../../components/ui/card";
// import { Button } from "./../../../components/ui//button";
// import { Badge } from "./../../../components/ui//badge";
// import { Input } from "./../../../components/ui//input";
// import { ScanAlert } from "./../../../components/ui/scan-alert";
// import {
//   QrCode,
//   Camera,
//   CheckCircle,
//   XCircle,
//   UserRound,
//   BookOpen,
//   Calendar,
//   Clock,
//   AlertTriangle,
// } from "lucide-react";
// import { toast } from "sonner";
// import type { User } from "./../../../types/user";

// interface QRScannerProps {
//   user: User;
// }

// export default function QRScanner({ user }: QRScannerProps) {
//   const [isScanning, setIsScanning] = useState(false);
//   const [manualInput, setManualInput] = useState("");
//   const [lastScanResult, setLastScanResult] = useState<any>(null);
//   const [showScanAlert, setShowScanAlert] = useState(false);
//   const [scanAlertMessage, setScanAlertMessage] = useState("");
//   const [scanAlertType, setScanAlertType] = useState<"scan" | "attendance">(
//     "scan"
//   );
//   const [scanHistory, setScanHistory] = useState([
//     {
//       id: "1",
//       type: "checkout",
//       studentName: "Alex Johnson",
//       studentId: "ST001",
//       books: ["Introduction to Computer Science"],
//       timestamp: "2025-08-01 10:30:00",
//       action: "Checkout Completed",
//       status: "success",
//       processedBy: "Sarah Chen",
//     },
//     {
//       id: "3",
//       type: "return",
//       studentName: "David Wilson",
//       studentId: "ST003",
//       books: ["Modern Physics"],
//       timestamp: "2025-08-01 10:00:00",
//       action: "Book Returned",
//       status: "success",
//       processedBy: "Sarah Chen",
//     },
//   ]);

//   const startScanning = () => {
//     setIsScanning(true);
//     // Simulate scanning after 3 seconds
//     setTimeout(() => {
//       // Show immediate scan success message
//       setScanAlertMessage("Scanned Successfully");
//       setScanAlertType("scan");
//       setShowScanAlert(true);

//       // Mock checkout QR data that matches what student generates
//       const mockCheckoutData = {
//         ticketId: `CHK-${Date.now()}-${Math.random()
//           .toString(36)
//           .substr(2, 9)}`,
//         studentId: "ST-001",
//         studentName: "Alex Johnson",
//         books: [
//           {
//             id: "1",
//             title: "Introduction to Computer Science",
//             author: "John Smith",
//             isbn: "978-0-123456-78-9",
//             category: "Computer Science",
//             location: "Section A, Shelf 2",
//           },
//           {
//             id: "3",
//             title: "Modern Physics",
//             author: "Robert Johnson",
//             isbn: "978-0-123456-80-2",
//             category: "Physics",
//             location: "Section B, Shelf 1",
//           },
//         ],
//         checkoutTime: new Date().toISOString(),
//         expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
//         status: "pending",
//       };

//       setLastScanResult(mockCheckoutData);
//       setIsScanning(false);
//     }, 3000);
//   };

//   const stopScanning = () => {
//     setIsScanning(false);
//   };

//   const processManualInput = () => {
//     if (!manualInput.trim()) {
//       toast.error("Please enter a ticket ID");
//       return;
//     }

//     try {
//       // Try to parse as JSON first (for full checkout data)
//       let parsedData;
//       if (manualInput.startsWith("{")) {
//         parsedData = JSON.parse(manualInput);
//       } else {
//         // Treat as ticket ID
//         parsedData = {
//           ticketId: manualInput,
//           studentId: "ST-MANUAL",
//           studentName: "Manual Entry Student",
//           books: [{ title: "Manual Entry Book", author: "Unknown" }],
//           checkoutTime: new Date().toISOString(),
//           status: "pending",
//         };
//       }

//       setLastScanResult(parsedData);
//       setManualInput("");
//       setScanAlertMessage("Scanned Successfully");
//       setScanAlertType("scan");
//       setShowScanAlert(true);
//     } catch (error) {
//       toast.error("Invalid ticket format");
//     }
//   };

//   const processCheckout = () => {
//     if (!lastScanResult) return;

//     // Check if ticket is expired
//     if (lastScanResult.expiresAt) {
//       const expiryTime = new Date(lastScanResult.expiresAt);
//       if (new Date() > expiryTime) {
//         toast.error(
//           "This checkout ticket has expired. Student needs to generate a new one."
//         );
//         return;
//       }
//     }

//     const newScan = {
//       id: Date.now().toString(),
//       type: "checkout",
//       studentName: lastScanResult.studentName,
//       studentId: lastScanResult.studentId,
//       books: lastScanResult.books.map((book: any) => book.title),
//       timestamp: new Date().toLocaleString(),
//       action: "Checkout Completed",
//       status: "success",
//       processedBy: user.name,
//     };

//     setScanHistory([newScan, ...scanHistory]);
//     setLastScanResult(null);
//     toast.success(
//       `Checkout completed! ${lastScanResult.books.length} book(s) borrowed by ${lastScanResult.studentName}`
//     );
//   };

//   const processBorrow = () => {
//     if (!lastScanResult) return;

//     const newScan = {
//       id: Date.now().toString(),
//       type: "borrow",
//       studentName: lastScanResult.studentName,
//       studentId: lastScanResult.studentId,
//       books: lastScanResult.books?.map((book: any) => book.title) || [
//         "Sample Book Title",
//       ],
//       timestamp: new Date().toLocaleString(),
//       action: "Book Borrowed",
//       status: "success",
//       processedBy: user.name,
//     };

//     setScanHistory([newScan, ...scanHistory]);
//     setLastScanResult(null);
//     toast.success("Book borrowing processed successfully!");
//   };

//   const processReturn = () => {
//     if (!lastScanResult) return;

//     const newScan = {
//       id: Date.now().toString(),
//       type: "return",
//       studentName: lastScanResult.studentName,
//       studentId: lastScanResult.studentId,
//       books: lastScanResult.books?.map((book: any) => book.title) || [
//         "Sample Book Title",
//       ],
//       timestamp: new Date().toLocaleString(),
//       action: "Book Returned",
//       status: "success",
//       processedBy: user.name,
//     };

//     setScanHistory([newScan, ...scanHistory]);
//     setLastScanResult(null);
//     toast.success("Book return processed successfully!");
//   };

//   const processAttendance = () => {
//     if (!lastScanResult) return;

//     // Don't add attendance records to scan history since we're removing Library Check-in remarks
//     setLastScanResult(null);
//     setScanAlertMessage("Attendance Recorded");
//     setScanAlertType("attendance");
//     setShowScanAlert(true);
//   };

//   const getActionColor = (type: string, status: string) => {
//     if (status !== "success") return "destructive";

//     switch (type) {
//       case "checkout":
//         return "default";
//       case "borrow":
//         return "default";
//       case "return":
//         return "secondary";
//       case "attendance":
//         return "outline";
//       default:
//         return "default";
//     }
//   };

//   const isTicketExpired = (expiresAt?: string) => {
//     if (!expiresAt) return false;
//     return new Date() > new Date(expiresAt);
//   };

//   const getTimeRemaining = (expiresAt?: string) => {
//     if (!expiresAt) return null;
//     const remaining = new Date(expiresAt).getTime() - new Date().getTime();
//     if (remaining <= 0) return "Expired";
//     const minutes = Math.floor(remaining / (1000 * 60));
//     return `${minutes} min remaining`;
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div>
//         <h1 className="text-2xl mb-2 flex items-center gap-2">
//           <QrCode className="h-6 w-6" />
//           QR Code Scanner
//         </h1>
//         <p className="text-muted-foreground">
//           Scan student QR tickets for borrowing, returns, and attendance.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Scanner Interface */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Scanner</CardTitle>
//             <CardDescription>
//               Scan QR codes or enter ticket IDs manually
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {/* Camera View */}
//             <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative">
//               {isScanning ? (
//                 <div className="text-center">
//                   <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
//                   <p className="text-sm text-muted-foreground">
//                     Scanning for QR codes...
//                   </p>
//                   <div className="absolute inset-4 border-2 border-blue-500 border-dashed rounded-lg animate-pulse"></div>
//                 </div>
//               ) : (
//                 <div className="text-center">
//                   <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                   <p className="text-sm text-muted-foreground">
//                     Click "Start Scanning" to begin
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Scanner Controls */}
//             <div className="flex gap-2">
//               {!isScanning ? (
//                 <Button onClick={startScanning} className="flex-1">
//                   <Camera className="h-4 w-4 mr-2" />
//                   Start Scanning
//                 </Button>
//               ) : (
//                 <Button
//                   onClick={stopScanning}
//                   variant="outline"
//                   className="flex-1"
//                 >
//                   Stop Scanning
//                 </Button>
//               )}
//             </div>

//             {/* Manual Input */}
//             <div className="space-y-2">
//               <label className="text-sm">Manual Ticket Entry</label>
//               <div className="flex gap-2">
//                 <Input
//                   placeholder="Enter ticket ID or JSON data"
//                   value={manualInput}
//                   onChange={(e) => setManualInput(e.target.value)}
//                 />
//                 <Button onClick={processManualInput} variant="outline">
//                   Verify
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Scan Result */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Scan Result</CardTitle>
//             <CardDescription>
//               Student information and available actions
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {lastScanResult ? (
//               <div className="space-y-4">
//                 {/* Status Banner */}
//                 {isTicketExpired(lastScanResult.expiresAt) ? (
//                   <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
//                     <AlertTriangle className="h-5 w-5 text-red-600" />
//                     <span className="text-red-800">
//                       Expired checkout ticket
//                     </span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
//                     <CheckCircle className="h-5 w-5 text-green-600" />
//                     <span className="text-green-800">Valid ticket scanned</span>
//                   </div>
//                 )}

//                 <div className="space-y-3">
//                   <div className="flex items-center gap-2">
//                     <UserRound className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <p className="text-sm">{lastScanResult.studentName}</p>
//                       <p className="text-xs text-muted-foreground">
//                         ID: {lastScanResult.studentId}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="text-xs text-muted-foreground">
//                     <p>
//                       Ticket ID: {lastScanResult.ticketId || lastScanResult.id}
//                     </p>
//                     <p>
//                       Generated:{" "}
//                       {new Date(
//                         lastScanResult.checkoutTime || lastScanResult.timestamp
//                       ).toLocaleString()}
//                     </p>
//                     {lastScanResult.expiresAt && (
//                       <div className="flex items-center gap-1">
//                         <Clock className="h-3 w-3" />
//                         <span>
//                           {getTimeRemaining(lastScanResult.expiresAt)}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Books List for checkout tickets */}
//                 {lastScanResult.books && lastScanResult.books.length > 0 && (
//                   <div className="space-y-2">
//                     <h4 className="text-sm">
//                       Books ({lastScanResult.books.length}):
//                     </h4>
//                     <div className="max-h-24 overflow-y-auto space-y-1">
//                       {lastScanResult.books.map((book: any, index: number) => (
//                         <div
//                           key={index}
//                           className="text-xs text-muted-foreground"
//                         >
//                           {index + 1}. {book.title || book}{" "}
//                           {book.author ? `by ${book.author}` : ""}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <div className="space-y-2">
//                   <h4 className="text-sm">Available Actions:</h4>
//                   <div className="grid grid-cols-1 gap-2">
//                     {lastScanResult.books && lastScanResult.books.length > 0 ? (
//                       <Button
//                         onClick={processCheckout}
//                         disabled={isTicketExpired(lastScanResult.expiresAt)}
//                         size="sm"
//                         className="justify-start gap-2"
//                       >
//                         <BookOpen className="h-4 w-4" />
//                         Complete Checkout ({lastScanResult.books.length} books)
//                       </Button>
//                     ) : (
//                       <Button
//                         onClick={processBorrow}
//                         size="sm"
//                         className="justify-start gap-2"
//                       >
//                         <BookOpen className="h-4 w-4" />
//                         Process Book Borrowing
//                       </Button>
//                     )}
//                     <Button
//                       onClick={processReturn}
//                       size="sm"
//                       variant="outline"
//                       className="justify-start gap-2"
//                     >
//                       <BookOpen className="h-4 w-4" />
//                       Process Book Return
//                     </Button>
//                     <Button
//                       onClick={processAttendance}
//                       size="sm"
//                       variant="outline"
//                       className="justify-start gap-2"
//                     >
//                       <Calendar className="h-4 w-4" />
//                       Record Attendance
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                 <p className="text-muted-foreground">No ticket scanned yet</p>
//                 <p className="text-sm text-muted-foreground">
//                   Scan a QR code or enter ticket ID manually
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Scan History */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Scan History</CardTitle>
//           <CardDescription>
//             Recent QR code scans and transactions
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             {scanHistory.map((scan) => (
//               <div
//                 key={scan.id}
//                 className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
//               >
//                 <div className="flex items-center gap-3 flex-1 min-w-0">
//                   <div className="min-w-0 flex-1">
//                     <p className="text-sm truncate">
//                       {scan.studentName} ({scan.studentId})
//                     </p>
//                     {scan.books.length > 0 && (
//                       <p className="text-xs text-muted-foreground truncate">
//                         {scan.books.length} book(s): {scan.books.join(", ")}
//                       </p>
//                     )}
//                     <p className="text-xs text-muted-foreground">
//                       Processed by: {scan.processedBy}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <Badge variant={getActionColor(scan.type, scan.status)}>
//                     {scan.action}
//                   </Badge>
//                   <span className="text-xs text-muted-foreground">
//                     {scan.timestamp}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Scan Alert */}
//       <ScanAlert
//         isVisible={showScanAlert}
//         message={scanAlertMessage}
//         type={scanAlertType}
//         onClose={() => setShowScanAlert(false)}
//       />
//     </div>
//   );
// }
