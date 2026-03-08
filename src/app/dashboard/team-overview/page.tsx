// src/app/dashboard/team-overview/page.tsx
"use client";

import React from "react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { useUsers } from "@/hooks/auth/useUsers";
import { Mail, Briefcase, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamOverviewPage() {
    const { data: session } = useSession();
    const { data: users, isLoading, error } = useUsers();

    if (isLoading) {
        return (
            <PageWrapper
                title="Team Overview"
                description="Meet the people collaborating on your assets."
            >
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="glass-card h-48 w-full" />
                    ))}
                </div>
            </PageWrapper>
        );
    }

    if (error) {
        return (
            <PageWrapper
                title="Team Overview"
                description="Meet the people collaborating on your assets."
            >
                <div className="text-red-500 p-4">
                    Error loading team data: {error.message}
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper
            title="Team Overview"
            description="View members and collaborators on your platform."
        >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 fade-in">
                {users?.map((user, index) => (
                    <Card key={user.id} glass hover className={`fade-in-delay-${(index % 3) + 1}`}>
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <Avatar className="h-14 w-14 border-2 border-primary/20">
                                <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                                <AvatarFallback className="bg-primary/10 text-primary uppercase text-lg">
                                    {user.name ? user.name.substring(0, 2) : "US"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <CardTitle className="text-lg">{user.name || "Unnamed User"}</CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant={session?.user.id === user.id ? "default" : "secondary"}>
                                        {session?.user.id === user.id ? "You" : "Collaborator"}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Mail className="w-4 h-4 mr-2 text-primary/70" />
                                <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Briefcase className="w-4 h-4 mr-2 text-primary/70" />
                                <span className="truncate">CashFlo Member</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4 mr-2 text-primary/70" />
                                <span>Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {users?.length === 0 && (
                    <div className="col-span-full text-center p-8 text-muted-foreground bg-muted/20 rounded-lg">
                        No team members found.
                    </div>
                )}
            </div>
        </PageWrapper>
    );
}
