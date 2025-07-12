// src/app/dashboard/error.tsx
"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error;
  reset: () => void; // A function to attempt to re-render the segment
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="flex-1 overflow-auto p-4 flex flex-col justify-center items-center text-center bg-red-50">
      <h2 className="text-2xl font-bold text-red-700 mb-4">
        Something went wrong!
      </h2>
      <p className="text-gray-600 mb-6">
        We encountered an issue loading this part of the dashboard.
      </p>
      {/* You might display a more user-friendly message or hide the actual error in production */}
      {process.env.NODE_ENV === 'development' && (
        <pre className="text-red-500 bg-red-100 p-4 rounded-md overflow-auto max-w-lg mb-6">
          {error.message}
        </pre>
      )}
      <Button onClick={reset}>Try again</Button>
      <Button variant="link" className="mt-2" onClick={() => window.location.reload()}>
        Reload Page
      </Button>
    </div>
  );
}