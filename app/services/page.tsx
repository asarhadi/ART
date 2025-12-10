import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import {
  Shield,
  Cloud,
  Server,
  Lock,
  Users,
  Zap,
  Headphones,
  Network,
  HardDrive,
  FileCheck,
  Smartphone,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const services = [
  {
    icon: Server,
    title: "Managed IT Support",
    slug: "managed-it-support",
    description: "24/7 help desk, monitoring, and proactive management of your entire IT infrastructure",
    features: [
      "24/7 Help Desk Support",
      "Remote Monitoring & Management",
      "Proactive Maintenance",
      "IT Asset Management",
    ],
  },
  {
    icon: Shield,
    title: "Cybersecurity Services",
    slug: "cybersecurity",
    description: "Advanced threat protection, EDR, SOC monitoring, and security awareness training",
    features: [
      "Endpoint Detection & Response",
      "Security Operations Center",
      "Vulnerability Assessments",
      "Security Awareness Training",
    ],
  },
  {
    icon: Cloud,
    title: "Cloud Services",
    slug: "cloud-services",
    description: "Migration, management, and optimization of cloud infrastructure and applications",
    features: ["Cloud Migration", "Cloud Management", "Multi-Cloud Strategy", "Cloud Cost Optimization"],
  },
  {
    icon: Lock,
    title: "Backup & Disaster Recovery",
    slug: "backup-disaster-recovery",
    description: "Automated backups, disaster recovery planning, and ransomware protection",
    features: ["Automated Backups", "Disaster Recovery Planning", "Ransomware Protection", "Business Continuity"],
  },
  {
    icon: FileCheck,
    title: "Compliance & Governance",
    slug: "compliance-governance",
    description: "HIPAA, SOC 2, PCI-DSS, and CMMC compliance assistance and audits",
    features: ["Compliance Audits", "Policy Development", "Risk Assessments", "Regulatory Reporting"],
  },
  {
    icon: Zap,
    title: "Strategic IT Consulting",
    slug: "strategic-consulting",
    description: "IT strategy development, technology roadmaps, and digital transformation guidance",
    features: ["IT Strategy Planning", "Technology Roadmaps", "Digital Transformation", "Vendor Management"],
  },
  {
    icon: Network,
    title: "Network Management",
    slug: "network-management",
    description: "Network design, monitoring, optimization, and troubleshooting for peak performance",
    features: ["Network Design & Setup", "Performance Monitoring", "Network Security", "Bandwidth Optimization"],
  },
  {
    icon: Headphones,
    title: "Help Desk Services",
    slug: "help-desk",
    description: "Responsive IT support with ticketing, remote assistance, and user training",
    features: ["Multi-Channel Support", "Ticket Management", "Remote Desktop Support", "User Training"],
  },
  {
    icon: HardDrive,
    title: "Data Management",
    slug: "data-management",
    description: "Data storage, archiving, migration, and lifecycle management solutions",
    features: ["Data Storage Solutions", "Data Archiving", "Data Migration", "Data Lifecycle Management"],
  },
  {
    icon: Smartphone,
    title: "Mobile Device Management",
    slug: "mobile-device-management",
    description: "Secure and manage mobile devices, applications, and data across your organization",
    features: ["Device Enrollment", "App Management", "Security Policies", "Remote Wipe"],
  },
  {
    icon: AlertTriangle,
    title: "Incident Response",
    slug: "incident-response",
    description: "Rapid response to security incidents, breaches, and IT emergencies",
    features: ["24/7 Incident Response", "Forensic Analysis", "Breach Containment", "Recovery Planning"],
  },
  {
    icon: Users,
    title: "IT Staff Augmentation",
    slug: "staff-augmentation",
    description: "Supplement your team with skilled IT professionals for projects or ongoing support",
    features: ["Skilled IT Professionals", "Flexible Engagement", "Project Support", "Knowledge Transfer"],
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl md:text-6xl text-balance">
            Comprehensive MSP Services
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
            Best-in-class managed IT services designed to support, secure, and scale your business
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Link key={service.slug} href={`/services/${service.slug}`}>
                  <Card className="border border-border bg-card p-6 hover:border-primary hover:shadow-lg transition-all h-full cursor-pointer group">
                    <Icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 text-sm font-medium text-primary group-hover:underline">Learn more →</div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Ready to Transform Your IT Infrastructure?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Let's discuss how our managed services can support your business goals
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/support">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/#contact">Schedule Consultation</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
