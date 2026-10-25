"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowDownToLine,
  Download,
  ExternalLink,
  FileText,
  Info,
  RefreshCw,
  Shield,
  X,
} from "lucide-react"
import { useSession } from "next-auth/react"

import { notify } from "@/lib/notifications"
import { fetchLatestVersion } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ContentLayout } from "@/components/content-layout"

export default function DownloadPage() {
  const [canDownload, setCanDownload] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [activeServers, setActiveServers] = useState<any[]>([])
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [versionInfo, setVersionInfo] = useState({
    version: "Loading...",
    updatedAt: new Date(),
  })

  const { data: session } = useSession()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const getVersionInfo = async () => {
    try {
      const version = await fetchLatestVersion()
      if (version) {
        setVersionInfo(version)
      }
    } catch (error) {
      console.error("Error fetching version information", error)
      setVersionInfo({
        version: "4.4.68",
        updatedAt: new Date(),
      })
    }
  }

  const getActiveServers = async () => {
    if (!session?.user.id) return
    setIsLoading(true)
    try {
      const response = await fetch("/api/me/getActiveServers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.activeServers && data.activeServers.length > 0) {
          setActiveServers(data.activeServers)
          setCanDownload(true)
        } else {
          setActiveServers([])
          setCanDownload(false)
        }
      } else {
        setCanDownload(false)
        setActiveServers([])
      }
    } catch (error) {
      console.error("Error getting active server", error)
      setCanDownload(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!canDownload) {
      notify(
        "Access Denied",
        "You need an active license to download MarWiin."
      )
      return
    }

    try {
      setIsDownloading(true)

      const response = await fetch("/api/download/MarWiin")

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = "MarWiin.zip"
        document.body.appendChild(a)
        a.click()
        setTimeout(function () {
          if (document.body.contains(a)) {
            document.body.removeChild(a)
          }
          window.URL.revokeObjectURL(url)
        }, 200)

        notify(
          "Download",
          "Successfully downloaded MarWiin.",
          "redirect",
          "Installation Guide",
          "https://ayznnn.gitbook.io/MarWiin-v4/getting-started/installation-guide"
        )
      } else {
        if (response.status === 403) {
          notify(
            "License Required",
            "You need an active license to download MarWiin."
          )
        } else if (response.status === 404) {
          notify("Download Failed", "The requested file could not be found.")
        } else {
          notify(
            "Download Failed",
            "There was an error starting your download. Please try again."
          )
        }
      }
    } catch (error) {
      console.error("Error downloading MarWiin:", error)
      notify(
        "Download Failed",
        "There was an error starting your download. Please try again."
      )
    } finally {
      setTimeout(() => {
        setIsDownloading(false)
      }, 1000)
    }
  }

  useEffect(() => {
    if (!session?.user.id) return
    getActiveServers()
    getVersionInfo()
  }, [session])

  return (
    <ContentLayout title="Download">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Download</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      <motion.div
        className="mt-6 grid gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Alert
            className="cursor-pointer border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
            onClick={() =>
              window.open("https://MarWiin.xyz/dashboard", "_blank")
            }
          >
            <Info className="size-5 text-red-500" />
            <AlertTitle className="text-red-700 dark:text-red-300">
              ⚠️ Outdated Panel - Update Required
            </AlertTitle>
            <AlertDescription className="text-red-600 dark:text-red-400">
              This download panel is outdated and no longer supported. Please
              visit the new panel at MarWiin.xyz/dashboard to download the
              latest files there.
            </AlertDescription>
          </Alert>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-primary/10">
            <CardHeader className="bg-primary/5 pb-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="size-5 shrink-0 text-primary" />
                  <CardTitle>MarWiin Anti-Cheat</CardTitle>
                </div>
                <Badge
                  variant="destructive"
                  className="hidden w-fit text-xs sm:flex"
                >
                  v{versionInfo.version}
                </Badge>
              </div>
              <CardDescription>
                The complete anti-cheat system for your server. Protect your
                players from cheaters and hackers.
              </CardDescription>
            </CardHeader>

            <CardContent className="py-6">
              <div className="py-4 text-center sm:py-8">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/5">
                  <Download className="size-8 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-medium">
                  MarWiin Anti-Cheat
                </h3>
                <p className="mx-auto max-w-md text-sm text-muted-foreground sm:text-base">
                  Download the latest version of MarWiin to protect your
                  server from cheaters and hackers.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 border-t bg-muted/20 p-4 sm:px-6">
              <div className="w-full">
                {isLoading ? (
                  <Button disabled className="w-full">
                    <RefreshCw className="mr-2 size-4 animate-spin" />
                    Checking license...
                  </Button>
                ) : canDownload ? (
                  <Button
                    onClick={handleDownload}
                    className="w-full gap-2"
                    disabled={isDownloading}
                    size="lg"
                  >
                    {isDownloading ? (
                      <>
                        <ArrowDownToLine className="size-4 animate-pulse" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="size-4" />
                        Download MarWiin
                      </>
                    )}
                  </Button>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full">
                          <Button disabled className="w-full gap-2">
                            <X className="size-4" />
                            License Required
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          You need an active license to download MarWiin.
                        </p>
                        <Link
                          href="/redeem"
                          className="mt-1 block text-sm text-primary hover:underline"
                        >
                          Redeem a license key
                        </Link>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              <div className="flex w-full flex-col gap-2 sm:flex-row">
                <Button variant="outline" asChild className="w-full">
                  <Link
                    href="https://ayznnn.gitbook.io/MarWiin-v4/getting-started/installation-guide"
                    target="_blank"
                  >
                    <FileText className="mr-2 size-4" />
                    Installation Guide
                  </Link>
                </Button>

                <Button variant="outline" asChild className="w-full">
                  <Link href="https://docs.MarWiin.xyz/" target="_blank">
                    <ExternalLink className="mr-2 size-4" />
                    Documentation
                  </Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {activeServers.length === 0 && !isLoading && (
            <Card className="col-span-full border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">No Active Servers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You don&apos;t have any active servers yet. Redeem a license
                  key to get started.
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/redeem">Redeem License</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </motion.div>
    </ContentLayout>
  )
}
