import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, ArrowRight, Shield, Zap, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

const industriesData = {
  "professional-services": {
    name: "Professional Services",
    description: "Comprehensive IT solutions designed for law firms, accounting practices, and consulting companies",
    hero: "Secure, compliant technology infrastructure that protects client confidentiality and enables seamless collaboration",
    challenges: [
      "Client data confidentiality and security",
      "Regulatory compliance (e.g., attorney-client privilege, SOX)",
      "Document management and version control",
      "Secure client communication and file sharing",
      "Mobile access for remote work and client meetings",
    ],
    solutions: [
      "End-to-end encryption for all client communications",
      "Secure document management systems with audit trails",
      "Compliance-focused backup and disaster recovery",
      "Virtual private networks (VPN) for secure remote access",
      "Multi-factor authentication and identity management",
      "Practice management software integration",
    ],
    benefits: [
      "Maintain client confidentiality with enterprise-grade security",
      "Meet industry compliance requirements effortlessly",
      "Improve collaboration with secure file sharing",
      "Enable productive remote work without security risks",
      "Reduce IT overhead with managed services",
    ],
    caseStudy: {
      title: "Law Firm Achieves 99.9% Uptime",
      description:
        "A 50-attorney law firm improved security posture and eliminated downtime with our managed IT services.",
      results: ["Zero security incidents in 2 years", "50% reduction in IT costs", "24/7 support coverage"],
    },
  },
  healthcare: {
    name: "Healthcare",
    description: "HIPAA-compliant IT infrastructure for medical practices, clinics, and healthcare organizations",
    hero: "Secure, reliable technology that protects patient data while enabling quality care delivery",
    challenges: [
      "HIPAA compliance and patient data protection",
      "Electronic health records (EHR) system reliability",
      "Secure communication between providers",
      "Medical device integration and management",
      "Telehealth infrastructure and security",
    ],
    solutions: [
      "HIPAA-compliant cloud infrastructure and backup",
      "EHR system optimization and support",
      "Encrypted communication platforms for providers",
      "Medical device network segmentation",
      "Secure telehealth platforms with video conferencing",
      "Business Associate Agreement (BAA) coverage",
    ],
    benefits: [
      "Achieve and maintain HIPAA compliance",
      "Protect patient data with advanced security measures",
      "Ensure EHR system reliability and performance",
      "Enable secure telehealth services",
      "Focus on patient care, not IT issues",
    ],
    caseStudy: {
      title: "Medical Practice Achieves HIPAA Compliance",
      description:
        "A multi-location medical practice implemented comprehensive security controls and passed HIPAA audit.",
      results: ["100% HIPAA compliance", "Zero data breaches", "Improved EHR performance by 40%"],
    },
  },
  "financial-services": {
    name: "Financial Services",
    description:
      "Secure, compliant technology solutions for wealth management, insurance agencies, and financial advisors",
    hero: "Enterprise-grade security and compliance for financial institutions of all sizes",
    challenges: [
      "Financial data security and fraud prevention",
      "Regulatory compliance (SEC, FINRA, SOX)",
      "Secure client portal and communication",
      "Business continuity and disaster recovery",
      "Third-party vendor risk management",
    ],
    solutions: [
      "Multi-layered security with advanced threat protection",
      "Compliance monitoring and reporting tools",
      "Encrypted client portals and secure email",
      "Comprehensive backup and disaster recovery",
      "Vendor security assessment and monitoring",
      "Regular security audits and penetration testing",
    ],
    benefits: [
      "Meet SEC, FINRA, and other regulatory requirements",
      "Protect client financial data from cyber threats",
      "Maintain business continuity during disruptions",
      "Build client trust with robust security measures",
      "Reduce compliance costs and complexity",
    ],
    caseStudy: {
      title: "Wealth Management Firm Passes SEC Audit",
      description:
        "A registered investment advisor implemented our compliance-focused IT infrastructure and passed SEC examination.",
      results: ["Zero compliance findings", "Improved security posture", "30% reduction in IT costs"],
    },
  },
  "technology-companies": {
    name: "Technology Companies",
    description:
      "Scalable infrastructure and DevOps support for SaaS startups, software developers, and tech consultancies",
    hero: "Modern IT infrastructure that scales with your growth and supports rapid innovation",
    challenges: [
      "Rapid scaling and infrastructure growth",
      "Development and production environment management",
      "CI/CD pipeline optimization",
      "Cloud cost optimization",
      "Security in fast-paced development cycles",
    ],
    solutions: [
      "Cloud infrastructure design and management (AWS, Azure, GCP)",
      "DevOps automation and CI/CD pipeline setup",
      "Container orchestration (Kubernetes, Docker)",
      "Infrastructure as Code (Terraform, CloudFormation)",
      "Security automation and DevSecOps practices",
      "Cloud cost monitoring and optimization",
    ],
    benefits: [
      "Scale infrastructure seamlessly as you grow",
      "Accelerate development with automated pipelines",
      "Reduce cloud costs through optimization",
      "Maintain security without slowing development",
      "Focus on product development, not infrastructure",
    ],
    caseStudy: {
      title: "SaaS Startup Scales to 10,000 Users",
      description: "A growing SaaS company built scalable cloud infrastructure that supported 10x user growth.",
      results: ["99.99% uptime", "40% reduction in cloud costs", "50% faster deployment cycles"],
    },
  },
  manufacturing: {
    name: "Manufacturing",
    description: "Industrial IT solutions for medical device manufacturers and precision manufacturing operations",
    hero: "Reliable technology infrastructure that supports operational excellence and regulatory compliance",
    challenges: [
      "Operational technology (OT) and IT convergence",
      "Manufacturing system uptime and reliability",
      "Quality management system (QMS) compliance",
      "Supply chain visibility and integration",
      "Industrial IoT device management",
    ],
    solutions: [
      "OT/IT network segmentation and security",
      "Manufacturing execution system (MES) support",
      "QMS software integration and compliance",
      "Supply chain management system integration",
      "Industrial IoT platform and device management",
      "Predictive maintenance and monitoring",
    ],
    benefits: [
      "Maximize manufacturing uptime and efficiency",
      "Meet FDA and ISO quality standards",
      "Improve supply chain visibility",
      "Secure industrial control systems",
      "Enable data-driven decision making",
    ],
    caseStudy: {
      title: "Medical Device Manufacturer Achieves FDA Compliance",
      description: "A medical device manufacturer implemented validated systems and passed FDA inspection.",
      results: ["FDA 21 CFR Part 11 compliance", "Zero production downtime", "Improved quality metrics"],
    },
  },
  "real-estate": {
    name: "Real Estate",
    description: "Cloud-based solutions for property management, real estate agencies, and development firms",
    hero: "Modern technology that streamlines operations and enhances client experiences",
    challenges: [
      "Property management software reliability",
      "Secure document storage and sharing",
      "Mobile access for agents and property managers",
      "Client communication and collaboration",
      "Integration with MLS and listing platforms",
    ],
    solutions: [
      "Cloud-based property management systems",
      "Secure document management and e-signature",
      "Mobile device management for agents",
      "CRM integration and automation",
      "MLS and listing platform integration",
      "Virtual tour and video conferencing tools",
    ],
    benefits: [
      "Streamline property management operations",
      "Enable agents to work from anywhere",
      "Improve client communication and satisfaction",
      "Reduce paperwork with digital workflows",
      "Scale technology as your portfolio grows",
    ],
    caseStudy: {
      title: "Property Management Company Doubles Portfolio",
      description: "A property management firm scaled operations efficiently with cloud-based systems.",
      results: ["2x property portfolio growth", "50% reduction in admin time", "Improved tenant satisfaction"],
    },
  },
  education: {
    name: "Education",
    description: "Secure learning environments for private schools, training centers, and educational institutions",
    hero: "Reliable technology infrastructure that supports effective teaching and learning",
    challenges: [
      "Student data privacy and FERPA compliance",
      "Reliable internet connectivity and Wi-Fi",
      "Learning management system (LMS) support",
      "Device management for students and staff",
      "Cybersecurity awareness and protection",
    ],
    solutions: [
      "FERPA-compliant data protection and backup",
      "High-performance Wi-Fi and network infrastructure",
      "LMS integration and technical support",
      "Chromebook and iPad management (MDM)",
      "Content filtering and internet safety",
      "Cybersecurity training for staff and students",
    ],
    benefits: [
      "Protect student data and maintain FERPA compliance",
      "Ensure reliable connectivity for digital learning",
      "Support teachers with responsive IT help desk",
      "Manage devices efficiently at scale",
      "Create safe online learning environments",
    ],
    caseStudy: {
      title: "Private School Implements 1:1 Device Program",
      description: "A K-12 private school successfully deployed 500 devices with comprehensive management.",
      results: ["99% device uptime", "FERPA compliance achieved", "Improved learning outcomes"],
    },
  },
  retail: {
    name: "Retail & E-commerce",
    description: "POS systems, inventory management, and secure payment processing for retail businesses",
    hero: "Reliable technology that keeps your business running and customers satisfied",
    challenges: [
      "Point-of-sale (POS) system reliability",
      "Payment security and PCI compliance",
      "Inventory management and integration",
      "E-commerce platform performance",
      "Omnichannel customer experience",
    ],
    solutions: [
      "Modern cloud-based POS systems",
      "PCI-compliant payment processing",
      "Inventory management system integration",
      "E-commerce platform hosting and optimization",
      "Customer data platform (CDP) integration",
      "Network and Wi-Fi for retail locations",
    ],
    benefits: [
      "Eliminate POS downtime and lost sales",
      "Secure payment processing and PCI compliance",
      "Real-time inventory visibility across channels",
      "Fast, reliable e-commerce performance",
      "Deliver seamless omnichannel experiences",
    ],
    caseStudy: {
      title: "Retailer Achieves 99.9% POS Uptime",
      description: "A multi-location retailer eliminated POS downtime and improved customer experience.",
      results: ["Zero POS downtime in 18 months", "PCI compliance maintained", "20% increase in sales"],
    },
  },
}

export default function IndustryDetailPage({ params }: { params: { slug: string } }) {
  const industry = industriesData[params.slug as keyof typeof industriesData]

  if (!industry) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl md:text-6xl text-balance">{industry.name}</h1>
          <p className="mt-6 text-xl text-muted-foreground">{industry.description}</p>
          <p className="mt-4 text-lg text-foreground">{industry.hero}</p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline">
                View Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">Industry Challenges We Solve</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            We understand the unique technology challenges facing {industry.name.toLowerCase()} organizations
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industry.challenges.map((challenge, index) => (
              <Card key={index} className="p-6 border-l-4 border-l-primary">
                <p className="text-foreground">{challenge}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">Our Solutions</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Comprehensive IT services tailored to your industry's specific needs
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {industry.solutions.map((solution, index) => (
              <div key={index} className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-foreground">{solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Key Benefits</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industry.benefits.map((benefit, index) => {
              const icons = [Shield, Zap, Users, TrendingUp, CheckCircle2]
              const Icon = icons[index % icons.length]
              return (
                <Card key={index} className="p-6 text-center">
                  <Icon className="h-10 w-10 text-primary mx-auto mb-4" />
                  <p className="text-foreground font-medium">{benefit}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-background border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">Success Story: {industry.caseStudy.title}</h2>
            <p className="text-muted-foreground mb-6">{industry.caseStudy.description}</p>
            <div className="grid gap-4 sm:grid-cols-3 mb-8">
              {industry.caseStudy.results.map((result, index) => (
                <div key={index} className="text-center p-4 bg-background rounded-lg">
                  <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">{result}</p>
                </div>
              ))}
            </div>
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto">
                Get Similar Results <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your IT Infrastructure?</h2>
          <p className="text-lg mb-8 opacity-90">
            Let's discuss how we can help your {industry.name.toLowerCase()} organization achieve its technology goals
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact">
              <Button size="lg" variant="secondary">
                Schedule Consultation
              </Button>
            </Link>
            <Link href="/services">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Explore All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
