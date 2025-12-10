import type { Metadata } from "next"
import ContactForm from "@/components/contact-form"
import { MapPin, Mail, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us | American Reliable Tech",
  description:
    "Get in touch with American Reliable Tech. Contact us for IT support, consultations, or any questions about our managed IT services in Irvine, California.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#F1E9F7] to-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">Contact Us</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Have a question or need IT support? We're here to help. Send us a message and we'll respond within 24
              hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Get in Touch</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Our team is ready to assist you with your IT needs. Fill out the form and we'll get back to you
                  shortly.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <a
                      href="mailto:admin@americanreliabletech.com"
                      className="text-muted-foreground hover:text-primary"
                    >
                      admin@americanreliabletech.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Location</h3>
                    <p className="text-muted-foreground">
                      Irvine, California
                      <br />
                      Serving Orange County & Beyond
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Business Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 8:00 AM - 6:00 PM PST
                      <br />
                      24/7 Emergency Support Available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-xl border border-border bg-card p-8 shadow-lg">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
