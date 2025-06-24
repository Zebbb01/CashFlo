// src/app/dashboard/layout.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AppSidebar } from "@/components/app-sidebar";
// No longer need direct Breadcrumb imports here
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardBreadcrumbs } from "@/components/dashboard-breadcrumbs"; // Import the new component

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "15rem", // overide the default width
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            {/* Use the new dynamic breadcrumbs component */}
            <DashboardBreadcrumbs />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm font-medium hidden md:block">
              Welcome, {session.user?.name}
            </span>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
