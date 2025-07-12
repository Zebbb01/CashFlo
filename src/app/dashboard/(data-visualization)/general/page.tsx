// src/app/dashboard/(data-visualization)/general/page.tsx
import { Separator } from "@/components/ui/separator";

// Import the new dashboard components
import { UserSessionDisplay } from "@/components/data-visualization/user-session-display";
import { KeyMetrics } from "@/components/data-visualization/key-metrics";
import { ChartsSection } from "@/components/data-visualization/charts-section";
import { QuickActions } from "@/components/data-visualization/quick-actions";

export default function GeneralPage() {
  return (
    <div className="flex-1 overflow-auto min-h-screen">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl floating"></div>
        <div className="absolute top-1/2 -left-40 w-60 h-60 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-gradient-to-br from-pink-400/10 to-rose-400/10 rounded-full blur-3xl floating" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto p-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="fade-in">
            <div className="glass-card rounded-2xl p-8 pulse-glow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center floating">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gradient-primary">
                    General Dashboard
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Overview of your financial performance through charts and key metrics.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="fade-in fade-in-delay-1">
            <Separator className="my-6" />
          </div>

          {/* Reusable components for different sections */}
          <div className="fade-in fade-in-delay-1">
            <UserSessionDisplay />
          </div>
          
          <div className="fade-in fade-in-delay-2">
            <KeyMetrics />
          </div>
          
          <div className="fade-in fade-in-delay-3">
            <ChartsSection />
          </div>
          
          <div className="fade-in fade-in-delay-3">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}