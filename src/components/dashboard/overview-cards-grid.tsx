// src/components/dashboard/overview-cards-grid.tsx
import {
  Landmark,
  PieChart,
  Wallet,
  Users,
} from "lucide-react";
import { OverviewCard } from "./overview-card";

interface OverviewCardsGridProps {
  totalAssets: string;
  monthlyRevenue: string;
  netIncome: string;
  activeProjects: string;
}

export function OverviewCardsGrid({
  totalAssets,
  monthlyRevenue,
  netIncome,
  activeProjects,
}: OverviewCardsGridProps) {
  const cardData = [
    {
      title: "Total Assets",
      value: totalAssets,
      description: "Total value of all assets",
      icon: Landmark,
      gradient: "bg-gradient-primary",
      delay: 0,
    },
    {
      title: "Monthly Revenue",
      value: monthlyRevenue,
      description: "Revenue for current month",
      icon: PieChart,
      gradient: "bg-gradient-secondary",
      delay: 0.1,
    },
    {
      title: "Net Income",
      value: netIncome,
      description: "Income after expenses",
      icon: Wallet,
      gradient: "bg-gradient-accent",
      delay: 0.2,
    },
    {
      title: "Active Projects",
      value: activeProjects,
      description: "Currently active projects",
      icon: Users,
      gradient: "bg-gradient-primary",
      delay: 0.3,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardData.map((card, index) => (
        <OverviewCard
          key={index}
          title={card.title}
          value={card.value}
          description={card.description}
          icon={card.icon}
          gradient={card.gradient}
          delay={card.delay}
        />
      ))}
    </div>
  );
}