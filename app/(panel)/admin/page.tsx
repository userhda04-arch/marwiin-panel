"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ContentLayout } from "@/components/content-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notify } from "@/lib/notifications";
import { formatDistanceToNow } from "date-fns";
import {
    ShieldAlert, Key, Users, Server, Plus, Copy, Trash2,
    RefreshCcw, Search, Gift, Ban, CheckCircle, XCircle
} from "lucide-react";

const OWNER_IDS = ["1249353959802540104", "1436413617997221899"];
const OWNER_ID = OWNER_IDS[0]; // primary owner

export default function AdminPanel() {
    const { data: session } = useSession();
    const router = useRouter();

    const [licenses, setLicenses] = useState<any[]>([]);
    const [redeemables, setRedeemables] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalLicenses: 0, activeLicenses: 0, totalBans: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Create license dialog
    const [showCreateLicense, setShowCreateLicense] = useState(false);
    const [createForm, setCreateForm] = useState({ ownerId: "", serverName: "My Server", expirationType: "monthly" });

    // Create redeemable dialog
    const [showCreateRedeemable, setShowCreateRedeemable] = useState(false);
    const [redeemForm, setRedeemForm] = useState({ expirationType: "monthly", count: "1" });
    const [newKeys, setNewKeys] = useState<string[]>([]);

    useEffect(() => {
        if (session?.user?.id && session.user.id !== OWNER_ID) {
            router.push("/dashboard");
        }
    }, [session]);

    const fetchData = async () => {
        try {
            const [licRes, redRes, statRes] = await Promise.all([
                fetch('/api/admin/licenses', { credentials: 'include' }),
                fetch('/api/admin/redeemables', { credentials: 'include' }),
                fetch('/api/admin/stats', { credentials: 'include' }),
            ]);
            if (licRes.ok) setLicenses(await licRes.json());
            if (redRes.ok) setRedeemables(await redRes.json());
            if (statRes.ok) setStats(await statRes.json());
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { if (session?.user?.id === OWNER_ID) fetchData(); }, [session]);

    const handleCreateLicense = async () => {
        try {
            const res = await fetch('/api/admin/create-license', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createForm),
            });
            if (res.ok) {
                const data = await res.json();
                notify("Admin", `License created: ${data.licenseKey}`);
                navigator.clipboard.writeText(data.licenseKey);
                setShowCreateLicense(false);
                setCreateForm({ ownerId: "", serverName: "My Server", expirationType: "monthly" });
                fetchData();
            } else {
                notify("Admin", "Failed to create license.");
            }
        } catch { notify("Admin", "Error creating license."); }
    };

    const handleCreateRedeemable = async () => {
        try {
            const res = await fetch('/api/admin/create-redeemable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(redeemForm),
            });
            if (res.ok) {
                const data = await res.json();
                setNewKeys(data.keys);
                fetchData();
            } else {
                notify("Admin", "Failed to create keys.");
            }
        } catch { notify("Admin", "Error creating keys."); }
    };

    const handleDeleteLicense = async (id: string) => {
        if (!confirm("Delete this license?")) return;
        await fetch('/api/admin/delete-license', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        notify("Admin", "License deleted.");
        fetchData();
    };

    const handleDeleteRedeemable = async (id: number) => {
        await fetch('/api/admin/delete-redeemable', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        fetchData();
    };

    const handleBanLicense = async (id: string, isBanned: boolean) => {
        await fetch('/api/admin/ban-license', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, isBanned: !isBanned }),
        });
        notify("Admin", isBanned ? "License unbanned." : "License banned.");
        fetchData();
    };

    const filteredLicenses = licenses.filter(l =>
        l.licenseKey?.toLowerCase().includes(search.toLowerCase()) ||
        l.serverName?.toLowerCase().includes(search.toLowerCase()) ||
        l.ownerId?.includes(search)
    );

    if (!session || session.user.id !== OWNER_ID) {
        return (
            <ContentLayout title="Admin">
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
                    <h2 className="text-2xl font-bold">Access Denied</h2>
                    <p className="text-muted-foreground">You don't have permission to access this page.</p>
                </div>
            </ContentLayout>
        );
    }

    if (isLoading) return (
        <ContentLayout title="Admin Panel">
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
            </div>
        </ContentLayout>
    );

    return (
        <ContentLayout title="Admin Panel">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem><BreadcrumbLink asChild><Link href="/dashboard">Dashboard</Link></BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbPage>Admin Panel</BreadcrumbPage></BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </motion.div>

            <div className="space-y-6 mt-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <Server className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.totalLicenses}</p>
                                    <p className="text-sm text-muted-foreground">Total Licenses</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-8 w-8 text-green-500" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.activeLicenses}</p>
                                    <p className="text-sm text-muted-foreground">Active Licenses</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <Gift className="h-8 w-8 text-purple-500" />
                                <div>
                                    <p className="text-2xl font-bold">{redeemables.length}</p>
                                    <p className="text-sm text-muted-foreground">Redeemable Keys</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="licenses">
                    <TabsList>
                        <TabsTrigger value="licenses"><Server className="h-4 w-4 mr-2" />Licenses</TabsTrigger>
                        <TabsTrigger value="redeemables"><Key className="h-4 w-4 mr-2" />Redeemable Keys</TabsTrigger>
                    </TabsList>

                    {/* LICENSES TAB */}
                    <TabsContent value="licenses" className="space-y-4">
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search licenses..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
                            </div>
                            <Button onClick={fetchData} variant="outline" size="icon"><RefreshCcw className="h-4 w-4" /></Button>
                            <Button onClick={() => setShowCreateLicense(true)}><Plus className="h-4 w-4 mr-2" />Create License</Button>
                        </div>

                        <Card>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Server Name</TableHead>
                                                <TableHead>License Key</TableHead>
                                                <TableHead>Owner ID</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Created</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredLicenses.length === 0 ? (
                                                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No licenses found</TableCell></TableRow>
                                            ) : filteredLicenses.map(l => (
                                                <TableRow key={l.id}>
                                                    <TableCell className="font-medium">{l.serverName}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <code className="text-xs bg-muted px-2 py-0.5 rounded">{l.licenseKey}</code>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { navigator.clipboard.writeText(l.licenseKey); notify("Admin", "Copied!"); }}>
                                                                <Copy className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell><code className="text-xs text-muted-foreground">{l.ownerId}</code></TableCell>
                                                    <TableCell>
                                                        {l.isBanned
                                                            ? <Badge variant="destructive">Banned</Badge>
                                                            : <Badge variant="default" className="bg-green-500">Active</Badge>
                                                        }
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {l.createdAt ? formatDistanceToNow(new Date(l.createdAt), { addSuffix: true }) : "-"}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <Button variant="outline" size="sm" onClick={() => handleBanLicense(l.id, l.isBanned)}>
                                                                {l.isBanned ? <CheckCircle className="h-3 w-3 mr-1" /> : <Ban className="h-3 w-3 mr-1" />}
                                                                {l.isBanned ? "Unban" : "Ban"}
                                                            </Button>
                                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteLicense(l.id)}>
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* REDEEMABLES TAB */}
                    <TabsContent value="redeemables" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">{redeemables.length} keys available</p>
                            <Button onClick={() => { setShowCreateRedeemable(true); setNewKeys([]); }}><Plus className="h-4 w-4 mr-2" />Generate Keys</Button>
                        </div>

                        <Card>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Key</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Generated by</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {redeemables.length === 0 ? (
                                                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No keys available</TableCell></TableRow>
                                            ) : redeemables.map(r => (
                                                <TableRow key={r.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <code className="text-xs bg-muted px-2 py-0.5 rounded">{r.licenseKey}</code>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { navigator.clipboard.writeText(r.licenseKey); notify("Admin", "Copied!"); }}>
                                                                <Copy className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell><Badge variant="outline">{r.expirationType}</Badge></TableCell>
                                                    <TableCell className="text-xs text-muted-foreground">{r.generatedBy}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteRedeemable(r.id)}>
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Create License Dialog */}
            <Dialog open={showCreateLicense} onOpenChange={setShowCreateLicense}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create License</DialogTitle>
                        <DialogDescription>Create a new ADN license for a user.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div><Label>Discord User ID</Label><Input placeholder="e.g. 1249353959802540104" value={createForm.ownerId} onChange={e => setCreateForm(f => ({ ...f, ownerId: e.target.value }))} /></div>
                        <div><Label>Server Name</Label><Input placeholder="My Server" value={createForm.serverName} onChange={e => setCreateForm(f => ({ ...f, serverName: e.target.value }))} /></div>
                        <div>
                            <Label>Expiration Type</Label>
                            <Select value={createForm.expirationType} onValueChange={v => setCreateForm(f => ({ ...f, expirationType: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly (30 days)</SelectItem>
                                    <SelectItem value="quarterly">Quarterly (90 days)</SelectItem>
                                    <SelectItem value="yearly">Yearly (365 days)</SelectItem>
                                    <SelectItem value="lifetime">Lifetime</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateLicense(false)}>Cancel</Button>
                        <Button onClick={handleCreateLicense} disabled={!createForm.ownerId}>Create & Copy Key</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Redeemable Dialog */}
            <Dialog open={showCreateRedeemable} onOpenChange={setShowCreateRedeemable}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Generate Redeemable Keys</DialogTitle>
                        <DialogDescription>Generate keys that users can redeem themselves.</DialogDescription>
                    </DialogHeader>
                    {newKeys.length > 0 ? (
                        <div className="space-y-2">
                            <Label>Generated Keys (click to copy)</Label>
                            {newKeys.map(k => (
                                <div key={k} className="flex items-center gap-2 p-2 bg-muted rounded cursor-pointer hover:bg-muted/80"
                                    onClick={() => { navigator.clipboard.writeText(k); notify("Admin", "Copied!"); }}>
                                    <code className="text-xs flex-1">{k}</code>
                                    <Copy className="h-3 w-3" />
                                </div>
                            ))}
                            <Button className="w-full mt-2" onClick={() => { navigator.clipboard.writeText(newKeys.join('\n')); notify("Admin", "All keys copied!"); }}>
                                Copy All
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <Label>Expiration Type</Label>
                                <Select value={redeemForm.expirationType} onValueChange={v => setRedeemForm(f => ({ ...f, expirationType: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly">Monthly (30 days)</SelectItem>
                                        <SelectItem value="quarterly">Quarterly (90 days)</SelectItem>
                                        <SelectItem value="yearly">Yearly (365 days)</SelectItem>
                                        <SelectItem value="lifetime">Lifetime</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div><Label>Number of keys</Label><Input type="number" min="1" max="50" value={redeemForm.count} onChange={e => setRedeemForm(f => ({ ...f, count: e.target.value }))} /></div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateRedeemable(false)}>Close</Button>
                        {newKeys.length === 0 && <Button onClick={handleCreateRedeemable}>Generate</Button>}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ContentLayout>
    );
}
