"use client"
import "@/styles/globals.css"

import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <title>MarWiin - Web Panel</title>
      <meta name="title" content="MarWiin - Web Panel" />
      <meta name="description" content="Manage anti-cheat settings and server remotely. User-friendly interface for convenience." />
      <link rel="icon" href="/favicon.ico" />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://panel.marwiin.xyz/" />
      <meta property="og:title" content="MarWiin - Web Panel" />
      <meta property="og:description" content="Manage anti-cheat settings and server remotely. User-friendly interface for convenience." />
      <meta property="og:image" content="/banner.png" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://panel.marwiin.xyz/" />
      <meta property="twitter:title" content="MarWiin - Web Panel" />
      <meta property="twitter:description" content="Manage anti-cheat settings and server remotely. User-friendly interface for convenience." />
      <meta property="twitter:image" content="/banner.png" />

      <meta name="theme-color" content="#1a75f6" />

      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}