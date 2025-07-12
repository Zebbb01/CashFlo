// src/app/dashboard/(financial-management)/financial-colleagues/page.tsx
"use client";

import { Separator } from "@/components/ui/separator";
import { ColleaguesContributions } from "@/components/financial-management/ColleaguesContributions";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign } from "lucide-react";

export default function FinancialColleaguesPage() {
  return (
    <div className="flex-1 overflow-auto p-4 relative">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl floating pulse-glow"></div>
        <div className="absolute top-40 right-32 w-48 h-48 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl floating" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-56 h-56 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl floating" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header Section with Animations */}
        <div className="fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white floating">
              <Users className="w-6 h-6" />
            </div>
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all duration-300">
              <TrendingUp className="w-3 h-3 mr-1" />
              New Feature
            </Badge>
          </div>
          
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            Colleagues & Financial Contributions
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your assets, track revenue and costs, and handle withdrawals with your team.
          </p>
        </div>

        <div className="fade-in fade-in-delay-1">
          <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in fade-in-delay-2">
          <div className="glass-card p-6 rounded-xl scale-hover">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Active Colleagues</h3>
            </div>
            <p className="text-2xl font-bold text-gradient-primary">12</p>
            <p className="text-sm text-muted-foreground">+2 this month</p>
          </div>

          <div className="glass-card p-6 rounded-xl scale-hover">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Total Contributions</h3>
            </div>
            <p className="text-2xl font-bold text-gradient-secondary">$24,580</p>
            <p className="text-sm text-muted-foreground">+15% from last month</p>
          </div>

          <div className="glass-card p-6 rounded-xl scale-hover">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Growth Rate</h3>
            </div>
            <p className="text-2xl font-bold text-gradient-accent">+18.5%</p>
            <p className="text-sm text-muted-foreground">Monthly average</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="fade-in fade-in-delay-3">
          <ColleaguesContributions />
        </div>
      </div>
    </div>
  );
}