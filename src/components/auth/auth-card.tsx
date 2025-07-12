// src/components/auth/auth-card.tsx
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AuthCardProps extends React.ComponentProps<"div"> {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthCard({
  title,
  description,
  children,
  className,
  ...props
}: AuthCardProps) {
  return (
    <div className={cn("flex flex-col gap-6 relative", className)} {...props}>
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-violet-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      </div>
      
      <Card className="overflow-hidden p-0 glass-card border-0 shadow-2xl backdrop-blur-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Form Section */}
          <div className="p-8 md:p-12 relative z-10">
            <div className="flex flex-col items-center text-center mb-8 fade-in">
              {/* Logo */}
              <div className="mb-6">
                <h1 className="text-4xl font-bold">
                  <span className="text-gradient-primary">Cash</span>
                  <span className="text-gradient-secondary">Flo</span>
                </h1>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              <p className="text-muted-foreground text-balance">{description}</p>
            </div>
            
            {children}
            
            <div className="text-muted-foreground text-center text-xs text-balance mt-8 fade-in fade-in-delay-3">
              By continuing, you agree to our{" "}
              <Link href="#" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 underline-offset-2 hover:underline transition-colors duration-200">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 underline-offset-2 hover:underline transition-colors duration-200">
                Privacy Policy
              </Link>
              .
            </div>
          </div>

          {/* Image Section */}
          <div className="relative hidden md:block overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 via-cyan-600/90 to-blue-600/90"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            
            {/* Floating elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
            
            {/* Content */}
            <div className="relative z-10 p-12 flex flex-col justify-center h-full text-white">
              <div className="mb-8">
                <h3 className="text-3xl font-bold mb-4">
                  Take control of your finances
                </h3>
                <p className="text-lg text-white/90 leading-relaxed">
                  Join thousands of users who trust CashFlo to manage their money smartly and securely.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white/80 rounded-full"></div>
                  <span className="text-white/90">Smart budget tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white/80 rounded-full"></div>
                  <span className="text-white/90">AI-powered insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white/80 rounded-full"></div>
                  <span className="text-white/90">Bank-level security</span>
                </div>
              </div>
            </div>
            
            <img
              src="/CashFlo.png"
              alt="CashFlo Dashboard"
              className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-20"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}