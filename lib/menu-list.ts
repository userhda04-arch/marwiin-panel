import {
    Tag,
    Users,
    Settings,
    Bookmark,
    Moon,
    LayoutGrid,
    Book,
    Gift,
    Download,
    Server,
    Ban,
    FileText,
    Terminal,
    Map,
    ShieldAlert
} from "lucide-react";

type Submenu = {
    href: string;
    label: string;
    active: boolean;
};

type Menu = {
    href: string;
    target?: string;
    label: string;
    active: boolean;
    icon: any;
    submenus: Submenu[];
};

type Group = {
    groupLabel: string;
    menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
    return [
        {
            groupLabel: "",
            menus: [
                {
                    href: "/dashboard",
                    label: "Dashboard",
                    active: pathname.includes("/dashboard"),
                    icon: LayoutGrid,
                    submenus: []
                }
            ]
        },
        {
            groupLabel: "My Servers",
            menus: [
                
            ]
        },
        
        {
            groupLabel: "ADN",
            menus: [
                {
                    href: "/admin",
                    label: "Admin Panel",
                    active: pathname.includes("/admin"),
                    icon: ShieldAlert,
                    submenus: []
                },
                {
                    href: "/redeem",
                    label: "Redeem",
                    active: pathname.includes("/redeem"),
                    icon: Gift,
                    submenus: []
                },
                { //sur dashboard (notif qd nouvelle update (check cookies lastdownloaded) un petit badge rouge)
                    href: "/download",
                    label: "Download",
                    active: pathname.includes("/download"),
                    icon: Download,
                    submenus: []
                },
                {
                    href: "https://docs.ADN.xyz/",
                    target: "_blank",
                    label: "Documentation",
                    active: false,
                    icon: Book,
                    submenus: []
                },
            ]
        }
    ];
}