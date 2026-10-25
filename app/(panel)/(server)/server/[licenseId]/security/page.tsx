"use client"
import Link from "next/link";
import { ContentLayout } from "@/components/content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function ServerSecurity({ params }: { params: { licenseId: string } }) {
    const { licenseId } = params;
    return (
        <ContentLayout title="Règles de sécurité">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem><BreadcrumbLink asChild><Link href="/dashboard">Dashboard</Link></BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbLink asChild><Link href={`/server/${licenseId}`}>Serveur</Link></BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbPage>Règles de sécurité</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" />Règles de sécurité</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <ShieldCheck className="h-16 w-16 mb-4 opacity-30" />
                        <p className="text-lg font-medium">Règles de sécurité</p>
                        <p className="text-sm mt-2">Configurez les règles de détection anti-cheat depuis la page Configuration.</p>
                    </CardContent>
                </Card>
            </div>
        </ContentLayout>
    );
}
