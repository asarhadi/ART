import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
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
  CheckCircle2,
  ArrowLeft,
} from "lucide-react"
import { notFound } from "next/navigation"

const servicesData: Record<string, any> = {
  "managed-it-support": {
    icon: Server,
    title: "Managed IT Support",
    tagline: "Comprehensive IT infrastructure management and support",
    description:
      "Our Managed IT Support service provides 24/7 monitoring, proactive maintenance, and expert help desk support to keep your technology running smoothly. We act as your dedicated IT department, ensuring maximum uptime and productivity.",
    benefits: [
      "Reduce downtime with proactive monitoring and maintenance",
      "Access expert IT support whenever you need it",
      "Predictable monthly costs with no surprise expenses",
      "Focus on your business while we handle the technology",
      "Scale IT resources as your business grows",
    ],
    features: [
      {
        title: "24/7 Help Desk Support",
        description: "Round-the-clock access to certified IT professionals via phone, email, or chat",
      },
      {
        title: "Remote Monitoring & Management",
        description: "Continuous monitoring of servers, workstations, and network devices with automated alerts",
      },
      {
        title: "Proactive Maintenance",
        description: "Regular system updates, patches, and performance optimization to prevent issues",
      },
      {
        title: "IT Asset Management",
        description: "Complete inventory tracking and lifecycle management of all IT assets",
      },
      {
        title: "Vendor Management",
        description: "Coordinate with third-party vendors and manage service contracts on your behalf",
      },
      {
        title: "Documentation & Reporting",
        description: "Detailed documentation of your IT environment and regular performance reports",
      },
    ],
    process: [
      "Initial assessment of your current IT infrastructure",
      "Develop customized support plan aligned with your business needs",
      "Deploy monitoring tools and establish support channels",
      "Ongoing proactive management and optimization",
      "Regular reviews and strategic planning sessions",
    ],
  },
  cybersecurity: {
    icon: Shield,
    title: "Cybersecurity Services",
    tagline: "Advanced protection against evolving cyber threats",
    description:
      "Protect your business from cyber threats with our comprehensive security services. We provide multi-layered defense strategies, continuous monitoring, and rapid incident response to safeguard your data and systems.",
    benefits: [
      "Protect sensitive data and customer information",
      "Prevent costly security breaches and downtime",
      "Meet compliance requirements and industry standards",
      "Build customer trust with robust security measures",
      "Stay ahead of evolving cyber threats",
    ],
    features: [
      {
        title: "Endpoint Detection & Response (EDR)",
        description: "Advanced threat detection and automated response on all endpoints",
      },
      {
        title: "Security Operations Center (SOC)",
        description: "24/7 monitoring and analysis of security events by certified analysts",
      },
      {
        title: "Vulnerability Assessments",
        description: "Regular scanning and testing to identify and remediate security weaknesses",
      },
      {
        title: "Security Awareness Training",
        description: "Comprehensive training programs to educate employees on security best practices",
      },
      {
        title: "Firewall Management",
        description: "Configuration and management of next-generation firewalls",
      },
      {
        title: "Incident Response",
        description: "Rapid response team ready to contain and remediate security incidents",
      },
    ],
    process: [
      "Security assessment and risk analysis",
      "Develop comprehensive security strategy",
      "Implement security controls and monitoring",
      "Continuous threat monitoring and analysis",
      "Regular security reviews and updates",
    ],
  },
  "cloud-services": {
    icon: Cloud,
    title: "Cloud Services",
    tagline: "Seamless cloud migration and management",
    description:
      "Leverage the power of cloud computing with our expert migration, management, and optimization services. We help you choose the right cloud platform and ensure smooth operations.",
    benefits: [
      "Reduce infrastructure costs and capital expenses",
      "Scale resources up or down based on demand",
      "Improve accessibility and collaboration",
      "Enhance disaster recovery capabilities",
      "Access latest technologies without major investments",
    ],
    features: [
      {
        title: "Cloud Migration",
        description: "Seamless migration of applications and data to cloud platforms",
      },
      {
        title: "Cloud Management",
        description: "Ongoing management and optimization of cloud resources",
      },
      {
        title: "Multi-Cloud Strategy",
        description: "Design and implement strategies across multiple cloud providers",
      },
      {
        title: "Cloud Cost Optimization",
        description: "Continuous monitoring and optimization to reduce cloud spending",
      },
      {
        title: "Cloud Security",
        description: "Implement security controls and compliance in cloud environments",
      },
      {
        title: "Cloud Backup & DR",
        description: "Cloud-based backup and disaster recovery solutions",
      },
    ],
    process: [
      "Cloud readiness assessment",
      "Develop migration strategy and roadmap",
      "Execute phased migration with minimal disruption",
      "Optimize cloud configuration and costs",
      "Ongoing management and support",
    ],
  },
  "backup-disaster-recovery": {
    icon: Lock,
    title: "Backup & Disaster Recovery",
    tagline: "Ensure business continuity with robust data protection",
    description:
      "Protect your critical business data with automated backups and comprehensive disaster recovery planning. We ensure your business can quickly recover from any data loss event.",
    benefits: [
      "Protect against data loss from any cause",
      "Minimize downtime and business disruption",
      "Meet regulatory compliance requirements",
      "Defend against ransomware attacks",
      "Peace of mind knowing your data is safe",
    ],
    features: [
      {
        title: "Automated Backups",
        description: "Scheduled backups of all critical systems and data",
      },
      {
        title: "Disaster Recovery Planning",
        description: "Comprehensive DR plans with defined RTOs and RPOs",
      },
      {
        title: "Ransomware Protection",
        description: "Immutable backups and rapid recovery from ransomware attacks",
      },
      {
        title: "Business Continuity",
        description: "Strategies to maintain operations during disruptions",
      },
      {
        title: "Backup Testing",
        description: "Regular testing to ensure backup integrity and recoverability",
      },
      {
        title: "Offsite & Cloud Backup",
        description: "Secure offsite and cloud-based backup storage",
      },
    ],
    process: [
      "Assess critical systems and data",
      "Define recovery objectives (RTO/RPO)",
      "Implement backup solutions",
      "Develop and document DR procedures",
      "Regular testing and plan updates",
    ],
  },
  "compliance-governance": {
    icon: FileCheck,
    title: "Compliance & Governance",
    tagline: "Navigate regulatory requirements with confidence",
    description:
      "Stay compliant with industry regulations and standards. Our experts help you implement controls, conduct audits, and maintain ongoing compliance.",
    benefits: [
      "Avoid costly fines and penalties",
      "Build customer trust and credibility",
      "Streamline audit processes",
      "Reduce compliance-related risks",
      "Gain competitive advantage",
    ],
    features: [
      {
        title: "Compliance Audits",
        description: "Comprehensive audits for HIPAA, SOC 2, PCI-DSS, CMMC, and more",
      },
      {
        title: "Policy Development",
        description: "Create and maintain security policies and procedures",
      },
      {
        title: "Risk Assessments",
        description: "Identify and evaluate compliance risks",
      },
      {
        title: "Regulatory Reporting",
        description: "Prepare and submit required compliance reports",
      },
      {
        title: "Gap Analysis",
        description: "Identify gaps between current state and compliance requirements",
      },
      {
        title: "Remediation Support",
        description: "Implement controls to address compliance gaps",
      },
    ],
    process: [
      "Identify applicable regulations",
      "Conduct gap analysis",
      "Develop remediation plan",
      "Implement required controls",
      "Ongoing monitoring and reporting",
    ],
  },
  "strategic-consulting": {
    icon: Zap,
    title: "Strategic IT Consulting",
    tagline: "Align technology with business objectives",
    description:
      "Our strategic IT consulting services help you develop technology roadmaps, plan digital transformation initiatives, and make informed technology decisions.",
    benefits: [
      "Align IT investments with business goals",
      "Reduce technology-related risks",
      "Improve operational efficiency",
      "Gain competitive advantage through technology",
      "Make informed technology decisions",
    ],
    features: [
      {
        title: "IT Strategy Planning",
        description: "Develop comprehensive IT strategies aligned with business objectives",
      },
      {
        title: "Technology Roadmaps",
        description: "Create detailed roadmaps for technology initiatives",
      },
      {
        title: "Digital Transformation",
        description: "Guide digital transformation initiatives and change management",
      },
      {
        title: "Vendor Management",
        description: "Evaluate and manage technology vendors and contracts",
      },
      {
        title: "IT Budget Planning",
        description: "Develop and optimize IT budgets and spending",
      },
      {
        title: "Technology Assessments",
        description: "Evaluate current technology and identify improvement opportunities",
      },
    ],
    process: [
      "Understand business objectives and challenges",
      "Assess current technology landscape",
      "Develop strategic recommendations",
      "Create implementation roadmap",
      "Ongoing advisory and support",
    ],
  },
  "network-management": {
    icon: Network,
    title: "Network Management",
    tagline: "Optimize network performance and reliability",
    description:
      "Ensure your network infrastructure is secure, reliable, and optimized for performance. We design, implement, and manage networks of all sizes.",
    benefits: [
      "Maximize network uptime and reliability",
      "Improve network performance and speed",
      "Enhance network security",
      "Support remote and hybrid work",
      "Scale network as business grows",
    ],
    features: [
      {
        title: "Network Design & Setup",
        description: "Design and implement secure, scalable network infrastructure",
      },
      {
        title: "Performance Monitoring",
        description: "Continuous monitoring of network performance and bandwidth",
      },
      {
        title: "Network Security",
        description: "Implement firewalls, VPNs, and network segmentation",
      },
      {
        title: "Bandwidth Optimization",
        description: "Optimize bandwidth usage and implement QoS policies",
      },
      {
        title: "Wireless Solutions",
        description: "Design and manage secure wireless networks",
      },
      {
        title: "Network Troubleshooting",
        description: "Rapid diagnosis and resolution of network issues",
      },
    ],
    process: [
      "Assess current network infrastructure",
      "Design optimized network architecture",
      "Implement network solutions",
      "Configure monitoring and security",
      "Ongoing management and optimization",
    ],
  },
  "help-desk": {
    icon: Headphones,
    title: "Help Desk Services",
    tagline: "Responsive support when your team needs it",
    description:
      "Provide your employees with fast, friendly IT support through our professional help desk services. We handle everything from password resets to complex technical issues.",
    benefits: [
      "Improve employee productivity",
      "Reduce IT-related frustration",
      "Faster issue resolution",
      "Consistent support experience",
      "Free internal resources for strategic work",
    ],
    features: [
      {
        title: "Multi-Channel Support",
        description: "Support via phone, email, chat, and self-service portal",
      },
      {
        title: "Ticket Management",
        description: "Organized ticketing system with priority-based routing",
      },
      {
        title: "Remote Desktop Support",
        description: "Secure remote access to resolve issues quickly",
      },
      {
        title: "User Training",
        description: "Training and documentation for common IT tasks",
      },
      {
        title: "Knowledge Base",
        description: "Self-service knowledge base for common issues",
      },
      {
        title: "Escalation Management",
        description: "Structured escalation process for complex issues",
      },
    ],
    process: [
      "Set up support channels and ticketing system",
      "Train help desk team on your environment",
      "Establish SLAs and escalation procedures",
      "Provide ongoing support",
      "Regular reporting and improvement",
    ],
  },
  "data-management": {
    icon: HardDrive,
    title: "Data Management",
    tagline: "Organize, protect, and leverage your data",
    description:
      "Implement comprehensive data management strategies to store, organize, and protect your business data throughout its lifecycle.",
    benefits: [
      "Improve data accessibility and organization",
      "Reduce storage costs",
      "Ensure data compliance",
      "Enhance data security",
      "Support data-driven decision making",
    ],
    features: [
      {
        title: "Data Storage Solutions",
        description: "Implement efficient and scalable data storage systems",
      },
      {
        title: "Data Archiving",
        description: "Archive historical data for compliance and cost savings",
      },
      {
        title: "Data Migration",
        description: "Migrate data between systems with zero data loss",
      },
      {
        title: "Data Lifecycle Management",
        description: "Manage data from creation to deletion",
      },
      {
        title: "Data Classification",
        description: "Classify and organize data based on sensitivity and importance",
      },
      {
        title: "Data Governance",
        description: "Implement policies and procedures for data management",
      },
    ],
    process: [
      "Assess current data landscape",
      "Develop data management strategy",
      "Implement storage and archiving solutions",
      "Establish data governance policies",
      "Ongoing management and optimization",
    ],
  },
  "mobile-device-management": {
    icon: Smartphone,
    title: "Mobile Device Management",
    tagline: "Secure and manage mobile devices across your organization",
    description:
      "Protect company data on mobile devices while enabling productivity. Our MDM solutions provide security, management, and support for all mobile devices.",
    benefits: [
      "Secure company data on mobile devices",
      "Enable BYOD policies safely",
      "Improve mobile productivity",
      "Reduce mobile security risks",
      "Simplify device management",
    ],
    features: [
      {
        title: "Device Enrollment",
        description: "Easy enrollment and configuration of mobile devices",
      },
      {
        title: "App Management",
        description: "Deploy and manage mobile applications",
      },
      {
        title: "Security Policies",
        description: "Enforce security policies on all mobile devices",
      },
      {
        title: "Remote Wipe",
        description: "Remotely wipe data from lost or stolen devices",
      },
      {
        title: "Compliance Monitoring",
        description: "Monitor device compliance with security policies",
      },
      {
        title: "Usage Reporting",
        description: "Track device usage and application performance",
      },
    ],
    process: [
      "Define mobile device policies",
      "Select and implement MDM platform",
      "Enroll and configure devices",
      "Deploy applications and policies",
      "Ongoing management and support",
    ],
  },
  "incident-response": {
    icon: AlertTriangle,
    title: "Incident Response",
    tagline: "Rapid response to security incidents and IT emergencies",
    description:
      "When security incidents or IT emergencies occur, our incident response team is ready to contain, investigate, and remediate the issue quickly.",
    benefits: [
      "Minimize damage from security incidents",
      "Reduce recovery time and costs",
      "Preserve evidence for investigations",
      "Meet regulatory reporting requirements",
      "Learn from incidents to prevent recurrence",
    ],
    features: [
      {
        title: "24/7 Incident Response",
        description: "Round-the-clock availability for security incidents",
      },
      {
        title: "Forensic Analysis",
        description: "Detailed investigation to determine incident scope and cause",
      },
      {
        title: "Breach Containment",
        description: "Rapid containment to prevent further damage",
      },
      {
        title: "Recovery Planning",
        description: "Develop and execute recovery plans",
      },
      {
        title: "Post-Incident Review",
        description: "Analyze incidents and implement preventive measures",
      },
      {
        title: "Regulatory Reporting",
        description: "Assist with required breach notifications and reporting",
      },
    ],
    process: [
      "Detect and report incident",
      "Contain and isolate affected systems",
      "Investigate and analyze incident",
      "Remediate and recover",
      "Post-incident review and improvement",
    ],
  },
  "staff-augmentation": {
    icon: Users,
    title: "IT Staff Augmentation",
    tagline: "Supplement your team with skilled IT professionals",
    description:
      "Access skilled IT professionals on-demand to supplement your team for projects, peak periods, or ongoing support needs.",
    benefits: [
      "Access specialized skills when needed",
      "Scale team up or down flexibly",
      "Reduce hiring and training costs",
      "Accelerate project delivery",
      "Fill temporary skill gaps",
    ],
    features: [
      {
        title: "Skilled IT Professionals",
        description: "Access certified professionals across all IT disciplines",
      },
      {
        title: "Flexible Engagement",
        description: "Short-term, long-term, or project-based engagements",
      },
      {
        title: "Project Support",
        description: "Dedicated resources for specific projects",
      },
      {
        title: "Knowledge Transfer",
        description: "Transfer knowledge to your internal team",
      },
      {
        title: "Rapid Deployment",
        description: "Quick onboarding and deployment of resources",
      },
      {
        title: "Quality Assurance",
        description: "Vetted professionals with proven track records",
      },
    ],
    process: [
      "Identify skill requirements",
      "Match qualified professionals",
      "Onboard and integrate with team",
      "Provide ongoing support and management",
      "Knowledge transfer and transition",
    ],
  },
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = servicesData[params.slug]

  if (!service) {
    notFound()
  }

  const Icon = service.icon

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>

          <div className="flex items-start gap-6">
            <div className="rounded-2xl bg-primary/10 p-4">
              <Icon className="h-12 w-12 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground sm:text-5xl text-balance">{service.title}</h1>
              <p className="mt-4 text-xl text-muted-foreground">{service.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-lg text-muted-foreground leading-relaxed">{service.description}</p>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-12 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">Key Benefits</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.benefits.map((benefit: string, idx: number) => (
              <Card key={idx} className="p-4 border-border">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{benefit}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">What's Included</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {service.features.map((feature: any, idx: number) => (
              <Card key={idx} className="p-6 border-border hover:border-primary/50 transition-colors">
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-4 py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">Our Process</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {service.process.map((step: string, idx: number) => (
              <div key={idx} className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="default" className="rounded-full h-8 w-8 flex items-center justify-center p-0">
                    {idx + 1}
                  </Badge>
                </div>
                <p className="text-sm text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">Ready to Get Started?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Let's discuss how {service.title.toLowerCase()} can benefit your business
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/support">Contact Us</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = Object.keys(servicesData)

  return slugs.map((slug) => ({
    slug: slug,
  }))
}
