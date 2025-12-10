import { Card } from "@/components/ui/card"
import { Shield, Cloud, Server, Lock, Users, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const services = [
  {
    icon: Server,
    title: "Managed IT Support",
    description: "24/7 help desk, monitoring, and proactive management of your entire IT infrastructure",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Advanced threat protection, EDR, SOC monitoring, and security awareness training",
  },
  {
    icon: Cloud,
    title: "Cloud Services",
    description: "Migration, management, and optimization of cloud infrastructure and applications",
  },
  {
    icon: Lock,
    title: "Backup & DR",
    description: "Automated backups, disaster recovery planning, and ransomware protection",
  },
  {
    icon: Users,
    title: "Compliance Support",
    description: "HIPAA, SOC 2, PCI-DSS, and CMMC compliance assistance and audits",
  },
  {
    icon: Zap,
    title: "Strategic Consulting",
    description: "IT strategy development, technology roadmaps, and digital transformation guidance",
  },
]

export default function ServiceOverview() {
  return (
    <section className="bg-background px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl text-balance">
            Comprehensive IT Solutions Built for Growth
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From day-to-day support to strategic planning, we provide everything your business needs
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Link key={service.title} href="/services">
                <Card className="border border-border bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group h-full">
                  <Icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  <div className="mt-4 text-sm font-medium text-primary group-hover:underline">Learn more →</div>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
