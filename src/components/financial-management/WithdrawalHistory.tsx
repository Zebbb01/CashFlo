// src/components/financial-management/WithdrawalHistory.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function WithdrawalHistory() {
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalDescription, setWithdrawalDescription] = useState("");

  // Sample data for demonstration for withdrawals (replace with actual API data)
  const [withdrawalHistory, setWithdrawalHistory] = useState([
    { id: 1, date: "2025-05-30", amount: 1500, description: "Rent Payment" },
    { id: 2, date: "2025-05-28", amount: 250, description: "Groceries" },
    { id: 3, date: "2025-05-25", amount: 500, description: "Utilities" },
  ]);

  const handleAddWithdrawal = () => {
    if (!withdrawalAmount || !withdrawalDescription) {
      toast.warning("Missing Fields", {
        description: "Please fill in all withdrawal fields.",
      });
      return;
    }
    const parsedAmount = parseFloat(withdrawalAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Invalid Input", {
        description: "Withdrawal amount must be a valid positive number.",
      });
      return;
    }

    const newWithdrawal = {
      id: withdrawalHistory.length > 0 ? Math.max(...withdrawalHistory.map(w => w.id)) + 1 : 1,
      date: new Date().toISOString().slice(0, 10), // Current date
      amount: parsedAmount,
      description: withdrawalDescription,
    };

    setWithdrawalHistory((prevHistory) => [...prevHistory, newWithdrawal]);
    setWithdrawalAmount("");
    setWithdrawalDescription("");
    toast.info("Withdrawal Recorded (Frontend Only)", {
      description: "This withdrawal is currently only recorded in the frontend state. Integrate with your backend for persistence.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal History & Costs</CardTitle>
        <CardDescription>Record and view your withdrawals and their impact.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="withdrawalAmount">Withdrawal Amount</Label>
            <Input
              id="withdrawalAmount"
              type="number"
              placeholder="e.g., 1000"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="withdrawalDescription">Description</Label>
            <Textarea
              id="withdrawalDescription"
              placeholder="e.g., House rent, new gadget"
              value={withdrawalDescription}
              onChange={(e) => setWithdrawalDescription(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleAddWithdrawal} className="mt-4">Add Withdrawal</Button>

        <h3 className="text-lg font-semibold mt-6 mb-2">Recent Withdrawals</h3>
        <div className="border rounded-md">
          {withdrawalHistory.length > 0 ? (
            <ul className="divide-y">
              {withdrawalHistory.map((item) => (
                <li key={item.id} className="p-3 flex justify-between items-center">
                  <span>{item.date}: {item.description}</span>
                  <span className="font-medium text-red-600">-₱{item.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-3 text-muted-foreground">No withdrawal history.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}