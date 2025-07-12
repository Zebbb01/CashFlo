// src/components/landing/hero-section.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <div className="text-center mb-20 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-gradient-to-r from-rose-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-full text-sm font-medium text-emerald-700 dark:text-emerald-300 backdrop-blur-sm fade-in">
          <Sparkles className="w-4 h-4" />
          <span>New: AI-Powered Financial Insights</span>
        </div>
        
        {/* Main heading */}
        <h1 className="text-6xl lg:text-7xl font-bold mb-6 fade-in fade-in-delay-1">
          <span className="text-gradient-primary">Cash</span>
          <span className="text-gradient-secondary">Flo</span>
        </h1>
        
        {/* Subheading */}
        <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed fade-in fade-in-delay-2">
          Take control of your finances with our{" "}
          <span className="text-gradient-primary font-semibold">intuitive</span> cash flow management
          platform. Track expenses, manage budgets, and achieve your financial goals with{" "}
          <span className="text-gradient-secondary font-semibold">AI-powered insights</span>.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 fade-in fade-in-delay-3">
          <Button 
            asChild 
            size="lg" 
            className="btn-gradient-primary px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Link href="/signup" className="flex items-center gap-2">
              Get Started Free
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            asChild 
            className="px-8 py-6 text-lg font-semibold rounded-full border-2 glass-card hover:bg-white/20 dark:hover:bg-white/5 transition-all duration-300"
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
        
        {/* Social proof */}
        <div className="flex flex-col items-center gap-4 fade-in fade-in-delay-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span>Trusted by 10,000+ users</span>
          </div>
        </div>
      </div>
    </div>
  );
}