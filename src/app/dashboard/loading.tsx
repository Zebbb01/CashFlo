// src/app/dashboard/loading.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen relative">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl floating"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-xl floating" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-full blur-2xl floating" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header skeleton */}
        <div className="mb-8 fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>

        {/* Stats cards skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} glass className="fade-in fade-in-delay-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-32 mb-2" />
                <Skeleton className="h-3 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main content skeleton */}
        <div className="space-y-6">
          <Card glass className="fade-in fade-in-delay-2">
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Table header */}
                <div className="flex space-x-4">
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 flex-1" />
                </div>
                {/* Table rows */}
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex space-x-4">
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional cards skeleton */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card glass className="fade-in fade-in-delay-3">
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>

            <Card glass className="fade-in fade-in-delay-3">
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}