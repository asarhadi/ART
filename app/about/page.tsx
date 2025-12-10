import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Award, Users, TrendingUp, Shield, Zap, Heart, Globe, CheckCircle2, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <div className="flex justify-center mb-8">
            <Image
              src="/art-logo-full.png"
              alt="American Reliable Tech Logo"
              width={600}
              height={200}
              className="w-full max-w-2xl h-auto"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl md:text-6xl text-balance">
            About American Reliable Tech
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
            Your trusted technology partner, delivering exceptional IT solutions with unwavering commitment to
            excellence since 2025
          </p>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance mb-6">
                Pioneering Excellence in Managed IT Services
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2025, American Reliable Tech emerged with a clear mission: to revolutionize how businesses
                  approach technology management. We understand that in today's digital landscape, reliable IT
                  infrastructure isn't just a convenience—it's a necessity for business success.
                </p>
                <p>
                  Our team of seasoned technology experts brings decades of combined experience, working with businesses
                  across diverse industries to deliver cutting-edge solutions that drive growth, enhance security, and
                  maximize operational efficiency.
                </p>
                <p>
                  What sets us apart is our unwavering commitment to customer satisfaction. We don't just provide IT
                  services—we build lasting partnerships, becoming an extension of your team and a trusted advisor for
                  all your technology needs.
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="border border-border bg-card p-6">
                <Award className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Founded on over 20 years of industry experience
                </h3>
                <p className="text-sm text-muted-foreground">Built on innovation and excellence</p>
              </Card>
              <Card className="border border-border bg-card p-6">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">100+ Clients</h3>
                <p className="text-sm text-muted-foreground">Trusted by businesses nationwide</p>
              </Card>
              <Card className="border border-border bg-card p-6">
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">99.9% Uptime</h3>
                <p className="text-sm text-muted-foreground">Reliable infrastructure guaranteed</p>
              </Card>
              <Card className="border border-border bg-card p-6">
                <Heart className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">98% Satisfaction</h3>
                <p className="text-sm text-muted-foreground">Exceptional customer experience</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-primary/5 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">Our Mission & Values</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Guided by principles that drive excellence in everything we do
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border border-border bg-card p-8">
              <Target className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Our Mission</h3>
              <p className="text-muted-foreground">
                To empower businesses with reliable, innovative technology solutions that drive growth, enhance
                security, and deliver measurable results.
              </p>
            </Card>
            <Card className="border border-border bg-card p-8">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Reliability</h3>
              <p className="text-muted-foreground">
                We deliver consistent, dependable service that you can count on 24/7, ensuring your business never
                misses a beat.
              </p>
            </Card>
            <Card className="border border-border bg-card p-8">
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                We stay ahead of technology trends, bringing you cutting-edge solutions that give your business a
                competitive advantage.
              </p>
            </Card>
            <Card className="border border-border bg-card p-8">
              <Heart className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Customer First</h3>
              <p className="text-muted-foreground">
                Your success is our success. We prioritize your needs, respond quickly, and go above and beyond to
                exceed expectations.
              </p>
            </Card>
            <Card className="border border-border bg-card p-8">
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Expertise</h3>
              <p className="text-muted-foreground">
                Our team brings deep technical knowledge and industry experience to solve your most complex IT
                challenges.
              </p>
            </Card>
            <Card className="border border-border bg-card p-8">
              <Globe className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Partnership</h3>
              <p className="text-muted-foreground">
                We build long-term relationships, becoming a trusted extension of your team and a strategic technology
                advisor.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Industry Expertise */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
              Supporting Industries with Top Technology
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              We bring industry-specific expertise and cutting-edge technology to businesses across diverse sectors
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              "Professional Services",
              "Healthcare",
              "Financial Services",
              "Technology Companies",
              "Manufacturing",
              "Real Estate",
              "Education",
              "Retail",
            ].map((industry) => (
              <Card key={industry} className="border border-border bg-card p-6 hover:border-primary transition-colors">
                <CheckCircle2 className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-foreground">{industry}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-primary/5 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
              Why Choose American Reliable Tech
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Experience the difference of working with a truly customer-focused MSP
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Proven Track Record</h3>
                  <p className="text-muted-foreground">
                    Since our founding in 2025, we've consistently delivered exceptional results, earning the trust of
                    businesses across multiple industries.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Advanced Technology Stack</h3>
                  <p className="text-muted-foreground">
                    We leverage the latest tools, platforms, and methodologies to deliver cutting-edge solutions that
                    keep you ahead of the competition.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Experienced Team</h3>
                  <p className="text-muted-foreground">
                    Our certified professionals bring decades of combined experience in IT management, cybersecurity,
                    cloud services, and more.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">24/7 Support</h3>
                  <p className="text-muted-foreground">
                    Our dedicated support team is available around the clock to address your concerns and resolve issues
                    quickly.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Proactive Approach</h3>
                  <p className="text-muted-foreground">
                    We don't just react to problems—we anticipate them, implementing preventive measures to keep your
                    systems running smoothly.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Transparent Pricing</h3>
                  <p className="text-muted-foreground">
                    No hidden fees or surprises. We provide clear, straightforward pricing so you know exactly what
                    you're getting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Ready to Experience the American Reliable Tech Difference?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join the growing number of businesses that trust us with their technology needs
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/support">Get Started Today</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">Explore Our Services</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
