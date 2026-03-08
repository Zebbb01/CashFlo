// src/app/dashboard/layout.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardBreadcrumbs } from "@/components/dashboard-breadcrumbs";
import { Metadata } from "next";
import { BellNotification } from "@/components/layout/bell-notification"; // Import the new component

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | CashFlo"
  },
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Pass the user ID to the client component for fetching invitations
  const currentUserId = session.user?.id || '';

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "15rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-all duration-300 ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b px-4 glass-card">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 opacity-50"
            />
            <DashboardBreadcrumbs />
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/* Remove the Welcome message */}
            {/* <div className="fade-in fade-in-delay-1">
              <span className="text-sm font-medium hidden md:block text-gradient-primary">
                Welcome, {session.user?.name}
              </span>
            </div> */}

            {/* Place the Bell Notification here */}
            {currentUserId && <BellNotification currentUserId={currentUserId} />}
          </div>
        </header>

        {/* Main content area with enhanced animations */}
        <main className="flex-1 overflow-hidden">
          <div className="fade-in fade-in-delay-2 h-full">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}