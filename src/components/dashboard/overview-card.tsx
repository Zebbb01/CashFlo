// src/components/dashboard/overview-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface OverviewCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  gradient?: string;
  delay?: number;
}

export function OverviewCard({
  title,
  value,
  description,
  icon: Icon,
  gradient = "bg-gradient-primary",
  delay = 0,
}: OverviewCardProps) {
  return (
    <Card className={`glass-card scale-hover fade-in`} style={{ animationDelay: `${delay}s` }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`w-10 h-10 ${gradient} rounded-lg flex items-center justify-center floating`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gradient-primary mb-1">
          {value}
        </div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
