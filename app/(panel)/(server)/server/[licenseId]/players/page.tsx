"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ContentLayout } from "@/components/content-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { notify } from "@/lib/notifications";
import {
    Users, Search, Wifi, WifiOff,
    Footprints, Car, Skull, Shield, Clock, Play,
    Ban, Gavel, RefreshCcw
} from "lucide-react";

export default function ServerPlayers({ params }: { params: { licenseId: string } }) {
    const { licenseId } = params;
    const { data: session } = useSession();
    const [players, setPlayers] = useState<any[]>([]);
    const [serverInfo, setServerInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [actionModal, setActionModal] = useState<{ type: string | null; player: any | null }>({ type: null, player: null });
    const [reason, setReason] = useState("");

    const fetchPlayers = async () => {
        try {
            const res = await fetch('/api/server/players', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ licenseId }),
            });
            if (res.ok) {
                const data = await res.json();
                setPlayers(data.players || []);
                setServerInfo(data.serverInfo || null);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user?.id) {
            fetchPlayers();
            const interval = setInterval(fetchPlayers, 5000);
            return () => clearInterval(interval);
        }
    }, [session?.user?.id]);

    const handleAction = async (type: string) => {
        if (!actionModal.player) return;
        try {
            await fetch('/api/server/player-action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ licenseId, playerId: actionModal.player.id, action: type, reason }),
            });
            notify("Players", `Player ${type === 'kick' ? 'kicked' : 'banned'} successfully.`);
            setActionModal({ type: null, player: null });
            setReason("");
            fetchPlayers();
        } catch (e) {
            notify("Players", "Failed to perform action.");
        }
    };

    const filtered = players.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        String(p.id).includes(search)
    );

    const getPingColor = (ping: number) => {
        if (ping <= 0) return "text-red-500";
        if (ping <= 50) return "text-green-500";
        if (ping <= 100) return "text-yellow-500";
        return "text-orange-500";
    };

    const getPingIcon = (ping: number) => {
        if (ping <= 0) return <WifiOff className="h-3 w-3" />;
        return <Wifi className="h-3 w-3" />;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "IN_VEHICLE": return <Car className="h-4 w-4 text-amber-500" />;
            case "DEAD": return <Skull className="h-4 w-4 text-gray-500" />;
            default: return <Footprints className="h-4 w-4 text-green-500" />;
        }
    };

    if (isLoading) return (
        <ContentLayout title="Players">
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
            </div>
        </ContentLayout>
    );

    return (
        <ContentLayout title="Players">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem><BreadcrumbLink asChild><Link href="/dashboard">Dashboard</Link></BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbLink asChild><Link href={`/server/${licenseId}`}>Server</Link></BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbPage>Players</BreadcrumbPage></BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </motion.div>

            <div className="space-y-6 mt-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        <h1 className="text-2xl font-bold">Online Players</h1>
                        <Badge variant="secondary">{players.length}{serverInfo?.slots ? `/${serverInfo.slots}` : ""}</Badge>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchPlayers}>
                        <RefreshCcw className="h-4 w-4 mr-2" />Refresh
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
                </div>

                {/* Players grid */}
                {filtered.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <WifiOff className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">No players online</p>
                            <p className="text-sm text-muted-foreground">The server may be offline or empty.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map((player) => (
                            <motion.div key={player.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                <Card className="hover:shadow-md transition-all">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(player.status)}
                                                <div>
                                                    <p className="font-semibold text-sm truncate max-w-[120px]">
                                                        <span className="text-muted-foreground text-xs">#{player.id}</span> {player.name}
                                                    </p>
                                                    {player.admin && (
                                                        <Badge variant="outline" className="text-xs mt-0.5">
                                                            <Shield className="h-2 w-2 mr-1" />Admin
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-1 ${getPingColor(player.ping)}`}>
                                                {getPingIcon(player.ping)}
                                                <span className="text-xs">{player.ping > 0 ? `${player.ping}ms` : "N/A"}</span>
                                            </div>
                                        </div>

                                        {/* Health bar */}
                                        {player.health !== undefined && (
                                            <div className="mb-3">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span>HP</span><span>{player.health}%</span>
                                                </div>
                                                <div className="w-full bg-muted rounded-full h-1.5">
                                                    <div className={`h-1.5 rounded-full ${player.health >= 70 ? 'bg-green-500' : player.health >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                        style={{ width: `${player.health}%` }} />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{Math.floor((player.timeOnline || 0) / 60)}h {(player.timeOnline || 0) % 60}m</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Play className="h-3 w-3" />
                                                <span>{Math.floor((player.playTime || 0) / 60)}h total</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => { setActionModal({ type: 'kick', player }); setReason(""); }}>
                                                <Gavel className="h-3 w-3 mr-1" />Kick
                                            </Button>
                                            <Button variant="destructive" size="sm" className="flex-1 text-xs" onClick={() => { setActionModal({ type: 'ban', player }); setReason(""); }}>
                                                <Ban className="h-3 w-3 mr-1" />Ban
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Modal */}
            <Dialog open={!!actionModal.type} onOpenChange={() => setActionModal({ type: null, player: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{actionModal.type === 'kick' ? 'Kick' : 'Ban'} {actionModal.player?.name}</DialogTitle>
                        <DialogDescription>Player #{actionModal.player?.id}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        <Label>Reason</Label>
                        <Textarea placeholder="Enter reason..." value={reason} onChange={e => setReason(e.target.value)} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActionModal({ type: null, player: null })}>Cancel</Button>
                        <Button variant={actionModal.type === 'ban' ? 'destructive' : 'default'} onClick={() => handleAction(actionModal.type!)}>
                            {actionModal.type === 'kick' ? 'Kick Player' : 'Ban Player'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ContentLayout>
    );
}
