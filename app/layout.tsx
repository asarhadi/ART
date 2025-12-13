import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SupportChat } from "@/components/support-chat"
import NavigationWrapper from "@/components/navigation-wrapper"
import { Toaster } from "@/components/ui/toaster"
import { AccessibilityToolbar } from "@/components/accessibility-toolbar"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ART (American Reliable Tech) | Trusted MSP",
  description:
    "Professional managed IT services for Irvine and Orange County. Cybersecurity, cloud solutions, and compliance support.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <NavigationWrapper />
        {children}
        <SupportChat />
        <AccessibilityToolbar />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
