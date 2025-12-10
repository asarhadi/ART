export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://americanreliabletech.com/#organization",
    name: "American Reliable Tech",
    alternateName: "ART MSP",
    url: "https://americanreliabletech.com",
    logo: {
      "@type": "ImageObject",
      url: "https://americanreliabletech.com/art-logo-full.png",
      width: 600,
      height: 200,
    },
    description:
      "Premier Managed Service Provider (MSP) offering IT support, cybersecurity, cloud solutions, and compliance services in Irvine and Orange County.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Irvine",
      addressRegion: "CA",
      addressCountry: "US",
      postalCode: "92618",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Irvine",
      },
      {
        "@type": "State",
        name: "California",
      },
      {
        "@type": "AdministrativeArea",
        name: "Orange County",
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["English"],
      areaServed: "US",
    },
    sameAs: [
      "https://www.linkedin.com/company/american-reliable-tech",
      "https://twitter.com/AmericanReliableTech",
      "https://www.facebook.com/AmericanReliableTech",
    ],
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://americanreliabletech.com/#localbusiness",
    name: "American Reliable Tech",
    image: "https://americanreliabletech.com/art-logo-full.png",
    telephone: "+1-949-XXX-XXXX",
    email: "contact@americanreliabletech.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Your Street Address",
      addressLocality: "Irvine",
      addressRegion: "CA",
      postalCode: "92618",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "33.6846",
      longitude: "-117.8265",
    },
    url: "https://americanreliabletech.com",
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://americanreliabletech.com/#service",
    serviceType: "Managed IT Services",
    provider: {
      "@id": "https://americanreliabletech.com/#organization",
    },
    areaServed: {
      "@type": "State",
      name: "California",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "IT Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Managed IT Support",
            description: "24/7 help desk, monitoring, and proactive management",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Cybersecurity Services",
            description: "Advanced threat protection and security monitoring",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Cloud Services",
            description: "Cloud migration, management, and optimization",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Compliance & Governance",
            description: "HIPAA, SOC 2, PCI-DSS compliance assistance",
          },
        },
      ],
    },
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://americanreliabletech.com/#website",
    url: "https://americanreliabletech.com",
    name: "American Reliable Tech",
    publisher: {
      "@id": "https://americanreliabletech.com/#organization",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://americanreliabletech.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
    </>
  )
}
