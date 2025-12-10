import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Stethoscope, Scale, TrendingUp, Cog } from "lucide-react"
import Link from "next/link"

const industries = [
  {
    slug: "professional-services",
    icon: Scale,
    name: "Professional Services",
    description: "Law firms, accounting practices, and consulting companies",
  },
  {
    slug: "healthcare",
    icon: Stethoscope,
    name: "Healthcare",
    description: "Medical practices, clinics, and healthcare organizations",
  },
  {
    slug: "financial-services",
    icon: Briefcase,
    name: "Financial Services",
    description: "Wealth management, insurance agencies, and advisors",
  },
  {
    slug: "technology-companies",
    icon: TrendingUp,
    name: "Technology Companies",
    description: "SaaS startups, software developers, and tech consultancies",
  },
  {
    slug: "manufacturing",
    icon: Cog,
    name: "Manufacturing",
    description: "Medical device manufacturers and precision manufacturing",
  },
]

export default function IndustriesServed() {
  return (
    <section className="bg-background px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl text-balance">
            Industries We Serve
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Specialized expertise for your industry's unique IT challenges and compliance requirements
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => {
            const Icon = industry.icon
            return (
              <Link key={industry.slug} href={`/industries/${industry.slug}`}>
                <Card className="border border-border bg-card p-8 text-center hover:border-primary hover:shadow-lg transition-all cursor-pointer group h-full">
                  <Icon className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">{industry.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{industry.description}</p>
                  <Button variant="ghost" size="sm" className="mt-auto">
                    Learn More →
                  </Button>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/industries">
            <Button size="lg" variant="outline">
              View All Industries
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
