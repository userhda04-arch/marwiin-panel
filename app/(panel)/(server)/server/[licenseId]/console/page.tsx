"use client"
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ContentLayout } from "@/components/content-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { notify } from "@/lib/notifications";
import { Terminal, Send, Trash2, Circle } from "lucide-react";

interface ConsoleLine {
    id: number;
    type: "info" | "warn" | "error" | "success" | "cmd";
    message: string;
    timestamp: string;
}

export default function ServerConsole({ params }: { params: { licenseId: string } }) {
    const { licenseId } = params;
    const { data: session } = useSession();
    const [lines, setLines] = useState<ConsoleLine[]>([
        { id: 0, type: "info", message: "Console connected. Waiting for server output...", timestamp: new Date().toLocaleTimeString() }
    ]);
    const [command, setCommand] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const bottomRef = useRef<HTMLDivElement>(null);
    const lineId = useRef(1);

    const addLine = (type: ConsoleLine["type"], message: string) => {
        setLines(prev => [...prev.slice(-500), {
            id: lineId.current++,
            type,
            message,
            timestamp: new Date().toLocaleTimeString()
        }]);
    };

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/server/console-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ licenseId }),
            });
            if (res.ok) {
                const data = await res.json();
                setIsConnected(data.isOnline || false);
                if (data.logs?.length) {
                    data.logs.forEach((log: any) => addLine(log.type || "info", log.message));
                }
            }
        } catch { setIsConnected(false); }
    };

    useEffect(() => {
        if (session?.user?.id) {
            fetchLogs();
            const interval = setInterval(fetchLogs, 3000);
            return () => clearInterval(interval);
        }
    }, [session?.user?.id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [lines]);

    const sendCommand = async () => {
        if (!command.trim()) return;
        addLine("cmd", `> ${command}`);
        setHistory(h => [command, ...h.slice(0, 49)]);
        setHistoryIndex(-1);

        try {
            const res = await fetch('/api/server/console-command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ licenseId, command }),
            });
            if (res.ok) {
                addLine("success", `Command sent: ${command}`);
            } else {
                addLine("error", "Failed to send command.");
            }
        } catch { addLine("error", "Failed to send command."); }

        setCommand("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") { sendCommand(); return; }
        if (e.key === "ArrowUp") {
            const idx = Math.min(historyIndex + 1, history.length - 1);
            setHistoryIndex(idx);
            setCommand(history[idx] || "");
        }
        if (e.key === "ArrowDown") {
            const idx = Math.max(historyIndex - 1, -1);
            setHistoryIndex(idx);
            setCommand(idx === -1 ? "" : history[idx]);
        }
    };

    const getLineColor = (type: ConsoleLine["type"]) => {
        switch (type) {
            case "error": return "text-red-400";
            case "warn": return "text-yellow-400";
            case "success": return "text-green-400";
            case "cmd": return "text-blue-400";
            default: return "text-gray-300";
        }
    };

    return (
        <ContentLayout title="Console">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem><BreadcrumbLink asChild><Link href="/dashboard">Dashboard</Link></BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbLink asChild><Link href={`/server/${licenseId}`}>Server</Link></BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbPage>Console</BreadcrumbPage></BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </motion.div>

            <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Terminal className="h-6 w-6" />
                        <h1 className="text-2xl font-bold">Server Console</h1>
                        <div className="flex items-center gap-1">
                            <Circle className={`h-3 w-3 fill-current ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
                            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
                                {isConnected ? "Online" : "Offline"}
                            </Badge>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setLines([])}>
                        <Trash2 className="h-4 w-4 mr-2" />Clear
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="bg-black rounded-t-lg font-mono text-sm p-4 h-[500px] overflow-y-auto">
                            {lines.map(line => (
                                <div key={line.id} className="flex gap-2 mb-0.5">
                                    <span className="text-gray-600 text-xs shrink-0 mt-0.5">{line.timestamp}</span>
                                    <span className={getLineColor(line.type)}>{line.message}</span>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>
                        <div className="flex gap-2 p-3 bg-zinc-900 rounded-b-lg border-t border-zinc-800">
                            <span className="text-green-400 font-mono text-sm self-center">$</span>
                            <Input
                                value={command}
                                onChange={e => setCommand(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter command... (↑↓ for history)"
                                className="bg-transparent border-0 text-gray-200 font-mono focus-visible:ring-0 placeholder:text-gray-600"
                                disabled={!isConnected}
                            />
                            <Button size="sm" onClick={sendCommand} disabled={!isConnected || !command.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ContentLayout>
    );
}
