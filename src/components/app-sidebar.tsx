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
  // ✅ Move the hook inside the component body
  const { data: session, status } = useSession();

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
    navOther: [
      {
        title: "Settings",
        url: "#",
        icon: Users,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navOverView} groupLabel="Overview" />
        <NavMain items={data.navMain} groupLabel="Core Features" />
        <NavMain items={data.navOther} groupLabel="General" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
