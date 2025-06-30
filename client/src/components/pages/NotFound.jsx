import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

function NotFound() {
  return (
   <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-8 text-center">

      <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 text-lg mb-8">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
