"use client";

import Link from "next/link";
import { Icons } from "../icons";
import { LogOut, Server } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapseMenuButton } from "@/components/sidebar/collapse-menu-button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchMyServers } from "@/lib/functions";
import { formatColorText } from "../formatColorText";

interface MenuProps {
  isOpen: boolean | undefined;
}


export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const [menuList, setMenuList] = useState(getMenuList(pathname))
  const [myServers, setMyServers] = useState<any>();
  const {data: session} = useSession()

  const getMyServers = async () => {
    if (!session?.user.id) return;
    
    const myServers = await fetchMyServers()
    setMyServers(myServers)
  }

  useEffect(() => {
    getMyServers()
  }, [session?.user.id])

  useEffect(() => {
    if (!myServers) return;

    const myServersMenus = myServers.map((server: any) => ({
      href: ``,
      label: formatColorText(server.serverName),
      active: pathname.includes(`server/${server.id}`),
      icon: Server,
      submenus: [
        {
          href: `/server/${server.id}`,
          label: "Tableau de bord",
          active: pathname === `/server/${server.id}`,
        },
        {
          href: `/server/${server.id}/players`,
          label: "Joueurs",
          active: pathname === `/server/${server.id}/players`,
        },
        {
          href: `/server/${server.id}/map`,
          label: "Carte interactive",
          active: pathname === `/server/${server.id}/map`,
        },
        {
          href: `/server/${server.id}/multistream`,
          label: "Multi Stream",
          active: pathname === `/server/${server.id}/multistream`,
        },
        {
          href: `/server/${server.id}/bans`,
          label: "Bannissements",
          active: pathname === `/server/${server.id}/bans`,
        },
        ...(server.isOwner || server.isDeveloper ? [{
          href: `/server/${server.id}/configuration`,
          label: "Configuration",
          active: pathname === `/server/${server.id}/configuration`,
        }] : []),
        {
          href: `/server/${server.id}/security`,
          label: "Règles de sécurité",
          active: pathname === `/server/${server.id}/security`,
        },
        {
          href: `/server/${server.id}/lookup`,
          label: "Recherche",
          active: pathname === `/server/${server.id}/lookup`,
        },
        ...(server.isOwner || server.isAdmin || server.isDeveloper ? [{
          href: `/server/${server.id}/members`,
          label: "Admins",
          active: pathname === `/server/${server.id}/members`,
        }] : []),
        {
          href: `/server/${server.id}/logs`,
          label: "Journaux",
          active: pathname === `/server/${server.id}/logs`,
        },
        {
          href: `/server/${server.id}/console`,
          label: "Console",
          active: pathname === `/server/${server.id}/console`,
        },
      ],
    }));

    const menuList = getMenuList(pathname)
    const updatedMenuList = menuList.map((group) =>
      group.groupLabel === "My Servers" ? { ...group, menus: myServersMenus } : group
    );

    setMenuList(updatedMenuList);
  }, [myServers, pathname]);

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100dvh-48px-36px-16px-32px)] lg:min-h-[calc(100dvh-32px-40px-32px)] items-start space-y-1 px-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Icons.Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(
                ({ href, target, label, icon: Icon, active, submenus }, index) =>
                  submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={active ? "secondary" : "ghost"}
                              className="w-full justify-start h-10 mb-1"
                              asChild
                            >
                              <Link href={href} target={target}>
                                <span
                                  className={cn(isOpen === false ? "" : "mr-4")}
                                >
                                  <Icon size={18} />
                                </span>
                                <p
                                  className={cn(
                                    "max-w-[200px] truncate",
                                    isOpen === false
                                      ? "-translate-x-96 opacity-0"
                                      : "translate-x-0 opacity-100"
                                  )}
                                >
                                  {label}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={active}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  )
              )}
            </li>
          ))}
          <li className="w-full grow flex items-end">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    variant="outline"
                    className="w-full justify-center h-10 mt-5"
                  >
                    <span className={cn(isOpen === false ? "" : "mr-4")}>
                      <LogOut size={18} />
                    </span>
                    <p
                      className={cn(
                        "whitespace-nowrap",
                        isOpen === false ? "opacity-0 hidden" : "opacity-100"
                      )}
                    >
                      Sign out
                    </p>
                  </Button>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side="right">Sign out</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}