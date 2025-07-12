// src/components/dashboard-breadcrumbs.tsx
"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  // Map of path segments to display names
  const pathDisplayNames: { [key: string]: string } = {
    "dashboard": "Dashboard",
    "general": "General",
    "financial-management": "Financial Management",
    "financial-assets": "Assets & Liabilities",
    "financial-withdrawals": "Withdrawal History & Costs",
    "financial-colleagues": "Colleague Contributions",
    "team": "Team Overview",
    "overview": "Overview"
  };

  return (
    <div className={`transition-all duration-500 ease-in-out ${
      isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
    }`}>
      <Breadcrumb>
        <BreadcrumbList>
          {pathSegments.map((segment, index) => {
            const href = '/' + pathSegments.slice(0, index + 1).join('/');
            const displayName = pathDisplayNames[segment] || 
              segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

            const isLast = index === pathSegments.length - 1;

            return (
              <React.Fragment key={href}>
                <BreadcrumbItem 
                  className={`transition-all duration-300 delay-${index * 100} ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                  }`}
                >
                  {isLast ? (
                    <BreadcrumbPage className="text-gradient-primary font-medium">
                      {displayName}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link 
                        href={href}
                        className="hover:text-primary transition-colors duration-200 scale-hover"
                      >
                        {displayName}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator 
                    className={`transition-all duration-300 delay-${index * 100 + 50} ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}