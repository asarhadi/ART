"use client"

import { Button } from "@/components/ui/button"
import { ConsultationDialog } from "@/components/consultation-dialog"
import { useState } from "react"

export default function CTA() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <section className="border-t border-border bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl text-balance">
            Ready to Transform Your IT?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get a free IT assessment and discover how we can help your business run smoother, more securely, and with
            predictable costs.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => setDialogOpen(true)}>
              Schedule Free Assessment
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            No obligation. Free consultation to understand your IT challenges and goals.
          </p>
        </div>
      </section>

      <ConsultationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
