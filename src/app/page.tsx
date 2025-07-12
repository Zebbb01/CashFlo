// src/app/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

// Import enhanced landing page components
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { CtaSection } from "@/components/landing/cta-section";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-blue-50/50 dark:from-emerald-950/20 dark:via-transparent dark:to-blue-950/20 pointer-events-none"></div>
      
      {/* Main content */}
      <main className="relative z-10 flex-1">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <HeroSection />
          <FeaturesSection />
          <CtaSection />
        </div>
      </main>
      
      {/* Footer gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none"></div>
    </div>
  );
}