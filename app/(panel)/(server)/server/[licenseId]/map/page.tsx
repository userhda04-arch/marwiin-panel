"use client"
import Link from "next/link";
import { ContentLayout } from "@/components/content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

export default function ServerMap({ params }: { params: { licenseId: string } }) {
    const { licenseId } = params;
    return (
        <ContentLayout title="Carte interactive">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem><BreadcrumbLink asChild><Link href="/dashboard">Dashboard</Link></BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbLink asChild><Link href={`/server/${licenseId}`}>Serveur</Link></BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbPage>Carte interactive</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Map className="h-5 w-5" />Carte interactive</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Map className="h-16 w-16 mb-4 opacity-30" />
                        <p className="text-lg font-medium">Carte interactive</p>
                        <p className="text-sm mt-2">Disponible quand le serveur est en ligne avec le script installé.</p>
                    </CardContent>
                </Card>
            </div>
        </ContentLayout>
    );
}
