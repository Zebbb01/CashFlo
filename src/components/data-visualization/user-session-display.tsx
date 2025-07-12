// src/components/data-visualization/user-session-display.tsx
"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Clock } from "lucide-react";

export function UserSessionDisplay() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Card className="glass-card shimmer">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-gradient-primary">Loading...</CardTitle>
              <CardDescription>Please wait while we load your session</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="glass-card pulse-glow">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center floating">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl text-gradient-primary">
              Welcome to CashFlo
            </CardTitle>
            <CardDescription>
              Your personal finance management dashboard
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
              <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Full Name</p>
                <p className="text-muted-foreground">
                  {session?.user?.name || "Not provided"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Email Address</p>
                <p className="text-muted-foreground">
                  {session?.user?.email || "Not provided"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Session Status</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </Badge>
                  <Badge variant="outline">
                    Authenticated
                  </Badge>
                </div>
              </div>
            </div>
            
            {session?.user?.image && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium">Profile Picture</p>
                    <p className="text-muted-foreground text-xs">User avatar</p>
                  </div>
                  <img
                    src={session.user.image}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-2 border-primary/20 scale-hover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}