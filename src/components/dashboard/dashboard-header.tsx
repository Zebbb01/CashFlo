// src/components/dashboard/dashboard-header.tsx
export function DashboardHeader() {
  return (
    <div className="glass-card rounded-2xl p-8 mb-8 pulse-glow">
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
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-2">
            A quick glance at your key financial metrics and activities.
          </p>
        </div>
      </div>
    </div>
  );
}