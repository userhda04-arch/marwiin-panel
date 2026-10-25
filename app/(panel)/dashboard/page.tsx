"use client"
import Link from "next/link";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Activity, Rocket, Users, Wifi, Shield, Clock, ArrowUpRight, Download, Server, AlertTriangle, Loader, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, formatDistanceToNow, parseISO, startOfHour } from 'date-fns';
import { Icons } from "@/components/icons";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchLatestVersion } from "@/lib/utils";
import { ActivityType, ActivityTypeLabel, ServerActivity } from "@/types/types";
import {
  Edit,
  RefreshCw,
  PlusCircle,
  UserPlus,
  UserMinus,
  UserCog,
  Settings,
  RefreshCcw,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatColorText } from "@/components/formatColorText";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function DashboardPage() {
  const [commits, setCommits] = useState([]);
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  const [versionInfo, setVersionInfo] = useState({
    version: "Loading...",
    updatedAt: new Date()
  });
  const [backendStatus, setBackendStatus] = useState({
    online: false,
    loading: true
  });

  const { data: session } = useSession();

  const getRecentActivities = async () => {
    if (!session?.user.id) return;

    try {
      const response = await fetch('/api/me/getServersRecentActivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.activities) {
          setActivities(data.activities);
        }
      }
    } catch (error) {
      console.error('Error fetching recent activities', error);
    } finally {
      setLoadingActivities(false);
    }
  };

  const checkBackendStatus = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch("/api/status", {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setBackendStatus({
        online: response.ok,
        loading: false
      });
    } catch (error) {
      console.error("Error checking backend status:", error);
      setBackendStatus({
        online: false,
        loading: false
      });
    }
  };


  const getVersionInfo = async () => {
    try {
      const version = await fetchLatestVersion();
      if (version) {
        setVersionInfo(version);
      }
    } catch (error) {
      console.error('Error fetching version information', error);
      setVersionInfo({
        version: "4.4.68",
        updatedAt: new Date()
      });
    }
  };

  const getCommits = async () => {
    if (!session?.user.id) return;

    try {
      const response = await fetch('/api/changelogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.error || !data.commits) {
          return;
        }

        const groupedCommits: any = {};

        data.commits.forEach((commit: any) => {
          const date = format(startOfHour(new Date(commit.commit.author.date)), 'yyyy-MM-dd HH:00');
          if (!groupedCommits[date]) {
            groupedCommits[date] = [];
          }
          groupedCommits[date].push(commit);
        });

        setCommits(groupedCommits);
      }
    } catch (error) {
      console.error('Error getting commits', error);
    } finally {
      setLoading(false);
    }
  };

  const getMyServers = async () => {
    try {
      const response = await fetch("/api/me/getMyServers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.myServers && data.myServers.length > 0) {
          setServers(data.myServers.filter((server: any) => new Date(server.serverExpiration * 1000) > new Date()));
        } else {
          setServers([]);
        }
      } else {
        setServers([]);
      }
    } catch (error) {
      console.error('Error fetching servers', error);
      setServers([]);
    }
  };

  useEffect(() => {
    if (!session?.user.id) return;

    getCommits();
    getMyServers();
    getVersionInfo();
    checkBackendStatus();
    getRecentActivities()

    const timer = setTimeout(() => setProgress(66), 100);
    return () => clearTimeout(timer);
  }, [session?.user.id]);

  const formattedReleaseDate = versionInfo.updatedAt
    ? format(new Date(versionInfo.updatedAt), 'MMMM d, yyyy')
    : "Recent";

  const getActivityIcon = (activityType: ActivityType) => {
    switch (activityType) {
      case ActivityType.SERVER_START:
        return <Server className="h-3 w-3" />;
      case ActivityType.SERVER_STOP:
        return <Server className="h-3 w-3" />;
      case ActivityType.SERVER_RENAME:
        return <Edit className="h-3 w-3" />;
      case ActivityType.SERVER_EXPIRED:
        return <AlertTriangle className="h-3 w-3" />;
      case ActivityType.SERVER_RENEW:
        return <RefreshCw className="h-3 w-3" />;
      case ActivityType.SERVER_CREATE:
        return <PlusCircle className="h-3 w-3" />;
      case ActivityType.MEMBER_ADD:
        return <UserPlus className="h-3 w-3" />;
      case ActivityType.MEMBER_REMOVE:
        return <UserMinus className="h-3 w-3" />;
      case ActivityType.MEMBER_UPDATE:
        return <UserCog className="h-3 w-3" />;
      case ActivityType.CONFIG_UPDATE:
        return <Settings className="h-3 w-3" />;
      case ActivityType.IP_RESET:
        return <RefreshCcw className="h-3 w-3" />;
      case ActivityType.DOWNLOAD:
        return <Download className="h-3 w-3" />;
      default:
        return <Server className="h-3 w-3" />;
    }
  };

  // Helper function to get color for activity type
  const getActivityColor = (activityType: ActivityType) => {
    switch (activityType) {
      case ActivityType.SERVER_START:
        return 'bg-green-500/10 text-green-500';
      case ActivityType.SERVER_STOP:
        return 'bg-red-500/10 text-red-500';
      case ActivityType.SERVER_RENAME:
        return 'bg-blue-500/10 text-blue-500';
      case ActivityType.SERVER_EXPIRED:
        return 'bg-orange-500/10 text-orange-500';
      case ActivityType.SERVER_RENEW:
        return 'bg-green-500/10 text-green-500';
      case ActivityType.SERVER_CREATE:
        return 'bg-purple-500/10 text-purple-500';
      case ActivityType.MEMBER_ADD:
        return 'bg-green-500/10 text-green-500';
      case ActivityType.MEMBER_REMOVE:
        return 'bg-red-500/10 text-red-500';
      case ActivityType.MEMBER_UPDATE:
        return 'bg-blue-500/10 text-blue-500';
      case ActivityType.CONFIG_UPDATE:
        return 'bg-yellow-500/10 text-yellow-500';
      case ActivityType.IP_RESET:
        return 'bg-purple-500/10 text-purple-500';
      case ActivityType.DOWNLOAD:
        return 'bg-blue-500/10 text-blue-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <ContentLayout title="Dashboard">
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
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-6">
          <motion.div
            className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-full md:w-3/4">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}!</h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Here's what's happening with your MarWiin protection today.
              </p>
            </div>
            <div className="w-full md:w-1/4 flex justify-start md:justify-end mt-4 md:mt-0">
              <Button className="gap-2 w-full md:w-auto" asChild>
                <Link href="/download">
                  <Download className="h-4 w-4" />
                  Download Latest
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:gap-6 lg:grid-cols-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item}>
              <Card className="overflow-hidden border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    MarWiin Version
                  </CardTitle>
                  <Rocket className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">v{versionInfo.version}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-primary">Released</span>
                    <span className="text-xs text-muted-foreground">{formattedReleaseDate}</span>
                  </div>
                  <Progress value={100} className="h-2 mt-2" />
                </CardContent>
              </Card>
            </motion.div>


            <motion.div variants={item}>
              <Card className="overflow-hidden border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Connected Servers
                  </CardTitle>
                  <Wifi className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">942</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-green-500">+100.0%</span>
                    <span className="text-xs text-muted-foreground">from last week</span>
                  </div>
                  <Progress value={94} className="h-2 mt-2" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="overflow-hidden border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Protected Players</CardTitle>
                  <Users className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">29,234</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-green-500">+10.2%</span>
                    <span className="text-xs text-muted-foreground">from last week</span>
                  </div>
                  <Progress value={78} className="h-2 mt-2" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className={`overflow-hidden border-l-4 ${backendStatus.online ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">MarWiin Status</CardTitle>
                  <Shield className={`h-4 w-4 ${backendStatus.online ? 'text-green-500' : 'text-red-500'}`} />
                </CardHeader>
                <CardContent>
                  {backendStatus.loading ? (
                    <div className="text-2xl font-bold flex items-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      Checking...
                    </div>
                  ) : (
                    <div className="text-2xl font-bold flex items-center gap-2">
                      {backendStatus.online ? (
                        <>
                          Online <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Operational</Badge>
                        </>
                      ) : (
                        <>
                          Offline <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Down</Badge>
                        </>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-xs ${backendStatus.online ? 'text-green-500' : 'text-red-500'}`}>
                      99.98%
                    </span>
                    <span className="text-xs text-muted-foreground">uptime this month</span>
                  </div>
                  <Progress
                    value={99.98}
                    className={`h-2 mt-2 ${backendStatus.online ? 'bg-green-200 dark:bg-green-950' : 'bg-red-200 dark:bg-red-950'}`}
                    indicatorColor={backendStatus.online ? 'bg-green-500' : 'bg-red-500'}
                  />

                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Protection Status and Activity */}
          <motion.div
            className="grid gap-4 grid-cols-1 md:grid-cols-3 mt-6 md:mt-8"
            variants={container}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.3 }}
          >
            <motion.div variants={item} className="md:col-span-2">
              <Card className="h-full">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="flex items-center gap-2">
                        <Server className="h-5 w-5 text-primary" />
                        My Servers
                      </CardTitle>
                      {servers.length > 0 && (
                        <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                          {servers.length} Active
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    Your MarWiin protected servers
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {servers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <div className="rounded-full bg-muted p-6">
                        <Server className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-lg font-medium">No servers found</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                          You haven't added any servers yet. Purchase or redeem a license to start protecting your servers with MarWiin.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="https://MarWiin.xyz/" target="_blank">
                            Purchase License
                          </Link>
                        </Button>
                        <Button className="w-full" asChild>
                          <Link href="/redeem">
                            Redeem License
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {servers.map((server: any, index: number) => (
                        <motion.div
                          key={server.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="overflow-hidden border border-muted hover:border-primary/50 transition-colors relative">
                            {(server.bannerUrl && server.bannerUrl !== "") && (
                              <div
                                className="absolute inset-0 bg-cover bg-center z-0"
                                style={{
                                  backgroundImage: `url(${server.bannerUrl})`,
                                  opacity: 0.8
                                }}
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50 z-0" />
                            <div className="relative z-10">
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-base truncate">{formatColorText(server.serverName)}</CardTitle>
                                  <Badge
                                    variant={server.status === 'online' ? 'default' : 'outline'}
                                    className={`text-xs ${server.status === 'online' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                                  >
                                    {server.status === 'online' ? 'Online' : 'Offline'}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Players Online</p>
                                    <p className="font-medium">{server.players || '0'}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Players Banned</p>
                                    <p className="font-medium">0</p>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="pt-2">
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                  <Link
                                    href={
                                      server.isOwner || server.isDeveloper
                                        ? `/server/${server.id}`
                                        : `/server/${server.id}/admin-panel`
                                    }
                                  >
                                    Manage
                                  </Link>
                                </Button>
                              </CardFooter>
                            </div>
                          </Card>

                        </motion.div>
                      ))}
                    </div>

                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest events from your servers
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {loadingActivities ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Loader className="h-8 w-8 text-primary animate-spin mb-2" />
                      <p className="text-sm text-muted-foreground">Loading activities...</p>
                    </div>
                  ) : activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <div className="rounded-full bg-muted p-6">
                        <Activity className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-lg font-medium">No recent activity</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                          There hasn't been any recent activity on your servers. Activities will appear here as they occur.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <ScrollArea className="h-[380px]">
                      <div className="space-y-4 pr-4">
                        {activities.map((activity: ServerActivity) => (
                          <div key={activity.id} className="flex items-start gap-2 pb-3 border-b last:border-0 last:pb-0">
                            <div className={`mt-0.5 rounded-full p-1 ${getActivityColor(activity.action)}`}>
                              {getActivityIcon(activity.action)}
                            </div>
                            <div>
                              <p className="text-sm font-medium truncate">
                                {ActivityTypeLabel[activity.action]}
                                <span className="text-muted-foreground"> • {formatColorText(activity.serverName || "Unknown Server")}</span>
                              </p>
                              {/* {activity.details && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {activity.details}
                                </p>
                              )} */}
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                {activity.performedBy && ` • by ${activity.performedBy}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </motion.div>



          </motion.div>

          {/* Changelogs Section */}
          <motion.div
            className="mt-8"
            variants={item}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Changelogs
                    </CardTitle>
                    <CardDescription>
                      Recent changes applied to MarWiin
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 hidden md:inline-flex">
                    Latest Updates
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Loader className="h-8 w-8 text-primary" />
                    </motion.div>
                    <p className="text-sm text-muted-foreground">Loading changelogs...</p>
                  </div>
                ) : Object.keys(commits).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">No recent changes found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Message</TableHead>
                        <TableHead className="hidden md:table-cell text-right">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(commits).map(([date, groupedCommits]: any) => (
                        <TableRow key={date} className="group hover:bg-muted/50 transition-colors">
                          <TableCell>
                            <div className="flex md:hidden flex-row font-medium text-xs text-muted-foreground mb-1">
                              {formatDistanceToNow(new Date(date), { addSuffix: true })}
                            </div>
                            {groupedCommits.map((commit: any, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="text-sm text-muted-foreground flex flex-row items-start py-1 group-hover:text-foreground transition-colors"
                              >
                                <Icons.Dot className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <span>{commit.commit.message}</span>
                              </motion.div>
                            ))}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-right text-muted-foreground">
                            <Badge variant="outline" className="ml-auto">
                              {formatDistanceToNow(new Date(date), { addSuffix: true })}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </ContentLayout>
  );
}
