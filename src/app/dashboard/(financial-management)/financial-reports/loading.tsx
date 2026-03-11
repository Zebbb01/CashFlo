import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
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

        {/* Tab navigation skeleton */}
        <div className="flex gap-2 mb-6 fade-in fade-in-delay-1">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>

        {/* Date range skeleton */}
        <div className="flex gap-4 mb-6 fade-in fade-in-delay-1">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-28" />
        </div>

        {/* Report table skeleton */}
        <Card glass className="fade-in fade-in-delay-2">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <Skeleton className="h-5 flex-[2]" />
                  <Skeleton className="h-5 flex-1" />
                  <Skeleton className="h-5 flex-1" />
                </div>
              ))}
              <div className="pt-4 border-t border-border/30">
                <div className="flex space-x-4">
                  <Skeleton className="h-6 flex-[2]" />
                  <Skeleton className="h-6 flex-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
