"use client";
import React, { useEffect, useState } from "react";
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
  Edit,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { User as UserType } from "../../../../types/user";
import { useAuth } from "@/context/authContext";
import { getMyProfile, updateMyProfile } from "@/services/profile";

export default function ManageAccount() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { currentUser, saveUser } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    imageUrl: "",
    joinDate: "",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!currentUser) return;
      try {
        const data = await getMyProfile();
        if (!mounted) return;
        setProfileForm({
          fullName: data?.fullName ?? (currentUser as any).fullName ?? currentUser.name ?? "",
          email: data?.email ?? currentUser.email ?? "",
          phoneNumber: data?.phoneNumber ?? (currentUser as any).phoneNumber ?? "",
          address: data?.address ?? (currentUser as any).address ?? "",
          imageUrl: data?.imageUrl ?? (currentUser as any).imageUrl ?? "",
          joinDate: data?.joinDate ?? (currentUser as any).joinDate ?? "",
        });
      } catch (err) {
        if (!mounted) return;
        setProfileForm({
          fullName: (currentUser as any).fullName ?? currentUser.name ?? "",
          email: currentUser.email ?? "",
          phoneNumber: (currentUser as any).phoneNumber ?? "",
          address: (currentUser as any).address ?? "",
          imageUrl: (currentUser as any).imageUrl ?? "",
          joinDate: (currentUser as any).joinDate ?? "",
        });
      }
    })();
    return () => {
      mounted = false;
    };
  }, [currentUser]);

  const displayName = profileForm.fullName || currentUser?.fullName || currentUser?.name || "";

  if (!currentUser) {
    return <div> Loading...</div>;
  }

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

    // Call change-password API
    (async () => {
      try {
        const res = await fetch('/api/profile/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ oldPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.message || 'Failed to change password');
        }

        toast.success('Password changed successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } catch (err: any) {
        toast.error(err?.message || 'Failed to change password');
      }
    })();
  };

  const handleProfileSave = async () => {
    try {
      // Send values as-is; backend will keep existing if empty string sent
      await updateMyProfile({
        fullName: profileForm.fullName || "",
        email: profileForm.email || "",
        phoneNumber: profileForm.phoneNumber || "",
        address: profileForm.address || "",
        imageUrl: profileForm.imageUrl || "",
      });

      toast.success('Profile updated successfully');
      const updatedUser = {
        ...(currentUser as any),
        fullName: profileForm.fullName || currentUser.name,
        email: profileForm.email || currentUser.email,
        phoneNumber: profileForm.phoneNumber,
        address: profileForm.address,
        imageUrl: profileForm.imageUrl,
      };
      try { saveUser?.(updatedUser as any); } catch (_) {}
      setIsEditingProfile(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update profile');
    }
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {profileForm.imageUrl ? (
                      <img src={profileForm.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <AvatarFallback className="text-lg">
                        {getInitials(displayName)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">{displayName}</h3>
                    <p className="text-muted-foreground">{profileForm.email}</p>
                    <Badge className={`mt-2 ${getRoleColor(currentUser.role)}`}>
                      {currentUser.role.charAt(0).toUpperCase() +
                        currentUser.role.slice(1)}
                    </Badge>
                  </div>
                </div>
                {!isEditingProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>

              <Separator />

              {isEditingProfile ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileForm.fullName}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, fullName: e.target.value })
                      }
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, email: e.target.value })
                      }
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={profileForm.phoneNumber}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, phoneNumber: e.target.value })
                      }
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profileForm.address}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, address: e.target.value })
                      }
                      placeholder="Enter your address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Profile Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={profileForm.imageUrl}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, imageUrl: e.target.value })
                      }
                      placeholder="Enter image URL or leave empty"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleProfileSave} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </Label>
                    <p className="mt-1">{displayName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </Label>
                    <p className="mt-1">{profileForm.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Phone Number
                    </Label>
                    <p className="mt-1">{profileForm.phoneNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Address
                    </Label>
                    <p className="mt-1">{profileForm.address || "Not provided"}</p>
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
              )}
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

        {/* Account Summary */}
        <div className="space-y-6">
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
                <h3 className="font-medium">{displayName}</h3>
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
