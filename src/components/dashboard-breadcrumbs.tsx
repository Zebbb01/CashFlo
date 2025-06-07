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
  const pathSegments = pathname.split('/').filter(segment => segment); // Split by '/' and remove empty strings

  // Map of path segments to display names (customize as needed)
  const pathDisplayNames: { [key: string]: string } = {
    "dashboard": "Dashboard",
    "data-visualization": "Data Visualization",
    "financial-management": "Financial Management",
    "team": "Team Overview", // For /dashboard/data-visualization/team
    "assets": "Assets & Liabilities", // For /dashboard/financial-management/assets
    "colleagues": "Colleague Contributions", // For /dashboard/financial-management/colleagues
    "overview": "Overview" // For /dashboard if you decided to have /dashboard/overview
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          const href = '/' + pathSegments.slice(0, index + 1).join('/');
          const displayName = pathDisplayNames[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()); // Convert slug to title case

          const isLast = index === pathSegments.length - 1;

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{displayName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{displayName}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}