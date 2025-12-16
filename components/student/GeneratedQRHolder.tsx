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
  Archive,
  Download,
  Eye,
  Trash2,
  QrCode,
  RefreshCw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "sonner";
// import type { User } from "../../../types/user";
import type { User } from "../../types/user";

interface GeneratedQRHolderProps {
  user: User;
}

interface QRRecord {
  id: string;
  type: "borrowing" | "attendance" | "general";
  generatedDate: string;
  status: "active" | "used" | "expired";
  purpose: string;
  data: string;
}

export function GeneratedQRHolder({ user }: GeneratedQRHolderProps) {
  const [selectedQR, setSelectedQR] = useState<QRRecord | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const [qrRecords, setQrRecords] = useState<QRRecord[]>([
    {
      id: "QR001",
      type: "borrowing",
      generatedDate: "2025-08-01",
      status: "used",
      purpose: "Book borrowing session",
      data: JSON.stringify({
        studentId: user.id,
        purpose: "borrowing",
        timestamp: "2025-08-01T10:30:00Z",
      }),
    },
    {
      id: "QR002",
      type: "attendance",
      generatedDate: "2025-08-02",
      status: "active",
      purpose: "Library check-in",
      data: JSON.stringify({
        studentId: user.id,
        purpose: "attendance",
        timestamp: "2025-08-02T14:15:00Z",
      }),
    },
    {
      id: "QR003",
      type: "general",
      generatedDate: "2025-07-30",
      status: "expired",
      purpose: "General library access",
      data: JSON.stringify({
        studentId: user.id,
        purpose: "general",
        timestamp: "2025-07-30T09:00:00Z",
      }),
    },
  ]);

  const generateQRCode = (data: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      data
    )}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "used":
        return "secondary";
      case "expired":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "borrowing":
        return "bg-orange-50 border-orange-200 text-orange-700";
      case "attendance":
        return "bg-green-50 border-green-200 text-green-700";
      case "general":
        return "bg-blue-50 border-blue-200 text-blue-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const viewQR = (qr: QRRecord) => {
    setSelectedQR(qr);
    setShowViewDialog(true);
  };

  const downloadQR = (qr: QRRecord) => {
    const element = document.createElement("a");
    const file = new Blob([qr.data], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `qr-${qr.id}-${qr.type}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("QR code data downloaded successfully");
  };

  const deleteQR = (id: string) => {
    setQrRecords((prev) => prev.filter((qr) => qr.id !== id));
    toast.success("QR record deleted successfully");
  };

  const refreshQR = (id: string) => {
    setQrRecords((prev) =>
      prev.map((qr) =>
        qr.id === id
          ? {
              ...qr,
              status: "active" as const,
              generatedDate: new Date().toISOString().split("T")[0],
              data: JSON.stringify({
                studentId: user.id,
                purpose: qr.type,
                timestamp: new Date().toISOString(),
              }),
            }
          : qr
      )
    );
    toast.success("QR code refreshed successfully");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2 flex items-center gap-2">
          <Archive className="h-6 w-6" />
          Generated QR Holder
        </h1>
        <p className="text-muted-foreground">
          Manage and view your previously generated QR codes.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <QrCode className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Active QRs</span>
            </div>
            <p className="text-2xl">
              {qrRecords.filter((qr) => qr.status === "active").length}
            </p>
            <p className="text-xs text-muted-foreground">Ready to use</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Archive className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">
                Total Generated
              </span>
            </div>
            <p className="text-2xl">{qrRecords.length}</p>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <RefreshCw className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-muted-foreground">Used QRs</span>
            </div>
            <p className="text-2xl">
              {qrRecords.filter((qr) => qr.status === "used").length}
            </p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* QR Records */}
      <Card>
        <CardHeader>
          <CardTitle>Your QR Codes</CardTitle>
          <CardDescription>
            Previously generated QR codes for library services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {qrRecords.length === 0 ? (
              <div className="text-center py-8">
                <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg mb-2">No QR codes generated</h3>
                <p className="text-muted-foreground">
                  Your generated QR codes will appear here.
                </p>
              </div>
            ) : (
              qrRecords.map((qr) => (
                <div key={qr.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={getStatusColor(qr.status)}>
                          {qr.status.toUpperCase()}
                        </Badge>
                        <div
                          className={`px-2 py-1 rounded-md border ${getTypeColor(
                            qr.type
                          )}`}
                        >
                          <span className="text-xs capitalize">{qr.type}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ID: {qr.id}
                        </span>
                      </div>
                      <h4 className="text-sm mb-1">{qr.purpose}</h4>
                      <p className="text-xs text-muted-foreground">
                        Generated:{" "}
                        {new Date(qr.generatedDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewQR(qr)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadQR(qr)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {qr.status === "expired" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => refreshQR(qr.id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteQR(qr.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* View QR Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code: {selectedQR?.id}
            </DialogTitle>
            <DialogDescription>
              View and download your QR code
            </DialogDescription>
          </DialogHeader>

          {selectedQR && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 flex justify-center">
                <img
                  src={generateQRCode(selectedQR.data)}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <Badge variant="outline">{selectedQR.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Purpose:
                  </span>
                  <span className="text-sm">{selectedQR.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant={getStatusColor(selectedQR.status)}>
                    {selectedQR.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Generated:
                  </span>
                  <span className="text-sm">
                    {new Date(selectedQR.generatedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => downloadQR(selectedQR)}
                  className="flex-1 gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  onClick={() => setShowViewDialog(false)}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
