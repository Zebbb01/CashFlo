// src/app/(auth)/login/page.tsx
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-10 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-blue-50/30 dark:from-emerald-950/10 dark:via-transparent dark:to-blue-950/10"></div>
      
      {/* Floating background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/5 to-cyan-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-violet-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      </div>
      
      <div className="w-full max-w-sm md:max-w-4xl relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}