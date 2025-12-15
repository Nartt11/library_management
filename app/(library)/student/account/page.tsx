"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Badge } from "../../../../components/ui/badge";
import { Separator } from "../../../../components/ui/separator";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import {
  User,
  Mail,
  Calendar,
  CreditCard,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  QrCode,
} from "lucide-react";
import { toast } from "sonner";
import type { User as UserType } from "../../../../types/user";
import { useAuth } from "@/context/authContext";
import { getUserFromToken } from "@/services/auth/authService";

export default function ManageAccount() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordForm.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (!passwordForm.newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    // In a real app, this would call an API
    toast.success("Password changed successfully!");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "librarian":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "student":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Generate QR code URL using barcode service pattern for student ID
  const generateStudentQRCode = (userId: string) => {
    const studentData = `STUDENT-${userId}`;
    // Using same pattern as barcode.ts but for students
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(studentData)}`;
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl mb-2 flex items-center gap-2">
          <User className="h-6 w-6" />
          Manage My Account
        </h1>
        <p className="text-muted-foreground">
          View and manage your account information and settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Your basic account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {getInitials(currentUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{currentUser.name}</h3>
                  <p className="text-muted-foreground">{currentUser.email}</p>
                  <Badge className={`mt-2 ${getRoleColor(currentUser.role)}`}>
                    {currentUser.role.charAt(0).toUpperCase() +
                      currentUser.role.slice(1)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </Label>
                  <p className="mt-1">{currentUser.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Email Address
                  </Label>
                  <p className="mt-1">{currentUser.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Role
                  </Label>
                  <p className="mt-1">
                    {currentUser.role.charAt(0).toUpperCase() +
                      currentUser.role.slice(1)}
                  </p>
                </div>
                {currentUser.studentNumber && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Student Number
                    </Label>
                    <p className="mt-1">{currentUser.studentNumber}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your account password for security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password *</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Enter your current password"
                      className="pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password *</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Enter new password (min. 6 characters)"
                      className="pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm New Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm your new password"
                      className="pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Account Summary & QR Code */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Student ID QR Code
              </CardTitle>
              <CardDescription>
                Your unique student identification QR code
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-gray-100 inline-block">
                <img
                  src={generateStudentQRCode(currentUser.id)}
                  alt="Student ID QR Code"
                  className="w-32 h-32"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Use this QR code for library services and attendance
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Account Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium">{currentUser.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentUser?.role.charAt(0).toUpperCase() +
                    currentUser.role.slice(1)}{" "}
                  Account
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Account Status</span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Member Since</span>
                  <span>Jan 2024</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Login</span>
                  <span>Today</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Password Protected</p>
                  <p className="text-xs text-muted-foreground">
                    Account secured with password
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email Verified</p>
                  <p className="text-xs text-muted-foreground">
                    Account email is verified
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
