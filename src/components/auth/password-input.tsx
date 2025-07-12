// src/components/auth/password-input.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export function PasswordInput({ label, id, className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid gap-4">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          className={cn(
            "pl-10 pr-12 h-12 bg-white/50 dark:bg-white/5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300",
            className
          )}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={props.disabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>
    </div>
  );
}