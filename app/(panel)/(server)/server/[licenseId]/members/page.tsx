"use client"
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from 'date-fns';

import { ContentLayout } from "@/components/content-layout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    CalendarClock,
    CirclePlus,
    CirclePower,
    Copy,
    Edit,
    Eye,
    EyeOff,
    HardDrive,
    Key,
    Network,
    Pen,
    RefreshCcw,
    Trash,
    UserPlus,
    Users,
    Shield,
    AlertCircle,
    CheckCircle2,
    Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notifications";
import { cn } from "@/lib/utils";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogClose } from "@radix-ui/react-dialog";
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MultiSelect } from "@/components/ui/multi-select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function ServerMembers({ params }: { params: { licenseId: string; }; }) {
    const licenseId = params.licenseId;
    const { data: session } = useSession();

    const [members, setMembers] = useState<any[]>([]);
    const [memberDiscordId, setMemberDiscordId] = useState<string>("");
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingMemberId, setEditingMemberId] = useState<number | null>(null);

    const addDialogRef = useRef<HTMLButtonElement>(null);
    const editDialogRef = useRef<HTMLButtonElement>(null);
    const dialogCloseRef = useRef<HTMLButtonElement>(null);

    const getMembers = async () => {
        if (!session?.user.id) return;
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/server/member/get', {
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
                if (data.error || !data.members) {
                    setMembers([]);
                    setError("Failed to load members. Please try again.");
                    return;
                }

                setMembers(data.members);
            } else {
                setMembers([]);
                setError("Failed to load members. Server returned an error.");
            }
        } catch (error) {
            console.error('Error getting members', error);
            setError("An unexpected error occurred. Please try again.");
            setMembers([]);
        } finally {
            setIsLoading(false);
        }
    }

    const newMember = async (memberId: string, permissions: string[]) => {
        if (!session?.user.id) return;
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/server/member/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    memberId: memberId,
                    licenseId: licenseId,
                    permissions: permissions
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.error || data.message) {
                    setError("Failed to add member. Please check the Discord ID and try again.");
                    notify("Error", "An error occurred while adding the member.", "redirect", "Try Again", "");
                    return;
                }

                setSuccess("Member added successfully!");
                notify("Success", "The member has been successfully added to your server.");
                setMemberDiscordId("");
                setSelectedPermissions([]);
                getMembers();

                // Close the dialog
                if (dialogCloseRef.current) {
                    dialogCloseRef.current.click();
                }
            } else {
                setError("Server returned an error. Please try again.");
                notify("Error", "An error occurred while adding the member.", "redirect", "Try Again", "");
            }
        } catch (error) {
            console.error('Error adding member', error);
            setError("An unexpected error occurred. Please try again.");
            notify("Error", "An error occurred while adding the member.", "redirect", "Try Again", "");
        } finally {
            setIsSubmitting(false);
        }
    }

    const deleteMember = async (memberId: number) => {
        if (!session?.user.id) return;
        setError(null);

        try {
            const response = await fetch('/api/server/member/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    memberId: memberId,
                    licenseId: licenseId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.error || data.message) {
                    notify("Error", "An error occurred while deleting the member. Please try again.");
                    return;
                }

                notify("Success", "The member has been successfully removed from your server.");
                getMembers();
            } else {
                notify("Error", "An error occurred while deleting the member. Please try again.");
            }
        } catch (error) {
            console.error('Error deleting member', error);
            notify("Error", "An unexpected error occurred while deleting the member.");
        }
    }

    const updateMember = async (memberId: number, permissions: string[]) => {
        if (!session?.user.id) return;
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/server/member/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    memberId: memberId,
                    licenseId: licenseId,
                    permissions: permissions
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.error) {
                    setError("Failed to update member. Please try again.");
                    notify("Error", "An error occurred while updating the member.", "redirect", "Try Again", "");
                    return;
                }

                setSuccess("Member updated successfully!");
                notify("Success", "The member has been successfully updated.");
                getMembers();

                // Close the dialog
                resetForm();

                // Use the dialogCloseRef to close the dialog
                if (dialogCloseRef.current) {
                    dialogCloseRef.current.click();
                }
            } else {
                setError("Server returned an error. Please try again.");
                notify("Error", "An error occurred while updating the member.", "redirect", "Try Again", "");
            }
        } catch (error) {
            console.error('Error updating member', error);
            setError("An unexpected error occurred. Please try again.");
            notify("Error", "An error occurred while updating the member.", "redirect", "Try Again", "");
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleEditMember = (member: any) => {
        setIsEditing(true);
        setEditingMemberId(member.id);
        setMemberDiscordId(member.memberId);

        const permissions = [];
        if (member.isAdmin) permissions.push("isAdmin");
        if (member.isDeveloper) permissions.push("isDeveloper");
        setSelectedPermissions(permissions);

        // Reset any previous errors or success messages
        setError(null);
        setSuccess(null);

        // Open the dialog
        if (editDialogRef.current) {
            editDialogRef.current.click();
        }
    };

    const resetForm = () => {
        setMemberDiscordId("");
        setSelectedPermissions([]);
        setError(null);
        setSuccess(null);
        setIsEditing(false);
        setEditingMemberId(null);
    };

    useEffect(() => {
        getMembers();
    }, [session?.user.id]);

    // Dialog content component to avoid duplication
    const MemberDialogContent = ({ onSubmit, isEditing = false }: { onSubmit: (e: React.FormEvent) => void, isEditing: boolean }) => (
        <>
            <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Server Member" : "Add New Server Member"}</DialogTitle>
                <DialogDescription>
                    {isEditing
                        ? "Update team member permissions for your server."
                        : "Add team members to your server and set their permissions."}
                </DialogDescription>
            </DialogHeader>

            {error && (
                <Alert variant="destructive" className="my-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert variant="default" className="my-2 border-green-500 text-green-500">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="discord-id" className="text-sm font-medium">
                        Discord ID
                    </Label>
                    <Input
                        id="discord-id"
                        className="col-span-3"
                        placeholder="746079627751063644"
                        value={memberDiscordId}
                        onChange={(e) => { setMemberDiscordId(e.target.value) }}
                        disabled={isEditing} // Disable editing Discord ID when updating
                    />
                    <p className="text-xs text-muted-foreground">
                        {isEditing
                            ? "You cannot change the Discord ID of an existing member."
                            : "Enter the Discord ID of the user you want to add."}
                    </p>
                </div>

                <div className="grid gap-2">
                    <Label className="text-sm font-medium">
                        Permissions
                    </Label>
                    <MultiSelect
                        options={[
                            {
                                value: "isAdmin",
                                label: "Administrator",
                            },
                            {
                                value: "isDeveloper",
                                label: "Developer",
                            },
                        ]}
                        selected={selectedPermissions}
                        onChange={setSelectedPermissions}
                        className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                        Administrator can access admin panel, while developers can access configuration and license key.
                    </p>
                </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                <DialogClose asChild>
                    <Button
                        variant="outline"
                        onClick={resetForm}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                </DialogClose>
                <Button
                    onClick={onSubmit}
                    disabled={isSubmitting || !memberDiscordId || selectedPermissions.length === 0}
                    className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                >
                    {isSubmitting ? (isEditing ? "Updating..." : "Adding...") : (isEditing ? "Update Member" : "Add Member")}
                </Button>

                {/* Hidden DialogClose button that can be triggered programmatically */}
                <DialogClose asChild>
                    <Button
                        className="hidden"
                        ref={dialogCloseRef}
                        variant="outline"
                    >
                        Close
                    </Button>
                </DialogClose>
            </DialogFooter>
        </>
    );

    return (
        <ContentLayout title="Server Members">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="px-2 sm:px-0"
            >
                <Breadcrumb className="overflow-x-auto pb-2 whitespace-nowrap">
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
                            <BreadcrumbPage>Members</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
                    <motion.div
                        className="lg:col-span-3 order-2 lg:order-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="overflow-hidden border-2 border-border/50 shadow-md">
                            <CardHeader className="px-4 sm:px-7 bg-muted/30">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="h-5 w-5 text-primary" />
                                            Server Members
                                        </CardTitle>
                                        <CardDescription className="mt-1.5">
                                            Manage your team's access to your WaveShield license and customize their permissions.
                                        </CardDescription>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                className="font-semibold bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                                                ref={addDialogRef}
                                                onClick={resetForm}
                                            >
                                                <UserPlus className="mr-2 h-4 w-4" />
                                                Add Member
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px] w-[95vw] max-w-[95vw] sm:w-auto">
                                            <MemberDialogContent
                                                onSubmit={() => newMember(memberDiscordId, selectedPermissions)}
                                                isEditing={false}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 overflow-x-auto">
                                {isLoading ? (
                                    <div className="p-4 sm:p-6 space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <Skeleton className="h-10 w-10 rounded-full" />
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-[150px] sm:w-[250px]" />
                                                        <Skeleton className="h-3 w-[100px] sm:w-[150px]" />
                                                    </div>
                                                </div>
                                                <Skeleton className="h-9 w-24 hidden sm:block" />
                                            </div>
                                        ))}
                                    </div>
                                ) : members.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 text-center">
                                        <Users className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-medium">No members found</h3>
                                        <p className="text-sm text-muted-foreground mt-1 max-w-md px-2">
                                            Your server doesn't have any members yet. Add your first team member to get started.
                                        </p>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    className="mt-6 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                                                    onClick={resetForm}
                                                >
                                                    <UserPlus className="mr-2 h-4 w-4" />
                                                    Add Your First Member
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px] w-[95vw] max-w-[95vw] sm:w-auto">
                                                <MemberDialogContent
                                                    onSubmit={() => newMember(memberDiscordId, selectedPermissions)}
                                                    isEditing={false}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                ) : (
                                    <motion.div
                                        variants={container}
                                        initial="hidden"
                                        animate="show"
                                        className="min-w-full"
                                    >
                                        <div className="block sm:hidden">
                                            {/* Mobile view - card-based layout */}
                                            <div className="divide-y">
                                                {members.map((member: any, index) => (
                                                    <motion.div
                                                        key={member.id}
                                                        variants={item}
                                                        className="p-4 space-y-3"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-9 w-9 border border-border">
                                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                                        {member.memberId.substring(0, 2)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <div className="font-medium flex items-center gap-2 text-sm">
                                                                        <span className="truncate max-w-[150px]">{member.memberId}</span>
                                                                        <TooltipProvider>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        className="h-6 w-6 rounded-full"
                                                                                        onClick={() => {
                                                                                            navigator.clipboard.writeText(member.memberId);
                                                                                            notify("Copied", "Discord ID copied to clipboard");
                                                                                        }}
                                                                                    >
                                                                                        <Copy className="h-3.5 w-3.5" />
                                                                                    </Button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>
                                                                                    <p>Copy Discord ID</p>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        </TooltipProvider>
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        Added {formatDistanceToNow(new Date(member.createdAt), { addSuffix: true })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2">
                                                            {member.isAdmin && (
                                                                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                                                    <Shield className="mr-1 h-3 w-3" />
                                                                    Administrator
                                                                </Badge>
                                                            )}
                                                            {member.isDeveloper && (
                                                                <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors">
                                                                    <Code className="mr-1 h-3 w-3" />
                                                                    Developer
                                                                </Badge>
                                                            )}
                                                            {!member.isAdmin && !member.isDeveloper && (
                                                                <Badge variant="outline" className="text-muted-foreground">
                                                                    No Permissions
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        <div className="flex justify-end gap-2 pt-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 px-3"
                                                                onClick={() => handleEditMember(member)}
                                                            >
                                                                <Pen className="h-3.5 w-3.5 mr-1.5" />
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                className="h-8 px-3"
                                                                onClick={() => deleteMember(member.id)}
                                                            >
                                                                <Trash className="h-3.5 w-3.5 mr-1.5" />
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="hidden sm:block">
                                            {/* Desktop view - table layout */}
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                                        <TableHead className="w-[40%]">Member</TableHead>
                                                        <TableHead className="text-center w-[30%]">Permissions</TableHead>
                                                        <TableHead className="text-right w-[30%]">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {members.map((member: any, index) => (
                                                        <motion.tr
                                                            key={member.id}
                                                            variants={item}
                                                            className="group hover:bg-muted/50 transition-colors"
                                                        >
                                                            <TableCell className="py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <Avatar className="h-9 w-9 border border-border">
                                                                        <AvatarFallback className="bg-primary/10 text-primary">
                                                                            {member.memberId.substring(0, 2)}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div>
                                                                        <div className="font-medium flex items-center gap-2">
                                                                            {member.memberId}
                                                                            <TooltipProvider>
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="icon"
                                                                                            className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                            onClick={() => {
                                                                                                navigator.clipboard.writeText(member.memberId);
                                                                                                notify("Copied", "Discord ID copied to clipboard");
                                                                                            }}
                                                                                        >
                                                                                            <Copy className="h-3.5 w-3.5" />
                                                                                        </Button>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent>
                                                                                        <p>Copy Discord ID</p>
                                                                                    </TooltipContent>
                                                                                </Tooltip>
                                                                            </TooltipProvider>
                                                                        </div>
                                                                        <div className="text-xs text-muted-foreground">
                                                                            Added {formatDistanceToNow(new Date(member.createdAt), { addSuffix: true })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                <div className="flex flex-wrap gap-2 justify-center">
                                                                    {member.isAdmin && (
                                                                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                                                            <Shield className="mr-1 h-3 w-3" />
                                                                            Administrator
                                                                        </Badge>
                                                                    )}
                                                                    {member.isDeveloper && (
                                                                        <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors">
                                                                            <Code className="mr-1 h-3 w-3" />
                                                                            Developer
                                                                        </Badge>
                                                                    )}
                                                                    {!member.isAdmin && !member.isDeveloper && (
                                                                        <Badge variant="outline" className="text-muted-foreground">
                                                                            No Permissions
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    className="h-8 px-2 text-muted-foreground"
                                                                                    onClick={() => handleEditMember(member)}
                                                                                >
                                                                                    <Pen className="h-3.5 w-3.5" />
                                                                                    <span className="sr-only md:not-sr-only md:ml-2">Edit</span>
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p>Edit Member</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>

                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    variant="destructive"
                                                                                    size="sm"
                                                                                    className="h-8 px-2"
                                                                                    onClick={() => deleteMember(member.id)}
                                                                                >
                                                                                    <Trash className="h-3.5 w-3.5" />
                                                                                    <span className="sr-only md:not-sr-only md:ml-2">Delete</span>
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p>Remove Member</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                </div>
                                                            </TableCell>
                                                        </motion.tr>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </motion.div>
                                )}
                            </CardContent>
                            {members.length > 0 && (
                                <CardFooter className="flex justify-between items-center px-4 sm:px-6 py-4 bg-muted/20 border-t flex-wrap gap-3">
                                    <div className="text-sm text-muted-foreground">
                                        Showing <span className="font-medium text-foreground">{members.length}</span> members
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1"
                                        onClick={getMembers}
                                    >
                                        <RefreshCcw className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">Refresh</span>
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    </motion.div>

                    <motion.div
                        className="lg:col-span-1 order-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="space-y-6">
                            <Card className="border-2 border-border/50 shadow-md">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-primary" />
                                        Permission Guide
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                    <div className="space-y-2">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <Badge className="bg-primary/10 text-primary">Administrator</Badge>
                                        </h4>
                                        <p className="text-muted-foreground text-xs">
                                            Access to the admin panel.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <Badge className="bg-secondary/10 text-secondary">Developer</Badge>
                                        </h4>
                                        <p className="text-muted-foreground text-xs">
                                            Access to license key, logs, and configuration settings.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-border/50 shadow-md">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-amber-500" />
                                        Security Tips
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <p className="text-muted-foreground text-xs">
                                        • Only add members you trust to your server
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        • Regularly review member permissions
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        • Remove inactive members to maintain security
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        • Limit administrator access to essential personnel
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Hidden edit dialog trigger */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        className="hidden"
                        ref={editDialogRef}
                    >
                        Edit Member
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] w-[95vw] max-w-[95vw] sm:w-auto">
                    <MemberDialogContent
                        onSubmit={() => {
                            if (editingMemberId !== null) {
                                updateMember(editingMemberId, selectedPermissions);
                            }
                        }}
                        isEditing={true}
                    />
                </DialogContent>
            </Dialog>
        </ContentLayout>
    );
}
