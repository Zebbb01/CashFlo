// src/app/dashboard/loading.tsx
import { Spinner } from "@/components/ui/spinner";

// This component will automatically be wrapped in a React Suspense boundary
// by Next.js and shown while the data in page.tsx/layout.tsx is being fetched.
export default function DashboardLoading() {
  return (
    <div className="flex-1 overflow-auto p-4 flex justify-center items-center min-h-[calc(100vh-64px)]">
      <Spinner />
      <p className="sr-only">Loading dashboard data...</p>
    </div>
  );
}