// src/components/auth/login-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { useSignIn } from "@/hooks/auth/useSignIn";
import { AuthCard } from "@/components/auth/auth-card";
import { PasswordInput } from "@/components/auth/password-input";
import Link from "next/link";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    handleSignIn,
    isLoading: isSignInLoading,
    error: signInError,
  } = useSignIn();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignIn(email, password);
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Login to your CashFlo account"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8">
        {signInError && (
          <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/20 fade-in">
            <AlertDescription className="text-red-800 dark:text-red-300">
              {signInError}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-4 fade-in fade-in-delay-1">
          <Label htmlFor="signInEmail" className="text-sm font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="signInEmail"
              type="email"
              placeholder="johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSignInLoading}
              className="pl-10 h-12 bg-white/50 dark:bg-white/5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
            />
          </div>
        </div>
        
        <div className="grid gap-4 fade-in fade-in-delay-2">
          <PasswordInput
            label="Password"
            id="signInPassword"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSignInLoading}
            className="h-12 bg-white/50 dark:bg-white/5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
          />
        </div>
        
        <div className="flex justify-end fade-in fade-in-delay-2">
          <Link
            href="/forgot-password"
            className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 underline-offset-2 hover:underline transition-colors duration-200"
          >
            Forgot your password?
          </Link>
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-12 btn-gradient-primary rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 group fade-in fade-in-delay-3" 
          disabled={isSignInLoading}
        >
          {isSignInLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
        
        <div className="relative fade-in fade-in-delay-3">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3 fade-in fade-in-delay-3">
          <Button 
            variant="outline" 
            type="button" 
            className="w-full h-12 glass-card border-2 hover:bg-white/20 dark:hover:bg-white/5 rounded-xl font-medium transition-all duration-300 group"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>
        </div>
        
        <p className="mt-6 text-center text-sm text-muted-foreground fade-in fade-in-delay-3">
          Don&apos;t have an account?{" "}
          <Link 
            href="/signup" 
            className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 underline-offset-2 hover:underline font-medium transition-colors duration-200"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}