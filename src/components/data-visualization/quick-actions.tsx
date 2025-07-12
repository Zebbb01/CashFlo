// src/components/data-visualization/quick-actions.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Banknote, Receipt, BarChart3, ArrowRight } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Accounts",
      description: "Manage your bank accounts",
      content: "Add and track your various bank accounts and balances.",
      icon: Banknote,
      gradient: "bg-gradient-primary",
      href: "/accounts",
      delay: 0,
    },
    {
      title: "Transactions",
      description: "Track your expenses",
      content: "Record and categorize your income and expenses.",
      icon: Receipt,
      gradient: "bg-gradient-secondary",
      href: "/transactions",
      delay: 0.1,
    },
    {
      title: "Reports",
      description: "Financial insights",
      content: "Generate reports and visualize your financial data.",
      icon: BarChart3,
      gradient: "bg-gradient-accent",
      href: "/reports",
      delay: 0.2,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gradient-primary mb-2">
          Quick Actions
        </h2>
        <p className="text-muted-foreground">
          Fast access to your most-used features
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <Card 
            key={index} 
            className={`glass-card scale-hover fade-in`} 
            style={{ animationDelay: `${action.delay}s` }}
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${action.gradient} rounded-lg flex items-center justify-center floating`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {action.content}
              </p>
              <Button 
                className="w-full btn-gradient-primary group"
                onClick={() => {
                  // Navigate to the respective page
                  window.location.href = action.href;
                }}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
