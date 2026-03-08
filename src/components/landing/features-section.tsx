
// src/components/landing/features-section.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, DollarSign, Shield, TrendingUp, Bell, Users } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Get insights into your spending patterns with AI-powered detailed reports and interactive visualizations that adapt to your habits.",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/20 to-teal-950/20"
  },
  {
    icon: DollarSign,
    title: "Budget Tracking",
    description: "Set intelligent budgets and track your progress with real-time notifications, smart alerts, and personalized recommendations.",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/20 to-cyan-950/20"
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your financial data is encrypted with military-grade security and protected with industry-leading privacy standards.",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/20 to-pink-950/20"
  },
  {
    icon: TrendingUp,
    title: "Growth Insights",
    description: "Discover opportunities to grow your wealth with AI-powered investment suggestions and financial planning tools.",
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50 dark:from-orange-950/20 to-red-950/20"
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Stay on top of your finances with intelligent alerts, bill reminders, and spending limit notifications.",
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-50 to-purple-50 dark:from-indigo-950/20 to-purple-950/20"
  },
  {
    icon: Users,
    title: "Family Sharing",
    description: "Manage family finances together with shared budgets, expense tracking, and collaborative financial planning.",
    gradient: "from-rose-500 to-pink-500",
    bgGradient: "from-rose-50 to-pink-50 dark:from-rose-950/20 to-pink-950/20"
  }
];

export function FeaturesSection() {
  return (
    <div className="mb-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gradient-primary fade-in">
          Everything you need to manage your money
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto fade-in fade-in-delay-1">
          Powerful features designed to make financial management simple, smart, and secure.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card 
            key={feature.title} 
            className={`glass-card scale-hover fade-in border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden group ${
              index % 2 === 0 ? 'fade-in-delay-1' : 'fade-in-delay-2'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
            
            <CardHeader className="relative z-10 text-center pb-2">
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg floating`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold mb-2">{feature.title}</CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 text-center">
              <CardDescription className="text-base leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}