import React, { useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X, Sparkles } from "lucide-react";

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="border-b border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
              <Sparkles className="h-3 w-3 mr-1" />
              DEMO MODE
            </Badge>
            <p className="text-sm text-orange-800">
              You're exploring a fully functional Library Management System
              prototype with realistic data and workflows.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 text-orange-600 hover:text-orange-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
