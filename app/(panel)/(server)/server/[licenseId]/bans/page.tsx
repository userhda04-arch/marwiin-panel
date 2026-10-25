"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ContentLayout } from "@/components/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { notify } from "@/lib/notifications";
import { Ban, Search, UserX, RefreshCcw, ShieldOff, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ServerBans({ params }: { params: { licenseId: string } }) {
    const { licenseId } = params;
    const { data: session } = useSession();
    const [bans, setBans] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showBanDialog, setShowBanDialog] = useState(false);
    const [banForm, setBanForm] = useState({ identifier: "", reason: "", duration: "" });
    const [page, setPage] = useState(1);
    const perPage = 20;

    const fetchBans = async () => {
        try {
            const res = await fetch('/api/server/bans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ licenseId }),
            });
            if (res.ok) {
                const data = await res.json();
                setBans(data.bans || []);
            }
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    useEffect(() => {
        if (session?.user?.id) fetchBans();
    }, [session?.user?.id]);

    const handleUnban = async (banId: string) => {
        try {
            await fetch('/api/server/unban', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ licenseId, banId }),
            });
            notify("Bans", "Player unbanned successfully.");
            fetchBans();
        } catch { notify("Bans", "Failed to unban player."); }
    };

    const handleBan = async () => {
        try {
            await fetch('/api/server/ban-offline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ licenseId, ...banForm }),
            });
            notify("Bans", "Player banned successfully.");
            setShowBanDialog(false);
            setBanForm({ identifier: "", reason: "", duration: "" });
            fetchBans();
        } catch { notify("Bans", "Failed to ban player."); }
    };

    const filtered = bans.filter(b =>
        b.playerName?.toLowerCase().includes(search.toLowerCase()) ||
        b.identifier?.toLowerCase().includes(search.toLowerCase()) ||
        b.reason?.toLowerCase().includes(search.toLowerCase())
    );

    const paginated = filtered.slice((page - 1) * perPage, page * perPage);
    const totalPages = Math.ceil(filtered.length / perPage);

    if (isLoading) return (
        <ContentLayout title="Bans">
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
            </div>
        </ContentLayout>
    );

    return (
        <ContentLayout title="Bans">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem><BreadcrumbLink asChild><Link href="/dashboard">Dashboard</Link></BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbLink asChild><Link href={`/server/${licenseId}`}>Server</Link></BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbPage>Bans</BreadcrumbPage></BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </motion.div>

            <div className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2"><Ban className="h-6 w-6" />Ban Management</h1>
                        <p className="text-muted-foreground text-sm">{bans.length} total bans</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={fetchBans}><RefreshCcw className="h-4 w-4 mr-2" />Refresh</Button>
                        <Button size="sm" onClick={() => setShowBanDialog(true)}><Ban className="h-4 w-4 mr-2" />Ban Player</Button>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name, identifier or reason..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Player</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Banned by</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Expires</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginated.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                                <ShieldOff className="h-8 w-8 mx-auto mb-2" />
                                                No bans found
                                            </TableCell>
                                        </TableRow>
                                    ) : paginated.map((ban) => (
                                        <TableRow key={ban.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{ban.playerName || "Unknown"}</p>
                                                    <p className="text-xs text-muted-foreground font-mono truncate max-w-[150px]">{ban.identifier}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[200px]">
                                                <p className="truncate text-sm">{ban.reason || "No reason"}</p>
                                            </TableCell>
                                            <TableCell className="text-sm">{ban.bannedBy || "-"}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {ban.bannedAt ? formatDistanceToNow(new Date(ban.bannedAt), { addSuffix: true }) : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {ban.expiresAt ? (
                                                    <Badge variant="outline" className="text-xs">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        {formatDistanceToNow(new Date(ban.expiresAt), { addSuffix: true })}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive" className="text-xs">Permanent</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm" onClick={() => handleUnban(ban.id)}>
                                                    <UserX className="h-3 w-3 mr-1" />Unban
                                                </Button>
                                            </TableCell>
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
                            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ban Offline Player</DialogTitle>
                        <DialogDescription>Ban a player by their identifier (license, steam, etc.)</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div><Label>Identifier</Label><Input placeholder="license:abc123..." value={banForm.identifier} onChange={e => setBanForm(f => ({ ...f, identifier: e.target.value }))} /></div>
                        <div><Label>Reason</Label><Textarea placeholder="Reason for ban..." value={banForm.reason} onChange={e => setBanForm(f => ({ ...f, reason: e.target.value }))} /></div>
                        <div><Label>Duration (hours, empty = permanent)</Label><Input type="number" placeholder="Leave empty for permanent" value={banForm.duration} onChange={e => setBanForm(f => ({ ...f, duration: e.target.value }))} /></div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowBanDialog(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleBan}>Ban Player</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ContentLayout>
    );
}
