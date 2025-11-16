import React from 'react';
import { BookOpen } from 'lucide-react';

export function DashboardFooter() {
  return (
    <footer className="bg-linear-to-r from-orange-50 to-amber-50 border-t border-orange-200 mt-auto">
      <div className="px-6 py-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-orange-900">UCC Library</span>
            </div>
            <p className="text-sm text-orange-700 max-w-md">
              Creating a modern learning space where knowledge, technology, and community come together.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-orange-600">© 2024 UCC Library</span>
            <a href="#privacy" className="text-orange-600 hover:text-orange-800 transition-colors">
              Privacy
            </a>
            <a href="#terms" className="text-orange-600 hover:text-orange-800 transition-colors">
              Terms
            </a>
            <a href="#accessibility" className="text-orange-600 hover:text-orange-800 transition-colors">
              Accessibility
            </a>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <BookOpen className="h-4 w-4 text-orange-600" />
            <span className="font-medium text-orange-900">UCC Library</span>
          </div>
          <p className="text-sm text-orange-700">
            Creating a modern learning space where knowledge, technology, and community come together.
          </p>
          <div className="space-y-2">
            <p className="text-xs text-orange-600">
              © 2024 UCC Library Management System
            </p>
            <div className="flex items-center justify-center space-x-3 text-xs">
              <a href="#privacy" className="text-orange-600 hover:text-orange-800 transition-colors">
                Privacy
              </a>
              <a href="#terms" className="text-orange-600 hover:text-orange-800 transition-colors">
                Terms
              </a>
              <a href="#accessibility" className="text-orange-600 hover:text-orange-800 transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}