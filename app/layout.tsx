import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SupportChat } from "@/components/support-chat"
import Navigation from "@/components/navigation"
import { Toaster } from "@/components/ui/toaster"
import { AccessibilityToolbar } from "@/components/accessibility-toolbar"
import { StructuredData } from "@/components/structured-data"

const _geist = Geist({ subsets: ["latin"], display: "swap", variable: "--font-geist" })
const _geistMono = Geist_Mono({ subsets: ["latin"], display: "swap", variable: "--font-geist-mono" })

export const metadata: Metadata = {
  metadataBase: new URL("https://americanreliabletech.com"),
  title: {
    default: "American Reliable Tech | Premier MSP in Irvine & Orange County",
    template: "%s | American Reliable Tech",
  },
  description:
    "Leading Managed Service Provider (MSP) in Irvine, Orange County. Expert IT support, cybersecurity, cloud solutions, and compliance services for businesses. 24/7 support, 99.9% uptime guarantee.",
  keywords: [
    "MSP Irvine",
    "IT Support Orange County",
    "Managed IT Services California",
    "Cybersecurity Services Irvine",
    "Cloud Solutions Orange County",
    "IT Consulting California",
    "Managed Service Provider",
    "IT Support Near Me",
    "Business IT Services",
    "HIPAA Compliance IT",
    "SOC 2 Compliance",
    "Disaster Recovery Services",
    "24/7 IT Support",
  ].join(", "),
  authors: [{ name: "American Reliable Tech" }],
  creator: "American Reliable Tech",
  publisher: "American Reliable Tech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://americanreliabletech.com",
    siteName: "American Reliable Tech",
    title: "American Reliable Tech | Premier MSP in Irvine & Orange County",
    description:
      "Leading Managed Service Provider offering expert IT support, cybersecurity, and cloud solutions for businesses in Orange County.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "American Reliable Tech - Your Trusted IT Partner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "American Reliable Tech | Premier MSP in Irvine & Orange County",
    description: "Leading Managed Service Provider offering expert IT support, cybersecurity, and cloud solutions.",
    images: ["/og-image.jpg"],
    creator: "@AmericanReliableTech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://americanreliabletech.com",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    bing: "your-bing-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_geist.variable} ${_geistMono.variable}`}>
      <head>
        <link rel="canonical" href="https://americanreliabletech.com" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body className={`font-sans antialiased`}>
        <StructuredData />
        <Navigation />
        {children}
        <SupportChat />
        <AccessibilityToolbar />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
