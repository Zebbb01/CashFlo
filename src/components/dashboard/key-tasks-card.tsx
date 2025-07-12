// src/components/dashboard/key-tasks-card.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export function KeyTasksCard() {
  // Step 1: Define a specific type for priority
  type Priority = "high" | "medium" | "low";

  const tasks: {
    id: number;
    title: string;
    priority: Priority;
    completed: boolean;
  }[] = [
    {
      id: 1,
      title: "Review Q2 Financial Report",
      priority: "high",
      completed: false,
    },
    {
      id: 2,
      title: "Add new asset: Investment Property",
      priority: "medium",
      completed: false,
    },
    {
      id: 3,
      title: "Categorize May expenses",
      priority: "low",
      completed: true,
    },
  ];

  const priorityColors: Record<Priority, string> = {
    high: "text-red-500",
    medium: "text-yellow-500",
    low: "text-green-500",
  };

  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center floating">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Key Tasks</CardTitle>
            <CardDescription>Important actions to take.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-muted/50 border border-transparent hover:border-border fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex-shrink-0">
                {task.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <div
                    className={`w-2 h-2 rounded-full ${priorityColors[task.priority]} bg-current`}
                  />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    task.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {task.title}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {task.priority} priority
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button asChild className="w-full btn-gradient-secondary group">
            <Link href="/financial-management">
              Go to Financial Management
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
