export enum ActivityType {
    SERVER_START = "SERVER_START",
    SERVER_STOP = "SERVER_STOP",
    SERVER_RENAME = "SERVER_RENAME",
    SERVER_EXPIRED = "SERVER_EXPIRED",
    SERVER_RENEW = "SERVER_RENEW",
    SERVER_CREATE = "SERVER_CREATE",
    MEMBER_ADD = "MEMBER_ADD",
    MEMBER_REMOVE = "MEMBER_REMOVE",
    MEMBER_UPDATE = "MEMBER_UPDATE",
    CONFIG_UPDATE = "CONFIG_UPDATE",
    IP_RESET = "IP_RESET",
    DOWNLOAD = "DOWNLOAD",
}

export type ServerActivity = {
    id: number;
    licenseKey: string;
    serverName?: string;
    action: ActivityType;
    details?: string;
    performedBy?: string;
    createdAt: string;
}

export const ActivityTypeLabel: Record<ActivityType, string> = {
    [ActivityType.SERVER_START]: "Server Started",
    [ActivityType.SERVER_STOP]: "Server Stopped",
    [ActivityType.SERVER_RENAME]: "Server Renamed",
    [ActivityType.SERVER_EXPIRED]: "Server Expired",
    [ActivityType.SERVER_RENEW]: "Server Renewed",
    [ActivityType.SERVER_CREATE]: "Server Created",
    [ActivityType.MEMBER_ADD]: "Member Added",
    [ActivityType.MEMBER_REMOVE]: "Member Removed",
    [ActivityType.MEMBER_UPDATE]: "Member Updated",
    [ActivityType.CONFIG_UPDATE]: "Config Updated",
    [ActivityType.IP_RESET]: "IP Reset",
    [ActivityType.DOWNLOAD]: "Downloaded",
}