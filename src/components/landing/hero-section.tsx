// src/components/landing/hero-section.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Database, TrendingUp, ShieldCheck } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-purple-500/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm fade-in">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Enterprise-Grade Financial Clarity for Scaling Businesses</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 fade-in fade-in-delay-1 max-w-5xl mx-auto">
          Scale Revenue Faster With
          <span className="block text-gradient-primary mt-2">Absolute Financial Precision.</span>
        </h1>

        {/* Sub-headline / Problem-Solution */}
        <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed fade-in fade-in-delay-2">
          Stop guessing your actual net margins. CashFlo isolates data per-user, automates complex revenue shares, and turns scattered spreadsheets into a single source of truth engineered for growth.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 fade-in fade-in-delay-3">
          <Link href="/signup">
            <Button size="lg" variant="gradient" className="h-14 px-8 text-base shadow-xl shadow-indigo-500/20 scale-hover w-full sm:w-auto">
              Start Engineering Revenue
              <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="h-14 px-8 text-base scale-hover w-full sm:w-auto border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground">
              Sign In to Analytics
            </Button>
          </Link>
        </div>

        {/* Dashboard Mockup / Proof Frame */}
        <div className="relative max-w-5xl mx-auto fade-in fade-in-delay-3">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20 pointer-events-none" />

          {/* Glassmorphic Browser Frame */}
          <div className="rounded-t-2xl border border-b-0 border-border/50 bg-background/30 backdrop-blur-xl shadow-2xl overflow-hidden relative z-10">
            {/* Browser Header */}
            <div className="h-12 border-b border-border/50 bg-background/50 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="mx-auto bg-background rounded-md px-32 py-1 border border-border/50 text-xs text-muted-foreground flex items-center gap-2">
                app.cashflo.finance
              </div>
            </div>

            {/* Mockup Content Overlay */}
            <div className="aspect-[16/9] bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-900 p-8 grid grid-cols-3 gap-6 relative">

              {/* Fake Sidebar */}
              <div className="col-span-1 border-r border-slate-800/50 pr-6 space-y-4">
                <div className="h-8 w-32 bg-slate-800/50 rounded-md" />
                <div className="h-4 w-24 bg-slate-800/30 rounded-md mt-12" />
                <div className="h-4 w-32 bg-slate-800/30 rounded-md" />
                <div className="h-4 w-20 bg-slate-800/30 rounded-md" />
              </div>

              {/* Fake Main Content */}
              <div className="col-span-2 space-y-6">
                <div className="flex justify-between items-end">
                  <div className="h-8 w-48 bg-slate-800/50 rounded-md" />
                  <div className="h-10 w-32 bg-indigo-500/20 rounded-md border border-indigo-500/30" />
                </div>

                {/* Fake Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-slate-800/40 rounded-xl border border-slate-700/30 p-4 space-y-3">
                      <div className="h-3 w-16 bg-slate-700/50 rounded-full" />
                      <div className="h-6 w-24 bg-slate-200/80 rounded-md" />
                    </div>
                  ))}
                </div>

                {/* Fake Chart */}
                <div className="h-48 bg-slate-800/40 rounded-xl border border-slate-700/30 p-4 flex items-end gap-2">
                  {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                    <div key={i} className="w-full bg-indigo-500/20 rounded-t-sm border-t border-indigo-500/50 transition-all duration-1000" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>

              {/* Overlay Gradient to fade out bottom */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0f172a] to-transparent" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}