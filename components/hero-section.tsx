"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ConsultationDialog } from "@/components/consultation-dialog"
import { useState } from "react"

export default function HeroSection() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-background to-primary/5 px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-2 md:gap-8 items-center">
            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl text-balance">
                  Your Trusted IT Partner for Reliable Technology
                </h1>
                <p className="text-lg text-muted-foreground">
                  Empower Your Business With Seamless IT Solutions. Transform your IT infrastructure from a cost center
                  into a strategic business enabler.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => setDialogOpen(true)}>
                  Schedule Free Assessment
                </Button>
                <Button size="lg" variant="outline">
                  <Link href="/services">Learn About Services</Link>
                </Button>
              </div>

              <div className="flex flex-col gap-2 pt-4 text-sm text-muted-foreground">
                <p>✓ 24/7/365 Proactive Support</p>
                <p>✓ Industry-Specific Expertise</p>
                <p>✓ Transparent, Predictable Pricing</p>
              </div>
            </div>

            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl"></div>
              <div className="absolute inset-4 border-2 border-primary/30 rounded-xl"></div>
              <div className="relative flex items-center justify-center h-full">
                <Image
                  src="/art-logo.png"
                  alt="American Reliable Tech Logo"
                  width={512}
                  height={512}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ConsultationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
