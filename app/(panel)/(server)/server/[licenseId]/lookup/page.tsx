"use client"
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ContentLayout } from "@/components/content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, User, Clock, Ban } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ServerLookup({ params }: { params: { licenseId: string } }) {
    const { licenseId } = params;
    const { data: session } = useSession();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setSearched(true);
        try {
            const res = await fetch('/api/server/lookup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ licenseId, query }),
            });
            if (res.ok) {
                const data = await res.json();
                setResults(data.results || []);
            }
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    return (
        <ContentLayout title="Recherche">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem><BreadcrumbLink asChild><Link href="/dashboard">Dashboard</Link></BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbLink asChild><Link href={`/server/${licenseId}`}>Serveur</Link></BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbPage>Recherche</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="space-y-6 mt-6">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" />Recherche joueur</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex gap-3">
                            <Input placeholder="Nom, identifiant, licence..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="flex-1" />
                            <Button onClick={handleSearch} disabled={isLoading}>
                                {isLoading ? "Recherche..." : "Rechercher"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {searched && (
                    <Card>
                        <CardContent className="p-0">
                            {results.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <User className="h-10 w-10 mb-3 opacity-30" />
                                    <p>Aucun résultat trouvé pour "{query}"</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {results.map((r, i) => (
                                        <div key={i} className="p-4 flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{r.playerName || "Inconnu"}</p>
                                                <p className="text-xs text-muted-foreground font-mono">{r.identifier}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {r.bannedAt && <Badge variant="destructive"><Ban className="h-3 w-3 mr-1" />Banni</Badge>}
                                                {r.bannedAt && <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(r.bannedAt), { addSuffix: true })}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </ContentLayout>
    );
}
