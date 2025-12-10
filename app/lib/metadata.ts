import type { Metadata } from "next"

export const baseMetadata = {
  metadataBase: new URL("https://americanreliabletech.com"),
  alternates: {
    canonical: "/",
  },
}

export function generatePageMetadata({
  title,
  description,
  path = "",
  keywords = [],
  ogImage = "/og-image.jpg",
}: {
  title: string
  description: string
  path?: string
  keywords?: string[]
  ogImage?: string
}): Metadata {
  const fullTitle = `${title} | American Reliable Tech - Irvine MSP`
  const url = `https://americanreliabletech.com${path}`

  return {
    title: fullTitle,
    description,
    keywords: [
      "MSP Irvine",
      "IT Support Orange County",
      "Managed Service Provider",
      "Cybersecurity Services",
      "IT Services California",
      ...keywords,
    ].join(", "),
    authors: [{ name: "American Reliable Tech" }],
    creator: "American Reliable Tech",
    publisher: "American Reliable Tech",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "American Reliable Tech",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
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
  }
}
