import React from 'react';
import { Search, Shield, AlertTriangle } from 'lucide-react';

export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center animate-ping opacity-75">
          <Search className="w-16 h-16 text-indigo-500" />
        </div>
        <div className="relative flex items-center justify-center">
          <Search className="w-16 h-16 text-indigo-600" />
        </div>
      </div>
      <div className="flex items-center gap-3 mt-8 animate-pulse">
        <Shield className="w-5 h-5 text-green-500" />
        <AlertTriangle className="w-5 h-5 text-red-500" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mt-4">Analyzing Content</h2>
      <p className="text-gray-600 mt-2">Checking for signs of misinformation...</p>
    </div>
  );
}