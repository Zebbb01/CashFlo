// src/app/dashboard/not-found.tsx
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Search, Home, ArrowLeft, AlertCircle, Zap } from 'lucide-react';

export default function DashboardNotFound() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleHome = () => {
    router.push('/');
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl floating"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-xl floating" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl floating" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-accent/15 to-primary/15 rounded-full blur-xl floating" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Main Content Container */}
      <div className="glass-card max-w-2xl mx-auto p-12 rounded-3xl text-center space-y-8 fade-in">
        
        {/* Icon and Status */}
        <div className="flex justify-center mb-6 fade-in-delay-1">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center pulse-glow">
              <AlertCircle className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-4 fade-in-delay-2">
          <h1 className="text-6xl font-bold text-gradient-primary mb-2">
            404
          </h1>
          <h2 className="text-3xl font-semibold text-foreground">
            Dashboard Page Not Found
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full shimmer"></div>
        </div>

        {/* Description */}
        <div className="fade-in-delay-3">
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            Oops! The dashboard section you're looking for seems to have wandered off into the digital void. 
            Don't worry, we'll help you find your way back.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 fade-in-delay-3">
          <Button
            onClick={handleBack}
            className="btn-gradient-primary px-8 py-3 rounded-xl font-semibold text-lg scale-hover group min-w-[200px]"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>
          
          <Button
            onClick={handleDashboard}
            className="btn-gradient-secondary px-8 py-3 rounded-xl font-semibold text-lg scale-hover group min-w-[200px]"
          >
            <Search className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            Dashboard Home
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="pt-6 fade-in-delay-3">
          <Button
            variant="ghost"
            onClick={handleHome}
          >
            <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Return to Main Site
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-border/50 fade-in-delay-3">
          <p className="text-sm text-muted-foreground mb-4">
            Popular dashboard sections:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { name: 'Assets', href: '/dashboard/financial-assets' },
              { name: 'Colleagues', href: '/dashboard/financial-colleagues' },
              { name: 'Management', href: '/dashboard/financial-management' },
              { name: 'Withdrawals', href: '/dashboard/financial-withdrawals' }
            ].map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-all hover:scale-105 shimmer-text"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-10 text-6xl opacity-10 floating">
        🚀
      </div>
      <div className="absolute bottom-10 left-10 text-4xl opacity-10 floating" style={{animationDelay: '1.5s'}}>
        💫
      </div>
    </div>
  );
}