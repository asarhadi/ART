"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { sendContactEmail } from "@/app/actions/send-contact-email"

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await sendContactEmail(formData)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        ;(e.target as HTMLFormElement).reset()
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input id="name" name="name" type="text" required placeholder="John Doe" className="mt-2" />
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input id="email" name="email" type="email" required placeholder="john@example.com" className="mt-2" />
      </div>

      <div>
        <Label htmlFor="company">Company</Label>
        <Input id="company" name="company" type="text" placeholder="Your Company Name" className="mt-2" />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" className="mt-2" />
      </div>

      <div>
        <Label htmlFor="subject">Subject *</Label>
        <Input id="subject" name="subject" type="text" required placeholder="How can we help?" className="mt-2" />
      </div>

      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Tell us more about your IT needs..."
          rows={5}
          className="mt-2"
        />
      </div>

      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}
