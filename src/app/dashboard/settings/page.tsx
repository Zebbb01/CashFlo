// src/app/dashboard/settings/page.tsx
"use client";

import React from "react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Shield, User, Bell } from "lucide-react";

export default function SettingsPage() {
    const { data: session } = useSession();

    return (
        <PageWrapper
            title="Settings"
            description="Manage your account preferences and settings."
        >
            <Tabs defaultValue="profile" className="w-full max-w-4xl fade-in">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="w-4 h-4" /> Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="w-4 h-4" /> Notifications
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                    <Card glass>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your account's profile information and email address.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" defaultValue={session?.user?.name || ""} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue={session?.user?.email || ""} disabled className="bg-muted/50" />
                                <p className="text-xs text-muted-foreground">Your email address cannot be changed right now.</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="gradient">Save Changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <Card glass>
                        <CardHeader>
                            <CardTitle>Update Password</CardTitle>
                            <CardDescription>
                                Ensure your account is using a long, random password to stay secure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current_password">Current Password</Label>
                                <Input id="current_password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new_password">New Password</Label>
                                <Input id="new_password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm_password">Confirm Password</Label>
                                <Input id="confirm_password" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="gradient">Update Password</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                    <Card glass>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>
                                Choose what updates you want to receive.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive emails about your activity and financial changes.
                                    </p>
                                </div>
                                {/* Switch placeholder - you'd integrate a real Switch component here */}
                                <div className="h-6 w-11 rounded-full bg-primary/20 flex items-center p-1 cursor-pointer">
                                    <div className="h-4 w-4 rounded-full bg-primary shadow-sm transform translate-x-5" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Partnership Updates</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive alerts when new colleagues join your assets.
                                    </p>
                                </div>
                                <div className="h-6 w-11 rounded-full bg-primary/20 flex items-center p-1 cursor-pointer">
                                    <div className="h-4 w-4 rounded-full bg-primary shadow-sm transform translate-x-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </PageWrapper>
    );
}
