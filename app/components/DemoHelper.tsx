import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  HelpCircle,
  Play,
  BookOpen,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

interface DemoHelperProps {
  userRole: string;
}

export function DemoHelper({ userRole }: DemoHelperProps) {
  const [showGuide, setShowGuide] = useState(false);

  const getDemoGuide = () => {
    switch (userRole) {
      case "student":
        return {
          title: "Student Demo Guide",
          features: [
            {
              icon: BookOpen,
              title: "Browse Books",
              description: "Search and filter the book catalog",
            },
            {
              icon: Play,
              title: "Add to Cart",
              description: "Select books and add them to your cart",
            },
            {
              icon: Play,
              title: "Generate QR",
              description: "Create QR codes for book checkout",
            },
            {
              icon: BarChart3,
              title: "Track Attendance",
              description: "Use QR scanner for library check-in/out",
            },
          ],
        };
      case "librarian":
        return {
          title: "Librarian Demo Guide",
          features: [
            {
              icon: Play,
              title: "Scan QR Codes",
              description: "Process student checkout tickets",
            },
            {
              icon: BookOpen,
              title: "Manage Books",
              description: "Add, edit, and track book inventory",
            },
            {
              icon: BarChart3,
              title: "View Analytics",
              description: "See top visitors and usage stats",
            },
            {
              icon: Users,
              title: "Track Attendance",
              description: "Monitor library visitors and overdue books",
            },
          ],
        };
      case "admin":
        return {
          title: "Admin Demo Guide",
          features: [
            {
              icon: Users,
              title: "User Management",
              description: "Manage students, librarians, and accounts",
            },
            {
              icon: BookOpen,
              title: "Book Management",
              description: "Full book inventory and catalog control",
            },
            {
              icon: BarChart3,
              title: "Global Logs",
              description: "Monitor all system activities",
            },
            {
              icon: Settings,
              title: "System Settings",
              description: "Configure library system parameters",
            },
          ],
        };
      default:
        return { title: "Demo Guide", features: [] };
    }
  };

  const guide = getDemoGuide();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="rounded-full shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            <HelpCircle className="h-5 w-5 mr-2" />
            Demo Guide
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-orange-600" />
              {guide.title}
            </DialogTitle>
            <DialogDescription>
              Explore the key features available in your {userRole} dashboard
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
              <p className="text-sm text-orange-800">
                🎯 This is a fully functional demo. All features are interactive
                and showcase real workflows.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm">Try these features:</h4>
              {guide.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-2 bg-muted/50 rounded-lg"
                >
                  <feature.icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
              <p className="text-xs text-green-800">
                💡 All demo data is realistic and the orange-green theme
                provides a modern library aesthetic.
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setShowGuide(false)} className="flex-1">
                Start Exploring
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
