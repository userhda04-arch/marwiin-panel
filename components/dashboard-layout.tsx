"use client"

import AuthProvider from "@/context/AuthProvider"

import { cn } from "@/lib/utils"
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle"
import { useStore } from "@/hooks/use-store"
/* import { Footer } from "@/components/admin-panel/footer";*/
import { OutdatedBanner } from "@/components/outdated-banner"
import { Sidebar } from "@/components/sidebar/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state)

  if (!sidebar) return null

  return (
    <>
      <OutdatedBanner />
      <div className="pt-16">
        <AuthProvider>
          <Sidebar />
          <main
            className={cn(
              "min-h-[calc(100dvh_-_56px)] bg-background/50 backdrop-blur-sm transition-[margin-left] duration-300 ease-in-out",
              sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
            )}
          >
            {children}
          </main>
          <footer
            className={cn(
              "transition-[margin-left] duration-300 ease-in-out",
              sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
            )}
          ></footer>
        </AuthProvider>
      </div>
    </>
  )
}
