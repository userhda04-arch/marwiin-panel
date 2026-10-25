"use client"
import { ContentLayout } from "@/components/content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Settings, AlertCircle, Bell } from "lucide-react";

export default function ServerAdminPanel({ params }: { params: { licenseId: string; }; }) {
    const licenseId = params.licenseId
    const { data: session } = useSession();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    return (
        <ContentLayout title="Admin Panel">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink>
                            <Link href={`/server/${licenseId}`}>Server</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Admin Panel</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="mt-6 overflow-hidden border-2">
                    <CardHeader className="px-7 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Admin Panel
                                    <Badge variant="outline" className="ml-2 bg-blue-500/10 text-blue-500 border-blue-500/20">
                                        Coming Soon
                                    </Badge>
                                </CardTitle>
                                <CardDescription className="mt-2 text-base">
                                    Advanced server management tools are being developed
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-muted-foreground">{formatDate(currentTime)}</div>
                                <div className="text-sm font-mono">
                                    {currentTime.toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="p-7">
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <Card className="bg-gradient-to-br from-blue-500/5 to-blue-600/10 border-blue-500/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium flex items-center">
                                        <Settings className="h-4 w-4 mr-2 text-blue-500" />
                                        Management
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">Advanced server settings and management options</p>
                                </CardContent>
                            </Card>
                            
                            <Card className="bg-gradient-to-br from-purple-500/5 to-purple-600/10 border-purple-500/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-2 text-purple-500" />
                                        Monitoring
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">Real-time server monitoring and analytics</p>
                                </CardContent>
                            </Card>
                            
                            <Card className="bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 border-emerald-500/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium flex items-center">
                                        <Bell className="h-4 w-4 mr-2 text-emerald-500" />
                                        Notifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">Custom alerts and notification settings</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                        
                        <motion.div
                            className="rounded-lg border bg-card p-6 flex flex-col items-center justify-center text-center"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <Clock className="h-12 w-12 text-blue-500 mb-4 opacity-80" />
                            <h3 className="text-xl font-semibold mb-2">Admin Panel Coming Soon</h3>
                            <p className="text-muted-foreground max-w-md mb-4">
                                We're working hard to bring you powerful admin tools for your WaveShield server. 
                                The admin panel will provide advanced monitoring, alerts, and management capabilities.
                            </p>
                            <div className="flex gap-2">
                                <Link href="https://discord.gg/waveshield" target="_blank">
                                    <Button variant="outline">Join Discord</Button>
                                </Link>
                                
                                <Link href={`/server/${licenseId}`}>
                                    <Button variant="default">Back to Dashboard</Button>
                                </Link>
                            </div>
                        </motion.div>
                    </CardContent>
                    
                    <CardFooter className="px-7 py-4 bg-muted/20 border-t flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            License ID: {licenseId}
                        </p>
                        <Badge variant="outline" className="bg-blue-500/5">
                            Beta
                        </Badge>
                    </CardFooter>
                </Card>
            </motion.div>
        </ContentLayout>
    );
}
