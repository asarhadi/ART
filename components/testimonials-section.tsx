"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Marcus Sullivan",
    title: "CEO",
    company: "Pacific Legal Group",
    location: "Newport Beach, CA",
    image: "/cartoon-professional-man-avatar.jpg",
    rating: 5,
    text: "American Reliable Tech transformed our law firm's IT infrastructure. Their proactive monitoring caught a potential security breach before it became a problem, saving us from what could have been a devastating data loss. Response time is exceptional.",
  },
  {
    name: "Elena Fitzgerald",
    title: "Operations Manager",
    company: "OC Medical Associates",
    location: "Irvine, CA",
    image: "/cartoon-professional-woman-avatar.jpg",
    rating: 5,
    text: "HIPAA compliance was a constant worry until we partnered with ART. They handle everything from encrypted communications to secure patient data backup. Their team understands healthcare IT regulations inside and out. Couldn't be happier.",
  },
  {
    name: "James Kowalski",
    title: "CFO",
    company: "Coastal Financial Advisors",
    location: "Costa Mesa, CA",
    image: "/cartoon-professional-business-person-avatar.jpg",
    rating: 5,
    text: "We switched to American Reliable Tech after our previous IT company let us down repeatedly. The difference is night and day. Their 24/7 support means we never worry about downtime, and their cloud migration saved us over $3,000 monthly in server costs.",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Trusted by Orange County Businesses</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {
              "Don't just take our word for it. See what our clients have to say about their experience with American Reliable Tech."
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    <p className="text-sm font-medium text-primary">{testimonial.company}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed">{testimonial.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-8 text-sm text-muted-foreground">
            <div>
              <span className="text-3xl font-bold text-foreground">500+</span>
              <p>Active Clients</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <span className="text-3xl font-bold text-foreground">98%</span>
              <p>Client Retention</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <span className="text-3xl font-bold text-foreground">4.9/5</span>
              <p>Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
