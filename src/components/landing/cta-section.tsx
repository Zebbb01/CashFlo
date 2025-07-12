// src/components/landing/cta-section.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star } from "lucide-react";

export function CtaSection() {
  return (
    <div className="mb-20">
      <Card className="relative overflow-hidden border-0 shadow-2xl">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-cyan-600 to-blue-600 opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
        
        <CardContent className="relative z-10 text-center py-16 px-8">
          <div className="max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/10 border border-white/20 rounded-full text-sm font-medium text-white backdrop-blur-sm">
              <Star className="w-4 h-4" />
              <span>Join 10,000+ Happy Users</span>
            </div>
            
            {/* Heading */}
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 fade-in">
              Ready to take control of your finances?
            </h2>
            
            {/* Description */}
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed fade-in fade-in-delay-1">
              Join thousands of users who have already transformed their financial lives with CashFlo. 
              Start your journey to financial freedom today.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 fade-in fade-in-delay-2">
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-emerald-600 hover:bg-white/90 px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Link href="/signup" className="flex items-center gap-2">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                asChild 
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-full backdrop-blur-sm transition-all duration-300"
              >
                <Link href="/demo">View Demo</Link>
              </Button>
            </div>
            
            {/* Features list */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/80 fade-in fade-in-delay-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <span>Free for 30 days</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
