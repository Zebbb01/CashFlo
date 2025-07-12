// src/components/app-sidebar.tsx
"use client";

import * as React from "react";
import {
  PieChart,
  Calculator,
  Users,
  Landmark,
  Wallet,
  HomeIcon,
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
import { useSession } from "next-auth/react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    // Add a small delay to trigger fade-in animations
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const data = {
    user: {
      name: session?.user?.name ?? "Guest",
      email: session?.user?.email ?? "guest@example.com",
      avatar: "https://github.com/shadcn.png",
    },
    teams: [
      {
        name: "Personal Finances",
        logo: Wallet,
        plan: "Individual",
      },
      {
        name: "CashFlo Business",
        logo: Landmark,
        plan: "Pro",
      },
    ],
    navOverView: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: HomeIcon,
      },
    ],
    navMain: [
      {
        title: "Data Visualization",
        icon: PieChart,
        items: [
          {
            title: "General",
            url: "/dashboard/general",
          },
          {
            title: "Team Overview",
            url: "#",
          },
        ],
      },
      {
        title: "Budget & Finances",
        icon: Calculator,
        items: [
          {
            title: "Financial Management",
            url: "/dashboard/financial-management",
          },
          {
            title: "Assets & Liabilities",
            url: "/dashboard/financial-assets",
          },
          {
            title: "Withdrawal History & Costs",
            url: "/dashboard/financial-withdrawals",
          },
          {
            title: "Colleague Contributions",
            url: "/dashboard/financial-colleagues",
          },
        ],
      },
    ],
    navOther: [
      {
        title: "Settings",
        url: "#",
        icon: Users,
      },
    ],
  };

  return (
    <Sidebar 
      collapsible="icon" 
      className={`glass-card transition-all duration-500 ease-in-out ${
        isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}
      {...props}
    >
      <SidebarHeader className="fade-in">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="space-y-2">
        <div className="fade-in fade-in-delay-1">
          <NavMain items={data.navOverView} groupLabel="Overview" />
        </div>
        <div className="fade-in fade-in-delay-2">
          <NavMain items={data.navMain} groupLabel="Core Features" />
        </div>
        <div className="fade-in fade-in-delay-3">
          <NavMain items={data.navOther} groupLabel="General" />
        </div>
      </SidebarContent>
      <SidebarFooter className="fade-in fade-in-delay-3">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}