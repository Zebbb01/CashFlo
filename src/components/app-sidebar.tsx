// src/components/app-sidebar.tsx
"use client";

import * as React from "react";
import {
  PieChart, // For Data Visualization
  Calculator, // For Financial Management calculations
  Users, // Potentially for team-related features
  Landmark, // For Assets
  Wallet,
  HomeIcon, // For Dashboard home
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data, adjusted for CashFlo
const data = {
  user: {
    name: "John Doe", // Example user
    email: "john.doe@example.com",
    avatar: "https://github.com/shadcn.png", // Using a generic avatar for demonstration
  },
  teams: [
    {
      name: "My Personal Finances",
      logo: Wallet, // Example icon
      plan: "Individual",
    },
    {
      name: "CashFlo Business",
      logo: Landmark, // Example icon
      plan: "Pro",
    },
  ],
  navOverView: [
    {
      title: "Dashboard", // Your main dashboard landing page
      url: "/dashboard",
      icon: HomeIcon,
      // isActive is managed by NavMain based on current URL
      // REMOVED 'items' array for a direct link
    },
  ],
  navMain: [
    {
      title: "Data Visualization",
      url: "/dashboard/data-visualization",
      icon: PieChart,
      items: [
        {
          title: "General",
          url: "/dashboard/data-visualization",
        },
        {
          title: "Team Overview",
          url: "/dashboard/data-visualization/team",
        },
      ],
    },
    {
      title: "Financial Management",
      url: "/dashboard/financial-management",
      icon: Calculator,
      items: [
        {
          title: "Monitoring",
          url: "/dashboard/financial-management",
        },
        {
          title: "Assets & Liabilities",
          url: "/dashboard/financial-management/assets",
        },
        {
          title: "Colleague Contributions",
          url: "/dashboard/financial-management/colleagues",
        },
      ],
    },
  ],
  navOther: [ // Example for another section
    {
      title: "Settings",
      url: "#",
      icon: Users, // Using Users as a placeholder
    },
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* Pass the groupLabel prop to NavMain */}
        <NavMain items={data.navOverView} groupLabel="Overview" />
        <NavMain items={data.navMain} groupLabel="Core Features" />
        {/* Example of another group */}
        <NavMain items={data.navOther} groupLabel="General" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}