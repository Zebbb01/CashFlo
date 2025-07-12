// src/components/ui/page-wrapper.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  showBackground?: boolean;
}

export function PageWrapper({
  children,
  className,
  title,
  description,
  actions,
  showBackground = true,
}: PageWrapperProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("min-h-screen relative", className)}>
      {/* Animated background orbs */}
      {showBackground && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl floating"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-xl floating" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-full blur-2xl floating" style={{ animationDelay: '2s' }}></div>
        </div>
      )}

      <div className={`relative z-10 p-6 transition-all duration-700 ease-out ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        {/* Header section */}
        {(title || description || actions) && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {title && (
                <div className="fade-in">
                  <h1 className="text-3xl font-bold text-gradient-primary mb-2">
                    {title}
                  </h1>
                  {description && (
                    <p className="text-muted-foreground text-lg fade-in fade-in-delay-1">
                      {description}
                    </p>
                  )}
                </div>
              )}
              {actions && (
                <div className="fade-in fade-in-delay-2">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="fade-in fade-in-delay-3">
          {children}
        </div>
      </div>
    </div>
  );
}