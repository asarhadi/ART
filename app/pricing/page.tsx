"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Sparkles, Gift, Shield, DollarSign, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { GetStartedDialog } from "@/components/get-started-dialog"

const pricingTiers = [
  {
    name: "Essential",
    description: "Perfect for small businesses getting started with managed IT",
    monthlyPrice: 79,
    annualPrice: 63, // 20% off
    perUser: "per user/month",
    features: [
      "24/7 Help Desk Support",
      "Remote Monitoring & Management",
      "Patch Management",
      "Antivirus & Malware Protection",
      "Email Support",
      "Monthly Performance Reports",
      "Basic Network Monitoring",
      "Software Updates",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    description: "Comprehensive IT management for growing businesses",
    monthlyPrice: 149,
    annualPrice: 119, // 20% off
    perUser: "per user/month",
    features: [
      "Everything in Essential, plus:",
      "Priority 24/7 Phone Support",
      "Advanced Cybersecurity",
      "Cloud Backup & Recovery",
      "Network Security Management",
      "Compliance Support (HIPAA, GDPR)",
      "Quarterly Business Reviews",
      "Mobile Device Management",
      "VPN & Remote Access Setup",
      "Email Security & Filtering",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Complete IT infrastructure management for large organizations",
    monthlyPrice: 299,
    annualPrice: 239, // 20% off
    perUser: "per user/month",
    features: [
      "Everything in Professional, plus:",
      "Dedicated Account Manager",
      "Strategic IT Consulting",
      "Advanced Threat Detection & Response",
      "Disaster Recovery Planning",
      "Custom SLA Agreements",
      "On-site Support Available",
      "IT Staff Augmentation",
      "Cloud Migration Services",
      "Advanced Analytics & Reporting",
      "Vendor Management",
      "24/7 Security Operations Center",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number } | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleGetStarted = (planName: string, price: number) => {
    setSelectedPlan({ name: planName, price })
    setDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-[#4A00FF] text-white hover:bg-[#4A00FF]/90">
              <Sparkles className="mr-1 h-3 w-3" />
              New Client Launch Package
            </Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Choose the perfect plan for your business. All plans include our core managed IT services with no hidden
              fees.
            </p>

            <div
              className="mb-8 flex items-center justify-center gap-4"
              style={{ transform: "scale(1.5)", transformOrigin: "center" }}
            >
              <Label
                htmlFor="billing-toggle"
                className={`text-base ${!isAnnual ? "font-bold text-foreground" : "text-muted-foreground"}`}
              >
                Monthly
              </Label>
              <Switch
                id="billing-toggle"
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-[#4A00FF]"
              />
              <Label
                htmlFor="billing-toggle"
                className={`text-base ${isAnnual ? "font-bold text-foreground" : "text-muted-foreground"}`}
              >
                Annually
                <Badge className="ml-2 bg-green-500 text-white hover:bg-green-600">20% OFF</Badge>
              </Label>
            </div>

            <div className="mx-auto max-w-4xl rounded-2xl border-2 border-[#4A00FF] bg-gradient-to-r from-[#4A00FF]/10 to-purple-500/10 p-8 shadow-lg">
              <h2 className="mb-6 text-3xl font-bold text-foreground">New Client Launch Package</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col items-center gap-3 rounded-lg bg-background/50 p-4">
                  <div className="rounded-full bg-[#4A00FF]/10 p-3">
                    <Gift className="h-6 w-6 text-[#4A00FF]" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">FREE IT Assessment</p>
                    <p className="text-sm text-[#4A00FF]">$500 Value</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3 rounded-lg bg-background/50 p-4">
                  <div className="rounded-full bg-[#4A00FF]/10 p-3">
                    <DollarSign className="h-6 w-6 text-[#4A00FF]" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">50% Off First Month</p>
                    <p className="text-sm text-[#4A00FF]">Limited Time Only</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3 rounded-lg bg-background/50 p-4">
                  <div className="rounded-full bg-[#4A00FF]/10 p-3">
                    <Award className="h-6 w-6 text-[#4A00FF]" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">Waived Setup Fees</p>
                    <p className="text-sm text-[#4A00FF]">$750 Value</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3 rounded-lg bg-background/50 p-4">
                  <div className="rounded-full bg-[#4A00FF]/10 p-3">
                    <Shield className="h-6 w-6 text-[#4A00FF]" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">30-Day Money-Back</p>
                    <p className="text-sm text-[#4A00FF]">Guarantee</p>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-center text-sm font-medium text-muted-foreground">
                Total Value: <span className="text-lg font-bold text-[#4A00FF]">$1,250+</span> in savings and benefits
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {pricingTiers.map((tier) => {
              const displayPrice = isAnnual ? tier.annualPrice : tier.monthlyPrice
              const savings = isAnnual ? tier.monthlyPrice - tier.annualPrice : 0

              return (
                <Card
                  key={tier.name}
                  className={`relative flex flex-col ${
                    tier.popular ? "border-2 border-[#4A00FF] shadow-xl" : "border border-border"
                  }`}
                >
                  {tier.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4A00FF] text-white hover:bg-[#4A00FF]/90">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <CardDescription className="text-base">{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-6">
                      <div className="mb-2 flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-foreground">${displayPrice}</span>
                        {isAnnual && savings > 0 && (
                          <span className="text-sm text-green-600 line-through">${tier.monthlyPrice}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {tier.perUser}
                        {isAnnual && <span className="ml-1 text-green-600">(billed annually)</span>}
                      </p>
                      {isAnnual && savings > 0 && (
                        <p className="mt-1 text-sm font-semibold text-green-600">Save ${savings}/user/month</p>
                      )}
                    </div>
                    <ul className="space-y-3">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#4A00FF]" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full ${
                        tier.popular ? "bg-[#4A00FF] hover:bg-[#4A00FF]/90" : "bg-primary hover:bg-primary/90"
                      }`}
                      size="lg"
                      onClick={() => handleGetStarted(tier.name, displayPrice)}
                    >
                      {tier.cta}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold text-foreground">30-Day Guarantee</h3>
              <p className="text-sm text-muted-foreground">Risk-free trial with full money-back guarantee</p>
            </div>
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Flexible Contracts</h3>
              <p className="text-sm text-muted-foreground">Month-to-month options available</p>
            </div>
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold text-foreground">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">Round-the-clock assistance when you need it</p>
            </div>
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Scalable Solutions</h3>
              <p className="text-sm text-muted-foreground">Easily upgrade or downgrade as your needs change</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                What's included in the New Client Launch Package?
              </h3>
              <p className="text-muted-foreground">
                New clients receive a FREE IT Assessment ($500 value), 50% off their first month, waived setup fees
                ($750 value), and a 30-day money-back guarantee. That's over $1,250 in total value!
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                How does the 30-day money-back guarantee work?
              </h3>
              <p className="text-muted-foreground">
                If you're not completely satisfied with our services within the first 30 days, we'll refund your payment
                in full. No questions asked, no hassle.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Can I change plans later?</h3>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next
                billing cycle.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">What's included in the per-user pricing?</h3>
              <p className="text-muted-foreground">
                Per-user pricing covers all devices used by that user (desktop, laptop, mobile) and includes all
                services listed in your chosen tier.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Do you offer custom enterprise plans?</h3>
              <p className="text-muted-foreground">
                Yes! For organizations with unique requirements or over 50 users, we offer custom enterprise solutions.
                Contact our sales team for a personalized quote.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-gradient-to-b from-background to-muted/50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-foreground">Ready to Get Started?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join hundreds of businesses that trust American Reliable Tech for their IT needs
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="bg-[#4A00FF] hover:bg-[#4A00FF]/90" asChild>
              <Link href="/contact">Start Your Free Consultation</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {selectedPlan && (
        <GetStartedDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          planName={selectedPlan.name}
          basePrice={selectedPlan.price}
          billingMode={isAnnual ? "annual" : "monthly"}
        />
      )}
    </div>
  )
}
