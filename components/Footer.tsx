import React from 'react';
import { BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-linear-to-r from-orange-50 to-amber-50 border-t border-orange-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Content */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-2">
            <BookOpen className="h-6 w-6 text-orange-600" />
            <h3 className="text-xl font-medium text-orange-900">UIT Library</h3>
          </div>
          <div className="max-w-2xl mx-auto space-y-2">
            <p className="text-orange-700 leading-relaxed">
              Our vision is to create a modern learning space where knowledge, technology, 
              and community come together.
            </p>
            <p className="text-orange-700 leading-relaxed">
              We support students and educators in achieving academic excellence.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-orange-200 text-center space-y-3">
          <p className="text-sm text-orange-600">
            © 2024 UIT Library Management System. All rights reserved.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
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
    </footer>
  );
}