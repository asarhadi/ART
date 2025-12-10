import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Stethoscope, Scale, TrendingUp, Cog, Building2, GraduationCap, ShoppingBag } from "lucide-react"
import Link from "next/link"

const industries = [
  {
    slug: "professional-services",
    icon: Scale,
    name: "Professional Services",
    description: "Law firms, accounting practices, and consulting companies",
    shortDesc: "Specialized IT solutions for professional service firms requiring security and compliance",
  },
  {
    slug: "healthcare",
    icon: Stethoscope,
    name: "Healthcare",
    description: "Medical practices, clinics, and healthcare organizations",
    shortDesc: "HIPAA-compliant IT infrastructure and secure patient data management",
  },
  {
    slug: "financial-services",
    icon: Briefcase,
    name: "Financial Services",
    description: "Wealth management, insurance agencies, and financial advisors",
    shortDesc: "Secure, compliant technology solutions for financial institutions",
  },
  {
    slug: "technology-companies",
    icon: TrendingUp,
    name: "Technology Companies",
    description: "SaaS startups, software developers, and tech consultancies",
    shortDesc: "Scalable infrastructure and DevOps support for growing tech companies",
  },
  {
    slug: "manufacturing",
    icon: Cog,
    name: "Manufacturing",
    description: "Medical device manufacturers and precision manufacturing",
    shortDesc: "Industrial IT solutions with focus on operational technology and compliance",
  },
  {
    slug: "real-estate",
    icon: Building2,
    name: "Real Estate",
    description: "Property management, real estate agencies, and development firms",
    shortDesc: "Cloud-based solutions for property management and client collaboration",
  },
  {
    slug: "education",
    icon: GraduationCap,
    name: "Education",
    description: "Private schools, training centers, and educational institutions",
    shortDesc: "Secure learning environments with reliable connectivity and data protection",
  },
  {
    slug: "retail",
    icon: ShoppingBag,
    name: "Retail & E-commerce",
    description: "Retail stores, online businesses, and omnichannel retailers",
    shortDesc: "POS systems, inventory management, and secure payment processing",
  },
]

export default function IndustriesPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl md:text-6xl text-balance">
            Industries We Serve
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
            Specialized IT expertise tailored to your industry's unique challenges, compliance requirements, and
            operational needs
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {industries.map((industry) => {
              const Icon = industry.icon
              return (
                <Link key={industry.slug} href={`/industries/${industry.slug}`}>
                  <Card className="border border-border bg-card p-8 text-center hover:border-primary hover:shadow-lg transition-all h-full cursor-pointer group">
                    <Icon className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">{industry.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{industry.description}</p>
                    <Button variant="ghost" className="mt-auto">
                      Learn More →
                    </Button>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
