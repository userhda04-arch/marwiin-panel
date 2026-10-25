"use client"
import Link from "next/link";
import { notify } from "@/lib/notifications";
import { motion } from "framer-motion";
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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { addDays, addMonths, addYears, format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, Clock, Gift, Key, RefreshCw, Server } from "lucide-react";
import { fetchMyServers } from "@/lib/functions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatColorText } from "@/components/formatColorText";

export default function RedeemPage() {
    const [licenseKey, setLicenseKey] = useState("")
    const [isValidKey, setIsValidKey] = useState<boolean>(false)
    const [licenseToAddTime, setLicenseToAddTime] = useState("")
    const [ownedServers, setOwnedServers] = useState([])
    const [isVerifying, setIsVerifying] = useState(false)
    const [isRedeeming, setIsRedeeming] = useState(false)
    const [licenseType, setLicenseType] = useState<string>("")

    const handleLicenseKeyChange = (e: any) => {
        const value = e.target.value;
        const filteredValue = value.replace(/\s+/g, '');
        setLicenseKey(filteredValue);
    };

    const getOwnedServers = async () => {
        try {
            const response = await fetch('/api/me/getOwnedServers');

            if (response.ok) {
                const data = await response.json();
                if (data.message) {
                    setOwnedServers([]);
                    return;
                }

                if (data.ownedServers) {
                    setOwnedServers(data.ownedServers);
                    return;
                }
            }

            setOwnedServers([]);
        } catch (error) {
            console.error('Error getting owned servers', error);
        }
    }

    useEffect(() => {
        getOwnedServers()
    }, [isValidKey]);

    const verifyLicenseKey = async (licenseKey: string) => {
        try {
            setIsVerifying(true);
            if (licenseKey && licenseKey.length >= 10) {
                const response = await fetch('/api/license/check', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        licenseKey: licenseKey,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.message) {
                        if (data.message === "Already_Redeemed") {
                            notify("License", "This license key has already been redeemed by someone.");
                        } else if (data.message === "Already_Redeemed_Me") {
                            notify("License", "You have already redeemed this license key.");
                        } else if (data.message === "Invalid_Key") {
                            notify("License", "This license key is invalid, make sure you typed it correctly.");
                        }
                        setIsVerifying(false);
                        return;
                    }

                    if (data.valid) {
                        setLicenseKey(licenseKey);
                        setIsValidKey(true);
                        setLicenseToAddTime("");

                        // Determine license type
                        if (licenseKey.includes('lifetime')) {
                            setLicenseType("lifetime");
                        } else if (licenseKey.includes('monthly')) {
                            setLicenseType("monthly");
                        } else if (licenseKey.includes('quarterly')) {
                            setLicenseType("quarterly");
                        } else if (licenseKey.includes('yearly')) {
                            setLicenseType("yearly");
                        }

                        getOwnedServers();
                    }
                    setIsVerifying(false);
                    return;
                }
            } else {
                notify("License", "This license key is invalid, make sure you typed it correctly.");
            }

            setLicenseKey("");
            setIsValidKey(false);
            setLicenseToAddTime("");
            setIsVerifying(false);
        } catch (error) {
            console.error('Error verifying key', error);
            setIsVerifying(false);
        }
    }

    const redeemLicense = async (licenseKey: string, licenseToAddTime: string) => {
        try {
            setIsRedeeming(true);
            if (licenseKey && licenseKey.length >= 10) {
                const serverToAddTime = licenseToAddTime === "new_server" ? "" : licenseToAddTime;

                const response = await fetch('/api/license/redeem', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        licenseKey: licenseKey,
                        licenseToAddTime: serverToAddTime,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.message) {
                        notify("License", "An Error has occurred, please try again.")
                        setIsRedeeming(false);
                        return;
                    }

                    if (data.id) {
                        notify("License", "You Successfully redeemed this license key.", "redirect", "Download", `/download`);
                    }
                    setIsRedeeming(false);
                    return;
                }
            } else {
                notify("License", "This license key is invalid, make sure you typed it correctly.");
            }

            setLicenseKey("");
            setIsValidKey(false);
            setLicenseToAddTime("");
            setIsRedeeming(false);
        } catch (error) {
            console.error('Error verifying key', error);
            setIsRedeeming(false);
        }
    }

    const calculateExpiryDate = (key: string) => {
        const now = new Date();

        if (key.includes('lifetime')) {
            return 'No Expiration';
        } else if (key.includes('monthly')) {
            return format(addDays(now, 30), 'yyyy-MM-dd HH:mm:ss');
        } else if (key.includes('quarterly')) {
            return format(addMonths(now, 3), 'yyyy-MM-dd HH:mm:ss');
        } else if (key.includes('yearly')) {
            return format(addYears(now, 1), 'yyyy-MM-dd HH:mm:ss');
        } else {
            return 'Unknown';
        }
    };

    const getLicenseBadge = (type: string) => {
        switch (type) {
            case "lifetime":
                return <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600">Lifetime</Badge>;
            case "monthly":
                return <Badge className="bg-blue-500">30 Days</Badge>;
            case "quarterly":
                return <Badge className="bg-green-500">3 Months</Badge>;
            case "yearly":
                return <Badge className="bg-amber-500">1 Year</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <ContentLayout title="Redeem License">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
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
                            <BreadcrumbPage>Redeem</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </motion.div>

            <motion.div
                className="grid gap-6 mt-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
                        <Gift className="h-5 w-5 text-blue-500" />
                        <AlertTitle className="text-blue-700 dark:text-blue-300">Activate your ADN license</AlertTitle>
                        <AlertDescription className="text-blue-600 dark:text-blue-400">
                            Enter your license key below to unlock all features and start protecting your server.
                        </AlertDescription>
                    </Alert>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="overflow-hidden border-2 border-primary/10">
                        <CardHeader className="bg-primary/5">
                            <div className="flex items-center gap-2">
                                <Key className="h-5 w-5 text-primary" />
                                <CardTitle>Redeem a License Key</CardTitle>
                            </div>
                            <CardDescription>
                                Redeem your license key and start using ADN services right away.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form>
                                <div className="grid w-full items-center gap-6">
                                    {isValidKey ? (
                                        <motion.div
                                            className="space-y-6"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="bg-primary/5 p-3 sm:p-4 rounded-lg border border-primary/10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                    <h3 className="font-medium">Valid License Key</h3>
                                                </div>

                                                <div className="grid gap-3 sm:gap-4">
                                                    <div className="flex flex-col space-y-1">
                                                        <Label className="text-xs text-muted-foreground">License Key</Label>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <code className="bg-background px-2 py-1 rounded border text-sm font-mono overflow-x-auto max-w-full">{licenseKey}</code>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 text-xs"
                                                                onClick={() => { setLicenseKey(""); setIsValidKey(false) }}
                                                            >
                                                                Change
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col space-y-1">
                                                        <Label className="text-xs text-muted-foreground">License Type</Label>
                                                        <div className="flex items-center gap-2">
                                                            {getLicenseBadge(licenseType)}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col space-y-1">
                                                        <Label className="text-xs text-muted-foreground">Expiration</Label>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm">{calculateExpiryDate(licenseKey)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Server className="h-5 w-5 text-primary" />
                                                    <h3 className="font-medium">Server Selection</h3>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="server-select">
                                                        Choose where to apply this license
                                                    </Label>
                                                    <Select onValueChange={(value: any) => setLicenseToAddTime(value)}>
                                                        <SelectTrigger id="server-select" className="w-full">
                                                            <SelectValue placeholder="Create a new server" />
                                                        </SelectTrigger>
                                                        <SelectContent position="popper">
                                                            <SelectItem value="new_server">Create a new server</SelectItem>
                                                            <Separator className="my-1" />
                                                            {ownedServers.length > 0 ? (
                                                                ownedServers.map((server: any, index: number) => (
                                                                    <SelectItem key={server.id} value={server.id}>
                                                                        <span className="truncate block">{formatColorText(server.serverName)}</span>
                                                                    </SelectItem>
                                                                ))
                                                            ) : (
                                                                <div className="px-2 py-1 text-sm text-muted-foreground">
                                                                    No existing servers found
                                                                </div>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {licenseToAddTime && licenseToAddTime !== "new_server"
                                                            ? "This will extend the license duration of your selected server"
                                                            : "This will create a new server with this license"}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            className="space-y-4"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="space-y-2">
                                                <Label htmlFor="licensekey" className="flex items-center">
                                                    License Key
                                                    <TooltipProvider>
                                                        <Tooltip delayDuration={10}>
                                                            <TooltipTrigger asChild>
                                                                <span className="ml-1 text-primary cursor-help">
                                                                    <AlertCircle className="h-4 w-4 inline" />
                                                                </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="right" className="max-w-xs">
                                                                <p>If you don&apos;t know where to find it, check your emails. The license key should be in the format: ADN-type-xxxxx-xxxxx</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </Label>
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <div className="relative flex-grow">
                                                        <Input
                                                            id="licensekey"
                                                            value={licenseKey}
                                                            placeholder="mrw-lifetime-xxxxx-xxxxx"
                                                            onChange={handleLicenseKeyChange}
                                                            className="pr-10"
                                                        />
                                                        {licenseKey && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-foreground"
                                                                onClick={() => setLicenseKey("")}
                                                            >
                                                                <span className="sr-only">Clear</span>
                                                                ×
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <Button
                                                        className="gap-2 min-w-[100px]"
                                                        onClick={(e) => { e.preventDefault(); verifyLicenseKey(licenseKey) }}
                                                        disabled={!licenseKey || isVerifying}
                                                    >
                                                        {isVerifying ? (
                                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        )}
                                                        Verify
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="bg-muted/50 rounded-lg p-4 mt-4">
                                                <h4 className="text-sm font-medium mb-2">License Key Format Examples:</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <code className="text-xs bg-background px-2 py-1 rounded border overflow-x-auto whitespace-nowrap max-w-[180px] sm:max-w-none">mrw-lifetime-xxxxx-xxxxx</code>
                                                        {getLicenseBadge("lifetime")}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <code className="text-xs bg-background px-2 py-1 rounded border overflow-x-auto whitespace-nowrap max-w-[180px] sm:max-w-none">mrwdu-monthly-xxxxx-xxxxx</code>
                                                        {getLicenseBadge("monthly")}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                        {isValidKey && (
                            <CardFooter className="flex flex-col sm:flex-row justify-between border-t bg-muted/20 px-4 sm:px-6 py-4 gap-3">
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                    onClick={() => { setLicenseKey(""); setIsValidKey(false); }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={(e) => { e.preventDefault(); redeemLicense(licenseKey, licenseToAddTime) }}
                                    className="gap-2 w-full sm:w-auto"
                                    disabled={isRedeeming}
                                >
                                    {isRedeeming ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Gift className="h-4 w-4" />
                                    )}
                                    Redeem License
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="border-primary/10">
                        <CardHeader>
                            <CardTitle className="text-lg">Need Help?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                If you're having trouble redeeming your license or have any questions, our support team is here to help.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="https://docs.ADN.xyz/" target="_blank">
                                        Documentation
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="https://discord.com/invite/3UaHD7DWuK" target="_blank">
                                        Contact Support
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </ContentLayout>
    );
}
