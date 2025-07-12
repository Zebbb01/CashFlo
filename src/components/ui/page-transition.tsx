// src/components/ui/page-transition.tsx
"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentKey, setCurrentKey] = useState(pathname);

  useEffect(() => {
    if (pathname !== currentKey) {
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setCurrentKey(pathname);
        setIsTransitioning(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [pathname, currentKey]);

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isTransitioning
            ? "opacity-0 translate-y-4 scale-95"
            : "opacity-100 translate-y-0 scale-100"
        )}
      >
        {children}
      </div>
    </div>
  );
}

// Higher-order component for wrapping pages
export function withPageTransition<T extends object>(
  Component: React.ComponentType<T>
) {
  return function PageTransitionWrapper(props: T) {
    return (
      <PageTransition>
        <Component {...props} />
      </PageTransition>
    );
  };
}