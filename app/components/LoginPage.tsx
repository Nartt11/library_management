import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Footer } from "./Footer";
import { ArrowLeft } from "lucide-react";
import type { User, UserRole } from "../page";
import uccLogo from "../../public/window.svg";

interface LoginPageProps {
  onLogin: (user: User) => void;
  onBackToShowroom?: () => void;
}

type ForgotPasswordStep = "email" | "code" | "newPassword";

export function LoginPage({ onLogin, onBackToShowroom }: LoginPageProps) {
  const [loginField, setLoginField] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] =
    useState<ForgotPasswordStep>("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate credentials and determine role automatically
    let user: User | null = null;

    // Check student credentials
    if (loginField === "123" && password === "123") {
      user = {
        id: "4",
        name: "Alex Johnson",
        email: "alex.johnson@student.university.edu",
        studentNumber: "123",
        role: "student" as UserRole,
      };
    }
    // Check librarian credentials
    else if (loginField === "librarian" && password === "123") {
      user = {
        id: "3",
        name: "Sarah Chen",
        email: "sarah.chen@university.edu",
        role: "librarian" as UserRole,
      };
    }
    // Check admin credentials
    else if (loginField === "admin" && password === "123") {
      user = {
        id: "2",
        name: "John Anderson",
        email: "john.anderson@university.edu",
        role: "admin" as UserRole,
      };
    }
    // Check scanner credentials
    else if (loginField === "scanner" && password === "123") {
      user = {
        id: "5",
        name: "Scanner",
        email: "scanner@university.edu",
        role: "scanner" as UserRole,
      };
    }

    if (user) {
      onLogin(user);
    } else {
      alert(
        "Invalid credentials. Please check your username/student number and password."
      );
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (forgotPasswordStep === "email") {
      // Move to code verification step
      setForgotPasswordStep("code");
    } else if (forgotPasswordStep === "code") {
      // Check if code is correct (mock validation - accept "123456")
      if (verificationCode === "123456") {
        setForgotPasswordStep("newPassword");
      } else {
        alert("Invalid verification code. Please try again.");
      }
    } else if (forgotPasswordStep === "newPassword") {
      // Password changed successfully
      alert("Successful change");
      // Reset states and go back to login
      setShowForgotPassword(false);
      setForgotPasswordStep("email");
      setForgotEmail("");
      setVerificationCode("");
      setNewPassword("");
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        {onBackToShowroom && !showForgotPassword && (
          <Button
            variant="outline"
            onClick={onBackToShowroom}
            className="absolute top-4 left-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Collection
          </Button>
        )}

        <Card className="w-full max-w-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <ImageWithFallback
                src={uccLogo}
                alt="University of Caloocan City Logo"
                className="h-20 w-20 object-contain"
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
                    <Label htmlFor="loginField">
                      Username / Student Number
                    </Label>
                    <Input
                      id="loginField"
                      type="text"
                      placeholder="Enter your username or student number"
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

                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p>Demo credentials:</p>
                  <div className="mt-2 text-xs space-y-1">
                    <p>Student: 123 / 123</p>
                    <p>Librarian: librarian / 123</p>
                    <p>Admin: admin / 123</p>
                    <p>Scanner: scanner / 123</p>
                  </div>
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
                        Demo code: 123456
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
