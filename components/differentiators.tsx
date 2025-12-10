import { Card } from "@/components/ui/card"
import { Lightbulb, Target, TrendingUp, Handshake } from "lucide-react"

const differentiators = [
  {
    icon: Lightbulb,
    title: "Industry Specialization",
    description: "Deep expertise in your industry's unique challenges, compliance requirements, and technology needs",
  },
  {
    icon: Target,
    title: "Proactive Security First",
    description: "Advanced cybersecurity as our foundation, not an add-on. Prevent threats before they impact you",
  },
  {
    icon: TrendingUp,
    title: "Transparent Pricing",
    description: "Predictable monthly costs with no hidden fees. You know exactly what you're paying for and why",
  },
  {
    icon: Handshake,
    title: "White-Glove Service",
    description: "Dedicated account managers and direct access to senior engineers, not generic tier-1 support",
  },
]

export default function Differentiators() {
  return (
    <section className="border-y border-border bg-card/50 px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl text-balance">
            Why Choose American Reliable Tech
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            We're not just another MSP. We combine deep industry expertise with personalized service and modern
            technology to deliver better results.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {differentiators.map((diff) => {
            const Icon = diff.icon
            return (
              <Card key={diff.title} className="border border-border bg-background p-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{diff.title}</h3>
                    <p className="text-sm text-muted-foreground">{diff.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
