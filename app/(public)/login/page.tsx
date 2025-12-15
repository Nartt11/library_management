"use client";
import React, { use, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import Image from "next/image";
import { Footer } from "../../../components/Footer";
import { ArrowLeft } from "lucide-react";
import type { User, UserRole } from "@/types/user";
import uitLogo from "./../../../public/UITLogo.jpg";
import { useRouter } from "next/navigation";

import { loginService, requestPasswordReset, resetPassword } from "@/services/auth/authService";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

interface LoginPageProps {
  onLogin: (user: User) => void;
  onBackToShowroom?: () => void;
}

type ForgotPasswordStep = "email" | "code" | "newPassword";

export default function LoginPage({}: LoginPageProps) {
  const [loginField, setLoginField] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] =
    useState<ForgotPasswordStep>("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const router = useRouter();
  const { saveUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await loginService(loginField, password);
      if (response?.user) {
        // Save user to context
        saveUser(response.user);
        toast.success("Login success");

        // Redirect based on role
        const role = response.user.role;
        if (role === "admin") {
          router.push("/admin/dashboard");
        } else if (role === "staff") {
          router.push("/staff/dashboard");
        } else {
          router.push("/student/dashboard");
        }
      } else {
        alert("Invalid login response");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error?.message || "Invalid username or password");
    }
  };

  const handleBackToShowroom = () => {
    router.push("/");
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (forgotPasswordStep === "email") {
        // Request password reset
        await requestPasswordReset(forgotEmail);
        toast.success("Verification code sent to your email");
        setForgotPasswordStep("code");
      } else if (forgotPasswordStep === "code") {
        // Just validate that code is entered, actual verification happens on reset
        if (!verificationCode) {
          toast.error("Please enter the verification code");
          return;
        }
        setForgotPasswordStep("newPassword");
      } else if (forgotPasswordStep === "newPassword") {
        // Reset password with token
        const token = parseInt(verificationCode);
        if (isNaN(token)) {
          toast.error("Invalid verification code format");
          return;
        }
        
        await resetPassword(forgotEmail, token, newPassword);
        toast.success("Password changed successfully");
        
        // Reset states and go back to login
        setShowForgotPassword(false);
        setForgotPasswordStep("email");
        setForgotEmail("");
        setVerificationCode("");
        setNewPassword("");
      }
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error?.message || "Failed to process password reset");
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep("email");
    setForgotEmail("");
    setVerificationCode("");
    setNewPassword("");
  };

  const getForgotPasswordStepTitle = () => {
    switch (forgotPasswordStep) {
      case "email":
        return "Reset Password";
      case "code":
        return "Enter Verification Code";
      case "newPassword":
        return "Set New Password";
      default:
        return "Reset Password";
    }
  };

  const getForgotPasswordStepDescription = () => {
    switch (forgotPasswordStep) {
      case "email":
        return "Enter your email address to receive a verification code";
      case "code":
        return "Enter the verification code sent to your email";
      case "newPassword":
        return "Enter your new password";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-green-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        {!showForgotPassword && (
          <Button
            variant="outline"
            onClick={handleBackToShowroom}
            className="absolute top-4 left-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Collection
          </Button>
        )}

        <Card className="w-full max-w-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Image
                src={uitLogo}
                alt="University of Caloocan City Logo"
                className="h-40 w-80 object-contain"
              />
            </div>
            <CardTitle className="text-2xl">
              {showForgotPassword
                ? getForgotPasswordStepTitle()
                : "Library Management System"}
            </CardTitle>
            <CardDescription>
              {showForgotPassword
                ? getForgotPasswordStepDescription()
                : "Sign in to access your dashboard"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!showForgotPassword ? (
              // Login Form
              <>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loginField">Email</Label>
                    <Input
                      id="loginField"
                      type="text"
                      placeholder="Enter your email"
                      value={loginField}
                      onChange={(e) => setLoginField(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <Button
                    variant="link"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Forgot Password?
                  </Button>
                </div>
                <div className="mt-2 text-center">
                  Don't have an account?
                  <Button
                    variant="link"
                    onClick={() => router.push("/register")}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Register
                  </Button>
                </div>
              </>
            ) : (
              // Forgot Password Form
              <>
                <form
                  onSubmit={handleForgotPasswordSubmit}
                  className="space-y-4"
                >
                  {forgotPasswordStep === "email" && (
                    <div className="space-y-2">
                      <Label htmlFor="forgotEmail">Email Address</Label>
                      <Input
                        id="forgotEmail"
                        type="email"
                        placeholder="Enter your email address"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {forgotPasswordStep === "code" && (
                    <div className="space-y-2">
                      <Label htmlFor="verificationCode">
                        Verification Code
                      </Label>
                      <Input
                        id="verificationCode"
                        type="text"
                        placeholder="Enter the verification code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                      />
                      <div className="text-xs text-muted-foreground">
                        Check your email for the verification code
                      </div>
                    </div>
                  )}

                  {forgotPasswordStep === "newPassword" && (
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">
                        Enter your new password
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <Button type="submit" className="w-full">
                    {forgotPasswordStep === "email" && "Send Verification Code"}
                    {forgotPasswordStep === "code" && "Verify Code"}
                    {forgotPasswordStep === "newPassword" && "Update Password"}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <Button
                    variant="link"
                    onClick={handleBackToLogin}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Back to Login
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
