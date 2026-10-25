"use client"
import { ContentLayout } from "@/components/content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputTags } from "@/components/ui/input-tags";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { categories, configuration } from "@/config/configuration";
import { notify } from "@/lib/notifications";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Info, Upload, Download, RefreshCw, Save, X } from "lucide-react";
import Masonry from 'react-masonry-css';

const defaultConfig = require("@/config/defaultConfig.json")

export default function ServerConfiguration({ params }: { params: { licenseId: string; }; }) {
    const licenseId = params.licenseId;
    const { data: session } = useSession();
    const [serverConfiguration, setServerConfiguration] = useState<any>();
    const [selectedTab, setSelectedTab] = useState("Main");
    const [sharedConfigId, setSharedConfigId] = useState<string>();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isMobile, setIsMobile] = useState(false);

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const mergeWithDefaults = (fetchedConfig: any, defaultConfig: any) => {
        if (!fetchedConfig) return defaultConfig;
        
        const mergedConfig = { ...defaultConfig };
        
        // For each category in the fetched config
        Object.keys(fetchedConfig).forEach(category => {
            if (mergedConfig[category]) {
                // Merge this category with defaults
                mergedConfig[category] = {
                    ...mergedConfig[category],
                    ...fetchedConfig[category]
                };
            } else {
                // If category doesn't exist in defaults, use fetched version
                mergedConfig[category] = fetchedConfig[category];
            }
        });
        
        return mergedConfig;
    };

    const getServerConfig = async () => {
        if (!session?.user.id) return;
    
        try {
            const response = await fetch('/api/server/configuration/get', {
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
                if (data.error || data.message || !data.configuration) {
                    setServerConfiguration(undefined);
                    return;
                }
    
                // Merge the fetched configuration with default values
                const mergedConfig = mergeWithDefaults(data.configuration, defaultConfig);
                setServerConfiguration(mergedConfig);
                return;
            } else {
                setServerConfiguration(undefined);
            }
    
        } catch (error) {
            console.error('Error getting server config', error);
        }
    }

    function resetConfiguration() {
        // Pass the defaultConfig directly to saveConfiguration instead of relying on state
        const resetAndSave = async () => {
            setServerConfiguration(defaultConfig);

            try {
                const response = await fetch('/api/server/configuration/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        licenseId: licenseId,
                        configuration: defaultConfig, // Use defaultConfig directly
                    }),
                });

                if (response.ok) {
                    notify("Server", "Configuration reset successfully. Please reload WaveShield.");
                } else {
                    notify("Server", "An error occurred while resetting configuration.");
                }
            } catch (error) {
                console.error('Error resetting configuration', error);
                notify("Server", "An error occurred while resetting configuration.");
            }
        };

        resetAndSave();
    }


    const importConfig = async () => {
        if (!session?.user.id) return;

        if (!sharedConfigId || sharedConfigId.length < 5) {
            notify("Config", "The config ID you entered is invalid.")
            return;
        }

        try {
            const response = await fetch('/api/config/get', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    configId: sharedConfigId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.error || data.message || !data.config) {
                    setSharedConfigId(undefined);
                    notify("Config", "The config ID you entered is invalid.")
                    return;
                }

                notify("Config", "You successfully imported this configuration, you need to manually save it.")
                setSharedConfigId(undefined);
                setServerConfiguration(data.config);
                return;
            } else {
                setSharedConfigId(undefined);
                notify("Config", "The config ID you entered is invalid.")
            }

        } catch (error) {
            console.error('Error getting server config', error);
        }
    }

    const shareConfiguration = async () => {
        if (!session?.user.id) return;

        try {
            const tempConfig = serverConfiguration
            if (tempConfig.Settings) {
                tempConfig.Settings.MainWebhook = ""
                tempConfig.Settings.EntitiesWebhook = ""
                tempConfig.Settings.ExplosionsWebhook = ""
                tempConfig.Settings.WeaponsWebhook = ""
                tempConfig.Settings.UnbansWebhook = ""
                tempConfig.Settings.ConnectionsWebhook = ""
                tempConfig.Settings.ScreenshotsWebhook = ""
                tempConfig.Settings.CommunityLogsWebhook = ""
            }

            const response = await fetch('/api/config/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    configuration: tempConfig,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.error || data.message || !data.configId) {
                    notify("Config", "An error has occurred while sharing the config, please try again.")
                    return;
                }

                notify("Config", `You successfully created a config, copied to your clipboard. ID: ${data.configId}`)
                navigator.clipboard.writeText(data.configId)
                return;
            } else {
                notify("Config", "An error has occurred while sharing the config, please try again.")
            }

        } catch (error) {
            console.error('Error getting server config', error);
        }
    }

    const saveConfiguration = async () => {
        if (!session?.user.id) return;

        try {
            const response = await fetch('/api/server/configuration/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    licenseId: licenseId,
                    configuration: serverConfiguration,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.error || data.message) {
                    notify("Server", "An error occurred while saving configuration, please try again.");
                    return;
                }

                notify("Server", "You successfully saved the configuration. Please reload WaveShield.");
                return;
            } else {
                notify("Server", "An error occurred while saving configuration, please try again.");
            }

        } catch (error) {
            console.error('Error getting server config', error);
        }
    }

    function handleConfigChange(item: any, value: any, type?: string) {
        let updatedValue = value;

        const updatedConfig = {
            ...serverConfiguration,
            [selectedTab]: {
                ...serverConfiguration[selectedTab],
                [item]: updatedValue
            }
        };

        setServerConfiguration(updatedConfig);
    }

    // Handle search functionality
    useEffect(() => {
        if (!searchQuery || !serverConfiguration) {
            setSearchResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const flatResults: any[] = [];

        // Search through all categories and find matching items
        categories.forEach((category, categoryIndex) => {
            if (!serverConfiguration[category]) return;

            // Look through configuration for this category
            Object.entries(configuration[categoryIndex]).forEach(([key, configGroup]: [string, any]) => {
                const matchingItems = configGroup.Data?.filter((item: any) =>
                    item.name.toLowerCase().includes(query) ||
                    (item.tooltip && item.tooltip.toLowerCase().includes(query))
                );

                if (matchingItems && matchingItems.length > 0) {
                    // Add this as a flat result with all necessary context
                    flatResults.push({
                        key,
                        category,
                        config: {
                            ...configGroup,
                            Data: matchingItems
                        }
                    });
                }
            });
        });

        setSearchResults(flatResults);
    }, [searchQuery, serverConfiguration]);

    useEffect(() => {
        getServerConfig()
    }, [session?.user.id])

    // Masonry breakpoints - important to ensure columns work correctly
    const breakpointColumnsObj = {
        default: 3,   // 3 columns on desktop
        1100: 2,      // 2 columns on medium screens
        767: 1        // 1 column on mobile - key change to ensure full width
    };

    // Custom CSS for Masonry to handle mobile correctly
    const masonryStyles = {
        display: 'flex',
        marginLeft: '-16px', // Matches pl-4 (16px)
        width: 'auto',
    };

    const masonryColumnStyles = {
        paddingLeft: '16px', // Matches pl-4 (16px)
        backgroundClip: 'padding-box',
        width: '100%' // Ensure column takes full width
    };

    // InfoIcon component - shows tooltip on desktop, popover on mobile
    const InfoIcon = ({ tooltip }: { tooltip: string }) => {
        if (isMobile) {
            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-muted-foreground rounded-full">
                            <Info className="h-3.5 w-3.5" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 text-sm p-3">
                        {tooltip}
                    </PopoverContent>
                </Popover>
            );
        }

        return (
            <TooltipProvider>
                <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-muted-foreground rounded-full">
                            <Info className="h-3.5 w-3.5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-64 text-sm p-2">
                        {tooltip}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    };

    return (
        <ContentLayout title="Configuration">
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
                        <BreadcrumbPage>Configuration</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Control Panel - Always visible */}
            <div className="mt-6 bg-card rounded-lg shadow-md border border-primary/10 overflow-hidden mb-4">
                <div className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        {/* Search */}
                        <div className="relative lg:col-span-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search settings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-10 h-10 w-full border-primary/10 bg-background/80"
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                    onClick={() => setSearchQuery("")}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="lg:col-span-2 flex flex-wrap gap-2 justify-end">
                            {/* Primary Actions */}
                            <div className="flex gap-1.5 sm:gap-2 mr-auto lg:mr-0">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-10 px-2 sm:px-3 min-w-9">
                                            <Upload className="h-4 w-4 sm:mr-1.5" />
                                            <span className="hidden sm:inline">Import</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="w-[calc(100%-32px)] sm:max-w-[425px] p-4 sm:p-6">
                                        <DialogHeader className="pb-2 space-y-1">
                                            <DialogTitle className="text-xl">Import Configuration</DialogTitle>
                                            <DialogDescription className="text-sm">
                                                Enter the config ID below.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-3">
                                            <Label htmlFor="configId" className="text-sm font-medium mb-1.5 block">Config ID</Label>
                                            <Input
                                                id="configId"
                                                type="text"
                                                value={sharedConfigId}
                                                placeholder="8aece6cb-506e-4d51-9770-389235fa23fb"
                                                onChange={(e: any) => { setSharedConfigId(e.target.value) }}
                                                className="h-11"
                                            />
                                        </div>
                                        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-2">
                                            <DialogClose asChild>
                                                <Button variant="secondary" className="w-full sm:w-auto h-11">Cancel</Button>
                                            </DialogClose>
                                            <DialogClose asChild>
                                                <Button onClick={importConfig} className="w-full sm:w-auto h-11">Import</Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 px-2 sm:px-3 min-w-9"
                                    onClick={shareConfiguration}
                                >
                                    <Download className="h-4 w-4 sm:mr-1.5" />
                                    <span className="hidden sm:inline">Share</span>
                                </Button>
                            </div>

                            {/* Critical Actions */}
                            <div className="flex gap-1.5 sm:gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="h-10 px-2 sm:px-3 min-w-9"
                                        >
                                            <RefreshCw className="h-4 w-4 sm:mr-1.5" />
                                            <span className="hidden sm:inline">Reset</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="w-[calc(100%-32px)] sm:max-w-[425px] p-4 sm:p-6">
                                        <DialogHeader className="pb-2 space-y-1">
                                            <DialogTitle className="text-xl">Reset Configuration</DialogTitle>
                                            <DialogDescription className="text-sm">
                                                This will reset all settings to default values.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-4">
                                            <DialogClose asChild>
                                                <Button variant="secondary" className="w-full sm:w-auto h-11">Cancel</Button>
                                            </DialogClose>
                                            <DialogClose asChild>
                                                <Button variant="destructive" onClick={resetConfiguration} className="w-full sm:w-auto h-11">Reset</Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="h-10 px-2 sm:px-3 min-w-9"
                                        >
                                            <X className="h-4 w-4 sm:mr-1.5" />
                                            <span className="hidden sm:inline">Cancel</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="w-[calc(100%-32px)] sm:max-w-[425px] p-4 sm:p-6">
                                        <DialogHeader className="pb-2 space-y-1">
                                            <DialogTitle className="text-xl">Cancel Changes</DialogTitle>
                                            <DialogDescription className="text-sm">
                                                Discard all unsaved changes?
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-4">
                                            <DialogClose asChild>
                                                <Button variant="secondary" className="w-full sm:w-auto h-11">No</Button>
                                            </DialogClose>
                                            <DialogClose asChild>
                                                <Button onClick={getServerConfig} className="w-full sm:w-auto h-11">Yes, Cancel Changes</Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                <Button
                                    size="sm"
                                    className="h-10 px-3 sm:px-4"
                                    onClick={saveConfiguration}
                                >
                                    <Save className="h-4 w-4 mr-1.5" />
                                    <span>Save</span>
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {!searchQuery ? (
                <Tabs defaultValue="Main" value={selectedTab} onValueChange={setSelectedTab}>
                    {/* Improved TabsList */}
                    <div className="bg-card/70 rounded-lg shadow-sm border border-primary/5 mb-4">
                        <TabsList className="flex w-full h-auto p-2 justify-start gap-1 bg-transparent overflow-x-auto">
                            {categories.map((category: string) => (
                                <TabsTrigger
                                    key={category}
                                    value={category}
                                    className="rounded-md px-4 py-2 flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm text-muted-foreground"
                                >
                                    {category}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {/* Tab Content */}
                    {categories.map((category: string, index: number) => (
                        <TabsContent key={category} value={category} className="mt-0 w-full">
                            {serverConfiguration && (
                                <Masonry
                                    breakpointCols={breakpointColumnsObj}
                                    className="my-masonry-grid"
                                    columnClassName="my-masonry-grid_column"
                                >
                                    {Object.entries(configuration[index]).map(([key, config]) => (
                                        <Card key={key} className="mb-4 bg-card/95 border-2 border-primary/5 shadow-lg shadow-primary/5 hover:border-primary/10 transition-all w-full">
                                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                                <div className="flex items-center">
                                                    <config.Icon className="text-primary h-5 w-5 mr-2" />
                                                    <CardTitle className="text-lg">{key}</CardTitle>
                                                </div>
                                            </CardHeader>

                                            <CardContent>
                                                {config?.Data?.map((item: any) => (
                                                    <div key={item.value}>
                                                        {item.type === "boolean" && (
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <Checkbox
                                                                    checked={serverConfiguration[categories[index]][item.value]}
                                                                    onCheckedChange={(value) => {
                                                                        handleConfigChange(item.value, value);
                                                                    }}
                                                                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                                />
                                                                <div className="flex items-center gap-1">
                                                                    <label className="text-sm font-medium leading-none">
                                                                        {item.name}
                                                                    </label>
                                                                    {item.tooltip && <InfoIcon tooltip={item.tooltip} />}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {(item.type === "number" || item.type === "string") && (
                                                            <div className="grid w-full items-center gap-1.5 mb-1">
                                                                <div className="flex items-center gap-1">
                                                                    <Label htmlFor={item.value} className="text-sm font-medium">
                                                                        {item.name}
                                                                    </Label>
                                                                    {item.tooltip && <InfoIcon tooltip={item.tooltip} />}
                                                                </div>
                                                                <Input
                                                                    id={item.value}
                                                                    type={item.type}
                                                                    value={serverConfiguration[categories[index]][item.value] || ""}
                                                                    onChange={(event) => handleConfigChange(item.value, event.target.value)}
                                                                    className="bg-background border-primary/20"
                                                                />
                                                            </div>
                                                        )}

                                                        {item.type === "list" && (
                                                            <div className="grid w-full items-center gap-1.5 mb-1">
                                                                <div className="flex items-center gap-1">
                                                                    <Label htmlFor={item.value} className="text-sm font-medium">
                                                                        {item.name}
                                                                    </Label>
                                                                    {item.tooltip && <InfoIcon tooltip={item.tooltip} />}
                                                                </div>
                                                                <InputTags
                                                                    value={serverConfiguration[categories[index]][item.value] || []}
                                                                    onChange={(newValues) => {
                                                                        handleConfigChange(item.value, newValues);
                                                                    }}
                                                                    placeholder={item.placeholder}
                                                                    className="max-h-[200px] overflow-y-auto bg-background border-primary/20"
                                                                />
                                                            </div>
                                                        )}

                                                        {item.type === "transferlist" && (
                                                            <div className="grid w-full items-center gap-1.5 mb-1">
                                                                <div className="flex items-center gap-1">
                                                                    <Label htmlFor={item.value} className="text-sm font-medium">
                                                                        {item.name}
                                                                    </Label>
                                                                    {item.tooltip && <InfoIcon tooltip={item.tooltip} />}
                                                                </div>
                                                                <MultiSelect
                                                                    options={item.values}
                                                                    selected={serverConfiguration[categories[index]][item.value] || []}
                                                                    onChange={(newValues: any) => {
                                                                        handleConfigChange(item.value, newValues);
                                                                    }}
                                                                    className="max-h-[200px] overflow-y-auto bg-background border-primary/20"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Masonry>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            ) : (
                // Display search results
                <div>
                    {searchResults.length === 0 ? (
                        <div className="rounded-lg bg-card p-8 text-center border-2 border-primary/5 shadow-lg shadow-primary/5">
                            <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => setSearchQuery("")}
                            >
                                Clear search
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="bg-card/70 p-3 rounded-lg shadow-sm border border-primary/5 mb-4">
                                <h3 className="text-md font-medium mb-2">Search results for "{searchQuery}"</h3>
                                <p className="text-xs text-muted-foreground mb-2">Found {searchResults.length} matching settings</p>
                            </div>

                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="my-masonry-grid"
                                columnClassName="my-masonry-grid_column"
                            >
                                {searchResults.map((result, index) => (
                                    <Card key={`${result.category}-${result.key}-${index}`} className="mb-4 bg-card/95 border-2 border-primary/5 shadow-lg shadow-primary/5 hover:border-primary/10 transition-all w-full">
                                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                                            <div className="flex items-center">
                                                <result.config.Icon className="text-primary h-5 w-5 mr-2" />
                                                <div>
                                                    <CardTitle className="text-lg">{result.key}</CardTitle>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            {result.config?.Data?.map((item: any) => (
                                                <div key={item.value}>
                                                    {item.type === "boolean" && (
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <Checkbox
                                                                checked={serverConfiguration[result.category][item.value]}
                                                                onCheckedChange={(value) => {
                                                                    const updatedConfig = {
                                                                        ...serverConfiguration,
                                                                        [result.category]: {
                                                                            ...serverConfiguration[result.category],
                                                                            [item.value]: value
                                                                        }
                                                                    };
                                                                    setServerConfiguration(updatedConfig);
                                                                }}
                                                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                            />
                                                            <div className="flex items-center gap-1">
                                                                <label className="text-sm font-medium leading-none">
                                                                    {item.name}
                                                                </label>
                                                                {item.tooltip && <InfoIcon tooltip={item.tooltip} />}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {(item.type === "number" || item.type === "string") && (
                                                        <div className="grid w-full items-center gap-1.5 mb-1">
                                                            <div className="flex items-center gap-1">
                                                                <Label htmlFor={`${result.category}-${item.value}`} className="text-sm font-medium">
                                                                    {item.name}
                                                                </Label>
                                                                {item.tooltip && <InfoIcon tooltip={item.tooltip} />}
                                                            </div>
                                                            <Input
                                                                id={`${result.category}-${item.value}`}
                                                                type={item.type}
                                                                value={serverConfiguration[result.category][item.value] || ""}
                                                                onChange={(event) => {
                                                                    const updatedConfig = {
                                                                        ...serverConfiguration,
                                                                        [result.category]: {
                                                                            ...serverConfiguration[result.category],
                                                                            [item.value]: event.target.value
                                                                        }
                                                                    };
                                                                    setServerConfiguration(updatedConfig);
                                                                }}
                                                                className="bg-background border-primary/20"
                                                            />
                                                        </div>
                                                    )}

                                                    {item.type === "list" && (
                                                        <div className="grid w-full items-center gap-1.5 mb-1">
                                                            <div className="flex items-center gap-1">
                                                                <Label htmlFor={`${result.category}-${item.value}`} className="text-sm font-medium">
                                                                    {item.name}
                                                                </Label>
                                                                {item.tooltip && <InfoIcon tooltip={item.tooltip} />}
                                                            </div>
                                                            <InputTags
                                                                value={serverConfiguration[result.category][item.value] || []}
                                                                onChange={(newValues) => {
                                                                    const updatedConfig = {
                                                                        ...serverConfiguration,
                                                                        [result.category]: {
                                                                            ...serverConfiguration[result.category],
                                                                            [item.value]: newValues
                                                                        }
                                                                    };
                                                                    setServerConfiguration(updatedConfig);
                                                                }}
                                                                placeholder={item.placeholder}
                                                                className="max-h-[200px] overflow-y-auto bg-background border-primary/20"
                                                            />
                                                        </div>
                                                    )}

                                                    {item.type === "transferlist" && (
                                                        <div className="grid w-full items-center gap-1.5 mb-1">
                                                            <div className="flex items-center gap-1">
                                                                <Label htmlFor={`${result.category}-${item.value}`} className="text-sm font-medium">
                                                                    {item.name}
                                                                </Label>
                                                                {item.tooltip && <InfoIcon tooltip={item.tooltip} />}
                                                            </div>
                                                            <MultiSelect
                                                                options={item.values}
                                                                selected={serverConfiguration[result.category][item.value] || []}
                                                                onChange={(newValues: any) => {
                                                                    const updatedConfig = {
                                                                        ...serverConfiguration,
                                                                        [result.category]: {
                                                                            ...serverConfiguration[result.category],
                                                                            [item.value]: newValues
                                                                        }
                                                                    };
                                                                    setServerConfiguration(updatedConfig);
                                                                }}
                                                                className="max-h-[200px] overflow-y-auto bg-background border-primary/20"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                ))}
                            </Masonry>
                        </>

                    )}
                </div>
            )}

            {/* Add global CSS needed for masonry grid */}
            <style jsx global>{`
            .my-masonry-grid {
                display: flex;
                margin-left: -16px; /* gutter size */
                width: auto;
            }
            .my-masonry-grid_column {
                padding-left: 16px; /* gutter size */
                background-clip: padding-box;
            }
            
            /* Mobile-specific overrides to ensure full width */
            @media (max-width: 767px) {
                .my-masonry-grid_column {
                    width: 100% !important;
                }
                .my-masonry-grid_column > div {
                    width: 100% !important;
                }
            }
        `}</style>
        </ContentLayout>
    );
}