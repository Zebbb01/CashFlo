// src/app/dashboard/quick-actions/page.tsx
"use client";

import React from "react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Link as LinkIcon, Users, Settings, Activity, Building, Calculator } from "lucide-react";
import Link from "next/link";

export default function QuickActionsPage() {
    const actions = [
        {
            id: "manage-transactions",
            title: "Log Transactions",
            description: "Quickly log new revenues or expenses.",
            icon: <Activity className="w-8 h-8 text-primary" />,
            href: "/dashboard/financial-management",
            color: "from-green-500/20 to-emerald-500/10",
        },
        {
            id: "add-asset",
            title: "Add New Asset",
            description: "Track a new bank account or physical asset.",
            icon: <Building className="w-8 h-8 text-primary" />,
            href: "/dashboard/financial-assets",
            color: "from-blue-500/20 to-indigo-500/10",
        },
        {
            id: "invite-colleague",
            title: "Invite Colleague",
            description: "Share access and manage asset partnerships.",
            icon: <Users className="w-8 h-8 text-primary" />,
            href: "/dashboard/financial-colleagues",
            color: "from-purple-500/20 to-fuchsia-500/10",
        },
        {
            id: "financial-reports",
            title: "View Reports",
            description: "Dive deep into your financial analytics.",
            icon: <Calculator className="w-8 h-8 text-primary" />,
            href: "/dashboard/general",
            color: "from-orange-500/20 to-red-500/10",
        },
        {
            id: "account-settings",
            title: "Account Settings",
            description: "Update your profile or security settings.",
            icon: <Settings className="w-8 h-8 text-primary" />,
            href: "/dashboard/settings",
            color: "from-slate-500/20 to-gray-500/10",
        },
    ];

    return (
        <PageWrapper
            title="Action Hub"
            description="Quickly jump to your most frequent tasks and workflows."
        >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 fade-in">
                {actions.map((action, index) => (
                    <Card key={action.id} glass hover className={`flex flex-col h-full fade-in-delay-${(index % 3) + 1}`}>
                        <CardHeader>
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}>
                                {action.icon}
                            </div>
                            <CardTitle>{action.title}</CardTitle>
                            <CardDescription className="h-10">{action.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto pt-6">
                            <Link href={action.href} className="w-full">
                                <Button variant="outline" className="w-full justify-between group">
                                    Go to Feature
                                    <LinkIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}

                {/* Placeholder for future expansion */}
                <Card glass className="flex flex-col items-center justify-center h-full text-center p-8 border-dashed border-2 opacity-60">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <PlusCircle className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-muted-foreground">More Actions Coming</CardTitle>
                    <CardDescription>Custom workflows currently in development.</CardDescription>
                </Card>
            </div>
        </PageWrapper>
    );
}
