"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ContentLayout } from "@/components/content-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

const LOG_COLORS: Record<string, string> = {
    PLAYER_JOIN: "#10b981", PLAYER_LEAVE: "#f59e0b", BAN_PLAYER: "#ef4444",
    UNBAN_PLAYER: "#06b6d4", KICK_PLAYER: "#f97316", KILL: "#8b5cf6",
    EXPLOSION: "#b91c1c", ENTITY_CREATE: "#ec4899",
    SERVER_START: "#6366f1", SERVER_STOP: "#64748b", CONFIG_UPDATE: "#0ea5e9",
};

export default function ServerLogs({ params }: { params: { licenseId: string } }) {
    const { licenseId } = params;
    const { data: session } = useSession();
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const perPage = 20;

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/server/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ licenseId, page, search, type: typeFilter !== "all" ? typeFilter : undefined }),
            });
            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs || []);
                setTotal(data.total || 0);
            }
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { if (session?.user?.id) fetchLogs(); }, [session?.user?.id, page, search, typeFilter]);

    const totalPages = Math.ceil(total / perPage);

    if (isLoading) return (
        <ContentLayout title="Logs">
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
            </div>
        </ContentLayout>
    );

    return (
        <ContentLayout title="Logs">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem><BreadcrumbLink asChild><Link href="/dashboard">Dashboard</Link></BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbLink asChild><Link href={`/server/${licenseId}`}>Server</Link></BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbPage>Logs</BreadcrumbPage></BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </motion.div>

            <div className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="h-6 w-6" />
                        <h1 className="text-2xl font-bold">Server Logs</h1>
                        <Badge variant="secondary">{total} total</Badge>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchLogs}><RefreshCcw className="h-4 w-4 mr-2" />Refresh</Button>
                </div>

                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search logs..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
                    </div>
                    <Select value={typeFilter} onValueChange={v => { setTypeFilter(v); setPage(1); }}>
                        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter type" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All types</SelectItem>
                            <SelectItem value="PLAYER_JOIN">Player Join</SelectItem>
                            <SelectItem value="PLAYER_LEAVE">Player Leave</SelectItem>
                            <SelectItem value="BAN_PLAYER">Ban</SelectItem>
                            <SelectItem value="KICK_PLAYER">Kick</SelectItem>
                            <SelectItem value="KILL">Kill</SelectItem>
                            <SelectItem value="EXPLOSION">Explosion</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[140px]">Time</TableHead>
                                        <TableHead className="w-[150px]">Type</TableHead>
                                        <TableHead>Player</TableHead>
                                        <TableHead>Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">No logs found</TableCell>
                                        </TableRow>
                                    ) : logs.map((log: any) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="text-xs text-muted-foreground">
                                                <div>{format(new Date(log.createdAt), "HH:mm:ss")}</div>
                                                <div>{format(new Date(log.createdAt), "MMM dd")}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="text-xs text-white border-0" style={{ backgroundColor: LOG_COLORS[log.action] || "#6b7280" }}>
                                                    {log.action}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">{log.performedBy || "-"}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">{log.details || "-"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" />Previous</Button>
                            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next<ChevronRight className="h-4 w-4" /></Button>
                        </div>
                    </div>
                )}
            </div>
        </ContentLayout>
    );
}
