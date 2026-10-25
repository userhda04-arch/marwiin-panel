"use client"
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from 'date-fns';

import { ContentLayout } from "@/components/content-layout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    CalendarClock,
    CirclePower,
    Copy,
    Eye,
    EyeOff,
    HardDrive,
    Key,
    Network,
    Pen,
    RefreshCcw,
    Shield,
    Settings,
    Users,
    Ban,
    Trash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notifications";
import { cn } from "@/lib/utils";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogClose } from "@radix-ui/react-dialog";
import { Badge } from "@/components/ui/badge";
import { formatColorText } from "@/components/formatColorText";

export default function ServerOverview({ params }: { params: { licenseId: string; }; }) {
    const licenseId = params.licenseId
    const [licenseData, setLicenseData] = useState<any>([])
    const [newServerName, setNewServerName] = useState<string>("")
    const [showLicenseKey, setShowLicenseKey] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { data: session } = useSession();

    const getServerInfo = async () => {
        if (!session?.user.id) return;
        setIsLoading(true);

        try {
            const response = await fetch('/api/license/info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    licenseId: licenseId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.error || !data.license) {
                    setLicenseData([])
                    return;
                }

                setLicenseData(data.license)
                setNewServerName(data.license.serverName || "");
                return;
            }

            setLicenseData([])
        } catch (error) {
            console.error('Error getting server info', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getServerInfo()
    }, [session?.user.id])

    const calculateServerExpiration = (serverExpiration: string | number) => {
        if (!serverExpiration) return "Unknown";
        if (licenseData.licenseKey?.includes("lifetime")) return "Never";

        serverExpiration = Number(licenseData.serverExpiration)

        const date = new Date(serverExpiration * 1000)
        if (!date.getTime()) return "Never";

        return formatDistanceToNow(date, { addSuffix: true, includeSeconds: true }) || "Never"
    }

    const getExpirationStatus = () => {
        if (!licenseData.serverExpiration) return "unknown";

        const expiration = Number(licenseData.serverExpiration) * 1000;
        const now = Date.now();
        const timeLeft = expiration - now;

        // More than 30 days
        if (timeLeft > 30 * 24 * 60 * 60 * 1000) return "text-green-500";
        // Less than 30 days but more than 7 days
        if (timeLeft > 7 * 24 * 60 * 60 * 1000) return "text-yellow-500";
        // Less than 7 days or expired
        return "text-red-500";
    }

    const deleteServer = async (licenseId: string) => {
        try {
            const response = await fetch('/api/license/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    licenseId: licenseId,
                }),
            });

            if (response.ok) {
                window.location.href = "/dashboard"
                notify("Server", "Server deleted successfully.")
            } else {
                notify("Server", "Failed to delete server, please try again.")
                return;
            }

        } catch (error) {
            console.error('Error deleting server', error);
        }
    }

    const EditServerName = async (newServerName: string) => {
        if (!session?.user.id) return;

        if (!newServerName || newServerName.length < 3 || newServerName.length > 30) {
            notify("Server", "The server name is too short or too long.")
            return;
        }

        try {
            const response = await fetch('/api/server/editServerName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    licenseId: licenseId,
                    serverName: newServerName,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.error || data.message) {
                    notify("Server", "Failed to edit server name, please try again.")
                    return;
                }
            } else {
                notify("Server", "Failed to edit server name, please try again.")
                return;
            }

            getServerInfo()
            notify("Server", "You successfully changed the server name.")
        } catch (error) {
            console.error('Error editing server name', error);
        }
    }

    const ResetIP = async () => {
        if (!session?.user.id) return;

        try {
            const response = await fetch('/api/server/resetIP', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    licenseId: licenseId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.error || data.message) {
                    notify("Server", "Failed to reset IP Address, please try again.")
                    return;
                }
            } else {
                notify("Server", "Failed to reset IP Address, please try again.")
                return;
            }

            getServerInfo()
            notify("Server", "You successfully resetted the IP Address.")
        } catch (error) {
            console.error('Error resetting IP Address', error);
        }
    }

    const expirationStatus = getExpirationStatus();

    if (isLoading) {
        return (
            <ContentLayout title="Server Overview">
                <div className="flex items-center justify-center h-[70dvh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </ContentLayout>
        );
    }

    return (
        <ContentLayout title="Server Overview">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
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
                            <BreadcrumbPage>Overview</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </motion.div>

            <div className="grid gap-6 mt-6">
                {/* Main Server Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card className="overflow-hidden">
                        <div className={`${(!licenseData.bannerUrl || licenseData.bannerUrl === "") ? 'bg-primary' : ''} px-4 sm:px-6 py-4 relative`}>
                            {(licenseData.bannerUrl && licenseData.bannerUrl !== "") && (
                                <div
                                    className="absolute inset-0 bg-cover bg-center z-0"
                                    style={{
                                        backgroundImage: `url(${licenseData.bannerUrl})`,
                                        backgroundSize: 'cover',
                                        opacity: 0.8
                                    }}
                                />
                            )}
                            {(licenseData.bannerUrl && licenseData.bannerUrl !== "") && (
                                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/50 z-0" />
                            )}

                            <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/10 p-2 rounded-full">
                                        <HardDrive className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-white flex flex-wrap items-center gap-2">
                                            {formatColorText(licenseData.serverName || "Unknown Server")}
                                            {licenseData.isOwner && (
                                                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">Owner</Badge>
                                            )}
                                        </h2>
                                        <p className="text-white/80 text-xs sm:text-sm">
                                            Status: <span className="font-medium text-white">Online</span>
                                        </p>
                                    </div>
                                </div>
                                {/* {licenseData.isOwner && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="secondary" size="sm" className="mt-2 sm:mt-0 bg-white/10 text-white hover:bg-white/20 border-0 w-full sm:w-auto">
                                                <Pen className="h-4 w-4 mr-2" />
                                                Edit Name
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px] w-[95%] max-w-[95%] sm:w-auto">
                                        </DialogContent>
                                    </Dialog>
                                )} */}
                            </div>
                        </div>
                        <CardContent className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
                                {/* IP Address */}
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-primary/10 p-1.5 rounded-full">
                                            <Network className="h-4 w-4 text-primary" />
                                        </div>
                                        <Label className="font-medium text-base">IP Address</Label>
                                    </div>
                                    <p className="text-base sm:text-lg font-semibold mb-2 break-all">{licenseData.serverIp || "Not Set"}</p>
                                    {licenseData.isOwner && (
                                        <Button variant="outline" size="sm" onClick={ResetIP} className="self-start w-full sm:w-auto">
                                            <CirclePower className="h-4 w-4 mr-2" />
                                            Reset IP
                                        </Button>
                                    )}
                                </div>

                                {/* License Expiration */}
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-primary/10 p-1.5 rounded-full">
                                            <CalendarClock className="h-4 w-4 text-primary" />
                                        </div>
                                        <Label className="font-medium text-base">License Expiration</Label>
                                    </div>
                                    <p className={cn("text-base sm:text-lg font-semibold mb-2", expirationStatus)}>
                                        {calculateServerExpiration(licenseData.serverExpiration)}
                                    </p>
                                    {(licenseData.isOwner && !licenseData.licenseKey.includes("lifetime")) && (
                                        <Link href="https://waveshield.xyz/#pricing" target="_blank" className="block w-full sm:w-auto sm:inline-block">
                                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                                <RefreshCcw className="h-4 w-4 mr-2" />
                                                Renew License
                                            </Button>
                                        </Link>
                                    )}
                                </div>

                                {/* License Key (Only for owners) */}
                                {(licenseData.isOwner || licenseData.isDeveloper) && (
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="bg-primary/10 p-1.5 rounded-full">
                                                <Key className="h-4 w-4 text-primary" />
                                            </div>
                                            <Label className="font-medium text-base">License Key</Label>
                                        </div>
                                        <div className="relative mb-2">
                                            <Input
                                                value={licenseData.licenseKey ? (showLicenseKey ? licenseData.licenseKey : licenseData.licenseKey.replace(/./g, '*')) : "Unknown"}
                                                readOnly
                                                className="font-mono text-xs sm:text-sm pr-10 bg-muted/50 truncate"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0"
                                                onClick={() => setShowLicenseKey(!showLicenseKey)}
                                            >
                                                {showLicenseKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full sm:w-auto"
                                            onClick={() => {
                                                navigator.clipboard.writeText(licenseData.licenseKey || "Unknown");
                                                notify("Server", "You successfully copied your license key to your clipboard.")
                                            }}
                                        >
                                            <Copy className="h-4 w-4 mr-2" />
                                            Copy Key
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>




                {/* Server Stats */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    >
                    <Card>
                        <CardHeader>
                            <CardTitle>Server Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-muted/50 p-4 rounded-md">
                                    <div className="text-sm text-muted-foreground mb-1">Uptime</div>
                                    <div className="text-2xl font-bold">99.9%</div>
                                    <div className="text-xs text-muted-foreground">Last 30 days</div>
                                </div>
                                
                                <div className="bg-muted/50 p-4 rounded-md">
                                    <div className="text-sm text-muted-foreground mb-1">Attacks Blocked</div>
                                    <div className="text-2xl font-bold">1,254</div>
                                    <div className="text-xs text-muted-foreground">Last 30 days</div>
                                </div>
                                
                                <div className="bg-muted/50 p-4 rounded-md">
                                    <div className="text-sm text-muted-foreground mb-1">Players Online</div>
                                    <div className="text-2xl font-bold">42</div>
                                    <div className="text-xs text-muted-foreground">Current</div>
                                </div>
                                
                                <div className="bg-muted/50 p-4 rounded-md">
                                    <div className="text-sm text-muted-foreground mb-1">Bans</div>
                                    <div className="text-2xl font-bold">87</div>
                                    <div className="text-xs text-muted-foreground">Active bans</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div> */}

                {/* Quick Actions */}
                {(licenseData.isOwner || licenseData.isDeveloper) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                                    {(licenseData.isOwner || licenseData.isDeveloper) && (
                                        <Link href={`/server/${licenseId}/configuration`} className="block">
                                            <Button
                                                variant="outline"
                                                className="w-full h-24 flex flex-col items-center justify-center gap-2"
                                            >
                                                <Settings className="h-6 w-6 text-primary" />
                                                <span>Configure</span>
                                            </Button>
                                        </Link>
                                    )}

                                    <Link href={`/server/${licenseId}/members`} className="block">
                                        <Button
                                            variant="outline"
                                            className="w-full h-24 flex flex-col items-center justify-center gap-2"
                                        >
                                            <Users className="h-6 w-6 text-primary" />
                                            <span>Permissions</span>
                                        </Button>
                                    </Link>

                                    {licenseData.isOwner && (
                                        <Button
                                            variant="outline"
                                            onClick={ResetIP}
                                            className="h-24 flex flex-col items-center justify-center gap-2"
                                        >
                                            <CirclePower className="h-6 w-6 text-primary" />
                                            <span>Reset IP</span>
                                        </Button>
                                    )}

                                    {/* {licenseData.isOwner && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="h-24 flex flex-col items-center justify-center gap-2"
                                                >
                                                    <Pen className="h-6 w-6 text-primary" />
                                                    <span>Edit Name</span>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Edit server name</DialogTitle>
                                                    <DialogDescription>
                                                        Rename your server.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                            New Name
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            placeholder="Enter server name"
                                                            className="col-span-3"
                                                            value={newServerName}
                                                            onChange={(e) => { setNewServerName(e.target.value) }}
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose>
                                                        <Button onClick={() => { EditServerName(newServerName) }}>Save changes</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )} */}

                                    {(licenseData.isOwner || licenseData.isDeveloper) && (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                navigator.clipboard.writeText(licenseData.licenseKey || "Unknown");
                                                notify("Server", "You successfully copied your license key to your clipboard.")
                                            }}
                                            className="h-24 flex flex-col items-center justify-center gap-2"
                                        >
                                            <Copy className="h-6 w-6 text-primary" />
                                            <span>Copy Key</span>
                                        </Button>
                                    )}

                                    {(licenseData.isOwner && !licenseData.licenseKey.includes("lifetime")) && (
                                        <Link href="https://waveshield.xyz/#pricing" target="_blank" className="block">
                                            <Button
                                                variant="outline"
                                                className="w-full h-24 flex flex-col items-center justify-center gap-2"
                                            >
                                                <RefreshCcw className="h-6 w-6 text-primary" />
                                                <span>Renew</span>
                                            </Button>
                                        </Link>
                                    )}

                                    {(licenseData.isOwner) && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    className="w-full h-24 flex flex-col items-center justify-center gap-2"
                                                >
                                                    <Trash className="h-6 w-6 text-destructive text-white" />
                                                    <span>Delete Server</span>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Are you sure?</DialogTitle>
                                                    <DialogDescription>
                                                        This will delete the server and all of its data. This action cannot be undone.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <Button variant="outline">Cancel</Button>
                                                    <Button variant="destructive" onClick={() => deleteServer(licenseData.id)}>Delete</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

            </div>
        </ContentLayout>
    );
}
