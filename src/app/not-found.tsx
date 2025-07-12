// src/app/dashboard/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardNotFound() {
  return (
    <div className="flex-1 overflow-auto p-4 flex flex-col justify-center items-center text-center bg-gray-50">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">404 - Dashboard Page Not Found</h2>
      <p className="text-lg text-gray-600 mb-8">
        We couldn't find the specific dashboard section you were looking for.
      </p>
      <Button asChild>
        <Link href="/dashboard">Return to Dashboard Overview</Link>
      </Button>
      <Button variant="link" asChild className="mt-2">
        <Link href="/">Go to Home</Link>
      </Button>
    </div>
  );
}