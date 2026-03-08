// src/app/dashboard/(financial-management)/financial-withdrawals/page.tsx
"use client";

import { Separator } from "@/components/ui/separator";
import { WithdrawalHistory } from "@/components/financial-management/WithdrawalHistory";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useUsers } from "@/hooks/auth/useUsers"; // Add this import for fetching users

export default function FinancialWithdrawalsPage() {
  const { data: session, status } = useSession();
  const currentUserId = session?.user.id;

  // Fetch users data
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();

  if (status === 'loading') {
    return (
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <Skeleton className="h-10 w-96 mb-2" />
          <Skeleton className="h-6 w-2/3" />
          <Separator />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !currentUserId) {
    return (
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="glass-card border-0 shadow-2xl">
            <CardContent className="p-6 text-destructive">
              You must be logged in to view withdrawal history.
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gradient-primary">Withdrawal History & Costs</h1>
        <p className="text-gray-600 text-lg">
          Record and analyze your financial outflows and manage expenses across your assets.
        </p>

        <Separator className="bg-gradient-to-r from-emerald-500 to-teal-500 h-[2px]" />

        {/* Pass the currentUserId, users, and isLoadingUsers to the WithdrawalHistory component */}
        <WithdrawalHistory
          currentUserId={currentUserId}
          users={users}
          isLoadingUsers={isLoadingUsers}
        />
      </div>
    </div>
  );
}