import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { User } from "../types/user";

interface PasswordConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  actionName?: string;
  currentUser?: User;
  userRole?: "admin" | "librarian";
}

export function PasswordConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionName = "Proceed",
  currentUser,
  userRole = "admin",
}: PasswordConfirmationProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Function to get the correct password for each user based on their role and identity
  const getCorrectPassword = (user?: User): string => {
    if (!user) {
      return userRole === "admin" ? "123" : "123";
    }

    // Based on the LoginPage component, all users use "123" as their password
    // This is a demo system - in production, each user would have unique passwords
    return "123";
  };

  const handleConfirm = async () => {
    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);

    const correctPassword = getCorrectPassword(currentUser);

    if (password === correctPassword) {
      onConfirm();
      handleClose();
      toast.success("Password confirmed. Action authorized.");
    } else {
      toast.error("Incorrect password. Please try again.");
      setPassword("");
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    setPassword("");
    setIsLoading(false);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleConfirm();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg">{title}</AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-left">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 shrink-0" />
            <div className="text-sm text-orange-800 dark:text-orange-200">
              <div className="font-medium mb-1">
                Security Verification Required
              </div>
              <div>Please enter your password to authorize this action.</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Your Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your password"
              className="w-full"
              disabled={isLoading}
              autoFocus
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading || !password.trim()}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isLoading ? "Verifying..." : actionName}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
