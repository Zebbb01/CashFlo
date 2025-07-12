// src/components/dashboard/latest-transactions-card.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";

export function LatestTransactionsCard() {
  const transactions = [
    {
      id: 1,
      date: "June 5",
      description: "Received payment from Client A",
      amount: "+$2,500",
      type: "income",
      category: "Client Payment",
    },
    {
      id: 2,
      date: "June 4",
      description: "Paid utilities",
      amount: "-$350",
      type: "expense",
      category: "Utilities",
    },
    {
      id: 3,
      date: "June 3",
      description: "ATM withdrawal",
      amount: "-$200",
      type: "expense",
      category: "Cash",
    },
  ];

  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center floating">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Latest Transactions</CardTitle>
            <CardDescription>Recently recorded income and expenses.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((tx, index) => (
            <div
              key={tx.id}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 hover:bg-muted/50 border border-transparent hover:border-border fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex-shrink-0">
                {tx.type === "income" ? (
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">
                    {tx.description}
                  </p>
                  <p className={`text-sm font-semibold ${
                    tx.type === "income" 
                      ? "text-green-600 dark:text-green-400" 
                      : "text-red-600 dark:text-red-400"
                  }`}>
                    {tx.amount}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                  <Badge variant="secondary" className="text-xs">
                    {tx.category}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button 
            asChild 
            className="w-full btn-gradient-primary group"
          >
            <Link href="/transactions">
              View All Transactions
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}