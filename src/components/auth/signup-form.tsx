// src/components/auth/signup-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, User, Mail, ArrowRight } from "lucide-react";
import { useSignUp } from "@/hooks/auth/useSignUp";
import { AuthCard } from "@/components/auth/auth-card";
import { PasswordInput } from "@/components/auth/password-input";
import Link from "next/link";

export function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    handleSignUp,
    isLoading: isSignUpLoading,
    error: signUpError,
    success: signUpSuccess,
  } = useSignUp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignUp(name, email, password, confirmPassword);
  };

  return (
    <AuthCard
      title="Create your account"
      description="Enter your information to create a new account"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8">
        {signUpError && (
          <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/20 fade-in">
            <AlertDescription className="text-red-800 dark:text-red-300">
              {signUpError}
            </AlertDescription>
          </Alert>
        )}
        
        {signUpSuccess && (
          <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 fade-in">
            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <AlertDescription className="text-emerald-800 dark:text-emerald-300">
              {signUpSuccess}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-4 fade-in fade-in-delay-1">
          <Label htmlFor="signUpName" className="text-sm font-medium">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="signUpName"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSignUpLoading}
              className="pl-10 h-12 bg-white/50 dark:bg-white/5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
            />
          </div>
        </div>
        
        <div className="grid gap-4 fade-in fade-in-delay-2">
          <Label htmlFor="signUpEmail" className="text-sm font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="signUpEmail"
              type="email"
              placeholder="johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSignUpLoading}
              className="pl-10 h-12 bg-white/50 dark:bg-white/5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
            />
          </div>
        </div>
        
        <div className="fade-in fade-in-delay-3">
          <PasswordInput
            label="Password"
            id="signUpPassword"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSignUpLoading}
          />
        </div>
        
        <div className="fade-in fade-in-delay-3">
          <PasswordInput
            label="Confirm Password"
            id="confirmPassword"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isSignUpLoading}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-12 btn-gradient-primary rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 group fade-in fade-in-delay-4" 
          disabled={isSignUpLoading}
        >
          {isSignUpLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : signUpSuccess ? (
            "Signing you in..."
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
        
        <p className="mt-6 text-center text-sm text-muted-foreground fade-in fade-in-delay-4">
          Already have an account?{" "}
          <Link 
            href="/login" 
            className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 underline-offset-2 hover:underline font-medium transition-colors duration-200"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}